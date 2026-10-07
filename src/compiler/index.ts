// New Processing compiler (ROADMAP P1). DOM-free; runs in browsers, workers and Node.
export * as ast from "./ast.ts";
export { checkSketch, type CheckResult } from "./check.ts";
export { generate, type GenerateOptions, type GenerateResult } from "./codegen.ts";
export type { Diagnostic } from "./diagnostics.ts";
export { formatDiagnostic } from "./diagnostics.ts";
export { parseSketch, parseTab, type ParseResult } from "./parse.ts";
export { SketchSource, type Location, type Tab } from "./source.ts";
export type { SourceMapV3 } from "./sourcemap.ts";
export type { Sketch } from "./sketch.ts";

import { checkSketch, type CheckResult } from "./check.ts";
import { generate, type GenerateOptions } from "./codegen.ts";
import { sortDiagnostics, type Diagnostic } from "./diagnostics.ts";
import { parseSketch, type ParseResult } from "./parse.ts";
import type { SourceMapV3 } from "./sourcemap.ts";

/**
 * Parse and type-check a sketch. Type checking is skipped when there are syntax errors (like
 * Processing, which reports those first).
 */
export function analyzeSketch(tabs: readonly { name: string; text: string }[]): { parse: ParseResult; check: CheckResult | null; diagnostics: Diagnostic[] } {
  const parse = parseSketch(tabs);
  if (parse.diagnostics.length) return { parse, check: null, diagnostics: parse.diagnostics };
  const check = checkSketch(parse.files);
  return { parse, check, diagnostics: sortDiagnostics([...check.diagnostics]) };
}

export interface CompileResult {
  diagnostics: Diagnostic[];
  /** JavaScript: the body of `new Function("$rt", "__renderer__", code)` (see codegen.ts). Null on errors. */
  code: string | null;
  map: SourceMapV3 | null;
  /** See GenerateResult.usesText (false when there are errors). */
  usesText: boolean;
  /** See GenerateResult.files (empty when there are errors). */
  files: string[];
  parse: ParseResult;
  check: CheckResult | null;
}

/** Parse, type-check and generate JavaScript. No code is generated when there are errors (warnings are fine). */
export function compileSketch(tabs: readonly { name: string; text: string }[], options: GenerateOptions = {}): CompileResult {
  const { parse, check, diagnostics } = analyzeSketch(tabs);
  if (!check || diagnostics.some((d) => d.severity === "error")) return { diagnostics, code: null, map: null, usesText: false, files: [], parse, check };
  const { code, map, usesText, files } = generate(check, parse.source, options);
  return { diagnostics, code, map, usesText, files, parse, check };
}
