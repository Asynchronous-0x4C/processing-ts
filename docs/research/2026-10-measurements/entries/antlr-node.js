// Node bundle of the project's generated parser (built by build-antlr.mjs with resolveDir = project root)
import { CharStreams, CommonTokenStream, ErrorListener, PredictionMode } from 'antlr4';
import ProcessingLexer from 'PROJECT/src/lib/transpiler/antlr/parser/ProcessingLexer.ts';
import ProcessingParser from 'PROJECT/src/lib/transpiler/antlr/parser/ProcessingParser.ts';

class Collect extends ErrorListener {
  constructor() { super(); this.errors = []; }
  syntaxError(_r, _sym, line, column, msg) { this.errors.push({ line, col: column, msg }); }
}

// Same construction as src/lib/transpiler/Control.ts, but default ConsoleErrorListener replaced by a collector.
export function parse(src, { rule = 'processingSketch', sll = false } = {}) {
  const errs = new Collect();
  const lexer = new ProcessingLexer(CharStreams.fromString(src));
  lexer.removeErrorListeners(); lexer.addErrorListener(errs);
  const parser = new ProcessingParser(new CommonTokenStream(lexer));
  parser.removeErrorListeners(); parser.addErrorListener(errs);
  if (sll) parser._interp.predictionMode = PredictionMode.SLL;
  const tree = parser[rule]();
  return { tree, errors: errs.errors };
}

// Visit every node (rule contexts + terminals) and touch its type, like a visitor would.
export function walk(tree) {
  let n = 0, acc = 0;
  const stack = [tree];
  while (stack.length) {
    const t = stack.pop();
    n++;
    if (t.children) { acc += t.ruleIndex; for (let i = t.children.length - 1; i >= 0; i--) stack.push(t.children[i]); }
    else if (t.symbol) acc += t.symbol.type;
  }
  return n + (acc & 0);
}
