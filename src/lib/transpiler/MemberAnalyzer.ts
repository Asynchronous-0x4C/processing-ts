import { ActiveProcessingSketchContext, VariableDeclaratorContext, ClassDeclarationContext, InterfaceDeclarationContext, MethodDeclarationContext, ConstructorDeclarationContext, FormalParameterContext, InterfaceMethodDeclarationContext, ConstantDeclaratorContext, FieldDeclarationContext, ConstDeclarationContext } from "./antlr/parser/ProcessingParser";
import { _main_sketch, get_last } from "./Control";
import { ClassMember, Transpiler } from "./Transpiler";

export let class_data:Map<string,ClassMember>=new Map<string,ClassMember>();

const async_list:string[]=["settings","setup","draw"];

export class MemberAnalyzer extends Transpiler{
  class_names:string[]=[];
  arg_list:{name:string,type:string}[]=[];

  constructor(main_sketch:string){
    super(main_sketch);
    class_data=new Map<string,ClassMember>();
  }
  
  visitActiveProcessingSketch=(ctx: ActiveProcessingSketchContext)=>{
    this.class_names.push(this.main_sketch);
    class_data.set(this.main_sketch,{field:[],method:[],constructor:[],class:["PApplet"],interface:[]});
    this.visitChildren(ctx);
    this.class_names.pop();
    this.mergeByHierarchy();
    return "";
  }

  visitClassDeclaration=(ctx:ClassDeclarationContext)=>{
    const className = ctx.IDENTIFIER().getText();
    this.class_names.push(className);
    class_data.set(className,{field:[],method:[],constructor:[],class:[],interface:[]});
    if(ctx.typeType()!=null){
      class_data.get(className)!.class.push(this.visit(ctx.typeType()));
    }
    ctx.typeList()?.typeType_list().forEach(t=>{
      class_data.get(className)!.interface.push(this.visit(t));
    });
    this.visit(ctx.classBody());
    this.class_names.pop();
    return "";
  }

  visitInterfaceDeclaration=(ctx: InterfaceDeclarationContext)=>{
    const interfaceName = ctx.IDENTIFIER().getText();
    this.class_names.push(interfaceName);
    class_data.set(interfaceName,{field:[],method:[],constructor:[],class:[],interface:[]});
    ctx.typeList()?.typeType_list().forEach(t=>{
      class_data.get(interfaceName)!.interface.push(this.visit(t));
    });
    this.visit(ctx.interfaceBody());
    this.class_names.pop();
    return "";
  }
  
  visitConstructorDeclaration=(ctx: ConstructorDeclarationContext)=>{
    const data=class_data.get(get_last(this.class_names)!)!;
    const class_name=ctx.IDENTIFIER().getText();
    this.arg_list=[];
    this.visit(ctx.formalParameters());
    data.constructor.push({name:class_name,type:class_name,async:false,override:false,extended:false,args:structuredClone(this.arg_list),body:ctx._constructorBody});
    return "";
  }
  
  visitMethodDeclaration=(ctx:MethodDeclarationContext)=>{
    const data=class_data.get(get_last(this.class_names)!)!;
    const method_name = ctx.IDENTIFIER().getText();
    this.arg_list=[];
    this.visit(ctx.formalParameters());
    let is_async=get_last(this.class_names)===_main_sketch&&async_list.includes(method_name);
    data.method.push({name:method_name,type:ctx.typeTypeOrVoid().getText(),async:is_async,override:false,extended:false,args:structuredClone(this.arg_list),body:ctx.methodBody().block()??null});
    return "";
  }

  visitInterfaceMethodDeclaration=(ctx: InterfaceMethodDeclarationContext)=>{
    const data=class_data.get(get_last(this.class_names)!)!;
    const method_name = ctx.IDENTIFIER().getText();
    this.arg_list=[];
    this.visit(ctx.formalParameters());
    data.method.push({name:method_name,type:ctx.typeTypeOrVoid().getText(),async:false,override:false,extended:false,args:structuredClone(this.arg_list),body:ctx.methodBody().block()??null});
    return "";
  }

  visitFormalParameter=(ctx: FormalParameterContext)=>{
    const name=ctx.variableDeclaratorId().getText();
    const type=ctx.typeType().getText();
    this.arg_list.push({name:name,type:type});
    return "";
  }

  visitLastFormalParameter=(ctx: FormalParameterContext)=>{
    const name=ctx.variableDeclaratorId().getText();
    const type=ctx.typeType().getText();
    this.arg_list.push({name:name,type:type+"[]"});
    return ""
  }

  current_type:string="";

  visitFieldDeclaration=(ctx: FieldDeclarationContext)=>{
    const is_array=ctx.typeType().LBRACK_list().length>0&&ctx.typeType().RBRACK_list().length>0;
    const is_bool=!is_array&&ctx.typeType().primitiveType()!=null&&ctx.typeType().primitiveType().BOOLEAN()!=null;
    const is_num=!is_array&&ctx.typeType().primitiveType()!=null&&!is_bool;
    this.current_type=(is_bool?"!":is_num?"@":"")+ctx.typeType().getText();
    this.visitChildren(ctx);
    return "";
  }

  visitVariableDeclarator=(ctx:VariableDeclaratorContext)=>{
    const name=ctx.variableDeclaratorId().IDENTIFIER().getText();
    const data=class_data.get(get_last(this.class_names)!)!;
    data.field.push({name:name,init:ctx.variableInitializer(),type:this.current_type,extended:false});
    return "";
  }

  visitConstDeclaration=(ctx: ConstDeclarationContext)=>{
    this.current_type=ctx.typeType().getText();
    this.visitChildren(ctx);
    return "";
  }

  visitConstantDeclarator=(ctx: ConstantDeclaratorContext)=>{
    const name=ctx.IDENTIFIER().getText();
    const data=class_data.get(get_last(this.class_names)!)!;
    data.field.push({name:name,init:ctx.variableInitializer(),type:this.current_type,extended:false});
    return "";
  }

  mergeByHierarchy(){
    const unmerged=new Map<string,ClassMember>(class_data);
    const merged:string[]=[];
    let pre_unmerged=unmerged.size;
    do{
      pre_unmerged=unmerged.size;
      unmerged.forEach((v,k)=>{
        const class_resolved=v.class.length==0||merged.includes(v.class[0]);
        const interface_resolved=v.interface.length==0||intersect(v.interface,merged);
        if(class_resolved&&interface_resolved){
          this.merge(k);
          unmerged.delete(k);
          merged.push(k);
        }
      });
    }while(pre_unmerged!=unmerged.size)
  }

  merge(className:string){
    class_data.set(className,mergeExtendedData(class_data.get(className)!,class_data));
  }
}

function mergeExtendedData(data:ClassMember,source:Map<string,ClassMember>):ClassMember{
  data.class.forEach(c=>{
    const field_names=data.field.map(f=>f.name);
    const method_names=data.method.map(m=>m.name);
    const parent=source.get(c);
    parent?.field.forEach(f=>{
      if(!(f.name in field_names)){
        data.field.push({name:f.name,init:f.init,type:f.type,extended:true});
      }
    });
    parent?.method.forEach(m=>{
      if(!(m.name in method_names)){
        data.method.push({name:m.name,type:m.type,async:m.async,override:m.override,extended:true,args:m.args,body:m.body});
      }else{
        const target=data.method.find(_m=>_m.name==m.name);
        if(target!=null)target.override=true;
      }
    });
  });
  data.interface.forEach(i=>{
    const field_names=data.field.map(f=>f.name);
    const method_names=data.method.map(m=>m.name);
    const parent=source.get(i);
    parent?.field.forEach(f=>{
      if(!(f.name in field_names))data.field.push(f);
    });
    parent?.method.forEach(m=>{
      if(!(m.name in method_names)){
        data.method.push(m);
      }else{
        const target=data.method.find(_m=>_m.name==m.name);
        if(target!=null)target.override=true;
      }
    });
  });
  return data;
}

function intersect(a:string[],b:string[]){
  let contains=false;
  a.forEach(e=>{
    if(b.includes(e))contains=true;
  })
  return contains;
}