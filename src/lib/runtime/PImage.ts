import { Sprite, Texture } from "pixi.js";
import { PConstants } from "./PConstants";
import { PApplet } from "./PApplet";

export class PImage extends PConstants{
  texture:Texture|null=null;
  width:number=0;
  height:number=0;

  parent:PApplet;

  pixels:number[]=[];
  __pixel_modified__:boolean=false;

  constructor(parent:PApplet,settings?:{pixels:number[],width:number,height:number,format:number}){
    super();
    this.parent=parent;
    if(settings){
      const l=settings.width*settings.height;
      this.pixels=new Proxy(
                    settings.pixels.length<l?settings.pixels.concat(new Array<number>(l-settings.pixels.length).fill(0xff000000)):
                    settings.pixels.length>l?settings.pixels.slice(0,l):
                    settings.pixels,
                    {
                      set:(t,p,n,r)=>{
                        this.__pixel_modified__=true;
                        return Reflect.set(t,p,n,r);
                      }
                    }
                  );
      this.width=settings.width;
      this.height=settings.height;
      this.updatePixels();
    }
  }

  async load_from_arraybuffer(buffer:ArrayBuffer){
    const blob=new Blob([buffer],{type:"image/png"});
    await this.load_from_blob(blob);
  }

  async load_from_blob(blob:Blob){    
    const bmp=await createImageBitmap(blob);

    this.texture=Texture.from(bmp);
    this.texture.noFrame=false;
    this.width=this.texture.frame.width;
    this.height=this.texture.frame.height;
    if(!this.__pixel_modified__)this.loadPixels();
  }

  loadPixels(){
    if(this.texture){
      const px=this.parent.__app__.renderer.extract.pixels({target:this.texture}).pixels;
      const data=new Array<number>(px.length/4).fill(0).map((v,i)=>{return px[i*4+3]<<24|px[i*4+2]<<16|px[i*4+1]<<8|px[i*4]});
      this.pixels=new Proxy(data,{
        set:(t,p,n,r)=>{
          this.__pixel_modified__=true;
          return Reflect.set(t,p,n,r);
        }
      });
      this.__pixel_modified__=false;
    }
  }

  updatePixels(){
    if(this.pixels.length>0){
      const data=new Uint8Array(this.pixels.length*4);
      this.pixels.forEach((v,i)=>{
        data[i*4  ]=v&0xff;
        data[i*4+1]=(v>>8)&0xff;
        data[i*4+2]=(v>>16)&0xff;
        data[i*4+3]=v>>>24;
      });
      this.load_from_blob(new Blob([convert(this.width,this.height,data)],{type:"image/bmp"}));
      this.__pixel_modified__=false;
    }
  }

  get(x:number,y:number){
    //this.loadPixels(); (Added in PGraphics)
    return this.pixels[y*this.width+x];
  }
}

const BMP_HEADER_BASE64 =
  'Qk0AAAAAAAAAAHoAAABsAAAAAAAAAAAAAAABACAAAwAAAAAAAADDDgAAww4AAAAAAAAAAAAA/wAAAAD/AAAAAP8AAAAA/0JHUnM';
const BMP_HEADER = Uint8Array.from(atob(BMP_HEADER_BASE64), (c) => c.charCodeAt(0));
const BMP_HEADER_LENGTH = 122;

const BMP_FILESIZE_OFFSET = 2;
const BMP_WIDTH_OFFSET = 18;
const BMP_HEIGHT_OFFSET = 22;
const BMP_IMAGESIZE_OFFSET = 34;
const BMP_RED_BITFIELDS_OFFSET = 54;
const BMP_GREEN_BITFIELDS_OFFSET = 62;

const IS_WIN = 'navigator' in globalThis && /Trident|Edge/.test(navigator.userAgent);

const convert = (width:number, height:number, data:Uint8Array, _options?:any) => {
  const options = Object.assign({ strict: false }, _options);

  const dataLength = data.byteLength;
  const fileSize = BMP_HEADER_LENGTH + dataLength;

  const uint8Array = new Uint8Array(fileSize);
  const dataView = new DataView(uint8Array.buffer);
  const setUint32 = (offset:number, value:number) => dataView.setUint32(offset, value, true);

  uint8Array.set(BMP_HEADER);
  setUint32(BMP_FILESIZE_OFFSET, fileSize);
  setUint32(BMP_WIDTH_OFFSET, width);
  setUint32(BMP_HEIGHT_OFFSET, -height);
  setUint32(BMP_IMAGESIZE_OFFSET, dataLength);

  uint8Array.set(data, BMP_HEADER_LENGTH);
  if (options.strict || IS_WIN) {
    // RGBA -> BGRA
    setUint32(BMP_RED_BITFIELDS_OFFSET, 0x00ff0000);
    setUint32(BMP_GREEN_BITFIELDS_OFFSET, 0x000000ff);
    for (let offset = 0; offset < dataLength; offset += 4) {
      uint8Array[BMP_HEADER_LENGTH + offset] = data[offset + 2];
      uint8Array[BMP_HEADER_LENGTH + 2 + offset] = data[offset];
    }
  }

  return uint8Array;
};