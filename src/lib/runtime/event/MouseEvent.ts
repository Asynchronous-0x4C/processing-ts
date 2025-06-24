import {Event} from "./Event";

export class MouseEvent extends Event{
  x:number;
  y:number;
  button:number;
  count:number;

  constructor(x:number,y:number,button:number,count:number){
    super();
    this.x=x;
    this.y=y;
    this.button=button;
    this.count=count;
  }

  getX(){
    return this.x;
  }

  getY(){
    return this.y;
  }

  getButton(){
    return this.button;
  }

  getCount(){
    return this.count;
  }
}