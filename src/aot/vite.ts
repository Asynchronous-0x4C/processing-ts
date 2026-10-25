// Vite plugin (ROADMAP P4-1): sketches compiled ahead of time, imported as modules.
//
//   // vite.config.ts
//   import processing from "@async0x4c/processing-ts/vite";
//   export default { plugins: [processing()] };
//
//   // app
//   import sketch from "./MySketch/?pde";            // a sketch folder (or "./MySketch/MySketch.pde")
//   import { SketchPlayer } from "@async0x4c/processing-ts/runtime";
//   const player = new SketchPlayer();
//   player.mountPApplet(canvas);
//   player.run(sketch);
//
// The module's default export is a PrecompiledSketch (src/lib/types.ts). The files of data/ become the
// bundler's assets (`?url` imports, renamed in builds), so the sketch finds them wherever they are served.
// Compile errors are build errors (with the tab, line and column); editing a tab reloads the page.
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { COMPILER_VERSION } from "../compiler/index.ts";
import { sketchModule } from "../compiler/module.ts";
import type { SourceMapV3 } from "../compiler/sourcemap.ts";
import { compileSketchFolder, readSketchFolder } from "./sketchFolder.ts";
import { defaultFontFile } from "./standalone.ts";

/** The parts of Vite's plugin interface used here (Vite is not a dependency of the package). */
type PluginContext = {
  addWatchFile(id: string): void;
  error(message: string): never;
};
export type ProcessingPlugin = {
  name: string;
  enforce: "pre";
  config(config: { root?: string }): { optimizeDeps: { exclude: string[]; include: string[] } } | null;
  resolveId(this: unknown, source: string, importer: string | undefined): string | null;
  load(this: PluginContext, id: string): { code: string; map: SourceMapV3 | null } | null;
};

/**
 * @property data Whether the files of data/ are listed (fetched before setup(), so names built at run time
 *   are found) and emitted as assets. Default true; with false, only the files the sketch names with
 *   constant strings are.
 */
export type ProcessingPluginOptions = { data?: boolean };

const QUERY = "?pde";
const PACKAGE = "@async0x4c/processing-ts";
const toPosix = (p: string) => p.split(path.sep).join("/");

export default function processing(options: ProcessingPluginOptions = {}): ProcessingPlugin {
  const listData = options.data ?? true;
  return {
    name: "processing-ts",
    enforce: "pre",
    // Vite's dev server pre-bundles dependencies into node_modules/.vite, away from the package's fonts/ and
    // worker.js (found next to its modules); keep the package as it is, and pre-bundle its CommonJS dependency.
    config(config) {
      try {
        createRequire(path.join(path.resolve(config.root ?? process.cwd()), "noop.js")).resolve(`${PACKAGE}/package.json`);
      } catch {
        return null; // the app does not use the package (this repository's own tests)
      }
      return { optimizeDeps: { exclude: [PACKAGE], include: [`${PACKAGE} > libtess`] } };
    },
    resolveId(source, importer) {
      const q = source.endsWith(QUERY);
      const bare = q ? source.slice(0, -QUERY.length) : source;
      if (!q && !bare.endsWith(".pde")) return null;
      const base = importer ? path.dirname(importer.replace(/[?#].*$/, "")) : process.cwd();
      const target = path.resolve(base, bare || ".");
      if (!fs.existsSync(target)) return null;
      // One id per sketch: the folder, or the main tab when a .pde file is imported.
      return toPosix(target) + QUERY;
    },
    load(id) {
      if (!id.endsWith(QUERY)) return null;
      const target = id.slice(0, -QUERY.length);
      const folder = readSketchFolder(target);
      for (const t of folder.tabs) this.addWatchFile(path.join(folder.dir, t.name));
      const { result, errors } = compileSketchFolder(folder);
      if (errors.length) this.error(`${folder.name}: compile errors\n${errors.join("\n")}`);
      // data/: every file when listed, else the ones the sketch names (as data/<name> or <name>).
      const dataFiles = listData
        ? folder.dataFiles
        : folder.dataFiles.filter((f) => result.files.some((n) => f === "data/" + n.replace(/\\/g, "/") || f === n));
      const imports: Record<string, string> = {};
      for (const f of dataFiles) imports[f] = toPosix(path.join(folder.dir, f)) + "?url";
      // Other files of the sketch folder that the sketch names (loadImage("a.png") with a.png next to the tabs).
      for (const n of result.files) {
        const p = path.join(folder.dir, n);
        if (!/^[a-z]+:/i.test(n) && !imports["data/" + n] && fs.existsSync(p) && fs.statSync(p).isFile()) imports[toPosix(path.normalize(n))] = toPosix(p) + "?url";
      }
      const mod = sketchModule(result, {
        name: folder.name,
        listed: listData ? folder.dataFiles : [],
        imports,
        fontImport: toPosix(defaultFontFile()) + "?url",
        header: `${folder.name}: compiled by processing-ts ${COMPILER_VERSION}`,
      });
      const map = mod.map ? { ...mod.map, sources: folder.tabs.map((t) => toPosix(path.join(folder.dir, t.name))) } : null;
      return { code: mod.code, map };
    },
  };
}
