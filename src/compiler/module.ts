// A compiled sketch as an ES module (ahead-of-time compilation: `processing-ts build`, the Vite plugin).
// The module's default export is a PrecompiledSketch (src/lib/types.ts) for SketchPlayer.run(): the code is
// a real function, so the page needs neither the compiler nor `new Function`.
import type { CompileResult } from "./index.ts";
import type { SourceMapV3 } from "./sourcemap.ts";

/**
 * Whether compiled code uses the OpenGL renderers or shaders: P2D/P3D (inlined as their class names),
 * processing.opengl classes, loadShader().
 */
export function usesOpenGL(code: string): boolean {
  return /processing\.opengl\.|\.loadShader\(/.test(code);
}

/** Whether compiled code uses PShape or PMatrix3D (OpenGL sketches always load them). */
export function usesShapes(code: string): boolean {
  return /processing\.core\.(PShape|PMatrix3D)|\.(createShape|loadShape|shape)\(/.test(code) || usesOpenGL(code);
}

/**
 * @property name The sketch name (main tab without ".pde").
 * @property listed Files of the sketch folder to fetch before setup() ("data/a.png").
 * @property urls Literal URLs of files of the sketch folder, by path.
 * @property imports Module specifiers whose default export is the URL of a file, by path (a bundler's
 *   `?url` imports): the bundler then copies and renames the files.
 * @property base URL of the sketch folder, relative to the page (default: the page's folder).
 * @property fontImport Module specifier whose default export is the URL of the default font (bundlers).
 * @property header A comment for the first line.
 */
export type SketchModuleOptions = {
  name: string;
  listed?: string[];
  urls?: Record<string, string>;
  imports?: Record<string, string>;
  base?: string;
  fontImport?: string;
  header?: string;
};

/** The ES module of a compiled sketch, with its source map (the compiler's map, shifted to the function body). */
export function sketchModule(result: CompileResult, options: SketchModuleOptions): { code: string; map: SourceMapV3 | null } {
  if (result.code === null) throw new Error("the sketch has compile errors");
  const json = (v: unknown) => JSON.stringify(v);
  const head: string[] = [];
  if (options.header) head.push(`// ${options.header.replace(/\n/g, " ")}`);
  const urlProps: string[] = Object.entries(options.urls ?? {}).map(([k, v]) => `${json(k)}: ${json(v)}`);
  Object.entries(options.imports ?? {}).forEach(([path, spec], i) => {
    head.push(`import $url${i} from ${json(spec)};`);
    urlProps.push(`${json(path)}: $url${i}`);
  });
  if (options.fontImport && result.usesText) head.push(`import $font from ${json(options.fontImport)};`);
  head.push("export function sketch($rt, __renderer__) {");
  const tail = [
    "}",
    "export default {",
    `  name: ${json(options.name)},`,
    "  sketch,",
    `  usesText: ${result.usesText},`,
    `  files: ${json(result.files)},`,
    `  listed: ${json(options.listed ?? [])},`,
    `  urls: {${urlProps.join(", ")}},`,
    ...(options.base !== undefined ? [`  base: ${json(options.base)},`] : []),
    `  opengl: ${usesOpenGL(result.code)},`,
    `  shapes: ${usesShapes(result.code)},`,
    ...(options.fontImport && result.usesText ? ["  font: $font,"] : []),
    "};",
    "",
  ];
  const code = [...head, result.code.replace(/\n$/, ""), ...tail].join("\n");
  const map = result.map ? { ...result.map, mappings: ";".repeat(head.length) + result.map.mappings } : null;
  return { code, map };
}
