// Browser side of the visual test runner. tools/vt/browser.ts calls window.__vt__.run().
import { SketchManager } from "../../../src/lib/index.ts";

type RunOptions = {
  main: string;
  files: { name: string; content: string }[];
  /** URL of the sketch folder (loadImage("a.png") reads sketchBase + "data/a.png"). */
  sketchBase: string;
  /** The files of data/, relative to the sketch folder ("data/a.png"). */
  dataFiles: string[];
  frames: number;
};

type Phase = "transpile" | "setup" | "draw" | "capture" | "done";

function format(arg: unknown): string {
  if (typeof arg === "string") return arg;
  if (Array.isArray(arg)) return arg.map(format).join(" ");
  return String(arg);
}

type Result = {
  ok: boolean; phase: Phase; png?: string; width: number; height: number; logs: string[]; errors: string[];
  transpileMs: number; timings?: Record<string, number>; setupMs: number; frameMs: number[]; code?: string;
};

/** A sketch being run frame by frame (start → step… → finish), so tools/vt can send input between frames. */
class Session {
  logs: string[] = [];
  errors: string[] = [];
  frameMs: number[] = [];
  phase: Phase = "transpile";
  transpileMs = 0;
  setupMs = 0;
  code: string | undefined;
  timings: Record<string, number> | undefined;
  readonly canvas = document.createElement("canvas");
  readonly manager = new SketchManager({ frameRate: 60, thread: "main", keep_aspect_ratio: false, manual_step: true });

  constructor(sketchBase: string) {
    document.body.appendChild(this.canvas);
    this.manager.mountPApplet(this.canvas);
    this.manager.addEventListener("log", (args) => this.logs.push(format(args)));
    this.manager.addEventListener("error", (e) => this.errors.push(`[${this.phase}] ${format(e)}`));
    this.manager.base_uri = new URL(sketchBase, location.href).href;
  }

  /** Transpile and run setup(). False when the sketch did not compile. */
  async start(opts: RunOptions): Promise<boolean> {
    const t0 = performance.now();
    const transpiled = this.manager.transpileSketch({ main: opts.main, content: opts.files, files: opts.dataFiles });
    this.transpileMs = performance.now() - t0;
    this.code = transpiled.result;
    this.timings = transpiled.timings;
    if (transpiled.error?.error) return false;
    this.phase = "setup";
    const t1 = performance.now();
    await this.manager.runTranspiledSketch(transpiled);
    this.setupMs = performance.now() - t1;
    this.phase = "draw";
    return true;
  }

  async step() {
    const t = performance.now();
    await this.manager.step(1);
    this.frameMs.push(performance.now() - t);
  }

  result(ok: boolean): Result {
    this.manager.flushOutput();
    let png: string | undefined;
    if (ok) {
      this.phase = "capture";
      png = this.canvas.toDataURL("image/png");
      this.phase = "done";
    } else {
      try {
        png = this.canvas.toDataURL("image/png");
      } catch {
        // canvas unusable
      }
    }
    const { phase, logs, errors, transpileMs, timings, setupMs, frameMs, code, canvas } = this;
    return { ok: ok && errors.length === 0, phase, png, width: png ? canvas.width : 0, height: png ? canvas.height : 0, logs, errors, transpileMs, timings, setupMs, frameMs, code };
  }

  fail(e: unknown): Result {
    this.errors.push(`[${this.phase}] ${e instanceof Error ? e.stack ?? e.message : String(e)}`);
    return this.result(false);
  }
}

let session: Session | null = null;

/** Run a sketch: setup, then `frames` draw() calls, then capture the canvas. */
async function run(opts: RunOptions): Promise<Result> {
  const s = new Session(opts.sketchBase);
  try {
    if (!(await s.start(opts))) return s.result(false);
    for (let i = 0; i < opts.frames; i++) await s.step();
    return s.result(true);
  } catch (e) {
    return s.fail(e);
  }
}

/** Step-by-step variant of run(): start(), then step() per frame, then finish(). */
async function start(opts: RunOptions): Promise<Result | null> {
  session = new Session(opts.sketchBase);
  try {
    return (await session.start(opts)) ? null : session.result(false);
  } catch (e) {
    return session.fail(e);
  }
}

async function step(): Promise<Result | null> {
  try {
    await session!.step();
    return null;
  } catch (e) {
    return session!.fail(e);
  }
}

function finish(): Result {
  return session!.result(true);
}

/** Where the sketch canvas is on the page (for mouse input). */
function canvasRect() {
  const r = session!.canvas.getBoundingClientRect();
  return { x: r.left, y: r.top, width: r.width, height: r.height };
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

const api = { run, transpile, start, step, finish, canvasRect };
(window as unknown as { __vt__: typeof api }).__vt__ = api;
