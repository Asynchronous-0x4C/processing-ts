import type { PImage } from "../PImage";
import { argbToRgba } from "../PImage";

/** A linked program with its attribute and uniform locations by name. */
export class GLProgram{
  readonly program:WebGLProgram;
  readonly attribs=new Map<string,number>();
  readonly uniforms=new Map<string,{loc:WebGLUniformLocation,type:number,size:number}>();

  constructor(gl:WebGL2RenderingContext,program:WebGLProgram){
    this.program=program;
    const na=gl.getProgramParameter(program,gl.ACTIVE_ATTRIBUTES) as number;
    for(let i=0;i<na;i++){
      const a=gl.getActiveAttrib(program,i);
      if(a)this.attribs.set(a.name,gl.getAttribLocation(program,a.name));
    }
    const nu=gl.getProgramParameter(program,gl.ACTIVE_UNIFORMS) as number;
    for(let i=0;i<nu;i++){
      const u=gl.getActiveUniform(program,i);
      if(!u)continue;
      const name=u.name.replace(/\[0\]$/,"");
      const loc=gl.getUniformLocation(program,u.name);
      if(loc)this.uniforms.set(name,{loc,type:u.type,size:u.size});
    }
  }

  has(name:string){
    return this.uniforms.has(name);
  }
}

export class GLCompileError extends Error{
  constructor(message:string,readonly stage:"vertex"|"fragment"|"link",readonly log:string){
    super(message);
  }
}

/** A texture made from a PImage, re-uploaded when the image changes. */
type ImageTexture={tex:WebGLTexture,version:number,width:number,height:number,wrap:number,smooth:boolean};

/**
 * The WebGL2 context shared by the sketch's OpenGL surfaces (the window and createGraphics(P2D/P3D)),
 * as Processing shares one GL context: each surface draws into its own framebuffer, and one surface's
 * texture can be drawn by another. Compiled programs and image textures are cached here.
 */
export class GLContext{
  readonly gl:WebGL2RenderingContext;
  readonly canvas:HTMLCanvasElement|OffscreenCanvas;
  private programs=new Map<string,GLProgram>();
  private textures=new WeakMap<object,ImageTexture>();
  /** The framebuffer bound for drawing, and who owns it (to avoid rebinding). */
  boundTarget:unknown=null;
  readonly maxSamples:number;
  /** Scratch vertex/index buffers for streaming geometry. */
  readonly vbo:WebGLBuffer;
  readonly ibo:WebGLBuffer;
  readonly vao:WebGLVertexArrayObject;

  constructor(canvas:HTMLCanvasElement|OffscreenCanvas){
    this.canvas=canvas;
    const gl=canvas.getContext("webgl2",{alpha:false,antialias:false,depth:false,stencil:false,preserveDrawingBuffer:true,premultipliedAlpha:false}) as WebGL2RenderingContext|null;
    if(!gl)throw new Error("WebGL2 is not available: P2D and P3D need it.");
    this.gl=gl;
    this.maxSamples=gl.getParameter(gl.MAX_SAMPLES) as number;
    this.vbo=gl.createBuffer()!;
    this.ibo=gl.createBuffer()!;
    this.vao=gl.createVertexArray()!;
    gl.pixelStorei(gl.UNPACK_ALIGNMENT,1);
    gl.pixelStorei(gl.PACK_ALIGNMENT,1);
  }

  /** A program from vertex and fragment sources (cached by source). */
  program(vert:string,frag:string):GLProgram{
    const key=vert+"\u0000"+frag;
    let p=this.programs.get(key);
    if(p)return p;
    const gl=this.gl;
    const vs=this.compile(gl.VERTEX_SHADER,vert,"vertex");
    const fs=this.compile(gl.FRAGMENT_SHADER,frag,"fragment");
    const prog=gl.createProgram()!;
    gl.attachShader(prog,vs);
    gl.attachShader(prog,fs);
    gl.linkProgram(prog);
    if(!gl.getProgramParameter(prog,gl.LINK_STATUS)){
      const log=gl.getProgramInfoLog(prog)??"";
      throw new GLCompileError("Cannot link shader program:\n"+log,"link",log);
    }
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    p=new GLProgram(gl,prog);
    this.programs.set(key,p);
    return p;
  }

  private compile(type:number,source:string,stage:"vertex"|"fragment"):WebGLShader{
    const gl=this.gl;
    const s=gl.createShader(type)!;
    gl.shaderSource(s,source);
    gl.compileShader(s);
    if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){
      const log=gl.getShaderInfoLog(s)??"";
      gl.deleteShader(s);
      throw new GLCompileError(`Cannot compile ${stage} shader:\n${log}`,stage,log);
    }
    return s;
  }

  /** A 2D texture with the given filtering and wrapping. */
  createTexture(width:number,height:number,smooth=true,repeat=false):WebGLTexture{
    const gl=this.gl;
    const t=gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D,t);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA8,Math.max(1,width),Math.max(1,height),0,gl.RGBA,gl.UNSIGNED_BYTE,null);
    this.textureParams(smooth,repeat);
    return t;
  }

  textureParams(smooth:boolean,repeat:boolean){
    const gl=this.gl;
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,smooth?gl.LINEAR:gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,smooth?gl.LINEAR:gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,repeat?gl.REPEAT:gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,repeat?gl.REPEAT:gl.CLAMP_TO_EDGE);
  }

  /**
   * The texture of an image (uploaded from its pixels, or its canvas for drawing surfaces), bound to
   * TEXTURE_2D. Rows are uploaded top first, so t = 0 is the image's top (as Processing's textures).
   */
  imageTexture(img:PImage,repeat:boolean,smooth:boolean):WebGLTexture|null{
    const gl=this.gl;
    let t=this.textures.get(img);
    const version=img.__live__()?-1:img.__version__;
    const w=img.pixelWidth,h=img.pixelHeight;
    if(w<=0||h<=0)return null;
    if(t&&t.version===version&&version!==-1&&t.width===w&&t.height===h){
      gl.bindTexture(gl.TEXTURE_2D,t.tex);
      if(t.wrap!==(repeat?1:0)||t.smooth!==smooth){
        this.textureParams(smooth,repeat);
        t.wrap=repeat?1:0;t.smooth=smooth;
      }
      return t.tex;
    }
    if(!t){
      t={tex:gl.createTexture()!,version:-2,width:0,height:0,wrap:repeat?1:0,smooth};
      this.textures.set(img,t);
    }
    gl.bindTexture(gl.TEXTURE_2D,t.tex);
    if(img.__pixels_valid__()){
      const data=new Uint8Array(w*h*4);
      argbToRgba(img.pixels,data as unknown as Uint8ClampedArray,img.format===1);
      if(img.format===4){
        // ALPHA images: the pixel value is the alpha of white
        for(let i=0;i<w*h;i++){
          const a=img.pixels[i]&0xff;
          data[i*4]=data[i*4+1]=data[i*4+2]=255;data[i*4+3]=a;
        }
      }
      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA8,w,h,0,gl.RGBA,gl.UNSIGNED_BYTE,data);
    }else{
      const src=img.__native__();
      if(!src)return null;
      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA8,gl.RGBA,gl.UNSIGNED_BYTE,src as TexImageSource);
    }
    this.textureParams(smooth,repeat);
    t.version=version;t.width=w;t.height=h;t.wrap=repeat?1:0;t.smooth=smooth;
    return t.tex;
  }

  /** Forget an image's texture (it will be uploaded again). */
  dropTexture(img:object){
    const t=this.textures.get(img);
    if(t){
      this.gl.deleteTexture(t.tex);
      this.textures.delete(img);
    }
  }
}
