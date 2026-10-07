import { PApplet } from "./PApplet";
import { PImage } from "./PImage";

/** CSS cursors for java.awt.Cursor's types (Processing's ARROW = 0, CROSS = 1, TEXT = 2, WAIT = 3, HAND = 12, MOVE = 13). */
const CURSORS:Record<number,string>={
  0:"default",1:"crosshair",2:"text",3:"wait",4:"sw-resize",5:"se-resize",6:"nw-resize",7:"ne-resize",
  8:"n-resize",9:"s-resize",10:"w-resize",11:"e-resize",12:"pointer",13:"move",
};

export class PSurface{
  readonly MIN_WINDOW_WIDTH=128;
  readonly MIN_WINDOW_HEIGHT=128;

  current_cursor:string="default";

  private applet:PApplet;

  constructor(applet:PApplet){
    this.applet=applet;
  }
    
  /** setCursor(kind) with Processing's cursor constants (ARROW, CROSS, HAND, MOVE, TEXT, WAIT), or setCursor(image, hotspotX, hotspotY). */
  setCursor(kind:number|PImage,hotspotX=0,hotspotY=0){
    if(kind instanceof PImage){
      const src=kind.__canvas__;
      if(!src||typeof document==="undefined")return;
      const c=document.createElement("canvas");
      c.width=kind.width;
      c.height=kind.height;
      c.getContext("2d")!.drawImage(src as CanvasImageSource,0,0,kind.width,kind.height);
      this.current_cursor=`url(${c.toDataURL()}) ${hotspotX} ${hotspotY}, auto`;
    }else{
      this.current_cursor=CURSORS[kind]??"default";
    }
    this.setCursorStyle(this.current_cursor);
  }

  showCursor(){
    this.setCursorStyle(this.current_cursor);
  }

  hideCursor(){
    this.setCursorStyle("none");
  }

  setCursorStyle(css:string): void {
    const canvas=this.applet.g.canvas;
    if(canvas&&"style" in canvas)canvas.style.cursor=css;
  }

  setTitle(title:string){
    document.title=title;
  }
}