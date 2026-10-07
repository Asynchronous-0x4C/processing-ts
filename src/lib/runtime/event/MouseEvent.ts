import {Event} from "./Event";

/** processing.event.MouseEvent. x/y are in sketch pixels; count is the click count, or the wheel's notches. */
export class MouseEvent extends Event{
  static readonly PRESS=1;
  static readonly RELEASE=2;
  static readonly CLICK=3;
  static readonly DRAG=4;
  static readonly MOVE=5;
  static readonly ENTER=6;
  static readonly EXIT=7;
  static readonly WHEEL=8;

  x:number;
  y:number;
  button:number;
  count:number;

  constructor(native:unknown,millis:number,action:number,modifiers:number,x:number,y:number,button:number,count:number){
    super();
    this.flavor=Event.MOUSE;
    this.native=native;
    this.millis=millis;
    this.action=action;
    this.modifiers=modifiers;
    this.x=x;
    this.y=y;
    this.button=button;
    this.count=count;
  }

  getX(){return this.x;}
  getY(){return this.y;}
  /** LEFT, CENTER, RIGHT, or 0 when no button is involved (moves, the wheel). */
  getButton(){return this.button;}
  getCount(){return this.count;}
}
