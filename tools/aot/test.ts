#!/usr/bin/env node
// End-to-end checks of the ahead-of-time paths (ROADMAP P4-1), in headless Chromium against Processing's
// references (tests/visual/refs):
//   cli      `processing-ts build` output (index.html + sketch.js + the standalone runtime), served statically
//   offline  the same with --sw, reloaded offline (everything from the Service Worker's cache)
//   vite     an app importing the cases as `?pde` modules, built by Vite with the plugin, served statically
//   dev      the same app on Vite's dev server
//   cli-worker  `processing-ts build --worker` (the precompiled sketch runs in a Web Worker)
//   package  an app with the built package installed (dist/), bundled by Vite: SketchManager on the main
//            thread and in a worker, and `?pde` modules with the package's plugin (package-dev: dev server)
//   worker   thread "worker" on Vite's dev server: stopSketch() ends an endless loop, the next run gets a new
//            canvas, cursor()/surface.setTitle() reach the page
// Usage: node tools/aot/test.ts [cli|offline|vite|dev ...] [--headed] [--keep]
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { parseArgs } from "node:util";
import { chromium, type Browser, type Page } from "playwright-core";
import { build as viteBuild, createServer } from "vite";
import { buildSketch } from "../../src/aot/build.ts";
import processing from "../../src/aot/vite.ts";
import { readSketchFolder } from "../../src/aot/sketchFolder.ts";
import { compare, composite, pngFromDataUrl, readPng } from "../vt/image.ts";

const ROOT = path.resolve(import.meta.dirname, "../..");
const CASES_DIR = path.join(ROOT, "tests/visual/cases");
const REFS_DIR = path.join(ROOT, "tests/visual/refs");
const OUT_DIR = path.join(ROOT, "tests/aot/out");

/** Cases whose frame does not depend on timing (static mode, noLoop(), or the same frame every time). */
const CASES = ["hex_colors", "files_load", "text_metrics", "shape_svg", "p3d_box", "p3d_shape_obj", "static_mode"];

const { values: flags, positionals } = parseArgs({
  allowPositionals: true,
  options: { headed: { type: "boolean", default: false }, keep: { type: "boolean", default: false } },
});
const MODES = positionals.length ? positionals : ["cli", "offline", "vite", "dev", "cli-worker", "worker", "package", "package-dev"];

type Check = { mode: string; name: string; ok: boolean; reasons: string[]; diff: number | null };

/** A static file server for a folder. */
function serve(dir: string): Promise<{ url: string; close: () => Promise<void> }> {
  const types: Record<string, string> = {
    ".html": "text/html", ".js": "text/javascript", ".json": "application/json", ".map": "application/json", ".css": "text/css",
    ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".ttf": "font/ttf", ".txt": "text/plain", ".obj": "text/plain", ".mtl": "text/plain",
  };
  const server = http.createServer((req, res) => {
    const url = new URL(req.url ?? "/", "http://x");
    let p = path.join(dir, decodeURIComponent(url.pathname));
    if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, "index.html");
    if (!p.startsWith(dir) || !fs.existsSync(p)) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, { "content-type": types[path.extname(p)] ?? "application/octet-stream", "cache-control": "no-store" });
    res.end(fs.readFileSync(p));
  });
  return new Promise((resolve) =>
    server.listen(0, "127.0.0.1", () => {
      const port = (server.address() as { port: number }).port;
      resolve({ url: `http://127.0.0.1:${port}`, close: () => new Promise((r) => server.close(() => r())) });
    }),
  );
}

function caseConfig(name: string): { threshold: number; maxDiffRatio: number; stdout: boolean } {
  const p = path.join(CASES_DIR, name, "vt.json");
  const c = fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : {};
  return { threshold: c.threshold ?? 0.1, maxDiffRatio: c.maxDiffRatio ?? 0.01, stdout: c.stdout !== false };
}

/** Open a page that runs a sketch, wait for it to settle, and compare its canvas and console with the reference. */
async function check(browser: Browser, mode: string, name: string, url: string, before?: (page: Page) => Promise<void>, screenshot = false): Promise<Check> {
  const context = await browser.newContext({ viewport: { width: 1280, height: 1024 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  const logs: string[] = [];
  const errors: string[] = [];
  page.on("console", (m) => (m.type() === "error" ? errors : m.type() === "log" ? logs : []).push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));
  // Only the last load counts (the offline check loads the page twice).
  page.on("framenavigated", (f) => {
    if (f === page.mainFrame()) logs.length = errors.length = 0;
  });
  const reasons: string[] = [];
  let diff: number | null = null;
  try {
    if (before) await before(page);
    else await page.goto(url, { waitUntil: "load" });
    // size() resizes the canvas; then let setup() and a few frames run.
    await page.waitForFunction(() => {
      const c = document.querySelector("canvas");
      return c !== null && c.width !== 300 && c.width > 0;
    }, null, { timeout: 20_000 });
    await page.waitForTimeout(1500);
    const png = screenshot
      ? pngFromDataUrl("data:image/png;base64," + (await page.locator("canvas").screenshot()).toString("base64"))
      : pngFromDataUrl(await page.evaluate(() => document.querySelector("canvas")!.toDataURL("image/png")));
    const cfg = caseConfig(name);
    const ref = readPng(path.join(REFS_DIR, `${name}.png`));
    const out = path.join(OUT_DIR, mode, name);
    fs.mkdirSync(out, { recursive: true });
    const r = compare(ref, png, cfg.threshold, path.join(out, "diff.png"));
    composite([ref, png, readPng(path.join(out, "diff.png"))], path.join(out, "composite.png"));
    diff = r.diffRatio;
    if (r.sizeMismatch) reasons.push(`size: ref ${ref.width}x${ref.height}, actual ${png.width}x${png.height}`);
    else if (r.diffRatio > cfg.maxDiffRatio) reasons.push(`image differs ${(r.diffRatio * 100).toFixed(2)}%`);
    const stdoutFile = path.join(REFS_DIR, `${name}.stdout.txt`);
    if (cfg.stdout && fs.existsSync(stdoutFile)) {
      const expected = fs.readFileSync(stdoutFile, "utf8").split(/\r?\n/).filter((l, i, a) => i < a.length - 1 || l !== "");
      const got = logs.filter((l) => !l.startsWith("[vite]"));
      const i = expected.findIndex((l, k) => l !== got[k]);
      if (i >= 0 || got.length !== expected.length) {
        const k = i >= 0 ? i : expected.length;
        reasons.push(`stdout line ${k + 1}: expected ${JSON.stringify(expected[k])}, got ${JSON.stringify(got[k])}`);
      }
    }
    // Processing's own messages on stderr (missing files in files_load) are expected; page errors are not.
    const unexpected = errors.filter((e) => !/is missing or inaccessible|Failed to load resource/.test(e));
    if (unexpected.length) reasons.push(`errors: ${unexpected[0]}`);
  } catch (e) {
    reasons.push(String((e as Error).message ?? e).split("\n")[0]);
  } finally {
    await context.close();
  }
  return { mode, name, ok: reasons.length === 0, reasons, diff };
}

/** An app that runs the case named by the URL hash, importing every case as a `?pde` module. */
function writeApp(dir: string) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  const toPosix = (p: string) => p.split(path.sep).join("/");
  const imports = CASES.map((c, i) => `import s${i} from ${JSON.stringify(toPosix(path.join(CASES_DIR, c)) + "/?pde")};`).join("\n");
  fs.writeFileSync(path.join(dir, "main.js"), `${imports}
import { SketchPlayer } from ${JSON.stringify(toPosix(path.join(ROOT, "src/lib/runtime.ts")))};
const sketches = { ${CASES.map((c, i) => `${JSON.stringify(c)}: s${i}`).join(", ")} };
const player = new SketchPlayer();
player.mountPApplet(document.getElementById("sketch"));
player.addEventListener("log", (line) => console.log(...line));
player.addEventListener("error", (message) => console.error(message));
player.run(sketches[location.hash.slice(1)]);
`);
  fs.writeFileSync(path.join(dir, "index.html"), `<!doctype html>
<html><head><meta charset="utf-8"><style>body{margin:0}canvas{display:block}</style></head>
<body><canvas id="sketch"></canvas><script type="module" src="./main.js"></script></body></html>
`);
}

/** The worker scenario (mode "worker"): writes its findings to window.__result. */
function writeWorkerApp(dir: string) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  const lib = JSON.stringify(path.join(ROOT, "src/lib/index.ts").split(path.sep).join("/"));
  fs.writeFileSync(path.join(dir, "main.js"), `import { SketchManager } from ${lib};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const canvas = document.getElementById("sketch");
const m = new SketchManager({ thread: "worker" });
m.mountPApplet(canvas);
const logs = [];
m.addEventListener("log", (l) => logs.push(l.join(" ")));
m.addEventListener("error", (e) => logs.push("error: " + e));
// draw() never returns: the page must stay responsive and stopSketch() must end it.
await m.runSketch(m.loadSketchString("void setup() { size(320, 240); println(\\"start\\"); } void draw() { background(255, 0, 0); while (true) { } }", "Loop.pde"));
await sleep(300);
const t = performance.now();
await sleep(20);
const latency = performance.now() - t - 20;
m.stopSketch();
await m.runSketch(m.loadSketchString("void setup() { size(320, 240); cursor(HAND); surface.setTitle(\\"Second\\"); println(\\"second\\"); } void draw() { background(0, 128, 255); }", "Second.pde"));
await sleep(500);
const bmp = await createImageBitmap(await m.capture());
const c = new OffscreenCanvas(bmp.width, bmp.height).getContext("2d");
c.drawImage(bmp, 0, 0);
const px = Array.from(c.getImageData(160, 120, 1, 1).data);
window.__result = { logs, latency, px, size: [bmp.width, bmp.height], replaced: m.target_element !== canvas, inPage: m.target_element.isConnected && !canvas.isConnected, cssWidth: m.target_element.style.width, cursor: m.target_element.style.cursor, title: document.title };
`);
  fs.writeFileSync(path.join(dir, "index.html"), `<!doctype html>
<html><head><meta charset="utf-8"></head>
<body><canvas id="sketch" class="kept"></canvas><script type="module" src="./main.js"></script></body></html>
`);
}

const PACKAGE = "@async0x4c/processing-ts";
/** Package checks: [how the app runs the sketch, case]. "main"/"worker": SketchManager compiles in the page. */
const PACKAGE_RUNS: [string, string][] = [
  ["main", "text_metrics"], ["main", "p3d_box"], ["worker", "text_metrics"], ["worker", "p3d_box"], ["worker", "shape_svg"],
  ["aot", "files_load"], ["aot", "text_metrics"], ["aot", "p3d_shape_obj"],
];

/**
 * An app that installs the built package (`vite build` into its node_modules, as npm would) and uses it
 * by its name: SketchManager (main thread or worker) and `?pde` modules with the package's Vite plugin.
 * Under tests/aot/out so that the package's own dependencies (@lezer, libtess) resolve from the repository.
 */
function writePackageApp(): string {
  const app = path.join(OUT_DIR, "package-app");
  const pkg = path.join(app, "node_modules", PACKAGE);
  fs.rmSync(app, { recursive: true, force: true });
  fs.mkdirSync(pkg, { recursive: true });
  const r = spawnSync(process.execPath, [path.join(ROOT, "node_modules/vite/bin/vite.js"), "build", "--outDir", path.join(pkg, "dist"), "--emptyOutDir", "--logLevel", "warn"], { cwd: ROOT, encoding: "utf8" });
  if (r.status !== 0) throw new Error(`vite build failed:\n${r.stdout}\n${r.stderr}`);
  fs.copyFileSync(path.join(ROOT, "package.json"), path.join(pkg, "package.json"));
  fs.writeFileSync(path.join(app, "package.json"), JSON.stringify({ name: "package-app", private: true, type: "module", dependencies: { [PACKAGE]: "*" } }));
  const toPosix = (p: string) => p.split(path.sep).join("/");
  const cases = [...new Set(PACKAGE_RUNS.map(([, c]) => c))];
  const sources = Object.fromEntries(cases.map((c) => {
    const f = readSketchFolder(path.join(CASES_DIR, c));
    return [c, { main: f.main, content: f.tabs.map((t) => ({ name: t.name, content: t.text })) }];
  }));
  const aot = PACKAGE_RUNS.filter(([m]) => m === "aot").map(([, c]) => c);
  // The sketches compiled in the page read their files from public/<case>/ (copied by Vite).
  for (const c of cases) {
    const data = path.join(CASES_DIR, c, "data");
    if (fs.existsSync(data)) fs.cpSync(data, path.join(app, "public", c, "data"), { recursive: true });
  }
  fs.writeFileSync(path.join(app, "main.js"), `import { SketchManager } from "${PACKAGE}";
import { SketchPlayer } from "${PACKAGE}/runtime";
${aot.map((c, i) => `import aot${i} from ${JSON.stringify(toPosix(path.join(CASES_DIR, c)) + "/?pde")};`).join("\n")}
const precompiled = { ${aot.map((c, i) => `${JSON.stringify(c)}: aot${i}`).join(", ")} };
const sources = ${JSON.stringify(sources)};
const [mode, name] = location.hash.slice(1).split("/");
const player = mode === "aot" ? new SketchPlayer() : new SketchManager({ thread: mode });
player.mountPApplet(document.getElementById("sketch"));
player.addEventListener("log", (line) => console.log(...line));
player.addEventListener("error", (message) => console.error(message));
if (mode === "aot") player.run(precompiled[name]);
else {
  player.base_uri = new URL("./" + name + "/", location.href).href;
  player.runSketch(sources[name]);
}
`);
  fs.writeFileSync(path.join(app, "index.html"), `<!doctype html>
<html><head><meta charset="utf-8"><style>body{margin:0}canvas{display:block}</style></head>
<body><canvas id="sketch"></canvas><script type="module" src="./main.js"></script></body></html>
`);
  return app;
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "processing-ts-aot-"));
const browser = await chromium.launch({ headless: !flags.headed, args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const results: Check[] = [];
const report = (c: Check) => {
  results.push(c);
  console.log(`${c.ok ? "PASS" : "FAIL"}  ${c.mode.padEnd(8)} ${c.name.padEnd(16)} ${c.diff === null ? "" : `diff ${(c.diff * 100).toFixed(2)}%`}  ${c.reasons.join("; ")}`);
};
try {
  if (MODES.includes("cli") || MODES.includes("offline")) {
    const site = path.join(tmp, "cli");
    for (const c of CASES) {
      const r = await buildSketch(path.join(CASES_DIR, c), { out: path.join(site, c), sw: true });
      if (!r.ok) throw new Error(`build ${c}: ${r.errors.join("\n")}`);
    }
    const server = await serve(site);
    try {
      if (MODES.includes("cli")) for (const c of CASES) report(await check(browser, "cli", c, `${server.url}/${c}/`));
      if (MODES.includes("offline")) {
        for (const c of ["files_load", "p3d_shape_obj", "text_metrics"]) {
          report(await check(browser, "offline", c, "", async (page) => {
            await page.goto(`${server.url}/${c}/`, { waitUntil: "load" });
            await page.evaluate(async () => {
              await navigator.serviceWorker.ready;
            });
            await page.context().setOffline(true);
            await page.reload({ waitUntil: "load" });
          }));
        }
      }
    } finally {
      await server.close();
    }
  }
  if (MODES.includes("cli-worker")) {
    const site = path.join(tmp, "cli-worker");
    const cases = ["files_load", "p3d_box", "shape_svg", "text_metrics"];
    for (const c of cases) {
      const r = await buildSketch(path.join(CASES_DIR, c), { out: path.join(site, c), worker: true });
      if (!r.ok) throw new Error(`build ${c}: ${r.errors.join("\n")}`);
    }
    const server = await serve(site);
    try {
      // The page cannot read the worker's canvas: compare a screenshot of it instead.
      for (const c of cases) report(await check(browser, "cli-worker", c, `${server.url}/${c}/`, undefined, true));
    } finally {
      await server.close();
    }
  }
  if (MODES.includes("worker")) {
    const app = path.join(tmp, "worker-app");
    writeWorkerApp(app);
    const server = await createServer({ root: app, configFile: false, logLevel: "error", server: { host: "127.0.0.1", port: 0, fs: { allow: [ROOT, app] } } });
    await server.listen();
    const url = (server.resolvedUrls?.local[0] ?? "").replace(/\/$/, "");
    const context = await browser.newContext();
    const page = await context.newPage();
    const reasons: string[] = [];
    try {
      await page.goto(`${url}/index.html`, { waitUntil: "load" });
      await page.waitForFunction(() => (window as any).__result !== undefined, null, { timeout: 30_000 });
      const r = await page.evaluate(() => (window as any).__result);
      const expect = (ok: boolean, what: string) => {
        if (!ok) reasons.push(`${what}: ${JSON.stringify(r)}`);
      };
      expect(r.logs.join("|") === "start|second", "println of both runs");
      expect(r.latency < 200, "the page stays responsive during the endless loop");
      expect(r.px[0] === 0 && r.px[1] === 128 && r.px[2] === 255, "the second sketch draws");
      expect(r.replaced && r.inPage, "a new canvas in the old one's place");
      expect(r.cssWidth === "320px" && r.size[0] === 320, "the canvas size");
      expect(r.cursor === "pointer", "cursor(HAND)");
      expect(r.title === "Second", "surface.setTitle()");
    } catch (e) {
      reasons.push(String((e as Error).message ?? e).split("\n")[0]);
    } finally {
      await context.close();
      await server.close();
    }
    report({ mode: "worker", name: "stop-and-rerun", ok: reasons.length === 0, reasons, diff: null });
  }
  if (MODES.includes("package") || MODES.includes("package-dev")) {
    const app = writePackageApp();
    if (MODES.includes("package")) {
      const out = path.join(tmp, "package-out");
      const { default: plugin } = await import(pathToFileURL(path.join(app, "node_modules", PACKAGE, "dist/vite.js")).href);
      await viteBuild({ root: app, configFile: false, logLevel: "warn", base: "./", plugins: [plugin()], build: { outDir: out, emptyOutDir: true, target: "es2022" } });
      const server = await serve(out);
      try {
        for (const [mode, c] of PACKAGE_RUNS) report(await check(browser, `pkg-${mode}`, c, `${server.url}/index.html#${mode}/${c}`, undefined, mode === "worker"));
      } finally {
        await server.close();
      }
    }
    if (MODES.includes("package-dev")) {
      const { default: plugin } = await import(pathToFileURL(path.join(app, "node_modules", PACKAGE, "dist/vite.js")).href);
      const server = await createServer({ root: app, configFile: false, logLevel: "error", plugins: [plugin()], server: { host: "127.0.0.1", port: 0, fs: { allow: [ROOT, app] } } });
      await server.listen();
      const url = (server.resolvedUrls?.local[0] ?? "").replace(/\/$/, "");
      try {
        for (const [mode, c] of PACKAGE_RUNS) report(await check(browser, `pkgdev-${mode}`, c, `${url}/index.html#${mode}/${c}`, undefined, mode === "worker"));
      } finally {
        await server.close();
      }
    }
  }
  if (MODES.includes("vite") || MODES.includes("dev")) {
    const app = path.join(tmp, "app");
    writeApp(app);
    if (MODES.includes("vite")) {
      const out = path.join(tmp, "vite-out");
      await viteBuild({ root: app, configFile: false, logLevel: "warn", base: "./", plugins: [processing()], build: { outDir: out, emptyOutDir: true, target: "es2022" } });
      const server = await serve(out);
      try {
        for (const c of CASES) report(await check(browser, "vite", c, `${server.url}/index.html#${c}`));
      } finally {
        await server.close();
      }
    }
    if (MODES.includes("dev")) {
      const server = await createServer({ root: app, configFile: false, logLevel: "error", plugins: [processing()], server: { host: "127.0.0.1", port: 0, fs: { allow: [ROOT, app] } } });
      await server.listen();
      const url = (server.resolvedUrls?.local[0] ?? "").replace(/\/$/, "");
      try {
        for (const c of CASES) report(await check(browser, "dev", c, `${url}/index.html#${c}`));
      } finally {
        await server.close();
      }
    }
  }
} finally {
  await browser.close();
  if (!flags.keep) fs.rmSync(tmp, { recursive: true, force: true });
  else console.log(`kept: ${tmp}`);
}
const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed} pass, ${failed} fail (composites: ${path.relative(ROOT, OUT_DIR)})`);
process.exit(failed ? 1 : 0);
