import {Event} from "./Event";

/** Processing's CODED: the value of `key` for keys without a character (arrows, shift...). */
export const CODED=0xffff;

/**
 * DOM key → Processing's key (a char code, or CODED) and keyCode (Java's VK codes: ENTER is 10 and
 * DELETE 127; letters, digits, arrows and modifiers match the DOM codes).
 */
export function javaKey(domKey:string,domKeyCode:number):{key:number,keyCode:number}{
  switch(domKey){
    case "Enter":return {key:10,keyCode:10};
    case "Backspace":return {key:8,keyCode:8};
    case "Tab":return {key:9,keyCode:9};
    case "Escape":return {key:27,keyCode:27};
    case "Delete":return {key:127,keyCode:127};
  }
  if(domKey.length===1)return {key:domKey.charCodeAt(0),keyCode:domKeyCode};
  return {key:CODED,keyCode:domKeyCode};
}

export class KeyEvent implements Event{
  /** Character code (CODED for keys without one), as Processing's char key. */
  key:number;
  keyCode:number;
  modifiers:number;

  static PRESS=1;
  static RELEASE=2;
  static TYPE=3;

  constructor(key:number,keyCode:number,modifiers:number){
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