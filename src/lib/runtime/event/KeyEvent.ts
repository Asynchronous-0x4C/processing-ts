import {Event} from "./Event";

/** Processing's CODED: the value of `key` for keys without a character (arrows, shift...). */
export const CODED=0xffff;

/** DOM keyCodes whose Java VK code differs (punctuation, Insert, the Windows keys). */
const VK:Record<number,number>={
  186:59,187:61,188:44,189:45,190:46,191:47,219:91,220:92,221:93,45:155,91:524,92:524,93:525,
};

/**
 * DOM key → Processing's key (a char code, or CODED) and keyCode (Java's VK codes: ENTER is 10 and
 * DELETE 127; letters, digits, arrows and modifiers match the DOM codes).
 */
export function javaKey(domKey:string,domKeyCode:number,ctrl=false):{key:number,keyCode:number}{
  domKeyCode=VK[domKeyCode]??domKeyCode;
  // Control+letter types the control character (Ctrl+A is 1), as on Windows.
  if(ctrl&&/^[a-z]$/i.test(domKey))return {key:domKey.toUpperCase().charCodeAt(0)-64,keyCode:domKeyCode};
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

/**
 * Whether pressing the key also types a character (keyTyped()). As in AWT, keys without a character
 * (arrows, modifiers, function keys: key == CODED) do not; Enter, Backspace, Tab, Esc and Delete do.
 */
export function typesCharacter(key:number):boolean{
  return key!==CODED;
}

export class KeyEvent extends Event{
  static readonly PRESS=1;
  static readonly RELEASE=2;
  static readonly TYPE=3;

  /** Character code (CODED for keys without one), as Processing's char key. */
  key:number;
  keyCode:number;
  private autoRepeat:boolean;

  constructor(native:unknown,millis:number,action:number,modifiers:number,key:number,keyCode:number,autoRepeat=false){
    super();
    this.flavor=Event.KEY;
    this.native=native;
    this.millis=millis;
    this.action=action;
    this.modifiers=modifiers;
    this.key=key;
    this.keyCode=keyCode;
    this.autoRepeat=autoRepeat;
  }

  getKey(){return this.key;}
  /** 0 in TYPE events, as in Processing. */
  getKeyCode(){return this.keyCode;}
  isAutoRepeat(){return this.autoRepeat;}
}
