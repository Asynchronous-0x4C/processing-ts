/** Family of Processing's default font (bundled: fonts/ProcessingSansPro-Regular.ttf, SIL OFL 1.1). */
export const DEFAULT_FONT_FAMILY="Processing Sans Pro";

/** Next to this module in the source tree and in dist/ (the library build copies fonts/ there). */
const DEFAULT_FONT_FILE="fonts/ProcessingSansPro-Regular.ttf";

let defaultFontState:"idle"|"loading"|"ready"|"failed"="idle";
let defaultFontPromise:Promise<void>=Promise.resolve();

/**
 * Load the bundled default font (once). The runner awaits this before setup() when the sketch uses text
 * (CompileResult.usesText); otherwise it starts on the first text() and earlier text falls back to sans-serif.
 * Never rejects: a font that fails to load leaves the sans-serif fallback.
 */
export function loadDefaultFont():Promise<void>{
  ensureDefaultFont();
  return defaultFontPromise;
}

/** The bundled default font has finished loading (metrics measured before that are of the fallback). */
export function defaultFontReady(){
  return defaultFontState==="ready";
}

/** Start loading the bundled default font (once); text drawn before it is ready uses sans-serif. */
export function ensureDefaultFont(){
  if(defaultFontState!=="idle"||typeof FontFace==="undefined")return;
  defaultFontState="loading";
  try{
    // Not a string literal on purpose: Vite's library build would inline a literal `new URL(…, import.meta.url)` as base64 (+288 KB).
    const url=new URL("./"+DEFAULT_FONT_FILE,import.meta.url);
    const face=new FontFace(DEFAULT_FONT_FAMILY,`url(${url.href})`);
    const fonts=(globalThis as unknown as {document?:{fonts:FontFaceSet}}).document?.fonts??(globalThis as unknown as {fonts?:FontFaceSet}).fonts;
    defaultFontPromise=face.load().then((f)=>{
      fonts?.add(f);
      defaultFontState="ready";
    },()=>{
      defaultFontState="failed";
    });
  }catch{
    defaultFontState="failed";
  }
}

/** Java logical font names → CSS generic families. */
const LOGICAL:Record<string,string>={
  SansSerif:"sans-serif",
  Serif:"serif",
  Monospaced:"monospace",
  Dialog:"sans-serif",
  DialogInput:"monospace",
};

/** A glyph of a .vlw font: its bitmap (alpha, width × height) and placement, in pixels at the font's size. */
export type VlwGlyph={value:number;width:number;height:number;setWidth:number;topExtent:number;leftExtent:number;alpha:Uint8Array;
  /** The bitmap in the last fill color it was drawn with. */
  tinted?:{color:number;canvas:HTMLCanvasElement|OffscreenCanvas}};

const f=Math.fround;

/**
 * Processing's PFont: a font family and the size it was created at, or (loadFont() of a .vlw file) the
 * glyph bitmaps Processing's "Create Font" stored, which text() then draws as images, as Processing
 * does when the font is not installed.
 */
export class PFont{
  name:string;
  size:number;
  smooth:boolean;
  /** ascent()/descent() per unit of text size, measured once by the renderer (see PGraphicsJava2D.fontMetrics). */
  __metrics__:{ascent:number;descent:number}|null=null;
  /** The glyphs of a .vlw font by character code, and its ascent/descent in pixels at its size. */
  __vlw__:{glyphs:Map<number,VlwGlyph>;ascent:number;descent:number}|null=null;

  /**
   * A .vlw file: six ints (glyph count, version, size, unused, ascent, descent), seven ints per glyph
   * (code, height, width, advance, top extent, left extent, unused), the glyphs' alpha bitmaps row by
   * row, then (version 10+) the name and PostScript name and (11+) whether the font is smooth.
   */
  static fromVLW(bytes:Uint8Array):PFont{
    const dv=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
    const count=dv.getInt32(0),version=dv.getInt32(4),size=dv.getInt32(8),ascent=dv.getInt32(16),descent=dv.getInt32(20);
    let at=24;
    const glyphs=new Map<number,VlwGlyph>();
    const list:VlwGlyph[]=[];
    for(let i=0;i<count;i++,at+=28){
      const g:VlwGlyph={value:dv.getInt32(at),height:dv.getInt32(at+4),width:dv.getInt32(at+8),setWidth:dv.getInt32(at+12),
        topExtent:dv.getInt32(at+16),leftExtent:dv.getInt32(at+20),alpha:new Uint8Array(0)};
      list.push(g);
      glyphs.set(g.value,g);
    }
    for(const g of list){
      g.alpha=bytes.slice(at,at+g.width*g.height);
      at+=g.width*g.height;
    }
    let name="";
    let smooth=true;
    const utf=()=>{
      const n=dv.getUint16(at);
      const t=new TextDecoder().decode(bytes.subarray(at+2,at+2+n));
      at+=2+n;
      return t;
    };
    if(version>=10&&at+2<=bytes.length){
      name=utf();
      if(at+2<=bytes.length)utf();
      if(version>=11&&at<bytes.length)smooth=bytes[at]!==0;
    }
    const font=new PFont(name,size,smooth);
    font.__vlw__={glyphs,ascent,descent};
    font.__metrics__={ascent:f(ascent/size),descent:f(descent/size)};
    return font;
  }

  /** ascent() / descent(): per unit of text size. */
  ascent():number{
    return this.__metrics__?.ascent??0.75;
  }

  descent():number{
    return this.__metrics__?.descent??f(1/6);
  }

  /** The advance of a character per unit of text size (.vlw fonts: a space is as wide as "i", missing glyphs 0). */
  __vlw_width__(c:number):number{
    const v=this.__vlw__!;
    if(c===32)return this.__vlw_width__(105);
    const g=v.glyphs.get(c);
    return g?f(g.setWidth/this.size):0;
  }

  constructor(name:string=DEFAULT_FONT_FAMILY,size:number=12,smooth:boolean=true){
    this.name=name;
    this.size=size;
    this.smooth=smooth;
  }

  getName(){
    return this.name;
  }

  getPostScriptName(){
    return this.name;
  }

  getSize(){
    return this.size;
  }

  getDefaultSize(){
    return this.size;
  }

  /** Whether the font is the bundled default (its metrics change once the FontFace has loaded). */
  isDefaultFamily(){
    return this.name.replace(/\.(ttf|otf|vlw)$/i,"")===DEFAULT_FONT_FAMILY;
  }

  /** The CSS family of a font file of the sketch (createFont("a.ttf", size)), registered by SketchFiles. */
  __css__:string|null=null;

  /** The CSS font-family list for this font. */
  cssFamily():string{
    if(this.__css__)return `"${this.__css__}", sans-serif`;
    const name=this.name.replace(/\.(ttf|otf|vlw)$/i,"");
    const family=LOGICAL[name]??`"${name.replace(/"/g,"")}"`;
    return family===`"${DEFAULT_FONT_FAMILY}"`?`"${DEFAULT_FONT_FAMILY}", sans-serif`:`${family}, sans-serif`;
  }

  /** PFont.list(): the font names a sketch can rely on in a browser. */
  static list():string[]{
    return [DEFAULT_FONT_FAMILY,"SansSerif","Serif","Monospaced","Arial","Courier New","Georgia","Times New Roman","Verdana"];
  }
}
