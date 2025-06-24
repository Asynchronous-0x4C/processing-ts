import { PConstants } from "./PConstants";
import { PGraphics } from "./PGraphics";
import { PImage } from "./PImage";
import { PSurface } from "./PSurface";
import { JSONObject } from "./data/JSONObject";
import { KeyEvent } from "./event/KeyEvent";
import { MouseEvent } from "./event/MouseEvent";
import { Renderer } from "./renderer/Renderer";
import { base_uri } from "./worker/worker_data";
import { IOBase } from "./util/sketchio/IOBase";
import { JSONArray } from "./data/JSONArray";

const date=new Date();

export class PApplet extends PConstants{
  g:PGraphics;
  surface:PSurface=new PSurface(this);
  __io__:IOBase|null=null;
  __fullscreen__:boolean=false;

  private __exit_code__=0;

  max_size:{width:number,height:number}={width:0,height:0};
  width:number=0;
  height:number=0;
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

  constructor(renderer:Renderer){
    super();
    if(renderer!=null){
      this.max_size=renderer.getMaximumSize();
      this.__io__=renderer.__io__;
    }
    this.g=new PGraphics(renderer);
  }

  __set_preload__(buffer:{path:string, content:ArrayBuffer}[]){
    if(this.__io__)this.__io__.preload=buffer;
  }

  async settings(){}

  async setup(){}

  async draw(){}

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

  background(...color:number[]){
    this.g.background(...color);
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

  textAlign(align:number){
    this.g.textAlign(align);
  }

  textSize(size:number){
    this.g.textSize(size);
  }

  rect(x:number,y:number,width:number,height:number){
    this.g.rect(x,y,width,height);
  }

  ellipse(x:number,y:number,width:number,height:number){
    this.g.ellipse(x,y,width,height);
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

  _keyPressed(e:KeyEvent){}

  _keyReleased(e:KeyEvent){}

  _mousePressed(e:MouseEvent){}

  _mouseReleased(e:MouseEvent){}

  _mouseMoved(e:MouseEvent){}

  _mouseWheel(e:MouseEvent){}

  _windowResized(){}

  year(){
    return date.getFullYear();
  }

  month(){
    return date.getMonth()+1;
  }

  day(){
    return date.getDate();
  }

  hour(){
    return date.getHours();
  }

  minute(){
    return date.getMinutes();
  }

  second(){
    return date.getSeconds();
  }

  millis(){
    return date.getMilliseconds();
  }

  radians(degrees:number){
    return degrees * (Math.PI / 180);
  }

  degrees(radians:number){
    return radians * (180 / Math.PI);
  }

  constrain(x:number,min:number,max:number){
    if(x<min)return min;
    if(x>max)return max;
    return x;
  }

  random(min:number,max:number){
    if(max==undefined)max=min,min=0;
    return Math.random()*(max-min)+min;
  }

  abs(x:number){
    return Math.abs(x);
  }

  floor(x:number){
    return Math.floor(x);
  }

  noise(x: number, y: number = 0, z: number = 0): number {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const Z = Math.floor(z) & 255;

    x -= Math.floor(x);
    y -= Math.floor(y);
    z -= Math.floor(z);

    const u = this.fade(x);
    const v = this.fade(y);
    const w = this.fade(z);

    const A = this.permutation[X] + Y;
    const AA = this.permutation[A] + Z;
    const AB = this.permutation[A + 1] + Z;
    const B = this.permutation[X + 1] + Y;
    const BA = this.permutation[B] + Z;
    const BB = this.permutation[B + 1] + Z;

    return this.lerp(
      this.lerp(
        this.lerp(this.grad(this.permutation[AA], x, y, z), this.grad(this.permutation[BA], x - 1, y, z), u),
        this.lerp(this.grad(this.permutation[AB], x, y - 1, z), this.grad(this.permutation[BB], x - 1, y - 1, z), u),
        v
      ),
      this.lerp(
        this.lerp(this.grad(this.permutation[AA + 1], x, y, z - 1), this.grad(this.permutation[BA + 1], x - 1, y, z - 1), u),
        this.lerp(this.grad(this.permutation[AB + 1], x, y - 1, z - 1), this.grad(this.permutation[BB + 1], x - 1, y - 1, z - 1), u),
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
    console.log(...args);
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
    const img=new PImage();
    const result=this.__io__!.load_as_blob(path,`image/${path.split(".").pop()?.toLowerCase()??"png"}`);
    if(result!=null){
      img.load_from_blob(result);
      return img;
    }
    return null;
  }

  loadJSONObject(path:string){
    const result=this.__io__!.load_as_string(base_uri+path);
    if(result!=null){
      return JSONObject.parse(result);
    }
    return null;
  }

  saveJSONObject(path:string,data:JSONObject){
    this.__io__?.save_string(path,data.toString());
  }

  loadJSONArray(path:string){
    const result=this.__io__!.load_as_string(base_uri+path);
    if(result!=null){
      return JSONArray.parse(result);
    }
    return null;
  }

  saveJSONArray(path:string,data:JSONArray){
    this.__io__?.save_string(path,data.toString());
  }

  exit(){
    this.__exit_code__=1;
  }

  __begin__(){
    this.g.__begin__();
  }

  __end__(){
    this.g.__end__();
    return this.__exit_code__;
  }

  __stop__(){
    this.g.background(255);
    this.g.__stop__();
  }

  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  private lerp(a: number, b: number, t: number): number {
    return a + t * (b - a);
  }

  private grad(hash: number, x: number, y: number, z: number): number {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  private permutation = (() => {
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