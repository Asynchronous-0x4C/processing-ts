// Browser side of the visual test runner. tools/vt/browser.ts calls window.__vt__.run().
import { SketchManager } from "../../../src/lib/index.ts";

type RunOptions = {
  main: string;
  files: { name: string; content: string }[];
  /** URL of the sketch's data/ folder (loadImage("a.png") resolves to dataBase + "a.png"). */
  dataBase: string;
  frames: number;
};

type Phase = "transpile" | "setup" | "draw" | "capture" | "done";

function format(arg: unknown): string {
  if (typeof arg === "string") return arg;
  if (Array.isArray(arg)) return arg.map(format).join(" ");
  return String(arg);
}

async function run(opts: RunOptions) {
  const logs: string[] = [];
  const errors: string[] = [];
  const frameMs: number[] = [];
  let phase: Phase = "transpile";
  let transpileMs = 0;
  let setupMs = 0;
  let code: string | undefined;
  let timings: Record<string, number> | undefined;

  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  const manager = new SketchManager({ frameRate: 60, thread: "main", keep_aspect_ratio: false, manual_step: true });
  manager.mountPApplet(canvas);
  manager.addEventListener("log", (args) => logs.push(format(args)));
  manager.addEventListener("error", (e) => errors.push(`[${phase}] ${format(e)}`));
  manager.base_uri = new URL(opts.dataBase, location.href).href;

  try {
    const t0 = performance.now();
    const transpiled = manager.transpileSketch({ main: opts.main, content: opts.files });
    transpileMs = performance.now() - t0;
    code = transpiled.result;
    timings = transpiled.timings;
    if (transpiled.error?.error) {
      return { ok: false, phase, width: 0, height: 0, logs, errors, transpileMs, timings, setupMs, frameMs, code };
    }
    phase = "setup";
    const t1 = performance.now();
    await manager.runTranspiledSketch(transpiled);
    setupMs = performance.now() - t1;
    phase = "draw";
    for (let i = 0; i < opts.frames; i++) {
      const t = performance.now();
      await manager.step(1);
      frameMs.push(performance.now() - t);
    }
    manager.flushOutput();
    phase = "capture";
    const png = canvas.toDataURL("image/png");
    phase = "done";
    return { ok: errors.length === 0, phase, png, width: canvas.width, height: canvas.height, logs, errors, transpileMs, timings, setupMs, frameMs, code };
  } catch (e) {
    manager.flushOutput();
    errors.push(`[${phase}] ${e instanceof Error ? e.stack ?? e.message : String(e)}`);
    let png: string | undefined;
    try {
      png = canvas.toDataURL("image/png");
    } catch {
      // canvas unusable
    }
    return { ok: false, phase, png, width: canvas.width, height: canvas.height, logs, errors, transpileMs, timings, setupMs, frameMs, code };
  }
}

/**
 * Transpile only, `repeat` times in this page (the first run is cold). Used by tools/bench.
 * Returns the total and per-phase milliseconds of every run.
 */
function transpile(opts: { main: string; files: { name: string; content: string }[] }, repeat: number) {
  const manager = new SketchManager({ manual_step: true });
  const runs: { total: number; timings?: Record<string, number>; error?: string }[] = [];
  for (let i = 0; i < repeat; i++) {
    const t = performance.now();
    try {
      const r = manager.transpileSketch({ main: opts.main, content: opts.files });
      runs.push({ total: performance.now() - t, timings: r.timings, error: r.error?.error ? r.error.getErrorMessage() : undefined });
    } catch (e) {
      runs.push({ total: performance.now() - t, error: String(e) });
      break;
    }
  }
  return runs;
}

(window as unknown as { __vt__: { run: typeof run; transpile: typeof transpile } }).__vt__ = { run, transpile };
