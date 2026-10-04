// Bundle-size measurement. Run: node size.mjs
// Each entry is bundled with esbuild (--bundle --minify --format=esm --platform=browser),
// then measured raw / gzip (zlib level 9) / brotli (quality 11).
import * as esbuild from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PROJECT = 'C:/Users/okmst/Documents/Projects/processing-ts';
const OUT = path.join(HERE, 'out');
fs.mkdirSync(OUT, { recursive: true });

const gz = (b) => zlib.gzipSync(b, { level: 9 }).length;
const br = (b) => zlib.brotliCompressSync(b, {
  params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11, [zlib.constants.BROTLI_PARAM_SIZE_HINT]: b.length },
}).length;
const measure = (buf) => ({ raw: buf.length, gzip: gz(buf), brotli: br(buf) });

// Resolve "PROJECT/..." imports to the real project tree.
const projectAlias = {
  name: 'project-alias',
  setup(b) {
    b.onResolve({ filter: /^PROJECT\// }, (a) => ({ path: path.resolve(PROJECT, a.path.slice('PROJECT/'.length)) }));
  },
};

const entries = [
  // [id, label, opts]
  ['antlr4-runtime', 'antlr4 runtime (classes used by generated parser)'],
  // resolveDir=PROJECT so 'antlr4' resolves to the same copy the generated parser uses (avoids a duplicate runtime)
  ['antlr4-project-parser', 'antlr4 + project ProcessingLexer/ProcessingParser', { resolveDir: PROJECT }],
  ['web-tree-sitter', 'web-tree-sitter JS glue (wasm separate)'],
  ['lezer-java', '@lezer/java + @lezer/lr + @lezer/common'],
  ['java-parser', 'java-parser (Chevrotain)'],
  ['pixi-subset', 'pixi.js subset (Application, Graphics, Text, Texture, Sprite, RenderTexture, Matrix)'],
  ['pixi-subset', 'pixi.js subset, project lockfile version', { id: 'pixi-subset-projver', resolveDir: PROJECT }],
  ['pixi-full', 'pixi.js full (import * as PIXI)'],
  ['p5-import', "p5 via esbuild (import p5 from 'p5')"],
  ['three-subset', 'three subset (WebGLRenderer, Scene, PerspectiveCamera, Mesh, BufferGeometry, ShaderMaterial)'],
  ['twgl-full', 'twgl.js full (import *)'],
  ['twgl-typical', 'twgl.js typical (programInfo/bufferInfo/uniforms/texture/m4)'],
  ['regl', 'regl'],
  ['gl-matrix-full', 'gl-matrix full (import *)'],
  ['gl-matrix-typical', 'gl-matrix typical (mat4 + vec3)'],
  ['earcut', 'earcut'],
  ['libtess', 'libtess'],
  ['opentype', 'opentype.js (parse + getPath)'],
  ['fast-xml-parser', 'fast-xml-parser (XMLParser)'],
  ['papaparse', 'papaparse (Papa.parse)'],
  ['codemirror', 'CodeMirror 6 minimal (view/state/language/commands/lang-java)'],
  ['project-lib-full', 'project src/lib/index.ts, all deps bundled (incl. pixi)'],
];

const results = [];
const breakdown = {};
for (const [file, label, opts = {}] of entries) {
  const id = opts.id ?? file;
  const entryPath = path.join(HERE, 'entries', file + '.js');
  const common = {
    bundle: true, minify: true, format: 'esm', platform: 'browser', write: false,
    plugins: [projectAlias], logLevel: 'silent', metafile: true,
    external: opts.external ?? [],
  };
  try {
    let r;
    if (opts.resolveDir) {
      r = await esbuild.build({ ...common, stdin: { contents: fs.readFileSync(entryPath, 'utf8'), resolveDir: opts.resolveDir, loader: 'js' } });
    } else {
      r = await esbuild.build({ ...common, entryPoints: [entryPath] });
    }
    const buf = Buffer.from(r.outputFiles[0].contents);
    fs.writeFileSync(path.join(OUT, id + '.min.js'), buf);
    const warn = r.warnings.map((w) => w.text);
    fs.writeFileSync(path.join(OUT, id + '.meta.json'), JSON.stringify(r.metafile));
    // per-package contribution to output bytes (pre-compression)
    const pk = {};
    for (const [inp, o] of Object.entries(Object.values(r.metafile.outputs)[0].inputs)) {
      const m = inp.match(/node_modules[\\/]((?:@[^\\/]+[\\/])?[^\\/]+)/);
      const key = m ? m[1].replace(/\\/g, '/') : (inp.includes('processing-ts') ? 'project-src' : 'entry');
      pk[key] = (pk[key] || 0) + o.bytesInOutput;
    }
    breakdown[id] = Object.entries(pk).sort((a, b) => b[1] - a[1]);
    results.push({ id, label, ...measure(buf), warnings: warn });
  } catch (e) {
    results.push({ id, label, error: (e.errors ?? [{ text: String(e) }]).map((x) => x.text).join('; ') });
  }
}

// Code-split variant for pixi: initial chunk vs lazily loaded chunks.
try {
  const r = await esbuild.build({
    entryPoints: [path.join(HERE, 'entries', 'pixi-subset.js')], bundle: true, minify: true, format: 'esm',
    platform: 'browser', splitting: true, outdir: path.join(OUT, 'pixi-split'), write: true, metafile: true, logLevel: 'silent',
  });
  const outs = r.metafile.outputs;
  const sum = (fl) => fl.reduce((t, f) => { const m = measure(fs.readFileSync(f)); return { raw: t.raw + m.raw, gzip: t.gzip + m.gzip, brotli: t.brotli + m.brotli }; }, { raw: 0, gzip: 0, brotli: 0 });
  const jsFiles = Object.keys(outs).filter((f) => f.endsWith('.js'));
  const n = jsFiles.length;
  const entryFile = jsFiles.find((f) => outs[f].entryPoint);
  // static-import closure of the entry chunk = what loads before any dynamic import() fires
  const closure = new Set([entryFile]); const stack = [entryFile];
  while (stack.length) {
    const f = stack.pop();
    for (const im of outs[f].imports) if (im.kind === 'import-statement' && !closure.has(im.path)) { closure.add(im.path); stack.push(im.path); }
  }
  const entry = sum([...closure]);
  const total = sum(jsFiles);
  results.push({ id: 'pixi-subset-split-initial', label: `pixi.js subset, --splitting: entry + its static imports (${closure.size} files, each compressed separately)`, ...entry });
  results.push({ id: 'pixi-subset-split-total', label: `pixi.js subset, --splitting: sum of all ${n} chunks (each compressed separately)`, ...total });
} catch (e) {
  results.push({ id: 'pixi-split', label: 'pixi split', error: String(e) });
}

// Raw files (prebuilt dist files and wasm).
const NM = path.join(HERE, 'node_modules');
const files = [
  ['antlr4/dist/antlr4.web.mjs (prebuilt, already minified)', path.join(NM, 'antlr4/dist/antlr4.web.mjs')],
  ['web-tree-sitter.wasm (core runtime)', path.join(NM, 'web-tree-sitter/web-tree-sitter.wasm')],
  ['web-tree-sitter.js (dist ESM glue, unbundled)', path.join(NM, 'web-tree-sitter/web-tree-sitter.js')],
  ['tree-sitter-java.wasm (npm tree-sitter-java)', path.join(NM, 'tree-sitter-java/tree-sitter-java.wasm')],
  ['tree-sitter-java.wasm (npm tree-sitter-wasms)', path.join(NM, 'tree-sitter-wasms/out/tree-sitter-java.wasm')],
  ['tree-sitter-java.wasm (npm @vscode/tree-sitter-wasm)', path.join(NM, '@vscode/tree-sitter-wasm/wasm/tree-sitter-java.wasm')],
  ['tree-sitter.wasm (npm @vscode/tree-sitter-wasm core)', path.join(NM, '@vscode/tree-sitter-wasm/wasm/tree-sitter.wasm')],
  ['p5 lib/p5.min.js (latest)', path.join(NM, 'p5/lib/p5.min.js')],
  ['p5 lib/p5.esm.min.js (latest)', path.join(NM, 'p5/lib/p5.esm.min.js')],
  ['p5 lib/p5.min.js (project lockfile version)', path.join(PROJECT, 'node_modules/p5/lib/p5.min.js')],
  ['project dist/index.js (committed in repo)', path.join(PROJECT, 'dist/index.js')],
  ['project dist/index.umd.cjs (committed in repo)', path.join(PROJECT, 'dist/index.umd.cjs')],
  ['project fresh vite build index.js (ES, pixi/p5 external)', path.join(HERE, 'projbuild/index.js')],
  ['project fresh vite build index.umd.cjs (UMD, pixi/p5 external)', path.join(HERE, 'projbuild/index.umd.cjs')],
];
const fileResults = [];
for (const [label, f] of files) {
  if (!fs.existsSync(f)) { fileResults.push({ label, error: 'missing: ' + f }); continue; }
  fileResults.push({ label, ...measure(fs.readFileSync(f)) });
}

// Versions
const pkg = JSON.parse(fs.readFileSync(path.join(HERE, 'package.json'), 'utf8'));
const versions = {};
for (const d of Object.keys(pkg.dependencies)) versions[d] = JSON.parse(fs.readFileSync(path.join(NM, d, 'package.json'), 'utf8')).version;
const projVersions = {};
for (const d of ['antlr4', 'pixi.js', 'p5', 'vite']) {
  try { projVersions[d] = JSON.parse(fs.readFileSync(path.join(PROJECT, 'node_modules', d, 'package.json'), 'utf8')).version; } catch {}
}

fs.writeFileSync(path.join(HERE, 'size-results.json'), JSON.stringify({ results, fileResults, versions, projVersions, breakdown }, null, 2));

const kb = (n) => (n / 1024).toFixed(1);
console.log('| Bundle | min (KiB) | gzip (KiB) | brotli (KiB) | min bytes | gzip bytes |');
console.log('|---|---:|---:|---:|---:|---:|');
for (const r of results) {
  if (r.error) console.log(`| ${r.label} | ERROR: ${r.error} | | | | |`);
  else console.log(`| ${r.label} | ${kb(r.raw)} | ${kb(r.gzip)} | ${kb(r.brotli)} | ${r.raw} | ${r.gzip} |${r.warnings?.length ? ' warnings: ' + r.warnings.length : ''}`);
}
console.log('\n| File | raw (KiB) | gzip (KiB) | brotli (KiB) | raw bytes | gzip bytes |');
console.log('|---|---:|---:|---:|---:|---:|');
for (const r of fileResults) {
  if (r.error) console.log(`| ${r.label} | ${r.error} | | | | |`);
  else console.log(`| ${r.label} | ${kb(r.raw)} | ${kb(r.gzip)} | ${kb(r.brotli)} | ${r.raw} | ${r.gzip} |`);
}
console.log('\nversions', versions, '\nproject versions', projVersions);
console.log('\nTop contributors (bytes in minified output, before compression):');
for (const id of ['antlr4-project-parser', 'p5-import', 'project-lib-full', 'codemirror', 'pixi-subset', 'three-subset', 'opentype', 'java-parser', 'lezer-java', 'web-tree-sitter']) {
  console.log(id, JSON.stringify((breakdown[id] || []).slice(0, 8).map(([k, v]) => k + ':' + (v / 1024).toFixed(1) + 'K')));
}
