import { CommonTokenStream, CharStreams, ErrorListener, RecognitionException, Recognizer, Token } from "antlr4";
import ProcessingLexer from "./antlr/parser/ProcessingLexer";
import ProcessingParser from "./antlr/parser/ProcessingParser";
import { PApplet } from "../runtime/PApplet";
import { MemberAnalyzer, class_data } from "./MemberAnalyzer";
import { ClassMember, SolvedClassMember } from "./Transpiler";
import { ReferenceSolver } from "./ReferenceSolver";
import { Converter } from "./Converter";

export const primitive_numbers:string[]=["int","float","long","double","short","byte"];

export let applet_instance:PApplet;
export let _main_sketch:string="";

let error_listener:TranspileErrorListener<Token>;

export function transpile(sketch_content:string,main_sketch:string){
  _main_sketch=main_sketch;
  applet_instance=new PApplet(null as any);
  performance.clearMarks();
  performance.clearMeasures();
  performance.mark("analyze_member()");
  const class_data=analyze_member(sketch_content);
  performance.mark("solve_reference()");
  const solved_class_data=solve_reference(class_data);
  performance.mark("convert()");
  const converted_class_data=convert(solved_class_data);
  performance.mark("end");
  performance.measure("function analyze_member()","analyze_member()","solve_reference()");
  performance.measure("analyze : new_instance","new_instance","read_stream");
  performance.measure("analyze : read_stream","read_stream","parse_tree");
  performance.measure("analyze : parse_tree","parse_tree","visit");
  performance.measure("analyze : visit","visit","end_analyze");
  performance.measure("function solve_reference()","solve_reference()","convert()");
  performance.measure("function convert()","convert()","end");
  performance.getEntriesByType("measure").forEach(e=>console.log(`${e.name} takes ${e.duration}ms`));
  return {result:converted_class_data,error:error_listener};
}

function analyze_member(sketch_content:string){
  performance.mark("new_instance");
  const member_analyzer=new MemberAnalyzer(_main_sketch);
  performance.mark("read_stream");
  const parser = new ProcessingParser(new CommonTokenStream(new ProcessingLexer(CharStreams.fromString(sketch_content))));
  error_listener = new TranspileErrorListener<Token>();
  parser.addErrorListener(error_listener);
  performance.mark("parse_tree");
  const tree = parser.processingSketch();
  performance.mark("visit");
  member_analyzer.visit(tree);
  performance.mark("end_analyze");
  return class_data;
}

function solve_reference(class_data:Map<string,ClassMember>){
  const solver=new ReferenceSolver();
  return solver.solve(class_data);
}

function convert(solved_class_data:Map<string,SolvedClassMember>){
  const converter=new Converter();
  return converter.convert(solved_class_data);
}

export function get_last<T>(a:T[]){
  if(a.length==0)return undefined;
  return a[a.length-1];
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