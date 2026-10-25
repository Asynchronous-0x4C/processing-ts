// `processing-ts build <sketchDir>` (ROADMAP P4-1): a sketch folder compiled ahead of time into a folder
// that any static server can host:
//   index.html                  the page (a canvas and a module script that runs the sketch)
//   sketch.js, sketch.js.map    the compiled sketch (src/compiler/module.ts) and its source map to the .pde tabs
//   processing-ts/              the runtime (runtime.js, chunks loaded on demand, fonts/), unless --runtime <url>
//   data/                       the sketch's data folder, listed in sketch.js (fetched before setup()), and the
//                               files next to the tabs that the sketch names
//   sw.js                       with --sw: a Service Worker that caches every file, for offline use
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { COMPILER_VERSION } from "../compiler/index.ts";
import { sketchModule } from "../compiler/module.ts";
import { compileSketchFolder, listFiles, readSketchFolder } from "./sketchFolder.ts";
import { standaloneRuntimeDir } from "./standalone.ts";

/**
 * @property out Output folder (default: <sketchDir>/web-export).
 * @property runtime URL of a folder with runtime.js (a CDN, a shared copy) instead of copying it.
 * @property sketchOnly Only sketch.js (and its map): for pages that bring their own runtime.
 * @property sw Write sw.js and register it (offline use).
 * @property title The page title (default: the sketch name).
 * @property worker Run the sketch in a Web Worker (SketchSettings.thread "worker"): the page stays responsive.
 */
export type BuildOptions = { out?: string; runtime?: string; sketchOnly?: boolean; sw?: boolean; title?: string; worker?: boolean };

export type BuildReport = { ok: boolean; errors: string[]; out: string; files: string[]; name: string; compileMs: number };

const RUNTIME_DIR = "processing-ts";

export async function buildSketch(sketchDir: string, options: BuildOptions = {}): Promise<BuildReport> {
  const folder = readSketchFolder(sketchDir);
  const out = path.resolve(options.out ?? path.join(folder.dir, "web-export"));
  const t0 = performance.now();
  const { result, errors } = compileSketchFolder(folder);
  const compileMs = performance.now() - t0;
  if (errors.length) return { ok: false, errors, out, files: [], name: folder.name, compileMs };

  // The output must not be inside data/ (it would copy itself), and is replaced as a whole.
  const dataDir = path.join(folder.dir, "data");
  if (isInside(out, dataDir)) throw new Error(`The output folder must not be inside data/: ${out}`);
  if (out === folder.dir) throw new Error("The output folder must not be the sketch folder.");
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });

  const written: string[] = [];
  const write = (rel: string, content: string | Uint8Array) => {
    const p = path.join(out, rel);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, content);
    written.push(rel);
  };

  // Files next to the tabs that the sketch names (loadStrings("notes.txt") without data/) are copied too.
  const rootFiles = result.files
    .filter((n) => !/^[a-z]+:/i.test(n) && !path.isAbsolute(n))
    .map((n) => n.replace(/\\/g, "/"))
    .filter((n) => !n.startsWith("../") && !folder.dataFiles.includes("data/" + n) && !folder.dataFiles.includes(path.posix.normalize(n)) && fs.existsSync(path.join(folder.dir, n)) && fs.statSync(path.join(folder.dir, n)).isFile());
  const listed = [...folder.dataFiles, ...new Set(rootFiles)];
  const mod = sketchModule(result, {
    name: folder.name,
    listed,
    header: `${folder.name}: compiled by processing-ts ${COMPILER_VERSION} from ${folder.tabs.map((t) => t.name).join(", ")}`,
  });
  write("sketch.js", mod.code + (mod.map ? "//# sourceMappingURL=sketch.js.map\n" : ""));
  if (mod.map) write("sketch.js.map", JSON.stringify({ ...mod.map, file: "sketch.js" }));
  if (options.sketchOnly) return { ok: true, errors: [], out, files: written, name: folder.name, compileMs };

  for (const f of listed) write(f, fs.readFileSync(path.join(folder.dir, f)));

  let runtimeURL: string;
  if (options.runtime) {
    runtimeURL = options.runtime.endsWith("/") ? options.runtime : options.runtime + "/";
  } else {
    const src = await standaloneRuntimeDir();
    for (const f of listFiles(src)) write(`${RUNTIME_DIR}/${f}`, fs.readFileSync(path.join(src, f)));
    runtimeURL = `./${RUNTIME_DIR}/`;
  }

  write("index.html", indexHtml(options.title ?? folder.name, runtimeURL, !!options.sw, !!options.worker));
  if (options.sw) {
    // Everything but the worker itself, cached at install; a new build (other content) is a new cache.
    const hash = crypto.createHash("sha256");
    for (const f of written) hash.update(f).update(fs.readFileSync(path.join(out, f)));
    write("sw.js", serviceWorker(`${folder.name}-${hash.digest("hex").slice(0, 12)}`, [...new Set(["./", ...written.map((f) => "./" + f)])]));
  }
  return { ok: true, errors: [], out, files: written, name: folder.name, compileMs };
}

function isInside(p: string, dir: string) {
  const r = path.relative(dir, p);
  return r === "" || (!r.startsWith("..") && !path.isAbsolute(r));
}

const escapeHtml = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

/** The page: the canvas fills the window until size() sets it (fullScreen() sketches get the window). */
export function indexHtml(title: string, runtimeURL: string, sw: boolean, worker = false): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<style>
  html, body { margin: 0; height: 100%; background: #fff; }
  body { display: flex; align-items: center; justify-content: center; overflow: hidden; }
  canvas { display: block; outline: none; width: 100vw; height: 100vh; }
</style>
</head>
<body>
<canvas id="sketch" tabindex="0"></canvas>
<script type="module">
import { SketchPlayer } from ${JSON.stringify(runtimeURL + "runtime.js")};
import sketch from "./sketch.js";
const player = new SketchPlayer(${worker ? `{ thread: "worker" }` : ""});
player.mountPApplet(document.getElementById("sketch"));
player.addEventListener("log", (line) => console.log(...line));
player.addEventListener("error", (message) => console.error(message));
player.run(sketch);
${sw ? `if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js");\n` : ""}</script>
</body>
</html>
`;
}

/** A cache-first Service Worker for the built files (offline use). */
export function serviceWorker(cache: string, files: string[]): string {
  return `// Generated by processing-ts build: serves the sketch's files from the cache (works offline).
const CACHE = ${JSON.stringify(cache)};
const FILES = ${JSON.stringify(files, null, 2)};

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then((hit) => hit ?? fetch(e.request)));
});
`;
}
