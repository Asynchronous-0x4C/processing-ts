#!/usr/bin/env node
// Type checker conformance: compare accept/reject (and the first error's line) of the new compiler's
// front end + checker (src/compiler) with the real Processing (`Processing cli --build`: preprocessor +
// ECJ). Inputs: Processing's bundled examples, the repository's sketches, and deterministic semantic
// mutations of them (tools/check/mutations.ts). Processing's results are cached by source hash.
// Usage: node tools/check/compare.ts [--filter text] [--no-mutations] [--jobs n] [--show n]
import { spawn } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { parseArgs } from "node:util";
import { checkSketch } from "../../src/compiler/check.ts";
import { formatDiagnostic, type Diagnostic } from "../../src/compiler/diagnostics.ts";
import { parseSketch, type ParseResult } from "../../src/compiler/parse.ts";
import { findExamples, findSketches } from "../vt/corpus.ts";
import { findProcessing } from "../vt/processing.ts";
import { readSketch } from "../vt/sketch.ts";
import { mutations, type Tab } from "./mutations.ts";

const ROOT = path.resolve(import.meta.dirname, "../..");
const CACHE = path.join(ROOT, "node_modules/.cache/processing-ts-check");
const OUT = path.join(ROOT, "tests/check/out");

const { values: flags } = parseArgs({
  options: {
    filter: { type: "string" },
    "no-mutations": { type: "boolean", default: false },
    jobs: { type: "string", default: String(Math.max(2, Math.min(6, os.cpus().length - 2))) },
    show: { type: "string", default: "40" },
    processing: { type: "string" },
  },
});

type Input = { name: string; tabs: Tab[]; kind: "valid" | string };
type Verdict = { ok: boolean; errors: { tab: string; line: number; message: string }[]; raw?: string };

function collect(): Input[] {
  const dirs: string[] = [];
  const examples = findExamples(findProcessing(flags.processing));
  if (examples) dirs.push(...findSketches(examples));
  const withPde = (dir: string): string[] => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    if (entries.some((e) => e.isFile() && e.name.endsWith(".pde"))) return [dir];
    return entries.filter((e) => e.isDirectory() && e.name !== "data").flatMap((e) => withPde(path.join(dir, e.name)));
  };
  for (const r of ["public/samples", "tests/visual/cases"]) dirs.push(...withPde(path.join(ROOT, r)));
  const inputs: Input[] = [];
  for (const d of dirs) {
    const name = (examples && d.startsWith(examples) ? path.relative(examples, d) : path.relative(ROOT, d)).replace(/\\/g, "/");
    if (flags.filter && !name.includes(flags.filter)) continue;
    const sk = readSketch(d);
    const tabs = sk.files.map((f) => ({ name: f.name, text: f.content }));
    inputs.push({ name, tabs, kind: "valid" });
    if (flags["no-mutations"]) continue;
    const p = parseSketch(tabs);
    if (p.diagnostics.length) continue;
    checkSketch(p.files);
    for (const m of mutations(p)) inputs.push({ name: `${name} [${m.kind}]`, tabs: m.tabs, kind: m.kind });
  }
  return inputs;
}

// --- Processing ------------------------------------------------------------------------------------

function hash(tabs: Tab[]): string {
  return crypto.createHash("sha1").update(JSON.stringify(tabs)).digest("hex");
}

function runProcessing(exe: string, tabs: Tab[]): Promise<Verdict> {
  const key = hash(tabs);
  const cached = path.join(CACHE, key + ".json");
  if (fs.existsSync(cached)) {
    // Entries written before decodeConsole: repair the Shift_JIS quotes.
    const v = JSON.parse(fs.readFileSync(cached, "utf8").replace(/�g/g, "“").replace(/�h/g, "”")) as Verdict;
    return Promise.resolve(v);
  }
  const work = fs.mkdtempSync(path.join(os.tmpdir(), "pts-check-"));
  const main = tabs[0].name.replace(/\.pde$/, "");
  const dir = path.join(work, main);
  fs.mkdirSync(dir);
  for (const t of tabs) fs.writeFileSync(path.join(dir, t.name), t.text);
  return new Promise((resolve) => {
    const p = spawn(exe, ["cli", `--sketch=${dir}`, `--output=${path.join(work, "out")}`, "--force", "--build"], { stdio: ["ignore", "pipe", "pipe"] });
    const chunks: Buffer[] = [];
    p.stdout.on("data", (d: Buffer) => chunks.push(d));
    p.stderr.on("data", (d: Buffer) => chunks.push(d));
    const timer = setTimeout(() => p.kill(), 120_000);
    p.on("close", () => {
      clearTimeout(timer);
      const raw = decodeConsole(Buffer.concat(chunks));
      fs.rmSync(work, { recursive: true, force: true });
      const errors: Verdict["errors"] = [];
      for (const line of raw.split(/\r?\n/)) {
        const m = /^(.+?\.pde):(\d+):\d+:\d+:\d+: (.*)$/.exec(line);
        if (m) errors.push({ tab: m[1], line: Number(m[2]), message: m[3].trim() });
      }
      const ok = errors.length === 0 && /Finished\./.test(raw);
      const v: Verdict = { ok, errors, ...(ok ? {} : { raw: raw.trim().slice(0, 2000) }) };
      fs.mkdirSync(CACHE, { recursive: true });
      fs.writeFileSync(cached, JSON.stringify(v));
      resolve(v);
    });
  });
}

async function pool<T, R>(items: T[], jobs: number, f: (x: T, i: number) => Promise<R>, progress?: (done: number) => void): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let next = 0;
  let done = 0;
  await Promise.all(Array.from({ length: jobs }, async () => {
    while (next < items.length) {
      const i = next++;
      out[i] = await f(items[i], i);
      progress?.(++done);
    }
  }));
  return out;
}

/** Processing prints in the console code page (e.g. Shift_JIS on Japanese Windows), not always UTF-8. */
function decodeConsole(b: Buffer): string {
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(b);
  } catch {
    try {
      return new TextDecoder("shift_jis").decode(b);
    } catch {
      return b.toString("latin1");
    }
  }
}

// --- ours ----------------------------------------------------------------------------------------

function ours(tabs: Tab[]): { ok: boolean; diagnostics: Diagnostic[]; p: ParseResult; ms: number } {
  const t0 = performance.now();
  const p = parseSketch(tabs);
  const diagnostics = p.diagnostics.length ? p.diagnostics : checkSketch(p.files).diagnostics;
  return { ok: diagnostics.length === 0, diagnostics, p, ms: performance.now() - t0 };
}

// --- main ----------------------------------------------------------------------------------------

const exe = findProcessing(flags.processing);
if (!exe) {
  console.error("Processing not found (--processing <path> or PROCESSING_PATH).");
  process.exit(2);
}
const inputs = collect();
const uncached = inputs.filter((i) => !fs.existsSync(path.join(CACHE, hash(i.tabs) + ".json"))).length;
if (uncached) console.log(`Running Processing on ${uncached} of ${inputs.length} inputs (${flags.jobs} in parallel; results are cached)...`);
const started = Date.now();
const refs = await pool(inputs, Number(flags.jobs), (i) => runProcessing(exe, i.tabs), (n) => {
  if (uncached && n % 50 === 0) console.log(`  ${n}/${inputs.length} (${((Date.now() - started) / 1000).toFixed(0)}s)`);
});

const rows = inputs.map((input, i) => ({ input, ref: refs[i], mine: ours(input.tabs) }));
const esc = (s: string) => s.replace(/\|/g, "\\|").replace(/\n/g, " ");
const agree = rows.filter((r) => r.ref.ok === r.mine.ok);
const falsePositives = rows.filter((r) => r.ref.ok && !r.mine.ok);
const falseNegatives = rows.filter((r) => !r.ref.ok && r.mine.ok);
const unsupported = falsePositives.filter((r) => r.mine.diagnostics.every((d) => d.code === "unsupported"));
const bothReject = rows.filter((r) => !r.ref.ok && !r.mine.ok && r.ref.errors.length);
const lineOf = (r: (typeof rows)[number], d: Diagnostic) => {
  const l = r.mine.p.source.locate(d.start);
  return { tab: l.tab.name, line: l.line };
};
const sameLine = bothReject.filter((r) => r.mine.diagnostics.some((d) => {
  const l = lineOf(r, d);
  return l.tab === r.ref.errors[0].tab && l.line === r.ref.errors[0].line;
}));
// Results cached before decodeConsole existed show Shift_JIS quotes as "\uFFFDg" / "\uFFFDh".
const normalize = (s: string) => s.replace(/\uFFFD[gh]|[“”"]/g, "\"").replace(/\s+/g, " ").trim();
const sameMessage = bothReject.filter((r) => r.mine.diagnostics.some((d) => normalize(d.message) === normalize(r.ref.errors[0].message)));
const kinds = [...new Set(inputs.map((i) => i.kind))];

const lines = [
  "# Type checker conformance: processing-ts vs Processing (cli --build)",
  "",
  `agreement: **${agree.length}/${rows.length}** — false positives (we reject valid code): ${falsePositives.length} (of which "unsupported in processing-ts": ${unsupported.length}), false negatives (we accept invalid code): ${falseNegatives.length}`,
  `both reject: ${bothReject.length} — first Processing error's line among ours: ${sameLine.length}, same message: ${sameMessage.length}`,
  `check time (parse + check, all inputs): ${rows.reduce((a, r) => a + r.mine.ms, 0).toFixed(0)}ms`,
  "",
  "| input kind | inputs | Processing rejects | agreement |",
  "|---|---:|---:|---:|",
  ...kinds.map((k) => {
    const rs = rows.filter((r) => r.input.kind === k);
    return `| ${k} | ${rs.length} | ${rs.filter((r) => !r.ref.ok).length} | ${rs.filter((r) => r.ref.ok === r.mine.ok).length}/${rs.length} |`;
  }),
  "",
  "## False positives (Processing accepts, we reject)",
  "",
  "| input | our first error |",
  "|---|---|",
  ...falsePositives.slice(0, Number(flags.show)).map((r) => `| ${r.input.name} | ${esc(formatDiagnostic(r.mine.p.source, r.mine.diagnostics[0]))} [${r.mine.diagnostics[0].code}] |`),
  "",
  "## False negatives (Processing rejects, we accept)",
  "",
  "| input | Processing's error |",
  "|---|---|",
  ...falseNegatives.slice(0, Number(flags.show)).map((r) => `| ${r.input.name} | ${r.ref.errors[0] ? esc(`${r.ref.errors[0].tab}:${r.ref.errors[0].line}: ${r.ref.errors[0].message}`) : esc(r.ref.raw ?? "")} |`),
  "",
  "## Both reject, different line or message",
  "",
  "| input | Processing | ours |",
  "|---|---|---|",
  ...bothReject.filter((r) => !sameMessage.includes(r) || !sameLine.includes(r)).slice(0, Number(flags.show)).map((r) =>
    `| ${r.input.name} | ${esc(`${r.ref.errors[0].tab}:${r.ref.errors[0].line}: ${r.ref.errors[0].message}`)} | ${esc(formatDiagnostic(r.mine.p.source, r.mine.diagnostics[0]))} |`),
];
const md = lines.join("\n") + "\n";
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, "report.md"), md);
console.log(md);
console.log(`report: ${path.relative(ROOT, path.join(OUT, "report.md"))}`);
process.exit(falsePositives.length - unsupported.length > 0 || falseNegatives.length > 0 ? 1 : 0);
