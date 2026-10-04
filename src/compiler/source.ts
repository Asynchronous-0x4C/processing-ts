// Sketch sources and the position space shared by the AST and diagnostics.
//
// Each tab gets a base offset; positions in tab i are `base_i + offset`. Bases leave a gap of one so
// the end of one tab and the start of the next never coincide. `locate()` maps a position back to the
// tab, line and column (both 1-based, columns in UTF-16 code units).

export interface Tab {
  /** File name as shown to the user, e.g. "Sketch.pde". */
  name: string;
  text: string;
  /** Position of the tab's first character. */
  base: number;
  /** Offsets (within the tab) of the start of each line. */
  lineStarts: number[];
}

export interface Location {
  tab: Tab;
  /** Index of the tab in the sketch. */
  tabIndex: number;
  /** 1-based. */
  line: number;
  /** 1-based. */
  column: number;
  /** Offset within the tab. */
  offset: number;
}

export class SketchSource {
  readonly tabs: Tab[] = [];

  /** Tabs in Processing order: the main tab first, then the others (Processing sorts them by name). */
  constructor(tabs: readonly { name: string; text: string }[] = []) {
    for (const t of tabs) this.add(t.name, t.text);
  }

  add(name: string, text: string): Tab {
    const last = this.tabs[this.tabs.length - 1];
    const base = last ? last.base + last.text.length + 1 : 0;
    const tab: Tab = { name, text, base, lineStarts: lineStarts(text) };
    this.tabs.push(tab);
    return tab;
  }

  /** Index of the tab containing `pos` (positions past the end of a tab belong to it). */
  tabIndexAt(pos: number): number {
    let lo = 0;
    let hi = this.tabs.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (this.tabs[mid].base <= pos) lo = mid;
      else hi = mid - 1;
    }
    return lo;
  }

  locate(pos: number): Location {
    const tabIndex = this.tabIndexAt(pos);
    const tab = this.tabs[tabIndex];
    const offset = Math.max(0, Math.min(pos - tab.base, tab.text.length));
    const line = lineIndex(tab.lineStarts, offset);
    return { tab, tabIndex, line: line + 1, column: offset - tab.lineStarts[line] + 1, offset };
  }

  /** "Sketch.pde:12:5" */
  format(pos: number): string {
    const l = this.locate(pos);
    return `${l.tab.name}:${l.line}:${l.column}`;
  }

  /** Source text between two positions of the same tab. */
  slice(start: number, end: number): string {
    const tab = this.tabs[this.tabIndexAt(start)];
    return tab.text.slice(start - tab.base, end - tab.base);
  }
}

export function lineStarts(text: string): number[] {
  const starts = [0];
  for (let i = text.indexOf("\n"); i !== -1; i = text.indexOf("\n", i + 1)) starts.push(i + 1);
  return starts;
}

/** 0-based line containing `offset`. */
export function lineIndex(starts: readonly number[], offset: number): number {
  let lo = 0;
  let hi = starts.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (starts[mid] <= offset) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}
