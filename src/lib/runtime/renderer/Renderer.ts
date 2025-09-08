import { Application, ColorSource, Container, Graphics, StrokeStyle, TextStyle, Text, Matrix } from "pixi.js";
import { PImage } from "../PImage";
import { IOBase } from "../util/sketchio/IOBase";
import { PGraphics } from "../PGraphics";
import { PGraphicsContext } from "../PGraphicsContext";

export abstract class Renderer{
  public app:Application|null=null;
  graphics:Graphics|null=null;
  g:PGraphics|null=null;
  public abstract canvas:HTMLCanvasElement|OffscreenCanvas;
  target_element:HTMLDivElement|null=null;
  abstract __io__:IOBase;

  context:PGraphicsContext[]=[];

  text_style:TextStyle|null=null;
  stroke_style:StrokeStyle|null=null;
  font_size:number=12;
  font_family:string="Arial";
  text_align:"left"|"center"|"right"|"justify"="left";

  public rect_mode:number=0;
  public ellipse_mode:number=3;

  private shape_buffer:number[]|null=null;
  private shape_mode:number=0;

  public fill_enabled:boolean=true;
  public stroke_enabled:boolean=true;
  public fill_color:ColorSource=0xffffff;
  public stroke_color:ColorSource=0x000000;

  current_cursor:string="default";

  initialized:boolean=false;

  async init(width:number,height:number,){
    if(this.initialized){
      console.warn("Renderer already initialized");
      return;
    }
    this.initialized=true;
    this.app=new Application()
    this.graphics=new Graphics();
    if(width===0&&height===0){
      width=this.getMaximumSize().width;
      height=this.getMaximumSize().height;
    }
    await this.app.init({width:width,height:height,backgroundColor:"#dddddd",clearBeforeRender:false,preserveDrawingBuffer:true,antialias:true,canvas:this.canvas,resolution:window.devicePixelRatio||1,});
    this.app.renderer.resize(width,height);
    this.app.stage.addChild(this.graphics);
    this.graphics.renderable=false;
    this.text_style=new TextStyle({fontFamily:this.font_family,fontSize:this.font_size,fill:"#000000",align:"left"});
    this.stroke_style = {width:1,color:0x000000,cap:"round",join:"round",miterLimit:10};
    this.__begin__();
  }

  setPGraphics(g:PGraphics){
    this.g=g;
  }
  
  background(ctx:PGraphicsContext,r:number|PImage,g?:number,b?:number,a?:number){
    const mat=this.graphics?.getTransform()!.clone()!;
    this.graphics?.resetTransform();
    this.graphics?.clear();
    this.graphics?.save();
    if(r instanceof PImage){
      this.image(r,0,0,this.app?.renderer.width,this.app?.renderer.height);
    }else if(g&&b&&a){
      if(this.app!.renderer!=null)this.app!.renderer.background.color={r:r,g:g,b:b,a:a};
      this.graphics?.rect(0,0,this.app?.renderer.width??innerWidth,this.app?.renderer.height??innerHeight);
      this.graphics?.fill(ctx.color_mode.mode==1?{color:{r:r,g:g,b:b,a:a}}:{color:{h:r,s:g,v:b,a:a}});
      this.graphics?.stroke({color:0x000000,alpha:0});
    }
    this.graphics?.restore();
    this.graphics?.setTransform(mat);
  }

  point(x:number,y:number){
    this.circle(x,y,1);
  }

  rect(x:number,y:number,width:number,height:number){
    switch(this.rect_mode){
      case 0: // CORNER
        break;
      case 1: // CORNERS
        width = width-x;
        height = height-y;
        break;
      case 2: // RADIUS
        x-=width*0.5;
        y-=height*0.5;
        width*=2;
        height*=2;
        break;
      case 3: // CENTER
        x-=width*0.5;
        y-=height*0.5;
        break;
      case 4: // DIAMETER
        x-=width*0.5;
        y-=height*0.5;
        width*=2;
        height*=2;
        break;
      default:
        console.warn("Unknown rect mode: "+this.rect_mode);
        break;
    }
    this.graphics?.rect(x,y,width,height);
    this.applySettings();
  }

  quad(x1:number,y1:number,x2:number,y2:number,x3:number,y3:number,x4:number,y4:number){
    this.graphics?.poly([x1,y1,x2,y2,x3,y3,x4,y4]);
    this.applySettings();
  }

  ellipse(x:number,y:number,width:number,height:number){
    switch(this.ellipse_mode){
      case 0:
        x = x-width*0.5;
        y = y-height*0.5;
        break;
      case 1:
        width = width-x;
        height = height-y;
        x = x-width*0.5;
        y = y-height*0.5;
        break;
      case 2:
        width *= 2;
        height *= 2;
        break;
      case 3:
        break;
      default:
        console.warn("Unknown ellipse mode: "+this.ellipse_mode);
        break;
    }
    this.graphics?.ellipse(x,y,width*0.5,height*0.5);
    this.applySettings();
  }

  circle(x:number,y:number,r:number){
    this.ellipse(x,y,r,r);
  }

  arc(x:number,y:number,width:number,height:number,start:number,stop:number){
    const mat=this.graphics?.getTransform()!.clone()!;
    this.graphics?.translateTransform(x,y);
    this.graphics?.scaleTransform(1.0,height/width);
    this.graphics?.moveTo(width*0.5*Math.cos(start),width*0.5*Math.sin(start));
    this.graphics?.arc(0,0,width*0.5,start,stop);
    this.graphics?.setTransform(mat);
    this.applySettings();
  }

  triangle(x1:number,y1:number,x2:number,y2:number,x3:number,y3:number){
    this.graphics?.moveTo(x1,y1);
    this.graphics?.lineTo(x2,y2);
    this.graphics?.lineTo(x3,y3);
    this.graphics?.lineTo(x1,y1);
    this.applySettings();
  }

  line(x1:number,y1:number,x2:number,y2:number){
    this.graphics?.moveTo(x1,y1);
    this.graphics?.lineTo(x2,y2);
    this.graphics?.moveTo(0,0);
    this.applySettings();
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
    text_obj;
    this.graphics?.texture(this.app!.renderer.generateTexture(text_obj),undefined,x,y);
    // this.text_container!.addChild(text_obj);
  }

  image(image:PImage,x:number,y:number,w?:number,h?:number){
    if(image.texture!=null)this.graphics?.texture(image.texture,0xffffff,x,y,w,h);
  }

  translate(x:number,y:number){
    const mat=this.getTransform();
    const t=new Matrix().translate(x,y);
    mat.append(t);
    this.setTransform(mat);
  }

  rotate(angle:number){
    const mat=this.getTransform();
    const t=new Matrix().rotate(angle);
    mat.append(t);
    this.setTransform(mat);
  }

  scale(x:number,y?:number){
    const mat=this.getTransform();
    const t=new Matrix().scale(x,y??x);
    mat.append(t);
    this.setTransform(mat);
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

  getTransform(){
    return this.graphics?.getTransform().clone()??new Matrix();
  }

  setTransform(mat:Matrix){
    this.graphics?.setTransform(mat.clone());
  }

  clearTransform(){
    this.graphics?.resetTransform();
  }

  push(){
    this.graphics?.save();
  }

  pop(){
    this.graphics?.restore();
  }

  beginShape(mode?:number){
    this.shape_mode=mode??0;
    this.shape_buffer=[];
  }

  vertex(x:number,y:number){
    if(this.shape_buffer!=null){
      this.shape_buffer.push(x,y);
    }
  }

  endShape(mode?:number){
    if(!this.shape_buffer)return;
    const close=mode==2;
    switch(this.shape_mode){
      case 0:
        this.graphics?.poly(this.shape_buffer,close);
        this.applySettings();
        break;
      case 3://POINTS
        for(let i=0;i<this.shape_buffer.length;i+=2){
          this.point(this.shape_buffer[i],this.shape_buffer[i+1]);
        }
        break;
      case 5://LINES
        for(let i=0;i<this.shape_buffer.length;i+=4){
          this.line(this.shape_buffer[i],this.shape_buffer[i+1],this.shape_buffer[i+2],this.shape_buffer[i+3]);
        }
        break;
      case 9://TRIANGLES
        for(let i=0;i<this.shape_buffer.length;i+=6){
          this.triangle(this.shape_buffer[i],this.shape_buffer[i+1],this.shape_buffer[i+2],this.shape_buffer[i+3],this.shape_buffer[i+4],this.shape_buffer[i+5]);
        }
        break;
      case 10://TRIANGLE_STRIP
        for(let i=0;i<this.shape_buffer.length-4;i+=2){
          this.triangle(this.shape_buffer[i],this.shape_buffer[i+1],this.shape_buffer[i+2],this.shape_buffer[i+3],this.shape_buffer[i+4],this.shape_buffer[i+5]);
        }
        break;
      case 11://TRIANGLE_FAN
        for(let i=2;i<this.shape_buffer.length;i+=2){
          const x= i+2>this.shape_buffer.length?2:i+2;
          const y= i+3>this.shape_buffer.length?3:i+3;
          this.triangle(this.shape_buffer[0],this.shape_buffer[1],this.shape_buffer[i],this.shape_buffer[i+1],this.shape_buffer[x],this.shape_buffer[y]);
        }
        break;
      case 17://QUADS
        for(let i=0;i<this.shape_buffer.length;i+=8){
          this.quad(this.shape_buffer[i],this.shape_buffer[i+1],this.shape_buffer[i+2],this.shape_buffer[i+3],this.shape_buffer[i+4],this.shape_buffer[i+5],this.shape_buffer[i+6],this.shape_buffer[i+7]);
        }
        break;
      case 18://QUADS_STRIP
        for(let i=0;i<this.shape_buffer.length-4;i+=4){
          this.quad(this.shape_buffer[i],this.shape_buffer[i+1],this.shape_buffer[i+2],this.shape_buffer[i+3],this.shape_buffer[i+6],this.shape_buffer[i+7],this.shape_buffer[i+4],this.shape_buffer[i+5]);
        }
        break;
    }
  }

  updateResolution(r:number){
    this.app?.renderer.resize(this.app.renderer.width,this.app.renderer.height,r);
  }

  applySettings(){
    this.graphics?.fill(this.fill_enabled?{color:this.fill_color}:{color:0x000000,alpha:0});
    this.graphics?.stroke(this.stroke_enabled?{color:this.stroke_color,width:this.stroke_style!.width,cap:"round"}:{color:0x000000,alpha:0});
  }

  async invoke(name:string,...args:any[]){
    if(this[name as keyof Renderer]){
      await (this[name as keyof Renderer] as Function)(...args);
    }else{
      console.warn("Unknown method: "+name);
    }
  }

  __begin__(){
    if(this.g!.parent.__loop__&&this.g!.parent.frameCount>0)this.graphics?.clear();
    this.graphics?.resetTransform();
  }

  __end__(){
    this.graphics!.renderable=true;
    this.app?.render();
    this.graphics!.renderable=false;
    return 0;
  }

  __stop__(){
    this.graphics!.renderable=true;
    this.app?.render();
    this.graphics!.renderable=false;
  }

  abstract setCursorStyle(arg:string|{image:PImage,x:number,y:number}):void;

  abstract getMaximumSize():{width:number,height:number};
}