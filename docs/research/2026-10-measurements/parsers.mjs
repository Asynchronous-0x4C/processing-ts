// Parser adapters. Each loader returns { phases, parse(src) -> result, errors(result, src) -> [{line,col,msg}], walk(result) -> nodeCount, dispose?(result) }
// `phases` = one-time setup costs measured inside the loader (ms).
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { performance } from 'node:perf_hooks';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const now = () => performance.now();

function lineCol(src, offset) {
  let line = 1, last = -1;
  for (let i = 0; i < offset && i < src.length; i++) if (src.charCodeAt(i) === 10) { line++; last = i; }
  return { line, col: offset - last - 1 };
}

const antlrVariant = (opts) => async () => {
  const t0 = now();
  const m = await import(pathToFileURL(path.join(HERE, 'out/antlr-node.mjs')).href);
  const phases = { import: now() - t0 };
  return {
    phases,
    parse: (s) => m.parse(s, opts),
    errors: (r) => r.errors,
    walk: (r) => m.walk(r.tree),
  };
};

export const adapters = {
  // Project grammar exactly as Control.ts uses it (entry rule processingSketch, default LL prediction)
  'antlr': antlrVariant({ rule: 'processingSketch' }),
  // Same grammar, SLL-only prediction (no LL fallback) -- a common ANTLR speed knob
  'antlr-sll': antlrVariant({ rule: 'processingSketch', sll: true }),
  // Same grammar, entry rule compilationUnit (plain Java only; skips the static/java/active mode ambiguity)
  'antlr-cu': antlrVariant({ rule: 'compilationUnit' }),

  'tree-sitter': async () => {
    const t0 = now();
    const { Parser, Language } = await import('web-tree-sitter');
    const t1 = now();
    await Parser.init();
    const t2 = now();
    const Java = await Language.load(path.join(HERE, 'node_modules/tree-sitter-java/tree-sitter-java.wasm'));
    const t3 = now();
    const p = new Parser();
    p.setLanguage(Java);
    const t4 = now();
    return {
      phases: { import: t1 - t0, 'Parser.init (core wasm)': t2 - t1, 'Language.load (java wasm)': t3 - t2, 'new Parser+setLanguage': t4 - t3 },
      parse: (s) => p.parse(s),
      errors: (tree) => {
        const out = [];
        const c = tree.walk();
        let done = false;
        while (!done) {
          const n = c.currentNode;
          if (n.isError || n.isMissing) out.push({ line: n.startPosition.row + 1, col: n.startPosition.column, msg: n.isMissing ? `MISSING ${n.type}` : `ERROR node spanning ${JSON.stringify(n.text.slice(0, 40))}` });
          if (c.gotoFirstChild()) continue;
          while (!c.gotoNextSibling()) { if (!c.gotoParent()) { done = true; break; } }
        }
        c.delete();
        return out;
      },
      walk: (tree) => {
        let n = 0, acc = 0;
        const c = tree.walk();
        for (;;) {
          n++; acc += c.nodeTypeId;
          if (c.gotoFirstChild()) continue;
          let up = false;
          while (!c.gotoNextSibling()) { if (!c.gotoParent()) { up = true; break; } }
          if (up) break;
        }
        c.delete();
        return n + (acc & 0);
      },
      dispose: (tree) => tree.delete(),
    };
  },

  'lezer': async () => {
    const t0 = now();
    const { parser } = await import('@lezer/java');
    return {
      phases: { import: now() - t0 },
      parse: (s) => parser.parse(s),
      errors: (tree, src) => {
        const out = [];
        tree.iterate({ enter(n) { if (n.type.isError) { const lc = lineCol(src, n.from); out.push({ ...lc, msg: `error node ${JSON.stringify(src.slice(n.from, Math.min(n.to, n.from + 40)))}` }); } } });
        return out;
      },
      walk: (tree) => {
        let n = 0, acc = 0;
        const c = tree.cursor();
        for (;;) {
          n++; acc += c.type.id;
          if (c.firstChild()) continue;
          let up = false;
          while (!c.nextSibling()) { if (!c.parent()) { up = true; break; } }
          if (up) break;
        }
        return n + (acc & 0);
      },
    };
  },

  'java-parser': async () => {
    const t0 = now();
    const { parse } = await import('java-parser'); // Chevrotain performSelfAnalysis runs at module load
    return {
      phases: { 'import (incl. Chevrotain self-analysis)': now() - t0 },
      parse: (s) => { try { return { cst: parse(s) }; } catch (e) { return { error: e.message }; } },
      errors: (r) => r.error ? [{ line: Number((r.error.match(/line: (\d+)/) || [])[1]), col: Number((r.error.match(/column: (\d+)/) || [])[1]), msg: r.error.split('\n').slice(0, 2).join(' ').slice(0, 160) + ' (parser throws on first error; no recovery)' }] : [],
      walk: (r) => {
        if (!r.cst) return 0;
        let n = 0;
        const stack = [r.cst];
        while (stack.length) {
          const t = stack.pop();
          n++;
          if (t.children) for (const k in t.children) for (const ch of t.children[k]) stack.push(ch);
        }
        return n;
      },
    };
  },
};
