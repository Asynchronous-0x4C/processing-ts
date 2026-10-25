// The page's side of the Worker execution mode (SketchSettings.thread "worker", ROADMAP P4-4): the sketch
// runs in a worker (entry.ts) drawing to the canvas through an OffscreenCanvas; this runner forwards the
// page's events and focus to it and its output (println, errors, saved files, cursor, title) back.
// stop() ends the worker, so an endless loop in the sketch cannot freeze the page.
import type { SketchPlayer } from "../../SketchPlayer";
import type { SketchFunction } from "../../types";
import type { SourceMapV3 } from "../../../compiler/sourcemap.ts";
import { Runner, type Rect, type RunOptions } from "../runner/DefaultRunner";
import { createSketchWorker } from "./createWorker";
import { defaultFontLocation } from "../PFont";
import { eventData, type EventData, type FromWorker, type ToWorker } from "./protocol";

/** URLs of the sketch's files resolved against the page. */
function absoluteURLs(urls:Record<string,string>|undefined):Record<string,string>|undefined{
  if(!urls)return undefined;
  return Object.fromEntries(Object.entries(urls).map(([k,v])=>[k,new URL(v,document.baseURI).href]));
}

export class WorkerRunner extends Runner{
  manager:SketchPlayer;
  readonly is_worker=true;
  private worker:Worker|null=null;
  private size={width:0,height:0,fullscreen:false};
  private next_id=0;
  /** Requests waiting for the worker's answer ("ended": the worker is gone). */
  private readonly waiting=new Map<number,(m:FromWorker|{type:"ended"})=>void>();
  private ready:(()=>void)|null=null;

  constructor(manager:SketchPlayer){
    super();
    this.manager=manager;
  }

  async init(sketch:string|SketchFunction,_map?:SourceMapV3|null,options:RunOptions={}){
    this.end();
    const canvas=this.manager.freshCanvas();
    const offscreen=canvas.transferControlToOffscreen();
    const worker=this.worker=createSketchWorker(this.manager.settings.workerURL);
    worker.onmessage=(e:MessageEvent<FromWorker>)=>this.receive(e.data);
    worker.onerror=(e)=>{
      // The worker script itself failed (not the sketch: its exceptions arrive as "error" messages).
      e.preventDefault();
      this.error_listeners.forEach(l=>l(`Worker: ${e.message}`));
      this.resolveAll();
    };
    const s=this.manager.settings;
    const message:ToWorker={
      type:"init",canvas:offscreen,
      code:typeof sketch==="string"?sketch:sketch.toString(),isFunction:typeof sketch!=="string",
      // URLs are resolved here, against the page: in the worker, relative URLs would be relative to its
      // script (and the default font is next to the page's runtime, which a bundler may have moved).
      options:{...options,font:new URL(options.font??defaultFontLocation().href,document.baseURI).href,urls:absoluteURLs(options.urls)},
      base_uri:new URL(this.manager.base_uri||"./",document.baseURI).href,files:[...this.manager.provided_files],
      frameRate:s.frameRate??60,manual_step:!!s.manual_step,
      rect:this.element_rect(),dpr:this.device_pixel_ratio(),focused:typeof document!=="undefined"&&document.hasFocus(),
    };
    this.initiated=true;
    const done=new Promise<void>((resolve)=>{this.ready=resolve;});
    worker.postMessage(message,[offscreen]);
    await done;
  }

  private receive(m:FromWorker){
    switch(m.type){
      case "ready":
        if(!m.ok)this.initiated=false;
        this.set_scaling();
        this.ready?.();
        this.ready=null;
        break;
      case "size":{
        this.size={width:m.width,height:m.height,fullscreen:m.fullscreen};
        const c=this.manager.target_element;
        if(c){
          c.style.width=`${m.width}px`;
          c.style.height=`${m.height}px`;
        }
        break;
      }
      case "log":
        this.log_listeners.forEach(l=>l(m.args));
        break;
      case "error":
        this.error_listeners.forEach(l=>l(m.message));
        break;
      case "save":
        this.save_listeners.forEach(l=>l(m.file));
        break;
      case "cursor":
        if(this.manager.target_element)this.manager.target_element.style.cursor=m.css;
        break;
      case "cursorImage":{
        const c=document.createElement("canvas");
        c.width=m.image.width;
        c.height=m.image.height;
        c.getContext("2d")!.drawImage(m.image,0,0);
        if(this.manager.target_element)this.manager.target_element.style.cursor=`url(${c.toDataURL()}) ${m.x} ${m.y}, auto`;
        break;
      }
      case "title":
        document.title=m.title;
        break;
      case "stepped":
      case "flushed":
      case "captured":
        this.waiting.get(m.id)?.(m);
        this.waiting.delete(m.id);
        break;
    }
  }

  private send(m:ToWorker){
    this.worker?.postMessage(m);
  }

  /** A request answered by the worker; resolves with `fallback` when the worker ends first. */
  private request<T>(make:(id:number)=>ToWorker,answer:(m:FromWorker)=>T,fallback:T):Promise<T>{
    if(!this.worker)return Promise.resolve(fallback);
    const id=++this.next_id;
    return new Promise<T>((resolve)=>{
      this.waiting.set(id,(m)=>resolve(m.type==="ended"?fallback:answer(m)));
      this.send(make(id));
    });
  }

  /** Answer every pending request (the worker is gone). */
  private resolveAll(){
    for(const w of this.waiting.values())w({type:"ended"});
    this.waiting.clear();
    this.ready?.();
    this.ready=null;
  }

  loop(){}

  step():Promise<number>{
    return this.request((id)=>({type:"step",id}),(m)=>m.type==="stepped"?m.code:1,1);
  }

  flushOutput():Promise<void>{
    return this.request((id)=>({type:"flush",id}),()=>undefined,undefined);
  }

  /** The canvas as an image (the worker owns its pixels). */
  capture(mime="image/png"):Promise<Blob|null>{
    return this.request((id)=>({type:"capture",id,mime}),(m)=>m.type==="captured"?m.blob:null,null);
  }

  /** End the worker. */
  private end(){
    if(!this.worker)return;
    this.worker.terminate();
    this.worker=null;
    this.initiated=false;
    this.resolveAll();
  }

  /** Stop the sketch (the editor's stop button): the worker ends, even in an endless loop, and the canvas is cleared. */
  stop(){
    if(!this.worker)return;
    this.end();
    this.manager.freshCanvas();
  }

  on_focus(){
    this.send({type:"focus",focused:true});
  }

  on_blur(){
    this.send({type:"focus",focused:false});
  }

  private forward(kind:EventData["kind"],e:globalThis.MouseEvent|KeyboardEvent|WheelEvent){
    this.send({type:"event",event:eventData(kind,e),rect:this.element_rect()});
  }

  on_pointermove(e:PointerEvent){this.forward("pointermove",e);}
  on_pointerdown(e:PointerEvent){
    // Keep receiving moves (as drags) and the release when the pointer leaves the canvas.
    try{
      (e.target as Element|null)?.setPointerCapture?.(e.pointerId);
    }catch{
      // not capturable (synthetic event)
    }
    this.forward("pointerdown",e);
  }
  on_pointerup(e:PointerEvent){this.forward("pointerup",e);}
  on_pointerenter(e:PointerEvent){this.forward("pointerenter",e);}
  on_pointerleave(e:PointerEvent){this.forward("pointerleave",e);}
  on_keydown(e:KeyboardEvent){
    if(e.key==="Tab")e.preventDefault();
    this.forward("keydown",e);
  }
  on_keyup(e:KeyboardEvent){this.forward("keyup",e);}
  on_wheel(e:WheelEvent){this.forward("wheel",e);}
  on_resize(){
    this.send({type:"resize"});
  }
  on_contextmenu(e:globalThis.MouseEvent){
    e.preventDefault();
  }

  set_scaling(){
    if(!this.size.width||!this.manager.target_element)return;
    const rect:Rect=this.element_rect();
    this.scaling={x:this.size.width/rect.width,y:this.size.height/rect.height};
    this.send({type:"rect",rect,dpr:this.device_pixel_ratio()});
  }

  get_applet_size(){
    return {w:this.size.width,h:this.size.height};
  }

  get_aspect_ratio(){
    if(!this.size.width)return 0;
    return this.size.fullscreen?0:this.size.width/this.size.height;
  }

  update_resolution(_r:number){}

  addEventListener(type:"log"|"error"|"save",listener:(arg:any)=>void){
    if(type==="save")this.save_listeners.push(listener);
    else if(type==="log")this.log_listeners.push(listener);
    else this.error_listeners.push(listener);
  }
}
