#!/usr/bin/env node
// Visual / output regression tests: processing-ts (headless Chromium) vs. real Processing.
// Usage: node tools/vt/cli.ts <run|ref|shot|list> [...]   (see docs/TESTING.md)
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import { BrowserRunner, type BrowserRunResult } from "./browser.ts";
import { corpusReport, findExamples, runCorpus } from "./corpus.ts";
import { compare, composite, pngFromDataUrl, readPng, writePng } from "./image.ts";
import { findProcessing, renderReference } from "./processing.ts";
import { readSketch, type SketchSource } from "./sketch.ts";
import type { InputAction } from "./input.ts";

const ROOT = path.resolve(import.meta.dirname, "../..");
const CASES_DIR = path.join(ROOT, "tests/visual/cases");
const REFS_DIR = path.join(ROOT, "tests/visual/refs");

type CaseConfig = {
  /** Number of draw() calls before the frame is captured (static-mode sketches ignore this). */
  frames?: number;
  /** pixelmatch per-pixel color threshold (0..1). */
  threshold?: number;
  /** Maximum ratio of differing pixels for the image to count as matching. */
  maxDiffRatio?: number;
  /** "fail" marks a known gap: failing is reported as XFAIL, passing as XPASS. */
  expect?: "pass" | "fail";
  /** Why the case is expected to fail (shown in reports; delete together with expect when fixed). */
  knownIssue?: string;
  /** Compare println() output with the reference (default true). */
  stdout?: boolean;
  mode?: "static" | "active";
  /** Mouse/key actions replayed between frames in both runs (tools/vt/input.ts). */
  input?: InputAction[];
  tags?: string[];
  note?: string;
};

type Outcome = "pass" | "fail" | "xfail" | "xpass" | "no-ref";

type CaseResult = {
  name: string;
  outcome: Outcome;
  expect: "pass" | "fail";
  reasons: string[];
  note?: string;
  knownIssue?: string;
  diffRatio: number | null;
  refSize: string | null;
  actualSize: string | null;
  transpileMs: number;
  parseMs: number | null;
  setupMs: number;
  avgFrameMs: number;
  errors: string[];
  logs: string[];
  stdoutDiff?: { line: number; expected: string; actual: string };
  files: { ref?: string; actual?: string; diff?: string; composite?: string; transpiled?: string };
};

const DEFAULTS = { frames: 1, threshold: 0.1, maxDiffRatio: 0.01 };

function usage(): never {
  console.log(`processing-ts visual tests

  node tools/vt/cli.ts run  [case...] [--tag t] [--update] [--out dir] [--headed] [--gpu] [--json]
      Render cases in headless Chromium and compare with tests/visual/refs (made by real Processing).
      --update regenerates the references of the selected cases first (needs Processing).
  node tools/vt/cli.ts ref  [case...] [--tag t] [--missing]
      (Re)generate reference images/stdout with Processing. --missing: only absent or stale refs.
  node tools/vt/cli.ts shot <sketchDir> [--frames n] [--ref] [--out dir]
      Ad-hoc: render any sketch folder; with --ref also render it with Processing and diff.
  node tools/vt/cli.ts list [--tag t]
  node tools/vt/cli.ts corpus [--filter Basics/Shape] [--frames n] [--examples dir] [--timeout ms]
      Run Processing's bundled examples (254) through processing-ts and tally transpile/runtime errors.
      Writes tests/corpus/report.md (commit it to track progress).

  Processing is found via --processing <path>, $PROCESSING_PATH, or the platform default.
  Outputs go to tests/visual/out/ (report.md, report.json, <case>/composite.png = ref | actual | diff).`);
  process.exit(2);
}

const { values: flags, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    tag: { type: "string" },
    update: { type: "boolean", default: false },
    missing: { type: "boolean", default: false },
    ref: { type: "boolean", default: false },
    frames: { type: "string" },
    out: { type: "string" },
    processing: { type: "string" },
    headed: { type: "boolean", default: false },
    gpu: { type: "boolean", default: false },
    json: { type: "boolean", default: false },
    filter: { type: "string" },
    examples: { type: "string" },
    timeout: { type: "string" },
    help: { type: "boolean", short: "h", default: false },
  },
});

const [command, ...args] = positionals;
const OUT_DIR = path.resolve(flags.out ?? path.join(ROOT, "tests/visual/out"));

function listCases(names: string[]): { name: string; dir: string; config: CaseConfig }[] {
  if (!fs.existsSync(CASES_DIR)) return [];
  const all = fs
    .readdirSync(CASES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => {
      const dir = path.join(CASES_DIR, d.name);
      const cfgPath = path.join(dir, "vt.json");
      const config: CaseConfig = fs.existsSync(cfgPath) ? JSON.parse(fs.readFileSync(cfgPath, "utf8")) : {};
      return { name: d.name, dir, config };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
  let selected = names.length ? all.filter((c) => names.some((n) => c.name === n || c.name.startsWith(n))) : all;
  if (flags.tag) selected = selected.filter((c) => c.config.tags?.includes(flags.tag!));
  if (names.length && selected.length === 0) {
    console.error(`No case matches: ${names.join(", ")}`);
    process.exit(2);
  }
  return selected;
}

/** Hash of everything that influences the reference output. */
function sourceHash(sketch: SketchSource, frames: number, input?: InputAction[]): string {
  const h = crypto.createHash("sha1");
  // Normalize line endings: core.autocrlf may check sources out as CRLF.
  for (const f of sketch.files) h.update(f.name).update("\0").update(f.content.replace(/\r\n/g, "\n")).update("\0");
  const data = path.join(sketch.dir, "data");
  if (fs.existsSync(data)) {
    for (const f of fs.readdirSync(data, { recursive: true }).map(String).sort()) {
      const p = path.join(data, f);
      if (fs.statSync(p).isFile()) h.update(f).update(fs.readFileSync(p));
    }
  }
  if (input?.length) h.update(JSON.stringify(input));
  return h.update(`frames=${frames}`).digest("hex");
}

function refPaths(name: string) {
  return {
    png: path.join(REFS_DIR, `${name}.png`),
    stdout: path.join(REFS_DIR, `${name}.stdout.txt`),
    meta: path.join(REFS_DIR, `${name}.meta.json`),
  };
}

function requireProcessing(): string {
  const p = findProcessing(flags.processing);
  if (!p) {
    console.error("Processing not found. Pass --processing <path to Processing executable> or set PROCESSING_PATH.");
    process.exit(2);
  }
  return p;
}

async function generateRefs(cases: ReturnType<typeof listCases>, onlyMissing: boolean): Promise<number> {
  const processing = requireProcessing();
  let failures = 0;
  for (const c of cases) {
    const sketch = readSketch(c.dir);
    const frames = c.config.frames ?? DEFAULTS.frames;
    const hash = sourceHash(sketch, frames, c.config.input);
    const paths = refPaths(c.name);
    if (onlyMissing && fs.existsSync(paths.meta)) {
      const meta = JSON.parse(fs.readFileSync(paths.meta, "utf8"));
      if (meta.sourceHash === hash && fs.existsSync(paths.png)) continue;
    }
    process.stdout.write(`ref    ${c.name.padEnd(28)} `);
    const r = await renderReference(sketch, { processing, frames, outPng: paths.png, mode: c.config.mode, input: c.config.input });
    if (!r.ok) {
      failures++;
      console.log(`ERROR  ${r.error}\n${r.messages.map((m) => "         " + m).join("\n")}`);
      continue;
    }
    fs.writeFileSync(paths.stdout, r.stdout.join("\n") + (r.stdout.length ? "\n" : ""));
    const png = readPng(paths.png);
    fs.writeFileSync(
      paths.meta,
      JSON.stringify({ sourceHash: hash, frames, width: png.width, height: png.height, processing: processingVersion(processing) }, null, 2) + "\n",
    );
    const warn = r.messages.length ? `  (${r.messages.join(" / ")})` : "";
    console.log(`ok     ${png.width}x${png.height} in ${(r.durationMs / 1000).toFixed(1)}s${warn}`);
  }
  return failures;
}

function processingVersion(exe: string): string {
  // e.g. C:/Program Files/Processing/app/core-4.5.2-<hash>.jar
  try {
    const appDir = path.join(path.dirname(exe), "app");
    const core = fs.readdirSync(appDir).find((f) => /^core-\d/.test(f));
    const m = core?.match(/^core-([\d.]+)/);
    if (m) return m[1];
  } catch {
    // unknown layout
  }
  return "unknown";
}

function firstStdoutMismatch(expected: string[], actual: string[]) {
  const n = Math.max(expected.length, actual.length);
  for (let i = 0; i < n; i++) {
    if ((expected[i] ?? "<missing>") !== (actual[i] ?? "<missing>")) {
      return { line: i + 1, expected: expected[i] ?? "<missing>", actual: actual[i] ?? "<missing>" };
    }
  }
  return undefined;
}

function evaluate(
  c: { name: string; dir: string; config: CaseConfig },
  run: BrowserRunResult,
  outDir: string,
): CaseResult {
  const cfg = { ...DEFAULTS, ...c.config };
  const expect = cfg.expect ?? "pass";
  const paths = refPaths(c.name);
  const reasons: string[] = [];
  const files: CaseResult["files"] = {};
  fs.mkdirSync(outDir, { recursive: true });

  const actual = run.png ? pngFromDataUrl(run.png) : null;
  if (actual) writePng((files.actual = path.join(outDir, "actual.png")), actual);
  if (run.code !== undefined) fs.writeFileSync((files.transpiled = path.join(outDir, "transpiled.js")), run.code);
  if (!run.ok) reasons.push(`runtime ${run.phase}: ${(run.errors[0] ?? "failed").split("\n")[0]}`);

  const hasRef = fs.existsSync(paths.png);
  let diffRatio: number | null = null;
  let refSize: string | null = null;
  let diffPng = null;
  const ref = hasRef ? readPng(paths.png) : null;
  if (ref) {
    files.ref = paths.png;
    refSize = `${ref.width}x${ref.height}`;
    if (fs.existsSync(paths.meta)) {
      const meta = JSON.parse(fs.readFileSync(paths.meta, "utf8"));
      if (meta.sourceHash !== sourceHash(readSketch(c.dir), cfg.frames, cfg.input)) reasons.push("reference is stale (sources changed): run `npm run test:visual:ref -- " + c.name + "`");
    }
    if (actual) {
      const r = compare(ref, actual, cfg.threshold, (files.diff = path.join(outDir, "diff.png")));
      diffRatio = r.diffRatio;
      diffPng = readPng(files.diff);
      if (r.sizeMismatch) reasons.push(`size mismatch: ref ${ref.width}x${ref.height}, actual ${actual.width}x${actual.height}`);
      if (r.diffRatio > cfg.maxDiffRatio) reasons.push(`image differs: ${(r.diffRatio * 100).toFixed(2)}% > ${(cfg.maxDiffRatio * 100).toFixed(2)}%`);
    }
  }
  files.composite = path.join(outDir, "composite.png");
  composite([ref, actual, diffPng], files.composite);

  let stdoutDiff: CaseResult["stdoutDiff"];
  if (cfg.stdout !== false && fs.existsSync(paths.stdout)) {
    const expected = fs.readFileSync(paths.stdout, "utf8").split(/\r?\n/).filter((l, i, a) => i < a.length - 1 || l !== "");
    stdoutDiff = firstStdoutMismatch(expected, run.logs);
    if (stdoutDiff) reasons.push(`stdout differs at line ${stdoutDiff.line}: expected ${JSON.stringify(stdoutDiff.expected)}, got ${JSON.stringify(stdoutDiff.actual)}`);
  }

  let outcome: Outcome;
  if (!hasRef) {
    outcome = "no-ref";
    reasons.unshift("no reference: run `npm run test:visual:ref -- " + c.name + "`");
  } else {
    const failed = reasons.some((r) => !r.startsWith("reference is stale"));
    outcome = expect === "fail" ? (failed ? "xfail" : "xpass") : failed ? "fail" : "pass";
  }
  const avg = run.frameMs.length ? run.frameMs.reduce((a, b) => a + b, 0) / run.frameMs.length : 0;
  return {
    name: c.name, outcome, expect, reasons, note: cfg.note, knownIssue: cfg.knownIssue, diffRatio, refSize,
    actualSize: actual ? `${actual.width}x${actual.height}` : null,
    transpileMs: run.transpileMs, parseMs: run.timings?.parse ?? null, setupMs: run.setupMs, avgFrameMs: avg,
    errors: [...run.errors, ...run.console.filter((l) => l.startsWith("[pageerror]") || l.startsWith("[error]"))],
    logs: run.logs, stdoutDiff, files,
  };
}

function rel(p?: string, from = OUT_DIR) {
  return p ? path.relative(from, p).replace(/\\/g, "/") : "";
}

function writeReport(results: CaseResult[]) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, "report.json"), JSON.stringify(results, null, 2));
  const count = (o: Outcome) => results.filter((r) => r.outcome === o).length;
  const lines = [
    "# Visual test report",
    "",
    `${count("pass")} pass, ${count("fail")} fail, ${count("xfail")} xfail, ${count("xpass")} xpass, ${count("no-ref")} no-ref`,
    "",
    "Composite images: left = Processing (blue), middle = processing-ts (green), right = diff (red).",
    "",
    "| case | outcome | diff | transpile ms (parse) | setup ms | frame ms | reasons |",
    "|---|---|---|---|---|---|---|",
    ...results.map(
      (r) =>
        `| [${r.name}](${rel(r.files.composite)}) | ${r.outcome.toUpperCase()} | ${r.diffRatio === null ? "-" : (r.diffRatio * 100).toFixed(2) + "%"} | ${r.transpileMs.toFixed(1)} (${r.parseMs === null ? "-" : r.parseMs.toFixed(1)}) | ${r.setupMs.toFixed(1)} | ${r.avgFrameMs.toFixed(1)} | ${r.reasons.join("<br>").replace(/\|/g, "\\|")} |`,
    ),
    "",
  ];
  for (const r of results.filter((r) => r.outcome !== "pass")) {
    lines.push(`## ${r.name} — ${r.outcome.toUpperCase()}`, "");
    if (r.knownIssue) lines.push(`Known issue: ${r.knownIssue}`, "");
    if (r.note) lines.push(`Note: ${r.note}`, "");
    if (r.errors.length) lines.push("Errors:", "```", ...r.errors.slice(0, 10), "```", "");
    if (r.stdoutDiff) lines.push(`stdout line ${r.stdoutDiff.line}: expected \`${r.stdoutDiff.expected}\`, got \`${r.stdoutDiff.actual}\``, "");
    if (r.files.composite) lines.push(`![${r.name}](${rel(r.files.composite)})`, "");
  }
  fs.writeFileSync(path.join(OUT_DIR, "report.md"), lines.join("\n"));
}

async function cmdRun() {
  const cases = listCases(args);
  if (flags.update) await generateRefs(cases, false);
  const runner = new BrowserRunner({ projectRoot: ROOT, headed: flags.headed, gpu: flags.gpu });
  await runner.start();
  const results: CaseResult[] = [];
  try {
    for (const c of cases) {
      const sketch = readSketch(c.dir);
      const frames = flags.frames ? Number(flags.frames) : c.config.frames ?? DEFAULTS.frames;
      const run = await runner.run(sketch, frames, undefined, c.config.input);
      const r = evaluate(c, run, path.join(OUT_DIR, c.name));
      results.push(r);
      if (!flags.json) {
        const diff = r.diffRatio === null ? "   -   " : `${(r.diffRatio * 100).toFixed(2).padStart(6)}%`;
        console.log(`${r.outcome.toUpperCase().padEnd(6)} ${c.name.padEnd(28)} diff ${diff}  transpile ${r.transpileMs.toFixed(0).padStart(4)}ms  ${r.reasons[0] ?? ""}`);
      }
    }
  } finally {
    await runner.stop();
  }
  writeReport(results);
  const bad = results.filter((r) => r.outcome === "fail" || r.outcome === "no-ref");
  if (flags.json) {
    console.log(JSON.stringify(results.map(({ logs, ...r }) => r), null, 2));
  } else {
    const count = (o: Outcome) => results.filter((r) => r.outcome === o).length;
    console.log(`\n${count("pass")} pass, ${count("fail")} fail, ${count("xfail")} xfail, ${count("xpass")} xpass, ${count("no-ref")} no-ref`);
    console.log(`report: ${path.relative(ROOT, path.join(OUT_DIR, "report.md"))}`);
    if (count("xpass")) console.log("XPASS cases now match the reference: remove \"expect\": \"fail\" from their vt.json.");
  }
  process.exit(bad.length ? 1 : 0);
}

async function cmdShot() {
  const dir = args[0] ? path.resolve(args[0]) : usage();
  const sketch = readSketch(dir);
  const frames = flags.frames ? Number(flags.frames) : DEFAULTS.frames;
  const name = path.basename(dir);
  const outDir = path.join(OUT_DIR, "shot", name);
  fs.mkdirSync(outDir, { recursive: true });
  const runner = new BrowserRunner({ projectRoot: ROOT, headed: flags.headed, gpu: flags.gpu, extraFsAllow: [dir] });
  await runner.start();
  let run: BrowserRunResult;
  try {
    run = await runner.run(sketch, frames);
  } finally {
    await runner.stop();
  }
  const actual = run.png ? pngFromDataUrl(run.png) : null;
  if (actual) writePng(path.join(outDir, "actual.png"), actual);
  let ref = null;
  let diff = null;
  if (flags.ref) {
    const r = await renderReference(sketch, { processing: requireProcessing(), frames, outPng: path.join(outDir, "ref.png") });
    if (r.ok) {
      ref = readPng(path.join(outDir, "ref.png"));
      fs.writeFileSync(path.join(outDir, "ref.stdout.txt"), r.stdout.join("\n"));
      if (actual) {
        const c = compare(ref, actual, DEFAULTS.threshold, path.join(outDir, "diff.png"));
        diff = readPng(path.join(outDir, "diff.png"));
        console.log(`diff: ${(c.diffRatio * 100).toFixed(2)}%${c.sizeMismatch ? " (size mismatch)" : ""}`);
      }
    } else {
      console.log(`reference failed: ${r.error}\n${r.messages.join("\n")}`);
    }
  }
  composite(flags.ref ? [ref, actual, diff] : [actual], path.join(outDir, "composite.png"));
  fs.writeFileSync(path.join(outDir, "transpiled.js"), run.code ?? "");
  console.log(`phase: ${run.phase}  ok: ${run.ok}  size: ${run.width}x${run.height}  transpile: ${run.transpileMs.toFixed(1)}ms  setup: ${run.setupMs.toFixed(1)}ms`);
  if (run.logs.length) console.log("println:\n  " + run.logs.join("\n  "));
  if (run.errors.length) console.log("errors:\n  " + run.errors.join("\n  "));
  console.log(`output: ${path.relative(ROOT, outDir)} (composite.png, actual.png, transpiled.js${flags.ref ? ", ref.png, diff.png" : ""})`);
  process.exit(run.ok ? 0 : 1);
}

async function cmdCorpus() {
  const examples = findExamples(findProcessing(flags.processing), flags.examples);
  if (!examples) {
    console.error("Processing examples not found. Pass --examples <dir> (…/Processing/app/resources/modes/java/examples).");
    process.exit(2);
  }
  const frames = flags.frames ? Number(flags.frames) : 5;
  const results = await runCorpus({
    projectRoot: ROOT,
    examples,
    filter: flags.filter,
    frames,
    timeoutMs: flags.timeout ? Number(flags.timeout) : 20_000,
    onResult: (r, i, n) => console.log(`[${String(i + 1).padStart(3)}/${n}] ${r.outcome.padEnd(9)} ${r.name}${r.error ? "  " + r.error.slice(0, 90) : ""}`),
  });
  const exe = findProcessing(flags.processing);
  const md = corpusReport(results, { examples, frames, processing: exe ? processingVersion(exe) : "unknown" });
  const dir = path.join(ROOT, "tests/corpus");
  fs.mkdirSync(path.join(dir, "out"), { recursive: true });
  // A filtered run only updates the scratch output, not the tracked report.
  fs.writeFileSync(path.join(dir, flags.filter ? "out/report.md" : "report.md"), md);
  fs.writeFileSync(path.join(dir, "out/results.json"), JSON.stringify(results, null, 2));
  const ok = results.filter((r) => r.outcome === "ok").length;
  console.log(`
${ok}/${results.length} ran without errors. report: ${path.relative(ROOT, path.join(dir, flags.filter ? "out/report.md" : "report.md"))}`);
}

if (flags.help || !command) usage();
switch (command) {
  case "run":
    await cmdRun();
    break;
  case "ref":
    process.exit((await generateRefs(listCases(args), flags.missing)) ? 1 : 0);
  case "shot":
    await cmdShot();
    break;
  case "corpus":
    await cmdCorpus();
    break;
  case "list":
    for (const c of listCases(args)) {
      const has = fs.existsSync(refPaths(c.name).png) ? "ref" : "no-ref";
      console.log(`${c.name.padEnd(28)} ${has.padEnd(7)} ${(c.config.expect ?? "pass").padEnd(5)} ${(c.config.tags ?? []).join(",").padEnd(10)} ${c.config.knownIssue ?? c.config.note ?? ""}`);
    }
    break;
  default:
    usage();
}
