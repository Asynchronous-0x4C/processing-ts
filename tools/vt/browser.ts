// Runs sketches with processing-ts inside headless Chromium (Playwright) served by a Vite dev server.
import fs from "node:fs";
import path from "node:path";
import { chromium, type Browser, type Page } from "playwright-core";
import { createServer, type ViteDevServer } from "vite";
import type { SketchSource } from "./sketch.ts";
import { playInput, type InputAction } from "./input.ts";
import { compileSketch, formatDiagnostic } from "../../src/compiler/index.ts";
import { sketchModule } from "../../src/compiler/module.ts";

/** How processing-ts runs a sketch: compiled in the page (main thread or worker), or ahead of time (aot). */
export type Exec = "main" | "worker" | "aot";

export type BrowserRunResult = {
  ok: boolean;
  phase: "transpile" | "setup" | "draw" | "capture" | "done" | "harness";
  png?: string;
  width: number;
  height: number;
  logs: string[];
  errors: string[];
  console: string[];
  transpileMs: number;
  /** Per-phase transpiler timings reported by the transpiler (parse/analyze/solve/convert). */
  timings?: Record<string, number>;
  setupMs: number;
  frameMs: number[];
  code?: string;
};

export type BrowserOptions = { projectRoot: string; headed?: boolean; gpu?: boolean; extraFsAllow?: string[] };

/** The sketch compiled ahead of time (as `processing-ts build` / the Vite plugin do). */
function aotModule(sketch: SketchSource): { module: string | null; compileErrors?: string[] } {
  const r = compileSketch(sketch.files.map((f) => ({ name: f.name, text: f.content })));
  const errors = r.diagnostics.filter((d) => d.severity === "error").map((d) => formatDiagnostic(r.parse.source, d));
  if (errors.length) return { module: null, compileErrors: errors };
  return { module: sketchModule(r, { name: sketch.main.replace(/\.pde$/, "") }).code };
}

export class BrowserRunner {
  private server: ViteDevServer | null = null;
  private browser: Browser | null = null;
  private baseUrl = "";
  private opts: BrowserOptions;

  constructor(opts: BrowserOptions) {
    this.opts = opts;
  }

  async start() {
    const root = this.opts.projectRoot;
    this.server = await createServer({
      configFile: false,
      root,
      logLevel: "error",
      clearScreen: false,
      // Service-Worker-Allowed: the offline runs register the worker for the whole origin, so that the sketch's
      // Web Worker (thread "worker", its script under /src/) is served from the cache too.
      server: { host: "127.0.0.1", port: 5199, strictPort: false, fs: { allow: [root, ...(this.opts.extraFsAllow ?? [])] }, headers: { "Service-Worker-Allowed": "/" } },
      // Pre-bundle up front so Vite does not reload the page mid-run when it discovers deps.
      optimizeDeps: { entries: ["tools/vt/harness/index.html"], include: ["@lezer/common", "@lezer/lr"] },
    });
    await this.server.listen();
    this.baseUrl = (this.server.resolvedUrls?.local[0] ?? "http://127.0.0.1:5199/").replace(/\/$/, "");
    // SwiftShader (software GL) by default: slower, but identical output on every machine.
    const args = this.opts.gpu ? [] : ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"];
    try {
      this.browser = await chromium.launch({ headless: !this.opts.headed, args });
    } catch (e) {
      throw new Error(
        `Could not launch Chromium (${(e as Error).message.split("\n")[0]}).\n` +
          `Install the matching browser with: npx playwright-core install chromium`,
      );
    }
  }

  async stop() {
    await this.browser?.close();
    await this.server?.close();
  }

  /** Transpile a sketch `repeat` times in a fresh page (first run = cold). */
  async transpileTimes(sketch: SketchSource, repeat: number): Promise<{ total: number; timings?: Record<string, number>; error?: string }[]> {
    const page = await this.browser!.newPage();
    try {
      await page.goto(`${this.baseUrl}/tools/vt/harness/index.html`, { waitUntil: "load" });
      await page.waitForFunction(() => (window as any).__vt__ !== undefined);
      return await page.evaluate(([o, n]) => (window as any).__vt__.transpile(o, n), [{ main: sketch.main, files: sketch.files }, repeat] as const);
    } finally {
      await page.close();
    }
  }

  /** The first compile in a fresh page after SketchManager.warmUp(). */
  async transpileWarmedUpTime(sketch: SketchSource): Promise<number> {
    const page = await this.browser!.newPage();
    try {
      await page.goto(`${this.baseUrl}/tools/vt/harness/index.html`, { waitUntil: "load" });
      await page.waitForFunction(() => (window as any).__vt__ !== undefined);
      return (await page.evaluate((o) => (window as any).__vt__.transpileWarmedUp(o), { main: sketch.main, files: sketch.files })).ms;
    } finally {
      await page.close();
    }
  }

  /**
   * The compile cache across visits: a fresh page compiles the sketch (miss, stored in IndexedDB), then
   * another fresh page of the same origin gets it from IndexedDB. Returns both times.
   */
  async transpileCacheTimes(sketch: SketchSource): Promise<{ missMs: number; hitMs: number; hit: boolean }> {
    const context = await this.browser!.newContext();
    try {
      const visit = async (clear: boolean) => {
        const page = await context.newPage();
        try {
          await page.goto(`${this.baseUrl}/tools/vt/harness/index.html`, { waitUntil: "load" });
          await page.waitForFunction(() => (window as any).__vt__ !== undefined);
          return (await page.evaluate(([o, c]) => (window as any).__vt__.transpileCached(o, "vt-bench-cache", c), [{ main: sketch.main, files: sketch.files }, clear] as const)) as { ms: number; hit: boolean };
        } finally {
          await page.close();
        }
      };
      const miss = await visit(true);
      const hit = await visit(false);
      return { missMs: miss.ms, hitMs: hit.ms, hit: hit.hit && !miss.hit };
    } finally {
      await context.close();
    }
  }

  /**
   * Run one sketch in a fresh page. `frames` = number of draw() calls before capture; `input` is
   * replayed with real mouse/keyboard input between frames (input.ts). With `offline`, the page runs the
   * sketch once online under a caching Service Worker (harness/sw.js), goes offline, reloads and runs it
   * again: the result is the offline run's (the sketch's files must come from the cache).
   */
  async run(sketch: SketchSource, frames: number, timeoutMs = 30_000, input?: InputAction[], offline = false, exec: Exec = "main"): Promise<BrowserRunResult> {
    const context = await this.browser!.newContext({ viewport: { width: 1280, height: 1024 }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    const consoleLines: string[] = [];
    page.on("console", (m) => consoleLines.push(`[${m.type()}] ${m.text()}`));
    page.on("pageerror", (e) => consoleLines.push(`[pageerror] ${e.message}`));
    const empty: BrowserRunResult = {
      ok: false, phase: "harness", width: 0, height: 0, logs: [], errors: [], console: consoleLines,
      transpileMs: 0, setupMs: 0, frameMs: [],
    };
    const harness = `${this.baseUrl}/tools/vt/harness/index.html`;
    const ready = () => page.waitForFunction(() => (window as any).__vt__ !== undefined, null, { timeout: timeoutMs });
    try {
      await page.goto(harness, { waitUntil: "load" });
      await ready();
      // The sketch folder as the base URL, and its data/ files listed (as a host would).
      const sketchBase = `/@fs/${path.resolve(sketch.dir).replace(/\\/g, "/").replace(/^\//, "")}/`;
      const dataDir = path.join(sketch.dir, "data");
      const dataFiles = fs.existsSync(dataDir)
        ? fs.readdirSync(dataDir, { recursive: true }).map(String).filter((f) => fs.statSync(path.join(dataDir, f)).isFile()).map((f) => "data/" + f.replace(/\\/g, "/"))
        : [];
      const opts = { main: sketch.main, files: sketch.files, sketchBase, dataFiles, frames, exec, ...(exec === "aot" ? aotModule(sketch) : {}) };
      const once = () => {
        const work = input?.length ? this.runWithInput(page, opts, input) : page.evaluate((o) => (window as any).__vt__.run(o), opts);
        return Promise.race([
          work,
          new Promise((_, reject) => setTimeout(() => reject(new Error(`timed out after ${timeoutMs}ms`)), timeoutMs)),
        ]) as Promise<Omit<BrowserRunResult, "console">>;
      };
      if (offline) {
        await page.evaluate(async () => {
          await navigator.serviceWorker.register("./sw.js", { scope: "/" });
          await navigator.serviceWorker.ready;
        });
        // Reload under the worker so that the page's own modules are cached too, then fill the cache.
        await page.reload({ waitUntil: "load" });
        await ready();
        if (!(await page.evaluate(() => navigator.serviceWorker.controller !== null))) throw new Error("the Service Worker does not control the page");
        await once();
        await context.setOffline(true);
        await page.reload({ waitUntil: "load" });
        await ready();
      }
      const result = await once();
      return { ...result, console: consoleLines };
    } catch (e) {
      return { ...empty, errors: [String((e as Error).message ?? e)] };
    } finally {
      await context.close();
    }
  }

  private async runWithInput(page: Page, opts: { frames: number }, input: InputAction[]) {
    const failed = await page.evaluate((o) => (window as any).__vt__.start(o), opts);
    if (failed) return failed;
    const rect = await page.evaluate(() => (window as any).__vt__.canvasRect());
    for (let i = 0; i < opts.frames; i++) {
      await playInput(page, input, i, rect);
      const r = await page.evaluate(() => (window as any).__vt__.step());
      if (r) return r;
    }
    return page.evaluate(() => (window as any).__vt__.finish());
  }
}
