import { PImage } from "./PImage";
import { PMatrix2D } from "./PMatrix2D";
import { PFont } from "./PFont";
import type { PApplet } from "./PApplet";
import { exceptions } from "../../runtime/lang/index.ts";

// Processing's constant values (PConstants).
const CORNER=0,CORNERS=1,RADIUS=2,CENTER=3;
const RGB=1,HSB=3;
const ROUND=2,SQUARE=1,PROJECT=4,MITER=8;
const POINTS=3,LINES=5,TRIANGLES=9,TRIANGLE_STRIP=10,TRIANGLE_FAN=11,QUADS=17,QUAD_STRIP=18,POLYGON=20;
const CLOSE=2;
const OPEN=1,CHORD=2,PIE=3;
const LEFT=37,RIGHT=39,TOP=101,BOTTOM=102,BASELINE=0;
const BLEND=1;
const TWO_PI=Math.PI*2;

/** Path commands, flat: [op, ...args]. The renderer turns them into its own geometry. */
export const enumPath={MOVE:0,LINE:1,QUAD:2,CUBIC:3,ELLIPSE:4,CLOSE:5} as const;
export type Path=number[];

/** Drawing state saved by pushStyle()/push(). */
export class PStyle{
  fill=true;
  fillColor=-1; // white
  stroke=true;
  strokeColor=0xff000000|0;
  strokeWeight=1;
  strokeCap=ROUND;
  strokeJoin=MITER;
  tint=false;
  tintColor=-1;
  rectMode=CORNER;
  ellipseMode=CENTER;
  imageMode=CORNER;
  shapeMode=CORNER;
  colorMode=RGB;
  colorModeX=255;
  colorModeY=255;
  colorModeZ=255;
  colorModeA=255;
  textFont:PFont|null=null;
  textSize=12;
  textLeading=14;
  textAlign=LEFT;
  textAlignY=BASELINE;
  blendMode=BLEND;

  copy():PStyle{
    return Object.assign(new PStyle(),this);
  }
}

type ShapeVertex={x:number,y:number,kind:"v"|"b"|"q"|"c",c?:number[]};

/**
 * Processing's PGraphics, independent of the drawing technology: the style and matrix stacks,
 * colorMode-aware color calculation, the shape functions (as paths), beginShape()/endShape() with
 * curves and contours, image and text layout. A renderer (PGraphicsJava2D: Canvas 2D) implements the
 * protected hooks at the end of the class.
 */
export abstract class PGraphics extends PImage{
  declare parent:PApplet;
  style=new PStyle();
  matrix=new PMatrix2D();
  private styleStack:PStyle[]=[];
  private matrixStack:PMatrix2D[]=[];
  /** The sketch window (as opposed to createGraphics()). */
  primary=false;

  private shapeKind=-1;
  private shapeVertices:ShapeVertex[]=[];
  private contours:ShapeVertex[][]=[];
  private inContour=false;
  private curveTightness_=0;

  constructor(parent:PApplet){
    super(parent);
  }

  // --- surface -------------------------------------------------------------------------------------

  /** Allocate the drawing surface (renderer-specific). */
  abstract setSize(width:number,height:number,density?:number):void;

  beginDraw(){
    this.resetMatrix();
  }

  endDraw(){}

  /** Per frame (main surface): Processing resets the matrix before each draw(). */
  __begin__(){
    this.resetMatrix();
  }

  __end__(){
    return 0;
  }

  __stop__(){}

  /** Kept for the runner: the drawing resolution is fixed by pixelDensity(). */
  updateResolution(_r:number){}

  // --- color ----------------------------------------------------------------------------------------

  colorMode(mode:number,x?:number,y?:number,z?:number,a?:number){
    const s=this.style;
    s.colorMode=mode;
    if(x!==undefined){
      if(y===undefined){
        s.colorModeX=s.colorModeY=s.colorModeZ=s.colorModeA=x;
      }else{
        s.colorModeX=x;s.colorModeY=y!;s.colorModeZ=z!;
        if(a!==undefined)s.colorModeA=a;
      }
    }
  }

  /**
   * Color of fill()/stroke()/background()/color() arguments as an ARGB int. One value is a gray level,
   * or an ARGB color when it is an int with alpha bits or beyond the gray range (fill(#FF0000)).
   */
  colorCalc(args:ArrayLike<number>):number{
    const s=this.style;
    const clamp=(v:number)=>(v<0?0:v>1?1:v);
    let r:number,g:number,b:number,a:number;
    const n=args.length;
    if(n<=2){
      const x=args[0];
      if(Number.isInteger(x)&&((x&0xff000000)!==0||x>s.colorModeX||x<0)){
        // an ARGB int; the second argument overrides its alpha
        if(n===1)return x|0;
        const alpha=Math.trunc(clamp(args[1]/s.colorModeA)*255);
        return ((alpha<<24)|(x&0xffffff))|0;
      }
      r=g=b=clamp(x/s.colorModeX);
      a=n===2?clamp(args[1]/s.colorModeA):1;
    }else{
      const x=clamp(args[0]/s.colorModeX),y=clamp(args[1]/s.colorModeY),z=clamp(args[2]/s.colorModeZ);
      a=n>=4?clamp(args[3]/s.colorModeA):1;
      if(s.colorMode===HSB){
        [r,g,b]=hsbToRgb(x,y,z);
      }else{
        r=x;g=y;b=z;
      }
    }
    return ((Math.trunc(a*255)<<24)|(Math.trunc(r*255)<<16)|(Math.trunc(g*255)<<8)|Math.trunc(b*255))|0;
  }

  color(...args:number[]):number{
    return this.colorCalc(args);
  }

  red(c:number){
    const v=(c>>16)&0xff;
    return Math.fround(this.style.colorModeX===255?v:v/255*this.style.colorModeX);
  }

  green(c:number){
    const v=(c>>8)&0xff;
    return Math.fround(this.style.colorModeY===255?v:v/255*this.style.colorModeY);
  }

  blue(c:number){
    const v=c&0xff;
    return Math.fround(this.style.colorModeZ===255?v:v/255*this.style.colorModeZ);
  }

  alpha(c:number){
    const v=c>>>24;
    return Math.fround(this.style.colorModeA===255?v:v/255*this.style.colorModeA);
  }

  hue(c:number){
    return Math.fround(rgbToHsb(c)[0]*this.style.colorModeX);
  }

  saturation(c:number){
    return Math.fround(rgbToHsb(c)[1]*this.style.colorModeY);
  }

  brightness(c:number){
    return Math.fround(rgbToHsb(c)[2]*this.style.colorModeZ);
  }

  lerpColor(c1:number,c2:number,amt:number){
    amt=amt<0?0:amt>1?1:amt;
    const l=(a:number,b:number)=>Math.round(a+(b-a)*amt);
    if(this.style.colorMode===HSB){
      const h1=rgbToHsb(c1),h2=rgbToHsb(c2);
      let dh=h2[0]-h1[0];
      if(dh>0.5)dh-=1;else if(dh<-0.5)dh+=1;
      const h=(h1[0]+dh*amt+1)%1;
      const [r,g,b]=hsbToRgb(h,h1[1]+(h2[1]-h1[1])*amt,h1[2]+(h2[2]-h1[2])*amt);
      return ((l(c1>>>24,c2>>>24)<<24)|(Math.trunc(r*255)<<16)|(Math.trunc(g*255)<<8)|Math.trunc(b*255))|0;
    }
    return ((l(c1>>>24,c2>>>24)<<24)|(l((c1>>16)&0xff,(c2>>16)&0xff)<<16)|(l((c1>>8)&0xff,(c2>>8)&0xff)<<8)|l(c1&0xff,c2&0xff))|0;
  }

  fill(...args:number[]){
    this.style.fill=true;
    this.style.fillColor=this.colorCalc(args);
  }

  noFill(){
    this.style.fill=false;
  }

  stroke(...args:number[]){
    this.style.stroke=true;
    this.style.strokeColor=this.colorCalc(args);
  }

  noStroke(){
    this.style.stroke=false;
  }

  tint(...args:number[]){
    this.style.tint=true;
    this.style.tintColor=this.colorCalc(args);
  }

  noTint(){
    this.style.tint=false;
  }

  strokeWeight(w:number){
    this.style.strokeWeight=w;
  }

  strokeCap(cap:number){
    this.style.strokeCap=cap;
  }

  strokeJoin(join:number){
    this.style.strokeJoin=join;
  }

  rectMode(m:number){
    this.style.rectMode=m;
  }

  ellipseMode(m:number){
    this.style.ellipseMode=m;
  }

  imageMode(m:number){
    this.style.imageMode=m;
  }

  shapeMode(m:number){
    this.style.shapeMode=m;
  }

  blendMode(m:number){
    this.style.blendMode=m;
    this.applyBlendMode(m);
  }

  /** background(gray[, alpha]), background(r, g, b[, a]), background(argb[, alpha]), background(image) */
  background(...args:(number|PImage)[]){
    if(args[0] instanceof PImage){
      const img=args[0];
      if(img.width!==this.width||img.height!==this.height){
        throw new exceptions.RuntimeException("background image must be the same size as your application");
      }
      this.backgroundImage(img);
      return;
    }
    this.backgroundImpl(this.colorCalc(args as number[]));
  }

  clear(){
    this.backgroundImpl(0,true);
  }

  // --- style and matrix stacks ------------------------------------------------------------------------

  pushStyle(){
    this.styleStack.push(this.style.copy());
  }

  popStyle(){
    const s=this.styleStack.pop();
    if(!s)throw new exceptions.RuntimeException("Too many popStyle() without enough pushStyle()");
    this.style=s;
    this.applyBlendMode(s.blendMode);
  }

  pushMatrix(){
    if(this.matrixStack.length>=32)throw new exceptions.RuntimeException("Too many calls to pushMatrix().");
    this.matrixStack.push(this.matrix.get() as PMatrix2D);
  }

  popMatrix(){
    const m=this.matrixStack.pop();
    if(!m)throw new exceptions.RuntimeException("Too many calls to popMatrix(), and not enough to pushMatrix().");
    this.matrix=m;
    this.applyMatrixToRenderer();
  }

  push(){
    this.pushMatrix();
    this.pushStyle();
  }

  pop(){
    this.popStyle();
    this.popMatrix();
  }

  translate(x:number,y:number){
    this.matrix.translate(x,y);
    this.applyMatrixToRenderer();
  }

  rotate(angle:number){
    this.matrix.rotate(angle);
    this.applyMatrixToRenderer();
  }

  scale(x:number,y:number=x){
    this.matrix.scale(x,y);
    this.applyMatrixToRenderer();
  }

  shearX(angle:number){
    this.matrix.shearX(angle);
    this.applyMatrixToRenderer();
  }

  shearY(angle:number){
    this.matrix.shearY(angle);
    this.applyMatrixToRenderer();
  }

  /** applyMatrix(PMatrix2D) or applyMatrix(n00, n01, n02, n10, n11, n12) */
  applyMatrix(n00:number|PMatrix2D,n01?:number,n02?:number,n10?:number,n11?:number,n12?:number){
    this.matrix.apply(n00 as number,n01,n02,n10,n11,n12);
    this.applyMatrixToRenderer();
  }

  resetMatrix(){
    this.matrix.reset();
    this.applyMatrixToRenderer();
  }

  getMatrix(target?:PMatrix2D){
    if(target){
      target.set(this.matrix);
      return target;
    }
    return this.matrix.get() as PMatrix2D;
  }

  setMatrix(m:PMatrix2D){
    this.matrix.set(m);
    this.applyMatrixToRenderer();
  }

  screenX(x:number,y:number){
    return Math.fround(this.matrix.multX(x,y));
  }

  screenY(x:number,y:number){
    return Math.fround(this.matrix.multY(x,y));
  }

  // --- shapes ---------------------------------------------------------------------------------------

  point(x:number,y:number){
    if(this.style.stroke)this.drawPoint(x,y);
  }

  line(x1:number,y1:number,x2:number,y2:number){
    if(!this.style.stroke)return;
    this.drawPath([enumPath.MOVE,x1,y1,enumPath.LINE,x2,y2],false,true);
  }

  triangle(x1:number,y1:number,x2:number,y2:number,x3:number,y3:number){
    this.drawPolygon([x1,y1,x2,y2,x3,y3]);
  }

  quad(x1:number,y1:number,x2:number,y2:number,x3:number,y3:number,x4:number,y4:number){
    this.drawPolygon([x1,y1,x2,y2,x3,y3,x4,y4]);
  }

  /** rect(a, b, c, d[, r] or [, tl, tr, br, bl]) in rectMode */
  rect(a:number,b:number,c:number,d:number,tl?:number,tr?:number,br?:number,bl?:number){
    let [x1,y1,x2,y2]=this.modeToCorners(this.style.rectMode,a,b,c,d);
    if(x1>x2)[x1,x2]=[x2,x1];
    if(y1>y2)[y1,y2]=[y2,y1];
    if(tl===undefined){
      this.drawPolygon([x1,y1,x2,y1,x2,y2,x1,y2]);
      return;
    }
    if(tr===undefined)tr=br=bl=tl;
    const max=Math.min(x2-x1,y2-y1)/2;
    const r=(v:number|undefined)=>Math.min(Math.max(v??0,0),max);
    const [rtl,rtr,rbr,rbl]=[r(tl),r(tr),r(br),r(bl)];
    const P=enumPath;
    const p:Path=[P.MOVE,x1+rtl,y1];
    if(rtr)p.push(P.LINE,x2-rtr,y1,P.QUAD,x2,y1,x2,y1+rtr);else p.push(P.LINE,x2,y1);
    if(rbr)p.push(P.LINE,x2,y2-rbr,P.QUAD,x2,y2,x2-rbr,y2);else p.push(P.LINE,x2,y2);
    if(rbl)p.push(P.LINE,x1+rbl,y2,P.QUAD,x1,y2,x1,y2-rbl);else p.push(P.LINE,x1,y2);
    if(rtl)p.push(P.LINE,x1,y1+rtl,P.QUAD,x1,y1,x1+rtl,y1);else p.push(P.LINE,x1,y1);
    p.push(P.CLOSE);
    this.drawPath(p,this.style.fill,this.style.stroke);
  }

  square(x:number,y:number,s:number){
    this.rect(x,y,s,s);
  }

  ellipse(a:number,b:number,c:number,d:number){
    let [x1,y1,x2,y2]=this.modeToCorners(this.style.ellipseMode,a,b,c,d);
    if(x1>x2)[x1,x2]=[x2,x1];
    if(y1>y2)[y1,y2]=[y2,y1];
    const rx=(x2-x1)/2,ry=(y2-y1)/2;
    this.drawPath([enumPath.ELLIPSE,x1+rx,y1+ry,rx,ry,0,TWO_PI,enumPath.CLOSE],this.style.fill,this.style.stroke);
  }

  circle(x:number,y:number,d:number){
    this.ellipse(x,y,d,d);
  }

  /** arc(a, b, c, d, start, stop[, mode]): fill as a pie and stroke open by default; OPEN, CHORD, PIE */
  arc(a:number,b:number,c:number,d:number,start:number,stop:number,mode=0){
    let [x1,y1,x2,y2]=this.modeToCorners(this.style.ellipseMode,a,b,c,d);
    if(x1>x2)[x1,x2]=[x2,x1];
    if(y1>y2)[y1,y2]=[y2,y1];
    if(!Number.isFinite(start)||!Number.isFinite(stop)||stop<start)return;
    while(start<0){
      start+=TWO_PI;
      stop+=TWO_PI;
    }
    if(stop-start>TWO_PI){
      start=0;
      stop=TWO_PI;
    }
    const rx=(x2-x1)/2,ry=(y2-y1)/2,cx=x1+rx,cy=y1+ry;
    const P=enumPath;
    const open:Path=[P.ELLIPSE,cx,cy,rx,ry,start,stop];
    const chord:Path=[...open,P.CLOSE];
    const pie:Path=[P.MOVE,cx,cy,...open,P.CLOSE];
    const fillPath=mode===0||mode===PIE?pie:chord;
    const strokePath=mode===0||mode===OPEN?open:mode===CHORD?chord:pie;
    if(this.style.fill)this.drawPath(fillPath,true,false);
    if(this.style.stroke)this.drawPath(strokePath,false,true);
  }

  bezier(x1:number,y1:number,x2:number,y2:number,x3:number,y3:number,x4:number,y4:number){
    this.drawPath([enumPath.MOVE,x1,y1,enumPath.CUBIC,x2,y2,x3,y3,x4,y4],this.style.fill,this.style.stroke);
  }

  curve(x1:number,y1:number,x2:number,y2:number,x3:number,y3:number,x4:number,y4:number){
    const c=this.curveToBezier([x1,y1],[x2,y2],[x3,y3],[x4,y4]);
    this.drawPath([enumPath.MOVE,x2,y2,enumPath.CUBIC,...c,x3,y3],this.style.fill,this.style.stroke);
  }

  curveTightness(t:number){
    this.curveTightness_=t;
  }

  bezierDetail(_d:number){}

  curveDetail(_d:number){}

  bezierPoint(a:number,b:number,c:number,d:number,t:number){
    const t1=1-t;
    return Math.fround(a*t1*t1*t1+3*b*t*t1*t1+3*c*t*t*t1+d*t*t*t);
  }

  bezierTangent(a:number,b:number,c:number,d:number,t:number){
    return Math.fround(3*t*t*(-a+3*b-3*c+d)+6*t*(a-2*b+c)+3*(-a+b));
  }

  /** Catmull-Rom (with curveTightness) value between b and c. */
  curvePoint(a:number,b:number,c:number,d:number,t:number){
    const [c1,c2]=this.curveControls(a,b,c,d);
    return this.bezierPoint(b,c1,c2,c,t);
  }

  curveTangent(a:number,b:number,c:number,d:number,t:number){
    const [c1,c2]=this.curveControls(a,b,c,d);
    return this.bezierTangent(b,c1,c2,c,t);
  }

  private curveControls(a:number,b:number,c:number,d:number):[number,number]{
    const k=(1-this.curveTightness_)/6;
    return [b+(c-a)*k,c-(d-b)*k];
  }

  /** Bezier control points of the curve segment from p1 to p2. */
  private curveToBezier(p0:number[],p1:number[],p2:number[],p3:number[]):number[]{
    const k=(1-this.curveTightness_)/6;
    return [p1[0]+(p2[0]-p0[0])*k,p1[1]+(p2[1]-p0[1])*k,p2[0]-(p3[0]-p1[0])*k,p2[1]-(p3[1]-p1[1])*k];
  }

  beginShape(kind=POLYGON){
    this.shapeKind=kind;
    this.shapeVertices=[];
    this.contours=[];
    this.inContour=false;
  }

  vertex(x:number,y:number){
    this.target().push({x,y,kind:"v"});
  }

  bezierVertex(x2:number,y2:number,x3:number,y3:number,x4:number,y4:number){
    this.target().push({x:x4,y:y4,kind:"b",c:[x2,y2,x3,y3]});
  }

  quadraticVertex(cx:number,cy:number,x3:number,y3:number){
    this.target().push({x:x3,y:y3,kind:"q",c:[cx,cy]});
  }

  curveVertex(x:number,y:number){
    this.target().push({x,y,kind:"c"});
  }

  beginContour(){
    this.contours.push([]);
    this.inContour=true;
  }

  endContour(){
    this.inContour=false;
  }

  private target():ShapeVertex[]{
    return this.inContour&&this.contours.length?this.contours[this.contours.length-1]:this.shapeVertices;
  }

  endShape(mode=0){
    const v=this.shapeVertices;
    const kind=this.shapeKind;
    this.shapeKind=-1;
    const s=this.style;
    const xy=(i:number)=>[v[i].x,v[i].y];
    switch(kind){
      case POINTS:
        for(const p of v)this.point(p.x,p.y);
        return;
      case LINES:
        for(let i=0;i+1<v.length;i+=2)this.line(v[i].x,v[i].y,v[i+1].x,v[i+1].y);
        return;
      case TRIANGLES:
        for(let i=0;i+2<v.length;i+=3)this.drawPolygon([...xy(i),...xy(i+1),...xy(i+2)]);
        return;
      case TRIANGLE_STRIP:
        for(let i=0;i+2<v.length;i++)this.drawPolygon([...xy(i),...xy(i+1),...xy(i+2)]);
        return;
      case TRIANGLE_FAN:
        for(let i=1;i+1<v.length;i++)this.drawPolygon([...xy(0),...xy(i),...xy(i+1)]);
        return;
      case QUADS:
        for(let i=0;i+3<v.length;i+=4)this.drawPolygon([...xy(i),...xy(i+1),...xy(i+2),...xy(i+3)]);
        return;
      case QUAD_STRIP:
        for(let i=0;i+3<v.length;i+=2)this.drawPolygon([...xy(i),...xy(i+1),...xy(i+3),...xy(i+2)]);
        return;
    }
    // POLYGON (and the other kinds of P2D/P3D): one path, curves included; contours are holes.
    if(!v.length)return;
    const outline=this.shapePath(v);
    const holes=this.contours.flatMap((c)=>(c.length?[...this.shapePath(c),enumPath.CLOSE]:[]));
    if(s.fill)this.drawPath([...outline,enumPath.CLOSE,...holes],true,false);
    if(s.stroke)this.drawPath(mode===CLOSE?[...outline,enumPath.CLOSE,...holes]:[...outline,...holes],false,true);
  }

  /** Path of a vertex list with bezier/quadratic/curve vertices. */
  private shapePath(v:ShapeVertex[]):Path{
    const P=enumPath;
    const p:Path=[];
    const curve:number[][]=[];
    for(const q of v){
      if(q.kind==="c"){
        curve.push([q.x,q.y]);
        const n=curve.length;
        if(n>=4){
          if(!p.length)p.push(P.MOVE,curve[n-3][0],curve[n-3][1]);
          p.push(P.CUBIC,...this.curveToBezier(curve[n-4],curve[n-3],curve[n-2],curve[n-1]),curve[n-2][0],curve[n-2][1]);
        }
        continue;
      }
      curve.length=0;
      if(!p.length||q.kind==="v")p.push(p.length?P.LINE:P.MOVE,q.x,q.y);
      else if(q.kind==="b")p.push(P.CUBIC,...q.c!,q.x,q.y);
      else p.push(P.QUAD,...q.c!,q.x,q.y);
    }
    return p;
  }

  private drawPolygon(xy:number[]){
    const P=enumPath;
    const p:Path=[P.MOVE,xy[0],xy[1]];
    for(let i=2;i<xy.length;i+=2)p.push(P.LINE,xy[i],xy[i+1]);
    p.push(P.CLOSE);
    this.drawPath(p,this.style.fill,this.style.stroke);
  }

  /** rectMode/ellipseMode arguments → corners (x1, y1, x2, y2). */
  private modeToCorners(mode:number,a:number,b:number,c:number,d:number):[number,number,number,number]{
    switch(mode){
      case CORNERS:return [a,b,c,d];
      case RADIUS:return [a-c,b-d,a+c,b+d];
      case CENTER:return [a-c/2,b-d/2,a+c/2,b+d/2];
      default:return [a,b,a+c,b+d]; // CORNER
    }
  }

  // --- images ---------------------------------------------------------------------------------------

  /** image(img, a, b[, c, d][, u1, v1, u2, v2]) in imageMode */
  image(img:PImage,a:number,b:number,c?:number,d?:number,u1?:number,v1?:number,u2?:number,v2?:number){
    if(!img||!img.__native__()||img.width<=0)return;
    if(c===undefined||d===undefined){
      c=img.width;
      d=img.height;
      if(this.style.imageMode===CORNERS){
        c+=a;
        d+=b;
      }
    }
    const [x1,y1,x2,y2]=this.style.imageMode===CORNERS?[a,b,c,d]:this.style.imageMode===CENTER?[a-c/2,b-d/2,a+c/2,b+d/2]:[a,b,a+c,b+d];
    if(u1===undefined){
      u1=0;v1=0;u2=img.width;v2=img.height;
    }
    this.drawImage(img,x1,y1,x2,y2,u1,v1!,u2!,v2!);
  }

  // --- text -----------------------------------------------------------------------------------------

  textFont(font:PFont,size?:number){
    this.style.textFont=font;
    this.textSize(size??font.size);
  }

  textSize(size:number){
    this.style.textSize=size;
    this.style.textLeading=(this.textAscent()+this.textDescent())*1.275;
  }

  textLeading(leading:number){
    this.style.textLeading=leading;
  }

  textAlign(alignX:number,alignY=BASELINE){
    this.style.textAlign=alignX;
    this.style.textAlignY=alignY;
  }

  textMode(_mode:number){}

  textWidth(str:string|number):number{
    const s=typeof str==="number"?String.fromCharCode(str):str;
    return Math.fround(Math.max(0,...s.split("\n").map((l)=>this.textWidthImpl(l))));
  }

  textAscent(){
    return Math.fround(this.textAscentImpl());
  }

  textDescent(){
    return Math.fround(this.textDescentImpl());
  }

  /** text(str, x, y) or text(str, x1, y1, x2, y2) (wrapped in a box). Numbers arrive as strings. */
  text(str:string|number,x:number,y:number,c?:number,d?:number){
    const s=this.style;
    const text=typeof str==="number"?String(str):str;
    if(c!==undefined&&d!==undefined){
      this.textBox(text,x,y,c,d);
      return;
    }
    const lines=text.split("\n");
    const ascent=this.textAscent(),descent=this.textDescent();
    // vertical alignment of the first line; BASELINE draws the first line at y
    if(s.textAlignY===TOP)y+=ascent;
    else if(s.textAlignY===CENTER)y+=(ascent-descent)/2-(lines.length-1)*s.textLeading/2;
    else if(s.textAlignY===BOTTOM)y-=descent+(lines.length-1)*s.textLeading;
    for(const line of lines){
      this.textLine(line,x,y);
      y+=s.textLeading;
    }
  }

  private textLine(line:string,x:number,y:number){
    const a=this.style.textAlign;
    if(a===CENTER)x-=this.textWidthImpl(line)/2;
    else if(a===RIGHT)x-=this.textWidthImpl(line);
    this.drawTextLine(line,x,y);
  }

  /** text in a box: words wrapped to the width; lines below the box are not drawn. */
  private textBox(text:string,a:number,b:number,c:number,d:number){
    const s=this.style;
    const [x1,y1,x2,y2]=this.modeToCorners(s.rectMode===CORNERS?CORNERS:s.rectMode===CENTER?CENTER:CORNER,a,b,c,d);
    const w=x2-x1;
    const lines:string[]=[];
    for(const para of text.split("\n")){
      let line="";
      for(const word of para.split(" ")){
        const t=line?line+" "+word:word;
        if(line&&this.textWidthImpl(t)>w){
          lines.push(line);
          line=word;
        }else line=t;
      }
      lines.push(line);
    }
    const ascent=this.textAscent(),descent=this.textDescent();
    const lead=s.textLeading;
    let y=y1+ascent;
    const total=ascent+descent+lead*(lines.length-1);
    if(s.textAlignY===CENTER)y=y1+(y2-y1-total)/2+ascent;
    else if(s.textAlignY===BOTTOM)y=y2-total+ascent;
    const ax=s.textAlign===CENTER?x1+w/2:s.textAlign===RIGHT?x2:x1;
    for(const line of lines){
      if(y+descent>y2+0.5&&s.textAlignY!==BOTTOM)break;
      this.textLine(line,ax,y);
      y+=lead;
    }
  }

  // --- renderer hooks -------------------------------------------------------------------------------

  /** Fill and/or stroke a path with the current style and matrix. */
  protected abstract drawPath(path:Path,fill:boolean,stroke:boolean):void;
  /** A point in the stroke color, its size and shape from strokeWeight and strokeCap. */
  protected abstract drawPoint(x:number,y:number):void;
  /** Fill the whole surface (ignoring the matrix); `clear` makes it transparent. */
  protected abstract backgroundImpl(argb:number,clear?:boolean):void;
  protected abstract backgroundImage(img:PImage):void;
  /** Draw the region (u1, v1)-(u2, v2) of the image into (x1, y1)-(x2, y2), tinted. */
  protected abstract drawImage(img:PImage,x1:number,y1:number,x2:number,y2:number,u1:number,v1:number,u2:number,v2:number):void;
  protected abstract drawTextLine(line:string,x:number,y:number):void;
  protected abstract textWidthImpl(line:string):number;
  protected abstract textAscentImpl():number;
  protected abstract textDescentImpl():number;
  protected abstract applyMatrixToRenderer():void;
  protected abstract applyBlendMode(mode:number):void;
}

/** HSB (each 0..1) → RGB (each 0..1). */
export function hsbToRgb(h:number,s:number,v:number):[number,number,number]{
  if(s===0)return [v,v,v];
  const which=(h-Math.floor(h))*6;
  const f=which-Math.floor(which);
  const p=v*(1-s),q=v*(1-s*f),t=v*(1-s*(1-f));
  switch(Math.floor(which)){
    case 0:return [v,t,p];
    case 1:return [q,v,p];
    case 2:return [p,v,t];
    case 3:return [p,q,v];
    case 4:return [t,p,v];
    default:return [v,p,q];
  }
}

/** ARGB → HSB (each 0..1), as java.awt.Color.RGBtoHSB. */
export function rgbToHsb(c:number):[number,number,number]{
  const r=(c>>16)&0xff,g=(c>>8)&0xff,b=c&0xff;
  const max=Math.max(r,g,b),min=Math.min(r,g,b);
  const v=max/255;
  const s=max===0?0:(max-min)/max;
  let h=0;
  if(s!==0){
    const rc=(max-r)/(max-min),gc=(max-g)/(max-min),bc=(max-b)/(max-min);
    h=r===max?bc-gc:g===max?2+rc-bc:4+gc-rc;
    h/=6;
    if(h<0)h+=1;
  }
  return [h,s,v];
}

export const CAP={ROUND,SQUARE,PROJECT};
