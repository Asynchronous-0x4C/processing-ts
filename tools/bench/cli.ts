#!/usr/bin/env node
// Performance and bundle size measurements with budget checks (see docs/TESTING.md).
// Usage: node tools/bench/cli.ts <parse|compile|transpile|size|all>... [--runs n] [--filter text] [--update-budget]
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { parseArgs } from "node:util";
import { build } from "esbuild";
import { BrowserRunner } from "../vt/browser.ts";
import { collectInputs, type BenchInput } from "./inputs.ts";

const ROOT = path.resolve(import.meta.dirname, "../..");
const OUT_DIR = path.join(ROOT, "tests/bench/out");
const CACHE = path.join(ROOT, "node_modules/.cache/processing-ts-bench");
const BUDGET_FILE = path.join(import.meta.dirname, "budget.json");

type Budget = {
  /** Upper bounds that fail the run when exceeded (regression guards). */
  size: Record<string, { gzipKiB: number; targetKiB?: number }>;
  parse: Record<string, { warmMs: number }>;
  compile: Record<string, { warmMs: number }>;
  transpile: Record<string, { coldMs: number }>;
};

type Row = { name: string; values: Record<string, string | number>; over?: string };

const { values: flags, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    runs: { type: "string", default: "20" },
    filter: { type: "string" },
    "update-budget": { type: "boolean", default: false },
    help: { type: "boolean", short: "h", default: false },
  },
});

const budget: Budget = JSON.parse(fs.readFileSync(BUDGET_FILE, "utf8"));
const RUNS = Number(flags.runs);

function median(xs: number[]) {
  const s = [...xs].sort((a, b) => a - b);
  return s.length ? s[Math.floor(s.length / 2)] : NaN;
}

function concat(input: BenchInput) {
  // SketchManager joins tabs with "\n" before transpiling.
  return input.sketch.files.map((f) => f.content).join("\n");
}

function inputs(which: string[]) {
  const all = collectInputs(ROOT, which);
  return flags.filter ? all.filter((i) => i.name.includes(flags.filter!)) : all;
}

function table(title: string, columns: string[], rows: Row[]): string {
  const lines = [`## ${title}`, "", `| name | ${columns.join(" | ")} | budget |`, `|---|${columns.map(() => "---:").join("|")}|---|`];
  for (const r of rows) lines.push(`| ${r.name} | ${columns.map((c) => r.values[c] ?? "-").join(" | ")} | ${r.over ?? "ok"} |`);
  return lines.join("\n") + "\n";
}

const ms = (x: number) => x.toFixed(1);

// --- parse: Node, ANTLR parser only (src/lib/transpiler/SketchParser.ts), one fresh process per input
async function benchParse(): Promise<{ md: string; failed: boolean; data: unknown }> {
  fs.mkdirSync(path.join(CACHE, "inputs"), { recursive: true });
  await build({
    entryPoints: [path.join(ROOT, "src/lib/transpiler/SketchParser.ts")],
    bundle: true, format: "esm", platform: "node", outfile: path.join(CACHE, "parse.mjs"), logLevel: "silent",
  });
  const runner = path.join(CACHE, "parse-runner.mjs");
  fs.writeFileSync(runner, `import fs from "node:fs";
import { parseSketch } from "./parse.mjs";
const src = fs.readFileSync(process.argv[2], "utf8");
const runs = Number(process.argv[3]);
let t = performance.now();
const first = parseSketch(src);
const cold = performance.now() - t;
const times = [];
for (let i = 0; i < runs; i++) { t = performance.now(); parseSketch(src); times.push(performance.now() - t); }
times.sort((a, b) => a - b);
console.log(JSON.stringify({ cold, warm: times[Math.floor(times.length / 2)], error: first.error.error ? first.error.getErrorMessage() : null }));
`);
  const rows: Row[] = [];
  const data: Record<string, unknown> = {};
  let failed = false;
  for (const input of inputs(["samples", "cases", "synthetic"])) {
    const file = path.join(CACHE, "inputs", input.name.replace(/[\\/]/g, "_") + ".pde");
    fs.writeFileSync(file, concat(input));
    const p = spawnSync(process.execPath, [runner, file, String(RUNS)], { encoding: "utf8" });
    if (p.status !== 0) throw new Error(`parse runner failed for ${input.name}:\n${p.stderr}`);
    const r = JSON.parse(p.stdout.trim().split("\n").pop()!) as { cold: number; warm: number; error: string | null };
    data[input.name] = { lines: input.lines, ...r };
    const limit = budget.parse[input.name]?.warmMs;
    const over = limit !== undefined && r.warm > limit ? `**over ${limit}ms**` : limit !== undefined ? `≤ ${limit}ms` : undefined;
    if (limit !== undefined && r.warm > limit) failed = true;
    rows.push({ name: input.name, values: { lines: input.lines, "cold ms": ms(r.cold), "warm ms": ms(r.warm), error: r.error ? "yes" : "" }, over });
  }
  return { md: table(`parse (Node ${process.version}, median of ${RUNS} warm runs)`, ["lines", "cold ms", "warm ms", "error"], rows), failed, data };
}

// --- compile: Node, the new compiler's front end (src/compiler/parse.ts: Lezer parse per tab, syntax
// errors, AST), one fresh process per input
async function benchCompile(): Promise<{ md: string; failed: boolean; data: unknown }> {
  fs.mkdirSync(path.join(CACHE, "inputs"), { recursive: true });
  await build({
    entryPoints: [path.join(ROOT, "src/compiler/parse.ts")],
    bundle: true, format: "esm", platform: "node", outfile: path.join(CACHE, "compile.mjs"), logLevel: "silent",
  });
  const runner = path.join(CACHE, "compile-runner.mjs");
  fs.writeFileSync(runner, `import fs from "node:fs";
import { parseSketch } from "./compile.mjs";
const tabs = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const runs = Number(process.argv[3]);
let t = performance.now();
const first = parseSketch(tabs);
const cold = performance.now() - t;
const times = [];
for (let i = 0; i < runs; i++) { t = performance.now(); parseSketch(tabs); times.push(performance.now() - t); }
times.sort((a, b) => a - b);
console.log(JSON.stringify({ cold, warm: times[Math.floor(times.length / 2)], diagnostics: first.diagnostics.length }));
`);
  const rows: Row[] = [];
  const data: Record<string, unknown> = {};
  let failed = false;
  for (const input of inputs(["samples", "cases", "synthetic"])) {
    const file = path.join(CACHE, "inputs", input.name.replace(/[\\/]/g, "_") + ".json");
    fs.writeFileSync(file, JSON.stringify(input.sketch.files.map((f) => ({ name: f.name, text: f.content }))));
    const p = spawnSync(process.execPath, [runner, file, String(RUNS)], { encoding: "utf8" });
    if (p.status !== 0) throw new Error(`compile runner failed for ${input.name}:\n${p.stderr}`);
    const r = JSON.parse(p.stdout.trim().split("\n").pop()!) as { cold: number; warm: number; diagnostics: number };
    data[input.name] = { lines: input.lines, ...r };
    const limit = budget.compile[input.name]?.warmMs;
    const over = limit !== undefined && r.warm > limit ? `**over ${limit}ms**` : limit !== undefined ? `≤ ${limit}ms` : undefined;
    if (limit !== undefined && r.warm > limit) failed = true;
    rows.push({ name: input.name, values: { lines: input.lines, "cold ms": ms(r.cold), "warm ms": ms(r.warm), diagnostics: r.diagnostics || "" }, over });
  }
  return { md: table(`compile: new compiler front end, parse + AST (Node ${process.version}, median of ${RUNS} warm runs)`, ["lines", "cold ms", "warm ms", "diagnostics"], rows), failed, data };
}

// --- transpile: headless Chromium, the full transpiler through SketchManager, fresh page per input
async function benchTranspile(): Promise<{ md: string; failed: boolean; data: unknown }> {
  const runner = new BrowserRunner({ projectRoot: ROOT });
  await runner.start();
  const rows: Row[] = [];
  const data: Record<string, unknown> = {};
  let failed = false;
  try {
    for (const input of inputs(["samples", "cases", "synthetic"])) {
      const runs = await runner.transpileTimes(input.sketch, Math.min(RUNS, 10) + 1);
      const cold = runs[0];
      const warm = runs.slice(1);
      const r = {
        lines: input.lines,
        coldMs: cold.total,
        coldParseMs: cold.timings?.parse ?? NaN,
        warmMs: median(warm.map((x) => x.total)),
        warmParseMs: median(warm.map((x) => x.timings?.parse ?? NaN)),
        error: cold.error ?? null,
      };
      data[input.name] = r;
      const limit = budget.transpile[input.name]?.coldMs;
      const over = limit !== undefined && r.coldMs > limit ? `**over ${limit}ms**` : limit !== undefined ? `≤ ${limit}ms` : undefined;
      if (limit !== undefined && r.coldMs > limit) failed = true;
      rows.push({
        name: input.name,
        values: { lines: r.lines, "cold ms (parse)": `${ms(r.coldMs)} (${ms(r.coldParseMs)})`, "warm ms (parse)": `${ms(r.warmMs)} (${ms(r.warmParseMs)})`, error: r.error ? "yes" : "" },
        over,
      });
    }
  } finally {
    await runner.stop();
  }
  return { md: table("transpile (headless Chromium, cold = first run in a fresh page)", ["lines", "cold ms (parse)", "warm ms (parse)", "error"], rows), failed, data };
}

// --- size: esbuild bundles (minified ESM) and their gzip/brotli sizes
const SIZE_ENTRIES = [
  { name: "library (pixi.js external)", entry: "src/lib/index.ts", external: ["pixi.js"] },
  { name: "library + pixi.js", entry: "src/lib/index.ts", external: [] },
  { name: "parser (antlr4 + generated)", entry: "src/lib/transpiler/SketchParser.ts", external: [] },
  { name: "parser (lezer, src/compiler/grammar)", entry: "src/compiler/grammar/parser.ts", external: [] },
  { name: "compiler front end (lezer + AST, src/compiler/parse.ts)", entry: "src/compiler/parse.ts", external: [] },
];

async function benchSize(): Promise<{ md: string; failed: boolean; data: unknown }> {
  const rows: Row[] = [];
  const data: Record<string, unknown> = {};
  let failed = false;
  for (const e of SIZE_ENTRIES) {
    const result = await build({
      entryPoints: [path.join(ROOT, e.entry)], bundle: true, minify: true, format: "esm", platform: "browser",
      external: e.external, write: false, logLevel: "silent",
    });
    const code = result.outputFiles[0].contents;
    const kib = (n: number) => n / 1024;
    const r = {
      minKiB: kib(code.length),
      gzipKiB: kib(zlib.gzipSync(code, { level: 9 }).length),
      brotliKiB: kib(zlib.brotliCompressSync(code, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11 } }).length),
    };
    data[e.name] = r;
    const b = budget.size[e.name];
    let over: string | undefined;
    if (b) {
      if (r.gzipKiB > b.gzipKiB) {
        failed = true;
        over = `**over ${b.gzipKiB} KiB**`;
      } else {
        over = `≤ ${b.gzipKiB} KiB`;
      }
      if (b.targetKiB !== undefined) over += ` (target ${b.targetKiB} KiB)`;
    }
    rows.push({ name: e.name, values: { "min KiB": r.minKiB.toFixed(1), "gzip KiB": r.gzipKiB.toFixed(1), "brotli KiB": r.brotliKiB.toFixed(1) }, over });
  }
  return { md: table("bundle size (esbuild --bundle --minify, gzip -9, brotli q11)", ["min KiB", "gzip KiB", "brotli KiB"], rows), failed, data };
}

function usage(): never {
  console.log(`processing-ts benchmarks

  node tools/bench/cli.ts parse      Parser speed in Node (cold = fresh process; warm = median)
  node tools/bench/cli.ts compile    New compiler front end in Node (parse + AST per tab)
  node tools/bench/cli.ts transpile  Full transpile in headless Chromium (cold = fresh page)
  node tools/bench/cli.ts size       Bundle sizes (min / gzip / brotli)
  node tools/bench/cli.ts all

  --runs n          warm runs per input (default 20)
  --filter text     only inputs whose name contains text
  --update-budget   rewrite tools/bench/budget.json limits from current values (+5% size, +50% time)

Budgets (tools/bench/budget.json) are regression guards: the command exits 1 when one is exceeded.
Results: tests/bench/out/<command>.md and .json`);
  process.exit(2);
}

if (flags.help || positionals.length === 0) usage();
const commands: Record<string, () => Promise<{ md: string; failed: boolean; data: unknown }>> = {
  parse: benchParse,
  compile: benchCompile,
  transpile: benchTranspile,
  size: benchSize,
};
const selected = positionals.includes("all") ? Object.keys(commands) : positionals;
if (!selected.every((c) => c in commands)) usage();

fs.mkdirSync(OUT_DIR, { recursive: true });
let anyFailed = false;
for (const c of selected) {
  const { md, failed, data } = await commands[c]();
  console.log(md);
  fs.writeFileSync(path.join(OUT_DIR, `${c}.md`), md);
  fs.writeFileSync(path.join(OUT_DIR, `${c}.json`), JSON.stringify(data, null, 2));
  if (flags["update-budget"]) updateBudget(c, data as Record<string, any>);
  anyFailed ||= failed && !flags["update-budget"];
}
if (flags["update-budget"]) fs.writeFileSync(BUDGET_FILE, JSON.stringify(budget, null, 2) + "\n");
if (anyFailed) console.log("Budget exceeded. If the change is intended, run with --update-budget and commit tools/bench/budget.json.");
process.exit(anyFailed ? 1 : 0);

function updateBudget(c: string, data: Record<string, any>) {
  // Sizes are deterministic (5% headroom); timings are noisy, especially cold ones (50% headroom).
  const up = (x: number, f: number) => Math.ceil(x * f * 10) / 10;
  if (c === "size") for (const k of Object.keys(budget.size)) if (data[k]) budget.size[k].gzipKiB = up(data[k].gzipKiB, 1.05);
  if (c === "parse") for (const k of Object.keys(budget.parse)) if (data[k]) budget.parse[k].warmMs = Math.max(5, up(data[k].warm, 1.5));
  if (c === "compile") for (const k of Object.keys(budget.compile)) if (data[k]) budget.compile[k].warmMs = Math.max(5, up(data[k].warm, 1.5));
  if (c === "transpile") for (const k of Object.keys(budget.transpile)) if (data[k]) budget.transpile[k].coldMs = Math.max(5, up(data[k].coldMs, 1.5));
}
