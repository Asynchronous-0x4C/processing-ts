import { Parser, Language } from 'web-tree-sitter';
export async function init() {
  await Parser.init({ locateFile: (f) => '/' + f });
  const Java = await Language.load('/tree-sitter-java.wasm');
  const p = new Parser();
  p.setLanguage(Java);
  const t = p.parse('class A { void f(){ int x = 1; } }');
  return t.rootNode.hasError;
}
init();
