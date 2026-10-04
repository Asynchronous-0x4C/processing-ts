import { SketchManager } from "../..";
import { Cursor } from "../awt/Cursor";
import { PApplet } from "../PApplet";
import { ArrayList } from "../util/ArrayList";
import { Runnable, Consumer, Supplier, Function, FunctionalInterface } from "../util/function";
import { Event, MouseEvent, KeyEvent } from "../event";
import { PVector } from "../util/PVector";
import { HashMap } from "../util/HashMap";

export abstract class Runner{
  pre_count:number=-1;
  initiated:boolean=false;
  scaling:{x:number,y:number}={x:1,y:1};
  log_listeners:((...args:any[])=>void)[]=[];
  error_listeners:((...args:any[])=>void)[]=[];

  arg_classes:{name:string,type:any}[]=[{name:"PApplet",type:PApplet},{name:"PVector",type:PVector},{name:"ArrayList",type:ArrayList},{name:"HashMap",type:HashMap},{name:"Cursor",type:Cursor},{name:"Runnable",type:Runnable},{name:"Consumer",type:Consumer},{name:"Supplier",type:Supplier},{name:"Function",type:Function},{name:"FunctionalInterface",type:FunctionalInterface},];

  abstract manager:SketchManager;

  abstract init(sketch:string):void;
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

export function convert_button(button:number){
  switch(button){
    case 0:button=37;break;
    case 1:button=3;break;
    case 2:button=39;break;
  }
  return button
}

export class DefaultRunner extends Runner{
  pre_count: number=-1;
  initiated: boolean=false;

  manager: SketchManager;

  event_queue:Array<{name:string, event:Event}>;//queue events to be processed in the next frame
  content_display:boolean=true;
  applet: PApplet | null = null;

  last_time=0;

  constructor(manager:SketchManager){
    super();
    this.manager=manager;
    this.event_queue=[];
  }

  async init(sketch:string){
    this.event_queue=[];
    this.applet=new globalThis.Function("__renderer__",...this.arg_classes.map(c=>c.name),sketch)({canvas:this.manager.target_element!,base_path:this.manager.base_uri,max_size:this.get_maximum_size()},...this.arg_classes.map(c=>c.type)) as PApplet;
    this.applet.width=this.manager.target_element!.clientWidth;
    this.applet.height=this.manager.target_element!.clientHeight;
    this.applet.__log_listener__=(args:any[])=>{this.log_listeners.forEach(l=>l(args))};
    if(this.manager.sketch_resources_promise!=null)this.applet.__set_preload__((await this.manager.sketch_resources_promise).map((r:{path:string,content:ArrayBuffer})=>({path:r.path,content:new Uint8Array(r.content).buffer})));
    this.initiated=true;
    try{
      this.applet.__begin__();
      await this.applet.settings();
      await this.applet.setup();
      this.applet.__end__();
    }catch(e){
      if(e instanceof Error)this.error_listeners.forEach(l=>l(e.message));
      console.error(e)
    }
    this.set_scaling();
    if(!this.manager.settings.manual_step)this.loop();
  }

  private async frame():Promise<void>{
    if(!this.applet)return;
    if(!this.initiated){
      this.applet.__stop__();
      console.log(`Sketch finished with exit code 0.`);
      return;
    }
    const ID=setTimeout(async ()=>{this.frame();},this.content_display?1000/this.applet.__frameRate__:1000);
    if(await this.step()!=0)clearTimeout(ID);
  }

  /**
   * Run exactly one frame (draw + queued events) without scheduling the next one.
   * Used directly when `SketchSettings.manual_step` is set (e.g. by the visual test harness).
   * @returns Exit code of the sketch (0 while running).
   */
  async step():Promise<number>{
    if(!this.applet)return 0;
    const now = performance.now();
    const deltaTime = now - this.last_time;
    this.last_time = now;
    this.applet.frameRate=1000/deltaTime;
    this.applet.__begin__();
    try{
      if(this.applet.__loop__||this.applet.frameCount==0)await this.applet.draw();
      // if(this.applet!.frameCount%60===0)this.applet!.println(1000/deltaTime);
    }catch(e){
      if(e instanceof Error)this.error_listeners.forEach(l=>l(e.message));
      console.error(e);
    }
    const code=this.applet.__end__();
    if(code!=0){
      this.applet.__stop__();
      this.stop();
      console.log(`Sketch finished with exit code ${code}.`);
    }
    this.applet.frameCount++;
    this.applet.pmouseX=this.applet.mouseX;
    this.applet.pmouseY=this.applet.mouseY;
    while(this.event_queue.length>0){
      const event=this.event_queue.shift()!;
      let mouse:{x:number,y:number};
      switch(event.name){
        case "_mousePressed":
          this.applet.mousePressed=true;
          mouse=this.convert_mouse((event.event as MouseEvent).x,(event.event as MouseEvent).y);
          this.applet.mouseX=mouse.x;
          this.applet.mouseY=mouse.y;
          this.applet.mouseButton=(event.event as MouseEvent).button;
          this.applet._mousePressed(event.event as MouseEvent);
          break;
        case "_mouseReleased":
          this.applet.mousePressed=false;
          mouse=this.convert_mouse((event.event as MouseEvent).x,(event.event as MouseEvent).y);
          this.applet.mouseX=mouse.x;
          this.applet.mouseY=mouse.y;
          this.applet.mouseButton=(event.event as MouseEvent).button;
          this.applet._mouseReleased(event.event as MouseEvent);
          break;
        case "_mouseMoved":
          mouse=this.convert_mouse((event.event as MouseEvent).x,(event.event as MouseEvent).y);
          this.applet.mouseX=mouse.x;
          this.applet.mouseY=mouse.y;
          this.applet._mouseMoved(event.event as MouseEvent);
          break;
        case "_keyPressed":
          this.applet.keyPressed=true;
          this.applet.key=(event.event as KeyEvent).key;
          this.applet.keyCode=(event.event as KeyEvent).keyCode;
          this.applet._keyPressed(event.event as KeyEvent);
          this.applet._keyTyped(event.event as KeyEvent);
          break;
        case "_keyReleased":
          this.applet.keyPressed=false;
          this.applet._keyReleased(event.event as KeyEvent);
          break;
        case "_mouseWheel":
          this.applet._mouseWheel(event.event as MouseEvent);
          break;
        case "_windowResized":
          this.applet._windowResized();
          break;
        default:
          console.error("Unknown event name: "+event.name);
      }
    }
    return code;
  }

  loop(){
    this.frame();
  }

  stop(){
    if(!this.initiated)return;
    this.initiated=false;
  }

  on_focus(){
    this.content_display=true;
  }

  on_blur(){
    this.content_display=false;
  }

  on_pointermove(e: PointerEvent){
    this.event_queue.push({name:"_mouseMoved",event:new MouseEvent(e.clientX,e.clientY,this.convert_button(e.button),0)});
  }

  on_pointerdown(e: PointerEvent){
    this.event_queue.push({name:"_mousePressed",event:new MouseEvent(e.clientX,e.clientY,this.convert_button(e.button),0)});
  }

  on_pointerup(e: PointerEvent){
    this.event_queue.push({name:"_mouseReleased",event:new MouseEvent(e.clientX,e.clientY,this.convert_button(e.button),0)});
  }

  on_keydown(e: KeyboardEvent){
    const modifiers = e.getModifierState("Shift") ? 1 : 0;
    this.event_queue.push({name:"_keyPressed",event:new KeyEvent(e.key,e.keyCode,modifiers)});
    if(e.key==="Tab"){
      e.preventDefault();
    }
  }

  on_keyup(e: KeyboardEvent){
    const modifiers = e.getModifierState("Shift") ? 1 : 0;
    this.event_queue.push({name:"_keyReleased",event:new KeyEvent(e.key,e.keyCode,modifiers)});
  }

  on_wheel(e: WheelEvent){
    this.event_queue.push({name:"_mouseWheel",event:new MouseEvent(e.clientX,e.clientY,this.convert_button(e.button),this.sign(e.deltaY))});
  }

  on_resize(): void {
    this.event_queue.push({name:"_windowResized",event:new Event()});
  }

  on_contextmenu?: ((e: globalThis.MouseEvent) => void) | undefined;

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

  update_resolution(r: number): void {
    this.applet?.g.updateResolution(r);
  }

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