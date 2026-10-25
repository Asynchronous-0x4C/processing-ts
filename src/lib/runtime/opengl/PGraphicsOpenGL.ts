import { PGraphics, enumPath, type Path, CAP, hsbToRgb } from "../PGraphics";
import { PImage, createNativeCanvas, rgbaToArgb, type Native2D, type NativeCanvas } from "../PImage";
import { PMatrix3D } from "../PMatrix3D";
import { PMatrix2D } from "../PMatrix2D";
import type { PApplet } from "../PApplet";
import { cssFont, drawVlwLine, fontMetrics, textLineWidth, measureContext } from "../text";
import { filterPixels } from "../util/imageOps";
import { exceptions } from "../../../runtime/lang/index.ts";
import { GLContext, type GLProgram } from "./GLContext";
import { PShader, ShaderKind } from "./PShader";
import * as S from "./shaders";
import { tessellate, ellipseSegments, ellipsePoints, strokePolygons, unionPolygons, cosLUT, sinLUT, SINCOS_LENGTH } from "./tess";

const f=Math.fround;

// PConstants
const POINTS=3,LINES=5,TRIANGLES=9,TRIANGLE_STRIP=10,TRIANGLE_FAN=11,QUADS=17,QUAD_STRIP=18,POLYGON=20;
const CLOSE=2,HSB=3,IMAGE=2,NORMAL=1,REPEAT=1;
const REPLACE=0,BLEND=1,ADD=2,SUBTRACT=4,LIGHTEST=8,DARKEST=16,DIFFERENCE=32,EXCLUSION=64,MULTIPLY=128,SCREEN=256;
const DISABLE_DEPTH_TEST=2,ENABLE_DEPTH_TEST=-2,DISABLE_DEPTH_MASK=5,ENABLE_DEPTH_MASK=-5,ENABLE_STROKE_PERSPECTIVE=7,DISABLE_STROKE_PERSPECTIVE=-7;
const ENABLE_DEPTH_SORT=3,DISABLE_DEPTH_SORT=-3;
const POINTS_KIND=3,LINES_KIND=5;

const IDENTITY=new PMatrix3D();

/** ARGB → the 32-bit word whose bytes in memory are R, G, B, A. */
function rgba(c:number):number{
  return ((c&0xff00ff00)|((c>>16)&0xff)|((c&0xff)<<16))>>>0;
}

/** A growable interleaved vertex array (32-bit words) with an index list. */
class Batch{
  f:Float32Array;
  u:Uint32Array;
  words=0;
  idx:Uint32Array;
  nidx=0;
  constructor(readonly stride:number){
    this.f=new Float32Array(stride*4096);
    this.u=new Uint32Array(this.f.buffer);
    this.idx=new Uint32Array(8192);
  }
  get vertices(){return this.words/this.stride;}
  reserve(vertices:number,indices:number){
    if(this.words+vertices*this.stride>this.f.length){
      let n=this.f.length*2;
      while(n<this.words+vertices*this.stride)n*=2;
      const nf=new Float32Array(n);
      nf.set(this.f.subarray(0,this.words));
      this.f=nf;
      this.u=new Uint32Array(nf.buffer);
    }
    if(this.nidx+indices>this.idx.length){
      let n=this.idx.length*2;
      while(n<this.nidx+indices)n*=2;
      const ni=new Uint32Array(n);
      ni.set(this.idx.subarray(0,this.nidx));
      this.idx=ni;
    }
  }
  clear(){
    this.words=0;
    this.nidx=0;
  }
  empty(){return this.nidx===0;}
}

const PV=13; // polygon vertex: x y z | rgba | nx ny nz | u v | ambient | specular | emissive | shininess
const LV=8; // line vertex: x y z | rgba | other end x y z | half width (signed)
const QV=6; // point vertex: x y z | rgba | offset x y

/** A vertex of beginShape()/endShape(). */
type ShapeVertex={
  x:number,y:number,z:number,u:number,v:number,
  fill:number,stroke:number,weight:number,
  nx:number,ny:number,nz:number,
  amb:number,spec:number,emis:number,shine:number,
  /** 0 vertex, 1 bezier, 2 quadratic, 3 curve; contours start with `brk` */
  code:number,c?:number[],brk?:boolean,
};

type Light={type:number,pos:number[],normal:number[],ambient:number[],diffuse:number[],specular:number[],falloff:number[],spot:number[]};
const AMBIENT_LIGHT=0,DIRECTIONAL=1,POINT_LIGHT=2,SPOT=3;

/**
 * Processing's OpenGL renderers (P2D and P3D) on WebGL2. Immediate mode as in Processing: shapes are
 * tessellated on the CPU into eye-space triangles (the modelview applied, so the shaders' modelview is
 * the identity and transformMatrix the projection, as Processing passes them), batched, and drawn when
 * the state changes or the frame ends. Lines are quads widened in the line shader (P3D) or stroked
 * polygons in the polygon batch (P2D, which keeps the drawing order without a depth test). The surface
 * is a multisampled framebuffer (smooth level 2 by default), resolved to a texture that loadPixels(),
 * filter(), textures of this surface and the window read.
 */
export class PGraphicsOpenGL extends PGraphics{
  readonly is3DRenderer:boolean;
  glc:GLContext|null=null;
  /** The sketch window's canvas (primary surface only). */
  canvas:HTMLCanvasElement|null;
  private fbo:WebGLFramebuffer|null=null;
  private msColor:WebGLRenderbuffer|null=null;
  private msDepth:WebGLRenderbuffer|null=null;
  private resolveFbo:WebGLFramebuffer|null=null;
  /** The surface's contents (after resolve()), rows bottom first. */
  colorTex:WebGLTexture|null=null;
  private ppixelsTex:WebGLTexture|null=null;
  private dirty=false;
  private samples=2;
  smoothLevel=2;

  // matrices (float, as Processing)
  modelview=new PMatrix3D();
  private modelviewInvCache:PMatrix3D|null=null;
  /** The camera matrix (Processing's `camera` field; a method has that name here). */
  cameraMat=new PMatrix3D();
  cameraInv=new PMatrix3D();
  projection=new PMatrix3D();
  private mvStack:PMatrix3D[]=[];
  private projStack:PMatrix3D[]=[];
  cameraFOV=0;cameraX=0;cameraY=0;cameraZ=0;cameraNear=0;cameraFar=0;cameraAspect=0;
  private manipulatingCamera=false;

  // batches
  private polys=new Batch(PV);
  private lines=new Batch(LV);
  private points=new Batch(QV);
  private batchTexture:PImage|null=null;
  private batchTextureRepeat=false;

  // shape state
  private shapeKind_=-1;
  private shapeVerts:ShapeVertex[]=[];
  private nextBreak=false;
  private shapeTexture:PImage|null=null;
  private normalX=0;normalY=0;normalZ=1;
  private shapeHasNormal=false;
  private bezierDetail_=20;
  private curveDetail_=20;
  private sphereU=30;
  private sphereV=30;

  // lights
  private lightsList:Light[]=[];
  private currentLightSpecular=[0,0,0];
  private currentLightFalloff=[1,0,0];

  // shaders and hints
  private polyShader:PShader|null=null;
  private lineShader:PShader|null=null;
  private pointShader:PShader|null=null;
  private depthTest=true;
  private depthMask=true;
  private strokePerspective=false;
  private enabledAttribs=new Set<number>();
  private textCache=new Map<string,{img:PImage,x:number,y:number,w:number,h:number}>();
  private mirror:{canvas:NativeCanvas,ctx:Native2D,frame:number}|null=null;
  private drawCount=0;

  constructor(parent:PApplet,canvas:HTMLCanvasElement|null,primary:boolean,is3D:boolean){
    super(parent);
    this.canvas=canvas;
    this.primary=primary;
    this.is3DRenderer=is3D;
    this.format=primary?1:2;
    this.depthTest=is3D;
  }

  is2D(){return !this.is3DRenderer;}
  is3D(){return this.is3DRenderer;}

  // --- surface -------------------------------------------------------------------------------------

  setSize(width:number,height:number,density=1){
    this.width=width;
    this.height=height;
    this.pixelDensity=density;
    this.pixelWidth=Math.round(width*density);
    this.pixelHeight=Math.round(height*density);
    if(!this.glc){
      if(this.primary&&this.canvas){
        this.canvas.width=this.pixelWidth;
        this.canvas.height=this.pixelHeight;
        this.glc=new GLContext(this.canvas);
        this.parent.__gl__=this.glc;
      }else{
        this.glc=this.parent.__glContext__();
      }
    }
    this.allocate();
    this.pixels=new Int32Array(this.pixelWidth*this.pixelHeight);
    this.defaultCamera();
    this.modelview.set(this.cameraMat);
    this.modelviewInvCache=null;
  }

  /** Framebuffers: multisampled color + depth/stencil, resolved into a texture. */
  private allocate(){
    const glc=this.glc!,gl=glc.gl;
    const w=this.pixelWidth,h=this.pixelHeight;
    this.samples=Math.min(this.smoothLevel<=1?0:this.smoothLevel,glc.maxSamples);
    this.fbo??=gl.createFramebuffer();
    this.msColor??=gl.createRenderbuffer();
    this.msDepth??=gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER,this.msColor);
    gl.renderbufferStorageMultisample(gl.RENDERBUFFER,this.samples,gl.RGBA8,w,h);
    gl.bindRenderbuffer(gl.RENDERBUFFER,this.msDepth);
    gl.renderbufferStorageMultisample(gl.RENDERBUFFER,this.samples,gl.DEPTH24_STENCIL8,w,h);
    gl.bindFramebuffer(gl.FRAMEBUFFER,this.fbo);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.RENDERBUFFER,this.msColor);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.DEPTH_STENCIL_ATTACHMENT,gl.RENDERBUFFER,this.msDepth);
    if(this.colorTex)gl.deleteTexture(this.colorTex);
    this.colorTex=glc.createTexture(w,h,true,false);
    this.resolveFbo??=gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER,this.resolveFbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,this.colorTex,0);
    // start transparent (offscreen) with a clear depth buffer
    gl.bindFramebuffer(gl.FRAMEBUFFER,this.fbo);
    gl.viewport(0,0,w,h);
    gl.disable(gl.SCISSOR_TEST);
    gl.clearColor(0,0,0,0);
    gl.clearDepth(1);
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT|gl.STENCIL_BUFFER_BIT);
    glc.boundTarget=this;
    this.dirty=true;
  }

  smooth(level?:number){
    const l=level??2;
    if(l===this.smoothLevel)return;
    this.smoothLevel=l;
    if(this.glc)this.allocate();
  }

  noSmooth(){
    this.smooth(1);
  }

  /** Bind this surface's framebuffer for drawing. */
  private bind(){
    const glc=this.glc!,gl=glc.gl;
    if(glc.boundTarget!==this){
      gl.bindFramebuffer(gl.FRAMEBUFFER,this.fbo);
      gl.viewport(0,0,this.pixelWidth,this.pixelHeight);
      glc.boundTarget=this;
    }
  }

  /** Copy the multisampled image into colorTex. */
  resolve(){
    this.flush();
    if(!this.dirty||!this.glc)return;
    const gl=this.glc.gl;
    gl.bindFramebuffer(gl.READ_FRAMEBUFFER,this.fbo);
    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER,this.resolveFbo);
    gl.blitFramebuffer(0,0,this.pixelWidth,this.pixelHeight,0,0,this.pixelWidth,this.pixelHeight,gl.COLOR_BUFFER_BIT,gl.NEAREST);
    gl.bindFramebuffer(gl.FRAMEBUFFER,null);
    this.glc.boundTarget=null;
    this.dirty=false;
  }

  beginDraw(){
    // what other surfaces queued is drawn first (it may use this surface as a texture)
    const main=this.parent.g;
    if(main!==this&&main instanceof PGraphicsOpenGL)main.flush();
    this.modelview.set(this.cameraMat);
    this.modelviewInvCache=null;
    this.lightsList=[];
    this.normalX=0;this.normalY=0;this.normalZ=1;
  }

  endDraw(){
    this.resolve();
  }

  __live__(){
    return true;
  }

  /** Before each draw(): the modelview is the camera again and the lights are off (as in Processing). */
  __begin__(){
    this.beginDraw();
  }

  /** After each draw(): draw the batch and show the frame on the canvas. */
  __end__(){
    this.resolve();
    if(this.primary&&this.glc&&this.canvas){
      const gl=this.glc.gl;
      if(this.ppixelsTex)this.copyToPpixels();
      gl.bindFramebuffer(gl.FRAMEBUFFER,null);
      this.glc.boundTarget=null;
      gl.viewport(0,0,this.pixelWidth,this.pixelHeight);
      this.blit(this.colorTex!,false,true);
    }
    return 0;
  }

  /** Draw a texture over the whole bound framebuffer (no blending). */
  private blit(tex:WebGLTexture,flipY:boolean,opaque:boolean){
    const glc=this.glc!,gl=glc.gl;
    const prog=glc.program(S.BLIT_VERT,S.BLIT_FRAG);
    gl.useProgram(prog.program);
    gl.disable(gl.BLEND);
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.SCISSOR_TEST);
    gl.depthMask(false);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D,tex);
    const u=(n:string)=>prog.uniforms.get(n)?.loc??null;
    gl.uniform1i(u("texMap"),0);
    gl.uniform1i(u("flipY"),flipY?1:0);
    gl.uniform1i(u("opaque"),opaque?1:0);
    gl.bindVertexArray(glc.vao);
    this.resetAttribs();
    gl.bindBuffer(gl.ARRAY_BUFFER,glc.vbo);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STREAM_DRAW);
    const loc=prog.attribs.get("position");
    if(loc!==undefined){
      gl.enableVertexAttribArray(loc);
      this.enabledAttribs.add(loc);
      gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
    }
    gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
    gl.depthMask(true);
  }

  private copyToPpixels(){
    const gl=this.glc!.gl;
    gl.bindTexture(gl.TEXTURE_2D,this.ppixelsTex);
    gl.bindFramebuffer(gl.READ_FRAMEBUFFER,this.resolveFbo);
    gl.copyTexSubImage2D(gl.TEXTURE_2D,0,0,0,0,0,this.pixelWidth,this.pixelHeight);
    gl.bindFramebuffer(gl.FRAMEBUFFER,null);
    this.glc!.boundTarget=null;
  }

  __stop__(){}

  // --- camera and projection -------------------------------------------------------------------------

  private defaultCamera(){
    const w=this.width,h=this.height;
    this.cameraFOV=f(60*Math.PI/180);
    this.cameraX=f(w/2);
    this.cameraY=f(h/2);
    this.cameraZ=f(this.cameraY/f(Math.tan(f(this.cameraFOV/2))));
    this.cameraNear=f(this.cameraZ/10);
    this.cameraFar=f(this.cameraZ*10);
    this.cameraAspect=f(w/h);
    if(this.is3DRenderer){
      this.camera3D(this.cameraX,this.cameraY,this.cameraZ,this.cameraX,this.cameraY,0,0,1,0);
      this.perspective();
    }else{
      // P2D: no camera, an orthographic projection with the origin at the top left
      this.cameraMat.reset();
      this.cameraInv.reset();
      this.projection.set(f(2/w),0,0,-1,0,f(-2/h),0,1,0,0,-1,-0,0,0,0,1);
    }
  }

  camera(...a:number[]){
    if(!this.is3DRenderer)return this.unavailable("camera",true);
    if(a.length===0)return this.camera3D(this.cameraX,this.cameraY,this.cameraZ,this.cameraX,this.cameraY,0,0,1,0);
    this.camera3D(a[0],a[1],a[2],a[3],a[4],a[5],a[6],a[7],a[8]);
  }

  private camera3D(ex:number,ey:number,ez:number,cx:number,cy:number,cz:number,ux:number,uy:number,uz:number){
    this.flush();
    let z0=f(ex-cx),z1=f(ey-cy),z2=f(ez-cz);
    const zm=f(Math.sqrt(f(f(f(z0*z0)+f(z1*z1))+f(z2*z2))));
    if(zm!==0){z0=f(z0/zm);z1=f(z1/zm);z2=f(z2/zm);}
    let x0=f(f(uy*z2)-f(uz*z1)),x1=f(f(-ux*z2)+f(uz*z0)),x2=f(f(ux*z1)-f(uy*z0));
    let y0=f(f(z1*x2)-f(z2*x1)),y1=f(f(-z0*x2)+f(z2*x0)),y2=f(f(z0*x1)-f(z1*x0));
    const xm=f(Math.sqrt(f(f(f(x0*x0)+f(x1*x1))+f(x2*x2))));
    if(xm!==0){x0=f(x0/xm);x1=f(x1/xm);x2=f(x2/xm);}
    const ym=f(Math.sqrt(f(f(f(y0*y0)+f(y1*y1))+f(y2*y2))));
    if(ym!==0){y0=f(y0/ym);y1=f(y1/ym);y2=f(y2/ym);}
    this.modelview.set(x0,x1,x2,0,y0,y1,y2,0,z0,z1,z2,0,0,0,0,1);
    this.modelview.translate(-ex,-ey,-ez);
    this.modelviewInvCache=null;
    this.cameraMat.set(this.modelview);
    this.cameraInv.set(this.cameraMat);
    this.cameraInv.invert();
  }

  beginCamera(){
    if(!this.is3DRenderer)return this.unavailable("beginCamera");
    if(this.manipulatingCamera)throw new exceptions.RuntimeException("beginCamera() cannot be called again before endCamera()");
    this.manipulatingCamera=true;
  }

  endCamera(){
    if(!this.is3DRenderer)return this.unavailable("endCamera");
    if(!this.manipulatingCamera)throw new exceptions.RuntimeException("Cannot call endCamera() without first calling beginCamera()");
    this.flush();
    this.cameraMat.set(this.modelview);
    this.cameraInv.set(this.cameraMat);
    this.cameraInv.invert();
    this.manipulatingCamera=false;
  }

  perspective(fov?:number,aspect?:number,near?:number,far?:number){
    if(!this.is3DRenderer)return this.unavailable("perspective",true);
    fov??=this.cameraFOV;aspect??=this.cameraAspect;near??=this.cameraNear;far??=this.cameraFar;
    const ymax=f(near*f(Math.tan(f(fov/2))));
    const ymin=-ymax;
    this.frustum(f(ymin*aspect),f(ymax*aspect),ymin,ymax,near,far);
  }

  frustum(l:number,r:number,b:number,t:number,n:number,fr:number){
    if(!this.is3DRenderer)return this.unavailable("frustum");
    this.flush();
    const n2=f(2*n),w=f(r-l),h=f(t-b),d=f(fr-n);
    this.projection.set(
      f(n2/w),0,f(f(r+l)/w),0,
      0,f(-n2/h),f(f(t+b)/h),0,
      0,0,f(-f(fr+n)/d),f(-f(f(n2*fr))/d),
      0,0,-1,0);
  }

  ortho(l?:number,r?:number,b?:number,t?:number,n?:number,fr?:number){
    if(!this.is3DRenderer)return this.unavailable("ortho",true);
    if(l===undefined){
      l=f(-this.width/2);r=f(this.width/2);b=f(-this.height/2);t=f(this.height/2);
    }
    n??=0;fr??=this.cameraFar;
    this.flush();
    const w=f(r!-l),h=f(t!-b!),d=f(fr-n);
    this.projection.set(
      f(2/w),0,0,f(-f(r!+l)/w),
      0,f(-2/h),0,f(-f(t!+b!)/h),
      0,0,f(-2/d),f(-f(fr+n)/d),
      0,0,0,1);
  }

  printCamera(){
    this.cameraMat.print();
  }

  printProjection(){
    this.projection.print();
  }

  // --- matrices ---------------------------------------------------------------------------------------

  private get modelviewInv():PMatrix3D{
    if(!this.modelviewInvCache){
      const m=new PMatrix3D(this.modelview);
      m.invert();
      this.modelviewInvCache=m;
    }
    return this.modelviewInvCache;
  }

  private changed(){
    this.modelviewInvCache=null;
  }

  pushMatrix(){
    if(this.mvStack.length>=32)throw new exceptions.RuntimeException("Too many calls to pushMatrix().");
    this.mvStack.push(new PMatrix3D(this.modelview));
  }

  popMatrix(){
    const m=this.mvStack.pop();
    if(!m)throw new exceptions.RuntimeException("Too many calls to popMatrix(), and not enough to pushMatrix().");
    this.modelview.set(m);
    this.changed();
  }

  pushProjection(){
    this.projStack.push(new PMatrix3D(this.projection));
  }

  popProjection(){
    this.flush();
    const m=this.projStack.pop();
    if(m)this.projection.set(m);
  }

  translate(x:number,y:number,z?:number){
    if(z!==undefined&&!this.is3DRenderer)return this.unavailable("translate",true);
    this.modelview.translate(x,y,z??0);
    this.changed();
  }

  rotate(angle:number,x?:number,y?:number,z?:number){
    if(x!==undefined){
      if(!this.is3DRenderer)return this.unavailable("rotate",true);
      this.modelview.rotate(angle,x,y,z);
    }else this.modelview.rotateZ(angle);
    this.changed();
  }

  rotateX(a:number){
    if(!this.is3DRenderer)return this.need3D("rotateX");
    this.modelview.rotateX(a);
    this.changed();
  }

  rotateY(a:number){
    if(!this.is3DRenderer)return this.need3D("rotateY");
    this.modelview.rotateY(a);
    this.changed();
  }

  rotateZ(a:number){
    if(!this.is3DRenderer)return this.need3D("rotateZ");
    this.modelview.rotateZ(a);
    this.changed();
  }

  scale(x:number,y?:number,z?:number){
    if(z!==undefined&&!this.is3DRenderer)return this.unavailable("scale",true);
    if(y===undefined)this.modelview.scale(x,x,x);
    else this.modelview.scale(x,y,z??1);
    this.changed();
  }

  shearX(angle:number){
    this.modelview.shearX(angle);
    this.changed();
  }

  shearY(angle:number){
    this.modelview.shearY(angle);
    this.changed();
  }

  applyMatrix(...a:any[]){
    this.modelview.apply(...a);
    this.changed();
  }

  resetMatrix(){
    this.modelview.reset();
    this.changed();
  }

  printMatrix(){
    this.modelview.print();
  }

  getMatrix(target?:any):any{
    if(target instanceof PMatrix3D){
      target.set(this.modelview);
      return target;
    }
    if(target instanceof PMatrix2D){
      const m=this.modelview;
      target.set(m.m00,m.m01,m.m03,m.m10,m.m11,m.m13);
      return target;
    }
    return new PMatrix3D(this.modelview);
  }

  setMatrix(m:any){
    this.modelview.reset();
    this.modelview.apply(m);
    this.changed();
  }

  /** The point (x, y, z) through the modelview: eye coordinates [x, y, z, w]. */
  private eye(x:number,y:number,z:number):[number,number,number,number]{
    const m=this.modelview;
    return [m.multX(x,y,z),m.multY(x,y,z),m.multZ(x,y,z),m.multW(x,y,z)];
  }

  private project(x:number,y:number,z:number):[number,number,number]{
    const [ax,ay,az,aw]=this.eye(x,y,z);
    const p=this.projection;
    let ox=p.multX(ax,ay,az,aw),oy=p.multY(ax,ay,az,aw),oz=p.multZ(ax,ay,az,aw);
    const ow=p.multW(ax,ay,az,aw);
    if(ow!==0){ox=f(ox/ow);oy=f(oy/ow);oz=f(oz/ow);}
    return [ox,oy,oz];
  }

  screenX(x:number,y:number,z?:number){
    if(z!==undefined&&!this.is3DRenderer){
      this.warnOnce("screenX() with x, y, and z coordinates can only be used with a renderer that supports 3D, such as P3D. Use a version without a z-coordinate instead.");
      return 0;
    }
    const [ox]=this.project(x,y,z??0);
    return f(f(this.width*f(1+ox))/2);
  }

  screenY(x:number,y:number,z?:number){
    if(z!==undefined&&!this.is3DRenderer){
      this.warnOnce("screenY() with x, y, and z coordinates can only be used with a renderer that supports 3D, such as P3D. Use a version without a z-coordinate instead.");
      return 0;
    }
    const [,oy]=this.project(x,y,z??0);
    return f(this.height-f(f(this.height*f(1+oy))/2));
  }

  screenZ(x:number,y:number,z:number){
    if(!this.is3DRenderer)return super.screenZ(x,y,z);
    const [,,oz]=this.project(x,y,z);
    return f(f(oz+1)/2);
  }

  private model(x:number,y:number,z:number,k:number):number{
    if(!this.is3DRenderer){
      this.unavailable(["modelX","modelY","modelZ"][k],true);
      return 0;
    }
    const [ax,ay,az,aw]=this.eye(x,y,z);
    const c=this.cameraInv;
    const o=k===0?c.multX(ax,ay,az,aw):k===1?c.multY(ax,ay,az,aw):c.multZ(ax,ay,az,aw);
    const ow=c.multW(ax,ay,az,aw);
    return ow!==0?f(o/ow):o;
  }

  modelX(x:number,y:number,z:number){return this.model(x,y,z,0);}
  modelY(x:number,y:number,z:number){return this.model(x,y,z,1);}
  modelZ(x:number,y:number,z:number){return this.model(x,y,z,2);}

  protected applyMatrixToRenderer(){}

  // --- style ------------------------------------------------------------------------------------------

  /** The geometry queued so far is drawn with the mode it was drawn with. */
  blendMode(mode:number){
    this.flush();
    super.blendMode(mode);
  }

  protected applyBlendMode(mode:number){
    if(mode===DIFFERENCE||mode>SCREEN){
      this.warnOnce(`blendMode(${({32:"DIFFERENCE",512:"OVERLAY",1024:"HARD_LIGHT",2048:"SOFT_LIGHT",4096:"DODGE",8192:"BURN"} as Record<number,string>)[mode]??mode}) is not supported by this renderer.`);
    }
  }

  popStyle(){
    const next=this.styleStack[this.styleStack.length-1];
    if(next&&next.blendMode!==this.style.blendMode)this.flush();
    super.popStyle();
  }

  hint(which:number){
    this.flush();
    switch(which){
      case DISABLE_DEPTH_TEST:this.depthTest=false;break;
      case ENABLE_DEPTH_TEST:this.depthTest=true;break;
      case DISABLE_DEPTH_MASK:this.depthMask=false;break;
      case ENABLE_DEPTH_MASK:this.depthMask=true;break;
      case ENABLE_STROKE_PERSPECTIVE:this.strokePerspective=true;break;
      case DISABLE_STROKE_PERSPECTIVE:this.strokePerspective=false;break;
    }
  }

  bezierDetail(d:number){
    this.bezierDetail_=Math.max(1,d|0);
  }

  curveDetail(d:number){
    this.curveDetail_=Math.max(1,d|0);
  }

  sphereDetail(u:number,v?:number){
    this.sphereU=Math.max(3,u|0);
    this.sphereV=Math.max(2,(v??u)|0);
  }

  normal(x:number,y:number,z:number){
    this.normalX=x;this.normalY=y;this.normalZ=z;
    if(this.shapeKind_!==-1)this.shapeHasNormal=true;
  }

  texture(img:PImage){
    this.shapeTexture=img;
  }

  // --- lights -----------------------------------------------------------------------------------------

  /** Color arguments as floats 0..1 (r, g, b) in the current colorMode, without rounding to 8 bits. */
  private colorFloats(a:number[]):number[]{
    const s=this.style;
    const c=(v:number)=>(v<0?0:v>1?1:v);
    if(a.length===1){
      const x=a[0];
      if(Number.isInteger(x)&&((x&0xff000000)!==0||x>s.colorModeX))return [((x>>16)&0xff)/255,((x>>8)&0xff)/255,(x&0xff)/255];
      const g=c(x/s.colorModeX);
      return [g,g,g];
    }
    const x=c(a[0]/s.colorModeX),y=c(a[1]/s.colorModeY),z=c(a[2]/s.colorModeZ);
    return s.colorMode===HSB?hsbToRgb(x,y,z):[x,y,z];
  }

  private addLight(l:Light){
    if(this.lightsList.length>=8)throw new exceptions.RuntimeException("can only create 8 lights");
    this.flush();
    this.lightsList.push(l);
  }

  private lightPos(x:number,y:number,z:number,w:number):number[]{
    const m=this.modelview;
    return w===0?[0,0,0,0]:[m.multX(x,y,z),m.multY(x,y,z),m.multZ(x,y,z),1];
  }

  /** A direction through the modelview's rotation part, normalized. */
  private lightDir(x:number,y:number,z:number):number[]{
    const m=this.modelview;
    const dx=f(f(f(m.m00*x)+f(m.m01*y))+f(m.m02*z));
    const dy=f(f(f(m.m10*x)+f(m.m11*y))+f(m.m12*z));
    const dz=f(f(f(m.m20*x)+f(m.m21*y))+f(m.m22*z));
    const len=Math.hypot(dx,dy,dz);
    return len>0?[dx/len,dy/len,dz/len]:[0,0,0];
  }

  lights(){
    if(!this.is3DRenderer)return this.unavailable("lights");
    this.flush();
    this.lightsList=[];
    const s=this.style;
    const mode=s.colorMode;
    s.colorMode=1;
    const half=[0.5*s.colorModeX,0.5*s.colorModeY,0.5*s.colorModeZ];
    s.colorMode=mode;
    this.currentLightFalloff=[1,0,0];
    this.currentLightSpecular=[0,0,0];
    this.addLight({type:AMBIENT_LIGHT,pos:this.lightPos(0,0,0,1),normal:[0,0,0],ambient:this.rgbOf(half),diffuse:[0,0,0],specular:[0,0,0],falloff:[1,0,0],spot:[-1,0]});
    this.addLight({type:DIRECTIONAL,pos:[0,0,0,0],normal:this.lightDir(0,0,-1),ambient:[0,0,0],diffuse:this.rgbOf(half),specular:[0,0,0],falloff:[1,0,0],spot:[-1,0]});
  }

  /** RGB 0..1 of a color given in RGB mode units. */
  private rgbOf(v:number[]):number[]{
    const s=this.style;
    return [v[0]/s.colorModeX,v[1]/s.colorModeY,v[2]/s.colorModeZ];
  }

  noLights(){
    if(!this.is3DRenderer)return this.unavailable("noLights");
    this.flush();
    this.lightsList=[];
  }

  ambientLight(r:number,g:number,b:number,x=0,y=0,z=0){
    if(!this.is3DRenderer)return this.unavailable("ambientLight");
    this.addLight({type:AMBIENT_LIGHT,pos:this.lightPos(x,y,z,1),normal:[0,0,0],ambient:this.colorFloats([r,g,b]),diffuse:[0,0,0],specular:[0,0,0],falloff:[...this.currentLightFalloff],spot:[-1,0]});
  }

  directionalLight(r:number,g:number,b:number,nx:number,ny:number,nz:number){
    if(!this.is3DRenderer)return this.unavailable("directionalLight");
    this.addLight({type:DIRECTIONAL,pos:[0,0,0,0],normal:this.lightDir(nx,ny,nz),ambient:[0,0,0],diffuse:this.colorFloats([r,g,b]),specular:[...this.currentLightSpecular],falloff:[1,0,0],spot:[-1,0]});
  }

  pointLight(r:number,g:number,b:number,x:number,y:number,z:number){
    if(!this.is3DRenderer)return this.unavailable("pointLight");
    this.addLight({type:POINT_LIGHT,pos:this.lightPos(x,y,z,1),normal:[0,0,0],ambient:[0,0,0],diffuse:this.colorFloats([r,g,b]),specular:[...this.currentLightSpecular],falloff:[...this.currentLightFalloff],spot:[-1,0]});
  }

  spotLight(r:number,g:number,b:number,x:number,y:number,z:number,nx:number,ny:number,nz:number,angle:number,concentration:number){
    if(!this.is3DRenderer)return this.unavailable("spotLight");
    this.addLight({type:SPOT,pos:this.lightPos(x,y,z,1),normal:this.lightDir(nx,ny,nz),ambient:[0,0,0],diffuse:this.colorFloats([r,g,b]),specular:[...this.currentLightSpecular],falloff:[...this.currentLightFalloff],spot:[Math.max(0,Math.cos(angle)),concentration]});
  }

  lightFalloff(c:number,l:number,q:number){
    if(!this.is3DRenderer)return this.unavailable("lightFalloff");
    this.currentLightFalloff=[c,l,q];
  }

  lightSpecular(r:number,g:number,b:number){
    if(!this.is3DRenderer)return this.unavailable("lightSpecular");
    this.currentLightSpecular=this.colorFloats([r,g,b]);
  }

  // --- shaders ----------------------------------------------------------------------------------------

  shader(sh:PShader|null,kind?:number){
    this.flush();
    if(!sh){
      this.resetShader(kind);
      return;
    }
    if(kind===POINTS_KIND||(kind===undefined&&sh.type===ShaderKind.POINT))this.pointShader=sh;
    else if(kind===LINES_KIND||(kind===undefined&&sh.type===ShaderKind.LINE))this.lineShader=sh;
    else this.polyShader=sh;
  }

  resetShader(kind?:number){
    this.flush();
    if(kind===POINTS_KIND)this.pointShader=null;
    else if(kind===LINES_KIND)this.lineShader=null;
    else if(kind===undefined||kind===TRIANGLES)this.polyShader=null;
  }

  /** filter(PShader) or filter(kind[, param]) */
  filter(kind:number|PShader,param?:number){
    if(kind instanceof PShader){
      this.filterShader(kind);
      return;
    }
    this.loadPixels();
    const format=filterPixels(this.pixels,this.pixelWidth,this.pixelHeight,this.format,kind,param);
    if(!this.primary)this.format=format;
    this.updatePixels();
  }

  /** The frame drawn again through a texture shader (its `texture` is the current frame), replacing it. */
  private filterShader(sh:PShader){
    this.resolve();
    const glc=this.glc!,gl=glc.gl;
    // a copy of the frame: the shader samples it while drawing into the surface
    const w=this.pixelWidth,h=this.pixelHeight;
    const src=glc.createTexture(w,h,true,false);
    gl.bindFramebuffer(gl.READ_FRAMEBUFFER,this.resolveFbo);
    gl.copyTexSubImage2D(gl.TEXTURE_2D,0,0,0,0,0,w,h);
    glc.boundTarget=null;
    const frame=new FrameTexture(this,src,w,h);
    const saved={mv:new PMatrix3D(this.modelview),proj:new PMatrix3D(this.projection),style:this.style.copy(),poly:this.polyShader,lights:this.lightsList,depth:this.depthTest};
    // an orthographic projection of the whole surface, no lights, no depth test
    this.modelview.reset();
    this.changed();
    this.projection.set(f(2/this.width),0,0,-1,0,f(-2/this.height),0,1,0,0,-1,-0,0,0,0,1);
    this.lightsList=[];
    this.depthTest=false;
    this.polyShader=sh;
    this.style.blendMode=REPLACE;
    this.style.tint=false;
    this.style.imageMode=0;
    this.normalX=0;this.normalY=0;this.normalZ=1;
    this.drawImage(frame,0,0,this.width,this.height,0,0,this.width,this.height);
    this.flush();
    gl.deleteTexture(src);
    this.modelview.set(saved.mv);
    this.changed();
    this.projection.set(saved.proj);
    this.style=saved.style;
    this.polyShader=saved.poly;
    this.lightsList=saved.lights;
    this.depthTest=saved.depth;
  }

  // --- shapes -----------------------------------------------------------------------------------------

  beginShape(kind=POLYGON){
    this.shapeKind_=kind;
    this.shapeVerts=[];
    this.nextBreak=false;
    this.shapeTexture=null;
    this.shapeHasNormal=false;
  }

  private newVertex(x:number,y:number,z:number,u:number,v:number,code=0):ShapeVertex{
    const s=this.style;
    const fill=this.shapeTexture?(s.tint?s.tintColor:-1):s.fillColor;
    const vtx:ShapeVertex={x,y,z,u,v,fill,stroke:s.strokeColor,weight:s.strokeWeight,nx:this.normalX,ny:this.normalY,nz:this.normalZ,
      amb:s.setAmbient?s.ambientColor:s.fillColor,spec:s.specularColor,emis:s.emissiveColor,shine:s.shininess,code};
    if(this.nextBreak){
      vtx.brk=true;
      this.nextBreak=false;
    }
    this.shapeVerts.push(vtx);
    return vtx;
  }

  /** vertex(x, y), vertex(x, y, z), vertex(x, y, u, v), vertex(x, y, z, u, v) or vertex(float[]) */
  vertex(x:number|ArrayLike<number>,y?:number,a?:number,b?:number,c?:number){
    if(typeof x!=="number"){
      const v=x;
      this.newVertex(v[0],v[1],v.length>2?v[2]:0,0,0);
      return;
    }
    if(c!==undefined){
      if(!this.is3DRenderer)return this.vertexZWarning();
      this.newVertex(x,y!,a!,b!,c);
    }else if(b!==undefined){
      this.newVertex(x,y!,0,a!,b);
    }else if(a!==undefined){
      if(!this.is3DRenderer)return this.vertexZWarning();
      this.newVertex(x,y!,a,0,0);
    }else this.newVertex(x,y!,0,0,0);
  }

  private vertexZWarning(){
    this.warnOnce("vertex() with x, y, and z coordinates can only be used with a renderer that supports 3D, such as P3D. Use a version without a z-coordinate instead.");
  }

  bezierVertex(...a:number[]){
    const v=a.length===6?this.newVertex(a[4],a[5],0,0,0,1):this.newVertex(a[6],a[7],a[8],0,0,1);
    v.c=a.length===6?[a[0],a[1],0,a[2],a[3],0]:a.slice(0,6);
  }

  quadraticVertex(...a:number[]){
    const v=a.length===4?this.newVertex(a[2],a[3],0,0,0,2):this.newVertex(a[3],a[4],a[5],0,0,2);
    v.c=a.length===4?[a[0],a[1],0]:a.slice(0,3);
  }

  curveVertex(x:number,y:number,z=0){
    this.newVertex(x,y,z,0,0,3);
  }

  beginContour(){
    this.nextBreak=true;
  }

  endContour(){}

  /** The shape's vertices with the curves flattened (bezierDetail/curveDetail), in contours. */
  private flatten(verts:ShapeVertex[]):ShapeVertex[][]{
    const out:ShapeVertex[][]=[];
    let cur:ShapeVertex[]=[];
    let curve:ShapeVertex[]=[];
    const lerpV=(base:ShapeVertex,x:number,y:number,z:number):ShapeVertex=>({...base,x,y,z,code:0,brk:false,c:undefined});
    for(const v of verts){
      if(v.brk&&cur.length){
        out.push(cur);
        cur=[];
        curve=[];
      }
      if(v.code===3){
        curve.push(v);
        const n=curve.length;
        if(n>=4){
          const [p0,p1,p2,p3]=curve.slice(n-4);
          if(n===4)cur.push(lerpV(p1,p1.x,p1.y,p1.z));
          const k=(1-this.curveTightness_)/6;
          const c1=[p1.x+(p2.x-p0.x)*k,p1.y+(p2.y-p0.y)*k,p1.z+(p2.z-p0.z)*k];
          const c2=[p2.x-(p3.x-p1.x)*k,p2.y-(p3.y-p1.y)*k,p2.z-(p3.z-p1.z)*k];
          this.cubicPoints(cur,p2,[p1.x,p1.y,p1.z],c1,c2,[p2.x,p2.y,p2.z],this.curveDetail_);
        }
        continue;
      }
      curve=[];
      if(v.code===0||!cur.length){
        cur.push(v);
        continue;
      }
      const p=cur[cur.length-1];
      if(v.code===1){
        this.cubicPoints(cur,v,[p.x,p.y,p.z],v.c!.slice(0,3),v.c!.slice(3,6),[v.x,v.y,v.z],this.bezierDetail_);
      }else{
        const q=v.c!;
        const c1=[p.x+2/3*(q[0]-p.x),p.y+2/3*(q[1]-p.y),p.z+2/3*(q[2]-p.z)];
        const c2=[v.x+2/3*(q[0]-v.x),v.y+2/3*(q[1]-v.y),v.z+2/3*(q[2]-v.z)];
        this.cubicPoints(cur,v,[p.x,p.y,p.z],c1,c2,[v.x,v.y,v.z],this.bezierDetail_);
      }
    }
    if(cur.length)out.push(cur);
    return out;
  }

  private cubicPoints(out:ShapeVertex[],attrs:ShapeVertex,p0:number[],c1:number[],c2:number[],p3:number[],detail:number){
    for(let i=1;i<=detail;i++){
      const t=i/detail,u=1-t;
      const b0=u*u*u,b1=3*u*u*t,b2=3*u*t*t,b3=t*t*t;
      out.push({...attrs,code:0,brk:false,c:undefined,
        x:b0*p0[0]+b1*c1[0]+b2*c2[0]+b3*p3[0],
        y:b0*p0[1]+b1*c1[1]+b2*c2[1]+b3*p3[1],
        z:b0*p0[2]+b1*c1[2]+b2*c2[2]+b3*p3[2]});
    }
  }

  endShape(mode=0){
    const kind=this.shapeKind_;
    this.shapeKind_=-1;
    const s=this.style;
    const contours=this.flatten(this.shapeVerts);
    const v=contours.flat();
    const tex=this.shapeTexture;
    this.shapeTexture=null;
    if(!v.length)return;
    const auto=!this.shapeHasNormal;
    const tris:ShapeVertex[][]=[];
    const edges:{pts:ShapeVertex[],closed:boolean}[]=[];
    switch(kind){
      case POINTS:
        for(const p of v)this.pointImpl(p.x,p.y,p.z,p.stroke,p.weight);
        return;
      case LINES:
        for(let i=0;i+1<v.length;i+=2)edges.push({pts:[v[i],v[i+1]],closed:false});
        break;
      case TRIANGLES:
        for(let i=0;i+2<v.length;i+=3){
          tris.push([v[i],v[i+1],v[i+2]]);
          edges.push({pts:[v[i],v[i+1],v[i+2]],closed:true});
        }
        break;
      case TRIANGLE_STRIP:
        for(let i=0;i+2<v.length;i++){
          tris.push(i%2===0?[v[i],v[i+1],v[i+2]]:[v[i+1],v[i],v[i+2]]);
        }
        if(v.length>=2){
          // the outline: both sides of the strip and the rungs
          for(let i=0;i+2<v.length;i++)edges.push({pts:[v[i],v[i+2]],closed:false});
          for(let i=0;i+1<v.length;i++)edges.push({pts:[v[i],v[i+1]],closed:false});
        }
        break;
      case TRIANGLE_FAN:
        for(let i=1;i+1<v.length;i++)tris.push([v[0],v[i],v[i+1]]);
        for(let i=1;i<v.length;i++)edges.push({pts:[v[0],v[i]],closed:false});
        if(v.length>2)edges.push({pts:v.slice(1),closed:false});
        break;
      case QUADS:
        for(let i=0;i+3<v.length;i+=4){
          tris.push([v[i],v[i+1],v[i+2]],[v[i],v[i+2],v[i+3]]);
          edges.push({pts:[v[i],v[i+1],v[i+2],v[i+3]],closed:true});
        }
        break;
      case QUAD_STRIP:
        for(let i=0;i+3<v.length;i+=2){
          tris.push([v[i],v[i+1],v[i+3]],[v[i],v[i+3],v[i+2]]);
          edges.push({pts:[v[i],v[i+1],v[i+3],v[i+2]],closed:true});
        }
        break;
      default:{
        if(s.fill||tex)this.tessellatePolygon(contours,tris);
        contours.forEach((c,i)=>edges.push({pts:c,closed:i>0||mode===CLOSE}));
      }
    }
    if((s.fill||tex)&&tris.length)this.addTriangles(tris,auto,tex);
    if(s.stroke){
      if(this.is3DRenderer)for(const e of edges)this.strokeVertices(e.pts,e.closed);
      else this.stroke2DGroup(edges.map((e)=>({xy:e.pts.flatMap((p)=>[p.x,p.y]),closed:e.closed,color:e.pts[0].stroke,weight:e.pts[0].weight})));
    }
  }

  /** Triangles of a polygon with contours (holes), through the GLU tessellator (nonzero winding). */
  private tessellatePolygon(contours:ShapeVertex[][],out:ShapeVertex[][]){
    const all:ShapeVertex[]=[];
    const idx:number[][]=[];
    for(const c of contours){
      const ci:number[]=[];
      for(const v of c){
        ci.push(all.length);
        all.push(v);
      }
      idx.push(ci);
    }
    if(contours.length===1&&all.length===3){
      out.push([all[0],all[1],all[2]]);
      return;
    }
    const tris=tessellate((i)=>[all[i].x,all[i].y,all[i].z],idx,true,(coords,data,weights)=>{
      const vs=data.map((d)=>all[d]);
      const nv:ShapeVertex={...vs[0],x:coords[0],y:coords[1],z:coords[2],brk:false};
      nv.u=0;nv.v=0;
      for(let k=0;k<vs.length;k++){
        if(!vs[k])continue;
        nv.u+=vs[k].u*weights[k];
        nv.v+=vs[k].v*weights[k];
      }
      all.push(nv);
      return all.length-1;
    },this.is3DRenderer?[0,0,0]:[0,0,1]);
    for(let i=0;i+2<tris.length;i+=3)out.push([all[tris[i]],all[tris[i+1]],all[tris[i+2]]]);
  }

  // --- geometry into the batches ------------------------------------------------------------------------

  /** Before adding geometry: flush when the texture changes. */
  private useTexture(tex:PImage|null){
    if(tex!==this.batchTexture||this.textureWrap_===REPEAT!==this.batchTextureRepeat){
      if(!this.polys.empty())this.flushPolys();
      this.batchTexture=tex;
      this.batchTextureRepeat=this.textureWrap_===REPEAT;
    }
  }

  /** Add triangles (model space) to the polygon batch, transformed into eye space. */
  private addTriangles(tris:ShapeVertex[][],autoNormals:boolean,tex:PImage|null){
    this.useTexture(tex);
    const b=this.polys;
    b.reserve(tris.length*3,tris.length*3);
    const m=this.modelview;
    const inv=this.is3DRenderer?this.modelviewInv:null;
    const tw=tex?(this.textureMode_===IMAGE?tex.width:1):1,th=tex?(this.textureMode_===IMAGE?tex.height:1):1;
    for(const t of tris){
      let fnx=0,fny=0,fnz=1;
      if(autoNormals){
        const [a,c,d]=t;
        const ux=c.x-a.x,uy=c.y-a.y,uz=c.z-a.z,vx=d.x-a.x,vy=d.y-a.y,vz=d.z-a.z;
        fnx=uy*vz-uz*vy;fny=uz*vx-ux*vz;fnz=ux*vy-uy*vx;
        const l=Math.hypot(fnx,fny,fnz);
        if(l>0){fnx/=l;fny/=l;fnz/=l;}
      }
      for(const p of t){
        const nx=autoNormals?fnx:p.nx,ny=autoNormals?fny:p.ny,nz=autoNormals?fnz:p.nz;
        let ex=nx,ey=ny,ez=nz;
        if(inv){
          ex=inv.m00*nx+inv.m10*ny+inv.m20*nz;
          ey=inv.m01*nx+inv.m11*ny+inv.m21*nz;
          ez=inv.m02*nx+inv.m12*ny+inv.m22*nz;
          const l=Math.hypot(ex,ey,ez);
          if(l>0){ex/=l;ey/=l;ez/=l;}
        }
        const o=b.words;
        b.f[o]=m.multX(p.x,p.y,p.z);b.f[o+1]=m.multY(p.x,p.y,p.z);b.f[o+2]=m.multZ(p.x,p.y,p.z);
        b.u[o+3]=rgba(p.fill);
        b.f[o+4]=ex;b.f[o+5]=ey;b.f[o+6]=ez;
        b.f[o+7]=p.u/tw;b.f[o+8]=p.v/th;
        b.u[o+9]=rgba(p.amb);b.u[o+10]=rgba(p.spec);b.u[o+11]=rgba(p.emis);
        b.f[o+12]=p.shine;
        b.idx[b.nidx++]=b.words/PV;
        b.words+=PV;
      }
    }
    this.dirty=true;
  }

  /** Flat-colored triangles in model space 2D (x, y pairs), or in eye space: P2D strokes and points. */
  private addFlat2D(xy:number[],color:number,eye=false){
    this.useTexture(null);
    const b=this.polys;
    const n=xy.length/2;
    b.reserve(n,n);
    const m=eye?IDENTITY:this.modelview;
    const c=rgba(color),amb=rgba(color),spec=rgba(0xff000000|0),emis=rgba(0xff000000|0);
    for(let i=0;i<n;i++){
      const x=xy[i*2],y=xy[i*2+1];
      const o=b.words;
      b.f[o]=m.multX(x,y,0);b.f[o+1]=m.multY(x,y,0);b.f[o+2]=m.multZ(x,y,0);
      b.u[o+3]=c;
      b.f[o+4]=0;b.f[o+5]=0;b.f[o+6]=1;
      b.f[o+7]=0;b.f[o+8]=0;
      b.u[o+9]=amb;b.u[o+10]=spec;b.u[o+11]=emis;b.f[o+12]=1;
      b.idx[b.nidx++]=b.words/PV;
      b.words+=PV;
    }
    this.dirty=true;
  }

  /** Stroke a polyline of shape vertices (their stroke colors and weights). */
  private strokeVertices(pts:ShapeVertex[],closed:boolean){
    if(pts.length===0)return;
    if(this.is3DRenderer){
      const n=pts.length;
      const segs=closed?n:n-1;
      for(let i=0;i<segs;i++){
        const a=pts[i],c=pts[(i+1)%n];
        this.lineSegment(a.x,a.y,a.z,c.x,c.y,c.z,a.stroke,c.stroke,a.weight);
      }
      if(n===1)this.pointImpl(pts[0].x,pts[0].y,pts[0].z,pts[0].stroke,pts[0].weight);
      return;
    }
    const xy:number[]=[];
    for(const p of pts)xy.push(p.x,p.y);
    this.stroke2D(xy,closed,pts[0].stroke,pts[0].weight);
  }

  /** A 2D stroke (model space) as polygons in the polygon batch: overlaps merged when translucent. */
  private stroke2D(xy:number[],closed:boolean,color:number,weight:number){
    this.stroke2DGroup([{xy,closed,color,weight}]);
  }

  /**
   * The outlines of one shape. When the stroke is exactly one pixel wide and every segment is horizontal
   * or vertical on the screen, Processing's P2D covers whole pixels (measured: rect(20, 20, 8, 4) and
   * line(20, 20, 30, 20) fill exact rows and columns, while a triangle's horizontal edge stays across two
   * rows): the segments are moved by half a pixel and extended by half a pixel at both ends.
   */
  private stroke2DGroup(lines:{xy:number[],closed:boolean,color:number,weight:number}[]){
    const m=this.modelview;
    const scale=Math.sqrt(Math.abs(m.m00*m.m11-m.m01*m.m10));
    const pixel=lines.every((l)=>Math.abs(l.weight*scale-1)<1e-6);
    if(pixel){
      const rects:{tris:number[],color:number}[]=[];
      let aligned=true;
      for(const l of lines){
        const n=l.xy.length/2,segs=l.closed?n:n-1;
        const tris:number[]=[];
        for(let k=0;k<segs&&aligned;k++){
          const a=k,b=(k+1)%n;
          const ax=m.multX(l.xy[a*2],l.xy[a*2+1]),ay=m.multY(l.xy[a*2],l.xy[a*2+1]);
          const bx=m.multX(l.xy[b*2],l.xy[b*2+1]),by=m.multY(l.xy[b*2],l.xy[b*2+1]);
          if(ax!==bx&&ay!==by){
            aligned=false;
            break;
          }
          const x0=Math.min(ax,bx),x1=Math.max(ax,bx)+1,y0=Math.min(ay,by),y1=Math.max(ay,by)+1;
          tris.push(x0,y0,x1,y0,x1,y1,x0,y0,x1,y1,x0,y1);
        }
        if(!aligned)break;
        rects.push({tris,color:l.color});
      }
      if(aligned){
        for(const r of rects)if(r.tris.length)this.addFlat2D(r.tris,r.color,true);
        return;
      }
    }
    for(const l of lines)if(l.weight>0)this.stroke2DPolys(l.xy,l.closed,l.color,l.weight);
  }

  private stroke2DPolys(xy:number[],closed:boolean,color:number,weight:number){
    const s=this.style;
    const polys=strokePolygons(xy,closed,weight,s.strokeCap,s.strokeJoin);
    if(!polys.length)return;
    let tris:number[];
    if((color>>>24)!==255&&polys.length>1){
      tris=unionPolygons(polys);
    }else{
      tris=[];
      for(const p of polys){
        for(let i=2;i+3<p.length;i+=2)tris.push(p[0],p[1],p[i],p[i+1],p[i+2],p[i+3]);
      }
    }
    this.addFlat2D(tris,color);
  }

  /** A 3D line segment (model space) as a quad of the line batch. */
  private lineSegment(x1:number,y1:number,z1:number,x2:number,y2:number,z2:number,c1:number,c2:number,weight:number){
    if(weight<=0)return;
    const m=this.modelview;
    const ax=m.multX(x1,y1,z1),ay=m.multY(x1,y1,z1),az=m.multZ(x1,y1,z1);
    const bx=m.multX(x2,y2,z2),by=m.multY(x2,y2,z2),bz=m.multZ(x2,y2,z2);
    const b=this.lines;
    b.reserve(4,6);
    const h=weight/2*this.pixelDensity;
    const base=b.words/LV;
    const put=(x:number,y:number,z:number,c:number,ox:number,oy:number,oz:number,w:number)=>{
      const o=b.words;
      b.f[o]=x;b.f[o+1]=y;b.f[o+2]=z;b.u[o+3]=rgba(c);
      b.f[o+4]=ox;b.f[o+5]=oy;b.f[o+6]=oz;b.f[o+7]=w;
      b.words+=LV;
    };
    const dx=bx-ax,dy=by-ay,dz=bz-az;
    put(ax,ay,az,c1,dx,dy,dz,h);
    put(ax,ay,az,c1,dx,dy,dz,-h);
    put(bx,by,bz,c2,-dx,-dy,-dz,-h);
    put(bx,by,bz,c2,-dx,-dy,-dz,h);
    const ix=b.idx;
    ix[b.nidx++]=base;ix[b.nidx++]=base+1;ix[b.nidx++]=base+2;
    ix[b.nidx++]=base+1;ix[b.nidx++]=base+3;ix[b.nidx++]=base+2;
    this.dirty=true;
  }

  /** A point: a round (or square, with strokeCap(SQUARE)) polygon of the stroke weight. */
  private pointImpl(x:number,y:number,z:number,color:number,weight:number){
    if(weight<=0)return;
    const square=this.style.strokeCap===CAP.SQUARE;
    if(!this.is3DRenderer){
      const r=weight/2;
      let poly:number[];
      if(square)poly=[x-r,y-r,x+r,y-r,x+r,y+r,x-r,y+r];
      else{
        const scale=Math.sqrt(Math.abs(f(this.modelview.m00*this.modelview.m11)-f(this.modelview.m01*this.modelview.m10)));
        const n=ellipseSegments(weight*scale*Math.SQRT2);
        poly=ellipsePoints(x,y,r,r,n);
      }
      const tris:number[]=[];
      for(let i=2;i+3<poly.length;i+=2)tris.push(poly[0],poly[1],poly[i],poly[i+1],poly[i+2],poly[i+3]);
      this.addFlat2D(tris,color);
      return;
    }
    const m=this.modelview;
    const ex=m.multX(x,y,z),ey=m.multY(x,y,z),ez=m.multZ(x,y,z);
    const r=weight/2*this.pixelDensity;
    let ring:number[];
    if(square)ring=[-r,-r,r,-r,r,r,-r,r];
    else ring=ellipsePoints(0,0,r,r,ellipseSegments(weight*Math.SQRT2));
    const n=ring.length/2;
    const b=this.points;
    b.reserve(n+1,n*3);
    const base=b.words/QV;
    const c=rgba(color);
    const put=(ox:number,oy:number)=>{
      const o=b.words;
      b.f[o]=ex;b.f[o+1]=ey;b.f[o+2]=ez;b.u[o+3]=c;b.f[o+4]=ox;b.f[o+5]=oy;
      b.words+=QV;
    };
    put(0,0);
    for(let i=0;i<n;i++)put(ring[i*2],-ring[i*2+1]);
    for(let i=0;i<n;i++){
      b.idx[b.nidx++]=base;b.idx[b.nidx++]=base+1+i;b.idx[b.nidx++]=base+1+(i+1)%n;
    }
    this.dirty=true;
  }

  // --- primitives ---------------------------------------------------------------------------------------

  point(x:number,y:number,z?:number){
    if(z!==undefined&&!this.is3DRenderer)return this.unavailable("point",true);
    const s=this.style;
    if(s.stroke)this.pointImpl(x,y,z??0,s.strokeColor,s.strokeWeight);
  }

  line(...a:number[]){
    const s=this.style;
    if(!s.stroke)return;
    if(a.length===6){
      if(!this.is3DRenderer)return this.unavailable("line",true);
      this.lineSegment(a[0],a[1],a[2],a[3],a[4],a[5],s.strokeColor,s.strokeColor,s.strokeWeight);
      return;
    }
    if(this.is3DRenderer)this.lineSegment(a[0],a[1],0,a[2],a[3],0,s.strokeColor,s.strokeColor,s.strokeWeight);
    else this.stroke2D([a[0],a[1],a[2],a[3]],false,s.strokeColor,s.strokeWeight);
  }

  bezier(...a:number[]){
    if(a.length===12){
      this.beginShape();
      this.vertex(a[0],a[1],a[2]);
      this.bezierVertex(a[3],a[4],a[5],a[6],a[7],a[8],a[9],a[10],a[11]);
      this.endShape();
      return;
    }
    this.beginShape();
    this.vertex(a[0],a[1]);
    this.bezierVertex(a[2],a[3],a[4],a[5],a[6],a[7]);
    this.endShape();
  }

  curve(...a:number[]){
    this.beginShape();
    if(a.length===12){
      for(let i=0;i<12;i+=3)this.curveVertex(a[i],a[i+1],a[i+2]);
    }else{
      for(let i=0;i<8;i+=2)this.curveVertex(a[i],a[i+1]);
    }
    this.endShape();
  }

  /**
   * 2D primitives (rect, ellipse, arc, triangle, quad) arrive as paths: ellipses become the table points
   * Processing uses, curves are flattened, convex outlines are fans and other fills go through the GLU
   * tessellator.
   */
  protected drawPath(path:Path,fill:boolean,stroke:boolean){
    const s=this.style;
    fill&&=s.fill;
    stroke&&=s.stroke&&s.strokeWeight>0;
    if(!fill&&!stroke)return;
    const P=enumPath;
    const contours:{pts:number[],closed:boolean,center?:[number,number]}[]=[];
    let cur:number[]=[];
    let center:[number,number]|undefined;
    const flushContour=(closed:boolean)=>{
      if(cur.length)contours.push({pts:cur,closed,center});
      cur=[];
      center=undefined;
    };
    for(let i=0;i<path.length;){
      switch(path[i]){
        case P.MOVE:
          flushContour(false);
          cur.push(path[i+1],path[i+2]);
          i+=3;break;
        case P.LINE:
          cur.push(path[i+1],path[i+2]);
          i+=3;break;
        case P.QUAD:{
          const x0=cur[cur.length-2],y0=cur[cur.length-1];
          const cx=path[i+1],cy=path[i+2],x=path[i+3],y=path[i+4];
          const n=this.bezierDetail_;
          for(let k=1;k<=n;k++){
            const t=k/n,u=1-t;
            cur.push(u*u*x0+2*u*t*cx+t*t*x,u*u*y0+2*u*t*cy+t*t*y);
          }
          i+=5;break;
        }
        case P.CUBIC:{
          const x0=cur[cur.length-2],y0=cur[cur.length-1];
          const n=this.bezierDetail_;
          for(let k=1;k<=n;k++){
            const t=k/n,u=1-t;
            const b0=u*u*u,b1=3*u*u*t,b2=3*u*t*t,b3=t*t*t;
            cur.push(b0*x0+b1*path[i+1]+b2*path[i+3]+b3*path[i+5],b0*y0+b1*path[i+2]+b2*path[i+4]+b3*path[i+6]);
          }
          i+=7;break;
        }
        case P.ELLIPSE:{
          const cx=path[i+1],cy=path[i+2],rx=path[i+3],ry=path[i+4],a0=path[i+5],a1=path[i+6];
          const full=a0===0&&a1===Math.PI*2;
          const segs=this.ellipseDetail(cx-rx,cy-ry,cx+rx,cy+ry);
          if(full){
            const pts=ellipsePoints(cx,cy,rx,ry,segs);
            if(!cur.length)center=[cx,cy];
            cur.push(...pts);
          }else{
            cur.push(...this.arcPoints(cx,cy,rx,ry,a0,a1,segs));
          }
          i+=7;break;
        }
        default:
          flushContour(true);
          i+=1;
      }
    }
    flushContour(false);
    if(fill)this.fillContours(contours);
    if(stroke){
      if(!this.is3DRenderer){
        this.stroke2DGroup(contours.map((c)=>({xy:c.pts,closed:c.closed,color:s.strokeColor,weight:s.strokeWeight})));
        return;
      }
      for(const c of contours){
        const pts=c.pts;
        const n=pts.length/2;
        const segs=c.closed?n:n-1;
        for(let k=0;k<segs;k++){
          const a=k,b=(k+1)%n;
          this.lineSegment(pts[a*2],pts[a*2+1],0,pts[b*2],pts[b*2+1],0,s.strokeColor,s.strokeColor,s.strokeWeight);
        }
      }
    }
  }

  /** Ellipse segments for a bounding box: from its diagonal on the screen. */
  private ellipseDetail(x1:number,y1:number,x2:number,y2:number):number{
    const sx1=this.screenXnoWarn(x1,y1),sy1=this.screenYnoWarn(x1,y1);
    const sx2=this.screenXnoWarn(x2,y2),sy2=this.screenYnoWarn(x2,y2);
    return ellipseSegments(Math.hypot(sx2-sx1,sy2-sy1));
  }

  private screenXnoWarn(x:number,y:number){
    const [ox]=this.project(x,y,0);
    return f(f(this.width*f(1+ox))/2);
  }

  private screenYnoWarn(x:number,y:number){
    const [,oy]=this.project(x,y,0);
    return f(this.height-f(f(this.height*f(1+oy))/2));
  }

  /** Points of an arc from the table, from start to stop (radians). */
  private arcPoints(cx:number,cy:number,rx:number,ry:number,start:number,stop:number,segs:number):number[]{
    const out:number[]=[];
    const inc=f(SINCOS_LENGTH/segs);
    const startLUT=f(f(start/(Math.PI*2))*SINCOS_LENGTH);
    const stopLUT=f(f(stop/(Math.PI*2))*SINCOS_LENGTH);
    const at=(v:number)=>{
      let ii=Math.trunc(v)%SINCOS_LENGTH;
      if(ii<0)ii+=SINCOS_LENGTH;
      out.push(f(cx+f(cosLUT[ii]*rx)),f(cy+f(sinLUT[ii]*ry)));
    };
    let val=startLUT;
    while(val<stopLUT){
      at(val);
      val=f(val+inc);
    }
    // the exact end
    out.push(f(cx+f(f(Math.cos(stop))*rx)),f(cy+f(f(Math.sin(stop))*ry)));
    return out;
  }

  /** Fill path contours: fans for single convex outlines (ellipses from their center), else tessellated. */
  private fillContours(contours:{pts:number[],closed:boolean,center?:[number,number]}[]){
    const s=this.style;
    const vtx=(x:number,y:number):ShapeVertex=>({x,y,z:0,u:0,v:0,fill:s.fillColor,stroke:s.strokeColor,weight:s.strokeWeight,
      nx:this.normalX,ny:this.normalY,nz:this.normalZ,amb:s.setAmbient?s.ambientColor:s.fillColor,spec:s.specularColor,emis:s.emissiveColor,shine:s.shininess,code:0});
    const tris:ShapeVertex[][]=[];
    if(contours.length===1){
      const c=contours[0];
      const n=c.pts.length/2;
      if(c.center){
        const ctr=vtx(c.center[0],c.center[1]);
        const ring:ShapeVertex[]=[];
        for(let i=0;i<n;i++)ring.push(vtx(c.pts[i*2],c.pts[i*2+1]));
        for(let i=0;i<n;i++)tris.push([ctr,ring[i],ring[(i+1)%n]]);
        this.addTriangles(tris,false,null);
        return;
      }
      if(n<=4||this.isConvex(c.pts)){
        const ring:ShapeVertex[]=[];
        for(let i=0;i<n;i++)ring.push(vtx(c.pts[i*2],c.pts[i*2+1]));
        for(let i=1;i+1<n;i++)tris.push([ring[0],ring[i],ring[i+1]]);
        this.addTriangles(tris,false,null);
        return;
      }
    }
    const cs=contours.map((c)=>{
      const r:ShapeVertex[]=[];
      for(let i=0;i<c.pts.length;i+=2)r.push(vtx(c.pts[i],c.pts[i+1]));
      return r;
    });
    this.tessellatePolygon(cs,tris);
    this.addTriangles(tris,false,null);
  }

  private isConvex(p:number[]):boolean{
    const n=p.length/2;
    let sign=0;
    for(let i=0;i<n;i++){
      const ax=p[i*2],ay=p[i*2+1];
      const bx=p[((i+1)%n)*2],by=p[((i+1)%n)*2+1];
      const cx=p[((i+2)%n)*2],cy=p[((i+2)%n)*2+1];
      const cr=(bx-ax)*(cy-by)-(by-ay)*(cx-bx);
      if(Math.abs(cr)<1e-12)continue;
      const sg=cr>0?1:-1;
      if(sign===0)sign=sg;
      else if(sg!==sign)return false;
    }
    return true;
  }

  protected drawPoint(x:number,y:number){
    const s=this.style;
    this.pointImpl(x,y,0,s.strokeColor,s.strokeWeight);
  }

  /** box(size) or box(w, h, d): centered at the origin, with outward normals and texture-free faces. */
  box(w:number,h?:number,d?:number){
    if(!this.is3DRenderer)return this.unavailable("box");
    h??=w;d??=w;
    const x1=-w/2,x2=w/2,y1=-h/2,y2=h/2,z1=-d/2,z2=d/2;
    // each face clockwise as seen from outside (front facing), with its normal
    const faces:[number[][],number[]][]=[
      [[[x1,y1,z2],[x2,y1,z2],[x2,y2,z2],[x1,y2,z2]],[0,0,1]],
      [[[x2,y1,z2],[x2,y1,z1],[x2,y2,z1],[x2,y2,z2]],[1,0,0]],
      [[[x2,y1,z1],[x1,y1,z1],[x1,y2,z1],[x2,y2,z1]],[0,0,-1]],
      [[[x1,y1,z1],[x1,y1,z2],[x1,y2,z2],[x1,y2,z1]],[-1,0,0]],
      [[[x1,y1,z1],[x2,y1,z1],[x2,y1,z2],[x1,y1,z2]],[0,-1,0]],
      [[[x1,y2,z2],[x2,y2,z2],[x2,y2,z1],[x1,y2,z1]],[0,1,0]],
    ];
    const s=this.style;
    const saved=[this.normalX,this.normalY,this.normalZ];
    this.beginShape(QUADS);
    this.shapeHasNormal=true;
    for(const [pts,n] of faces){
      this.normalX=n[0];this.normalY=n[1];this.normalZ=n[2];
      for(const p of pts)this.newVertex(p[0],p[1],p[2],0,0);
    }
    this.endShape();
    [this.normalX,this.normalY,this.normalZ]=saved;
    void s;
  }

  /** sphere(r): a UV sphere of sphereDetail() resolution, with normals. */
  sphere(r:number){
    if(!this.is3DRenderer)return this.unavailable("sphere");
    const ures=this.sphereU,vres=this.sphereV;
    const s=this.style;
    // rings from the top (y = -r) to the bottom
    const ring=(j:number)=>{
      const phi=Math.PI*j/vres;
      const out:number[][]=[];
      for(let i=0;i<=ures;i++){
        const th=Math.PI*2*i/ures;
        const nx=Math.sin(phi)*Math.cos(th),ny=-Math.cos(phi),nz=Math.sin(phi)*Math.sin(th);
        out.push([nx,ny,nz]);
      }
      return out;
    };
    const tris:ShapeVertex[][]=[];
    const mk=(n:number[]):ShapeVertex=>({x:n[0]*r,y:n[1]*r,z:n[2]*r,u:0,v:0,fill:s.fillColor,stroke:s.strokeColor,weight:s.strokeWeight,
      nx:n[0],ny:n[1],nz:n[2],amb:s.setAmbient?s.ambientColor:s.fillColor,spec:s.specularColor,emis:s.emissiveColor,shine:s.shininess,code:0});
    let prev=ring(0).map(mk);
    for(let j=1;j<=vres;j++){
      const cur=ring(j).map(mk);
      for(let i=0;i<ures;i++){
        // clockwise as seen from outside
        if(j>1)tris.push([prev[i],cur[i],prev[i+1]]);
        if(j<vres)tris.push([prev[i+1],cur[i],cur[i+1]]);
      }
      prev=cur;
    }
    if(s.fill)this.addTriangles(tris,false,null);
    if(s.stroke){
      for(const t of tris)this.strokeVertices(t,true);
    }
  }

  // --- background, images and text ---------------------------------------------------------------------

  protected backgroundImpl(argb:number,clear=false){
    this.flush();
    this.bind();
    const gl=this.glc!.gl;
    const a=clear?0:this.primary?1:(argb>>>24)/255;
    if(clear)argb=0;
    gl.disable(gl.SCISSOR_TEST);
    gl.clearColor(((argb>>16)&0xff)/255,((argb>>8)&0xff)/255,(argb&0xff)/255,a);
    gl.clearDepth(1);
    gl.depthMask(true);
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT|gl.STENCIL_BUFFER_BIT);
    this.dirty=true;
  }

  protected backgroundImage(img:PImage){
    this.backgroundImpl(0xff000000|0);
    this.withState({blend:REPLACE,depth:false,identity:true},()=>this.drawImage(img,0,0,this.width,this.height,0,0,img.width,img.height,true));
  }

  /** Run with a temporary blend mode / no depth test / identity modelview and 2D projection. */
  private withState(o:{blend?:number,depth?:boolean,identity?:boolean,noTint?:boolean},fn:()=>void){
    this.flush();
    const saved={blend:this.style.blendMode,depth:this.depthTest,mv:new PMatrix3D(this.modelview),proj:new PMatrix3D(this.projection),tint:this.style.tint,lights:this.lightsList,poly:this.polyShader};
    if(o.blend!==undefined)this.style.blendMode=o.blend;
    if(o.depth!==undefined)this.depthTest=o.depth;
    if(o.identity){
      this.modelview.reset();
      this.changed();
      this.projection.set(f(2/this.width),0,0,-1,0,f(-2/this.height),0,1,0,0,-1,-0,0,0,0,1);
      this.lightsList=[];
      this.polyShader=null;
    }
    if(o.noTint)this.style.tint=false;
    try{
      fn();
      this.flush();
    }finally{
      this.style.blendMode=saved.blend;
      this.depthTest=saved.depth;
      this.modelview.set(saved.mv);
      this.changed();
      this.projection.set(saved.proj);
      this.style.tint=saved.tint;
      this.lightsList=saved.lights;
      this.polyShader=saved.poly;
    }
  }

  protected drawImage(img:PImage,x1:number,y1:number,x2:number,y2:number,u1:number,v1:number,u2:number,v2:number,_raw=false){
    const s=this.style;
    const color=s.tint?s.tintColor:-1;
    const iw=img.width||1,ih=img.height||1;
    const mk=(x:number,y:number,u:number,v:number):ShapeVertex=>({x,y,z:0,u:u/iw,v:v/ih,fill:color,stroke:0,weight:0,nx:this.normalX,ny:this.normalY,nz:this.normalZ,
      amb:color,spec:0xff000000|0,emis:0xff000000|0,shine:1,code:0});
    const a=mk(x1,y1,u1,v1),b=mk(x2,y1,u2,v1),c=mk(x2,y2,u2,v2),d=mk(x1,y2,u1,v2);
    const mode=this.textureMode_;
    this.textureMode_=NORMAL;
    this.addTriangles([[a,b,c],[a,c,d]],false,img);
    this.textureMode_=mode;
  }

  /** Text lines are drawn as textures (the line rendered by the canvas in white, tinted with the fill). */
  protected drawTextLine(line:string,x:number,y:number){
    if(!line)return;
    const t=this.textTexture(line);
    if(!t)return;
    const s=this.style;
    const saved={tint:s.tint,tintColor:s.tintColor};
    s.tint=true;
    s.tintColor=s.fillColor;
    this.drawImage(t.img,x+t.x,y+t.y,x+t.x+t.w,y+t.y+t.h,0,0,t.img.width,t.img.height);
    s.tint=saved.tint;
    s.tintColor=saved.tintColor;
  }

  /** A text line rendered in white at the surface's density (cached). */
  private textTexture(line:string){
    const s=this.style;
    const vf=s.textFont?.__vlw__?s.textFont:null;
    const key=(vf?`vlw:${s.textFont!.name}`:cssFont(s))+"|"+s.textSize+"|"+line;
    let t=this.textCache.get(key);
    if(t)return t;
    const d=this.pixelDensity;
    const ctx0=measureContext();
    let w:number,asc:number,desc:number;
    if(vf){
      w=textLineWidth(s,line);
      asc=s.textSize*1.2;desc=s.textSize*0.5;
    }else{
      ctx0.font=cssFont(s);
      const m=ctx0.measureText(line);
      w=Math.max(m.width,m.actualBoundingBoxRight);
      asc=Math.max(m.fontBoundingBoxAscent??s.textSize,m.actualBoundingBoxAscent);
      desc=Math.max(m.fontBoundingBoxDescent??s.textSize*0.3,m.actualBoundingBoxDescent);
    }
    const pad=2;
    const left=-pad,top=-Math.ceil(asc)-pad;
    const cw=Math.ceil(w)+pad*2,ch=Math.ceil(asc)+Math.ceil(desc)+pad*2;
    const img=new PImage(this.parent);
    img.init(cw,ch,2,d);
    const ctx=img.__ctx__!;
    ctx.setTransform(d,0,0,d,0,0);
    if(vf){
      drawVlwLine(ctx,vf,s.textSize,-1,line,-left,-top);
    }else{
      ctx.font=cssFont(s);
      ctx.fillStyle="#fff";
      ctx.textBaseline="alphabetic";
      ctx.fillText(line,-left,-top);
    }
    img.__fresh__=false;
    img.__unsynced__=false;
    img.__version__++;
    t={img,x:left,y:top,w:cw,h:ch};
    if(this.textCache.size>512)this.textCache.clear();
    this.textCache.set(key,t);
    return t;
  }

  protected textWidthImpl(line:string){
    return textLineWidth(this.style,line);
  }

  protected textAscentImpl(){
    return Math.fround(fontMetrics(this.style).ascent*this.style.textSize);
  }

  protected textDescentImpl(){
    return Math.fround(fontMetrics(this.style).descent*this.style.textSize);
  }

  // --- drawing the batches -------------------------------------------------------------------------------

  flush(){
    if(!this.glc)return;
    if(!this.polys.empty())this.flushPolys();
    if(!this.lines.empty())this.flushLines();
    if(!this.points.empty())this.flushPoints();
  }

  private resetAttribs(){
    const gl=this.glc!.gl;
    for(const l of this.enabledAttribs)gl.disableVertexAttribArray(l);
    this.enabledAttribs.clear();
  }

  private attrib(prog:GLProgram,names:string[],size:number,type:number,normalized:boolean,stride:number,offset:number){
    const gl=this.glc!.gl;
    for(const n of names){
      const loc=prog.attribs.get(n);
      if(loc===undefined||loc<0)continue;
      gl.enableVertexAttribArray(loc);
      this.enabledAttribs.add(loc);
      gl.vertexAttribPointer(loc,size,type,normalized,stride,offset);
    }
  }

  /** GL state for drawing into this surface: blending, depth. */
  private prepare(){
    const gl=this.glc!.gl;
    this.bind();
    gl.disable(gl.SCISSOR_TEST);
    gl.disable(gl.CULL_FACE);
    // screen-clockwise faces are the front (the projection flips y)
    gl.frontFace(gl.CW);
    if(this.depthTest){
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
    }else gl.disable(gl.DEPTH_TEST);
    gl.depthMask(this.depthMask);
    this.setBlend(this.style.blendMode);
  }

  private setBlend(mode:number){
    const gl=this.glc!.gl;
    gl.enable(gl.BLEND);
    gl.blendEquation(gl.FUNC_ADD);
    switch(mode){
      // REPLACE writes the color times its alpha (measured: (255, 200, 0, 180) gives (180, 141, 0))
      case REPLACE:gl.blendFuncSeparate(gl.SRC_ALPHA,gl.ZERO,gl.ONE,gl.ZERO);break;
      case ADD:gl.blendFuncSeparate(gl.SRC_ALPHA,gl.ONE,gl.ONE,gl.ONE);break;
      case SUBTRACT:
        gl.blendEquationSeparate(gl.FUNC_REVERSE_SUBTRACT,gl.FUNC_ADD);
        gl.blendFuncSeparate(gl.SRC_ALPHA,gl.ONE,gl.ONE,gl.ONE);
        break;
      case LIGHTEST:
        gl.blendEquationSeparate(gl.MAX,gl.FUNC_ADD);
        gl.blendFuncSeparate(gl.SRC_ALPHA,gl.DST_ALPHA,gl.ONE,gl.ONE);
        break;
      case DARKEST:
        gl.blendEquationSeparate(gl.MIN,gl.FUNC_ADD);
        gl.blendFuncSeparate(gl.SRC_ALPHA,gl.DST_ALPHA,gl.ONE,gl.ONE);
        break;
      case EXCLUSION:gl.blendFuncSeparate(gl.ONE_MINUS_DST_COLOR,gl.ONE_MINUS_SRC_COLOR,gl.ONE,gl.ONE);break;
      case MULTIPLY:gl.blendFuncSeparate(gl.ZERO,gl.SRC_COLOR,gl.ONE,gl.ONE);break;
      case SCREEN:gl.blendFuncSeparate(gl.ONE_MINUS_DST_COLOR,gl.ONE,gl.ONE,gl.ONE);break;
      default:gl.blendFuncSeparate(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA,gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
    }
  }

  /** The texture to sample for an image: its own (a GL surface's colorTex), or an uploaded copy. */
  private textureOf(img:PImage,repeat:boolean):{tex:WebGLTexture,flip:boolean}|null{
    const glc=this.glc!;
    if(img instanceof PGraphicsOpenGL&&img.glc===glc){
      img.resolve();
      this.bind();
      glc.gl.bindTexture(glc.gl.TEXTURE_2D,img.colorTex);
      glc.textureParams(true,repeat);
      return {tex:img.colorTex!,flip:true};
    }
    if(img instanceof FrameTexture){
      glc.gl.bindTexture(glc.gl.TEXTURE_2D,img.tex);
      glc.textureParams(true,repeat);
      return {tex:img.tex,flip:true};
    }
    const tex=glc.imageTexture(img,repeat,this.parent.__requested__.smooth!==false);
    return tex?{tex,flip:false}:null;
  }

  private choosePolyShader(textured:boolean,lit:boolean):{prog:GLProgram,custom:PShader|null}{
    const glc=this.glc!;
    const c=this.polyShader;
    if(c){
      const ok=c.type===ShaderKind.POLY||(textured?c.type===ShaderKind.TEXTURE||c.type===ShaderKind.TEXLIGHT:c.type===ShaderKind.COLOR||c.type===ShaderKind.LIGHT);
      if(ok){
        const p=c.program(glc);
        if(p)return {prog:p,custom:c};
      }
    }
    const kind=lit?(textured?ShaderKind.TEXLIGHT:ShaderKind.LIGHT):(textured?ShaderKind.TEXTURE:ShaderKind.COLOR);
    const [v,fr]=PShader.defaults(kind);
    return {prog:glc.program(v,fr),custom:null};
  }

  private flushPolys(){
    const glc=this.glc!,gl=glc.gl;
    const b=this.polys;
    const tex=this.batchTexture;
    const lit=this.is3DRenderer&&this.lightsList.length>0;
    let texInfo:{tex:WebGLTexture,flip:boolean}|null=null;
    this.prepare();
    if(tex){
      gl.activeTexture(gl.TEXTURE0);
      texInfo=this.textureOf(tex,this.batchTextureRepeat);
    }
    const {prog,custom}=this.choosePolyShader(!!texInfo,lit);
    gl.useProgram(prog.program);
    gl.bindVertexArray(glc.vao);
    this.resetAttribs();
    gl.bindBuffer(gl.ARRAY_BUFFER,glc.vbo);
    gl.bufferData(gl.ARRAY_BUFFER,b.f.subarray(0,b.words),gl.STREAM_DRAW);
    const st=PV*4;
    this.attrib(prog,["position","vertex"],3,gl.FLOAT,false,st,0);
    this.attrib(prog,["color"],4,gl.UNSIGNED_BYTE,true,st,12);
    this.attrib(prog,["normal"],3,gl.FLOAT,false,st,16);
    this.attrib(prog,["texCoord"],2,gl.FLOAT,false,st,28);
    this.attrib(prog,["ambient"],4,gl.UNSIGNED_BYTE,true,st,36);
    this.attrib(prog,["specular"],4,gl.UNSIGNED_BYTE,true,st,40);
    this.attrib(prog,["emissive"],4,gl.UNSIGNED_BYTE,true,st,44);
    this.attrib(prog,["shininess"],1,gl.FLOAT,false,st,48);
    this.uniforms(prog,custom,texInfo,tex);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,glc.ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,b.idx.subarray(0,b.nidx),gl.STREAM_DRAW);
    gl.drawElements(gl.TRIANGLES,b.nidx,gl.UNSIGNED_INT,0);
    b.clear();
    this.drawCount++;
  }

  private flushLines(){
    const glc=this.glc!,gl=glc.gl;
    const b=this.lines;
    this.prepare();
    let prog:GLProgram|null=null;
    const custom=this.lineShader;
    if(custom)prog=custom.program(glc);
    prog??=glc.program(S.LINE_VERT,S.LINE_FRAG);
    gl.useProgram(prog.program);
    gl.bindVertexArray(glc.vao);
    this.resetAttribs();
    gl.bindBuffer(gl.ARRAY_BUFFER,glc.vbo);
    gl.bufferData(gl.ARRAY_BUFFER,b.f.subarray(0,b.words),gl.STREAM_DRAW);
    const st=LV*4;
    this.attrib(prog,["position","vertex"],3,gl.FLOAT,false,st,0);
    this.attrib(prog,["color"],4,gl.UNSIGNED_BYTE,true,st,12);
    this.attrib(prog,["direction"],4,gl.FLOAT,false,st,16);
    this.uniforms(prog,custom,null,null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,glc.ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,b.idx.subarray(0,b.nidx),gl.STREAM_DRAW);
    gl.drawElements(gl.TRIANGLES,b.nidx,gl.UNSIGNED_INT,0);
    b.clear();
  }

  private flushPoints(){
    const glc=this.glc!,gl=glc.gl;
    const b=this.points;
    this.prepare();
    let prog:GLProgram|null=null;
    const custom=this.pointShader;
    if(custom)prog=custom.program(glc);
    prog??=glc.program(S.POINT_VERT,S.POINT_FRAG);
    gl.useProgram(prog.program);
    gl.bindVertexArray(glc.vao);
    this.resetAttribs();
    gl.bindBuffer(gl.ARRAY_BUFFER,glc.vbo);
    gl.bufferData(gl.ARRAY_BUFFER,b.f.subarray(0,b.words),gl.STREAM_DRAW);
    const st=QV*4;
    this.attrib(prog,["position","vertex"],3,gl.FLOAT,false,st,0);
    this.attrib(prog,["color"],4,gl.UNSIGNED_BYTE,true,st,12);
    this.attrib(prog,["offset"],2,gl.FLOAT,false,st,16);
    this.uniforms(prog,custom,null,null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,glc.ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,b.idx.subarray(0,b.nidx),gl.STREAM_DRAW);
    gl.drawElements(gl.TRIANGLES,b.nidx,gl.UNSIGNED_INT,0);
    b.clear();
  }

  /** Processing's uniforms by name (either spelling), the lights, then the sketch's set() values. */
  private uniforms(prog:GLProgram,custom:PShader|null,texInfo:{tex:WebGLTexture,flip:boolean}|null,tex:PImage|null){
    const gl=this.glc!.gl;
    const U=prog.uniforms;
    const get=(...names:string[])=>{
      for(const n of names){
        const u=U.get(n);
        if(u)return u.loc;
      }
      return null;
    };
    const mat4=(m:PMatrix3D)=>new Float32Array([m.m00,m.m10,m.m20,m.m30,m.m01,m.m11,m.m21,m.m31,m.m02,m.m12,m.m22,m.m32,m.m03,m.m13,m.m23,m.m33]);
    const identity=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);
    let l:WebGLUniformLocation|null;
    if((l=get("transformMatrix","transform")))gl.uniformMatrix4fv(l,false,mat4(this.projection));
    if((l=get("modelviewMatrix","modelview")))gl.uniformMatrix4fv(l,false,identity);
    if((l=get("projectionMatrix","projection")))gl.uniformMatrix4fv(l,false,mat4(this.projection));
    if((l=get("normalMatrix")))gl.uniformMatrix3fv(l,false,new Float32Array([1,0,0,0,1,0,0,0,1]));
    if((l=get("texMatrix"))){
      gl.uniformMatrix4fv(l,false,texInfo?.flip?new Float32Array([1,0,0,0,0,-1,0,0,0,0,1,0,0,1,0,1]):identity);
    }
    if((l=get("texOffset"))&&tex)gl.uniform2f(l,1/Math.max(1,tex.pixelWidth),1/Math.max(1,tex.pixelHeight));
    if((l=get("viewport")))gl.uniform4f(l,0,0,this.pixelWidth,this.pixelHeight);
    if((l=get("perspective")))gl.uniform1i(l,this.strokePerspective&&this.is3DRenderer?1:0);
    if((l=get("scale"))){
      const k=this.is3DRenderer?0.99:1;
      gl.uniform3f(l,k,k,k);
    }
    if((l=get("strokeDepth")))gl.uniform1f(l,this.cameraZ*this.pixelDensity);
    if((l=get("texMap","texture"))&&texInfo)gl.uniform1i(l,0);
    // lights
    const L=this.lightsList;
    if((l=get("lightCount")))gl.uniform1i(l,L.length);
    if(L.length&&U.has("lightPosition")||U.has("lightNormal")||U.has("lightAmbient")||U.has("lightDiffuse")){
      const arr=(k:keyof Light,n:number)=>{
        const a=new Float32Array(8*n);
        L.forEach((li,i)=>a.set((li[k] as number[]).slice(0,n),i*n));
        return a;
      };
      if((l=get("lightPosition")))gl.uniform4fv(l,arr("pos",4));
      if((l=get("lightNormal")))gl.uniform3fv(l,arr("normal",3));
      if((l=get("lightAmbient")))gl.uniform3fv(l,arr("ambient",3));
      if((l=get("lightDiffuse")))gl.uniform3fv(l,arr("diffuse",3));
      if((l=get("lightSpecular")))gl.uniform3fv(l,arr("specular",3));
      if((l=get("lightFalloff")))gl.uniform3fv(l,arr("falloff",3));
      if((l=get("lightSpot")))gl.uniform2fv(l,arr("spot",2));
    }
    let unit=1;
    if((l=get("ppixels"))){
      if(!this.ppixelsTex)this.ppixelsTex=this.glc!.createTexture(this.pixelWidth,this.pixelHeight,true,false);
      gl.activeTexture(gl.TEXTURE0+unit);
      gl.bindTexture(gl.TEXTURE_2D,this.ppixelsTex);
      gl.uniform1i(l,unit);
      unit++;
    }
    if(custom){
      for(const [name,val] of custom.uniformValues){
        const key=name==="texture"?"texMap":name;
        const u=U.get(key)??U.get(name);
        if(!u)continue;
        if(val.kind==="tex"){
          gl.activeTexture(gl.TEXTURE0+unit);
          const t=this.textureOf(val.values as PImage,false);
          if(t)gl.uniform1i(u.loc,unit);
          unit++;
          continue;
        }
        this.setUniform(u.type,u.loc,val.values as ArrayLike<number>,val.n,val.kind,val.transpose);
      }
      gl.activeTexture(gl.TEXTURE0);
    }
  }

  /** A sketch's uniform value, converted to the type the shader declares. */
  private setUniform(type:number,loc:WebGLUniformLocation,values:ArrayLike<number>,n:number,kind:string,transpose?:boolean){
    const gl=this.glc!.gl;
    const v=Array.from(values);
    switch(type){
      case gl.FLOAT:gl.uniform1fv(loc,v);break;
      case gl.FLOAT_VEC2:gl.uniform2fv(loc,v);break;
      case gl.FLOAT_VEC3:gl.uniform3fv(loc,v);break;
      case gl.FLOAT_VEC4:gl.uniform4fv(loc,v);break;
      case gl.INT:case gl.BOOL:case gl.SAMPLER_2D:gl.uniform1iv(loc,v.map(Math.trunc));break;
      case gl.INT_VEC2:case gl.BOOL_VEC2:gl.uniform2iv(loc,v.map(Math.trunc));break;
      case gl.INT_VEC3:case gl.BOOL_VEC3:gl.uniform3iv(loc,v.map(Math.trunc));break;
      case gl.INT_VEC4:case gl.BOOL_VEC4:gl.uniform4iv(loc,v.map(Math.trunc));break;
      case gl.FLOAT_MAT2:gl.uniformMatrix2fv(loc,false,transpose?[v[0],v[2],v[1],v[3]]:v);break;
      case gl.FLOAT_MAT3:gl.uniformMatrix3fv(loc,false,transpose?[v[0],v[3],v[6],v[1],v[4],v[7],v[2],v[5],v[8]]:v);break;
      case gl.FLOAT_MAT4:gl.uniformMatrix4fv(loc,false,transpose?[0,4,8,12,1,5,9,13,2,6,10,14,3,7,11,15].map((i)=>v[i]):v);break;
    }
    void n;void kind;
  }

  // --- pixels ---------------------------------------------------------------------------------------------

  /** The surface's pixels, rows top first (ARGB). */
  private readPixels(x:number,y:number,w:number,h:number):Int32Array{
    this.resolve();
    const gl=this.glc!.gl;
    const data=new Uint8Array(w*h*4);
    gl.bindFramebuffer(gl.READ_FRAMEBUFFER,this.resolveFbo);
    gl.readPixels(x,this.pixelHeight-y-h,w,h,gl.RGBA,gl.UNSIGNED_BYTE,data);
    gl.bindFramebuffer(gl.FRAMEBUFFER,null);
    this.glc!.boundTarget=null;
    // flip rows
    const out=new Int32Array(w*h);
    const row=new Int32Array(w);
    for(let r=0;r<h;r++){
      rgbaToArgb(new Uint8ClampedArray(data.buffer,(h-1-r)*w*4,w*4),row,this.format===1);
      out.set(row,r*w);
    }
    return out;
  }

  loadPixels(){
    if(!this.glc)return;
    if(this.pixels.length!==this.pixelWidth*this.pixelHeight)this.pixels=new Int32Array(this.pixelWidth*this.pixelHeight);
    this.pixels.set(this.readPixels(0,0,this.pixelWidth,this.pixelHeight));
    this.__fresh__=true;
  }

  updatePixels(x=0,y=0,w=this.pixelWidth,h=this.pixelHeight){
    if(!this.glc||this.pixels.length===0)return;
    this.flush();
    const glc=this.glc,gl=glc.gl;
    // the pixels as a texture (rows top first), drawn over the region without blending
    const tex=glc.createTexture(this.pixelWidth,this.pixelHeight,false,false);
    const data=new Uint8Array(this.pixelWidth*this.pixelHeight*4);
    const px=this.pixels;
    for(let i=0;i<px.length;i++){
      const c=px[i];
      data[i*4]=(c>>16)&0xff;data[i*4+1]=(c>>8)&0xff;data[i*4+2]=c&0xff;data[i*4+3]=this.format===1?255:(c>>>24);
    }
    gl.bindTexture(gl.TEXTURE_2D,tex);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA8,this.pixelWidth,this.pixelHeight,0,gl.RGBA,gl.UNSIGNED_BYTE,data);
    this.bind();
    gl.enable(gl.SCISSOR_TEST);
    gl.scissor(x,this.pixelHeight-y-h,w,h);
    this.blit(tex,true,false);
    gl.disable(gl.SCISSOR_TEST);
    gl.deleteTexture(tex);
    this.glc.boundTarget=null;
    this.dirty=true;
  }

  get(x?:number,y?:number,w?:number,h?:number):PImage|number{
    if(x===undefined)return this.get(0,0,this.width,this.height);
    if(w===undefined||h===undefined){
      x=Math.trunc(x);y=Math.trunc(y!);
      if(x<0||y<0||x>=this.width||y>=this.height)return 0;
      const d=this.pixelDensity;
      const c=this.readPixels(x*d,y*d,1,1)[0];
      return this.format===1?(c|0xff000000):c;
    }
    const out=new PImage(this.parent);
    out.init(Math.max(0,w),Math.max(0,h),this.format===1?1:2,1);
    if(w>0&&h>0){
      out.pixels.set(this.__region__(x,y!,w,h,w,h));
      out.updatePixels();
    }
    return out;
  }

  __region__(sx:number,sy:number,sw:number,sh:number,tw:number,th:number):Int32Array{
    const d=this.pixelDensity;
    if(d===1&&sw===tw&&sh===th){
      const out=new Int32Array(tw*th);
      sx=Math.trunc(sx);sy=Math.trunc(sy);
      const x0=Math.max(0,sx),y0=Math.max(0,sy),x1=Math.min(this.pixelWidth,sx+tw),y1=Math.min(this.pixelHeight,sy+th);
      if(x1>x0&&y1>y0){
        const px=this.readPixels(x0,y0,x1-x0,y1-y0);
        for(let r=0;r<y1-y0;r++)out.set(px.subarray(r*(x1-x0),(r+1)*(x1-x0)),(r+y0-sy)*tw+(x0-sx));
      }
      return out;
    }
    return super.__region__(sx,sy,sw,sh,tw,th);
  }

  set(x:number,y:number,c:number|PImage){
    if(!this.glc)return;
    if(c instanceof PImage){
      this.withState({blend:REPLACE,depth:false,identity:true,noTint:true},()=>this.drawImage(c,Math.trunc(x),Math.trunc(y),Math.trunc(x)+c.width,Math.trunc(y)+c.height,0,0,c.width,c.height));
      return;
    }
    x=Math.trunc(x);y=Math.trunc(y);
    if(x<0||y<0||x>=this.width||y>=this.height)return;
    this.flush();
    this.bind();
    const gl=this.glc.gl;
    const d=this.pixelDensity;
    gl.enable(gl.SCISSOR_TEST);
    gl.scissor(x*d,this.pixelHeight-(y+1)*d,d,d);
    gl.clearColor(((c>>16)&0xff)/255,((c>>8)&0xff)/255,(c&0xff)/255,this.format===1?1:(c>>>24)/255);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.disable(gl.SCISSOR_TEST);
    this.dirty=true;
  }

  /** A 2D canvas copy of the surface (to draw it with a JAVA2D renderer or save it). */
  __native__():NativeCanvas|null{
    if(!this.glc)return null;
    const frame=this.parent.frameCount*1000+this.drawCount;
    if(!this.mirror){
      const canvas=createNativeCanvas(this.pixelWidth,this.pixelHeight);
      this.mirror={canvas,ctx:canvas.getContext("2d") as Native2D,frame:-1};
    }
    const m=this.mirror;
    if(m.canvas.width!==this.pixelWidth||m.canvas.height!==this.pixelHeight){
      m.canvas.width=this.pixelWidth;
      m.canvas.height=this.pixelHeight;
    }
    if(this.dirty||m.frame!==frame||!this.polys.empty()){
      const px=this.readPixels(0,0,this.pixelWidth,this.pixelHeight);
      const img=m.ctx.createImageData(this.pixelWidth,this.pixelHeight);
      for(let i=0;i<px.length;i++){
        const c=px[i];
        img.data[i*4]=(c>>16)&0xff;img.data[i*4+1]=(c>>8)&0xff;img.data[i*4+2]=c&0xff;img.data[i*4+3]=c>>>24;
      }
      m.ctx.putImageData(img,0,0);
      m.frame=frame;
    }
    this.__canvas__=m.canvas;
    this.__ctx__=m.ctx;
    return m.canvas;
  }

  save(filename:string):boolean{
    this.__native__();
    return super.save(filename);
  }

  mask(_m:PImage|ArrayLike<number>){
    this.unavailable("mask");
  }
}

/** The frame copy filter(PShader) samples (a GL texture with rows bottom first). */
class FrameTexture extends PImage{
  constructor(owner:PGraphicsOpenGL,readonly tex:WebGLTexture,w:number,h:number){
    super(owner.parent);
    this.width=owner.width;
    this.height=owner.height;
    this.pixelWidth=w;
    this.pixelHeight=h;
  }
}

/** P2D (Processing's PGraphics2D). */
export class PGraphics2D extends PGraphicsOpenGL{
  constructor(parent:PApplet,canvas:HTMLCanvasElement|null=null,primary=false){
    super(parent,canvas,primary,false);
  }
}

/** P3D (Processing's PGraphics3D). */
export class PGraphics3D extends PGraphicsOpenGL{
  constructor(parent:PApplet,canvas:HTMLCanvasElement|null=null,primary=false){
    super(parent,canvas,primary,true);
  }
}
