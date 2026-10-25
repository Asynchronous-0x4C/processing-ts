import { PConstants } from "./PConstants";
import type { PGraphics } from "./PGraphics";
import type { PImage } from "./PImage";
import { PMatrix3D } from "./PMatrix3D";
import { PMatrix2D } from "./PMatrix2D";
import { PVector } from "./util/PVector";
import { exceptions } from "../../runtime/lang/index.ts";

// PConstants
const GROUP=0,POINT=2,LINE=4,TRIANGLE=8,QUAD=16,RECT=30,ELLIPSE=31,ARC=32,SPHERE=40,BOX=41;
const POLYGON=20,CLOSE=2,CORNER=0,CORNERS=1,CENTER=3,IMAGE=2;

/** A vertex of a PATH/GEOMETRY shape: position, texture coordinates, per-vertex colors and normal. */
export type ShapeVertex={
  x:number,y:number,z:number,u:number,v:number,
  fill:number,stroke:number,weight:number,
  nx:number,ny:number,nz:number,
  /** VERTEX (0), BEZIER_VERTEX (1, control points in c), QUADRATIC_VERTEX (2), CURVE_VERTEX (3) */
  code:number,c?:number[],
  /** a contour (beginContour()) starts here */
  brk?:boolean,
};

/** The style a shape draws with (taken from the renderer when the shape is created). */
type ShapeStyle={
  fill:boolean,fillColor:number,stroke:boolean,strokeColor:number,strokeWeight:number,
  strokeCap:number,strokeJoin:number,tint:boolean,tintColor:number,
  ambient:number,specular:number,emissive:number,shininess:number,
};

/**
 * Processing's PShape for every renderer: GROUP (children), PRIMITIVE (rect, ellipse, box… with their
 * parameters), PATH (loadShape() outlines) and GEOMETRY (beginShape()/vertex()/endShape() on the shape).
 * It keeps its own style and transformation and draws itself through the renderer's immediate drawing
 * functions (P2D/P3D tessellate it at each draw, as their immediate mode does).
 */
export class PShape extends PConstants{
  static readonly PRIMITIVE=101;
  static readonly PATH=102;
  static readonly GEOMETRY=103;
  readonly PRIMITIVE=101;
  readonly PATH_FAMILY=102;
  readonly GEOMETRY=103;

  family:number;
  kind:number;
  params:number[]=[];
  name:string|null=null;
  parent:PShape|null=null;
  children:PShape[]=[];
  private named=new Map<string,PShape>();
  visible=true;
  styleEnabled=true;
  /** The shape's transformation (null: none). */
  matrix:PMatrix3D|null=null;
  vertices:ShapeVertex[]=[];
  closed=false;
  texture_:PImage|null=null;
  textureMode_=IMAGE;
  style:ShapeStyle;
  /** Explicit size (SVG documents, primitives); otherwise measured from the vertices. */
  width=0;
  height=0;
  depth=0;
  is3D_=false;
  private building=false;
  private nextBreak=false;
  private normalX=0;private normalY=0;private normalZ=1;
  /** normal() was called while building: the vertices carry normals (else the renderer computes them). */
  private hasNormals=false;
  /** Extra drawing for shapes made by loaders (e.g. SVG paths with curves): replaces the default. */
  customDraw:((g:PGraphics)=>void)|null=null;
  /** The renderer's color calculation (createShape() keeps a reference for fill() etc. on the shape). */
  private colorOf:((args:number[],float?:boolean)=>number)|null;

  /**
   * Transformations compose as in Processing's OpenGL shapes (each new one applied after the previous
   * ones, around the parent's origin) rather than as in its JAVA2D shapes (applied in the shape's frame).
   */
  private preApplies=false;

  /** new PShape(), PShape(family), PShape(g, family) or PShape(g, kind, params...) (a primitive). */
  constructor(g?:PGraphics|number|null,kind?:number,...rest:(number|ArrayLike<number>)[]){
    super();
    // PShape(g, kind, float... params): the parameters arrive as one float[] (Java varargs)
    const params=rest.length===1&&typeof rest[0]==="object"?Array.from(rest[0]):rest as number[];
    let pg:PGraphics|null=null;
    this.kind=0;
    if(typeof g==="number"){
      this.family=g;
    }else{
      pg=g??null;
      this.family=kind??GROUP;
      if(params.length){
        this.family=PShape.PRIMITIVE;
        this.kind=kind!;
        this.params=params;
      }
    }
    this.preApplies=!!pg&&"glc" in pg;
    this.colorOf=pg?((a,f)=>pg!.colorCalc(a,f)):null;
    const s=pg?.style;
    this.style={
      fill:s?.fill??true,fillColor:s?.fillColor??-1,
      stroke:s?.stroke??true,strokeColor:s?.strokeColor??(0xff000000|0),strokeWeight:s?.strokeWeight??1,
      strokeCap:s?.strokeCap??2,strokeJoin:s?.strokeJoin??8,
      tint:false,tintColor:-1,
      ambient:s?(s.setAmbient?s.ambientColor:s.fillColor):-1,specular:s?.specularColor??(0xff808080|0),emissive:s?.emissiveColor??(0xff000000|0),shininess:s?.shininess??1,
    };
    this.is3D_=!!pg?.is3D();
  }

  private color(a:number[],float=false):number{
    if(this.colorOf)return this.colorOf(a,float);
    if(a.length===1)return a[0]|0;
    return ((255<<24)|((a[0]&255)<<16)|((a[1]&255)<<8)|(a[2]&255))|0;
  }

  // --- building (beginShape()/endShape() on the shape) -----------------------------------------------

  beginShape(kind=POLYGON){
    this.family=this.family===GROUP?PShape.GEOMETRY:this.family;
    if(this.family!==PShape.PATH)this.family=PShape.GEOMETRY;
    this.kind=kind;
    this.building=true;
  }

  endShape(mode=0){
    if(!this.building)throw new exceptions.RuntimeException("endShape() can only be called between beginShape() and endShape()");
    this.building=false;
    this.closed=mode===CLOSE;
  }

  private add(x:number,y:number,z:number,u:number,v:number,code=0):ShapeVertex{
    const s=this.style;
    const vt:ShapeVertex={x,y,z,u,v,fill:s.fill?s.fillColor:0,stroke:s.strokeColor,weight:s.strokeWeight,nx:this.normalX,ny:this.normalY,nz:this.normalZ,code};
    if(this.nextBreak){
      vt.brk=true;
      this.nextBreak=false;
    }
    this.vertices.push(vt);
    return vt;
  }

  /** vertex(x, y), (x, y, z), (x, y, u, v) or (x, y, z, u, v) */
  vertex(x:number,y:number,a?:number,b?:number,c?:number){
    if(c!==undefined)this.add(x,y,a!,b!,c);
    else if(b!==undefined)this.add(x,y,0,a!,b);
    else this.add(x,y,a??0,0,0);
    if(a!==undefined&&b===undefined)this.is3D_=true;
  }

  bezierVertex(...a:number[]){
    const v=a.length===6?this.add(a[4],a[5],0,0,0,1):this.add(a[6],a[7],a[8],0,0,1);
    v.c=a.length===6?[a[0],a[1],0,a[2],a[3],0]:a.slice(0,6);
  }

  quadraticVertex(...a:number[]){
    const v=a.length===4?this.add(a[2],a[3],0,0,0,2):this.add(a[3],a[4],a[5],0,0,2);
    v.c=a.length===4?[a[0],a[1],0]:a.slice(0,3);
  }

  curveVertex(x:number,y:number,z=0){
    this.add(x,y,z,0,0,3);
  }

  beginContour(){
    this.nextBreak=true;
  }

  endContour(){}

  normal(x:number,y:number,z:number){
    this.normalX=x;this.normalY=y;this.normalZ=z;
    this.hasNormals=true;
  }

  texture(img:PImage){
    this.texture_=img;
  }

  textureMode(m:number){
    this.textureMode_=m;
  }

  noTexture(){
    this.texture_=null;
  }

  fill(...a:number[]){
    this.style.fill=true;
    this.style.fillColor=this.color(a);
    if(!this.building)this.vertices.forEach((v)=>{v.fill=this.style.fillColor;});
  }

  fillF(...a:number[]){
    this.style.fill=true;
    this.style.fillColor=this.color(a,true);
    if(!this.building)this.vertices.forEach((v)=>{v.fill=this.style.fillColor;});
  }

  noFill(){
    this.style.fill=false;
  }

  stroke(...a:number[]){
    this.style.stroke=true;
    this.style.strokeColor=this.color(a);
  }

  strokeF(...a:number[]){
    this.style.stroke=true;
    this.style.strokeColor=this.color(a,true);
  }

  noStroke(){
    this.style.stroke=false;
  }

  strokeWeight(w:number){
    this.style.strokeWeight=w;
  }

  strokeCap(c:number){this.style.strokeCap=c;}
  strokeJoin(j:number){this.style.strokeJoin=j;}

  tint(...a:number[]){
    this.style.tint=true;
    this.style.tintColor=this.color(a);
  }

  tintF(...a:number[]){
    this.style.tint=true;
    this.style.tintColor=this.color(a,true);
  }

  noTint(){
    this.style.tint=false;
  }

  ambient(...a:number[]){this.style.ambient=this.color(a);}
  specular(...a:number[]){this.style.specular=this.color(a);}
  emissive(...a:number[]){this.style.emissive=this.color(a);}
  shininess(s:number){this.style.shininess=s;}

  bezierDetail(_d:number){}
  curveDetail(_d:number){}
  curveTightness(_t:number){}

  // --- style setters (whole shape, or one vertex) ----------------------------------------------------

  /** setFill(boolean), setFill(color) or setFill(index, color); groups pass it to their children. */
  setFill(a:boolean|number,b?:number){
    for(const c of this.children)c.setFill(a,b!);
    if(typeof a==="boolean"){
      this.style.fill=a;
      return;
    }
    if(b!==undefined){
      if(this.vertices[a])this.vertices[a].fill=b;
      return;
    }
    this.style.fill=true;
    this.style.fillColor=a;
    for(const v of this.vertices)v.fill=a;
  }

  setStroke(a:boolean|number,b?:number){
    for(const c of this.children)c.setStroke(a,b!);
    if(typeof a==="boolean"){
      this.style.stroke=a;
      return;
    }
    if(b!==undefined){
      if(this.vertices[a])this.vertices[a].stroke=b;
      return;
    }
    this.style.stroke=true;
    this.style.strokeColor=a;
    for(const v of this.vertices)v.stroke=a;
  }

  setStrokeWeight(a:number,b?:number){
    for(const c of this.children)c.setStrokeWeight(a,b);
    if(b!==undefined){
      if(this.vertices[a])this.vertices[a].weight=b;
      return;
    }
    this.style.strokeWeight=a;
    for(const v of this.vertices)v.weight=a;
  }

  setStrokeCap(c:number){
    for(const ch of this.children)ch.setStrokeCap(c);
    this.style.strokeCap=c;
  }

  setStrokeJoin(j:number){
    for(const ch of this.children)ch.setStrokeJoin(j);
    this.style.strokeJoin=j;
  }

  setTint(a:boolean|number,_b?:number){
    for(const c of this.children)c.setTint(a,_b);
    if(typeof a==="boolean")this.style.tint=a;
    else{
      this.style.tint=true;
      this.style.tintColor=a;
    }
  }

  setTexture(img:PImage){
    for(const c of this.children)c.setTexture(img);
    this.texture_=img;
  }

  setTextureMode(m:number){
    this.textureMode_=m;
  }

  setTextureUV(i:number,u:number,v:number){
    const vt=this.vertices[i];
    if(vt){vt.u=u;vt.v=v;}
  }

  setAmbient(a:number,b?:number){this.style.ambient=b??a;}
  setSpecular(a:number,b?:number){this.style.specular=b??a;}
  setEmissive(a:number,b?:number){this.style.emissive=b??a;}
  setShininess(a:number,b?:number){this.style.shininess=b??a;}

  disableStyle(){
    this.styleEnabled=false;
    for(const c of this.children)c.disableStyle();
  }

  enableStyle(){
    this.styleEnabled=true;
    for(const c of this.children)c.enableStyle();
  }

  // --- vertices ---------------------------------------------------------------------------------------

  getVertexCount(_includeChildren?:boolean){
    if(this.family===GROUP||this.family===PShape.PRIMITIVE){
      throw new exceptions.IllegalArgumentException("getVertexCount() only works with PATH or GEOMETRY shapes");
    }
    return this.vertices.length;
  }

  private vertexAt(i:number):ShapeVertex{
    const v=this.vertices[i];
    if(!v)throw new exceptions.ArrayIndexOutOfBoundsException(`Index ${i} out of bounds for length ${this.vertices.length}`);
    return v;
  }

  getVertex(i:number,target?:PVector|null){
    const v=this.vertexAt(i);
    const out=target??new PVector();
    out.set(v.x,v.y,v.z);
    return out;
  }

  getVertexX(i:number){return Math.fround(this.vertexAt(i).x);}
  getVertexY(i:number){return Math.fround(this.vertexAt(i).y);}
  getVertexZ(i:number){return Math.fround(this.vertexAt(i).z);}

  /** setVertex(i, x, y[, z]) or setVertex(i, PVector) */
  setVertex(i:number,x:number|PVector,y?:number,z?:number){
    const v=this.vertexAt(i);
    if(x instanceof PVector){
      v.x=x.x;v.y=x.y;v.z=x.z;
    }else{
      v.x=x;v.y=y!;
      if(z!==undefined)v.z=z;
    }
  }

  getVertexCode(i:number){return this.vertexAt(i).code;}
  getVertexCodes(){return Int32Array.from(this.vertices,(v)=>v.code);}
  getVertexCodeCount(){return this.vertices.length;}
  getFill(i:number){return this.vertexAt(i).fill;}
  getStroke(i:number){return this.vertexAt(i).stroke;}
  getStrokeWeight(i:number){return Math.fround(this.vertexAt(i).weight);}
  getTextureU(i:number){return Math.fround(this.vertexAt(i).u);}
  getTextureV(i:number){return Math.fround(this.vertexAt(i).v);}
  getTint(_i:number){return this.style.tintColor;}
  getAmbient(_i:number){return this.style.ambient;}
  getSpecular(_i:number){return this.style.specular;}
  getEmissive(_i:number){return this.style.emissive;}
  getShininess(_i:number){return Math.fround(this.style.shininess);}

  getNormal(i:number,target?:PVector|null){
    const v=this.vertexAt(i);
    const out=target??new PVector();
    out.set(v.nx,v.ny,v.nz);
    return out;
  }

  getNormalX(i:number){return Math.fround(this.vertexAt(i).nx);}
  getNormalY(i:number){return Math.fround(this.vertexAt(i).ny);}
  getNormalZ(i:number){return Math.fround(this.vertexAt(i).nz);}

  setNormal(i:number,x:number,y:number,z:number){
    const v=this.vertexAt(i);
    v.nx=x;v.ny=y;v.nz=z;
  }

  /** setPath(count, float[][]): replace the vertices. */
  setPath(n:number,coords:ArrayLike<ArrayLike<number>>){
    this.vertices=[];
    for(let i=0;i<n;i++){
      const c=coords[i];
      this.add(c[0],c[1],c.length>2?c[2]:0,0,0);
    }
  }

  // --- children ---------------------------------------------------------------------------------------

  addChild(c:PShape,index?:number){
    c.parent=this;
    if(index===undefined)this.children.push(c);
    else this.children.splice(index,0,c);
    if(c.name)this.named.set(c.name,c);
  }

  addName(name:string,c:PShape){
    this.named.set(name,c);
  }

  removeChild(i:number){
    const [c]=this.children.splice(i,1);
    if(c?.name)this.named.delete(c.name);
  }

  getChildCount(){return this.children.length;}

  getChildren(){return [...this.children];}

  getChild(i:number|string):PShape|null{
    if(typeof i==="string")return this.named.get(i)??this.findChild(i);
    return this.children[i]??null;
  }

  getChildIndex(c:PShape){return this.children.indexOf(c);}

  findChild(name:string):PShape|null{
    if(this.name===name)return this;
    for(const c of this.children){
      const f=c.findChild(name);
      if(f)return f;
    }
    return null;
  }

  getParent(){return this.parent;}
  getName(){return this.name;}
  setName(n:string){this.name=n;}
  getFamily(){return this.family;}
  setFamily(f:number){this.family=f;}
  getKind(){return this.kind;}
  setKind(k:number){this.kind=k;}
  getParams(target?:Float32Array|number[]|null){
    const out=target&&target.length>=this.params.length?target:new Float32Array(this.params.length);
    this.params.forEach((p,i)=>{out[i]=p;});
    return out;
  }
  getParam(i:number){return Math.fround(this.params[i]);}
  isVisible(){return this.visible;}
  setVisible(v:boolean){this.visible=v;}
  isClosed(){return this.closed;}
  is2D(){return !this.is3D_;}
  is3D(){return this.is3D_;}
  set3D(v:boolean){this.is3D_=v;}

  /** Width of the shape: its explicit size, else the extent of its vertices (children included). */
  getWidth(){
    if(this.width)return Math.fround(this.width);
    const b=this.bounds();
    return Math.fround(b?b[2]-b[0]:0);
  }

  getHeight(){
    if(this.height)return Math.fround(this.height);
    const b=this.bounds();
    return Math.fround(b?b[3]-b[1]:0);
  }

  getDepth(){return Math.fround(this.depth);}

  private bounds():[number,number,number,number]|null{
    let x0=Infinity,y0=Infinity,x1=-Infinity,y1=-Infinity;
    const visit=(s:PShape)=>{
      for(const v of s.vertices){
        x0=Math.min(x0,v.x);y0=Math.min(y0,v.y);x1=Math.max(x1,v.x);y1=Math.max(y1,v.y);
      }
      s.children.forEach(visit);
    };
    visit(this);
    return x0<=x1?[x0,y0,x1,y1]:null;
  }

  /** Whether (x, y) is inside the outline (even-odd), for PATH/GEOMETRY shapes. */
  contains(x:number,y:number){
    const v=this.vertices;
    let inside=false;
    for(let i=0,j=v.length-1;i<v.length;j=i++){
      if((v[i].y>y)!==(v[j].y>y)&&x<(v[j].x-v[i].x)*(y-v[i].y)/(v[j].y-v[i].y)+v[i].x)inside=!inside;
    }
    return inside;
  }

  // --- transformation ---------------------------------------------------------------------------------

  private m():PMatrix3D{
    return this.matrix??=new PMatrix3D();
  }

  private transform(fn:(m:PMatrix3D)=>void){
    if(this.preApplies){
      const n=new PMatrix3D();
      fn(n);
      this.m().preApply(n);
    }else fn(this.m());
  }

  translate(x:number,y:number,z?:number){this.transform((m)=>m.translate(x,y,z??0));}
  rotate(a:number,x?:number,y?:number,z?:number){
    this.transform((m)=>{
      if(x===undefined)m.rotateZ(a);
      else m.rotate(a,x,y,z);
    });
  }
  rotateX(a:number){this.transform((m)=>m.rotateX(a));}
  rotateY(a:number){this.transform((m)=>m.rotateY(a));}
  rotateZ(a:number){this.transform((m)=>m.rotateZ(a));}
  scale(x:number,y?:number,z?:number){
    this.transform((m)=>{
      if(y===undefined)m.scale(x,x,x);
      else m.scale(x,y,z??1);
    });
  }
  resetMatrix(){this.matrix=null;}
  applyMatrix(...a:any[]){
    this.transform((m)=>m.apply(...a));
  }

  // --- drawing ----------------------------------------------------------------------------------------

  /** Draw the shape with a renderer (shape() calls this). */
  draw(g:PGraphics){
    if(!this.visible)return;
    g.pushMatrix();
    if(this.matrix){
      if(g.is3D()||!this.matrix.isIdentity())(g.applyMatrix as (...a:number[])=>void)(...matrixArgs(this.matrix,g.is3D()));
    }
    if(this.styleEnabled){
      g.pushStyle();
      this.applyStyle(g);
    }
    if(this.customDraw)this.customDraw(g);
    else if(this.family===GROUP)for(const c of this.children)c.draw(g);
    else if(this.family===PShape.PRIMITIVE)this.drawPrimitive(g);
    else this.drawGeometry(g);
    if(this.styleEnabled)g.popStyle();
    g.popMatrix();
  }

  private applyStyle(g:PGraphics){
    const s=this.style,gs=g.style;
    gs.fill=s.fill;gs.fillColor=s.fillColor;
    gs.stroke=s.stroke;gs.strokeColor=s.strokeColor;gs.strokeWeight=s.strokeWeight;
    gs.strokeCap=s.strokeCap;gs.strokeJoin=s.strokeJoin;
    gs.tint=s.tint;gs.tintColor=s.tintColor;
    gs.setAmbient=true;gs.ambientColor=s.ambient;gs.specularColor=s.specular;gs.emissiveColor=s.emissive;gs.shininess=s.shininess;
  }

  private drawPrimitive(g:PGraphics){
    const p=this.params;
    switch(this.kind){
      case POINT:
        if(p.length>=3)(g.point as (...a:number[])=>void)(p[0],p[1],p[2]);
        else g.point(p[0],p[1]);
        break;
      case LINE:
        (g.line as (...a:number[])=>void)(...p);
        break;
      case TRIANGLE:g.triangle(p[0],p[1],p[2],p[3],p[4],p[5]);break;
      case QUAD:g.quad(p[0],p[1],p[2],p[3],p[4],p[5],p[6],p[7]);break;
      case RECT:(g.rect as (...a:number[])=>void)(...p);break;
      case ELLIPSE:g.ellipse(p[0],p[1],p[2],p[3]);break;
      case ARC:g.arc(p[0],p[1],p[2],p[3],p[4],p[5],p[6]??0);break;
      case BOX:g.box(p[0],p[1],p[2]);break;
      case SPHERE:g.sphere(p[0]);break;
    }
  }

  private drawGeometry(g:PGraphics){
    if(!this.vertices.length)return;
    const gs=g.style;
    const styled=this.styleEnabled;
    g.beginShape(this.kind||POLYGON);
    if(this.texture_){
      g.textureMode(this.textureMode_);
      g.texture(this.texture_);
    }
    for(const v of this.vertices){
      if(v.brk)g.beginContour();
      if(styled){
        gs.fillColor=v.fill;
        gs.strokeColor=v.stroke;
        gs.strokeWeight=v.weight;
      }
      if(this.hasNormals)g.normal(v.nx,v.ny,v.nz);
      switch(v.code){
        case 1:
          if(this.is3D_)(g.bezierVertex as (...a:number[])=>void)(...v.c!,v.x,v.y,v.z);
          else g.bezierVertex(v.c![0],v.c![1],v.c![3],v.c![4],v.x,v.y);
          break;
        case 2:
          if(this.is3D_)(g.quadraticVertex as (...a:number[])=>void)(...v.c!,v.x,v.y,v.z);
          else g.quadraticVertex(v.c![0],v.c![1],v.x,v.y);
          break;
        case 3:
          if(this.is3D_)(g.curveVertex as (...a:number[])=>void)(v.x,v.y,v.z);
          else g.curveVertex(v.x,v.y);
          break;
        default:
          if(this.texture_){
            if(this.is3D_)(g.vertex as (...a:number[])=>void)(v.x,v.y,v.z,v.u,v.v);
            else (g.vertex as (...a:number[])=>void)(v.x,v.y,v.u,v.v);
          }else if(this.is3D_)(g.vertex as (...a:number[])=>void)(v.x,v.y,v.z);
          else g.vertex(v.x,v.y);
      }
    }
    // contours close themselves; a following beginContour() ends the previous one
    g.endShape(this.closed?CLOSE:0);
  }

  getTessellation():PShape{
    return this;
  }

  beginTessellation(){}
  endTessellation(){}
}

/** applyMatrix() arguments for a renderer: 16 values in 3D, the 2D part (6) otherwise. */
function matrixArgs(m:PMatrix3D,threeD:boolean):number[]{
  if(threeD)return m.get(null) as unknown as number[];
  return [m.m00,m.m01,m.m03,m.m10,m.m11,m.m13];
}

/**
 * shape(s[, x, y[, c, d]]) as Processing places it: shapeMode CORNER moves the shape to (x, y) and
 * scales it to c × d, CENTER centers it there, CORNERS takes (c, d) as the opposite corner.
 */
export function drawShape(g:PGraphics,s:PShape,x?:number,y?:number,c?:number,d?:number){
  if(!s.isVisible())return;
  if(x===undefined){
    s.draw(g);
    return;
  }
  g.pushMatrix();
  const mode=g.style.shapeMode;
  const w=s.getWidth(),h=s.getHeight();
  if(c===undefined||d===undefined){
    if(mode===CENTER)g.translate(x-w/2,y!-h/2);
    else g.translate(x,y!);
  }else{
    if(mode===CENTER){
      g.translate(x-c/2,y!-d/2);
    }else if(mode===CORNERS){
      c-=x;d-=y!;
      g.translate(x,y!);
    }else g.translate(x,y!);
    if(w!==0&&h!==0)g.scale(c/w,d/h);
  }
  s.draw(g);
  g.popMatrix();
  void CORNER;
}

export { PMatrix2D };
