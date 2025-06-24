import {Event} from "./Event";

export class KeyEvent implements Event{
  key:string;
  keyCode:number;
  modifiers:number;

  static PRESS=1;
  static RELEASE=2;
  static TYPE=3;

  constructor(key:string,keyCode:number,modifiers:number){
    this.modifiers=modifiers;
    this.key=key;
    this.keyCode=keyCode;
  }

  getKeyCode(){
    return this.keyCode;
  }

  getKey(){
    return this.key;
  }
}