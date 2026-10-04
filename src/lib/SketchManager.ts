import { transpile, TranspileErrorListener } from "./transpiler/Control";
import { DefaultRunner, Runner } from "./runtime/runner/DefaultRunner";
import { Token } from "antlr4";

/**
 * @property manual_step When true, the frame loop is not started automatically; advance frames with `SketchManager.step()`.
 */
export type SketchSettings={frameRate?:number,thread?:"main",keep_aspect_ratio?:boolean,manual_step?:boolean};
export type SketchData={main:string,content:{name:string,content:string}[]};
export type SketchFile={base_uri:string,main_sketch:string,sketches:string[],resources?:string[]}

/**
 * Manage transpile and execution of sketch.
 */
export class SketchManager{
  runner:Runner;
  settings:SketchSettings={
    frameRate:60,
    thread:"main",
    keep_aspect_ratio:false
  };

  target_element:HTMLCanvasElement|null=null;

  sketch_resources_promise:Promise<{path:string, content:ArrayBuffer}[]> | null = null;
  base_uri:string="";

  constructor(settings?:SketchSettings){
    if(settings){
      this.settings=settings;
    }
    switch(this.settings.thread){
      case "main":
        this.runner=new DefaultRunner(this);
        break;
      default:
        this.runner=new DefaultRunner(this);
        break;
    }
  }

  /**
   * Set canvas to draw sketch.
   * @param target Canvas which you want to use.
   */
  mountPApplet(target:HTMLCanvasElement){
    this.target_element=target;
    window.addEventListener('focus',()=>{this.runner.on_focus();});
    window.addEventListener('blur',()=>{this.runner.on_blur();});
    this.initEvent(target);
  }

  /**
   * Load sketch from relative path.
   * @param sketch_path Relative path to sketch folder or sketch data object.
   * @returns Sketch data which required to transpile.
   */
  async loadSketch(sketch_path:string|SketchFile):Promise<SketchData> {
    this.base_uri=new URL(typeof sketch_path==="string"?sketch_path:sketch_path.base_uri,document.baseURI).href;
    const sketch_property=typeof sketch_path==="string"?await (await fetch(new URL(sketch_path+"sketch.properties",document.baseURI))).text():"";
    const main_sketch=typeof sketch_path==="string"?sketch_property.match(/\n*(?<!#\s*)main\s*=\s*(.+\.pde)/)![1]:sketch_path.main_sketch;
    let m;
    const sketch_names=typeof sketch_path==="string"?(m=sketch_property.match(/\n*(?<!#\s*)sketches\s*=((\s*\w+.pde)+)/))!=null?m[1].split(/[\s,]+/).map(s=>s.trim()):[main_sketch]:sketch_path.sketches;
    const sketch_resources=typeof sketch_path==="string"?(m=sketch_property.match(/\n*(?<!#\s*)resources\s*=[\s,]*(([\w\.]+[,\s]+)*)/))!=null?m[1].split(/[\s,]+/).map(s=>s.trim()):[]:sketch_path.resources??[];
    
    this.sketch_resources_promise = Promise.all(sketch_resources.map(async(resource) => {
      return {path:resource,content:await fetch(new URL(sketch_path + resource, document.baseURI)).then(res => res.arrayBuffer())};
    }));

    const sketch_content=await Promise.all(sketch_names.map(async(name)=>{
        return {name:name,content:await fetch(new URL(sketch_path + name, document.baseURI)).then(res=>res.text())};
    }));
    return {main:main_sketch,content:sketch_content};
  }

  /**
   * Load sketch from string.
   * @param sketch Sketch source string
   * @param name Sketch name
   * @param resources Static resource path which your sketch use
   * @returns Sketch data which required to transpile
   */
  loadSketchString(sketch:string,name:string,resources?:string[]):SketchData{
    this.sketch_resources_promise = Promise.all((resources??[]).map(async(resource) => {
      return {path:resource,content:await fetch(new URL(resource, document.baseURI)).then(res => res.arrayBuffer())};
    }));

    const sketch_content=[{name:name,content:sketch}];
    return {main:name,content:sketch_content};
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
    window.addEventListener("keydown",e=>{if(this.runner.on_keydown)this.runner.on_keydown(e)});
    window.addEventListener("keyup",e=>{if(this.runner.on_keyup)this.runner.on_keyup(e);});
    target_element.addEventListener("wheel",e=>{if(this.runner.on_wheel)this.runner.on_wheel(e);},{passive:true});
    target_element.addEventListener("contextmenu",e=>{if(this.runner.on_contextmenu)this.runner.on_contextmenu(e)});
  }

  /**
   * Transpile sketch.
   * @param sketch_data Loaded sketch data
   * @returns Transpiled sketch.
   */
  transpileSketch(sketch_data:SketchData):{result: string;error: TranspileErrorListener<Token>;}{
    let transpiled=transpile(sketch_data.content.map(s=>s.content).join("\n"),sketch_data.main.replace(".pde",""));
    if(transpiled.error.error){
      this.runner.error_listeners.forEach(l=>l(transpiled.error.getErrorMessage()));
    }
    return transpiled;
  }

  /**
   * Run transpiled sketch.
   * @param sketch Transpiled sketch
   */
  async runTranspiledSketch(sketch:{result: string;error: TranspileErrorListener<Token>|null;}){
    this.stopSketch();
    if(sketch.error!=null&&sketch.error.error)return;
    await this.runner.init(sketch.result);
    if(this.settings.keep_aspect_ratio){
      this.setAspectRatio();
    }
  }

  /**
   * Transpile and run sketch.
   * @param sketch_data Loaded sketch data
   * @returns 
   */
  async runSketch(sketch_data:SketchData) {
    if(this.target_element==null){
      console.error("target_element is not set. Please call mountPApplet() before runSketch()");
      return;
    }
    const sketch=this.transpileSketch(sketch_data);
    await this.runTranspiledSketch(sketch);
  }

  /**
   * Stop running sketch.
   */
  stopSketch(){
    this.runner.stop();
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

  private setAspectRatio(){
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

  addEventListener(type:"log"|"error",listener:(args:any[])=>void){
    this.runner.addEventListener(type,listener);
  }
}