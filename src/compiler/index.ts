// New Processing compiler (ROADMAP P1). DOM-free; runs in browsers, workers and Node.
export * as ast from "./ast.ts";
export type { Diagnostic } from "./diagnostics.ts";
export { formatDiagnostic } from "./diagnostics.ts";
export { parseSketch, parseTab, type ParseResult } from "./parse.ts";
export { SketchSource, type Location, type Tab } from "./source.ts";
