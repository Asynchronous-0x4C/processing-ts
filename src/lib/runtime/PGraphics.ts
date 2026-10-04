import { BitmapText, CanvasTextMetrics, Matrix, RenderTexture, Text, Texture } from "pixi.js";
import { PImage } from "./PImage";
import { PApplet } from "./PApplet";
import { PGraphicsContext } from "./PGraphicsContext";
import { PFont } from "./PFont";

export class PGraphics extends PImage{
  __matrix_stack__:Matrix[]=[];
  context:PGraphicsContext;

  private initialized:boolean=false;

  constructor(parent:PApplet,canvas?:HTMLCanvasElement|{x:number,y:number}){
    super(parent);
    this.parent=parent;
    this.context=new PGraphicsContext();
    if(canvas){
      if(canvas instanceof HTMLCanvasElement){
        this.context.canvas=canvas;
      }else{
        this.texture=RenderTexture.create({width:canvas.x,height:canvas.y});
      }
    }
  }

  async init(width:number,height:number){
    if(this.initialized){
      this.parent.println("Renderer already initialized");
      return;
    }
    this.initialized=true;
    this.width=width;
    this.height=height;
    if(this.context.canvas!=null){
      await this.parent.__app__.init({width:width,height:height,backgroundColor:"#dddddd",clearBeforeRender:false,preserveDrawingBuffer:true,antialias:true,canvas:this.context.canvas,resolution:window.devicePixelRatio||1,});
      this.parent.__app__.renderer.resize(width,height);
      this.parent.__app__.stage.addChild(this.context.graphics);
    }
    this.context.graphics.renderable=false;
    this.__begin__();
    // Processing starts the sketch window gray (204); createGraphics() surfaces start transparent.
    if(this.context.canvas!=null)this.background(204);
  }

  background(c1:number|PImage,c2?:number,c3?:number,c4?:number){
    const mat=this.context.graphics.getTransform()!.clone()!;
    this.context.graphics.resetTransform();
    this.context.graphics.clear();
    this.context.graphics.save();
    if(c1 instanceof PImage){
      this.image(c1,0,0,this.parent.__app__.renderer.width,this.parent.__app__.renderer.height);
    }else{
      const _color=convert_color([c1,c2,c3,c4].filter(c=>c!=null)as number[],this.context.color_mode);
      const {r,g,b,a}={r:_color[0],g:_color[1],b:_color[2],a:_color[3]};
      if(this.parent.__app__.renderer!=null)this.parent.__app__.renderer.background.color={r:r,g:g,b:b,a:a};
      this.context.graphics.rect(0,0,this.parent.__app__.renderer.width??innerWidth,this.parent.__app__.renderer.height??innerHeight);
      this.context.graphics.fill(this.context.color_mode.mode==1?{color:{r:r,g:g,b:b,a:a}}:{color:{h:r,s:g,v:b,a:a}});
      this.context.graphics.stroke({color:0x000000,alpha:0});
    }
    this.context.graphics.restore();
    this.context.graphics.setTransform(mat);
  }

  colorMode(mode:number,...max:number[]){
    if(max.length==1){
      this.context.color_mode={mode,X:max[0],Y:max[0],Z:max[0],A:this.context.color_mode.A};
    }else{
      this.context.color_mode={mode,X:max[0]??this.context.color_mode.X,Y:max[1]??this.context.color_mode.Y,Z:max[2]??this.context.color_mode.Z,A:max[3]??this.context.color_mode.A};
    }
    this.context.colorMode(mode);
  }

  blendMode(mode:number){
  }

  fill(...color:number[]){
    const _color=convert_color(color,this.context.color_mode);
    this.context.fill(_color[0],_color[1],_color[2],_color[3]);
  }

  noFill(){
    this.context.noFill();
  }

  stroke(...color:number[]){
    const _color=convert_color(color,this.context.color_mode);
    this.context.stroke(_color[0],_color[1],_color[2],_color[3]);
  }

  noStroke(){
    this.context.noStroke();
  }

  strokeWeight(weight:number){
    this.context.strokeWeight(weight);
  }

  rectMode(mode:number){
    this.context.rectMode(mode);
  }

  ellipseMode(mode:number){
    this.context.ellipseMode(mode);
  }

  textAlign(align:number){
    this.context.textAlign(align);
  }

  textSize(size:number){
    this.context.textSize(size);
  }

  textWidth(str:string):number{
    return CanvasTextMetrics.measureText(str,this.context.text_style).width;
  }

  createFont(name:string,size:number){
    return this.context.createFont(name,size);
  }

  textFont(font:PFont){
    this.context.textFont(font);
  }

  imageMode(mode:number){
    this.context.imageMode(mode);
  }

  point(x:number,y:number){
    this.circle(x,y,1);
  }

  rect(x:number,y:number,width:number,height:number){
    switch(this.context.rect_mode){
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
        this.parent.println("Unknown rect mode: "+this.context.rect_mode);
        break;
    }
    this.context.graphics.rect(x,y,width,height);
    this.context.applySettings();
  }

  quad(x1:number,y1:number,x2:number,y2:number,x3:number,y3:number,x4:number,y4:number){
    this.context.graphics.poly([x1,y1,x2,y2,x3,y3,x4,y4]);
    this.context.applySettings();
  }

  ellipse(x:number,y:number,width:number,height:number){
    switch(this.context.ellipse_mode){
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
        this.parent.println("Unknown ellipse mode: "+this.context.ellipse_mode);
        break;
    }
    this.context.graphics.ellipse(x,y,width*0.5,height*0.5);
    this.context.applySettings();
  }

  circle(x:number,y:number,r:number){
    this.ellipse(x,y,r,r);
  }

  arc(x:number,y:number,width:number,height:number,start:number,stop:number){
    const mat=this.context.graphics.getTransform()!.clone()!;
    this.context.graphics.translateTransform(x,y);
    this.context.graphics.scaleTransform(1.0,height/width);
    this.context.graphics.moveTo(width*0.5*Math.cos(start),width*0.5*Math.sin(start));
    this.context.graphics.arc(0,0,width*0.5,start,stop);
    this.context.graphics.setTransform(mat);
    this.context.applySettings();
  }

  triangle(x1:number,y1:number,x2:number,y2:number,x3:number,y3:number){
    this.context.graphics.moveTo(x1,y1);
    this.context.graphics.lineTo(x2,y2);
    this.context.graphics.lineTo(x3,y3);
    this.context.graphics.lineTo(x1,y1);
    this.context.applySettings();
  }

  line(x1:number,y1:number,x2:number,y2:number){
    this.context.graphics.moveTo(x1,y1);
    this.context.graphics.lineTo(x2,y2);
    this.context.graphics.moveTo(0,0);
    this.context.applySettings();
  }

  text(text:string,x:number,y:number,w?:number,h?:number){
    if(!this.context.text_style)return;
    this.context.text_style.fill=this.context.fill_style.color!;
    switch(this.context.text_style.align){
      case "center":
        x-=this.textWidth(text)*0.5;
        break;
      case "left":
        break;
      case "right":
        x-=this.textWidth(text);
        break;
      case "justify":
        break;
    }
    if(!w){
      this.context.text_style.breakWords=false;
      this.context.text_style.wordWrap=false;
      this.context.text_style.wordWrapWidth=0;
    }else{
      this.context.text_style.breakWords=true;
      this.context.text_style.wordWrap=true;
      this.context.text_style.wordWrapWidth=w;
    }
    const style=this.context.text_style.clone();
    style.fontFamily=this.context.current_font.id;
    const text_obj=new BitmapText({text:text,style:style});
    const mat=this.context.graphics.getTransform()!.clone()!;
    if(w&&h){
      text_obj.width=w;
      text_obj.height=h;
    }
    const key=`font:${style.fontFamily},text:${text},size:${style.fontSize}`;
    let tex:{texture:Texture,frame:number};
    if(this.context.texture_cache.has(key)){
      tex=this.context.texture_cache.get(key)!;
      tex.frame=this.parent.frameCount;
    }else{
      tex={texture:this.parent.__app__.renderer.generateTexture(text_obj),frame:this.parent.frameCount};
      this.context.texture_cache.set(key,tex);
    }
    this.context.graphics.rect(0,0,0,0);
    this.context.graphics.fill({color:0xffffff});
    this.context.graphics.stroke({color:0x00000000});
    this.context.graphics.texture(tex.texture,this.context.fill_style.color!,x,y-this.context.text_style.fontSize*0.75);
    this.context.applySettings();
    this.__render__();
  }

  image(image:PImage,x:number,y:number,w?:number,h?:number){
    if(image.texture!=null){
      if(image.__pixel_modified__)image.updatePixels();
      w=w??image.width;
      h=h??image.height;
      switch(this.context.image_mode){
        case 0: // CORNER
          break;
        case 1: // CORNERS
          w = w-x;
          h = h-y;
          break;
        case 3: // CENTER
          x-=w*0.5;
          y-=h*0.5;
          break;
        default:
          this.parent.println("Unknown image mode: "+this.context.image_mode);
          break;
      }
      this.context.graphics.rect(0,0,0,0);
      this.context.graphics.fill({color:0xffffff});
      this.context.graphics.stroke({color:0x00000000});
      this.context.graphics.texture(image.texture,0xffffff,x,y,w,h);
      this.context.applySettings();
    }
    this.__render__();
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

  pushMatrix(){
    this.__matrix_stack__.unshift(this.getTransform());
  }

  popMatrix(){
    const mat=this.__matrix_stack__.shift();
    if(mat==undefined){
      this.parent.println("You must call \"pushMatrix()\" first.");
      return;
    }
    this.setTransform(mat);
  }

  getTransform(){
    return this.context.graphics.getTransform().clone()??new Matrix();
  }

  setTransform(mat:Matrix){
    this.context.graphics.setTransform(mat.clone());
  }

  clearTransform(){
    this.context.graphics.resetTransform();
  }

  push(){
    this.context.graphics.save();
  }

  pop(){
    this.context.graphics.restore();
  }

  pushStyle(){
    this.context.pushStyle();
  }

  popStyle(){
    this.context.popStyle();
  }

  resetMatrix(){
    this.clearTransform();
  }

  beginShape(mode?:number){
    this.context.shape_mode=mode??0;
    this.context.shape_buffer=[];
  }

  vertex(x:number,y:number){
    if(this.context.shape_buffer!=null){
      this.context.shape_buffer.push(x,y);
    }
  }

  endShape(mode?:number){
    if(!this.context.shape_buffer)return;
    const close=mode==2;
    switch(this.context.shape_mode){
      case 0:
        this.context.graphics.poly(this.context.shape_buffer,close);
        this.context.applySettings();
        break;
      case 3://POINTS
        for(let i=0;i<this.context.shape_buffer.length;i+=2){
          this.point(this.context.shape_buffer[i],this.context.shape_buffer[i+1]);
        }
        break;
      case 5://LINES
        for(let i=0;i<this.context.shape_buffer.length;i+=4){
          this.line(this.context.shape_buffer[i],this.context.shape_buffer[i+1],this.context.shape_buffer[i+2],this.context.shape_buffer[i+3]);
        }
        break;
      case 9://TRIANGLES
        for(let i=0;i<this.context.shape_buffer.length;i+=6){
          this.triangle(this.context.shape_buffer[i],this.context.shape_buffer[i+1],this.context.shape_buffer[i+2],this.context.shape_buffer[i+3],this.context.shape_buffer[i+4],this.context.shape_buffer[i+5]);
        }
        break;
      case 10://TRIANGLE_STRIP
        for(let i=0;i<this.context.shape_buffer.length-4;i+=2){
          this.triangle(this.context.shape_buffer[i],this.context.shape_buffer[i+1],this.context.shape_buffer[i+2],this.context.shape_buffer[i+3],this.context.shape_buffer[i+4],this.context.shape_buffer[i+5]);
        }
        break;
      case 11://TRIANGLE_FAN
        for(let i=2;i<this.context.shape_buffer.length;i+=2){
          const x= i+2>this.context.shape_buffer.length?2:i+2;
          const y= i+3>this.context.shape_buffer.length?3:i+3;
          this.triangle(this.context.shape_buffer[0],this.context.shape_buffer[1],this.context.shape_buffer[i],this.context.shape_buffer[i+1],this.context.shape_buffer[x],this.context.shape_buffer[y]);
        }
        break;
      case 17://QUADS
        for(let i=0;i<this.context.shape_buffer.length;i+=8){
          this.quad(this.context.shape_buffer[i],this.context.shape_buffer[i+1],this.context.shape_buffer[i+2],this.context.shape_buffer[i+3],this.context.shape_buffer[i+4],this.context.shape_buffer[i+5],this.context.shape_buffer[i+6],this.context.shape_buffer[i+7]);
        }
        break;
      case 18://QUADS_STRIP
        for(let i=0;i<this.context.shape_buffer.length-4;i+=4){
          this.quad(this.context.shape_buffer[i],this.context.shape_buffer[i+1],this.context.shape_buffer[i+2],this.context.shape_buffer[i+3],this.context.shape_buffer[i+6],this.context.shape_buffer[i+7],this.context.shape_buffer[i+4],this.context.shape_buffer[i+5]);
        }
        break;
    }
  }

  beginDraw(){
  }

  endDraw(){
    if(this.texture instanceof RenderTexture){
      this.context.graphics.renderable=true;
      this.parent.__app__.renderer.render({container:this.context.graphics,target:this.texture,clear:false})
      this.context.graphics.renderable=false;
    }
    this.loadPixels();
  }

  __begin__(){
    this.context.graphics.resetTransform();
  }

  __end__(){
    this.__render__();
    if(this.parent.__loop__)this.context.graphics?.clear();
    for(let [k,c] of this.context.texture_cache){
      if(c.frame<this.parent.frameCount-60){
        c.texture.destroy(true);
        this.context.texture_cache.delete(k);
      }
    }
    return 0;
  }

  __stop__(){
    this.context.graphics.renderable=true;
    this.parent.__app__.render();
    this.context.graphics.renderable=false;
  }

  __render__(){
    this.push();
    this.context.graphics.renderable=true;
    this.parent.__app__.render();
    this.context.graphics.renderable=false;
    if(this.parent.__loop__)this.context.graphics?.clear();
    this.pop();
  }

  updateResolution(r:number){
    this.parent.__app__.renderer.resize(this.parent.__app__.renderer.width,this.parent.__app__.renderer.height,r);
  }
}

/**
 * fill(x)/stroke(x)/background(x) with one value (and an optional alpha): an int with no alpha bits that
 * fits the color mode's range is a gray level, anything else is an ARGB color (0xAARRGGBB, as Processing's
 * color ints and #RRGGBB literals are).
 */
function isArgb(c:number,color_mode:{X:number}){
  return Number.isInteger(c)&&((c&0xff000000)!==0||c>color_mode.X||c<0);
}

/** ARGB int → values in the current color mode's units. */
function argbToMode(c:number,alpha:number|null,color_mode:{mode:number,X:number,Y:number,Z:number,A:number}):number[]{
  const r=(c>>16)&0xff,g=(c>>8)&0xff,b=c&0xff;
  const a=alpha??((c>>>24)/255*color_mode.A);
  if(color_mode.mode==1)return [r/255*color_mode.X,g/255*color_mode.Y,b/255*color_mode.Z,a];
  // HSB
  const max=Math.max(r,g,b),min=Math.min(r,g,b),d=max-min;
  let h=0;
  if(d!==0)h=max===r?((g-b)/d+6)%6:max===g?(b-r)/d+2:(r-g)/d+4;
  return [h/6*color_mode.X,(max===0?0:d/max)*color_mode.Y,max/255*color_mode.Z,a];
}

function convert_color(color:number[],color_mode:{mode:number,X:number,Y:number,Z:number,A:number}){
  const def=color_mode.mode==1?[255,255,255,1]:[360,100,100,1];
  if(color.length==1){
    if(isArgb(color[0],color_mode)){
      color=argbToMode(color[0],null,color_mode);
    }else{
      color=[color[0]/color_mode.X*color_mode.Z,color[0]/color_mode.X*color_mode.Z,color[0]/color_mode.X*color_mode.Z,color_mode.A];
      if(color_mode.mode!=1)color=[0,0,color[2],color_mode.A];
    }
  }else if(color.length==2){
    if(isArgb(color[0],color_mode)){
      color=argbToMode(color[0],color[1],color_mode);
    }else{
      color=[color[0]/color_mode.X*color_mode.Z,color[0]/color_mode.X*color_mode.Z,color[0]/color_mode.X*color_mode.Z,color[1]];
      if(color_mode.mode!=1)color=[0,0,color[2],color[1]];
    }
  }else if(color.length==3){
    color=[color[0],color[1],color[2],color_mode.A];
  }else if(color.length==4){
    color=[color[0],color[1],color[2],color[3]];
  }else{
    throw new Error("Invalid color length: "+color.length);
  }
  return [(color[0]??0)/color_mode.X*def[0],(color[1]??0)/color_mode.Y*def[1],(color[2]??0)/color_mode.Z*def[2],(color[3]??255)/color_mode.A*def[3]];
}