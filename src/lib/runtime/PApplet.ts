import { PConstants } from "./PConstants";
import { PGraphics } from "./PGraphics";
import { PGraphicsJava2D } from "./PGraphicsJava2D";
import { PImage } from "./PImage";
import { PSurface } from "./PSurface";
import { JSONObject } from "./data/JSONObject";
import { KeyEvent } from "./event/KeyEvent";
import { MouseEvent } from "./event/MouseEvent";
import { JSONArray } from "./data/JSONArray";
import { SketchFiles, extensionOf, missingFileMessage } from "./io/SketchFiles";
import { PFont } from "./PFont";
import * as arrayFunctions from "./util/arrayFunctions";
import type { JavaArray } from "./util/arrayFunctions";
import { Random } from "../../runtime/lang/util.ts";
import { Noise } from "./util/noise";
import { blendColor } from "./util/imageOps";
import { exceptions } from "../../runtime/lang/index.ts";

export interface PAppletSettings{
  canvas: HTMLCanvasElement,
  base_path: string,
  max_size:{ width: number; height: number; },
  /** The sketch's files, preloaded by the runner (a store for base_path when absent). */
  files?: SketchFiles,
}

/** PGraphics methods that PApplet forwards to `g` (as Processing's PApplet does). */
const DELEGATED=[
  "background","clear","colorMode","fill","noFill","stroke","noStroke","tint","noTint",
  "backgroundF","fillF","strokeF","tintF",
  "strokeWeight","strokeCap","strokeJoin","rectMode","ellipseMode","imageMode","shapeMode","blendMode",
  "red","green","blue","alpha","hue","saturation","brightness","lerpColor",
  "pushStyle","popStyle","pushMatrix","popMatrix","push","pop",
  "translate","rotate","scale","shearX","shearY","applyMatrix","resetMatrix","printMatrix","getMatrix","setMatrix","screenX","screenY",
  "point","line","triangle","quad","rect","square","ellipse","circle","arc",
  "bezier","curve","curveTightness","bezierDetail","curveDetail","bezierPoint","bezierTangent","curvePoint","curveTangent",
  "beginShape","vertex","bezierVertex","quadraticVertex","curveVertex","beginContour","endContour","endShape",
  "image","textSize","textLeading","textAlign","textMode","textWidth","textAscent","textDescent","text",
  "get","set","copy","filter","blend",
] as const;

export interface PApplet extends Pick<PGraphics,typeof DELEGATED[number]>{}

const SIZE_ERROR="size() cannot be used here, see https://processing.org/reference/size_.html";

export class PApplet extends PConstants{
  /** The sketch window's renderer (allocated by __init_surface__() after settings()). */
  g:PGraphicsJava2D;
  surface:PSurface=new PSurface(this);
  /** The sketch folder's files (loadImage(), loadStrings(), save()...). */
  __files__:SketchFiles;
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
  /** LEFT (37), CENTER (3), RIGHT (39), or 0 after a move or the wheel. */
  mouseButton:number=0;
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
    if(settings)this.max_size=settings.max_size;
    this.__files__=settings?.files??new SketchFiles(settings?.base_path??"");
    this.g=new PGraphicsJava2D(this,settings?.canvas??null,true);
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

  /** color(float gray[, alpha]) (the compiler calls it for float arguments). */
  colorF(...args:number[]):number{
    return this.g.colorF(...args);
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

  // --- events (the runner queues them and calls __handle_event__ after draw(), as Processing does) ---

  _keyPressed(_e:KeyEvent){}

  _keyTyped(_e:KeyEvent){}

  _keyReleased(_e:KeyEvent){}

  _mousePressed(_e:MouseEvent){}

  _mouseReleased(_e:MouseEvent){}

  _mouseClicked(_e:MouseEvent){}

  _mouseMoved(_e:MouseEvent){}

  _mouseDragged(_e:MouseEvent){}

  _mouseWheel(_e:MouseEvent){}

  mouseEntered(_e?:MouseEvent){}

  mouseExited(_e?:MouseEvent){}

  _windowResized(){}

  focusGained(){}

  focusLost(){}

  /** Whether the sketch has the keyboard focus. */
  focused=false;
  /** Mouse position after the last event (pmouseX/Y inside handlers) and at the last draw() (pmouseX/Y in draw()). */
  private __emouse__={x:0,y:0};
  private __dmouse__={x:0,y:0};
  private __first_mouse__=true;
  /** keyCodes held down: keyPressed stays true until all are released. */
  private __pressed_keys__=new Set<number>();

  /** Before draw(): pmouseX/Y is where the mouse was at the previous draw(). */
  __before_draw__(){
    this.pmouseX=this.__dmouse__.x;
    this.pmouseY=this.__dmouse__.y;
  }

  __after_draw__(){
    this.__dmouse__={x:this.mouseX,y:this.mouseY};
  }

  __handle_event__(e:MouseEvent|KeyEvent){
    if(e instanceof MouseEvent)this.__handle_mouse_event__(e);
    else this.__handle_key_event__(e);
  }

  private __handle_mouse_event__(e:MouseEvent){
    const action=e.getAction();
    if(action===MouseEvent.ENTER||action===MouseEvent.EXIT){
      if(action===MouseEvent.ENTER)this.mouseEntered(e);
      else this.mouseExited(e);
      return;
    }
    this.mouseX=e.getX();
    this.mouseY=e.getY();
    if(this.__first_mouse__){
      this.__emouse__={x:this.mouseX,y:this.mouseY};
      this.__dmouse__={x:this.mouseX,y:this.mouseY};
      this.__first_mouse__=false;
    }
    this.pmouseX=this.__emouse__.x;
    this.pmouseY=this.__emouse__.y;
    // Every mouse event sets mouseButton (0 for moves and the wheel); it is kept after the release.
    this.mouseButton=e.getButton();
    switch(action){
      case MouseEvent.PRESS:this.mousePressed=true;this._mousePressed(e);break;
      case MouseEvent.RELEASE:this.mousePressed=false;this._mouseReleased(e);break;
      case MouseEvent.CLICK:this._mouseClicked(e);break;
      case MouseEvent.DRAG:this._mouseDragged(e);break;
      case MouseEvent.MOVE:this._mouseMoved(e);break;
      case MouseEvent.WHEEL:this._mouseWheel(e);break;
    }
    this.__emouse__={x:this.mouseX,y:this.mouseY};
  }

  private __handle_key_event__(e:KeyEvent){
    this.key=e.getKey();
    // keyCode is 0 in keyTyped(), as in Processing.
    this.keyCode=e.getKeyCode();
    switch(e.getAction()){
      case KeyEvent.PRESS:
        this.__pressed_keys__.add(e.getKeyCode());
        this.keyPressed=true;
        this._keyPressed(e);
        // Esc quits the sketch unless keyPressed() changed key.
        if(this.key===27)this.exit();
        break;
      case KeyEvent.TYPE:
        this._keyTyped(e);
        break;
      case KeyEvent.RELEASE:
        this.__pressed_keys__.delete(e.getKeyCode());
        this.keyPressed=this.__pressed_keys__.size>0;
        this._keyReleased(e);
        break;
    }
  }

  __focus__(focused:boolean){
    if(this.focused===focused)return;
    this.focused=focused;
    if(focused)this.focusGained();
    else this.focusLost();
  }

  cursor(kind?:number|PImage,x?:number,y?:number){
    if(kind instanceof PImage)this.surface.setCursor(kind,x??0,y??0);
    else if(kind!==undefined)this.surface.setCursor(kind);
    else this.surface.showCursor();
  }

  noCursor(){
    this.surface.hideCursor();
  }

  join(list:string[],separator:string){
    return list.join(separator);
  }

  /** All matches as String[][] (each: whole match, then the groups; unmatched groups null), or null. Patterns are DOTALL and MULTILINE, as in Processing. */
  matchAll(str:string,regexp:string):(string|null)[][]|null{
    const all=Array.from(str.matchAll(new RegExp(regexp,"gms")),(m)=>Array.from(m,(g)=>g??null));
    return all.length>0?all:null;
  }

  /** The first match as String[] (whole match, then the groups; unmatched groups null), or null. */
  match(str:string,regexp:string):(string|null)[]|null{
    const m=new RegExp(regexp,"ms").exec(str);
    return m?Array.from(m,(g)=>g??null):null;
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

  /** Processing's noise (util/noise.ts): its own generator, separate from random(). */
  __noise__=new Noise();

  noise(x:number,y?:number,z?:number):number{
    return this.__noise__.noise(x,y,z);
  }

  noiseSeed(seed:number){
    this.__noise__.seed(seed);
  }

  noiseDetail(lod:number,falloff?:number){
    this.__noise__.detail(lod,falloff);
  }

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

  // --- files (io/SketchFiles.ts: preloaded before setup(), so these are synchronous as in Processing) ---

  /** Bytes of a file, or null after printing Processing's message. */
  private __read__(name:string):Uint8Array|null{
    const b=this.__files__.bytes(name);
    if(b===null)exceptions.printError(missingFileMessage(name));
    return b;
  }

  private __read_text__(name:string):string|null{
    const t=this.__files__.text(name);
    if(t===null)exceptions.printError(missingFileMessage(name));
    return t;
  }

  /** The lines of a text file (UTF-8; \n, \r\n or \r end a line, as BufferedReader.readLine()), or null. */
  loadStrings(name:string):string[]|null{
    const text=this.__read_text__(name);
    if(text===null)return null;
    if(text==="")return [];
    const lines=text.split(/\r\n|\r|\n/);
    if(/[\r\n]$/.test(text))lines.pop();
    return lines;
  }

  /** byte[] of a file, or null. */
  loadBytes(name:string):Int8Array|null{
    const b=this.__read__(name);
    return b===null?null:new Int8Array(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength));
  }

  /** Lines joined with \n (each line ends with one), relative to the sketch folder. */
  saveStrings(name:string,lines:string[]){
    this.__files__.save(name,lines.map((l)=>l+"\n").join(""));
  }

  saveBytes(name:string,data:Int8Array|ArrayLike<number>){
    this.__files__.save(name,Uint8Array.from(data as ArrayLike<number>,(v)=>v&0xff));
  }

  /** loadImage(name[, extension]): the decoded image, or null (preloaded: see SketchFiles). */
  loadImage(name:string,extension?:string):PImage|null{
    const saved=this.__files__.savedImage(name);
    if(saved){
      // Processing reads its own .tga files upside down.
      if(extensionOf(name)!=="tga")return new PImage(this,saved);
      const {width,height,format,pixels}=saved;
      const flipped=new Int32Array(pixels.length);
      for(let y=0;y<height;y++)flipped.set(pixels.subarray((height-1-y)*width,(height-y)*width),y*width);
      return new PImage(this,{width,height,format,pixels:flipped});
    }
    const bmp=this.__files__.image(name);
    if(!bmp){
      exceptions.printError(missingFileMessage(name));
      return null;
    }
    const img=new PImage(this);
    img.__from_bitmap__(bmp,(extension??extensionOf(name)).toLowerCase());
    return img;
  }

  /** requestImage(name[, extension]): returns at once; width/height are 0 while loading, -1 on failure. */
  requestImage(name:string,extension?:string):PImage{
    const img=new PImage(this);
    void this.__files__.load(name).then((key)=>{
      const bmp=key===null?null:this.__files__.imageByKey(key);
      if(bmp)img.__from_bitmap__(bmp,(extension??extensionOf(name)).toLowerCase());
      else{
        img.width=img.height=-1;
        exceptions.printError(missingFileMessage(name));
      }
    });
    return img;
  }

  /** save(filename): the window as an image file (see PImage.save()). */
  save(filename:string){
    this.g.save(filename);
  }

  /** saveFrame([filename]): the window, with the run of '#' replaced by frameCount (default screen-####.tif). */
  saveFrame(filename?:string){
    const name=(filename??"screen-####.tif").replace(/#+/,(m)=>String(this.frameCount).padStart(m.length,"0"));
    this.g.save(name);
  }

  /** blendColor(c1, c2, mode) (static in Processing). */
  blendColor(c1:number,c2:number,mode:number):number{
    return blendColor(c1,c2,mode);
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

  loadJSONObject(name:string):JSONObject|null{
    const text=this.__read_text__(name);
    return text===null?null:JSONObject.parse(text);
  }

  saveJSONObject(json:JSONObject,name:string,_options?:string){
    this.__files__.save(name,json.toString());
  }

  loadJSONArray(name:string):JSONArray|null{
    const text=this.__read_text__(name);
    return text===null?null:JSONArray.parse(text);
  }

  saveJSONArray(json:JSONArray,name:string,_options?:string){
    this.__files__.save(name,json.toString());
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

  lerp(start: number, stop: number, amt: number): number {
    return start + amt * (stop - start);
  }
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
