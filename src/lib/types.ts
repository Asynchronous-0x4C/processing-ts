// Types shared by the runtime-only player (SketchPlayer, processing-ts/runtime) and the compiler front
// (SketchManager). Nothing here imports the compiler.
import type { SourceMapV3 } from "../compiler/sourcemap.ts";
import type { PApplet } from "./runtime/PApplet";

/**
 * @property thread "main" (default) runs the sketch on the page's thread; "worker" runs it in a Web
 *   Worker drawing to an OffscreenCanvas (the page stays responsive and stopSketch() can end an endless loop).
 * @property manual_step When true, the frame loop is not started automatically; advance frames with `step()`.
 * @property cache Keep compiled sketches (by a hash of the source) in memory and IndexedDB: true, or a
 *   CompileCache of your own (SketchManager only).
 */
export type SketchSettings={frameRate?:number,thread?:"main"|"worker",keep_aspect_ratio?:boolean,manual_step?:boolean,cache?:boolean|import("./CompileCache").CompileCache};
/**
 * @property files Other files of the sketch folder, relative to it ("data/a.png"): fetched before setup()
 *   so that names built at run time (loadImage("frame" + i + ".png")) are found too.
 */
export type SketchData={main:string,content:{name:string,content:string}[],files?:string[]};
export type SketchFile={base_uri:string,main_sketch:string,sketches:string[],resources?:string[]}

/** Compile errors of a sketch, formatted like "Tab.pde:3:10: error: Missing ';'". */
export class CompileErrors{
  readonly messages:string[];
  constructor(messages:string[]){
    this.messages=messages;
  }
  get error():boolean{
    return this.messages.length>0;
  }
  getErrorMessage():string{
    return this.messages.join("\n");
  }
}

/** A compiled sketch: `result` is the JavaScript run by the runner (see src/compiler/codegen.ts). */
/**
 * @property files File names the sketch reads (constant strings found by the compiler).
 * @property listed SketchData.files.
 */
export type CompiledSketch={result:string;error:CompileErrors|null;map?:SourceMapV3|null;timings?:{compile:number};usesText?:boolean;files?:string[];listed?:string[]};

/** The compiled sketch as a function: `$rt` is the runtime, `__renderer__` the PApplet's settings (codegen.ts). */
export type SketchFunction=($rt:unknown,__renderer__:unknown)=>PApplet;

/**
 * A sketch compiled ahead of time (processing-ts build, the Vite plugin's `?pde` modules): the code as a
 * function, so the page needs neither the compiler nor `new Function` (strict CSP).
 * @property name The main tab without ".pde".
 * @property files File names the sketch reads (constant strings found by the compiler).
 * @property listed The files of the sketch folder (data/...), fetched before setup().
 * @property urls Where a file of the sketch folder is served, when not at `base` + path (bundlers rename assets).
 * @property base URL of the sketch folder (relative names are resolved against the page). Overridden by SketchPlayer.base_uri when that is set.
 * @property opengl Whether the sketch uses P2D/P3D or shaders (the OpenGL module is loaded first).
 * @property shapes Whether the sketch uses PShape or PMatrix3D.
 * @property font URL of the default font (ProcessingSansPro-Regular.ttf) when the bundler moved it.
 */
export type PrecompiledSketch={
  name:string;
  sketch:SketchFunction;
  usesText:boolean;
  files:string[];
  listed:string[];
  urls?:Record<string,string>;
  base?:string;
  opengl:boolean;
  shapes:boolean;
  font?:string;
  map?:SourceMapV3|null;
};
