// The runtime as plain ES modules for pages without a bundler (the output of `processing-ts build`):
// runtime.js (SketchPlayer), webgl.js, their chunks (the OpenGL part loads on demand) and fonts/.
// The published package ships it prebuilt in dist/standalone/; in the repository it is built from src/.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));

/** Build the standalone runtime from the sources into `outDir` (needs esbuild, a devDependency). */
export async function buildStandaloneRuntime(root: string, outDir: string, minify = true): Promise<void> {
  const { build } = await import("esbuild");
  fs.rmSync(outDir, { recursive: true, force: true });
  await build({
    entryPoints: { runtime: path.join(root, "src/lib/runtime.ts"), webgl: path.join(root, "src/lib/webgl.ts") },
    bundle: true, splitting: true, format: "esm", platform: "browser", target: "es2022", minify,
    outdir: outDir, chunkNames: "chunk-[hash]", logLevel: "warning", legalComments: "eof",
  });
  fs.cpSync(path.join(root, "src/lib/runtime/fonts"), path.join(outDir, "fonts"), { recursive: true });
}

/**
 * The folder of the standalone runtime: dist/standalone next to the published CLI, or a fresh build of
 * the sources when running from the repository.
 */
export async function standaloneRuntimeDir(): Promise<string> {
  const shipped = path.join(HERE, "standalone");
  if (fs.existsSync(path.join(shipped, "runtime.js"))) return shipped;
  const root = path.resolve(HERE, "../..");
  if (!fs.existsSync(path.join(root, "src/lib/runtime.ts"))) throw new Error(`The standalone runtime is missing (${shipped}).`);
  const out = path.join(root, "node_modules/.cache/processing-ts-standalone");
  await buildStandaloneRuntime(root, out);
  return out;
}

/** The bundled default font (the Vite plugin emits it as an asset for sketches that draw text). */
export function defaultFontFile(): string {
  for (const p of [path.join(HERE, "fonts/ProcessingSansPro-Regular.ttf"), path.resolve(HERE, "../lib/runtime/fonts/ProcessingSansPro-Regular.ttf")]) {
    if (fs.existsSync(p)) return p;
  }
  throw new Error("The default font (ProcessingSansPro-Regular.ttf) is missing.");
}
