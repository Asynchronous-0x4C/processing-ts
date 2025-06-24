import { Application, ColorSource, Container, Graphics, StrokeStyle, TextStyle, Text } from "pixi.js";
import { PImage } from "../PImage";
import { IOBase } from "../util/sketchio/IOBase";

export abstract class Renderer{
  public app:Application|null=null;
  graphics:Graphics|null=null;
  text_container:Container|null=null;
  public abstract canvas:HTMLCanvasElement|OffscreenCanvas;
  target_element:HTMLDivElement|null=null;
  abstract __io__:IOBase;

  text_style:TextStyle|null=null;
  stroke_style:StrokeStyle|null=null;
  font_size:number=12;
  font_family:string="Arial";
  text_align:"left"|"center"|"right"|"justify"="left";

  public rect_mode:number=0;
  public ellipse_mode:number=0;

  public fill_enabled:boolean=true;
  public stroke_enabled:boolean=true;
  public fill_color:ColorSource=0x000000;
  public stroke_color:ColorSource=0x000000;

  current_cursor:string="default";

  initialized:boolean=false;

  async init(width:number,height:number){
    if(this.initialized){
      console.warn("Renderer already initialized");
      return;
    }
    this.initialized=true;
    this.app=new Application()
    this.graphics=new Graphics();
    this.text_container=new Container();
    if(width===0&&height===0){
      width=this.getMaximumSize().width;
      height=this.getMaximumSize().height;
    }
    await this.app.init({width:width,height:height,backgroundColor:"#dddddd",clearBeforeRender:false,preserveDrawingBuffer:true,antialias:true,canvas:this.canvas});
    this.app.renderer.resize(width,height);
    this.app.stage.addChild(this.graphics);
    this.app.stage.addChild(this.text_container);
    this.text_style=new TextStyle({fontFamily:this.font_family,fontSize:this.font_size,fill:"#000000",align:"left"});
    this.stroke_style = {width:1,color:0x000000,cap:"round",join:"round",miterLimit:10};
  }
  
  background(r:number,g:number,b:number,a:number){
    const mat=this.graphics?.getTransform()!.clone()!;
    this.graphics?.clear();
    this.text_container?.removeChildren(0,this.text_container!.children.length);
    if(this.app!.renderer!=null)this.app!.renderer.background.color={r:r,g:g,b:b,a:a};
    this.graphics?.rect(0,0,innerWidth,innerHeight);
    this.graphics?.fill({color:{r:r,g:g,b:b,a:a}});
    this.graphics?.stroke({color:0x000000,alpha:0});
    this.graphics?.setTransform(mat);
  }

  fill(r:number,g:number,b:number,a:number){
    this.fill_enabled=true;
    this.fill_color={r:r,g:g,b:b,a:a};
  }

  noFill(){
    this.fill_enabled=false;
  }

  stroke(r:number,g:number,b:number,a:number){
    this.stroke_enabled=true;
    this.stroke_color={r:r,g:g,b:b,a:a};
  }

  noStroke(){
    this.stroke_enabled=false;
  }

  strokeWeight(weight:number){
    this.stroke_style!.width=weight;
    this.graphics?.setStrokeStyle(this.stroke_style!);
  }

  rectMode(mode:number){
    this.rect_mode=mode;
  }

  textAlign(align:number){
    switch(align){
      case 37:
        this.text_align="left";
        break;
      case 3:
        this.text_align="center";
        break;
      case 39:
        this.text_align="right";
        break;
      default:
        console.warn("Unknown text mode: "+align);
        break;
    }
    this.text_style!.align=this.text_align;
  }

  textSize(size:number){
    this.text_style!.fontSize=size;
  }

  rect(x:number,y:number,width:number,height:number){
    switch(this.rect_mode){
      case 0: // CORNER
        break;
      case 1: // CORNERS
        x-=width/2;
        y-=height/2;
        break;
      case 2: // RADIUS
        x-=width/2;
        y-=height/2;
        width*=2;
        height*=2;
        break;
      case 3: // CENTER
        x-=width/2;
        y-=height/2;
        break;
      case 4: // DIAMETER
        x-=width/2;
        y-=height/2;
        width*=2;
        height*=2;
        break;
      default:
        console.warn("Unknown rect mode: "+this.rect_mode);
        break;
    }
    this.graphics?.rect(x,y,width,height);
    this.graphics?.fill(this.fill_enabled?{color:this.fill_color}:{color:0x000000,alpha:0});
    this.graphics?.stroke(this.stroke_enabled?{color:this.stroke_color}:{color:0x000000,alpha:0});
  }

  ellipse(x:number,y:number,width:number,height:number){
    this.graphics?.ellipse(x,y,width*0.5,height*0.5);
    this.graphics?.fill(this.fill_enabled?{color:this.fill_color}:{color:0x000000,alpha:0});
    this.graphics?.stroke(this.stroke_enabled?{color:this.stroke_color}:{color:0x000000,alpha:0});
  }

  arc(x:number,y:number,width:number,height:number,start:number,stop:number){
    const mat=this.graphics?.getTransform()!.clone()!;
    this.graphics?.translateTransform(x,y);
    this.graphics?.scaleTransform(1.0,height/width);
    this.graphics?.moveTo(width*0.5*Math.cos(start),width*0.5*Math.sin(start));
    this.graphics?.arc(0,0,width*0.5,start,stop);
    this.graphics?.setTransform(mat);
    this.graphics?.fill(this.fill_enabled?{color:this.fill_color}:{color:0x000000,alpha:0});
    this.graphics?.stroke(this.stroke_enabled?{color:this.stroke_color}:{color:0x000000,alpha:0});
  }

  triangle(x1:number,y1:number,x2:number,y2:number,x3:number,y3:number){
    this.graphics?.moveTo(x1,y1);
    this.graphics?.lineTo(x2,y2);
    this.graphics?.lineTo(x3,y3);
    this.graphics?.lineTo(x1,y1);
    this.graphics?.fill(this.fill_enabled?{color:this.fill_color}:{color:0x000000,alpha:0});
    this.graphics?.stroke(this.stroke_enabled?{color:this.stroke_color}:{color:0x000000,alpha:0});
  }

  line(x1:number,y1:number,x2:number,y2:number){
    this.graphics?.moveTo(x1,y1);
    this.graphics?.lineTo(x2,y2);
    this.graphics?.moveTo(0,0);
    this.graphics?.stroke(this.stroke_enabled?{color:this.stroke_color}:{color:0x000000,alpha:0});
  }

  text(text:string,x:number,y:number,w?:number,h?:number){
    if(!this.text_style)return;
    this.text_style.fill=this.fill_color;
    if(!w){
      this.text_style.breakWords=false;
      this.text_style.wordWrap=false;
      this.text_style.wordWrapWidth=0;
    }else{
      this.text_style.breakWords=true;
      this.text_style.wordWrap=true;
      this.text_style.wordWrapWidth=w;
    }
    const text_obj=new Text({text:text,style:this.text_style.clone()});
    const mat=this.graphics?.getTransform()!.clone()!;
    const pos=mat.apply({x:x,y:y-this.text_style.fontSize*0.75});
    text_obj.x=pos.x;
    text_obj.y=pos.y;
    if(w&&h){
      text_obj.width=w;
      text_obj.height=h;
    }
    this.text_container!.addChild(text_obj);
  }

  image(image:PImage,x:number,y:number,w?:number,h?:number){
    if(image.texture!=null)this.graphics?.texture(image.texture,0xffffff,x,y,w,h);
  }

  translate(x:number,y:number){
    this.graphics?.translateTransform(x,y);
  }
  
  setCursor(...args:any[]){
    if(args.length==1&&args[0].constructor.name=="Number"){
      const kind=args[0] as number;
      let name="auto";
      switch(kind){
        case -1:break;
        case 0:name="default";break;
        case 1:name="crosshair";break;
        case 2:name="text";break;
        case 3:name="wait";break;
        case 4:name="sw-resize";break;
        case 5:name="se-resize";break;
        case 6:name="nw-resize";break;
        case 7:name="ne-resize";break;
        case 8:name="n-resize";break;
        case 9:name="s-resize";break;
        case 10:name="w-resize";break;
        case 11:name="e-resize";break;
        case 12:name="grab";break;
        case 13:name="move";break;
      }
      this.current_cursor=name;
      this.setCursorStyle(name);
    }else if(args.length==3&&args[0].constructor.name=="PImage"&&args[1].constructor.name=="Number"&&args[2].constructor.name=="Number"){
      const {image,hotspotX,hotspotY}={image:args[0] as PImage,hotspotX:args[1] as number,hotspotY:args[2] as number};
      this.setCursorStyle({image:image,x:hotspotX,y:hotspotY});
      console.log(image);
    }
  }

  showCursor(){
    this.setCursorStyle(this.current_cursor);
  }

  hideCursor(){
    this.setCursorStyle("none");
  }

  async invoke(name:string,...args:any[]){
    if(this[name as keyof Renderer]){
      await (this[name as keyof Renderer] as Function)(...args);
    }else{
      console.warn("Unknown method: "+name);
    }
  }

  __begin__(){
    this.graphics?.clear();
    this.text_container?.removeChildren(0,this.text_container!.children.length);
  }

  __end__(){
    return 0;
  }

  __stop__(){
  }

  abstract setCursorStyle(arg:string|{image:PImage,x:number,y:number}):void;

  abstract getMaximumSize():{width:number,height:number};
}