import type { SketchManager } from "../../SketchManager";
import { Cursor } from "../awt/Cursor";
import { PApplet } from "../PApplet";
import { ArrayList } from "../util/ArrayList";
import { Runnable, Consumer, Supplier, Function, FunctionalInterface } from "../util/function";
import { Event, MouseEvent, KeyEvent } from "../event";
import { domModifiers } from "../event/Event";
import { javaKey, typesCharacter } from "../event/KeyEvent";
import { PVector } from "../util/PVector";
import { HashMap } from "../util/HashMap";
import { PImage } from "../PImage";
import { PGraphics } from "../PGraphics";
import { PFont, loadDefaultFont } from "../PFont";
import { PMatrix2D } from "../PMatrix2D";
import { JSONObject } from "../data/JSONObject";
import { JSONArray } from "../data/JSONArray";
import { javaClasses, lang } from "../../../runtime/lang/index.ts";
import type { SourceMapV3 } from "../../../compiler/index.ts";

/** Processing classes by binary name, for compiled sketches ($rt.classes). */
const PROCESSING_CLASSES:Record<string,unknown>={
  "processing.core.PApplet":PApplet,
  "processing.core.PVector":PVector,
  "processing.core.PImage":PImage,
  "processing.core.PGraphics":PGraphics,
  "processing.core.PFont":PFont,
  "processing.core.PMatrix2D":PMatrix2D,
  "processing.data.JSONObject":JSONObject,
  "processing.data.JSONArray":JSONArray,
  "processing.event.MouseEvent":MouseEvent,
  "processing.event.KeyEvent":KeyEvent,
  "processing.event.Event":Event,
};

/** What the compiler found out about the sketch (CompileResult). */
export type RunOptions={usesText?:boolean};

export abstract class Runner{
  pre_count:number=-1;
  initiated:boolean=false;
  scaling:{x:number,y:number}={x:1,y:1};
  log_listeners:((...args:any[])=>void)[]=[];
  error_listeners:((...args:any[])=>void)[]=[];

  arg_classes:{name:string,type:any}[]=[{name:"PApplet",type:PApplet},{name:"PVector",type:PVector},{name:"ArrayList",type:ArrayList},{name:"HashMap",type:HashMap},{name:"Cursor",type:Cursor},{name:"Runnable",type:Runnable},{name:"Consumer",type:Consumer},{name:"Supplier",type:Supplier},{name:"Function",type:Function},{name:"FunctionalInterface",type:FunctionalInterface},];

  abstract manager:SketchManager;

  /** Text printed by the sketch that does not end with a newline yet. */
  private pending_output="";

  /** Output of print/println: complete lines go to the log listeners, one call per line. */
  write_output(text:string){
    this.pending_output+=text;
    let i:number;
    while((i=this.pending_output.indexOf("\n"))>=0){
      const line=this.pending_output.slice(0,i);
      this.pending_output=this.pending_output.slice(i+1);
      this.log_listeners.forEach(l=>l([line]));
    }
  }

  flushOutput(){
    if(this.pending_output==="")return;
    const line=this.pending_output;
    this.pending_output="";
    this.log_listeners.forEach(l=>l([line]));
  }

  /** Report an uncaught exception like Java ("java.lang.NullPointerException: ...") to the error listeners. */
  report_error(e:unknown){
    const message=lang.toJava(e).toString();
    this.error_listeners.forEach(l=>l(message));
    console.error(e);
  }

  /** $rt.classes: the Java runtime, Processing's classes, and the dependencies added by name. */
  runtime_classes():Record<string,unknown>{
    const classes:Record<string,unknown>={...javaClasses,...PROCESSING_CLASSES};
    for(const c of this.arg_classes)if(!(c.name in classes))classes[c.name]=c.type;
    return classes;
  }

  abstract init(sketch:string,map?:SourceMapV3|null,options?:RunOptions):void;
  abstract loop():void;
  abstract step():Promise<number>;
  abstract stop():void;
  abstract on_focus():void;
  abstract on_blur():void;

  on_pointermove?(e:PointerEvent):void;
  on_pointerdown?(e:PointerEvent):void;
  on_pointerup?(e:PointerEvent):void;
  on_keydown?(e:KeyboardEvent):void;
  on_keyup?(e:KeyboardEvent):void;
  on_wheel?(e:WheelEvent):void;
  on_resize?():void;
  on_contextmenu?(e:globalThis.MouseEvent):void;
  on_pointerenter?(e:PointerEvent):void;
  on_pointerleave?(e:PointerEvent):void;

  convert_button(button:number):number{
    switch(button){
      case 0:button=37;break;
      case 1:button=3;break;
      case 2:button=39;break;
    }
    return button;
  }

  sign(x:number):number{
    return x<0?-1:x>0?1:0;
  }

  convert_mouse(x:number,y:number):{x:number,y:number}{
    const rect=this.manager.target_element!.getBoundingClientRect();
    return {x:(x-rect.left)*this.scaling.x,y:(y-rect.top)*this.scaling.y};
  }

  abstract set_scaling():void;

  abstract get_applet_size():{w:number,h:number};

  abstract get_aspect_ratio():number;

  abstract update_resolution(r:number):void;

  get_maximum_size():{width:number,height:number}{
    const rect=this.manager.target_element!.getBoundingClientRect();
    return {width:rect.width,height:rect.height};
  }

  addDependency(data:{name:string,type:any},override:boolean){
    const idx=this.arg_classes.findIndex(a=>a.name==data.name);
    if(idx==-1||override)this.arg_classes.push(data);
    if(override&&idx!==-1){
      this.arg_classes=this.arg_classes.splice(idx,1);
    }
  }

  getDependentNames():string[]{
    return this.arg_classes.map(a=>a.name);
  }

  getDependentClasses():any[]{
    return this.arg_classes.map(a=>a.type);
  }

  abstract addEventListener(type:"log"|"error",listener:(args:any[])=>void):void;
}

/** Processing's LEFT, CENTER and RIGHT (mouseButton). */
const LEFT=37, CENTER=3, RIGHT=39;

export function convert_button(button:number){
  switch(button){
    case 0:button=37;break;
    case 1:button=3;break;
    case 2:button=39;break;
  }
  return button
}

/** Windows' double-click time and distance (AWT's click count). */
const MULTI_CLICK_MS=500;
const MULTI_CLICK_PX=4;

export class DefaultRunner extends Runner{
  pre_count: number=-1;
  initiated: boolean=false;

  manager: SketchManager;

  /** Events waiting for the end of the next frame (Processing handles them after draw()). */
  event_queue:Array<MouseEvent|KeyEvent|{name:"_windowResized"}>;
  content_display:boolean=true;
  applet: PApplet | null = null;

  last_time=0;
  /** Smoothed frame time behind `frameRate` (ms). */
  private frame_ms=1000/60;
  /** Time the next frame is due (requestAnimationFrame loop). */
  private next_frame=0;
  private animation_id=0;
  private stepping=false;
  /** Mouse state for MOUSE_CLICKED and click counts. */
  private press:{x:number,y:number,moved:boolean}|null=null;
  private last_press={time:-Infinity,x:0,y:0,button:0,count:0};

  constructor(manager:SketchManager){
    super();
    this.manager=manager;
    this.event_queue=[];
  }

  async init(sketch:string,_map?:SourceMapV3|null,options:RunOptions={}){
    this.event_queue=[];
    this.flushOutput();
    lang.setOutput((text)=>this.write_output(text));
    const rt={lang,PApplet,classes:this.runtime_classes()};
    const renderer={canvas:this.manager.target_element!,base_path:this.manager.base_uri,max_size:this.get_maximum_size()};
    try{
      this.applet=new globalThis.Function("$rt","__renderer__",sketch)(rt,renderer) as PApplet;
    }catch(e){
      this.report_error(e);
      return;
    }
    this.applet.__log_listener__=(args:any[])=>{this.log_listeners.forEach(l=>l(args))};
    if(typeof document!=="undefined")this.applet.focused=document.hasFocus();
    if(this.manager.sketch_resources_promise!=null)this.applet.__set_preload__((await this.manager.sketch_resources_promise).map((r:{path:string,content:ArrayBuffer})=>({path:r.path,content:new Uint8Array(r.content).buffer})));
    // Text in setup() and the first frames must already use the default font, as in Processing.
    if(options.usesText)await loadDefaultFont();
    this.initiated=true;
    try{
      await this.applet.settings();
      this.applet.__init_surface__();
      this.applet.__begin__();
      await this.applet.setup();
      this.applet.__end__();
    }catch(e){
      // An uncaught exception stops the sketch, as in Processing.
      this.report_error(e);
      this.initiated=false;
      return;
    }
    this.set_scaling();
    if(!this.manager.settings.manual_step)this.loop();
  }

  /**
   * requestAnimationFrame loop: a frame is drawn when it is due at the sketch's frameRate()
   * (several per animation frame when the frame rate is above the display's, up to a limit).
   */
  private frame(now:number){
    if(!this.applet||!this.initiated)return;
    this.animation_id=requestAnimationFrame((t)=>this.frame(t));
    if(this.stepping)return;
    const period=1000/Math.max(this.applet.__frameRate__,0.001);
    // A little slack so that 60 fps on a 60 Hz display does not skip every other frame.
    if(now+1<this.next_frame)return;
    if(now-this.next_frame>period*4)this.next_frame=now;
    this.stepping=true;
    void (async()=>{
      let n=0;
      try{
        while(this.initiated&&now+1>=this.next_frame&&n++<4){
          this.next_frame+=period;
          if(await this.step()!=0)break;
        }
      }finally{
        this.stepping=false;
      }
    })();
  }

  /**
   * Run exactly one frame (draw + queued events) without scheduling the next one.
   * Used directly when `SketchSettings.manual_step` is set (e.g. by the visual test harness).
   * @returns Exit code of the sketch (0 while running).
   */
  async step():Promise<number>{
    if(!this.applet)return 0;
    const applet=this.applet;
    const now = performance.now();
    if(this.last_time>0){
      // frameRate: the inverse of a running average of frame times.
      this.frame_ms=this.frame_ms*0.9+(now-this.last_time)*0.1;
      applet.frameRate=1000/this.frame_ms;
    }
    this.last_time = now;
    applet.__begin__();
    try{
      // frameCount counts drawn frames and is already 1 in the first draw(), as in Processing.
      if(applet.__loop__||applet.__redraw__||applet.frameCount==0){
        applet.__redraw__=false;
        applet.frameCount++;
        applet.__before_draw__();
        await applet.draw();
        applet.__after_draw__();
      }
      // Events are handled after draw(), so handlers can draw on top of the frame.
      const events=this.event_queue;
      this.event_queue=[];
      for(const event of events){
        if("name" in event)applet._windowResized();
        else applet.__handle_event__(event);
      }
    }catch(e){
      // An uncaught exception stops the sketch and leaves the last frame, as in Processing.
      this.report_error(e);
      this.halt();
      return 1;
    }
    const code=applet.__end__();
    if(code!=0){
      applet.__stop__();
      this.halt();
      console.log(`Sketch finished with exit code ${code}.`);
    }
    return code;
  }

  loop(){
    cancelAnimationFrame(this.animation_id);
    this.next_frame=0;
    this.animation_id=requestAnimationFrame((t)=>this.frame(t));
  }

  /** Stop the sketch (the editor's stop button): the canvas is cleared. */
  stop(){
    if(!this.initiated)return;
    this.halt();
    this.applet?.__stop__();
  }

  private halt(){
    this.initiated=false;
    cancelAnimationFrame(this.animation_id);
  }

  on_focus(){
    this.content_display=true;
    this.applet?.__focus__(true);
  }

  on_blur(){
    this.content_display=false;
    this.applet?.__focus__(false);
  }

  /** Mouse position in sketch pixels (integers, as in Processing). */
  private sketch_mouse(e:globalThis.MouseEvent){
    const m=this.convert_mouse(e.clientX,e.clientY);
    return {x:Math.floor(m.x),y:Math.floor(m.y)};
  }

  private mouse_event(e:globalThis.MouseEvent,action:number,button:number,count:number){
    const m=this.sketch_mouse(e);
    return new MouseEvent(e,Date.now(),action,domModifiers(e),m.x,m.y,button,count);
  }

  on_pointermove(e: PointerEvent){
    const m=this.sketch_mouse(e);
    if(this.press&&(m.x!==this.press.x||m.y!==this.press.y))this.press.moved=true;
    // While a button is down AWT sends drags, with the held button (left, then middle, then right).
    const held=e.buttons&1?LEFT:e.buttons&4?CENTER:e.buttons&2?RIGHT:0;
    this.event_queue.push(this.mouse_event(e,held?MouseEvent.DRAG:MouseEvent.MOVE,held,0));
  }

  on_pointerdown(e: PointerEvent){
    // Keep receiving moves (as drags) and the release when the pointer leaves the canvas.
    try{
      (e.target as Element|null)?.setPointerCapture?.(e.pointerId);
    }catch{
      // not capturable (synthetic event)
    }
    const m=this.sketch_mouse(e);
    const button=this.convert_button(e.button);
    const last=this.last_press;
    const now=performance.now();
    const again=button===last.button&&now-last.time<=MULTI_CLICK_MS&&Math.abs(m.x-last.x)<=MULTI_CLICK_PX&&Math.abs(m.y-last.y)<=MULTI_CLICK_PX;
    const count=again?last.count+1:1;
    this.last_press={time:now,x:m.x,y:m.y,button,count};
    this.press={x:m.x,y:m.y,moved:false};
    this.event_queue.push(this.mouse_event(e,MouseEvent.PRESS,button,count));
  }

  on_pointerup(e: PointerEvent){
    const button=this.convert_button(e.button);
    const count=this.last_press.count;
    this.event_queue.push(this.mouse_event(e,MouseEvent.RELEASE,button,count));
    // AWT's MOUSE_CLICKED: a press and a release without moving in between.
    if(this.press&&!this.press.moved)this.event_queue.push(this.mouse_event(e,MouseEvent.CLICK,button,count));
    this.press=null;
  }

  on_pointerenter(e: PointerEvent){
    this.event_queue.push(this.mouse_event(e,MouseEvent.ENTER,0,0));
  }

  on_pointerleave(e: PointerEvent){
    this.event_queue.push(this.mouse_event(e,MouseEvent.EXIT,0,0));
  }

  on_keydown(e: KeyboardEvent){
    const k=javaKey(e.key,e.keyCode,e.ctrlKey);
    const modifiers=domModifiers(e);
    this.event_queue.push(new KeyEvent(e,Date.now(),KeyEvent.PRESS,modifiers,k.key,k.keyCode,e.repeat));
    // AWT's KEY_TYPED follows the press of a key that types a character; its keyCode is 0.
    if(typesCharacter(k.key))this.event_queue.push(new KeyEvent(e,Date.now(),KeyEvent.TYPE,modifiers,k.key,0,e.repeat));
    if(e.key==="Tab"){
      e.preventDefault();
    }
  }

  on_keyup(e: KeyboardEvent){
    const k=javaKey(e.key,e.keyCode,e.ctrlKey);
    this.event_queue.push(new KeyEvent(e,Date.now(),KeyEvent.RELEASE,domModifiers(e),k.key,k.keyCode));
  }

  /** Wheel movement not yet reported, in notches. */
  private wheel_notches=0;

  on_wheel(e: WheelEvent){
    // The count is the number of whole notches (AWT's wheel rotation), positive when scrolling down
    // (towards the user). A notch is 100 pixels (Chromium), 3 lines (Firefox) or a page.
    this.wheel_notches+=e.deltaMode===1?e.deltaY/3:e.deltaMode===2?e.deltaY:e.deltaY/100;
    const count=Math.trunc(this.wheel_notches);
    if(count===0)return;
    this.wheel_notches-=count;
    const m=this.sketch_mouse(e);
    this.event_queue.push(new MouseEvent(e,Date.now(),MouseEvent.WHEEL,domModifiers(e),m.x,m.y,0,count));
  }

  on_resize(): void {
    this.event_queue.push({name:"_windowResized"});
  }

  on_contextmenu(e: globalThis.MouseEvent){
    // Right clicks belong to the sketch, not to the browser's menu.
    e.preventDefault();
  }

  set_scaling(): void {
    if(!this.applet)return;
    const rect=this.manager.target_element!.getBoundingClientRect();
    this.scaling={x:this.applet.width/rect.width,y:this.applet.height/rect.height};
    this.update_resolution(window.devicePixelRatio/Math.max(this.scaling.x,this.scaling.y));
  }

  get_applet_size():{w:number,h:number}{
    if(!this.applet)return {w:0,h:0};
    return {w:this.applet.width,h:this.applet.height};
  }

  get_aspect_ratio():number{
    if(!this.applet)return 0;
    return this.applet.__fullscreen__?0:this.applet.width/this.applet.height;
  }

  /** The drawing resolution is fixed by pixelDensity(). */
  update_resolution(_r: number): void {}

  addEventListener(type:"log"|"error",listener:(args:any[])=>void){
    switch(type){
      case "log":
        this.log_listeners.push(listener);
        break;
      case "error":
        this.error_listeners.push(listener);
        break;
    }
  }
}