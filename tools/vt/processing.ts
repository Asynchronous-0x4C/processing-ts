// Reference rendering with the real (Java) Processing via its command line edition.
import { spawn, execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { DONE_MARKER, detectMode, injectForReference, type SketchSource } from "./sketch.ts";
import type { InputAction } from "./input.ts";

export type ReferenceResult = {
  ok: boolean;
  png?: string;
  stdout: string[];
  /** Processing's own diagnostics (compiler errors, warnings). */
  messages: string[];
  durationMs: number;
  error?: string;
};

const DEFAULT_PATHS: Record<string, string[]> = {
  win32: ["C:/Program Files/Processing/Processing.exe"],
  darwin: ["/Applications/Processing.app/Contents/MacOS/Processing"],
  linux: ["/usr/bin/processing", "/opt/processing/bin/Processing", "/usr/local/bin/processing"],
};

/** Locate the Processing launcher: --processing flag, $PROCESSING_PATH, then platform defaults. */
export function findProcessing(explicit?: string): string | null {
  const candidates = [explicit, process.env.PROCESSING_PATH, ...(DEFAULT_PATHS[process.platform] ?? [])].filter(
    (p): p is string => !!p,
  );
  return candidates.find((p) => fs.existsSync(p)) ?? null;
}

// Lines printed by Processing itself rather than by the sketch.
const PROCESSING_NOISE = [
  /^Warning: Processing now sets pixelDensity/,
  /^The sketch has been resized from/,
  /^This happened outside Processing/,
  /^Finished\.$/,
];

/**
 * Run the sketch in Java Processing, save the frame after `frames` draw() calls, and collect stdout.
 * A sketch window briefly appears on screen while this runs.
 */
export async function renderReference(
  sketch: SketchSource,
  opts: { processing: string; frames: number; outPng: string; timeoutMs?: number; mode?: "static" | "active"; input?: InputAction[] },
): Promise<ReferenceResult> {
  const started = Date.now();
  const mainName = sketch.main.replace(/\.pde$/, "");
  const work = fs.mkdtempSync(path.join(os.tmpdir(), "vt-ref-"));
  const sketchDir = path.join(work, mainName);
  fs.mkdirSync(sketchDir);
  const mode = opts.mode ?? detectMode(sketch.files);
  const tmpPng = path.join(work, "frame.png");
  const tmpStdout = path.join(work, "stdout.txt");
  for (const f of sketch.files) {
    const content = f.name === sketch.main ? injectForReference(f.content, mode, opts.frames, tmpPng, tmpStdout, opts.input) : f.content;
    fs.writeFileSync(path.join(sketchDir, f.name), content);
  }
  const dataDir = path.join(sketch.dir, "data");
  if (fs.existsSync(dataDir)) fs.cpSync(dataDir, path.join(sketchDir, "data"), { recursive: true });

  const args = ["cli", `--sketch=${sketchDir}`, `--output=${path.join(work, "build")}`, "--force", "--run"];
  const { output, timedOut } = await runWithTimeout(opts.processing, args, opts.timeoutMs ?? 90_000);
  const lines = output.split(/\r?\n/).filter((l) => l.length > 0);
  // The sketch's System.out went to tmpStdout in UTF-8; the console has Processing's own messages.
  const outLines = fs.existsSync(tmpStdout) ? fs.readFileSync(tmpStdout, "utf8").split(/\r?\n/).filter((l) => l.length > 0) : lines;
  const doneAt = outLines.indexOf(DONE_MARKER);
  const body = doneAt === -1 ? outLines : outLines.slice(0, doneAt);
  const messages = [...lines, ...body].filter((l) => PROCESSING_NOISE.some((re) => re.test(l)));
  const stdout = body.filter((l) => !PROCESSING_NOISE.some((re) => re.test(l)));
  const result: ReferenceResult = { ok: false, stdout, messages, durationMs: Date.now() - started };

  if (fs.existsSync(tmpPng)) {
    fs.mkdirSync(path.dirname(opts.outPng), { recursive: true });
    fs.copyFileSync(tmpPng, opts.outPng);
    result.ok = true;
    result.png = opts.outPng;
  } else {
    result.error = timedOut ? `Processing timed out after ${opts.timeoutMs ?? 90_000}ms` : "Processing did not produce a frame";
    result.messages = lines; // compiler errors etc.
    result.stdout = [];
  }
  fs.rmSync(work, { recursive: true, force: true });
  return result;
}

function runWithTimeout(cmd: string, args: string[], timeoutMs: number): Promise<{ output: string; timedOut: boolean }> {
  return new Promise((resolve) => {
    // detached on POSIX so the whole process group (launcher + sketch JVM) can be killed on timeout
    const child = spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"], detached: process.platform !== "win32" });
    let output = "";
    let timedOut = false;
    child.stdout.on("data", (d) => (output += d.toString()));
    child.stderr.on("data", (d) => (output += d.toString()));
    const timer = setTimeout(() => {
      timedOut = true;
      killTree(child.pid);
    }, timeoutMs);
    child.on("close", () => {
      clearTimeout(timer);
      resolve({ output, timedOut });
    });
  });
}

function killTree(pid: number | undefined) {
  if (pid === undefined) return;
  try {
    if (process.platform === "win32") execFileSync("taskkill", ["/PID", String(pid), "/T", "/F"], { stdio: "ignore" });
    else process.kill(-pid, "SIGKILL");
  } catch {
    // already gone
  }
}
