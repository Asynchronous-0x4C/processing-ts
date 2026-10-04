import { Token } from "antlr4";
import { parseSketch, TranspileErrorListener } from "./SketchParser";
import { PApplet } from "../runtime/PApplet";
import { MemberAnalyzer, class_data } from "./MemberAnalyzer";
import { ClassMember, SolvedClassMember } from "./Transpiler";
import { ReferenceSolver } from "./ReferenceSolver";
import { Converter } from "./Converter";

export { TranspileErrorListener };

export const primitive_numbers:string[]=["int","float","long","double","short","byte"];

export let applet_instance:PApplet;
export let _main_sketch:string="";

let error_listener:TranspileErrorListener<Token>;

/** Milliseconds spent in each transpiler phase. */
export type TranspileTimings={parse:number,analyze:number,solve:number,convert:number};

export function transpile(sketch_content:string,main_sketch:string){
  _main_sketch=main_sketch;
  applet_instance=new PApplet(null as any);
  const timings:TranspileTimings={parse:0,analyze:0,solve:0,convert:0};
  const class_data=analyze_member(sketch_content,timings);
  if(error_listener.error)return {result:"",error:error_listener,timings};
  let t=performance.now();
  const solved_class_data=solve_reference(class_data);
  timings.solve=performance.now()-t;
  t=performance.now();
  const converted_class_data=convert(solved_class_data);
  timings.convert=performance.now()-t;
  return {result:converted_class_data,error:error_listener,timings};
}

function analyze_member(sketch_content:string,timings:TranspileTimings){
  let t=performance.now();
  const member_analyzer=new MemberAnalyzer(_main_sketch);
  const {tree,error} = parseSketch(sketch_content);
  error_listener = error;
  timings.parse=performance.now()-t;
  t=performance.now();
  member_analyzer.visit(tree);
  timings.analyze=performance.now()-t;
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
