// Reading a Processing sketch folder (Node): the tabs in Processing's order and the files of data/.
import fs from "node:fs";
import path from "node:path";
import { compileSketch, formatDiagnostic, type CompileResult } from "../compiler/index.ts";

/**
 * @property name The sketch name (main tab without ".pde").
 * @property tabs Main tab first, then the other .pde files alphabetically (Processing's order).
 * @property dataFiles The files of data/, relative to the sketch folder ("data/a.png").
 */
export type SketchFolder = {
  dir: string;
  name: string;
  main: string;
  tabs: { name: string; text: string }[];
  dataFiles: string[];
};

/**
 * Read a sketch folder. The main tab is `main =` of sketch.properties, `<folder name>.pde`, or the first
 * .pde alphabetically. `dir` may also be the main .pde file.
 */
export function readSketchFolder(dir: string): SketchFolder {
  let folder = path.resolve(dir);
  let main: string | null = null;
  if (fs.statSync(folder).isFile()) {
    main = path.basename(folder);
    folder = path.dirname(folder);
  }
  const pdes = fs.readdirSync(folder).filter((f) => f.endsWith(".pde")).sort();
  if (pdes.length === 0) throw new Error(`No .pde files in ${folder}`);
  if (main === null) {
    main = pdes[0];
    const folderMain = path.basename(folder) + ".pde";
    if (pdes.includes(folderMain)) main = folderMain;
    const propsPath = path.join(folder, "sketch.properties");
    if (fs.existsSync(propsPath)) {
      const m = fs.readFileSync(propsPath, "utf8").match(/^\s*main\s*=\s*(\S+\.pde)/m);
      if (m && pdes.includes(m[1])) main = m[1];
    }
  }
  const ordered = [main, ...pdes.filter((f) => f !== main)];
  return {
    dir: folder,
    name: main.replace(/\.pde$/, ""),
    main,
    tabs: ordered.map((name) => ({ name, text: fs.readFileSync(path.join(folder, name), "utf8") })),
    dataFiles: listFiles(path.join(folder, "data")).map((f) => "data/" + f),
  };
}

/** Files under `dir`, relative to it with "/" (empty when it does not exist). */
export function listFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { recursive: true })
    .map(String)
    .filter((f) => fs.statSync(path.join(dir, f)).isFile())
    .map((f) => f.split(path.sep).join("/"))
    .sort();
}

/** Compile a sketch folder: the result and its errors as "Tab.pde:3:10: error: ..." lines. */
export function compileSketchFolder(folder: SketchFolder): { result: CompileResult; errors: string[] } {
  const result = compileSketch(folder.tabs);
  const errors = result.diagnostics.filter((d) => d.severity === "error").map((d) => formatDiagnostic(result.parse.source, d));
  return { result, errors };
}
