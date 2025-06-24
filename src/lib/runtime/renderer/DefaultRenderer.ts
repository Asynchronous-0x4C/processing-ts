import { PImage } from "../PImage";
import { IOBase } from "../util/sketchio/IOBase";
import { XHRIO } from "../util/sketchio/XHRIO";
import { Renderer } from "./Renderer";

export class DefaultRenderer extends Renderer{
  __io__: IOBase;
  public canvas:HTMLCanvasElement;
  private max_size={width:0,height:0};

  constructor(canvas: HTMLCanvasElement,base_path:string,max_size?:{ width: number; height: number; }){
    super();
    this.canvas=canvas;
    this.__io__=new XHRIO(base_path);
    if(max_size){
      this.max_size=max_size;
    }
  }

  setCursorStyle(arg: string | { image: PImage; x: number; y: number; }): void {
    if(typeof arg==="string"){
      this.canvas!.style.cursor=arg;
    }
  }

  getMaximumSize(): { width: number; height: number; } {
    return this.max_size;
  }
}