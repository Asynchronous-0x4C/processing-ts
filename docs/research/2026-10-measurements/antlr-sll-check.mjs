// Checks whether SLL prediction yields the identical parse tree as the default LL prediction,
// and which top-level sketch mode alternative processingSketch picks. Run: node antlr-sll-check.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const m = await import(pathToFileURL(path.join(HERE, 'out/antlr-node.mjs')).href);

const out = [];
for (const f of ['sample.pde', 'sample-wrapped.java', 'synthetic.java']) {
  const src = fs.readFileSync(path.join(HERE, 'inputs', f), 'utf8');
  const ll = m.parse(src);
  const sll = m.parse(src, { sll: true });
  const ruleNames = ll.tree.parser.ruleNames;
  const mode = (r) => ruleNames[r.tree.children[0].ruleIndex];
  const same = ll.tree.toStringTree(ruleNames) === sll.tree.toStringTree(ruleNames);
  const row = { input: f, llMode: mode(ll), sllMode: mode(sll), llErrors: ll.errors.length, sllErrors: sll.errors.length, identicalTree: same };
  out.push(row);
  console.log(JSON.stringify(row));
}
fs.writeFileSync(path.join(HERE, 'antlr-sll-check.json'), JSON.stringify(out, null, 2));
