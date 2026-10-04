#!/usr/bin/env node
// stdout conformance of the new compiler, without a browser: compiles each visual test case tagged
// "lang" with src/compiler, runs it in Node (tools/lang/runner.ts: no drawing) and compares its println
// output with the reference stdout recorded from the real Processing (tests/visual/refs/<case>.stdout.txt).
// Usage: node tools/lang/cli.ts [case...] [--show-code]
//        node tools/lang/cli.ts --corpus      compile every example of Processing + repository sketch
//   vt.json may set "langExpect": "fail" with "langKnownIssue" for cases that need runtime functions
//   the Node stub does not have (expected failures, like `expect` for test:visual).
import fs from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import { compileSketch } from "../../src/compiler/index.ts";
import { findExamples, findSketches } from "../vt/corpus.ts";
import { findProcessing } from "../vt/processing.ts";
import { readSketch } from "../vt/sketch.ts";
import { runSketch } from "./runner.ts";

const ROOT = path.resolve(import.meta.dirname, "../..");
const CASES = path.join(ROOT, "tests/visual/cases");
const REFS = path.join(ROOT, "tests/visual/refs");
const OUT = path.join(ROOT, "tests/lang/out");

const { values: flags, positionals } = parseArgs({
  allowPositionals: true,
  options: { "show-code": { type: "boolean", default: false }, corpus: { type: "boolean", default: false } },
});

type Config = { tags?: string[]; frames?: number; langExpect?: "fail"; langKnownIssue?: string };

const tabsOf = (dir: string) => readSketch(dir).files.map((f) => ({ name: f.name, text: f.content }));

/** Same normalization as the reference recorder: no empty lines, no end marker. */
const lines = (s: string) => s.split(/\r?\n/).filter((l) => l.length > 0 && l !== "__VT_DONE__");

async function conformance(): Promise<number> {
  const cases = fs.readdirSync(CASES, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => {
      const cfgPath = path.join(CASES, d.name, "vt.json");
      return { name: d.name, config: (fs.existsSync(cfgPath) ? JSON.parse(fs.readFileSync(cfgPath, "utf8")) : {}) as Config };
    })
    .filter((c) => (positionals.length ? positionals.some((p) => c.name.startsWith(p)) : c.config.tags?.includes("lang")))
    .sort((a, b) => a.name.localeCompare(b.name));

  const counts = { pass: 0, fail: 0, xfail: 0, xpass: 0, noref: 0 };
  const report: string[] = ["# stdout conformance (new compiler, Node)", "", "| case | result | detail |", "|---|---|---|"];
  for (const c of cases) {
    const refPath = path.join(REFS, `${c.name}.stdout.txt`);
    if (!fs.existsSync(refPath)) {
      counts.noref++;
      console.log(`NO-REF ${c.name}`);
      continue;
    }
    const t0 = performance.now();
    const r = await runSketch(tabsOf(path.join(CASES, c.name)), { frames: c.config.frames ?? 1 }).catch((e: Error) => ({
      errors: [`compiler crash: ${e.stack?.split("\n").slice(0, 3).join(" ")}`], stdout: "", exception: undefined, code: undefined,
    }));
    const ms = performance.now() - t0;
    if (r.code) fs.writeFileSync(path.join(OUT, `${c.name}.js`), r.code);
    const want = lines(fs.readFileSync(refPath, "utf8"));
    const got = lines(r.stdout);
    let detail = "";
    if (r.errors.length) detail = `compile: ${r.errors[0]}`;
    else if (r.exception) detail = `exception: ${r.exception.split("\n")[0]}`;
    else {
      const i = want.findIndex((l, k) => l !== got[k]);
      const at = i >= 0 ? i : want.length !== got.length ? Math.min(want.length, got.length) : -1;
      if (at >= 0) detail = `line ${at + 1}: expected ${JSON.stringify(want[at] ?? "<end>")}, got ${JSON.stringify(got[at] ?? "<end>")}`;
    }
    const ok = detail === "";
    const expectFail = c.config.langExpect === "fail";
    const result = ok ? (expectFail ? "XPASS" : "PASS") : expectFail ? "XFAIL" : "FAIL";
    counts[result.toLowerCase() as keyof typeof counts]++;
    const note = !ok && expectFail && c.config.langKnownIssue ? ` (${c.config.langKnownIssue})` : "";
    console.log(`${result.padEnd(6)} ${c.name.padEnd(24)} ${ms.toFixed(0).padStart(4)}ms  ${detail}${note}`);
    report.push(`| ${c.name} | ${result} | ${(detail + note).replace(/\|/g, "\\|")} |`);
    if (flags["show-code"] && r.code) console.log(r.code);
  }
  const summary = `${counts.pass} pass, ${counts.fail} fail, ${counts.xfail} xfail, ${counts.xpass} xpass, ${counts.noref} no-ref`;
  console.log(`\n${summary}`);
  if (counts.xpass) console.log('XPASS: remove "langExpect" from those vt.json files.');
  fs.writeFileSync(path.join(OUT, "report.md"), [...report, "", summary, ""].join("\n"));
  return counts.fail || counts.noref ? 1 : 0;
}

/**
 * Every bundled example and repository sketch: compiles? valid JavaScript? runs 3 frames on the Node
 * stub? Exceptions on the stub are listed but not failures (the stub has no PVector, PImage...).
 */
async function corpus(): Promise<number> {
  const examples = findExamples(findProcessing());
  if (!examples) throw new Error("Processing examples not found");
  const withPde = (dir: string): string[] => {
    const es = fs.readdirSync(dir, { withFileTypes: true });
    if (es.some((e) => e.isFile() && e.name.endsWith(".pde"))) return [dir];
    return es.filter((e) => e.isDirectory() && e.name !== "data").flatMap((e) => withPde(path.join(dir, e.name)));
  };
  const dirs = [...findSketches(examples), ...["public/samples", "tests/visual/cases"].flatMap((r) => withPde(path.join(ROOT, r)))];
  const rows: Record<"rejected" | "broken" | "stub", string[]> = { rejected: [], broken: [], stub: [] };
  let ran = 0;
  let ms = 0;
  let bytes = 0;
  for (const dir of dirs) {
    const name = path.relative(ROOT, dir).startsWith("..") ? path.relative(examples, dir) : path.relative(ROOT, dir);
    const tabs = tabsOf(dir);
    let code: string | null;
    try {
      const t0 = performance.now();
      const c = compileSketch(tabs);
      ms += performance.now() - t0;
      code = c.code;
      if (code === null) {
        rows.rejected.push(`${name}: ${c.diagnostics[0].message}`);
        continue;
      }
      bytes += code.length;
      new Function("$rt", "__renderer__", code);
    } catch (e) {
      rows.broken.push(`${name}: ${(e as Error).stack?.split("\n").slice(0, 3).join(" ")}`);
      continue;
    }
    const r = await runSketch(tabs, { frames: 3 });
    if (r.exception) rows.stub.push(`${name}: ${r.exception.split("\n")[0]}`);
    else ran++;
  }
  const summary = `${dirs.length} sketches: ${dirs.length - rows.rejected.length - rows.broken.length} compiled to valid JavaScript ` +
    `(${rows.broken.length} broken, ${rows.rejected.length} rejected), ${ran} ran 3 frames on the Node stub; ` +
    `compile ${ms.toFixed(0)}ms in total, ${(bytes / 1024).toFixed(0)} KiB of JavaScript`;
  const md = [
    "# new compiler over the corpus (tools/lang/cli.ts --corpus)", "", summary, "",
    "## broken (compiler crash or invalid JavaScript)", "", ...rows.broken.map((r) => `- ${r}`), "",
    "## rejected (compile errors; compare with `npm run test:check`)", "", ...rows.rejected.map((r) => `- ${r}`), "",
    "## exception on the Node stub (mostly missing PVector/PImage/PShape; not failures)", "", ...rows.stub.map((r) => `- ${r}`), "",
  ].join("\n");
  fs.writeFileSync(path.join(OUT, "corpus.md"), md);
  for (const r of rows.broken) console.log(`BROKEN ${r}`);
  console.log(summary);
  console.log(`report: ${path.relative(ROOT, path.join(OUT, "corpus.md"))}`);
  return rows.broken.length ? 1 : 0;
}

fs.mkdirSync(OUT, { recursive: true });
process.exit(flags.corpus ? await corpus() : await conformance());
