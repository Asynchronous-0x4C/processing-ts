import { createNativeCanvas, type Native2D, type NativeCanvas } from "./PImage";
import { DEFAULT_FONT_FAMILY, PFont, defaultFontReady, ensureDefaultFont, type VlwGlyph } from "./PFont";
import type { PStyle } from "./PGraphics";

/** The font text uses before textFont(): Processing creates the default font at size 12. */
export const DEFAULT_PFONT=new PFont(DEFAULT_FONT_FAMILY,12);

let scratch:Native2D|null=null;

/** A 2D context for measuring text (any renderer). */
export function measureContext():Native2D{
  if(!scratch)scratch=createNativeCanvas(1,1).getContext("2d") as Native2D;
  return scratch;
}

/** The CSS font of the style's text font and size. */
export function cssFont(style:PStyle):string{
  ensureDefaultFont();
  const f=style.textFont;
  const family=f?f.cssFamily():`"${DEFAULT_FONT_FAMILY}", sans-serif`;
  return `${style.textSize}px ${family}`;
}

/** Width of a line of text in the style's font: the canvas's measurement, or the .vlw advances (float sum). */
export function textLineWidth(style:PStyle,line:string,ctx:Native2D=measureContext()):number{
  const vf=style.textFont;
  if(vf?.__vlw__){
    let w=0;
    for(let i=0;i<line.length;i++)w=Math.fround(w+Math.fround(vf.__vlw_width__(line.charCodeAt(i))*style.textSize));
    return w;
  }
  ctx.font=cssFont(style);
  return ctx.measureText(line).width;
}

/**
 * Ascent and descent per unit of text size, as Processing's PFont has them: the height of "d" above and
 * the depth of "p" below the baseline in whole pixels at the size the font was created at (12 for the
 * default font), divided by that size. textAscent() is this times the current text size (in float).
 * Matches Processing for the bundled default font; Java2D hints other fonts, which can differ by a pixel.
 */
export function fontMetrics(style:PStyle,ctx:Native2D=measureContext()):{ascent:number;descent:number}{
  const f=style.textFont??DEFAULT_PFONT;
  if(f.__metrics__)return f.__metrics__;
  ensureDefaultFont();
  ctx.font=`${f.size}px ${f.cssFamily()}`;
  const ascent=Math.round(ctx.measureText("d").actualBoundingBoxAscent);
  const descent=Math.round(ctx.measureText("p").actualBoundingBoxDescent);
  const m={ascent:Math.fround(ascent/f.size),descent:Math.fround(descent/f.size)};
  // Until the default font has loaded, the measurement is of the fallback: do not keep it.
  if(!f.isDefaultFamily()||defaultFontReady())f.__metrics__=m;
  return m;
}

/** A .vlw glyph's alpha bitmap colored with `color` (ARGB), cached for the last color. */
export function tintedGlyph(g:VlwGlyph,color:number):NativeCanvas{
  if(g.tinted&&g.tinted.color===color)return g.tinted.canvas;
  const canvas=g.tinted?.canvas??createNativeCanvas(g.width,g.height);
  const ctx=canvas.getContext("2d") as Native2D;
  const img=ctx.createImageData(g.width,g.height);
  const r=(color>>16)&0xff,gr=(color>>8)&0xff,b=color&0xff,a=color>>>24;
  for(let i=0;i<g.alpha.length;i++){
    img.data[i*4]=r;img.data[i*4+1]=gr;img.data[i*4+2]=b;img.data[i*4+3]=Math.round(g.alpha[i]*a/255);
  }
  ctx.putImageData(img,0,0);
  g.tinted={color,canvas};
  return canvas;
}

/**
 * Draw a line of text in a .vlw font: each glyph's bitmap in `color`, scaled from the font's size to the
 * text size, its corners truncated to ints as images are (x, y is the baseline start).
 */
export function drawVlwLine(ctx:Native2D,font:PFont,size:number,color:number,line:string,x:number,y:number){
  const fs=font.size;
  const f=Math.fround;
  for(let i=0;i<line.length;i++){
    const c=line.charCodeAt(i);
    const g=font.__vlw__!.glyphs.get(c);
    if(g&&c!==32&&g.width>0&&g.height>0){
      const x1=f(x+f(f(g.leftExtent/fs)*size)),y1=f(y-f(f(g.topExtent/fs)*size));
      const x2=f(x1+f(f(g.width/fs)*size)),y2=f(y1+f(f(g.height/fs)*size));
      const ix=Math.trunc(x1),iy=Math.trunc(y1);
      ctx.drawImage(tintedGlyph(g,color) as CanvasImageSource,ix,iy,Math.trunc(x2)-ix,Math.trunc(y2)-iy);
    }
    x=f(x+f(font.__vlw_width__(c)*size));
  }
}
