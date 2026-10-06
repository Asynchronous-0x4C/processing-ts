import { PConstants } from "./PConstants";
import { PGraphics } from "./PGraphics";
import { PGraphicsJava2D } from "./PGraphicsJava2D";
import { PImage } from "./PImage";
import { PSurface } from "./PSurface";
import { JSONObject } from "./data/JSONObject";
import { KeyEvent } from "./event/KeyEvent";
import { MouseEvent } from "./event/MouseEvent";
import { IOBase } from "./util/sketchio/IOBase";
import { JSONArray } from "./data/JSONArray";
import { XHRIO } from "./util/sketchio/XHRIO";
import { PFont } from "./PFont";
import * as arrayFunctions from "./util/arrayFunctions";
import type { JavaArray } from "./util/arrayFunctions";
import { Random } from "../../runtime/lang/util.ts";
import { exceptions } from "../../runtime/lang/index.ts";

export interface PAppletSettings{
  canvas: HTMLCanvasElement,
  base_path: string,
  max_size:{ width: number; height: number; }
}

/** PGraphics methods that PApplet forwards to `g` (as Processing's PApplet does). */
const DELEGATED=[
  "background","clear","colorMode","fill","noFill","stroke","noStroke","tint","noTint",
  "strokeWeight","strokeCap","strokeJoin","rectMode","ellipseMode","imageMode","shapeMode","blendMode",
  "red","green","blue","alpha","hue","saturation","brightness","lerpColor",
  "pushStyle","popStyle","pushMatrix","popMatrix","push","pop",
  "translate","rotate","scale","shearX","shearY","applyMatrix","resetMatrix","printMatrix","getMatrix","setMatrix","screenX","screenY",
  "point","line","triangle","quad","rect","square","ellipse","circle","arc",
  "bezier","curve","curveTightness","bezierDetail","curveDetail","bezierPoint","bezierTangent","curvePoint","curveTangent",
  "beginShape","vertex","bezierVertex","quadraticVertex","curveVertex","beginContour","endContour","endShape",
  "image","textSize","textLeading","textAlign","textMode","textWidth","textAscent","textDescent","text",
  "get","set","copy",
] as const;

export interface PApplet extends Pick<PGraphics,typeof DELEGATED[number]>{}

const SIZE_ERROR="size() cannot be used here, see https://processing.org/reference/size_.html";

export class PApplet extends PConstants{
  /** The sketch window's renderer (allocated by __init_surface__() after settings()). */
  g:PGraphicsJava2D;
  surface:PSurface=new PSurface(this);
  __io__:IOBase|null=null;
  __fullscreen__:boolean=false;
  __log_listener__:(args:any[])=>void=()=>{};
  __date__=new Date();
  __start_milli_seconds__=performance.now();
  __loop__=true;
  /** redraw() was called: draw one frame even under noLoop(). */
  __redraw__=false;
  /** What settings() asked for: size()/fullScreen()/pixelDensity()/smooth(). */
  __requested__={width:100,height:100,density:0,smooth:true};

  private __exit_code__=0;

  max_size:{width:number,height:number}={width:0,height:0};
  width:number=100;
  height:number=100;
  pixelWidth:number=100;
  pixelHeight:number=100;
  /** loadPixels() points this at the window's pixels (ARGB). */
  pixels:Int32Array=new Int32Array(0);
  pmouseX:number=0;
  pmouseY:number=0;
  mouseX:number=0;
  mouseY:number=0;
  mousePressed:boolean=false;
  mouseButton:number=0; // 0: left, 1: middle, 2: right
  /** The last key as a char code (Processing's char key; CODED for arrows etc.). */
  key:number=0;
  keyCode:number=0;
  keyPressed:boolean=false;
  __frameRate__:number=60;
  frameRate:number=60;
  frameCount:number=0;

  __initialized__=false;

  constructor(settings?:PAppletSettings){
    super();
    if(settings){
      this.max_size=settings.max_size;
      this.__io__=new XHRIO(settings.base_path);
    }
    this.g=new PGraphicsJava2D(this,settings?.canvas??null,true);
  }

  __set_preload__(buffer:{path:string, content:ArrayBuffer}[]){
    if(this.__io__)this.__io__.preload=buffer;
  }

  async settings(){}

  async setup(){}

  async draw(){
    this.noLoop();
  }

  /**
   * size(w, h[, renderer]): in settings() it sets the window size; afterwards the same size does nothing
   * and another size is an error, as in Processing (size() with variables in setup() is not moved to
   * settings() by the preprocessor).
   */
  size(width:number,height:number,_renderer?:string){
    if(this.__initialized__){
      if(width===this.width&&height===this.height)return;
      throw new exceptions.IllegalStateException(SIZE_ERROR);
    }
    this.__requested__.width=width;
    this.__requested__.height=height;
    this.__fullscreen__=false;
  }

  fullScreen(_a?:number|string,_b?:number){
    if(this.__initialized__)throw new exceptions.IllegalStateException(SIZE_ERROR);
    this.__fullscreen__=true;
  }

  /** Allocate the window after settings(): 100x100 when size() was not called, density displayDensity(). */
  __init_surface__(){
    if(this.__initialized__)return;
    const r=this.__requested__;
    const w=this.__fullscreen__?Math.floor(this.max_size.width):r.width;
    const h=this.__fullscreen__?Math.floor(this.max_size.height):r.height;
    const density=r.density||this.displayDensity();
    this.g.setSize(w,h,density);
    if(!r.smooth)this.g.noSmooth();
    const canvas=this.g.canvas;
    if(canvas&&"style" in canvas){
      canvas.style.width=`${w}px`;
      canvas.style.height=`${h}px`;
    }
    this.width=w;
    this.height=h;
    this.pixelWidth=this.g.pixelWidth;
    this.pixelHeight=this.g.pixelHeight;
    this.__initialized__=true;
    this.g.background(204);
  }

  getSurface(){
    return this.surface;
  }

  _frameRate(framerate:number){
    this.__frameRate__=framerate;
  }

  /** Processing's color int (ARGB), in the current colorMode. */
  color(...args:number[]):number{
    return this.g.color(...args);
  }

  createFont(name:string,size:number,smooth=true,_charset?:unknown){
    return new PFont(name,size,smooth);
  }

  loadFont(name:string){
    return new PFont(name.replace(/^.*[\/\\]/,"").replace(/-\d+\.vlw$/i,""),Number(/-(\d+)\.vlw$/i.exec(name)?.[1]??12));
  }

  textFont(font:PFont,size?:number){
    this.g.textFont(font,size);
  }

  loadPixels(){
    this.g.loadPixels();
    this.pixels=this.g.pixels;
  }

  updatePixels(x?:number,y?:number,w?:number,h?:number){
    this.g.updatePixels(x,y,w,h);
  }

  _keyPressed(e:KeyEvent){}

  _keyTyped(e:KeyEvent){}

  _keyReleased(e:KeyEvent){}

  _mousePressed(e:MouseEvent){}

  _mouseReleased(e:MouseEvent){}

  _mouseMoved(e:MouseEvent){}

  _mouseWheel(e:MouseEvent){}

  _windowResized(){}

  join(list:string[],separator:string){
    return list.join(separator);
  }

  matchAll(str:string,regexp:string){
    return str.matchAll(new RegExp(regexp,"g"));
  }

  match(str:string,regexp:string){
    return str.match(new RegExp(regexp));
  }

  nf(num:number|number[],left?:number,right?:number):string[]|string{
    if(typeof num === "number"){
      if(!left)return num.toString();
      if(right){
        return num.toFixed(right);
      }else{
        const l=Math.max(0,left-Math.floor(num).toString().length);
        return new Array(l).fill("0").join("").concat(num.toFixed());
      }
    }else{
      if(!left)return num.map(n=>n.toString());
      if(right){
        return num.map(n=>n.toFixed(right));
      }else{
        return num.map(n=>{
          const l=Math.max(0,left-Math.floor(n).toString().length);
          return new Array(l).fill("0").join("").concat(n.toFixed());
        });
      }
    }
  }

  nfc(num:number|number[],right?:number):string|string[]{
    if(typeof num === "number"){
      if(right){
        return new Intl.NumberFormat("en-US",{minimumFractionDigits:right}).format(num);
      }else{
        return new Intl.NumberFormat("en-US").format(num);
      }
    }else{
      if(right){
        return num.map(n=>new Intl.NumberFormat("en-US",{minimumFractionDigits:right}).format(n));
      }else{
        return num.map(n=>new Intl.NumberFormat("en-US").format(n));
      }
    }
  }

  nfp(num:number|number[],left:number,right?:number):string|string[]{
    if(typeof num === "number"){
      if(right){
        return new Intl.NumberFormat(undefined,{minimumIntegerDigits:left,minimumFractionDigits:right,signDisplay:"always"}).format(num);
      }else{
        return new Intl.NumberFormat(undefined,{minimumIntegerDigits:left,signDisplay:"always"}).format(num);
      }
    }else{
      if(right){
        return num.map(n=>new Intl.NumberFormat(undefined,{minimumIntegerDigits:left,minimumFractionDigits:right,signDisplay:"always"}).format(n));
      }else{
        return num.map(n=>new Intl.NumberFormat(undefined,{minimumIntegerDigits:left,signDisplay:"always"}).format(n));
      }
    }
  }

  nfs(num:number|number[],left:number,right?:number):string|string[]{
    const result=this.nfp(num,left,right);
    if(typeof result === "string"){
      return result.replace("+"," ");
    }else{
      return result.map(r=>r.replace("+"," "));
    }
  }

  trim(str:string|string[]){
    if(typeof str==="string"){
      return str.trim();
    }else{
      return str.map(s=>s.trim());
    }
  }

  year(){
    return this.__date__.getFullYear();
  }

  month(){
    return this.__date__.getMonth()+1;
  }

  day(){
    return this.__date__.getDate();
  }

  hour(){
    return this.__date__.getHours();
  }

  minute(){
    return this.__date__.getMinutes();
  }

  second(){
    return this.__date__.getSeconds();
  }

  millis(){
    return Math.round(performance.now()-this.__start_milli_seconds__);
  }

  radians(degrees:number){
    return degrees * (Math.PI / 180);
  }

  degrees(radians:number){
    return radians * (180 / Math.PI);
  }

  abs=Math.abs;

  floor=Math.floor;

  ceil=Math.ceil;

  min=Math.min;

  max=Math.max;

  sqrt=Math.sqrt;

  pow=Math.pow;

  constrain(x:number,min:number,max:number){
    if(x<min)return min;
    if(x>max)return max;
    return x;
  }

  map(value:number,start1:number,stop1:number,start2:number,stop2:number){
    const range1=stop1-start1;
    const range2=stop2-start2;
    const position=(value-start1)/range1;
    return start2+position*range2;
  }

  norm(value:number,start:number,stop:number){
    return this.map(value,start,stop,0,1);
  }
  
  dist(x1:number,y1:number,x2:number,y2:number){
    return Math.sqrt((x1-x2)**2+(y1-y2)**2);
  }

  exp=Math.exp;

  sin=Math.sin;

  cos=Math.cos;

  tan=Math.tan;

  asin=Math.asin;

  acos=Math.acos;

  atan=Math.atan;

  atan2=Math.atan2;

  /** Processing's random generator: a java.util.Random (randomSeed() makes it reproducible). */
  __random__:Random|null=null;

  private __randomHigh__(high:number):number{
    if(high===0||high!==high)return 0;
    const r=(this.__random__??=new Random());
    let v:number;
    // nextFloat() * high, never high itself (float rounding can produce it)
    do{
      v=Math.fround(r.nextFloat()*high);
    }while(v===high);
    return v;
  }

  /** random(high) or random(low, high) */
  random(a:number,b?:number){
    if(b===undefined)return this.__randomHigh__(a);
    if(a>=b)return a;
    let v:number;
    do{
      v=Math.fround(this.__randomHigh__(Math.fround(b-a))+a);
    }while(v===b);
    return v;
  }

  randomSeed(seed:number){
    (this.__random__??=new Random()).setSeed(seed);
  }

  randomGaussian(){
    return Math.fround((this.__random__??=new Random()).nextGaussian());
  }

  /** The noise is not Processing's yet (STATUS R14); the seed and detail are accepted. */
  noiseSeed(_seed:number){}

  noiseDetail(_lod:number,_falloff?:number){}

  /** smooth()/noSmooth() (settings()): shapes are always antialiased; noSmooth() turns off image smoothing. */
  smooth(_level?:number){
    this.__requested__.smooth=true;
    if(this.__initialized__)this.g.smooth();
  }

  noSmooth(){
    this.__requested__.smooth=false;
    if(this.__initialized__)this.g.noSmooth();
  }

  /** pixelDensity(1 or 2) in settings(); the default is displayDensity(). */
  pixelDensity(density:number){
    if(!this.__initialized__)this.__requested__.density=density;
  }

  /** 2 on HiDPI screens, as in Processing 4.5. */
  displayDensity(_display?:number){
    return typeof devicePixelRatio==="number"&&devicePixelRatio>=2?2:1;
  }

  hint(_which:number){}

  noise(x: number, y: number = 0, z: number = 0): number {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const Z = Math.floor(z) & 255;

    x -= Math.floor(x);
    y -= Math.floor(y);
    z -= Math.floor(z);

    const u = this.__fade__(x);
    const v = this.__fade__(y);
    const w = this.__fade__(z);

    const A = this.__permutation__[X] + Y;
    const AA = this.__permutation__[A] + Z;
    const AB = this.__permutation__[A + 1] + Z;
    const B = this.__permutation__[X + 1] + Y;
    const BA = this.__permutation__[B] + Z;
    const BB = this.__permutation__[B + 1] + Z;

    return this.lerp(
      this.lerp(
        this.lerp(this.__grad__(this.__permutation__[AA], x, y, z), this.__grad__(this.__permutation__[BA], x - 1, y, z), u),
        this.lerp(this.__grad__(this.__permutation__[AB], x, y - 1, z), this.__grad__(this.__permutation__[BB], x - 1, y - 1, z), u),
        v
      ),
      this.lerp(
        this.lerp(this.__grad__(this.__permutation__[AA + 1], x, y, z - 1), this.__grad__(this.__permutation__[BA + 1], x - 1, y, z - 1), u),
        this.lerp(this.__grad__(this.__permutation__[AB + 1], x, y - 1, z - 1), this.__grad__(this.__permutation__[BB + 1], x - 1, y - 1, z - 1), u),
        v
      ),
      w
    );
  }

  int(x:number){
    return Math.floor(x);
  }

  float(x:number){
    return x;
  }

  str(x:any){
    return x.toString();
  }

  split(str:string,splitter:string){
    return str.split(splitter);
  }

  println(...args:any[]){
    this.__log_listener__(args)
  }

  loadStrings(path:string){
    //TODO:fetch or get from cache
    const result=this.__io__!.load_as_string(path);
    if(result!=null){
      return result.split("\n");
    }
    console.warn(`loadStrings: ${path} not found`);
    return null;
  }

  saveStrings(path:string,data:string[]){
    this.__io__?.save_string(path,data.join("\n"));
  }

  loadImage(path:string){
    const img=new PImage(this);
    const result=this.__io__!.load_as_blob(path,`image/${path.split(".").pop()?.toLowerCase()??"png"}`);
    if(result!=null){
      img.load_from_blob(result);
      return img;
    }
    return null;
  }

  createImage(width:number,height:number,format:number):PImage{
    return new PImage(this,{width,height,format});
  }

  /** createGraphics(w, h[, renderer]): an offscreen JAVA2D surface (transparent, density 1). */
  createGraphics(width:number,height:number,_renderer?:string,_path?:string):PGraphics{
    const pg=new PGraphicsJava2D(this,null);
    pg.setSize(width,height,1);
    return pg;
  }

  loadJSONObject(path:string){
    const result=this.__io__!.load_as_string(path);
    if(result!=null){
      return JSONObject.parse(result);
    }
    return null;
  }

  saveJSONObject(data:JSONObject,path:string){
    this.__io__?.save_string(path,data.toString());
  }

  loadJSONArray(path:string){
    const result=this.__io__!.load_as_string(path);
    if(result!=null){
      return JSONArray.parse(result);
    }
    return null;
  }

  saveJSONArray(data:JSONArray,path:string){
    this.__io__?.save_string(path,data.toString());
  }

  // --- array functions and splitTokens (util/arrayFunctions.ts) --------------------------------------

  append<T extends JavaArray>(a:T,value:unknown):T{return arrayFunctions.append(a,value);}
  concat<T extends JavaArray>(a:T,b:T):T{return arrayFunctions.concat(a,b);}
  expand<T extends JavaArray>(a:T,newSize?:number):T{return arrayFunctions.expand(a,newSize);}
  reverse<T extends JavaArray>(a:T):T{return arrayFunctions.reverse(a);}
  shorten<T extends JavaArray>(a:T):T{return arrayFunctions.shorten(a);}
  sort<T extends JavaArray>(a:T,count?:number):T{return arrayFunctions.sort(a,count);}
  splice<T extends JavaArray>(a:T,value:unknown,index:number):T{return arrayFunctions.splice(a,value,index);}
  subset<T extends JavaArray>(a:T,start:number,count?:number):T{return arrayFunctions.subset(a,start,count);}
  arrayCopy(src:JavaArray,a:number|JavaArray,b?:JavaArray|number,c?:number,d?:number){arrayFunctions.arrayCopy(src,a,b,c,d);}
  /** @deprecated Processing's old name of arrayCopy(). */
  arraycopy(src:JavaArray,a:number|JavaArray,b?:JavaArray|number,c?:number,d?:number){arrayFunctions.arrayCopy(src,a,b,c,d);}
  splitTokens(value:string,delim?:string):string[]{return arrayFunctions.splitTokens(value,delim);}

  loop(){
    this.__loop__=true;
  }

  /** Draw one more frame under noLoop() (on the next frame, not inside this call). */
  redraw(){
    this.__redraw__=true;
  }

  noLoop(){
    this.__loop__=false;
  }

  exit(){
    this.__exit_code__=1;
  }

  __begin__(){
    this.g.__begin__();
    this.__date__=new Date();
  }

  __end__(){
    this.g.__end__();
    return this.__exit_code__;
  }

  __stop__(){
    this.colorMode(this.RGB,255,255,255,255);
    this.g.background(255);
    this.g.__stop__();
  }

  private __fade__(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  lerp(start: number, stop: number, amt: number): number {
    return start + amt * (stop - start);
  }

  private __grad__(hash: number, x: number, y: number, z: number): number {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  private __permutation__ = (() => {
    const p = new Uint8Array(512);
    const perm = [
      151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69,
      142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219,
      203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175,
      74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230,
      220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209,
      76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198,
      173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212,
      207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2,
      44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110,
      79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144,
      12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199,
      106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222,
      114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180,
    ];
    for (let i = 0; i < 256; i++) {
      p[256 + i] = p[i] = perm[i];
    }
    return p;
  })();
}
for(const name of DELEGATED){
  Object.defineProperty(PApplet.prototype,name,{
    value:function(this:PApplet,...args:unknown[]){
      return (this.g[name] as (...a:unknown[])=>unknown).apply(this.g,args);
    },
    writable:true,
    configurable:true,
  });
}
