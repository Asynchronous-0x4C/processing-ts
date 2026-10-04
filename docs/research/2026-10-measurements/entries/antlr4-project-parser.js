import { CharStreams, CommonTokenStream } from 'antlr4';
import ProcessingLexer from 'PROJECT/src/lib/transpiler/antlr/parser/ProcessingLexer.ts';
import ProcessingParser from 'PROJECT/src/lib/transpiler/antlr/parser/ProcessingParser.ts';
export function parse(src) {
  const parser = new ProcessingParser(new CommonTokenStream(new ProcessingLexer(CharStreams.fromString(src))));
  return parser.processingSketch();
}
console.log(parse('void setup(){ size(100,100); }').getChildCount());
