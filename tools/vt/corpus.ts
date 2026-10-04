// Compatibility corpus: run Processing's bundled examples through processing-ts and tally the results.
import fs from "node:fs";
import path from "node:path";
import { BrowserRunner, type BrowserRunResult } from "./browser.ts";
import { readSketch } from "./sketch.ts";

export type CorpusOutcome = "ok" | "transpile" | "setup" | "draw" | "timeout";

export type CorpusResult = {
  name: string;
  group: string;
  renderer: "JAVA2D" | "P2D" | "P3D";
  outcome: CorpusOutcome;
  error: string | null;
  transpileMs: number;
};

/** Examples folder that ships with Processing: <install>/app/resources/modes/java/examples. */
export function findExamples(processingExe: string | null, explicit?: string): string | null {
  const candidates = [
    explicit,
    processingExe ? path.join(path.dirname(processingExe), "app/resources/modes/java/examples") : undefined,
    "C:/Program Files/Processing/app/resources/modes/java/examples",
  ].filter((p): p is string => !!p);
  return candidates.find((p) => fs.existsSync(p)) ?? null;
}

/** A sketch folder contains <folder name>.pde. */
export function findSketches(root: string): string[] {
  const out: string[] = [];
  const walk = (dir: string) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    if (entries.some((e) => e.isFile() && e.name === `${path.basename(dir)}.pde`)) {
      out.push(dir);
      return;
    }
    for (const e of entries) if (e.isDirectory() && e.name !== "data") walk(path.join(dir, e.name));
  };
  walk(root);
  return out.sort();
}

function classify(run: BrowserRunResult): { outcome: CorpusOutcome; error: string | null } {
  if (run.ok) return { outcome: "ok", error: null };
  const first = (run.errors[0] ?? "unknown error").split("\n")[0];
  if (run.phase === "harness") return { outcome: "timeout", error: first };
  const m = first.match(/^\[(transpile|setup|draw|capture|done)\]\s*(.*)$/);
  const phase = m?.[1] ?? run.phase;
  const message = m?.[2] ?? first;
  const outcome: CorpusOutcome = phase === "transpile" ? "transpile" : phase === "setup" ? "setup" : "draw";
  return { outcome, error: message };
}

/** Collapse sketch-specific details so identical root causes group together. */
export function normalizeError(e: string): string {
  return e
    .replace(/line: \d+,column: \d+/g, "")
    .replace(/'[^']*'/g, "'…'")
    .replace(/"[^"]*"/g, '"…"')
    .replace(/\b\d+(\.\d+)?\b/g, "N")
    .replace(/\s+/g, " ")
    .trim();
}

export async function runCorpus(opts: {
  projectRoot: string;
  examples: string;
  filter?: string;
  frames: number;
  timeoutMs: number;
  onResult?: (r: CorpusResult, i: number, total: number) => void;
}): Promise<CorpusResult[]> {
  let dirs = findSketches(opts.examples);
  if (opts.filter) dirs = dirs.filter((d) => path.relative(opts.examples, d).replace(/\\/g, "/").includes(opts.filter!));
  const runner = new BrowserRunner({ projectRoot: opts.projectRoot, extraFsAllow: [opts.examples] });
  await runner.start();
  const results: CorpusResult[] = [];
  try {
    for (const [i, dir] of dirs.entries()) {
      const rel = path.relative(opts.examples, dir).replace(/\\/g, "/");
      const sketch = readSketch(dir);
      const code = sketch.files.map((f) => f.content).join("\n");
      const r3 = /\bsize\s*\([^;]*\bP3D\b/.test(code) || /\bfullScreen\s*\(\s*P3D/.test(code);
      const r2 = /\bsize\s*\([^;]*\bP2D\b/.test(code) || /\bfullScreen\s*\(\s*P2D/.test(code);
      const run = await runner.run(sketch, opts.frames, opts.timeoutMs);
      const { outcome, error } = classify(run);
      const result: CorpusResult = {
        name: rel,
        group: rel.split("/").slice(0, 2).join("/"),
        renderer: r3 ? "P3D" : r2 ? "P2D" : "JAVA2D",
        outcome,
        error,
        transpileMs: run.transpileMs,
      };
      results.push(result);
      opts.onResult?.(result, i, dirs.length);
    }
  } finally {
    await runner.stop();
  }
  return results;
}

export function corpusReport(results: CorpusResult[], meta: { examples: string; frames: number; processing: string }): string {
  const outcomes: CorpusOutcome[] = ["ok", "transpile", "setup", "draw", "timeout"];
  const row = (label: string, rs: CorpusResult[]) => {
    const ok = rs.filter((r) => r.outcome === "ok").length;
    const pct = rs.length ? ((ok / rs.length) * 100).toFixed(0) : "-";
    return `| ${label} | ${rs.length} | ${outcomes.map((o) => rs.filter((r) => r.outcome === o).length).join(" | ")} | ${pct}% |`;
  };
  const groups = [...new Set(results.map((r) => r.group.split("/")[0]))];
  const lines = [
    "# 互換性コーパス（Processing 同梱 examples）",
    "",
    `\`npm run vt -- corpus\` の出力（${new Date().toISOString().slice(0, 10)}）。Processing ${meta.processing} の同梱 examples をヘッドレス Chromium で変換し、setup + draw ${meta.frames} 回を実行した結果。`,
    "「ok」はエラーなく完走したことだけを意味し、見た目の一致は確認していない。",
    "",
    "## 集計",
    "",
    `| 区分 | 本数 | ok | 変換エラー | setup エラー | draw エラー | タイムアウト | ok 率 |`,
    `|---|---:|---:|---:|---:|---:|---:|---:|`,
    row("**全体**", results),
    ...groups.map((g) => row(g, results.filter((r) => r.group.startsWith(g + "/") || r.group === g))),
    row("JAVA2D", results.filter((r) => r.renderer === "JAVA2D")),
    row("P2D", results.filter((r) => r.renderer === "P2D")),
    row("P3D", results.filter((r) => r.renderer === "P3D")),
    "",
    "## 多いエラー（正規化して集計）",
    "",
    "| 件数 | エラー | 例 |",
    "|---:|---|---|",
  ];
  const byError = new Map<string, CorpusResult[]>();
  for (const r of results) if (r.error) byError.set(normalizeError(r.error), [...(byError.get(normalizeError(r.error)) ?? []), r]);
  for (const [e, rs] of [...byError].sort((a, b) => b[1].length - a[1].length).slice(0, 40)) {
    lines.push(`| ${rs.length} | \`${e.replace(/\|/g, "\\|").slice(0, 120)}\` | ${rs.slice(0, 3).map((r) => r.name.split("/").pop()).join(", ")} |`);
  }
  lines.push("", "## グループ別", "", "| グループ | 本数 | ok | 変換エラー | setup エラー | draw エラー | タイムアウト | ok 率 |", "|---|---:|---:|---:|---:|---:|---:|---:|");
  for (const g of [...new Set(results.map((r) => r.group))]) lines.push(row(g, results.filter((r) => r.group === g)));
  lines.push("", "## 全スケッチ", "", "| スケッチ | レンダラ | 結果 | 変換 ms | 最初のエラー |", "|---|---|---|---:|---|");
  for (const r of results) {
    lines.push(`| ${r.name} | ${r.renderer} | ${r.outcome} | ${r.transpileMs.toFixed(0)} | ${(r.error ?? "").replace(/\|/g, "\\|").slice(0, 100)} |`);
  }
  return lines.join("\n") + "\n";
}
