// Compiler diagnostics. Positions are in the sketch position space (source.ts).
import type { SketchSource } from "./source.ts";

export interface Diagnostic {
  severity: "error" | "warning";
  /** Stable identifier for tests and tooling, e.g. "syntax", "missing-semicolon". */
  code: string;
  message: string;
  start: number;
  end: number;
}

export function error(code: string, message: string, start: number, end = start): Diagnostic {
  return { severity: "error", code, message, start, end };
}

/** "Sketch.pde:3:10: error: Missing ';'" */
export function formatDiagnostic(source: SketchSource, d: Diagnostic): string {
  return `${source.format(d.start)}: ${d.severity}: ${d.message}`;
}

export function sortDiagnostics(ds: Diagnostic[]): Diagnostic[] {
  return ds.sort((a, b) => a.start - b.start || a.end - b.end);
}
