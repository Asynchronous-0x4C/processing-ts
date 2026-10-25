#!/usr/bin/env node
// End-to-end checks of the ahead-of-time paths (ROADMAP P4-1), in headless Chromium against Processing's
// references (tests/visual/refs):
//   cli      `processing-ts build` output (index.html + sketch.js + the standalone runtime), served statically
//   offline  the same with --sw, reloaded offline (everything from the Service Worker's cache)
//   vite     an app importing the cases as `?pde` modules, built by Vite with the plugin, served statically
//   dev      the same app on Vite's dev server
// Usage: node tools/aot/test.ts [cli|offline|vite|dev ...] [--headed] [--keep]
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { parseArgs } from "node:util";
import { chromium, type Browser, type Page } from "playwright-core";
import { build as viteBuild, createServer } from "vite";
import { buildSketch } from "../../src/aot/build.ts";
import processing from "../../src/aot/vite.ts";
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
const MODES = positionals.length ? positionals : ["cli", "offline", "vite", "dev"];

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
async function check(browser: Browser, mode: string, name: string, url: string, before?: (page: Page) => Promise<void>): Promise<Check> {
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
    const png = pngFromDataUrl(await page.evaluate(() => document.querySelector("canvas")!.toDataURL("image/png")));
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
