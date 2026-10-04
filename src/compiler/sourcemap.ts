// Source Map v3 builder (https://sourcemaps.info/spec.html): mappings from generated line/column to a
// tab, line and column of the sketch. Lines and columns are 0-based here, as in the format.

const B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

function vlq(n: number): string {
  let v = n < 0 ? (-n << 1) | 1 : n << 1;
  let out = "";
  do {
    let digit = v & 31;
    v >>>= 5;
    if (v > 0) digit |= 32;
    out += B64[digit];
  } while (v > 0);
  return out;
}

export interface SourceMapV3 {
  version: 3;
  file?: string;
  sources: string[];
  sourcesContent?: string[];
  names: string[];
  mappings: string;
}

export class SourceMapBuilder {
  private readonly lines: [number, number, number, number][][] = [];

  /** Map generated (line, column) to (source index, line, column). */
  add(genLine: number, genCol: number, source: number, line: number, col: number) {
    (this.lines[genLine] ??= []).push([genCol, source, line, col]);
  }

  toJSON(sources: string[], contents?: string[], file?: string): SourceMapV3 {
    let prevSource = 0;
    let prevLine = 0;
    let prevCol = 0;
    const out: string[] = [];
    for (let i = 0; i < this.lines.length; i++) {
      const segs = (this.lines[i] ?? []).sort((a, b) => a[0] - b[0]);
      let prevGenCol = 0;
      out.push(segs.map(([gc, s, l, c]) => {
        const seg = vlq(gc - prevGenCol) + vlq(s - prevSource) + vlq(l - prevLine) + vlq(c - prevCol);
        prevGenCol = gc;
        prevSource = s;
        prevLine = l;
        prevCol = c;
        return seg;
      }).join(","));
    }
    return { version: 3, ...(file ? { file } : {}), sources, ...(contents ? { sourcesContent: contents } : {}), names: [], mappings: out.join(";") };
  }
}
