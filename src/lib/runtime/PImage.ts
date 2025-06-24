import { Sprite, Texture } from "pixi.js";
import { PConstants } from "./PConstants";

export class PImage extends PConstants{
  texture:Texture|null=null;
  sprite:Sprite|null=null;
  width:number=0;
  height:number=0;

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
    this.sprite=new Sprite(this.texture);
  }
}