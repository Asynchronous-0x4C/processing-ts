// Orchestrates parse-speed benchmarks: each (parser, input) runs in N fresh Node processes
// (cold = first parse in a fresh process; warm = subsequent parses, pooled across processes).
// Run: node bench.mjs      (writes bench-results.json)
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const inputs = ['sample.pde', 'sample-wrapped.java', 'synthetic.java'];
const combos = [];
for (const p of ['antlr', 'antlr-sll', 'antlr-cu', 'tree-sitter', 'lezer', 'java-parser']) {
  for (const f of inputs) {
    if (p === 'antlr-cu' && f === 'sample.pde') continue; // not a compilation unit
    // processingSketch+LL on the 5k-line file takes ~8 s/parse, so fewer runs there
    const slow = p === 'antlr' && f === 'synthetic.java';
    combos.push({ p, f, procs: slow ? 1 : 3, runs: slow ? 5 : 20 });
  }
}

const median = (a) => { const s = [...a].sort((x, y) => x - y); const n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const results = [];
for (const c of combos) {
  const runs = [];
  for (let i = 0; i < c.procs; i++) {
    const out = execFileSync(process.execPath, [path.join(HERE, 'bench-one.mjs'), c.p, path.join(HERE, 'inputs', c.f), String(c.runs)], { encoding: 'utf8', maxBuffer: 1 << 26 });
    runs.push(JSON.parse(out));
  }
  const phases = {};
  for (const k of Object.keys(runs[0].phases)) phases[k] = median(runs.map((r) => r.phases[k]));
  const warm = runs.flatMap((r) => r.parseTimes);
  const walk = runs.flatMap((r) => r.walkTimes);
  const row = {
    parser: c.p, input: c.f, procs: c.procs, warmRunsPerProc: c.runs,
    loadMs: median(runs.map((r) => r.loadMs)), phases,
    coldMs: median(runs.map((r) => r.coldMs)), coldMsAll: runs.map((r) => +r.coldMs.toFixed(2)),
    warmMedianMs: median(warm), warmMinMs: Math.min(...warm), warmMaxMs: Math.max(...warm),
    walkMedianMs: median(walk), nodes: runs[0].nodes,
    errorCount: runs[0].errorCount, errors: runs[0].errors,
  };
  results.push(row);
  console.log(`${c.p.padEnd(12)} ${c.f.padEnd(20)} load ${row.loadMs.toFixed(1)}  cold ${row.coldMs.toFixed(1)}  warm-med ${row.warmMedianMs.toFixed(2)}  walk ${row.walkMedianMs.toFixed(2)}  nodes ${row.nodes}  errs ${row.errorCount}`);
}
fs.writeFileSync(path.join(HERE, process.argv[2] || 'bench-results.json'), JSON.stringify({ node: process.version, platform: process.platform, date: new Date().toISOString(), results }, null, 2));
