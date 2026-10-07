// Compatibility corpus: run Processing's bundled examples through processing-ts and tally the results.
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { BrowserRunner, type BrowserRunResult } from "./browser.ts";
import { compare, composite, pngFromDataUrl, readPng } from "./image.ts";
import { renderReference } from "./processing.ts";
import { readSketch, type SketchSource } from "./sketch.ts";

export type CorpusOutcome = "ok" | "transpile" | "setup" | "draw" | "timeout";

export type CorpusResult = {
  name: string;
  group: string;
  renderer: "JAVA2D" | "P2D" | "P3D";
  outcome: CorpusOutcome;
  error: string | null;
  transpileMs: number;
  /**
   * With --ref (JAVA2D sketches that ran without errors): "match"/"differ" against Processing's frame,
   * "nondeterministic" when the sketch's output depends on time or unseeded randomness (not compared),
   * "noref" when Processing produced no frame.
   */
  visual?: "match" | "differ" | "nondeterministic" | "noref";
  diffRatio?: number;
};

/** Visual comparison as in the test cases: pixelmatch threshold and the share of differing pixels allowed. */
const VISUAL = { threshold: 0.1, maxDiffRatio: 0.01 };

/**
 * Whether a sketch draws the same frames on every run: no unseeded random()/noise(), no clock or date,
 * no frame-rate measurements, no network. (Mouse and keys stay at their defaults without input.)
 */
export function isDeterministic(code: string): string | null {
  const c = code.replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "");
  if (/\b(random|randomGaussian|random2D|random3D|shuffle)\s*\(/.test(c) && !/\brandomSeed\s*\(/.test(c)) return "random";
  if (/\bnoise\s*\(/.test(c) && !/\bnoiseSeed\s*\(/.test(c)) return "noise";
  if (/\b(millis|second|minute|hour|day|month|year)\s*\(/.test(c)) return "time";
  if (/\bframeRate\b(?!\s*\()/.test(c)) return "frameRate";
  if (/\bnew\s+Random\s*\(\s*\)|Math\.random|System\.(currentTimeMillis|nanoTime)/.test(c)) return "random";
  if (/https?:\/\//.test(code)) return "network";
  return null;
}

function sourceHash(sketch: SketchSource, frames: number): string {
  const h = crypto.createHash("sha1");
  for (const f of sketch.files) h.update(f.name).update("\0").update(f.content).update("\0");
  return h.update(`frames=${frames}`).digest("hex");
}

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
  /** Compare deterministic JAVA2D sketches with Processing's frames (references cached in cacheDir). */
  ref?: { processing: string; cacheDir: string; outDir: string };
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
      if (opts.ref && result.renderer === "JAVA2D" && outcome === "ok" && run.png) {
        const why = isDeterministic(code);
        if (why) result.visual = "nondeterministic";
        else {
          fs.mkdirSync(opts.ref.cacheDir, { recursive: true });
          const refPng = path.join(opts.ref.cacheDir, `${sourceHash(sketch, opts.frames)}.png`);
          if (!fs.existsSync(refPng)) await renderReference(sketch, { processing: opts.ref.processing, frames: opts.frames, outPng: refPng });
          if (!fs.existsSync(refPng)) result.visual = "noref";
          else {
            const ref = readPng(refPng), actual = pngFromDataUrl(run.png);
            const out = path.join(opts.ref.outDir, rel.replace(/[\/ ]/g, "_"));
            fs.mkdirSync(path.dirname(out), { recursive: true });
            const c = compare(ref, actual, VISUAL.threshold, out + ".diff.png");
            result.diffRatio = c.diffRatio;
            result.visual = !c.sizeMismatch && c.diffRatio <= VISUAL.maxDiffRatio ? "match" : "differ";
            if (result.visual === "differ") composite([ref, actual, readPng(out + ".diff.png")], out + ".png");
            fs.rmSync(out + ".diff.png", { force: true });
          }
        }
      }
      results.push(result);
      opts.onResult?.(result, i, dirs.length);
    }
  } finally {
    await runner.stop();
  }
  return results;
}

function visualSection(results: CorpusResult[]): string[] {
  const v = results.filter((r) => r.visual);
  if (!v.length) return [];
  const match = v.filter((r) => r.visual === "match"), differ = v.filter((r) => r.visual === "differ");
  const compared = match.length + differ.length;
  return [
    "## 見た目の一致（JAVA2D・決定的）",
    "",
    `比較 ${compared} 本中 **${match.length} 本一致（${compared ? ((match.length / compared) * 100).toFixed(0) : "-"}%）**。決定的でないので比べなかったもの ${v.filter((r) => r.visual === "nondeterministic").length} 本、参照が作れなかったもの ${v.filter((r) => r.visual === "noref").length} 本。`,
    "",
    "| 不一致のスケッチ | 差分 |",
    "|---|---:|",
    ...differ.sort((a, b) => (b.diffRatio ?? 0) - (a.diffRatio ?? 0)).map((r) => `| ${r.name} | ${((r.diffRatio ?? 0) * 100).toFixed(2)}% |`),
    "",
  ];
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
    results.some((r) => r.visual)
      ? "見た目の一致（`--ref`）: JAVA2D で完走し、時刻や種なしの乱数に依存しないスケッチを、本物の Processing の同じフレームと比べた（視覚テストと同じ基準: 不一致ピクセル 1% 以下）。"
      : "「ok」はエラーなく完走したことだけを意味し、見た目の一致は確認していない（`--ref` で比較する）。",
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
    ...visualSection(results),
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
  lines.push("", "## 全スケッチ", "", "| スケッチ | レンダラ | 結果 | 見た目 | 変換 ms | 最初のエラー |", "|---|---|---|---|---:|---|");
  for (const r of results) {
    const vis = r.visual === "match" || r.visual === "differ" ? `${r.visual} ${((r.diffRatio ?? 0) * 100).toFixed(2)}%` : r.visual ?? "";
    lines.push(`| ${r.name} | ${r.renderer} | ${r.outcome} | ${vis} | ${r.transpileMs.toFixed(0)} | ${(r.error ?? "").replace(/\|/g, "\\|").slice(0, 100)} |`);
  }
  return lines.join("\n") + "\n";
}
