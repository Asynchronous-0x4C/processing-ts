// Front end entry: parse each tab on its own (positions stay per tab) and build the AST.
import type { SketchFile } from "./ast.ts";
import { buildFile } from "./cst-to-ast.ts";
import { sortDiagnostics, type Diagnostic } from "./diagnostics.ts";
import { parser } from "./grammar/parser.ts";
import { SketchSource } from "./source.ts";
import { syntaxErrors } from "./syntax-errors.ts";

export interface ParseResult {
  source: SketchSource;
  /** One per tab, in tab order. */
  files: SketchFile[];
  /** Syntax errors and the structural errors found while building the AST, sorted by position. */
  diagnostics: Diagnostic[];
}

/**
 * Parse a sketch. `tabs` are in Processing order (main tab first). A tab with syntax errors still
 * yields a best-effort AST; only errors before its first syntax error are kept from the AST builder,
 * since later ones are usually consequences of the recovery.
 */
export function parseSketch(tabs: readonly { name: string; text: string }[] | SketchSource): ParseResult {
  const source = tabs instanceof SketchSource ? tabs : new SketchSource(tabs);
  const files: SketchFile[] = [];
  const diagnostics: Diagnostic[] = [];
  source.tabs.forEach((tab, i) => {
    const tree = parser.parse(tab.text);
    const syntax = syntaxErrors(tab.text, tree, tab.base);
    const { file, diagnostics: built } = buildFile(tree, tab.text, tab.base, i, tab.name);
    files.push(file);
    diagnostics.push(...syntax);
    if (syntax.length === 0) diagnostics.push(...built);
    else {
      const first = Math.min(...syntax.map((d) => d.start));
      diagnostics.push(...built.filter((d) => d.code !== "internal" && d.end < first));
    }
  });
  return { source, files, diagnostics: sortDiagnostics(diagnostics) };
}

/** Single-tab convenience (tests, tools). */
export function parseTab(text: string, name = "sketch.pde"): ParseResult & { file: SketchFile } {
  const r = parseSketch([{ name, text }]);
  return { ...r, file: r.files[0] };
}
