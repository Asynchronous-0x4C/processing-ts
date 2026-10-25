import { DefaultRunner, Runner, type RunOptions } from "./runtime/runner/DefaultRunner";
import type { SavedFile } from "./runtime/io/SketchFiles";
import type { CompiledSketch, PrecompiledSketch, SketchSettings } from "./types";

/**
 * Runs compiled sketches (processing-ts/runtime): a sketch compiled ahead of time (`processing-ts build`,
 * the Vite plugin) or by SketchManager. Does not include the compiler.
 */
export class SketchPlayer{
  runner:Runner;
  settings:SketchSettings={
    frameRate:60,
    thread:"main",
    keep_aspect_ratio:false
  };

  target_element:HTMLCanvasElement|null=null;

  /** URL of the sketch folder: loadImage("a.png") reads <base_uri>data/a.png (or <base_uri>a.png). */
  base_uri:string="";
  /** Files added by the host (addFile()), relative to the sketch folder. */
  provided_files=new Map<string,Uint8Array|string>();

  constructor(settings?:SketchSettings){
    if(settings){
      this.settings=settings;
    }
    this.runner=this.createRunner();
  }

  /** The page's runner; with thread "worker" it is replaced by the worker runner at the first run. */
  protected createRunner():Runner{
    return new DefaultRunner(this);
  }

  /** thread "worker": load the worker runner (only pages that use it download it) and take over the listeners. */
  private async useWorkerRunner(){
    if(this.settings.thread!=="worker"||this.runner.is_worker)return;
    const { WorkerRunner }=await import("./runtime/worker/WorkerRunner");
    const old=this.runner;
    const r=new WorkerRunner(this);
    r.log_listeners=old.log_listeners;
    r.error_listeners=old.error_listeners;
    r.save_listeners=old.save_listeners;
    this.runner=r;
  }

  /** Canvases whose drawing went to a worker (transferControlToOffscreen() works once per canvas). */
  private static readonly transferred=new WeakSet<HTMLCanvasElement>();
  private window_events=false;

  /**
   * Set canvas to draw sketch.
   * @param target Canvas which you want to use.
   */
  mountPApplet(target:HTMLCanvasElement){
    this.target_element=target;
    if(!this.window_events){
      this.window_events=true;
      window.addEventListener('focus',()=>{this.runner.on_focus();});
      window.addEventListener('blur',()=>{this.runner.on_blur();});
      window.addEventListener("keydown",e=>{if(this.runner.on_keydown)this.runner.on_keydown(e)});
      window.addEventListener("keyup",e=>{if(this.runner.on_keyup)this.runner.on_keyup(e);});
    }
    this.initEvent(target);
  }

  /**
   * The canvas to give to a worker: the mounted one, or a copy put in its place in the page when that
   * one already went to a worker (a canvas can be transferred once). `target_element` is then the copy.
   */
  freshCanvas():HTMLCanvasElement{
    const old=this.target_element!;
    if(!SketchPlayer.transferred.has(old)){
      SketchPlayer.transferred.add(old);
      return old;
    }
    const c=old.cloneNode(false) as HTMLCanvasElement;
    old.replaceWith(c);
    this.mountPApplet(c);
    SketchPlayer.transferred.add(c);
    return c;
  }

  /** The canvas as an image (PNG by default), in either thread mode. */
  capture(mime="image/png"):Promise<Blob|null>{
    if(this.runner.capture)return this.runner.capture(mime);
    const c=this.target_element;
    return c?new Promise((resolve)=>c.toBlob(resolve,mime)):Promise.resolve(null);
  }

  /**
   * Initialize key/pointer events.
   * This method is called internally.
   * @param target_element Canvas
   */
  initEvent(target_element:HTMLCanvasElement){
    target_element.addEventListener("pointermove",e=>{if(this.runner.on_pointermove)this.runner.on_pointermove(e);});
    target_element.addEventListener("pointerdown",e=>{if(this.runner.on_pointerdown)this.runner.on_pointerdown(e);});
    target_element.addEventListener("pointerup",e=>{if(this.runner.on_pointerup)this.runner.on_pointerup(e)});
    target_element.addEventListener("pointerenter",e=>{if(this.runner.on_pointerenter)this.runner.on_pointerenter(e)});
    target_element.addEventListener("pointerleave",e=>{if(this.runner.on_pointerleave)this.runner.on_pointerleave(e)});
    target_element.addEventListener("wheel",e=>{if(this.runner.on_wheel)this.runner.on_wheel(e);},{passive:true});
    target_element.addEventListener("contextmenu",e=>{if(this.runner.on_contextmenu)this.runner.on_contextmenu(e)});
  }

  /**
   * Run a compiled sketch: one from SketchManager.transpileSketch(), or one compiled ahead of time
   * (`import sketch from "./MySketch/?pde"`, or the sketch.js of `processing-ts build`).
   * @param sketch Transpiled sketch
   */
  async runTranspiledSketch(sketch:CompiledSketch|PrecompiledSketch){
    this.stopSketch();
    await this.useWorkerRunner();
    if(this.target_element==null){
      console.error("target_element is not set. Please call mountPApplet() before running a sketch");
      return;
    }
    if("result" in sketch){
      if(sketch.error!=null&&sketch.error.error)return;
      await this.runner.init(sketch.result,sketch.map,{usesText:sketch.usesText,files:sketch.files,listed:sketch.listed});
    }else{
      if(this.base_uri===""&&sketch.base!==undefined)this.base_uri=new URL(sketch.base,document.baseURI).href;
      const options:RunOptions={usesText:sketch.usesText,files:sketch.files,listed:sketch.listed,urls:sketch.urls,opengl:sketch.opengl,shapes:sketch.shapes,font:sketch.font};
      await this.runner.init(sketch.sketch,sketch.map,options);
    }
    if(this.settings.keep_aspect_ratio){
      this.setAspectRatio();
    }
  }

  /** Same as runTranspiledSketch(). */
  run(sketch:CompiledSketch|PrecompiledSketch){
    return this.runTranspiledSketch(sketch);
  }

  /**
   * Stop running sketch.
   */
  stopSketch(){
    this.runner.stop();
  }

  /**
   * Send text printed without a final newline (print("x")) to the log listeners now.
   */
  flushOutput():Promise<void>{
    return Promise.resolve(this.runner.flushOutput());
  }

  /**
   * Advance the sketch by the given number of frames.
   * Intended for sketches started with `manual_step: true` (deterministic tests).
   * @param frames Number of draw() calls to run.
   */
  async step(frames:number=1){
    for(let i=0;i<frames;i++){
      if(await this.runner.step()!=0)break;
    }
  }

  getAspectRatio(){
    return this.runner.get_aspect_ratio();
  }

  resize(){
    if(this.runner.on_resize)this.runner.on_resize();
    this.runner.set_scaling();
    if(this.settings.keep_aspect_ratio){
      this.setAspectRatio();
    }
  }

  protected setAspectRatio(){
    const rect=this.target_element!.parentElement!.getBoundingClientRect();
    const size=this.runner.get_applet_size();
    if(size.w==0&&size.h==0)return;
    if(this.runner.scaling.x<this.runner.scaling.y){
      const scale=rect.height/size.h;
      this.target_element!.style.width=`${size.w*scale}px`;
      this.target_element!.style.height=`${size.h*scale}px`;
    }else if(this.runner.scaling.y<this.runner.scaling.x){
      const scale=rect.width/size.w;
      this.target_element!.style.height=`${size.h*scale}px`;
      this.target_element!.style.width=`${size.w*scale}px`;
    }
    this.runner.set_scaling();
  }

  /**
   * Add dependent class which is necessary in your sketch.
   * @param data The name and type of dependent class.
   * @param override Whether to override the current dependency if the dependent class has a duplicated name.
   */
  addDependency(data:{name:string,type:any},override?:boolean){
    this.runner.addDependency(data,override??false);
  }

  getDependentNames():string[]{
    return this.runner.getDependentNames();
  }

  getDependentClasses():any[]{
    return this.runner.getDependentClasses();
  }

  /**
   * Add a file of the sketch folder in memory (e.g. an uploaded image as "data/a.png"); the sketch reads
   * it before anything fetched from `base_uri`.
   */
  addFile(path:string,content:ArrayBuffer|Uint8Array|string){
    this.provided_files.set(path,content instanceof ArrayBuffer?new Uint8Array(content):content);
  }

  /**
   * "log": println output (one call per line). "error": compile errors and uncaught exceptions.
   * "save": a file written by the sketch (saveStrings(), save(), saveFrame()...): {path, data, mime}.
   */
  addEventListener(type:"log"|"error",listener:(args:any[])=>void):void;
  addEventListener(type:"save",listener:(file:SavedFile)=>void):void;
  addEventListener(type:"log"|"error"|"save",listener:(arg:any)=>void){
    this.runner.addEventListener(type,listener);
  }
}
