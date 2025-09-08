import { PConstants } from "./PConstants";
import { PGraphics } from "./PGraphics";
import { PImage } from "./PImage";
import { PSurface } from "./PSurface";
import { JSONObject } from "./data/JSONObject";
import { KeyEvent } from "./event/KeyEvent";
import { MouseEvent } from "./event/MouseEvent";
import { base_uri } from "./worker/worker_data";
import { IOBase } from "./util/sketchio/IOBase";
import { JSONArray } from "./data/JSONArray";
import { XHRIO } from "./util/sketchio/XHRIO";
import { Application } from "pixi.js";
import { PFont } from "./PFont";

export interface PAppletSettings{
  canvas: HTMLCanvasElement,
  base_path: string,
  max_size:{ width: number; height: number; }
}

export class PApplet extends PConstants{
  g:PGraphics;
  surface:PSurface=new PSurface(this);
  __io__:IOBase|null=null;
  __fullscreen__:boolean=false;
  __log_listener__:(args:any[])=>void=()=>{};
  __date__=new Date();
  __start_milli_seconds__=performance.now();
  __loop__=true;
  __app__:Application;

  private __exit_code__=0;

  max_size:{width:number,height:number}={width:0,height:0};
  width:number=0;
  height:number=0;
  pmouseX:number=0;
  pmouseY:number=0;
  mouseX:number=0;
  mouseY:number=0;
  mousePressed:boolean=false;
  mouseButton:number=0; // 0: left, 1: middle, 2: right
  key:string="";
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
    this.__app__=new Application();
    this.g=new PGraphics(this,settings?.canvas);
  }

  __set_preload__(buffer:{path:string, content:ArrayBuffer}[]){
    if(this.__io__)this.__io__.preload=buffer;
  }

  async settings(){}

  async setup(){}

  async draw(){
    this.noLoop();
  }

  async size(width:number,height:number){
    if(this.__initialized__){
      console.warn("size() or fullScreen() can only be called once");
      return;
    }
    await this.g.init(width,height);
    this.width=this.g.width;
    this.height=this.g.height;
    this.__initialized__=true;
  }

  async fullScreen(mode:number){
    if(this.__initialized__){
      console.warn("size() or fullScreen() can only be called once");
      return;
    }
    this.width=this.max_size.width;
    this.height=this.max_size.height;
    this.__fullscreen__=true;
    await this.g.init(this.width,this.height);
    this.__initialized__=true;
  }

  getSurface(){
    return this.surface;
  }

  _frameRate(framerate:number){
    this.__frameRate__=framerate;
  }

  background(c1:number|PImage,c2?:number,c3?:number,c4?:number){
    this.g.background(c1,c2,c3,c4);
  }

  colorMode(mode:number,...max:number[]){
    this.g.colorMode(mode,...max);
  }

  fill(...color:number[]){
    this.g.fill(...color);
  }

  noFill(){
    this.g.noFill();
  }

  stroke(...color:number[]){
    this.g.stroke(...color);
  }

  noStroke(){
    this.g.noStroke();
  }

  strokeWeight(weight:number){
    this.g.strokeWeight(weight);
  }

  rectMode(mode:number){
    this.g.rectMode(mode);
  }

  ellipseMode(mode:number){
    this.g.ellipseMode(mode);
  }

  textAlign(align:number){
    this.g.textAlign(align);
  }

  textSize(size:number){
    this.g.textSize(size);
  }

  textWidth(str:string):number{
    return this.g.textWidth(str);
  }

  createFont(name:string,size:number){
    return this.g.createFont(name,size);
  }

  textFont(font:PFont){
    this.g.textFont(font);
  }

  imageMode(mode:number){
    this.g.imageMode(mode);
  }

  point(x:number,y:number){
    this.g.point(x,y);
  }

  rect(x:number,y:number,width:number,height:number){
    this.g.rect(x,y,width,height);
  }

  quad(x1:number,y1:number,x2:number,y2:number,x3:number,y3:number,x4:number,y4:number){
    this.g.quad(x1,y1,x2,y2,x3,y3,x4,y4);
  }

  ellipse(x:number,y:number,width:number,height:number){
    this.g.ellipse(x,y,width,height);
  }

  circle(x:number,y:number,r:number){
    this.g.circle(x,y,r);
  }

  arc(x:number,y:number,width:number,height:number,start:number,stop:number){
    this.g.arc(x,y,width,height,start,stop);
  }

  triangle(x1:number,y1:number,x2:number,y2:number,x3:number,y3:number){
    this.g.triangle(x1,y1,x2,y2,x3,y3);
  }

  line(x1:number,y1:number,x2:number,y2:number){
    this.g.line(x1,y1,x2,y2);
  }

  text(text:string,x:number,y:number,w?:number,h?:number){
    this.g.text(text,x,y,w,h);
  }

  image(image:PImage,x:number,y:number,w?:number,h?:number){
    this.g.image(image,x,y,w,h);
  }

  translate(x:number,y:number){
    this.g.translate(x,y);
  }

  rotate(angle:number){
    this.g.rotate(angle);
  }

  scale(x:number,y?:number){
    this.g.scale(x,y);
  }

  push(){
    this.g.push();
  }

  pop(){
    this.g.pop();
  }

  pushStyle(){
    this.g.pushStyle();
  }

  popStyle(){
    this.g.popStyle();
  }

  pushMatrix(){
    this.g.pushMatrix();
  }

  popMatrix(){
    this.g.popMatrix();
  }

  resetMatrix(){
    this.g.resetMatrix();
  }

  beginShape(mode?:number){
    this.g.beginShape(mode);
  }

  vertex(x:number,y:number){
    this.g.vertex(x,y);
  }

  endShape(mode?:number){
    this.g.endShape(mode);
  }

  _keyPressed(e:KeyEvent){}

  _keyTyped(e:KeyEvent){}

  _keyReleased(e:KeyEvent){}

  _mousePressed(e:MouseEvent){}

  _mouseReleased(e:MouseEvent){}

  _mouseMoved(e:MouseEvent){}

  _mouseWheel(e:MouseEvent){}

  _windowResized(){}

  color(...color:number[]):number{
    let result=0xffffffff;
    color=color.map(c=>Math.max(Math.min(c,255),0));
    if(color.length==1){
      result=0xff000000|color[0]<<16|color[0]<<8|color[0];
    }else if(color.length==2){
      result=color[1]<<24|color[0]<<16|color[0]<<8|color[0];
    }else if(color.length==3){
      result=0xff000000|color[2]<<16|color[1]<<8|color[0];
    }else if(color.length==4){
      result=color[3]<<24|color[2]<<16|color[1]<<8|color[0];
    }else{
      throw new Error("Invalid color length: "+color.length);
    }
    return result;
  }

  red(c:number){
    return c&0xff;
  }

  green(c:number){
    return (c>>8)&0xff;
  }

  blue(c:number){
    return (c>>16)&0xff;
  }

  alpha(c:number){
    return c>>>24;
  }

  lerpColor(c1:number,c2:number,amt:number){
    amt=this.constrain(amt,0,1);
    const c1_arr=[c1&0xff,(c1>>8)&0xff,(c1>>16)&0xff,c1>>>24];
    const c2_arr=[c2&0xff,(c2>>8)&0xff,(c2>>16)&0xff,c2>>>24];
    return this.color(this.lerp(c1_arr[0],c2_arr[0],amt),this.lerp(c1_arr[1],c2_arr[1],amt),this.lerp(c1_arr[2],c2_arr[2],amt),this.lerp(c1_arr[3],c2_arr[3],amt));
  }

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

  random(min:number,max:number){
    if(max==undefined)max=min,min=0;
    return Math.random()*(max-min)+min;
  }

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
    return new PImage(this,{pixels:[],width,height,format});
  }

  createGraphics(width:number,height:number,renderer:string):PGraphics{
    return new PGraphics(this,{x:width,y:height});
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

  loop(){
    this.__loop__=true;
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