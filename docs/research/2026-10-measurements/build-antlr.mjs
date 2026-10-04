// Bundles the project's ANTLR parser for Node into out/antlr-node.mjs. Run: node build-antlr.mjs
import * as esbuild from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const PROJECT = 'C:/Users/okmst/Documents/Projects/processing-ts';
await esbuild.build({
  stdin: { contents: fs.readFileSync(path.join(HERE, 'entries/antlr-node.js'), 'utf8'), resolveDir: PROJECT, loader: 'js' },
  bundle: true, format: 'esm', platform: 'node', outfile: path.join(HERE, 'out/antlr-node.mjs'), logLevel: 'warning',
  plugins: [{ name: 'p', setup(b) { b.onResolve({ filter: /^PROJECT\// }, (a) => ({ path: path.resolve(PROJECT, a.path.slice(8)) })); } }],
});
console.log('built out/antlr-node.mjs');
