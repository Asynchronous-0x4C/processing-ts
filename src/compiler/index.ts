// New Processing compiler (ROADMAP P1). DOM-free; runs in browsers, workers and Node.
export * as ast from "./ast.ts";
export { checkSketch, type CheckResult } from "./check.ts";
export type { Diagnostic } from "./diagnostics.ts";
export { formatDiagnostic } from "./diagnostics.ts";
export { parseSketch, parseTab, type ParseResult } from "./parse.ts";
export { SketchSource, type Location, type Tab } from "./source.ts";
export type { Sketch } from "./sketch.ts";

import { checkSketch, type CheckResult } from "./check.ts";
import { sortDiagnostics, type Diagnostic } from "./diagnostics.ts";
import { parseSketch, type ParseResult } from "./parse.ts";

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
