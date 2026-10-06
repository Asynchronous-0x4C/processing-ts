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

/** Processing's PFont: a font family and the size it was created at. */
export class PFont{
  name:string;
  size:number;
  smooth:boolean;
  /** ascent()/descent() per unit of text size, measured once by the renderer (see PGraphicsJava2D.fontMetrics). */
  __metrics__:{ascent:number;descent:number}|null=null;

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

  /** The CSS font-family list for this font. */
  cssFamily():string{
    const name=this.name.replace(/\.(ttf|otf|vlw)$/i,"");
    const family=LOGICAL[name]??`"${name.replace(/"/g,"")}"`;
    return family===`"${DEFAULT_FONT_FAMILY}"`?`"${DEFAULT_FONT_FAMILY}", sans-serif`:`${family}, sans-serif`;
  }

  /** PFont.list(): the font names a sketch can rely on in a browser. */
  static list():string[]{
    return [DEFAULT_FONT_FAMILY,"SansSerif","Serif","Monospaced","Arial","Courier New","Georgia","Times New Roman","Verdana"];
  }
}
