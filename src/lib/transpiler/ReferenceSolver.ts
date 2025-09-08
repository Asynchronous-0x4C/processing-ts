import { PApplet } from "../runtime/PApplet";
import { ArrayInitializerContext, BaseStringLiteralContext, ClassCreatorRestContext, CreatorContext, DefaultValueContext, EnhancedForControlContext, ExpressionContext, InnerCreatorContext, LambdaExpressionContext, LiteralContext, LocalVariableDeclarationContext, MethodCallContext, MethodDeclarationContext, PrimaryContext, StatementContext, StringLiteralContext, SwitchLabelContext, VariableDeclaratorIdContext, VariableInitializerContext } from "./antlr/parser/ProcessingParser";
import { _main_sketch, applet_instance, get_last } from "./Control";
import { class_data } from "./MemberAnalyzer";
import { ClassMember, SolvedClassMember, Transpiler } from "./Transpiler";

const replace_list=[{before:"keyPressed",after:"_keyPressed"},{before:"keyReleased",after:"_keyReleased"},{before:"keyTyped",after:"_keyTyped"},{before:"mousePressed",after:"_mousePressed"},{before:"mouseReleased",after:"_mouseReleased"},{before:"mouseClicked",after:"_mouseClicked"},{before:"mouseMoved",after:"_mouseMoved"},{before:"mouseDragged",after:"_mouseDragged"},{before:"mouseWheel",after:"_mouseWheel"}];
const overloaded_functions=["frameRate"];

export class ReferenceSolver extends Transpiler{
  solved_class_data:Map<string,SolvedClassMember>=new Map<string,SolvedClassMember>();
  vatiable_list:string[][]=[];
  current_class:string="";

  constructor(){
    super("");
  }

  solve(class_data:Map<string,ClassMember>){
    this.solved_class_data.set("super",{field:[],method:[],constructor:[],class:[],interface:[]});
    this.current_class="super";
    const applet=class_data.get(_main_sketch)!;
    const globals:ClassMember={field:[],method:[],constructor:[],class:[],interface:[]};

    applet.field=applet.field.filter(f=>{
      globals.field.push(f);
      return false;
    });
    const replace_name=replace_list.map(v=>v.before);
    applet.method=applet.method.filter(m=>{
      if(!replace_name.includes(m.name)&&!overloaded_functions.includes(m.name)&&applet_instance[m.name as keyof PApplet]==null){
        globals.method.push(m);
        return false;
      }
      return true;
    });

    globals.field.forEach(f=>{
      this.solved_class_data.get("super")?.field.push({name:f.name,init:f.init!=null?this.visit(f.init):f.type.startsWith("!")?"false":f.type.startsWith("@")?"0":"null",type:f.type.replace("!","").replace("@",""),extended:f.extended});
    });
    globals.method.forEach(m=>{
        this.vatiable_list=[[...m.args.map(a=>a.name)]];
        this.solved_class_data.get("super")?.method.push({name:m.name,type:m.type,async:m.async,override:m.override,extended:m.extended,args:m.args,body:m.body!=null?this.visit(m.body).slice(1,-1):""});
    });

    class_data.forEach((v,k)=>{
      this.solved_class_data.set(k,{field:[],method:[],constructor:[],class:v.class,interface:v.interface});
      this.current_class=k;
      this.vatiable_list=[[]];
      v.field.forEach(f=>{
        this.solved_class_data.get(k)?.field.push({name:f.name,init:f.init!=null?this.visit(f.init):f.type.startsWith("!")?"false":f.type.startsWith("@")?"0":"null",type:f.type.replace("!","").replace("@",""),extended:f.extended});
      });
      v.constructor.forEach(c=>{
        this.vatiable_list=[[...c.args.map(a=>a.name)]];
        const base=`${this.solved_class_data.get(k)!.field.filter(f=>!f.extended).map(f=>`this.${f.name}=${f.init}`).join(";")+(this.solved_class_data.get(k)!.field.length>0?";":"")}${c.body!=null?this.visit(c.body).slice(1,-1):""}`;
        this.solved_class_data.get(k)?.constructor.push({name:c.name,type:c.type,async:c.async,override:c.override,extended:c.extended,args:c.args,body:base});
      });
      v.method.forEach(m=>{
        this.vatiable_list=[[...m.args.map(a=>a.name)]];
        this.solved_class_data.get(k)?.method.push({name:m.name,type:m.type,async:m.async,override:m.override,extended:m.extended,args:m.args,body:m.body!=null?this.visit(m.body).slice(1,-1):""});
      });

      if(k==_main_sketch){
        this.solved_class_data.get(k)!.constructor.push({name:k,type:k,async:false,override:true,extended:false,args:[],body:"super(arguments[0]);"});
        const setup=this.solved_class_data.get(k)!.method.find(m=>m.name=="setup");
        if(setup){
          let match=setup.body.match(/__applet__.size\(\d+,\d+(?:,(?:P2D|P3D))?\);/);
          if(!match)match=setup.body.match(/__applet__.fullScreen\((?:P2D|P3D|\d+)?\);/);
          let idx=0;
          if(match){
            idx=match!.index!+match![0].length;
          }
          setup.body=[setup.body.slice(0,idx),this.solved_class_data.get(k)!.field.filter(f=>!f.extended).map(f=>`this.${f.name}=${f.init}`).join(";")+(this.solved_class_data.get(k)!.field.length>0?";":""),setup.body.slice(idx)].join("");
        }
        v.method.forEach((m,i)=>{
          replace_list.forEach((replace)=>{
            if(m.name==replace.before){
              this.solved_class_data.get(k)!.method[i].name=replace.after;
            }
          });
        });
      }
    });
    return this.solved_class_data;
  }
    
  visitMethodDeclaration=(ctx:MethodDeclarationContext)=>{
    const method_name = ctx.IDENTIFIER().getText();
    const arg_list=this.visit(ctx.formalParameters());
    return `function ${method_name}${arg_list}${this.visit(ctx.methodBody())}`;
  }

  visitLocalVariableDeclaration=(ctx: LocalVariableDeclarationContext)=>{
    return `let ${this.visit(ctx.variableDeclarators())}`;
  }

  visitStatement=(ctx: StatementContext)=>{
    this.vatiable_list.push([]);
    let result="";
    switch(ctx.getChild(0).getText()){
      case "return":
        result=`return${ctx.expression(0)!=null?` ${this.visit(ctx.expression(0))}`:""};`;
        break;
      case "if":
        if(ctx.ELSE()!=null){
          result=`if${this.visit(ctx.parExpression())}${this.visit(ctx.statement_list()[0])}else ${this.visit(ctx.statement_list()[1])}`;
        }else{
          result=this.visitChildren(ctx);
        }
        break;
      default:
        result=this.visitChildren(ctx);
        break;
    }
    this.vatiable_list.pop();
    return result;
  }

  visitSwitchLabel=(ctx: SwitchLabelContext)=>{
    return ctx.CASE()!=null?`${ctx.CASE()} ${ctx.expression()!=null?this.visit(ctx.expression()):this.visit(ctx.IDENTIFIER())}:`:`${ctx.DEFAULT()}:`;
  }

  visitVariableDeclaratorId=(ctx: VariableDeclaratorIdContext)=>{
    this.vatiable_list[this.vatiable_list.length-1].push(ctx.IDENTIFIER().getText());
    return ctx.IDENTIFIER().getText();
  }

  visitEnhancedForControl=(ctx: EnhancedForControlContext)=>{
    return `let ${this.visit(ctx.variableDeclaratorId())} of ${this.visit(ctx.expression())}`;
  }

  visitVariableInitializer=(ctx: VariableInitializerContext)=>{
    return this.visitChildren(ctx);
  }

  visitArrayInitializer=(ctx: ArrayInitializerContext)=>{
    return `[${ctx.variableInitializer_list().map(v=>this.visit(v)).join(",")}]`;
  }
  
  visitExpression=(ctx:ExpressionContext)=>{
    if(ctx.INSTANCEOF()!=null){

    }else if(ctx.typeType()!=null){
      return this.visit(ctx.expression(0));
    }
    if(this.current_class=="super"&&ctx.children&&ctx._bop!=null&&ctx.expression(0)!=null){
      if(ctx.expression(0).getText()==="this")ctx.children=ctx.children?.slice(2);
    }
    return this.visitChildren(ctx);
  }

  visitLambdaExpression=(ctx: LambdaExpressionContext)=>{
    this.vatiable_list.push([ctx.lambdaParameters().IDENTIFIER_list().map(i=>i.getText()).join(",")]);
    const result=`FunctionalInterface.get(${this.visit(ctx.lambdaParameters())}=>${this.visit(ctx.lambdaBody())})`;
    this.vatiable_list.pop();
    return result;
  }

  visitMethodCall=(ctx: MethodCallContext)=>{
    if(ctx.IDENTIFIER()!=null){
      const {is_member,is_applet_member}=isMemberMethod(class_data,this.current_class,ctx);
      const is_overloaded=(!is_member)&&is_applet_member&&overloaded_functions.includes(ctx.IDENTIFIER().getText());
      const length=ctx.IDENTIFIER().getText()=="length"&&!(is_member||is_applet_member)&&(ctx.parentCtx as ExpressionContext)._bop!=null&&ctx.expressionList()==null;
      return (is_member?"this.":is_applet_member?"__applet__.":"")+(is_overloaded?"_":"")+ctx.IDENTIFIER()+(length?"":`(${ctx.expressionList()!=null?this.visit(ctx.expressionList()):""})`);
    }else if(ctx.functionWithPrimitiveTypeName()!=null){
      const _ctx=ctx.functionWithPrimitiveTypeName();
      return `__applet__.${_ctx.getChild(0).getText()}(${_ctx.expressionList()!=null?this.visit(_ctx.expressionList()):""})`;
    }
    return this.visitChildren(ctx);
  }

  visitPrimary=(ctx: PrimaryContext)=>{
    if(ctx.IDENTIFIER()!=null){
      const {is_member,is_applet_member}=isMemberVariable(class_data,this.current_class,this.vatiable_list,ctx);
      return (is_member?"this.":is_applet_member?"__applet__.":"")+ctx.IDENTIFIER().getText();
    }
    return this.visitChildren(ctx);
  }

  visitLiteral=(ctx: LiteralContext)=>{
    if(ctx.hexColorLiteral()!=null){
      return ctx.getText().replace("#","0x");
    }
    return ctx.getText();
  }

  visitCreator=(ctx: CreatorContext)=>{
    if(ctx.arrayCreatorRest()!=null){
      const _ctx=ctx.arrayCreatorRest();
      if(_ctx.arrayInitializer()!=null){
        return this.visit(_ctx.arrayInitializer());
      }
      let creator="";
      _ctx.expression_list().forEach(e=>{
        creator+=` Array(${this.visit(e)}).fill().map(_=>`;
      });
      if(ctx.createdName().primitiveType()!=null){
        if(ctx.createdName().getText()=="boolean"){
          creator+="false";
        }else{
          creator+="0";
        }
      }else{
        creator+="null";
      }
      creator+=new Array(_ctx.expression_list().length).fill(")").join("");
      return creator;
    }else if(ctx.classCreatorRest()!=null&&ctx.classCreatorRest().classBody()!=null){
      return " "+this.visit(ctx.classCreatorRest());
    }
    return " "+this.visitChildren(ctx);
  }

  visitClassCreatorRest=(ctx: ClassCreatorRestContext)=>{
    if(ctx.classBody()!=null){
      const inner_name="anonymous";
      const parent=ctx.parentCtx;
      const name=(parent instanceof CreatorContext)?get_last(parent.createdName().IDENTIFIER_list())!.getText():(ctx as unknown as InnerCreatorContext).IDENTIFIER().getText();
      const methods=ctx.classBody().classBodyDeclaration_list().filter(c=>c.memberDeclaration()!=null).map(m=>m.memberDeclaration()!).filter(c=>c.methodDeclaration()!=null).map(m=>m.methodDeclaration()!);
      return `(function(){function ${inner_name}(){};${inner_name}.prototype=new ${name}();${methods.map(m=>`${inner_name}.prototype.${m.IDENTIFIER().getText()}=${this.visit(m).replace(` ${m.IDENTIFIER().getText()}`,"")};`).join("")}return ${inner_name};}())${this.visit(ctx.arguments())}`;
    }else{
      return this.visitChildren(ctx);
    }
  }

  visitNonWildcardTypeArguments=()=>{
    return "";
  }

  visitNonWildcardTypeArgumentsOrDiamond=()=>{
    return "";
  }

  visitTypeArgumentsOrDiamond=()=>{
    return "";
  }

  visitDefaultValue=(ctx: DefaultValueContext)=>{
    return ctx.getText();
  }
}

function isMemberVariable(class_data:Map<string,ClassMember>,class_name:string,variable_data:string[][],ctx:PrimaryContext){
  const primary=ctx.IDENTIFIER().getText();
  let is_local=false;
  variable_data.forEach((vd)=>{
    vd.forEach((v)=>{
      if(v===primary){
        is_local=true;
      }
    });
  });
  let is_member=false;
  class_data.get(class_name)?.field.forEach((field)=>{
    if(primary===field.name){
      is_member=true;
    }
  });
  let is_applet_member=primary in applet_instance&&typeof applet_instance[primary as keyof PApplet] !== "function";
  class_data.get(_main_sketch)?.field.forEach((field)=>{
    if(primary===field.name){
      is_applet_member=true;
    }
  });
  is_member=!is_local&&is_member;
  is_applet_member=!is_local&&is_applet_member;
  return {is_member,is_applet_member};
}

function isMemberMethod(class_data:Map<string,ClassMember>,class_name:string,ctx:MethodCallContext){
  if((ctx.parentCtx as ExpressionContext).expression_list().length>0)return {is_member:false,is_applet_member:false};
  const name=ctx.IDENTIFIER().getText();
  let is_member=false;
  class_data.get(class_name)?.method.forEach((method)=>{
    if(name===method.name){
      is_member=true;
    }
  });
  if(class_name===_main_sketch)is_member=false;
  let is_applet_member=name in applet_instance&&(typeof applet_instance[name as keyof PApplet] === "function"||overloaded_functions.includes(name));
  class_data.get(_main_sketch)?.method.forEach((method)=>{
    if(name===method.name){console.log(name,method,typeof applet_instance[name as keyof PApplet])
      is_applet_member=true;
    }
  });
  return {is_member,is_applet_member};
}