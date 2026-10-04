// Prints markdown tables from benchmark result files.
// Usage: node report-bench.mjs [run1.json=bench-results.json] [run2.json=bench-results-run2.json]
import fs from 'node:fs';
const load = (f) => { try { return JSON.parse(fs.readFileSync(new URL('./' + f, import.meta.url), 'utf8')); } catch { return null; } };
const r1 = load(process.argv[2] || 'bench-results.json');
const r2 = load(process.argv[3] || 'bench-results-run2.json');
const label = {
  'antlr': 'ANTLR4 project grammar, `processingSketch`, LL (as Control.ts)',
  'antlr-sll': 'ANTLR4 project grammar, `processingSketch`, SLL',
  'antlr-cu': 'ANTLR4 project grammar, `compilationUnit`, LL',
  'tree-sitter': 'web-tree-sitter 0.27 + tree-sitter-java 0.23.5',
  'lezer': '@lezer/java 1.1.4',
  'java-parser': 'java-parser 3.0.1',
};
const f = (x) => (x == null ? 'n/a' : x >= 100 ? x.toFixed(0) : x >= 10 ? x.toFixed(1) : x.toFixed(2));
const pair = (a, b) => (b == null ? f(a) : `${f(a)} / ${f(b)}`);
const find = (res, r) => res?.results.find((x) => x.parser === r.parser && x.input === r.input);
console.log(`Run 1: ${r1.date}, run 2: ${r2?.date ?? 'n/a'}, Node ${r1.node}\n`);
console.log('| Parser | Input | load (ms) | cold 1st parse (ms) run1 / run2 | warm median (ms) run1 / run2 | warm min (ms) | tree walk (ms) | nodes | errors |');
console.log('|---|---|---:|---:|---:|---:|---:|---:|---:|');
for (const r of r1.results) {
  const o = find(r2, r);
  console.log(`| ${label[r.parser]} | ${r.input} | ${f(r.loadMs)} | ${pair(r.coldMs, o?.coldMs)} | **${pair(r.warmMedianMs, o?.warmMedianMs)}** | ${f(r.warmMinMs)} | ${f(r.walkMedianMs)} | ${r.nodes} | ${r.errorCount} |`);
}
console.log('\nPer-phase one-time costs, run 1 (median over processes):');
const seen = new Set();
for (const r of r1.results) {
  if (seen.has(r.parser)) continue; seen.add(r.parser);
  console.log(`- ${r.parser}: ` + Object.entries(r.phases).map(([k, v]) => `${k} ${f(v)} ms`).join(', '));
}
console.log('\nCold first-parse values per process, run 1:');
for (const r of r1.results) console.log(`- ${r.parser} / ${r.input}: ${r.coldMsAll.join(', ')} ms (warm runs: ${r.procs} procs × ${r.warmRunsPerProc})`);
