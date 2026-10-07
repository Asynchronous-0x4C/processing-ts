import { PConstants } from "./PConstants";
import type { PApplet } from "./PApplet";
import { extensionOf } from "./io/SketchFiles";
import { encodeTGA, encodeTIFF } from "./io/imageEncode";
import { blendColor, filterPixels } from "./util/imageOps";

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
 * Processing's PImage. `pixels` is an Int32Array of ARGB colors (pixelWidth × pixelHeight). For a plain
 * image it is the image itself, kept exactly as written (a canvas stores premultiplied colors and would
 * lose translucent pixels); updatePixels() copies it to the image's canvas, which is what drawing uses.
 * Drawing surfaces (PGraphics, __live__()) draw into the canvas, so loadPixels() reads it back.
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
  /** pixels[] holds the image: set by loadPixels()/updatePixels(), cleared when only the canvas changed. */
  __fresh__=false;

  /** Drawing surfaces (PGraphics) change their canvas directly, so pixels[] is always re-read from it. */
  __live__():boolean{
    return false;
  }

  /** pixels[] can be used as the image without reading the canvas. */
  __pixels_valid__():boolean{
    return this.__fresh__&&!this.__live__()&&this.pixels.length===this.pixelWidth*this.pixelHeight;
  }

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
    // A new image: transparent black, in both.
    this.__fresh__=true;
  }

  /**
   * Set this image from a decoded file (loadImage()). JPEG images are RGB; the others are ARGB when a
   * pixel is translucent, else RGB (as Processing's checkAlpha()).
   */
  __from_bitmap__(bmp:ImageBitmap,ext:string){
    this.init(bmp.width,bmp.height,2,1);
    this.__ctx__!.drawImage(bmp,0,0);
    this.__fresh__=false;
    this.loadPixels();
    let format=1;
    if(ext!=="jpg"&&ext!=="jpeg"){
      for(let i=0;i<this.pixels.length;i++)if((this.pixels[i]>>>24)!==0xff){format=2;break;}
    }
    this.format=format;
  }

  /**
   * save(filename): the image as .png, .jpg, .tif or .tga (by the extension; without one, .tif is added),
   * relative to the sketch folder. The file goes to the sketch's file store and the host's "save" listeners.
   */
  save(filename:string):boolean{
    const files=this.parent?.__files__;
    if(!files||!this.__canvas__)return false;
    let name=filename;
    let ext=extensionOf(name);
    if(ext===""){
      name+=".tif";
      ext="tif";
    }
    this.loadPixels();
    files.saveImagePixels(name,{width:this.pixelWidth,height:this.pixelHeight,format:this.format,pixels:this.pixels.slice()});
    if(ext==="tif"||ext==="tiff"){
      files.save(name,encodeTIFF(this.pixels,this.pixelWidth,this.pixelHeight,this.format===2),"image/tiff");
      return true;
    }
    if(ext==="tga"){
      files.save(name,encodeTGA(this.pixels,this.pixelWidth,this.pixelHeight,this.format===2),"image/x-tga");
      return true;
    }
    const type=ext==="jpg"||ext==="jpeg"?"image/jpeg":"image/png";
    const canvas=this.__canvas__;
    const blob:Promise<Blob|null>="convertToBlob" in canvas?canvas.convertToBlob({type,quality:0.9}):new Promise((r)=>canvas.toBlob(r,type,0.9));
    void blob.then(async(b)=>{
      if(b)files.save(name,new Uint8Array(await b.arrayBuffer()),type);
    });
    return true;
  }

  /** Decode an image file; width/height stay 0 until it is ready (as with requestImage()). */
  async load_from_blob(blob:Blob){
    const bmp=await createImageBitmap(blob);
    this.init(bmp.width,bmp.height,blob.type==="image/jpeg"?1:2);
    this.__ctx__!.drawImage(bmp,0,0);
    bmp.close();
    this.__fresh__=false;
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
    if(!this.__ctx__||this.__pixels_valid__())return;
    if(this.pixels.length!==this.pixelWidth*this.pixelHeight)this.pixels=new Int32Array(this.pixelWidth*this.pixelHeight);
    const data=this.__ctx__.getImageData(0,0,this.pixelWidth,this.pixelHeight).data;
    rgbaToArgb(data,this.pixels,this.format===1);
    this.__fresh__=true;
  }

  /** updatePixels() or updatePixels(x, y, w, h) */
  updatePixels(x=0,y=0,w=this.pixelWidth,h=this.pixelHeight){
    if(!this.__ctx__||this.pixels.length===0)return;
    const img=this.__ctx__.createImageData(this.pixelWidth,this.pixelHeight);
    argbToRgba(this.pixels,img.data,this.format===1);
    this.__ctx__.putImageData(img,0,0,x,y,w,h);
    this.__fresh__=true;
  }

  /** get() (a copy), get(x, y) (an ARGB color, 0 outside), get(x, y, w, h) (a copy of the region) */
  get(x?:number,y?:number,w?:number,h?:number):PImage|number{
    if(x===undefined)return this.get(0,0,this.width,this.height);
    if(w===undefined||h===undefined){
      x=Math.trunc(x);y=Math.trunc(y!);
      if(x<0||y<0||x>=this.width||y>=this.height||!this.__ctx__)return 0;
      if(this.__pixels_valid__()){
        const c=this.pixels[y*this.pixelDensity*this.pixelWidth+x*this.pixelDensity];
        return this.format===1?(c|0xff000000):this.format===4?((c<<24)|0xffffff):c;
      }
      const d=this.__ctx__.getImageData(x*this.pixelDensity,y*this.pixelDensity,1,1).data;
      return this.format===1?(0xff000000|(d[0]<<16)|(d[1]<<8)|d[2])|0:((d[3]<<24)|(d[0]<<16)|(d[1]<<8)|d[2]);
    }
    const out=new PImage(this.parent);
    out.init(Math.max(0,w),Math.max(0,h),this.format,1);
    if(w>0&&h>0){
      out.pixels.set(this.__region__(x,y!,w,h,w,h));
      out.updatePixels();
    }
    return out;
  }

  /**
   * The pixels of the region (sx, sy, sw, sh) at tw × th pixels: exact when the sizes match, else scaled
   * through a canvas. Pixels outside the image are 0.
   */
  __region__(sx:number,sy:number,sw:number,sh:number,tw:number,th:number):Int32Array{
    const out=new Int32Array(tw*th);
    const d=this.pixelDensity;
    if(d===1&&sw===tw&&sh===th&&(this.__pixels_valid__()||this.__live__())){
      this.loadPixels();
      sx=Math.trunc(sx);sy=Math.trunc(sy);
      for(let y=0;y<th;y++){
        const yy=sy+y;
        if(yy<0||yy>=this.pixelHeight)continue;
        for(let x=0;x<tw;x++){
          const xx=sx+x;
          if(xx>=0&&xx<this.pixelWidth)out[y*tw+x]=this.pixels[yy*this.pixelWidth+xx];
        }
      }
      return out;
    }
    const src=this.__native__();
    if(!src)return out;
    if(this.__pixels_valid__()===false&&!this.__live__())this.loadPixels();
    const tmp=createNativeCanvas(tw,th);
    const ctx=tmp.getContext("2d",{willReadFrequently:true}) as Native2D;
    ctx.drawImage(src as CanvasImageSource,sx*d,sy*d,sw*d,sh*d,0,0,tw,th);
    rgbaToArgb(ctx.getImageData(0,0,tw,th).data,out,this.format===1);
    return out;
  }

  /** Combine tw × th source pixels into this image at (dx, dy) (pixel units) with blendColor(mode). */
  private __apply__(dx:number,dy:number,tw:number,th:number,src:Int32Array,mode:number){
    if(!this.__ctx__)return;
    this.loadPixels();
    dx=Math.trunc(dx);dy=Math.trunc(dy);
    for(let y=0;y<th;y++){
      const yy=dy+y;
      if(yy<0||yy>=this.pixelHeight)continue;
      for(let x=0;x<tw;x++){
        const xx=dx+x;
        if(xx<0||xx>=this.pixelWidth)continue;
        const i=yy*this.pixelWidth+xx;
        this.pixels[i]=mode===0?src[y*tw+x]:blendColor(this.pixels[i],src[y*tw+x],mode);
      }
    }
    this.updatePixels();
  }

  /** set(x, y, color) or set(x, y, image) (the image's pixels replace these, without blending) */
  set(x:number,y:number,c:number|PImage){
    if(!this.__ctx__)return;
    if(c instanceof PImage){
      const w=c.pixelWidth,h=c.pixelHeight;
      if(w>0&&h>0)this.__apply__(Math.trunc(x)*this.pixelDensity,Math.trunc(y)*this.pixelDensity,w,h,c.__region__(0,0,c.width,c.height,w,h),0);
      return;
    }
    x=Math.trunc(x);y=Math.trunc(y);
    if(x<0||y<0||x>=this.width||y>=this.height)return;
    const img=this.__ctx__.createImageData(1,1);
    img.data[0]=(c>>16)&0xff;img.data[1]=(c>>8)&0xff;img.data[2]=c&0xff;img.data[3]=this.format===1?255:(c>>>24);
    this.__ctx__.putImageData(img,x*this.pixelDensity,y*this.pixelDensity);
    if(this.pixels.length)this.pixels[y*this.pixelDensity*this.pixelWidth+x*this.pixelDensity]=c;
  }

  /** copy() (a new image), copy(sx, sy, sw, sh, dx, dy, dw, dh) or copy(src, sx, sy, sw, sh, dx, dy, dw, dh) */
  copy(...a:any[]):PImage|void{
    if(a.length===0)return this.get() as PImage;
    if(a.length===8)a.unshift(this);
    this.blend(...a,0);
  }

  /** resize(w, h); 0 for one side keeps the aspect ratio. */
  resize(w:number,h:number){
    if(!this.__canvas__)return;
    if(w<=0&&h<=0)return;
    if(w<=0)w=this.width*h/this.height;
    if(h<=0)h=this.height*w/this.width;
    if(this.__pixels_valid__())this.updatePixels();
    const old=this.__canvas__;
    this.init(Math.round(w),Math.round(h),this.format,1);
    this.__ctx__!.drawImage(old,0,0,this.pixelWidth,this.pixelHeight);
    this.__fresh__=false;
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

  /** filter(kind[, param]): THRESHOLD, GRAY, OPAQUE, INVERT, POSTERIZE, BLUR, ERODE or DILATE (util/imageOps.ts). */
  filter(kind:number,param?:number){
    if(!this.__ctx__)return;
    this.loadPixels();
    this.format=filterPixels(this.pixels,this.pixelWidth,this.pixelHeight,this.format,kind,param);
    this.updatePixels();
  }

  /**
   * blend(sx, sy, sw, sh, dx, dy, dw, dh, mode) or blend(src, sx, sy, sw, sh, dx, dy, dw, dh, mode): blendColor()
   * of each pixel of the source region over this image's region (the source is scaled when the sizes differ).
   */
  blend(...a:any[]){
    if(a.length===9)a.unshift(this);
    const [src,sx,sy,sw,sh,dx,dy,dw,dh,mode]=a as [PImage,number,number,number,number,number,number,number,number,number];
    const d=this.pixelDensity;
    const tw=Math.round(dw*d),th=Math.round(dh*d);
    if(tw<=0||th<=0||sw<=0||sh<=0)return;
    // Read the source before writing (it can be this image).
    const from=src.__region__(sx,sy,sw,sh,tw,th);
    this.__apply__(Math.round(dx*d),Math.round(dy*d),tw,th,from,mode);
  }

  static blendColor(c1:number,c2:number,mode:number):number{
    return blendColor(c1,c2,mode);
  }

  clone():PImage{
    return this.get() as PImage;
  }
}
