// Runs ONE parser on ONE input in a fresh process and prints JSON.
// Usage: node bench-one.mjs <adapter> <inputFile> [warmRuns=20]
import fs from 'node:fs';
import { performance } from 'node:perf_hooks';
import { adapters } from './parsers.mjs';

const [name, inputFile, runsStr = '20'] = process.argv.slice(2);
const runs = Number(runsStr);
const src = fs.readFileSync(inputFile, 'utf8');
const now = () => performance.now();

const l0 = now();
const a = await adapters[name]();
const loadMs = now() - l0;

// cold = first parse in this process (for ANTLR this includes lazy ATN deserialization + empty DFA cache)
const c0 = now();
const first = a.parse(src);
const coldMs = now() - c0;
const errors = a.errors(first, src);
const w0 = now();
const nodes = a.walk(first);
const coldWalkMs = now() - w0;
a.dispose?.(first);

const parseTimes = [], walkTimes = [];
for (let i = 0; i < runs; i++) {
  let t = now();
  const r = a.parse(src);
  parseTimes.push(now() - t);
  t = now();
  a.walk(r);
  walkTimes.push(now() - t);
  a.dispose?.(r);
}
process.stdout.write(JSON.stringify({
  parser: name, input: inputFile, loadMs, phases: a.phases, coldMs, coldWalkMs, parseTimes, walkTimes, nodes,
  errorCount: errors.length, errors: errors.slice(0, 6), heapMB: process.memoryUsage().heapUsed / 1048576,
}));
