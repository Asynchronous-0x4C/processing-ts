import { compileSketch, formatDiagnostic } from "../compiler/index.ts";
import { CompileCache } from "./CompileCache";
import { SketchPlayer } from "./SketchPlayer";
import { CompileErrors, type CompiledSketch, type SketchData, type SketchFile, type SketchSettings } from "./types";

export { CompileCache } from "./CompileCache";
export { SketchPlayer } from "./SketchPlayer";
export { CompileErrors, type CompiledSketch, type PrecompiledSketch, type SketchData, type SketchFile, type SketchFunction, type SketchSettings } from "./types";

/** A sketch with the usual parts of a sketch: fields, classes, loops, arrays, strings, drawing calls. @internal (exported for its test) */
export const WARM_UP_SKETCH=`
ArrayList<Ball> balls = new ArrayList<Ball>();
float[] xs = new float[10];
int count = 0;
String label = "warm";
void setup() {
  size(200, 200);
  for (int i = 0; i < 10; i++) {
    balls.add(new Ball(random(width), random(height), i * 0.5));
    xs[i] = i * 2.5;
  }
}
void draw() {
  background(204);
  noStroke();
  for (Ball b : balls) {
    b.move();
    b.display();
  }
  if (mousePressed && count % 2 == 0) {
    fill(255, 0, 0);
    ellipse(mouseX, mouseY, 20, 20);
  } else {
    stroke(0);
    line(0, 0, width, height);
  }
  count++;
  text(label + " " + count + " " + nf(xs[3], 1, 2), 10, 20);
}
void keyPressed() {
  if (key == 'r') balls.clear();
}
class Ball {
  float x, y, speed;
  Ball(float x, float y, float speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
  }
  void move() {
    y += speed;
    if (y > height) y = 0;
  }
  void display() {
    fill(color(x % 255, 100, 200));
    rect(x, y, 10, 10);
  }
}
`;

let warmedUp=false;

/** Run `f` when the page is idle (or soon, where there is no requestIdleCallback). */
function whenIdle(f:()=>void){
  if(typeof requestIdleCallback==="function")requestIdleCallback(()=>f(),{timeout:2000});
  else setTimeout(f,50);
}

/**
 * Manage transpile and execution of sketch: loads .pde files, compiles them in the page and runs them
 * (SketchPlayer). For sketches compiled ahead of time, SketchPlayer alone (processing-ts/runtime) is enough.
 */
export class SketchManager extends SketchPlayer{
  /** sketch.properties `resources` / loadSketchString() resources. */
  private listed_files:string[]=[];
  /** Compiled sketches by source (settings.cache). */
  readonly cache:CompileCache|null;

  constructor(settings?:SketchSettings){
    super(settings);
    const c=this.settings.cache;
    this.cache=c instanceof CompileCache?c:c?new CompileCache():null;
    if(this.settings.warm_up!==false)whenIdle(()=>this.warmUp());
  }

  /**
   * Compile a small sketch that uses the common constructs (once per page): the compiler's code is then
   * optimized by the JIT and the library model is read, so the first real compile is about twice as fast.
   * Called when the page is idle unless `settings.warm_up` is false.
   */
  warmUp(){
    if(warmedUp)return;
    warmedUp=true;
    compileSketch([{name:"WarmUp.pde",text:WARM_UP_SKETCH}]);
  }

  /**
   * Load sketch from relative path.
   * @param sketch_path Relative path to sketch folder or sketch data object.
   * @returns Sketch data which required to transpile.
   */
  async loadSketch(sketch_path:string|SketchFile):Promise<SketchData> {
    const folder=typeof sketch_path==="string"?sketch_path:sketch_path.base_uri;
    this.base_uri=new URL(folder.endsWith("/")?folder:folder+"/",document.baseURI).href;
    const sketch_property=typeof sketch_path==="string"?await (await fetch(new URL("sketch.properties",this.base_uri))).text():"";
    const main_sketch=typeof sketch_path==="string"?sketch_property.match(/\n*(?<!#\s*)main\s*=\s*(.+\.pde)/)![1]:sketch_path.main_sketch;
    let m;
    const sketch_names=typeof sketch_path==="string"?(m=sketch_property.match(/\n*(?<!#\s*)sketches\s*=((\s*\w+.pde)+)/))!=null?m[1].split(/[\s,]+/).map(s=>s.trim()):[main_sketch]:sketch_path.sketches;
    // resources = data/a.png, data/b.txt (paths relative to the sketch folder)
    const sketch_resources=typeof sketch_path==="string"?(m=sketch_property.match(/^[ \t]*resources[ \t]*=(.*)$/m))!=null?m[1].split(/[\s,]+/).map(s=>s.trim()):[]:sketch_path.resources??[];

    this.listed_files=sketch_resources.filter(r=>r!=="");

    const sketch_content=await Promise.all(sketch_names.map(async(name)=>{
        return {name:name,content:await fetch(new URL(name, this.base_uri)).then(res=>res.text())};
    }));
    return {main:main_sketch,content:sketch_content,files:this.listed_files};
  }

  /**
   * Load sketch from string.
   * @param sketch Sketch source string
   * @param name Sketch name
   * @param resources Files of the sketch folder the sketch uses (relative to `base_uri`)
   * @returns Sketch data which required to transpile
   */
  loadSketchString(sketch:string,name:string,resources?:string[]):SketchData{
    const sketch_content=[{name:name,content:sketch}];
    return {main:name,content:sketch_content,files:resources??[]};
  }

  /**
   * Transpile sketch.
   * @param sketch_data Loaded sketch data
   * @returns Transpiled sketch.
   */
  transpileSketch(sketch_data:SketchData):CompiledSketch{
    const t0=performance.now();
    const key=this.cache?.key(sketch_data);
    const cached=key!==undefined?this.cache!.getSync(key):undefined;
    if(cached)return {...cached,timings:{compile:performance.now()-t0},listed:sketch_data.files};
    const compiled=this.compile(sketch_data,t0);
    if(key!==undefined)this.cache!.put(key,compiled);
    return compiled;
  }

  /**
   * transpileSketch() that also looks in IndexedDB (settings.cache): a sketch compiled in an earlier
   * visit is not compiled again.
   */
  async transpileSketchCached(sketch_data:SketchData):Promise<CompiledSketch>{
    const t0=performance.now();
    if(this.cache){
      const cached=await this.cache.get(this.cache.key(sketch_data));
      if(cached)return {...cached,timings:{compile:performance.now()-t0},listed:sketch_data.files};
    }
    return this.transpileSketch(sketch_data);
  }

  private compile(sketch_data:SketchData,t0:number):CompiledSketch{
    // The main tab first, as Processing does (it names the sketch class).
    const main=sketch_data.content.filter(f=>f.name===sketch_data.main);
    const tabs=[...main,...sketch_data.content.filter(f=>f.name!==sketch_data.main)].map(f=>({name:f.name,text:f.content}));
    const r=compileSketch(tabs);
    const error=new CompileErrors(r.diagnostics.filter(d=>d.severity==="error").map(d=>formatDiagnostic(r.parse.source,d)));
    if(error.error){
      this.runner.error_listeners.forEach(l=>l(error.getErrorMessage()));
    }
    return {result:r.code??"",error,map:r.map,timings:{compile:performance.now()-t0},usesText:r.usesText,files:r.files,listed:sketch_data.files};
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
    const sketch=this.cache?await this.transpileSketchCached(sketch_data):this.transpileSketch(sketch_data);
    await this.runTranspiledSketch(sketch);
  }
}
