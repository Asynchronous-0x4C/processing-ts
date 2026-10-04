// Runs sketches with processing-ts inside headless Chromium (Playwright) served by a Vite dev server.
import path from "node:path";
import { chromium, type Browser } from "playwright-core";
import { createServer, type ViteDevServer } from "vite";
import type { SketchSource } from "./sketch.ts";

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
      server: { host: "127.0.0.1", port: 5199, strictPort: false, fs: { allow: [root, ...(this.opts.extraFsAllow ?? [])] } },
      // Pre-bundle up front so Vite does not reload the page mid-run when it discovers deps.
      optimizeDeps: { entries: ["tools/vt/harness/index.html"], include: ["pixi.js", "antlr4"] },
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

  /** Run one sketch in a fresh page. `frames` = number of draw() calls before capture. */
  async run(sketch: SketchSource, frames: number, timeoutMs = 30_000): Promise<BrowserRunResult> {
    const page = await this.browser!.newPage({ viewport: { width: 1280, height: 1024 }, deviceScaleFactor: 1 });
    const consoleLines: string[] = [];
    page.on("console", (m) => consoleLines.push(`[${m.type()}] ${m.text()}`));
    page.on("pageerror", (e) => consoleLines.push(`[pageerror] ${e.message}`));
    const empty: BrowserRunResult = {
      ok: false, phase: "harness", width: 0, height: 0, logs: [], errors: [], console: consoleLines,
      transpileMs: 0, setupMs: 0, frameMs: [],
    };
    try {
      await page.goto(`${this.baseUrl}/tools/vt/harness/index.html`, { waitUntil: "load" });
      await page.waitForFunction(() => (window as any).__vt__ !== undefined, null, { timeout: timeoutMs });
      const dataBase = `/@fs/${path.resolve(sketch.dir, "data").replace(/\\/g, "/").replace(/^\//, "")}/`;
      const result = (await Promise.race([
        page.evaluate((o) => (window as any).__vt__.run(o), { main: sketch.main, files: sketch.files, dataBase, frames }),
        new Promise((_, reject) => setTimeout(() => reject(new Error(`timed out after ${timeoutMs}ms`)), timeoutMs)),
      ])) as Omit<BrowserRunResult, "console">;
      return { ...result, console: consoleLines };
    } catch (e) {
      return { ...empty, errors: [String((e as Error).message ?? e)] };
    } finally {
      await page.close();
    }
  }
}
