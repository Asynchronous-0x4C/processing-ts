import { PApplet } from "../runtime/PApplet";
import { _main_sketch, applet_instance } from "./Control";
import { SolvedClassMember, SolvedFunctionData } from "./Transpiler";

const replace_list:{before:string,after:string}[]=[];

export class Converter{
  
  convert(solved_class_data:Map<string,SolvedClassMember>){
    let result="";
    solved_class_data.forEach((v,k)=>{
      result+=`class ${k}${v.class.length>0?` extends ${v.class[0]}`:""}{\n`;
      result+=getSafeConstructor(v.constructor)+"\n";
      result+=getSafeMethod(v.method)+"\n}";
    });
    const used_fn=new Set<string>();
    const regx=/__applet__.(\w+)\(/g;
    let match;
    while((match=regx.exec(result))!=null){
      used_fn.add(match[1]);
    }
    used_fn.forEach(fn=>{
      let instance;
      if((instance=applet_instance[fn as keyof PApplet])!=null){
        if(instance.constructor.name==="AsyncFunction"){
          result=result.replaceAll(`__applet__.${fn}`,`await __applet__.${fn}`);
        }
      }
    });
    replace_list.forEach((replace)=>{
      result=result.replace(replace.before,replace.after);
    });
    result+=`\nconst __applet__=new ${_main_sketch}(__renderer__);\nreturn __applet__;`;
    return result;
  }
}

function getType(type:string){
  if(type.includes("[]")){
    return type.replace("[]","").replace(" ","")+"[]";
  }else if(type.includes("<")){
    return type.replace(/<.*?>/,"").replace(" ","");
  }else{
    return type.replace(" ","").replace(/int|float|long|double|byte|short|color/,"Number").replace("char","String");
  }
}

function getSafeMethod(method_data:SolvedFunctionData[]){
  const unique_method=new Map<string,SolvedFunctionData[]>();
  method_data.filter(m=>!m.extended).forEach(m=>{
    if(unique_method.has(m.name)){
      unique_method.get(m.name)!.push(m);
    }else{
      unique_method.set(m.name,[m]);
    }
  });
  const method_list:string[]=[];
  unique_method.forEach((v,k)=>{
    if(v.length==1){
      const method=`${v[0].async?"async ":""}${k}(${v[0].args.map((a)=>a.name).join(",")}){\n${v[0].body}}\n`;
      method_list.push(method);
    }else{
      let method=`${v[0].async?"async ":""}${k}(...args){\n`;
      v.forEach((m)=>{
        method+=`if(args.length==${m.args.length}${m.args.map((v,i)=>v.type.includes("[]")?`&&Array.isArray(args[${i}])`:`&&args[${i}] instanceof ${getType(v.type)}`)}){\n${m.body==""&&m.override?`super.${k}(args);\n`:m.body}}else `;
      });
      method=method.slice(0,-5)+"}\n";
      method_list.push(method);
    }
  });
  return method_list.join("\n");
}

function getSafeConstructor(constructor_data:SolvedFunctionData[]){
  let constructor_list:string="";
  if(constructor_data.length==0){
    const constructor=`constructor(){}\n`;
    constructor_list=constructor;
  }else if(constructor_data.length==1){
    const constructor=`constructor(${constructor_data[0].args.map((a)=>a.name).join(",")}){\n${constructor_data[0].body}}\n`;
    constructor_list=constructor;
  }else{
    let constructor=`constructor(...args){\n`;
    constructor_data.forEach((m)=>{
      constructor+=`if(args.length==${m.args.length}${m.args.map((v,i)=>v.type.includes("[]")?`&&Array.isArray(args[${i}])`:`&&args[${i}] instanceof ${getType(v.type)}`)}){\n${m.args.map((v,i)=>`const ${v.name}=args[${i}];\n`)}${m.body}}else `;
    });
    constructor=constructor.slice(0,-5)+"}\n";
    constructor_list=constructor;
  }
  return constructor_list;
}