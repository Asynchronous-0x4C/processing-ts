import { PImage } from "./PImage";
import { Renderer } from "./renderer/Renderer";

export class PGraphics extends PImage{
  renderer:Renderer;

  constructor(renderer:Renderer){
    super();
    this.renderer=renderer;
  }

  async init(width:number,height:number){
    await this.renderer.init(width,height);
    this.width=this.renderer.app!.screen.width;
    this.height=this.renderer.app!.screen.height;
  }

  background(...color:number[]){
    const _color=convert_color(color);
    this.renderer.background(_color[0],_color[1],_color[2],_color[3]);
  }

  fill(...color:number[]){
    const _color=convert_color(color);
    this.renderer.fill(_color[0],_color[1],_color[2],_color[3]);
  }

  noFill(){
    this.renderer.noFill();
  }

  stroke(...color:number[]){
    const _color=convert_color(color);
    this.renderer.stroke(_color[0],_color[1],_color[2],_color[3]);
  }

  noStroke(){
    this.renderer.noStroke();
  }

  strokeWeight(weight:number){
    this.renderer.strokeWeight(weight);
  }

  rectMode(mode:number){
    this.renderer.rectMode(mode);
  }

  textAlign(align:number){
    this.renderer.textAlign(align);
  }

  textSize(size:number){
    this.renderer.textSize(size);
  }

  rect(x:number,y:number,width:number,height:number){
    this.renderer.rect(x,y,width,height);
  }

  ellipse(x:number,y:number,width:number,height:number){
    this.renderer.ellipse(x,y,width,height);
  }

  arc(x:number,y:number,width:number,height:number,start:number,stop:number){
    this.renderer.arc(x,y,width,height,start,stop);
  }

  triangle(x1:number,y1:number,x2:number,y2:number,x3:number,y3:number){
    this.renderer.triangle(x1,y1,x2,y2,x3,y3);
  }

  line(x1:number,y1:number,x2:number,y2:number){
    this.renderer.line(x1,y1,x2,y2);
  }

  text(text:string,x:number,y:number,w?:number,h?:number){
    this.renderer.text(text,x,y,w,h);
  }

  image(image:PImage,x:number,y:number,w?:number,h?:number){
    this.renderer.image(image,x,y,w,h);
  }

  translate(x:number,y:number){
    this.renderer.translate(x,y);
  }

  __begin__(){
    this.renderer.__begin__();
  }

  __end__(){
    this.renderer.__end__();
  }

  __stop__(){
    this.renderer.__stop__();
  }
}

function convert_color(color:number[]){
  if(color.length==1){
    color=[color[0],color[0],color[0],1];
  }else if(color.length==2){
    color=[color[0],color[0],color[0],color[1]/255];
  }else if(color.length==3){
    color=[color[0],color[1],color[2],1];
  }else if(color.length==4){
    color=[color[0],color[1],color[2],color[3]/255];
  }else{
    throw new Error("Invalid color length: "+color.length);
  }
  return [color[0]??0,color[1]??0,color[2]??0,color[3]??1];
}