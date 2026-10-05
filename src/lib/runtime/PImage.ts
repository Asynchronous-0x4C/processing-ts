import { PConstants } from "./PConstants";
import type { PApplet } from "./PApplet";

export type NativeCanvas=HTMLCanvasElement|OffscreenCanvas;
export type Native2D=CanvasRenderingContext2D|OffscreenCanvasRenderingContext2D;

/** A canvas for images and offscreen graphics (OffscreenCanvas when available). */
export function createNativeCanvas(width:number,height:number):NativeCanvas{
  const w=Math.max(1,Math.ceil(width)),h=Math.max(1,Math.ceil(height));
  if(typeof OffscreenCanvas!=="undefined")return new OffscreenCanvas(w,h);
  const c=document.createElement("canvas");
  c.width=w;
  c.height=h;
  return c;
}

const LITTLE_ENDIAN=new Uint8Array(new Uint32Array([1]).buffer)[0]===1;

/** RGBA bytes (ImageData) → ARGB ints. */
export function rgbaToArgb(src:Uint8ClampedArray,dst:Int32Array,opaque=false){
  if(LITTLE_ENDIAN){
    const u=new Uint32Array(src.buffer,src.byteOffset,dst.length);
    for(let i=0;i<dst.length;i++){
      const v=u[i]; // 0xAABBGGRR
      dst[i]=((v&0xff00ff00)|((v&0xff)<<16)|((v>>>16)&0xff))|(opaque?0xff000000:0);
    }
  }else{
    for(let i=0,j=0;i<dst.length;i++,j+=4)dst[i]=((opaque?255:src[j+3])<<24)|(src[j]<<16)|(src[j+1]<<8)|src[j+2];
  }
}

/** ARGB ints → RGBA bytes (ImageData). `opaque` forces alpha 255 (RGB images). */
export function argbToRgba(src:Int32Array|ArrayLike<number>,dst:Uint8ClampedArray,opaque=false){
  if(LITTLE_ENDIAN&&src instanceof Int32Array){
    const u=new Uint32Array(dst.buffer,dst.byteOffset,src.length);
    for(let i=0;i<src.length;i++){
      const v=src[i];
      u[i]=((v&0xff00ff00)|((v&0xff)<<16)|((v>>>16)&0xff)|(opaque?0xff000000:0))>>>0;
    }
  }else{
    for(let i=0,j=0;i<src.length;i++,j+=4){
      const v=src[i];
      dst[j]=(v>>16)&0xff;dst[j+1]=(v>>8)&0xff;dst[j+2]=v&0xff;dst[j+3]=opaque?255:(v>>>24);
    }
  }
}

/**
 * Processing's PImage. `pixels` is an Int32Array of ARGB colors (pixelWidth × pixelHeight), valid after
 * loadPixels(); updatePixels() writes it back to the image's canvas, which is what drawing uses.
 */
export class PImage extends PConstants{
  width:number=0;
  height:number=0;
  pixelDensity:number=1;
  pixelWidth:number=0;
  pixelHeight:number=0;
  /** RGB (1), ARGB (2) or ALPHA (4). */
  format:number=2;
  pixels:Int32Array=new Int32Array(0);
  parent:PApplet|null;

  /** The image's canvas (null while a loaded image is still decoding). */
  __canvas__:NativeCanvas|null=null;
  __ctx__:Native2D|null=null;

  constructor(parent:PApplet|null,settings?:{pixels?:ArrayLike<number>,width:number,height:number,format?:number}){
    super();
    this.parent=parent;
    if(settings){
      this.init(settings.width,settings.height,settings.format??2);
      if(settings.pixels)this.pixels.set(Array.from(settings.pixels).slice(0,this.pixels.length));
      this.updatePixels();
    }
  }

  /** Allocate the canvas and the pixel array for a width × height image. */
  init(width:number,height:number,format=2,density=1){
    this.width=width;
    this.height=height;
    this.format=format;
    this.pixelDensity=density;
    this.pixelWidth=Math.round(width*density);
    this.pixelHeight=Math.round(height*density);
    this.pixels=new Int32Array(this.pixelWidth*this.pixelHeight);
    this.__canvas__=createNativeCanvas(this.pixelWidth,this.pixelHeight);
    this.__ctx__=this.__canvas__.getContext("2d",{willReadFrequently:true}) as Native2D;
  }

  /** Decode an image file; width/height stay 0 until it is ready (as with requestImage()). */
  async load_from_blob(blob:Blob){
    const bmp=await createImageBitmap(blob);
    this.init(bmp.width,bmp.height,blob.type==="image/jpeg"?1:2);
    this.__ctx__!.drawImage(bmp,0,0);
    bmp.close();
    this.loadPixels();
  }

  async load_from_arraybuffer(buffer:ArrayBuffer,type="image/png"){
    await this.load_from_blob(new Blob([buffer],{type}));
  }

  isLoaded(){
    return this.__canvas__!==null;
  }

  /** Canvas to draw this image from. */
  __native__():NativeCanvas|null{
    return this.__canvas__;
  }

  loadPixels(){
    if(!this.__ctx__)return;
    if(this.pixels.length!==this.pixelWidth*this.pixelHeight)this.pixels=new Int32Array(this.pixelWidth*this.pixelHeight);
    const data=this.__ctx__.getImageData(0,0,this.pixelWidth,this.pixelHeight).data;
    rgbaToArgb(data,this.pixels,this.format===1);
  }

  /** updatePixels() or updatePixels(x, y, w, h) */
  updatePixels(x=0,y=0,w=this.pixelWidth,h=this.pixelHeight){
    if(!this.__ctx__||this.pixels.length===0)return;
    const img=this.__ctx__.createImageData(this.pixelWidth,this.pixelHeight);
    argbToRgba(this.pixels,img.data,this.format===1);
    this.__ctx__.putImageData(img,0,0,x,y,w,h);
  }

  /** get() (a copy), get(x, y) (an ARGB color, 0 outside), get(x, y, w, h) (a copy of the region) */
  get(x?:number,y?:number,w?:number,h?:number):PImage|number{
    if(x===undefined)return this.get(0,0,this.width,this.height);
    if(w===undefined||h===undefined){
      x=Math.trunc(x);y=Math.trunc(y!);
      if(x<0||y<0||x>=this.width||y>=this.height||!this.__ctx__)return 0;
      const d=this.__ctx__.getImageData(x*this.pixelDensity,y*this.pixelDensity,1,1).data;
      return this.format===1?(0xff000000|(d[0]<<16)|(d[1]<<8)|d[2])|0:((d[3]<<24)|(d[0]<<16)|(d[1]<<8)|d[2]);
    }
    const out=new PImage(this.parent);
    out.init(Math.max(0,w),Math.max(0,h),this.format,1);
    if(this.__canvas__&&w>0&&h>0)out.__ctx__!.drawImage(this.__canvas__,x*this.pixelDensity,y!*this.pixelDensity,w*this.pixelDensity,h*this.pixelDensity,0,0,w,h);
    out.loadPixels();
    return out;
  }

  /** set(x, y, color) or set(x, y, image) */
  set(x:number,y:number,c:number|PImage){
    if(!this.__ctx__)return;
    if(c instanceof PImage){
      const src=c.__native__();
      if(src)this.__ctx__.drawImage(src,Math.trunc(x)*this.pixelDensity,Math.trunc(y)*this.pixelDensity);
      return;
    }
    x=Math.trunc(x);y=Math.trunc(y);
    if(x<0||y<0||x>=this.width||y>=this.height)return;
    const img=this.__ctx__.createImageData(1,1);
    img.data[0]=(c>>16)&0xff;img.data[1]=(c>>8)&0xff;img.data[2]=c&0xff;img.data[3]=this.format===1?255:(c>>>24);
    this.__ctx__.putImageData(img,x*this.pixelDensity,y*this.pixelDensity);
    if(this.pixels.length)this.pixels[y*this.pixelDensity*this.pixelWidth+x*this.pixelDensity]=c;
  }

  /** copy(sx, sy, sw, sh, dx, dy, dw, dh) or copy(src, sx, sy, sw, sh, dx, dy, dw, dh) */
  copy(...a:any[]){
    if(a.length===8)a.unshift(this);
    const [src,sx,sy,sw,sh,dx,dy,dw,dh]=a as [PImage,number,number,number,number,number,number,number,number];
    const n=src.__native__();
    if(!n||!this.__ctx__)return;
    this.__ctx__.drawImage(n,sx*src.pixelDensity,sy*src.pixelDensity,sw*src.pixelDensity,sh*src.pixelDensity,dx*this.pixelDensity,dy*this.pixelDensity,dw*this.pixelDensity,dh*this.pixelDensity);
  }

  /** resize(w, h); 0 for one side keeps the aspect ratio. */
  resize(w:number,h:number){
    if(!this.__canvas__)return;
    if(w<=0&&h<=0)return;
    if(w<=0)w=this.width*h/this.height;
    if(h<=0)h=this.height*w/this.width;
    const old=this.__canvas__;
    this.init(Math.round(w),Math.round(h),this.format,1);
    this.__ctx__!.drawImage(old,0,0,this.pixelWidth,this.pixelHeight);
    this.loadPixels();
  }

  /** mask(image) (its blue channel) or mask(int[]) (alpha values) */
  mask(m:PImage|ArrayLike<number>){
    this.loadPixels();
    let alpha:ArrayLike<number>;
    if(m instanceof PImage){
      m.loadPixels();
      alpha=Array.from(m.pixels,(p)=>p&0xff);
    }else alpha=m;
    for(let i=0;i<this.pixels.length;i++)this.pixels[i]=((alpha[i]&0xff)<<24)|(this.pixels[i]&0xffffff);
    if(this.format===1)this.format=2;
    this.updatePixels();
  }

  clone():PImage{
    return this.get() as PImage;
  }
}
