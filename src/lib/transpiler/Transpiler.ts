import { ArrayInitializerContext, BlockContext, ClassCreatorRestContext, CreatedNameContext, CreatorContext, ExpressionContext, FormalParameterContext, LastFormalParameterContext, MethodCallContext, PrimaryContext, ProcessingSketchContext, TypeArgumentsOrDiamondContext, TypeListContext, TypeTypeContext, VariableInitializerContext } from "./antlr/parser/ProcessingParser";
import ProcessingVisitor from "./antlr/parser/ProcessingVisitor";

export type SolvedFunctionData={name:string,type:string,async:boolean,override:boolean,extended:boolean,args:{name:string,type:string,rest?:boolean}[],body:string};
export type SolvedClassMember={field:{name:string,init:string,type:string,extended:boolean}[],method:SolvedFunctionData[],constructor:SolvedFunctionData[],class:string[],interface:string[]};
export type FunctionData={name:string,type:string,async:boolean,override:boolean,extended:boolean,args:{name:string,type:string,rest?:boolean}[],body:BlockContext};
export type ClassMember={field:{name:string,init:VariableInitializerContext|null,type:string,extended:boolean}[],method:FunctionData[],constructor:FunctionData[],class:string[],interface:string[]};

export class Transpiler extends ProcessingVisitor<string>{
  main_sketch:string;

  constructor(main_sketch:string) {
    super();
    this.main_sketch=main_sketch;
  }

  visit=(ctx:any):string=>{
    return ctx.accept(this);
  }

  visitChildren=(ctx:any):string=>{
    return ctx.children.map((child:any)=>("children" in child)?this.visit(child):child.getText()).join('');
  }
  
  visitProcessingSketch=(ctx: ProcessingSketchContext)=>{
    return this.visit(ctx.children![0]);
  }

  visitVariableInitializer=(ctx: VariableInitializerContext)=>{
    return this.visit(ctx.getChild(0));
  }

  visitArrayInitializer=(ctx: ArrayInitializerContext)=>{
    const child_count=ctx.getChildCount();
    let result="";
    for(let i=0;i<child_count;i++){
      const child=ctx.getChild(i);
      if(child instanceof VariableInitializerContext){
        result+=(result!=""?",":"")+this.visit(child);
      }
    }
    return `[${result}]`;
  }

  visitFormalParameter=(ctx: FormalParameterContext)=>{
    return ctx.variableDeclaratorId().IDENTIFIER().getText();
  }

  visitLastFormalParameter=(ctx: LastFormalParameterContext)=>{console.log(ctx)
    return `...${ctx.variableDeclaratorId().IDENTIFIER().getText()}`;
  }

  visitExpression=(ctx:ExpressionContext)=>{
    let result="";
    const child_count=ctx.getChildCount();
    for(let i=0;i<child_count;i++){
      const child=ctx.getChild(i);
      if(child instanceof ExpressionContext){
        result+=this.visit(child);
      }else if(child instanceof CreatorContext){
        result+=this.visit(child);
      }else if(child instanceof PrimaryContext){
        const has_bracket=child.LPAREN()!=null&&child.RPAREN()!=null;
        if(has_bracket)result+="(";
        if(child.expression()!=null){
          result+=this.visit(child.expression());
        }else{
          const primary=child.getText();
          const hex=(child.literal()?.hexColorLiteral()??false)?true:false;
          result+=hex?primary.replace("#","0x"):primary;
        }
        if(has_bracket)result+=")";
      }else if(child instanceof MethodCallContext){
        result+=this.visit(child);
      }else{
        result+=child.getText()+(child.getText()==="new"?" ":"");
      }
    }
    return result;
  }

  visitCreator=(ctx: CreatorContext)=>{
    const child_count=ctx.getChildCount();
    let result="";
    for(let i=0;i<child_count;i++){
      const child=ctx.getChild(i);
      if(child instanceof CreatedNameContext){
        const _child_count=child.getChildCount();
        for(let j=0;j<_child_count;j++){
          const _child=child.getChild(j);
          if(_child instanceof TypeArgumentsOrDiamondContext){
            result+=(j!=1?".":"")+this.visit(_child);
          }else{
            result+=_child.getText();
          }
        }
      }else if(child instanceof ClassCreatorRestContext){
        const expression_list=child.arguments().expressionList()
        result+=`(${expression_list!=null?this.visit(expression_list):""})`;
      }else{
        result+=child.getText();
      }
    }
    return result;
  }
  
  visitTypeArgumentsOrDiamond=()=>{
    return "";
  }

  visitTypeArguments=()=>{
    return "";
  }

  visitTypeList=(ctx: TypeListContext)=>{
    return ctx.typeType_list().map(t=>this.visit(t)).join(",");
  }

  visitTypeType=(ctx: TypeTypeContext)=>{
    if(ctx.classOrInterfaceType()){
      return `${ctx.classOrInterfaceType().IDENTIFIER_list().map(i=>i.getText()).join(".")}`
    }
    return ctx.getText();
  }
}