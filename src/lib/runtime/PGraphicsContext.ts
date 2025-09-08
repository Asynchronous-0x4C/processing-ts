import { BitmapFont, ColorSource, FillStyle, Graphics, GraphicsContext, StrokeStyle, TextStyle, TextStyleAlign, Texture } from "pixi.js";
import { PFont } from "./PFont";

type Styles={text:{style:TextStyle,font:PFont},stroke:{style:StrokeStyle,enabled:boolean},fill:{style:FillStyle,enabled:boolean},mode:{rect:number,ellipse:number,image:number}};

export class PGraphicsContext{
  style_buffer:Styles[]=[];
  texture_cache:Map<string,{texture:Texture,frame:number}>=new Map();
  font_cache:Map<string,PFont>=new Map();

  text_style:TextStyle;
  stroke_style:StrokeStyle;
  fill_style:FillStyle;
  color_mode={mode:1,X:255,Y:255,Z:255,A:255};

  current_font:PFont;

  public rect_mode:number=0;
  public ellipse_mode:number=3;
  public image_mode:number=0;

  shape_buffer:number[]|null=null;
  shape_mode:number=0;

  public fill_enabled:boolean=true;
  public stroke_enabled:boolean=true;
  
  graphics:Graphics;
  canvas:HTMLCanvasElement|null=null;

  constructor(){
    this.text_style=new TextStyle({fontFamily:"Arial",fontSize:12,fill:"#000000",align:"left"});
    this.stroke_style={width:1,color:0x000000,cap:"round",join:"round",miterLimit:10};
    this.fill_style={color:0xffffff};
    this.graphics=new Graphics();
    this.current_font=this.createFont("Arial",12);
  }

  textAlign(align:number){
    let text_align:TextStyleAlign="left";
    switch(align){
      case 37:
        text_align="left";
        break;
      case 3:
        text_align="center";
        break;
      case 39:
        text_align="right";
        break;
      default:
        console.warn("Unknown text mode: "+align);
        break;
    }
    this.text_style!.align=text_align;
  }

  textSize(size:number){
    this.text_style!.fontSize=size;
    const key=`name:${this.current_font.name},size:${size}`;
    if(this.font_cache.has(key)){
      this.current_font=this.font_cache.get(key)!;
    }else{
      this.font_cache.set(key,this.createFont(this.current_font.name,size));
    }
  }

  createFont(name:string,size:number){
    const key=`name:${name},size:${size}`;
    if(this.font_cache.has(key)){
      return this.font_cache.get(key)!.clone();
    }
    const font=new PFont(name);
    this.font_cache.set(key,font);
    BitmapFont.install({
      name:font.id,
      style:{
        fontFamily:name,
        fontSize:size,
        fill:0xffffff
      }
    });
    return font;
  }

  textFont(font:PFont){
    this.current_font=font;
  }

  colorMode(mode:number){
    this.color_mode.mode=mode;
  }

  fill(r:number,g:number,b:number,a:number){
    this.fill_enabled=true;
    this.fill_style.color=this.color_mode.mode==1?{r:r,g:g,b:b,a:a}:{h:r,s:g,v:b,a:a};
  }

  noFill(){
    this.fill_enabled=false;
  }

  stroke(r:number,g:number,b:number,a:number){
    this.stroke_enabled=true;
    this.stroke_style.color=this.color_mode.mode==1?{r:r,g:g,b:b,a:a}:{h:r,s:g,v:b,a:a};
  }

  noStroke(){
    this.stroke_enabled=false;
  }

  strokeWeight(weight:number){
    this.stroke_style!.width=weight;
  }

  rectMode(mode:number){
    this.rect_mode=mode;
  }

  ellipseMode(mode:number){
    this.ellipse_mode=mode;
  }

  imageMode(mode:number){
    this.image_mode=mode;
  }

  applySettings(){
    this.graphics.fill(this.fill_enabled?this.fill_style:{color:0x000000,alpha:0});
    this.graphics.stroke(this.stroke_enabled?this.stroke_style:{color:0x000000,alpha:0});
  }

  encodeStyles():Styles{
    return {
      text:{
        style:this.text_style.clone(),
        font:this.current_font.clone()
      },
      stroke:{
        style:structuredClone(this.stroke_style),
        enabled:this.stroke_enabled
      },
      fill:{
        style:structuredClone(this.fill_style),
        enabled:this.fill_enabled
      },
      mode:{
        rect:this.rect_mode,
        ellipse:this.ellipse_mode,
        image:this.image_mode
      }
    };
  }

  decodeStyles(styles:Styles){
    this.text_style=styles.text.style;
    this.current_font=styles.text.font;
    this.stroke_style=styles.stroke.style;
    this.stroke_enabled=styles.stroke.enabled;
    this.fill_style=styles.fill.style;
    this.fill_enabled=styles.fill.enabled;
    this.rect_mode=styles.mode.rect;
    this.ellipse_mode=styles.mode.ellipse;
    this.image_mode=styles.mode.image;
  }

  pushStyle(){
    this.style_buffer.push(this.encodeStyles());
  }

  popStyle(){
    this.decodeStyles(this.style_buffer.shift()!)
  }
}