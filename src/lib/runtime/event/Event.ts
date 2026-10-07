/** processing.event.Event: what every mouse and key event carries. */
export class Event{
  static readonly SHIFT = 1 << 0;
  static readonly CTRL  = 1 << 1;
  static readonly META  = 1 << 2;
  static readonly ALT   = 1 << 3;

  // Types of events. As with all constants in Processing, brevity's preferred.
  static readonly KEY = 1;
  static readonly MOUSE = 2;
  static readonly TOUCH = 3;

  protected flavor=0;
  protected action=0;
  protected modifiers=0;
  protected millis=0;
  protected native:unknown=null;

  getNative(){return this.native;}
  getMillis(){return this.millis;}
  getAction(){return this.action;}
  getModifiers(){return this.modifiers;}
  getFlavor(){return this.flavor;}
  isShiftDown(){return (this.modifiers&Event.SHIFT)!==0;}
  isControlDown(){return (this.modifiers&Event.CTRL)!==0;}
  isMetaDown(){return (this.modifiers&Event.META)!==0;}
  isAltDown(){return (this.modifiers&Event.ALT)!==0;}
}

/** Event modifiers (SHIFT/CTRL/META/ALT) of a DOM event. */
export function domModifiers(e:{shiftKey:boolean,ctrlKey:boolean,metaKey:boolean,altKey:boolean}):number{
  return (e.shiftKey?Event.SHIFT:0)|(e.ctrlKey?Event.CTRL:0)|(e.metaKey?Event.META:0)|(e.altKey?Event.ALT:0);
}
