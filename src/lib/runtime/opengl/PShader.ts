import type { PApplet } from "../PApplet";
import { PImage } from "../PImage";
import { PMatrix2D } from "../PMatrix2D";
import { PMatrix3D } from "../PMatrix3D";
import { PVector } from "../util/PVector";
import { exceptions } from "../../../runtime/lang/index.ts";
import { GLCompileError, type GLContext, type GLProgram } from "./GLContext";
import * as S from "./shaders";

/** Shader kinds (Processing's PShader constants). */
export const ShaderKind={POINT:0,LINE:1,POLY:2,COLOR:3,LIGHT:4,TEXTURE:5,TEXLIGHT:6} as const;

const RESERVED_ES3=["smooth","flat","filter","input","output","active","common","partition","half","fixed","sizeof","cast","namespace","using","superp","sample","patch","buffer","shared","resource","invariant","precise"];

/**
 * A GLSL source (desktop GLSL 1.10–1.50 or GLSL ES 1.00, as Processing's shaders are written) as GLSL
 * ES 3.00 for WebGL2: attribute/varying become in/out, texture2D() and friends texture(), the uniform
 * named `texture` texMap (it would hide the function), gl_FragColor an output, and every precision is
 * highp (desktop GL ignores the qualifiers). Sources that already say `#version 300 es` are kept.
 */
export function toGLSL3(src:string,stage:"vertex"|"fragment"):string{
  if(/^\s*#version\s+300\s+es/m.test(src))return src;
  let s=src.replace(/^[ \t]*#version[^\n]*\n?/m,"");
  s=s.replace(/^[ \t]*#extension\s+GL_(OES_standard_derivatives|EXT_shader_texture_lod|EXT_frag_depth|EXT_draw_buffers)[^\n]*\n?/gm,"");
  s=s.replace(/\b(lowp|mediump)\b/g,"highp");
  s=s.replace(/\btexture2DLodEXT\s*\(/g,"textureLod(").replace(/\btexture2DLod\s*\(/g,"textureLod(")
    .replace(/\btextureCubeLod(EXT)?\s*\(/g,"textureLod(").replace(/\btexture2DProj\s*\(/g,"textureProj(")
    .replace(/\btexture2DGradEXT\s*\(/g,"textureGrad(");
  // the identifier `texture` (not a call) is Processing's texture uniform
  s=s.replace(/\btexture\b(?!\s*\()/g,"texMap");
  s=s.replace(/\btexture2D\s*\(/g,"texture(").replace(/\btextureCube\s*\(/g,"texture(");
  for(const w of RESERVED_ES3)s=s.replace(new RegExp(`\\b${w}\\b`,"g"),`${w}_`);
  if(stage==="vertex"){
    s=s.replace(/\battribute\b/g,"in").replace(/\bvarying\b/g,"out");
  }else{
    s=s.replace(/\bvarying\b/g,"in");
    const usesData=/\bgl_FragData\b/.test(s);
    if(/\bgl_FragColor\b/.test(s)||usesData){
      s=s.replace(/\bgl_FragColor\b/g,"_fragColor").replace(/\bgl_FragData\s*\[\s*0\s*\]/g,"_fragColor");
      s="out vec4 _fragColor;\n"+s;
    }
  }
  return "#version 300 es\nprecision highp float;\nprecision highp int;\nprecision highp sampler2D;\n#line 1\n"+s;
}

/**
 * ES 3.00 has no implicit int → float conversion (desktop GLSL 1.20 has it): integer literals on the
 * lines a compile error names become float literals, except array sizes/indices, int declarations and
 * for-loop headers.
 */
function floatLiterals(src:string,lines:Set<number>):string{
  const out=src.split("\n");
  // the converted source's line 1 is the original's line 1 after "#line 1"
  const lineStart=out.findIndex((l)=>l.startsWith("#line 1"))+1;
  for(const ln of lines){
    const i=lineStart+ln-1;
    if(i<0||i>=out.length)continue;
    const line=out[i];
    if(/^\s*#/.test(line)||/\b(int|ivec[234]|uint|uvec[234]|bool)\s+\w+\s*(=|;|\[)/.test(line)||/\bfor\s*\(/.test(line))continue;
    let depth=0;
    let r="";
    for(let k=0;k<line.length;){
      const c=line[k];
      if(c==="[")depth++;
      if(c==="]")depth--;
      const m=/^\d+(?![\d.eExXuU])/.exec(line.slice(k));
      const prev=k>0?line[k-1]:"";
      if(m&&depth===0&&!/[\w.]/.test(prev)){
        r+=m[0]+".0";
        k+=m[0].length;
        continue;
      }
      r+=c;
      k++;
    }
    out[i]=r;
  }
  return out.join("\n");
}

/** Lines named by compile errors ("ERROR: 0:12: ..."). */
function errorLines(log:string):Set<number>{
  const s=new Set<number>();
  for(const m of log.matchAll(/ERROR:\s*\d+:(\d+):/g))s.add(Number(m[1]));
  return s;
}

type UniformValue={kind:"f"|"i"|"b"|"tex"|"mat",values:ArrayLike<number>|PImage,n:number,transpose?:boolean};

/**
 * Processing's PShader: a vertex and fragment shader pair with the values the sketch set(). The kind
 * (point, line, color, light, texture, texlight) comes from `#define PROCESSING_*_SHADER` or, without
 * one, from the attributes and uniforms the sources declare; a missing stage uses the built-in shader
 * of that kind. Compiled lazily on the renderer's GL context (errors name the shader and line).
 */
export class PShader{
  parent:PApplet|null;
  vertSource:string|null;
  fragSource:string|null;
  vertName:string;
  fragName:string;
  /** One of ShaderKind. */
  type:number;
  uniformValues=new Map<string,UniformValue>();
  private programs=new WeakMap<GLContext,GLProgram>();
  private failed=false;

  constructor(parent?:PApplet|null,vert?:string|string[]|null,frag?:string|string[]|null,names?:{vert?:string,frag?:string}){
    this.parent=parent??null;
    this.vertSource=vert==null?null:Array.isArray(vert)?vert.join("\n"):vert;
    this.fragSource=frag==null?null:Array.isArray(frag)?frag.join("\n"):frag;
    this.vertName=names?.vert??"vertex shader";
    this.fragName=names?.frag??"fragment shader";
    this.type=PShader.detect(this.vertSource,this.fragSource);
  }

  setVertexShader(src:string|string[]){
    this.vertSource=Array.isArray(src)?src.join("\n"):src;
    this.type=PShader.detect(this.vertSource,this.fragSource);
    this.programs=new WeakMap();
  }

  setFragmentShader(src:string|string[]){
    this.fragSource=Array.isArray(src)?src.join("\n"):src;
    this.type=PShader.detect(this.vertSource,this.fragSource);
    this.programs=new WeakMap();
  }

  static detect(vert:string|null,frag:string|null):number{
    const all=(vert??"")+"\n"+(frag??"");
    const def=/#define\s+PROCESSING_(POINT|LINE|POLYGON|COLOR|LIGHT|TEXTURE|TEXLIGHT)_SHADER/.exec(all);
    if(def){
      switch(def[1]){
        case "POINT":return ShaderKind.POINT;
        case "LINE":return ShaderKind.LINE;
        case "COLOR":return ShaderKind.COLOR;
        case "LIGHT":return ShaderKind.LIGHT;
        case "TEXTURE":return ShaderKind.TEXTURE;
        case "TEXLIGHT":return ShaderKind.TEXLIGHT;
        default:return ShaderKind.POLY;
      }
    }
    const v=vert??"";
    if(/\battribute\s+\w+\s+offset\b|\bin\s+\w+\s+offset\b/.test(v))return ShaderKind.POINT;
    if(/\battribute\s+\w+\s+direction\b|\bin\s+\w+\s+direction\b/.test(v))return ShaderKind.LINE;
    const tex=/\bsampler2D\s+(texture|texMap)\b/.test(all)||/\btexCoord\b/.test(v)||/\bvertTexCoord\b/.test(frag??"")&&!vert;
    const light=/\b(lightCount|lightPosition|lightNormal|lightAmbient|lightDiffuse)\b/.test(all)||/\bnormal\b/.test(v);
    if(tex&&light)return ShaderKind.TEXLIGHT;
    if(light)return ShaderKind.LIGHT;
    if(tex)return ShaderKind.TEXTURE;
    return ShaderKind.COLOR;
  }

  /** The built-in sources of a kind (vertex, fragment). */
  static defaults(kind:number):[string,string]{
    switch(kind){
      case ShaderKind.POINT:return [S.POINT_VERT,S.POINT_FRAG];
      case ShaderKind.LINE:return [S.LINE_VERT,S.LINE_FRAG];
      case ShaderKind.LIGHT:return [S.LIGHT_VERT,S.LIGHT_FRAG];
      case ShaderKind.TEXTURE:return [S.TEXTURE_VERT,S.TEXTURE_FRAG];
      case ShaderKind.TEXLIGHT:return [S.TEXLIGHT_VERT,S.TEXLIGHT_FRAG];
      default:return [S.COLOR_VERT,S.COLOR_FRAG];
    }
  }

  isPolyShader(){
    return this.type>=ShaderKind.POLY;
  }

  /** The linked program on a context, or null after a compile error (reported once). */
  program(glc:GLContext):GLProgram|null{
    const cached=this.programs.get(glc);
    if(cached)return cached;
    if(this.failed)return null;
    const [dv,df]=PShader.defaults(this.type);
    let vert=this.vertSource!==null?toGLSL3(this.vertSource,"vertex"):dv;
    let frag=this.fragSource!==null?toGLSL3(this.fragSource,"fragment"):df;
    for(let attempt=0;;attempt++){
      try{
        const p=glc.program(vert,frag);
        this.programs.set(glc,p);
        return p;
      }catch(e){
        if(!(e instanceof GLCompileError))throw e;
        const lines=errorLines(e.log);
        if(attempt<4&&lines.size&&e.stage!=="link"){
          const fixed=e.stage==="vertex"?floatLiterals(vert,lines):floatLiterals(frag,lines);
          if(e.stage==="vertex"&&fixed!==vert&&this.vertSource!==null){vert=fixed;continue;}
          if(e.stage==="fragment"&&fixed!==frag&&this.fragSource!==null){frag=fixed;continue;}
        }
        this.failed=true;
        const name=e.stage==="vertex"?this.vertName:e.stage==="fragment"?this.fragName:`${this.vertName} / ${this.fragName}`;
        exceptions.printError(`Cannot compile ${e.stage==="link"?"shader program":name}:\n${e.log.trim()}`);
        throw new exceptions.RuntimeException(`Cannot compile ${e.stage==="link"?"shader program":e.stage+" shader"} ${name}`);
      }
    }
  }

  /**
   * set(name, x[, y, z, w]) with floats, ints or booleans; set(name, float[]/int[]/boolean[][, ncoords]);
   * set(name, PVector), set(name, PMatrix2D/PMatrix3D[, use3x3]), set(name, PImage).
   */
  set(name:string,...a:unknown[]){
    const x=a[0];
    if(x instanceof PImage){
      this.uniformValues.set(name,{kind:"tex",values:x,n:1});
    }else if(x instanceof PVector){
      this.uniformValues.set(name,{kind:"f",values:[x.x,x.y,x.z],n:3});
    }else if(x instanceof PMatrix3D){
      const m=x;
      if(a[1]===true)this.uniformValues.set(name,{kind:"mat",values:[m.m00,m.m01,m.m02,m.m10,m.m11,m.m12,m.m20,m.m21,m.m22],n:9,transpose:true});
      else this.uniformValues.set(name,{kind:"mat",values:m.get(null) as Float32Array,n:16,transpose:true});
    }else if(x instanceof PMatrix2D){
      this.uniformValues.set(name,{kind:"mat",values:[x.m00,x.m01,x.m10,x.m11],n:4,transpose:true});
    }else if(typeof x==="boolean"){
      this.uniformValues.set(name,{kind:"b",values:a.map((v)=>v?1:0),n:a.length});
    }else if(typeof x==="number"){
      this.uniformValues.set(name,{kind:"f",values:a as number[],n:a.length});
    }else if(x&&typeof x==="object"&&"length" in x){
      const arr=x as ArrayLike<number|boolean>;
      const n=typeof a[1]==="number"?a[1]:1;
      const kind=x instanceof Int32Array?"i":typeof arr[0]==="boolean"?"b":"f";
      this.uniformValues.set(name,{kind,values:Array.from(arr,(v)=>Number(v)),n});
    }
  }

  bind(){}
  unbind(){}
  bound(){return false;}
  init(){}
}
