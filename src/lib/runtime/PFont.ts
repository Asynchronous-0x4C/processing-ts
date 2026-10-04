/** Family of Processing's default font (bundled: fonts/ProcessingSansPro-Regular.ttf, SIL OFL 1.1). */
export const DEFAULT_FONT_FAMILY="Processing Sans Pro";

let defaultFontState:"idle"|"loading"|"ready"|"failed"="idle";

/** Start loading the bundled default font (once); text drawn before it is ready uses sans-serif. */
export function ensureDefaultFont(){
  if(defaultFontState!=="idle"||typeof FontFace==="undefined")return;
  defaultFontState="loading";
  try{
    const url=new URL("./fonts/ProcessingSansPro-Regular.ttf",import.meta.url);
    const face=new FontFace(DEFAULT_FONT_FAMILY,`url(${url.href})`);
    const fonts=(globalThis as unknown as {document?:{fonts:FontFaceSet}}).document?.fonts??(globalThis as unknown as {fonts?:FontFaceSet}).fonts;
    face.load().then((f)=>{
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
