#!/usr/bin/env node
// Grammar conformance: compare accept/reject of the Lezer Processing grammar (src/compiler/grammar)
// with the official Processing ANTLR grammar used by the current transpiler (the oracle).
// Usage: node tools/grammar/compare.ts [--filter text] [--no-mutations] [--show n]
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import { build } from "esbuild";
import type { Tree } from "@lezer/common";
import { parser } from "../../src/compiler/grammar/parser.ts";
import { syntheticSketch } from "../bench/inputs.ts";
import { findExamples, findSketches } from "../vt/corpus.ts";
import { findProcessing } from "../vt/processing.ts";
import { blankCommentsAndStrings, readSketch } from "../vt/sketch.ts";

const ROOT = path.resolve(import.meta.dirname, "../..");
const CACHE = path.join(ROOT, "node_modules/.cache/processing-ts-grammar");
const OUT = path.join(ROOT, "tests/grammar/out");

const { values: flags } = parseArgs({
  options: {
    filter: { type: "string" },
    "no-mutations": { type: "boolean", default: false },
    show: { type: "string", default: "30" },
    examples: { type: "string" },
  },
});

type Input = { name: string; source: string; kind: "valid" | "mutated" };

// Top-level nodes allowed in active mode besides MethodDeclaration (fields, types, initializers).
const ACTIVE_OK = new Set(["MethodDeclaration", "LocalVariableDeclaration", "ClassDeclaration", "InterfaceDeclaration", "EnumDeclaration",
  "AnnotationTypeDeclaration", "ImportDeclaration", "PackageDeclaration", "Block", ";", "LineComment", "BlockComment"]);

/** Lezer verdict: no error nodes, and not mixing static statements with method declarations. */
export function lezerVerdict(source: string): { ok: boolean; reason?: string; pos?: number } {
  const tree: Tree = parser.parse(source);
  let errorAt = -1;
  tree.iterate({ enter: (n) => { if (errorAt < 0 && n.type.isError) errorAt = n.from; } });
  if (errorAt >= 0) return { ok: false, reason: "syntax", pos: errorAt };
  let hasMethod = false;
  let staticStmt: string | null = null;
  for (let c = tree.topNode.firstChild; c; c = c.nextSibling) {
    if (c.name === "MethodDeclaration") hasMethod = true;
    else if (!ACTIVE_OK.has(c.name) && staticStmt === null) staticStmt = c.name;
  }
  if (hasMethod && staticStmt) return { ok: false, reason: `mixed modes (${staticStmt})` };
  return { ok: true };
}

/** Deterministic syntax-error variants: drop the middle ";", ")" and "}" (outside comments/strings). */
function mutations(name: string, source: string): Input[] {
  const blank = blankCommentsAndStrings(source);
  const out: Input[] = [];
  for (const ch of [";", ")", "}"]) {
    const idx: number[] = [];
    for (let i = 0; i < blank.length; i++) if (blank[i] === ch) idx.push(i);
    if (idx.length === 0) continue;
    const at = idx[Math.floor(idx.length / 2)];
    out.push({ name: `${name} [-'${ch}'@${at}]`, source: source.slice(0, at) + source.slice(at + 1), kind: "mutated" });
  }
  return out;
}

function collect(): Input[] {
  const dirs: string[] = [];
  const examples = findExamples(findProcessing(), flags.examples);
  if (examples) dirs.push(...findSketches(examples));
  else console.warn("Processing examples not found; using repository sketches only.");
  // Repository sketches may name their main tab differently from the folder (sketch.properties).
  const withPde = (dir: string): string[] => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    if (entries.some((e) => e.isFile() && e.name.endsWith(".pde"))) return [dir];
    return entries.filter((e) => e.isDirectory() && e.name !== "data").flatMap((e) => withPde(path.join(dir, e.name)));
  };
  for (const root of ["public/samples", "tests/visual/cases"]) dirs.push(...withPde(path.join(ROOT, root)));
  const inputs: Input[] = [];
  for (const d of dirs) {
    const name = examples && d.startsWith(examples) ? path.relative(examples, d) : path.relative(ROOT, d);
    if (flags.filter && !name.includes(flags.filter)) continue;
    // Each tab is parsed on its own by the new compiler; the current transpiler joins them, which is
    // equivalent for accept/reject purposes because tabs only contain top-level declarations.
    const source = readSketch(d).files.map((f) => f.content).join("\n");
    inputs.push({ name: name.replace(/\\/g, "/"), source, kind: "valid" });
    if (!flags["no-mutations"]) inputs.push(...mutations(name.replace(/\\/g, "/"), source));
  }
  // Processing-specific constructs (must be accepted by both).
  const snippets: [string, string][] = [
    ["hex color", "color c = #FF8800;\nvoid setup() { fill(#80FFFFFF); }\n"],
    ["conversion functions", "void setup() { int a = int(3.5); float b = float(\"2\"); boolean c = boolean(1); char d = char(65); byte e = byte(300); }\n"],
    ["static mode", "size(200, 200);\nfor (int i = 0; i < 10; i++) {\n  point(i, i);\n}\n"],
    ["generic field", "ArrayList<PVector> pts = new ArrayList<PVector>();\nHashMap<String, Integer> m = new HashMap<>();\nvoid draw() {}\n"],
    ["lambda + method ref", "void setup() { Runnable r = () -> println(1); java.util.function.Function<String, Integer> f = Integer::parseInt; }\n"],
    ["interface default method", "interface Shape {\n  default float area() { return 0; }\n}\nvoid setup() {}\n"],
    ["anonymous class", "void setup() { Comparable<String> c = new Comparable<String>() { public int compareTo(String o) { return 0; } }; }\n"],
    ["text block", 'String s = """\n  hello\n  """;\nvoid setup() {}\n'],
    ["mixed modes (must reject)", "size(200, 200);\nvoid draw() { background(0); }\n"],
    ["type name as variable (must reject)", "void setup() { int float = 3; }\n"],
  ];
  snippets.push(["synthetic 5k-line sketch", syntheticSketch(5000)]);
  for (const [n, s] of snippets) if (!flags.filter || n.includes(flags.filter)) inputs.push({ name: `snippet: ${n}`, source: s, kind: "valid" });
  return inputs;
}

async function antlrVerdicts(inputs: Input[]): Promise<{ ok: boolean; message: string | null }[]> {
  fs.mkdirSync(CACHE, { recursive: true });
  await build({
    entryPoints: [path.join(ROOT, "src/lib/transpiler/SketchParser.ts")],
    bundle: true, format: "esm", platform: "node", outfile: path.join(CACHE, "antlr.mjs"), logLevel: "silent",
  });
  const inFile = path.join(CACHE, "inputs.json");
  fs.writeFileSync(inFile, JSON.stringify(inputs.map((i) => i.source)));
  const runner = path.join(CACHE, "antlr-runner.mjs");
  fs.writeFileSync(runner, `import fs from "node:fs";
import { parseSketch } from "./antlr.mjs";
const sources = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const out = sources.map((s) => { try { const { error } = parseSketch(s); return { ok: !error.error, message: error.error ? error.getErrorMessage() : null }; } catch (e) { return { ok: false, message: String(e) }; } });
fs.writeFileSync(process.argv[3], JSON.stringify(out));
`);
  const outFile = path.join(CACHE, "antlr-out.json");
  const p = spawnSync(process.execPath, [runner, inFile, outFile], { encoding: "utf8", maxBuffer: 1 << 26 });
  if (p.status !== 0) throw new Error(p.stderr);
  return JSON.parse(fs.readFileSync(outFile, "utf8"));
}

function lineOf(source: string, pos: number) {
  return source.slice(0, pos).split("\n").length;
}

/** Cold (fresh process) and warm parse time of one file with the Lezer parser. */
function lezerTiming(source: string) {
  const file = path.join(CACHE, "timing-input.pde");
  fs.writeFileSync(file, source);
  const script = `import fs from "node:fs";
const t0 = performance.now();
const { parser } = await import(${JSON.stringify("file:///" + path.join(ROOT, "src/compiler/grammar/parser.ts").replace(/\\/g, "/"))});
const load = performance.now() - t0;
const src = fs.readFileSync(${JSON.stringify(file)}, "utf8");
let t = performance.now(); parser.parse(src); const cold = performance.now() - t;
const xs = []; for (let i = 0; i < 30; i++) { t = performance.now(); parser.parse(src); xs.push(performance.now() - t); }
xs.sort((a, b) => a - b);
console.log(JSON.stringify({ load, cold, warm: xs[15] }));`;
  const p = spawnSync(process.execPath, ["--input-type=module", "-e", script], { encoding: "utf8" });
  if (p.status !== 0) throw new Error(p.stderr);
  return JSON.parse(p.stdout.trim()) as { load: number; cold: number; warm: number };
}

const inputs = collect();
const antlr = await antlrVerdicts(inputs);
const rows = inputs.map((input, i) => ({ input, antlr: antlr[i], lezer: lezerVerdict(input.source) }));
const agree = rows.filter((r) => r.antlr.ok === r.lezer.ok);
const mismatches = rows.filter((r) => r.antlr.ok !== r.lezer.ok);
const byKind = (k: Input["kind"]) => {
  const rs = rows.filter((r) => r.input.kind === k);
  return `${rs.filter((r) => r.antlr.ok === r.lezer.ok).length}/${rs.length}`;
};

const lines = [
  "# Grammar conformance: Lezer vs ANTLR (official Processing grammar)",
  "",
  `agreement: **${agree.length}/${rows.length} (${((agree.length / rows.length) * 100).toFixed(2)}%)** — valid inputs ${byKind("valid")}, mutated inputs ${byKind("mutated")}`,
  `ANTLR accepts / Lezer rejects: ${mismatches.filter((r) => r.antlr.ok).length}, ANTLR rejects / Lezer accepts: ${mismatches.filter((r) => !r.antlr.ok).length}`,
  "",
];
const shooter = inputs.find((i) => i.name.endsWith("simple_shooter_game"));
if (shooter) {
  const t = lezerTiming(shooter.source);
  lines.push(`Lezer timing on simple_shooter_game (199 lines, Node ${process.version}): module load ${t.load.toFixed(1)}ms, cold parse ${t.cold.toFixed(1)}ms, warm ${t.warm.toFixed(2)}ms`, "");
}
lines.push("## Mismatches", "", "| input | ANTLR | Lezer |", "|---|---|---|");
for (const r of mismatches.slice(0, Number(flags.show))) {
  const lz = r.lezer.ok ? "accept" : `reject (${r.lezer.reason}${r.lezer.pos !== undefined ? ` at line ${lineOf(r.input.source, r.lezer.pos)}: \`${r.input.source.slice(r.lezer.pos, r.lezer.pos + 40).split("\n")[0].replace(/\|/g, "\\|")}\`` : ""})`;
  const an = r.antlr.ok ? "accept" : `reject (${(r.antlr.message ?? "").replace(/\n/g, " ").replace(/\|/g, "\\|").slice(0, 80)})`;
  lines.push(`| ${r.input.name} | ${an} | ${lz} |`);
}
const md = lines.join("\n") + "\n";
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, "report.md"), md);
console.log(md);
console.log(`report: ${path.relative(ROOT, path.join(OUT, "report.md"))}`);
