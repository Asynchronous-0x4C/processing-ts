// Browser side of the visual test runner. tools/vt/browser.ts calls window.__vt__.run().
import { CompileCache, SketchManager, SketchPlayer, type PrecompiledSketch } from "../../../src/lib/index.ts";

type RunOptions = {
  main: string;
  files: { name: string; content: string }[];
  /** URL of the sketch folder (loadImage("a.png") reads sketchBase + "data/a.png"). */
  sketchBase: string;
  /** The files of data/, relative to the sketch folder ("data/a.png"). */
  dataFiles: string[];
  frames: number;
  /** How the sketch runs: compiled in the page on the main thread (default), in a worker, or compiled ahead of time. */
  exec?: "main" | "worker" | "aot";
  /** exec "aot": the sketch's ES module (src/compiler/module.ts), or null with `compileErrors`. */
  module?: string | null;
  compileErrors?: string[];
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
  readonly manager: SketchManager | SketchPlayer;

  readonly exec: RunOptions["exec"];

  constructor(sketchBase: string, exec: RunOptions["exec"] = "main") {
    this.exec = exec;
    const settings = { frameRate: 60, thread: exec === "worker" ? "worker" : "main", keep_aspect_ratio: false, manual_step: true } as const;
    // Sketches compiled ahead of time need only the runtime (SketchPlayer, no compiler, no new Function).
    this.manager = exec === "aot" ? new SketchPlayer(settings) : new SketchManager(settings);
    document.body.appendChild(this.canvas);
    this.manager.mountPApplet(this.canvas);
    this.manager.addEventListener("log", (args) => this.logs.push(format(args)));
    this.manager.addEventListener("error", (e) => this.errors.push(`[${this.phase}] ${format(e)}`));
    this.manager.base_uri = new URL(sketchBase, location.href).href;
  }

  /** Transpile and run setup(). False when the sketch did not compile. */
  async start(opts: RunOptions): Promise<boolean> {
    if (opts.exec === "aot") return this.startModule(opts);
    const t0 = performance.now();
    const transpiled = (this.manager as SketchManager).transpileSketch({ main: opts.main, content: opts.files, files: opts.dataFiles });
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

  /** Run a precompiled module: imported from a blob URL, run by SketchPlayer. */
  private async startModule(opts: RunOptions): Promise<boolean> {
    if (!opts.module) {
      for (const e of opts.compileErrors ?? ["no module"]) this.errors.push(`[transpile] ${e}`);
      return false;
    }
    this.code = opts.module;
    const url = URL.createObjectURL(new Blob([opts.module], { type: "text/javascript" }));
    const t0 = performance.now();
    const sketch = (await import(/* @vite-ignore */ url)).default as PrecompiledSketch;
    this.transpileMs = performance.now() - t0;
    this.phase = "setup";
    const t1 = performance.now();
    await this.manager.run({ ...sketch, listed: opts.dataFiles });
    this.setupMs = performance.now() - t1;
    this.phase = "draw";
    return true;
  }

  async step() {
    const t = performance.now();
    await this.manager.step(1);
    this.frameMs.push(performance.now() - t);
  }

  /** The canvas as a PNG data URL (from the worker in the worker mode: the page cannot read that canvas). */
  private async png(): Promise<{ url: string; width: number; height: number } | undefined> {
    if (this.exec !== "worker") {
      const c = this.manager.target_element!;
      return { url: c.toDataURL("image/png"), width: c.width, height: c.height };
    }
    const blob = await this.manager.capture("image/png");
    if (!blob) return undefined;
    const bmp = await createImageBitmap(blob);
    const url = await new Promise<string>((resolve) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result as string);
      r.readAsDataURL(blob);
    });
    return { url, width: bmp.width, height: bmp.height };
  }

  async result(ok: boolean): Promise<Result> {
    await this.manager.flushOutput();
    let shot: Awaited<ReturnType<Session["png"]>>;
    if (ok) {
      this.phase = "capture";
      shot = await this.png();
      this.phase = "done";
    } else {
      try {
        shot = await this.png();
      } catch {
        // canvas unusable
      }
    }
    const { phase, logs, errors, transpileMs, timings, setupMs, frameMs, code } = this;
    return { ok: ok && errors.length === 0, phase, png: shot?.url, width: shot?.width ?? 0, height: shot?.height ?? 0, logs, errors, transpileMs, timings, setupMs, frameMs, code };
  }

  fail(e: unknown): Promise<Result> {
    this.errors.push(`[${this.phase}] ${e instanceof Error ? e.stack ?? e.message : String(e)}`);
    return this.result(false);
  }
}

let session: Session | null = null;

/** Run a sketch: setup, then `frames` draw() calls, then capture the canvas. */
async function run(opts: RunOptions): Promise<Result> {
  const s = new Session(opts.sketchBase, opts.exec);
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
  session = new Session(opts.sketchBase, opts.exec);
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

function finish(): Promise<Result> {
  return session!.result(true);
}

/** Where the sketch canvas is on the page (for mouse input). */
function canvasRect() {
  const r = session!.manager.target_element!.getBoundingClientRect();
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

/**
 * Compile through a CompileCache in IndexedDB (database `db`): the time of transpileSketchCached() and
 * whether the result came from the cache (its compile was not run). Used by tools/bench (transpile).
 */
async function transpileCached(opts: { main: string; files: { name: string; content: string }[] }, db: string, clear: boolean) {
  const cache = new CompileCache({ name: db });
  if (clear) await cache.clear();
  const manager = new SketchManager({ manual_step: true, cache });
  const data = { main: opts.main, content: opts.files };
  const hit = (await cache.get(cache.key(data))) !== undefined;
  const fresh = new SketchManager({ manual_step: true, cache: new CompileCache({ name: db }) });
  const t = performance.now();
  const r = await fresh.transpileSketchCached(data);
  const ms = performance.now() - t;
  // Let the background write finish before the page goes away.
  await new Promise((resolve) => setTimeout(resolve, 50));
  void manager;
  return { ms, hit, ok: !r.error?.error };
}

const api = { run, transpile, transpileCached, start, step, finish, canvasRect };
(window as unknown as { __vt__: typeof api }).__vt__ = api;
