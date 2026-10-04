// Which Processing-specific / modern-Java constructs does each parser reject (when wrapped in a class)?
// Run: node constructs.mjs   (writes constructs-results.json)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { adapters } from './parsers.mjs';
const HERE = path.dirname(fileURLToPath(import.meta.url));

const inClass = (s) => `class Sketch {\n  ${s}\n}\n`;
const inMethod = (s) => `class Sketch {\n  void m() {\n    ${s}\n  }\n}\n`;

const cases = [
  ['baseline (empty class + method)', inMethod('int a = 1;')],
  ['color c = #FF8800;  (field)', inClass('color c = #FF8800;')],
  ['color c = color(255);  (field)', inClass('color c = color(255);')],
  ['int x = int(3.5);  (field)', inClass('int x = int(3.5);')],
  ['float f = 1.0;  (field)', inClass('float f = 1.0;')],
  ['text block """\\nabc\\n"""  (field)', inClass('String s = """\n  abc\n  """;')],
  ['lambda Runnable r = () -> {};  (field)', inClass('Runnable r = () -> {};')],
  ['var x = 1;  (in method)', inMethod('var x = 1;')],
  ['switch expression  (in method)', inMethod('int x = 1;\n    int y = switch(x){ case 1 -> 2; default -> 3; };')],
  ['record P(int x){}  (member)', inClass('record P(int x){}')],
  ['instanceof pattern  (in method)', inMethod('Object o = null;\n    if (o instanceof String s) {}')],
  // extra, found during the benchmark
  ['interface default method  (Java 8)', 'interface I {\n  default int f() { return 1; }\n}\n'],
  ['fill(#FF8800);  (in method)', inMethod('fill(#FF8800);')],
];

const parsers = ['tree-sitter', 'lezer', 'java-parser', 'antlr'];
const loaded = {};
for (const p of parsers) loaded[p] = await adapters[p]();

// Collect node-type names, to see HOW an accepted construct was interpreted
// (e.g. `record P(int x){}` is also a valid pre-Java-16 *method* declaration with return type `record`).
const typeNames = {
  'tree-sitter': (tree) => { const s = new Set(); const c = tree.walk(); for (;;) { if (c.currentNode.isNamed) s.add(c.nodeType); if (c.gotoFirstChild()) continue; let up = false; while (!c.gotoNextSibling()) { if (!c.gotoParent()) { up = true; break; } } if (up) break; } c.delete(); return s; },
  'lezer': (tree) => { const s = new Set(); tree.iterate({ enter(n) { s.add(n.type.name); } }); return s; },
  'java-parser': (r) => { const s = new Set(); if (!r.cst) return s; const st = [r.cst]; while (st.length) { const t = st.pop(); if (t.name) s.add(t.name); else if (t.tokenType) s.add(t.tokenType.name); if (t.children) for (const k in t.children) for (const ch of t.children[k]) st.push(ch); } return s; },
  'antlr': (r) => { const s = new Set(); const names = r.tree.parser.ruleNames; const st = [r.tree]; while (st.length) { const t = st.pop(); if (t.children) { s.add(names[t.ruleIndex]); st.push(...t.children); } } return s; },
};
const baseline = {};
for (const p of parsers) {
  baseline[p] = new Set();
  for (const src of [inClass('int a = 1;'), inMethod('int a = 1;')]) {
    const r = loaded[p].parse(src);
    for (const t of typeNames[p](r)) baseline[p].add(t);
    loaded[p].dispose?.(r);
  }
}

const rows = [];
for (const [label, src] of cases) {
  const row = { construct: label, src };
  for (const p of parsers) {
    const a = loaded[p];
    const r = a.parse(src);
    const errs = a.errors(r, src);
    const novel = [...typeNames[p](r)].filter((t) => !baseline[p].has(t) && !/^(⚠|ERROR)$/.test(t));
    row[p] = { errors: errs.length, first: errs[0] ? `L${errs[0].line}:${errs[0].col} ${errs[0].msg.slice(0, 90)}` : '', newNodeTypes: novel };
    a.dispose?.(r);
  }
  rows.push(row);
}
fs.writeFileSync(path.join(HERE, 'constructs-results.json'), JSON.stringify(rows, null, 2));
const cell = (x) => (x.errors === 0 ? 'accepts' : `REJECTS (${x.errors} err)`);
console.log(`| Construct | ${parsers.join(' | ')} |`);
console.log(`|---|${parsers.map(() => '---').join('|')}|`);
for (const r of rows) console.log(`| ${r.construct} | ${parsers.map((p) => cell(r[p])).join(' | ')} |`);
console.log('\nFirst error per rejection:');
for (const r of rows) for (const p of parsers) if (r[p].errors) console.log(`- ${r.construct} / ${p}: ${r[p].first}`);
console.log('\nNode types present that are absent from the baseline (how the construct was interpreted):');
for (const r of rows) {
  if (r.construct.startsWith('baseline')) continue;
  console.log(`- ${r.construct}`);
  for (const p of parsers) console.log(`    ${p.padEnd(11)} ${r[p].errors ? '[err] ' : ''}${r[p].newNodeTypes.slice(0, 8).join(', ')}`);
}
