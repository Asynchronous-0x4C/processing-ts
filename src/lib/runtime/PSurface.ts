import { PApplet } from "./PApplet";

export class PSurface{
  readonly MIN_WINDOW_WIDTH=128;
  readonly MIN_WINDOW_HEIGHT=128;

  private applet:PApplet;

  constructor(applet:PApplet){
    this.applet=applet;
  }

  setCursor(...args:any[]){
    this.applet.g.renderer.setCursor(...args);
  }

  showCursor(){
    this.applet.g.renderer.showCursor();
  }

  hideCursor(){
    this.applet.g.renderer.hideCursor();
  }
}