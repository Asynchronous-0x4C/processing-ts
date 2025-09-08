import { PApplet } from "./PApplet";
import { PImage } from "./PImage";

export class PSurface{
  readonly MIN_WINDOW_WIDTH=128;
  readonly MIN_WINDOW_HEIGHT=128;

  current_cursor:string="default";

  private applet:PApplet;

  constructor(applet:PApplet){
    this.applet=applet;
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

  setCursorStyle(arg: string | { image: PImage; x: number; y: number; }): void {
    if(typeof arg==="string"){
      this.applet.g.context.canvas!.style.cursor=arg;
    }
  }

  setTitle(title:string){
    document.title=title;
  }
}