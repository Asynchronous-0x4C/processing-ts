import { PGraphics, enumPath, type Path, CAP } from "./PGraphics";
import { PImage, createNativeCanvas, type Native2D, type NativeCanvas } from "./PImage";
import { DEFAULT_FONT_FAMILY, PFont, defaultFontReady, ensureDefaultFont, type VlwGlyph } from "./PFont";

/** The font text uses before textFont(): Processing creates the default font at size 12. */
const DEFAULT_PFONT=new PFont(DEFAULT_FONT_FAMILY,12);
import type { PApplet } from "./PApplet";

const BEVEL=32,ROUND_JOIN=2;

/** A .vlw glyph's alpha bitmap colored with `color` (ARGB), cached for the last color. */
function tintedGlyph(g:VlwGlyph,color:number):HTMLCanvasElement|OffscreenCanvas{
  if(g.tinted&&g.tinted.color===color)return g.tinted.canvas;
  const canvas=g.tinted?.canvas??createNativeCanvas(g.width,g.height);
  const ctx=canvas.getContext("2d") as Native2D;
  const img=ctx.createImageData(g.width,g.height);
  const r=(color>>16)&0xff,gr=(color>>8)&0xff,b=color&0xff,a=color>>>24;
  for(let i=0;i<g.alpha.length;i++){
    img.data[i*4]=r;img.data[i*4+1]=gr;img.data[i*4+2]=b;img.data[i*4+3]=Math.round(g.alpha[i]*a/255);
  }
  ctx.putImageData(img,0,0);
  g.tinted={color,canvas};
  return canvas;
}

const stencils=new Map<string,Float32Array>();

/**
 * The polygon Java2D fills for a round point of the given device diameter: the round caps are cubic
 * curves (one per quarter circle, starting at angle 0), flattened at equal steps of the curve
 * parameter into 2 segments per quarter below 2 pixels, 4 up to 9, 8 up to 32 and 16 beyond
 * (measured against Processing 4.5.2 for diameters 0.5 to 80: every pixel within 1).
 */
function roundPointPolygon(size:number):[number,number][]{
  const r=size/2;
  const per=size<1.9?2:size<9.5?4:size<36?8:16;
  const k=4/3*Math.tan(Math.PI/8);
  const pts:[number,number][]=[];
  for(let q=0;q<4;q++){
    const a0=q*Math.PI/2,a1=a0+Math.PI/2;
    const c0=Math.cos(a0),s0=Math.sin(a0),c1=Math.cos(a1),s1=Math.sin(a1);
    const p0x=r*c0,p0y=r*s0,p3x=r*c1,p3y=r*s1;
    const p1x=p0x-k*r*s0,p1y=p0y+k*r*c0,p2x=p3x+k*r*s1,p2y=p3y-k*r*c1;
    for(let j=0;j<per;j++){
      const t=j/per,u=1-t;
      const b0=u*u*u,b1=3*u*u*t,b2=3*u*t*t,b3=t*t*t;
      pts.push([b0*p0x+b1*p1x+b2*p2x+b3*p3x,b0*p0y+b1*p1y+b2*p2y+b3*p3y]);
    }
  }
  return pts;
}

/**
 * What a point of the given device diameter covers, centered on a pixel, as runs (dx, dy, length,
 * coverage): coverage as Java2D's Marlin rasterizer computes it (8 sample rows per pixel, the exact
 * horizontal extent in each row), neighbouring pixels of equal coverage merged.
 */
function pointStencil(size:number,round:boolean):Float32Array{
  const key=`${round?"r":"s"}${size}`;
  let st=stencils.get(key);
  if(st)return st;
  const r=size/2;
  const poly:[number,number][]=round?roundPointPolygon(size):[[-r,-r],[r,-r],[r,r],[-r,r]];
  const out:number[]=[];
  const reach=Math.ceil(r+0.5);
  const row=new Float64Array(2*reach+1);
  for(let py=-reach;py<=reach;py++){
    row.fill(0);
    for(let k=0;k<8;k++){
      // the polygon's horizontal extent at this sample row (pixel centers are at integer coordinates)
      const y=py-0.5+(k+0.5)/8;
      let xl=Infinity,xr=-Infinity;
      for(let i=0;i<poly.length;i++){
        const [x0,y0]=poly[i],[x1,y1]=poly[(i+1)%poly.length];
        if((y0<=y&&y<y1)||(y1<=y&&y<y0)){
          const xi=x0+(y-y0)*(x1-x0)/(y1-y0);
          xl=Math.min(xl,xi);xr=Math.max(xr,xi);
        }
      }
      if(xl>=xr)continue;
      for(let px=-reach;px<=reach;px++){
        const o=Math.min(xr,px+0.5)-Math.max(xl,px-0.5);
        if(o>0)row[px+reach]+=o/8;
      }
    }
    for(let px=-reach;px<=reach;){
      const c=Math.min(1,Math.round(row[px+reach]*255)/255);
      let n=1;
      while(px+n<=reach&&Math.min(1,Math.round(row[px+n+reach]*255)/255)===c)n++;
      if(c>0)out.push(px,py,n,c);
      px+=n;
    }
  }
  st=Float32Array.from(out);
  stencils.set(key,st);
  return st;
}

/** Processing blend modes → canvas composite operations. */
const COMPOSITE:Record<number,GlobalCompositeOperation>={
  0:"copy", // REPLACE
  1:"source-over", // BLEND
  2:"lighter", // ADD
  4:"difference", // SUBTRACT (no exact canvas equivalent)
  8:"lighten", // LIGHTEST
  16:"darken", // DARKEST
  32:"difference",
  64:"exclusion",
  128:"multiply",
  256:"screen",
  512:"overlay",
  1024:"hard-light",
  2048:"soft-light",
  4096:"color-dodge", // DODGE
  8192:"color-burn", // BURN
};

/**
 * The JAVA2D renderer on the Canvas 2D API: immediate drawing, the canvas keeps what was drawn (as the
 * Java2D image does), and the canvas doubles as the PImage store for loadPixels()/get()/set().
 */
export class PGraphicsJava2D extends PGraphics{
  canvas:NativeCanvas|null;
  ctx:Native2D|null=null;
  private cssCache=new Map<number,string>();
  private tintCache=new WeakMap<object,{key:string,canvas:NativeCanvas}>();

  constructor(parent:PApplet,canvas?:HTMLCanvasElement|null,primary=false){
    super(parent);
    this.canvas=canvas??null;
    this.primary=primary;
    this.format=primary?1:2;
  }

  setSize(width:number,height:number,density=1){
    this.width=width;
    this.height=height;
    this.pixelDensity=density;
    this.pixelWidth=Math.round(width*density);
    this.pixelHeight=Math.round(height*density);
    if(this.canvas){
      this.canvas.width=this.pixelWidth;
      this.canvas.height=this.pixelHeight;
    }else{
      this.canvas=createNativeCanvas(this.pixelWidth,this.pixelHeight);
    }
    this.ctx=this.canvas.getContext("2d") as Native2D;
    this.__canvas__=this.canvas;
    this.__ctx__=this.ctx;
    this.pixels=new Int32Array(this.pixelWidth*this.pixelHeight);
    this.applyMatrixToRenderer();
    this.applyBlendMode(this.style.blendMode);
    this.ctx.miterLimit=10;
  }

  /** smooth()/noSmooth(): image smoothing (shapes are always antialiased by the canvas). */
  smooth(_level?:number){
    if(this.ctx)this.ctx.imageSmoothingEnabled=true;
  }

  noSmooth(){
    if(this.ctx)this.ctx.imageSmoothingEnabled=false;
  }

  private css(argb:number):string{
    let s=this.cssCache.get(argb);
    if(s===undefined){
      s=`rgba(${(argb>>16)&0xff},${(argb>>8)&0xff},${argb&0xff},${(argb>>>24)/255})`;
      if(this.cssCache.size>256)this.cssCache.clear();
      this.cssCache.set(argb,s);
    }
    return s;
  }

  protected applyMatrixToRenderer(){
    if(!this.ctx)return;
    const m=this.matrix,d=this.pixelDensity;
    this.ctx.setTransform(m.m00*d,m.m10*d,m.m01*d,m.m11*d,m.m02*d,m.m12*d);
  }

  protected applyBlendMode(mode:number){
    if(this.ctx)this.ctx.globalCompositeOperation=COMPOSITE[mode]??"source-over";
  }

  private path2d(path:Path):Path2D{
    const p=new Path2D();
    const P=enumPath;
    for(let i=0;i<path.length;){
      switch(path[i]){
        case P.MOVE:p.moveTo(path[i+1],path[i+2]);i+=3;break;
        case P.LINE:p.lineTo(path[i+1],path[i+2]);i+=3;break;
        case P.QUAD:p.quadraticCurveTo(path[i+1],path[i+2],path[i+3],path[i+4]);i+=5;break;
        case P.CUBIC:p.bezierCurveTo(path[i+1],path[i+2],path[i+3],path[i+4],path[i+5],path[i+6]);i+=7;break;
        case P.ELLIPSE:p.ellipse(path[i+1],path[i+2],Math.max(0,path[i+3]),Math.max(0,path[i+4]),0,path[i+5],path[i+6]);i+=7;break;
        default:p.closePath();i+=1;break;
      }
    }
    return p;
  }

  /**
   * The stroke path with Java2D's stroke normalization (Processing keeps the default STROKE_NORMALIZE):
   * each end point snaps to the pixel center floor(x) + 0.5 in device space, curve control points move
   * with the end points next to them (cubic: the previous and the current one, quadratic: their mean),
   * and ellipses are stroked as their cubic segments. Fills are not normalized. Measured against
   * Processing 4.5.2: a 1px rect outline at x = 10, 10.25 or 10.75 covers exactly pixel column 10.
   */
  private normalizedStrokePath(path:Path):Path2D|null{
    const m=this.matrix,d=this.pixelDensity;
    const a=m.m00*d,b=m.m10*d,c=m.m01*d,dd=m.m11*d,e=m.m02*d,f=m.m12*d;
    const det=a*dd-b*c;
    if(!det||!Number.isFinite(det))return null;
    const ia=dd/det,ib=-b/det,ic=-c/det,id=a/det;
    const p=new Path2D();
    let ax=0,ay=0; // adjustment of the previous end point (device space)
    let sax=0,say=0; // adjustment of the start of the subpath
    let has=false; // a current point exists
    // device point (+ adjustment) → user space
    const back=(X:number,Y:number):[number,number]=>[ia*(X-e)+ic*(Y-f),ib*(X-e)+id*(Y-f)];
    const dev=(x:number,y:number):[number,number]=>[a*x+c*y+e,b*x+dd*y+f];
    const end=(x:number,y:number):[number,number,number,number]=>{
      const [X,Y]=dev(x,y);
      // (tiny float errors, as cos(3π/2) != 0, must not move an end to the previous pixel)
      const nx=Math.floor(X+1e-9)+0.5,ny=Math.floor(Y+1e-9)+0.5;
      return [nx,ny,nx-X,ny-Y];
    };
    const moveTo=(x:number,y:number)=>{
      const [X,Y,dx,dy]=end(x,y);
      p.moveTo(...back(X,Y));
      ax=sax=dx;ay=say=dy;has=true;
    };
    const lineTo=(x:number,y:number)=>{
      const [X,Y,dx,dy]=end(x,y);
      p.lineTo(...back(X,Y));
      ax=dx;ay=dy;
    };
    const cubicTo=(x1:number,y1:number,x2:number,y2:number,x:number,y:number)=>{
      const [X,Y,dx,dy]=end(x,y);
      const [X1,Y1]=dev(x1,y1),[X2,Y2]=dev(x2,y2);
      p.bezierCurveTo(...back(X1+ax,Y1+ay),...back(X2+dx,Y2+dy),...back(X,Y));
      ax=dx;ay=dy;
    };
    const P=enumPath;
    for(let i=0;i<path.length;){
      switch(path[i]){
        case P.MOVE:moveTo(path[i+1],path[i+2]);i+=3;break;
        case P.LINE:
          if(has)lineTo(path[i+1],path[i+2]);else moveTo(path[i+1],path[i+2]);
          i+=3;break;
        case P.QUAD:{
          const [X,Y,dx,dy]=end(path[i+3],path[i+4]);
          const [CX,CY]=dev(path[i+1],path[i+2]);
          p.quadraticCurveTo(...back(CX+(ax+dx)/2,CY+(ay+dy)/2),...back(X,Y));
          ax=dx;ay=dy;i+=5;break;
        }
        case P.CUBIC:cubicTo(path[i+1],path[i+2],path[i+3],path[i+4],path[i+5],path[i+6]);i+=7;break;
        case P.ELLIPSE:{
          const cx=path[i+1],cy=path[i+2],rx=Math.max(0,path[i+3]),ry=Math.max(0,path[i+4]);
          const t0=path[i+5],t1=path[i+6];
          const pt=(t:number)=>[cx+rx*Math.cos(t),cy+ry*Math.sin(t)];
          const [x0,y0]=pt(t0);
          if(has)lineTo(x0,y0);else moveTo(x0,y0);
          // segments of at most 90 degrees
          const n=Math.max(1,Math.ceil((t1-t0)/(Math.PI/2)-1e-9));
          const h=(t1-t0)/n,k=4/3*Math.tan(h/4);
          for(let j=0;j<n;j++){
            const u0=t0+h*j,u1=u0+h;
            const [px,py]=pt(u0),[qx,qy]=pt(u1);
            cubicTo(px-k*rx*Math.sin(u0),py+k*ry*Math.cos(u0),qx+k*rx*Math.sin(u1),qy-k*ry*Math.cos(u1),qx,qy);
          }
          i+=7;break;
        }
        default:
          p.closePath();
          // the current point returns to the start of the subpath
          ax=sax;ay=say;
          i+=1;break;
      }
    }
    return p;
  }

  private setStroke(ctx:Native2D){
    const s=this.style;
    ctx.strokeStyle=this.css(s.strokeColor);
    ctx.lineWidth=s.strokeWeight;
    ctx.lineCap=s.strokeCap===CAP.SQUARE?"butt":s.strokeCap===CAP.PROJECT?"square":"round";
    ctx.lineJoin=s.strokeJoin===BEVEL?"bevel":s.strokeJoin===ROUND_JOIN?"round":"miter";
  }

  protected drawPath(path:Path,fill:boolean,stroke:boolean){
    const ctx=this.ctx;
    if(!ctx)return;
    const s=this.style;
    if(fill&&s.fill){
      ctx.fillStyle=this.css(s.fillColor);
      ctx.fill(this.path2d(path),"nonzero");
    }
    if(stroke&&s.stroke&&s.strokeWeight>0){
      this.setStroke(ctx);
      ctx.stroke(this.normalizedStrokePath(path)??this.path2d(path));
    }
  }

  protected drawPoint(x:number,y:number){
    const ctx=this.ctx;
    if(!ctx)return;
    const s=this.style;
    const w=s.strokeWeight;
    // SQUARE (butt) caps on a zero-length line draw nothing, as in Java2D.
    if(s.strokeCap!==CAP.ROUND&&s.strokeCap!==CAP.PROJECT)return;
    ctx.fillStyle=this.css(s.strokeColor);
    // A point is a zero-length stroke, so its center snaps to the pixel center like line ends do.
    const m=this.matrix,d=this.pixelDensity;
    const a=m.m00*d,b=m.m10*d,c=m.m01*d,dd=m.m11*d,e=m.m02*d,f=m.m12*d;
    const det=a*dd-b*c;
    if(!det||!Number.isFinite(det))return;
    const X=Math.floor(a*x+c*y+e+1e-9),Y=Math.floor(b*x+dd*y+f+1e-9);
    // Without rotation or shear: the coverage Java2D computes (see pointStencil()).
    const size=w*Math.abs(a);
    if(b===0&&c===0&&Math.abs(a)===Math.abs(dd)&&size<=256){
      const stencil=pointStencil(size,s.strokeCap===CAP.ROUND);
      // device pixels → user space (the transform is a scale and a translation)
      const ia=1/a,id=1/dd;
      const alpha=ctx.globalAlpha;
      for(let i=0;i<stencil.length;i+=4){
        ctx.globalAlpha=alpha*stencil[i+3];
        ctx.fillRect((X+stencil[i]-e)*ia,(Y+stencil[i+1]-f)*id,stencil[i+2]*ia,id);
      }
      ctx.globalAlpha=alpha;
      return;
    }
    const NX=X+0.5-e,NY=Y+0.5-f;
    x=(dd*NX-c*NY)/det;
    y=(-b*NX+a*NY)/det;
    if(s.strokeCap===CAP.ROUND){
      const p=new Path2D();
      const scale=Math.sqrt(Math.abs(det));
      roundPointPolygon(w*scale).forEach(([px,py],k)=>{
        if(k===0)p.moveTo(x+px/scale,y+py/scale);
        else p.lineTo(x+px/scale,y+py/scale);
      });
      p.closePath();
      ctx.fill(p);
    }else{
      ctx.fillRect(x-w/2,y-w/2,w,w);
    }
  }

  protected backgroundImpl(argb:number,clear=false){
    const ctx=this.ctx;
    if(!ctx)return;
    ctx.save();
    ctx.setTransform(1,0,0,1,0,0);
    ctx.globalCompositeOperation="source-over";
    ctx.globalAlpha=1;
    if(clear||!this.primary)ctx.clearRect(0,0,this.pixelWidth,this.pixelHeight);
    if(!clear){
      // The sketch window ignores the background's alpha (Processing does the same).
      ctx.fillStyle=this.css(this.primary?(argb|0xff000000):argb);
      ctx.fillRect(0,0,this.pixelWidth,this.pixelHeight);
    }
    ctx.restore();
  }

  protected backgroundImage(img:PImage){
    const ctx=this.ctx,src=img.__native__();
    if(!ctx||!src)return;
    ctx.save();
    ctx.setTransform(1,0,0,1,0,0);
    ctx.globalCompositeOperation="copy";
    ctx.drawImage(src,0,0,this.pixelWidth,this.pixelHeight);
    ctx.restore();
  }

  /** The image's canvas, multiplied by the tint color (cached per image and tint). */
  private tinted(img:PImage,src:NativeCanvas):NativeCanvas{
    const t=this.style.tintColor;
    const key=`${t}:${img.pixelWidth}x${img.pixelHeight}`;
    const cached=this.tintCache.get(img);
    if(cached&&cached.key===key&&!(img instanceof PGraphics))return cached.canvas;
    const c=createNativeCanvas(img.pixelWidth,img.pixelHeight);
    const cx=c.getContext("2d") as Native2D;
    cx.drawImage(src,0,0);
    cx.globalCompositeOperation="multiply";
    cx.fillStyle=this.css(t|0xff000000);
    cx.fillRect(0,0,img.pixelWidth,img.pixelHeight);
    cx.globalCompositeOperation="destination-in";
    cx.drawImage(src,0,0);
    this.tintCache.set(img,{key,canvas:c});
    return c;
  }

  protected drawImage(img:PImage,x1:number,y1:number,x2:number,y2:number,u1:number,v1:number,u2:number,v2:number){
    const ctx=this.ctx;
    let src=img.__native__();
    if(!ctx||!src)return;
    const s=this.style;
    let alpha=1;
    if(s.tint){
      alpha=(s.tintColor>>>24)/255;
      if((s.tintColor&0xffffff)!==0xffffff)src=this.tinted(img,src);
    }
    const d=img.pixelDensity;
    // Java2D's drawImage takes int corners: Processing truncates them (measured: no partial pixels).
    x1=Math.trunc(x1);y1=Math.trunc(y1);x2=Math.trunc(x2);y2=Math.trunc(y2);
    ctx.save();
    ctx.globalAlpha=alpha;
    // Negative sizes flip the image, as in Java2D.
    let w=x2-x1,h=y2-y1;
    if(w<0||h<0){
      ctx.translate(w<0?x1:0,h<0?y1:0);
      ctx.scale(w<0?-1:1,h<0?-1:1);
      x1=w<0?0:x1;
      y1=h<0?0:y1;
      w=Math.abs(w);
      h=Math.abs(h);
    }
    ctx.drawImage(src,u1*d,v1*d,(u2-u1)*d,(v2-v1)*d,x1,y1,w,h);
    ctx.restore();
  }

  private font():string{
    ensureDefaultFont();
    const f=this.style.textFont;
    const family=f?f.cssFamily():`"${DEFAULT_FONT_FAMILY}", sans-serif`;
    return `${this.style.textSize}px ${family}`;
  }

  protected drawTextLine(line:string,x:number,y:number){
    const ctx=this.ctx;
    if(!ctx||!line)return;
    const vf=this.style.textFont;
    if(vf?.__vlw__){
      this.drawVlwLine(vf,line,x,y);
      return;
    }
    ctx.font=this.font();
    ctx.textAlign="left";
    ctx.textBaseline="alphabetic";
    ctx.fillStyle=this.css(this.style.fillColor);
    ctx.fillText(line,x,y);
  }

  private measure(text:string):TextMetrics|null{
    const ctx=this.ctx??this.parent?.g?.ctx;
    if(!ctx)return null;
    ctx.font=this.font();
    return ctx.measureText(text);
  }

  protected textWidthImpl(line:string){
    const vf=this.style.textFont;
    if(vf?.__vlw__){
      let w=0;
      for(let i=0;i<line.length;i++)w=Math.fround(w+Math.fround(vf.__vlw_width__(line.charCodeAt(i))*this.style.textSize));
      return w;
    }
    return this.measure(line)?.width??line.length*this.style.textSize*0.5;
  }

  /** Text in a .vlw font: each glyph's bitmap in the fill color, scaled from the font's size to the text size. */
  private drawVlwLine(font:PFont,line:string,x:number,y:number){
    const ctx=this.ctx!;
    const size=this.style.textSize,fs=font.size,color=this.style.fillColor;
    const f=Math.fround;
    for(let i=0;i<line.length;i++){
      const c=line.charCodeAt(i);
      const g=font.__vlw__!.glyphs.get(c);
      if(g&&c!==32&&g.width>0&&g.height>0){
        // drawn as an image: the corners are truncated to ints (see drawImage())
        const x1=f(x+f(f(g.leftExtent/fs)*size)),y1=f(y-f(f(g.topExtent/fs)*size));
        const x2=f(x1+f(f(g.width/fs)*size)),y2=f(y1+f(f(g.height/fs)*size));
        const ix=Math.trunc(x1),iy=Math.trunc(y1);
        ctx.drawImage(tintedGlyph(g,color) as CanvasImageSource,ix,iy,Math.trunc(x2)-ix,Math.trunc(y2)-iy);
      }
      x=f(x+f(font.__vlw_width__(c)*size));
    }
  }

  /**
   * Ascent and descent per unit of text size, as Processing's PFont has them: the height of "d" above and
   * the depth of "p" below the baseline in whole pixels at the size the font was created at (12 for the
   * default font), divided by that size. textAscent() is this times the current text size (in float).
   * Matches Processing for the bundled default font; Java2D hints other fonts, which can differ by a pixel.
   */
  private fontMetrics():{ascent:number;descent:number}{
    const f=this.style.textFont??DEFAULT_PFONT;
    if(f.__metrics__)return f.__metrics__;
    const ctx=this.ctx??this.parent?.g?.ctx;
    if(!ctx)return {ascent:0.75,descent:Math.fround(1/6)};
    ensureDefaultFont();
    ctx.font=`${f.size}px ${f.cssFamily()}`;
    const ascent=Math.round(ctx.measureText("d").actualBoundingBoxAscent);
    const descent=Math.round(ctx.measureText("p").actualBoundingBoxDescent);
    const m={ascent:Math.fround(ascent/f.size),descent:Math.fround(descent/f.size)};
    // Until the default font has loaded, the measurement is of the fallback: do not keep it.
    if(!f.isDefaultFamily()||defaultFontReady())f.__metrics__=m;
    return m;
  }

  protected textAscentImpl(){
    return Math.fround(this.fontMetrics().ascent*this.style.textSize);
  }

  protected textDescentImpl(){
    return Math.fround(this.fontMetrics().descent*this.style.textSize);
  }
}

export { PFont };
