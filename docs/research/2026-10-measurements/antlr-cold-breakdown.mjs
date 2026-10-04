// Splits ANTLR cold cost: parse('') in a fresh process forces lazy ATN deserialization of lexer+parser
// with almost no prediction work; the following sample parse then shows DFA/JIT warm-up. Run: node antlr-cold-breakdown.mjs [sll]
import fs from 'node:fs';
import { performance } from 'node:perf_hooks';
const sll = process.argv[2] === 'sll';
const m = await import('./out/antlr-node.mjs');
const src = fs.readFileSync(new URL('./inputs/sample.pde', import.meta.url), 'utf8');
let t = performance.now(); m.parse('', { sll }); const empty = performance.now() - t;
t = performance.now(); m.parse(src, { sll }); const first = performance.now() - t;
t = performance.now(); m.parse(src, { sll }); const second = performance.now() - t;
console.log(JSON.stringify({ mode: sll ? 'SLL' : 'LL', 'parse("") incl. ATN deserialize ms': +empty.toFixed(1), 'then 1st sample parse ms': +first.toFixed(1), '2nd sample parse ms': +second.toFixed(1) }));
