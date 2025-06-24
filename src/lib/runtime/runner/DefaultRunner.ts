import { SketchManager } from "../..";
import { Cursor } from "../awt/Cursor";
import { PApplet } from "../PApplet";
import { ArrayList } from "../util/ArrayList";
import { Runnable, Consumer, Supplier, Function, FunctionalInterface } from "../util/function";
import { Event, MouseEvent, KeyEvent } from "../event";
import { PVector } from "../util/PVector";
import { set_base_uri } from "../worker/worker_data";
import { Renderer } from "../renderer/Renderer";
import { DefaultRenderer } from "../renderer/DefaultRenderer";

export abstract class Runner{
  pre_count:number=-1;
  initiated:boolean=false;
  scaling:{x:number,y:number}={x:1,y:1};

  abstract manager:SketchManager;

  abstract init(sketch:string):void;
  abstract loop():void;
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

  get_maximum_size():{width:number,height:number}{
    const rect=this.manager.target_element!.getBoundingClientRect();
    return {width:rect.width,height:rect.height};
  }
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
  renderer:Renderer|null=null;

  event_queue:Array<{name:string, event:Event}>;//queue events to be processed in the next frame
  content_display:boolean=true;
  applet: PApplet | null = null;

  last_time=0;
  loop_count=0;

  constructor(manager:SketchManager){
    super();
    this.manager=manager;
    this.event_queue=[];
  }

  async init(sketch:string){
    this.event_queue=[];
    this.renderer=new DefaultRenderer(this.manager.target_element!,this.manager.base_uri,this.get_maximum_size());
    const arg_classes=[PApplet,PVector,ArrayList,Cursor,Runnable,Consumer,Supplier,Function,FunctionalInterface];
    this.applet=new globalThis.Function("__renderer__",...arg_classes.map(c=>c.name),sketch)(this.renderer,...arg_classes) as PApplet;
    this.applet.width=this.manager.target_element!.clientWidth;
    this.applet.height=this.manager.target_element!.clientHeight;
    if(this.manager.sketch_resources_promise!=null)this.applet.__set_preload__((await this.manager.sketch_resources_promise).map((r:{path:string,content:ArrayBuffer})=>({path:r.path,content:new Uint8Array(r.content).buffer})));
    set_base_uri(this.manager.base_uri);
    this.initiated=true;
    await this.applet.settings();
    await this.applet.setup();
    this.set_scaling();
    this.loop();
  }

  loop(){
    const self=this;
    const ID=setInterval(async function() {
      const now = performance.now();
      const deltaTime = now - self.last_time;
      self.last_time = now;
      self.applet!.frameRate=1000/deltaTime;
      self.applet?.__begin__();
      await self.applet!.draw();
      const code=self.applet?.__end__();
      if(code!=0||!self.initiated){
        clearInterval(ID);
        self.applet?.__stop__();
        console.log(`Sketch finished with exit code ${code}.`);
      }
      self.applet!.frameCount++;
      self.loop_count++;
      while(self.event_queue.length>0){
        const event=self.event_queue.shift()!;
        let mouse:{x:number,y:number};
        switch(event.name){
          case "_mousePressed":
            self.applet!.mousePressed=true;
            mouse=self.convert_mouse((event.event as MouseEvent).x,(event.event as MouseEvent).y);
            self.applet!.mouseX=mouse.x;
            self.applet!.mouseY=mouse.y;
            self.applet!.mouseButton=(event.event as MouseEvent).button;
            self.applet!._mousePressed(event.event as MouseEvent);
            break;
          case "_mouseReleased":
            self.applet!.mousePressed=false;
            mouse=self.convert_mouse((event.event as MouseEvent).x,(event.event as MouseEvent).y);
            self.applet!.mouseX=mouse.x;
            self.applet!.mouseY=mouse.y;
            self.applet!.mouseButton=(event.event as MouseEvent).button;
            self.applet!._mouseReleased(event.event as MouseEvent);
            break;
          case "_mouseMoved":
            mouse=self.convert_mouse((event.event as MouseEvent).x,(event.event as MouseEvent).y);
            self.applet!.mouseX=mouse.x;
            self.applet!.mouseY=mouse.y;
            self.applet!._mouseMoved(event.event as MouseEvent);
            break;
          case "_keyPressed":
            self.applet!.keyPressed=true;
            self.applet!.key=(event.event as KeyEvent).key;
            self.applet!.keyCode=(event.event as KeyEvent).keyCode;
            self.applet!._keyPressed(event.event as KeyEvent);
            break;
          case "_keyReleased":
            self.applet!.keyPressed=false;
            self.applet!._keyReleased(event.event as KeyEvent);
            break;
          case "_mouseWheel":
            self.applet!._mouseWheel(event.event as MouseEvent);
            break;
          case "_windowResized":
            self.applet!._windowResized();
            break;
          default:
            console.error("Unknown event name: "+event.name);
        }
      }
    },this.content_display?1000/this.applet!.__frameRate__:1000);
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
  }

  get_applet_size():{w:number,h:number}{
    if(!this.applet)return {w:0,h:0};
    return this.applet.__fullscreen__?{w:0,h:0}:{w:this.applet.width,h:this.applet.height};
  }
}