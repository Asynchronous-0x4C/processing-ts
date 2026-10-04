import { BailErrorStrategy, CommonTokenStream, CharStreams, DefaultErrorStrategy, ErrorListener, PredictionMode, RecognitionException, Recognizer, Token } from "antlr4";
import ProcessingLexer from "./antlr/parser/ProcessingLexer";
import ProcessingParser from "./antlr/parser/ProcessingParser";

/**
 * Parse sketch source into an ANTLR parse tree.
 * Kept free of runtime imports so it can run (and be tested/benchmarked) outside the browser.
 */
export function parseSketch(sketch_content:string){
  const parser=new ProcessingParser(new CommonTokenStream(new ProcessingLexer(CharStreams.fromString(sketch_content))));
  const error=new TranspileErrorListener<Token>();
  const tree=parse(parser,error);
  return {tree,error};
}

/**
 * Two-stage parse. SLL prediction is far faster (the alternatives of processingSketch are otherwise
 * only distinguishable at the end of the input) and yields the same tree for valid sketches.
 * On any syntax error, reparse with full LL so the reported errors are exact.
 */
function parse(parser:ProcessingParser,listener:TranspileErrorListener<Token>){
  const sll_errors=new TranspileErrorListener<Token>();
  parser.removeErrorListeners();
  parser.addErrorListener(sll_errors);
  parser._errHandler=new BailErrorStrategy();
  (parser._interp as any).predictionMode=PredictionMode.SLL;
  try{
    const tree=parser.processingSketch();
    // Errors reported from grammar actions (notifyErrorListeners) do not throw.
    if(!sll_errors.error)return tree;
  }catch(e){
    // ParseCancellationException from BailErrorStrategy: retry with LL below.
  }
  parser.reset();
  parser.removeErrorListeners();
  parser.addErrorListener(listener);
  parser._errHandler=new DefaultErrorStrategy();
  (parser._interp as any).predictionMode=PredictionMode.LL;
  return parser.processingSketch();
}

export class TranspileErrorListener<T> extends ErrorListener<T>{
  error=false;
  message="";
  column=0;
  line=0;

  syntaxError(recognizer: Recognizer<T>, offendingSymbol: T, line: number, column: number, msg: string, e: RecognitionException | undefined){
    this.error=true;
    this.message=msg;
    this.column=column;
    this.line=line;
  }

  getErrorMessage(){
    if(!this.error)return "";
    return `${this.message}\nline: ${this.line},column: ${this.column}`
  }
}
