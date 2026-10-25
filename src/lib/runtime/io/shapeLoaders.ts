// loadShape(): SVG documents and Wavefront OBJ models as PShape trees, written from the file formats'
// specifications (SVG 1.1 paths, shapes, styles and transforms; OBJ v/vt/vn/f with MTL materials).
import { PShape } from "../PShape";
import { PMatrix3D } from "../PMatrix3D";
import type { PGraphics } from "../PGraphics";
import type { PImage } from "../PImage";
import { createNativeCanvas, type Native2D } from "../PImage";

const GROUP=0,POLYGON=20,TRIANGLES=9,QUADS=17,NORMAL=1;

// --- SVG -------------------------------------------------------------------------------------------------

type SvgStyle={fill:number|null,stroke:number|null,strokeWeight:number,fillOpacity:number,strokeOpacity:number,opacity:number,cap:number,join:number};

let colorCtx:Native2D|null=null;

/** A CSS/SVG color (names, #rgb, #rrggbb, rgb()) as ARGB, or null for "none". */
function parseColor(s:string):number|null{
  s=s.trim();
  if(s===""||s==="none"||s==="transparent")return null;
  if(s.startsWith("url("))return 0xff000000|0;
  let m=/^#([0-9a-f]{3})$/i.exec(s);
  if(m){
    const h=m[1];
    return (0xff000000|(parseInt(h[0]+h[0],16)<<16)|(parseInt(h[1]+h[1],16)<<8)|parseInt(h[2]+h[2],16))|0;
  }
  m=/^#([0-9a-f]{6})$/i.exec(s);
  if(m)return (0xff000000|parseInt(m[1],16))|0;
  m=/^rgb\(\s*([\d.]+)(%?)\s*,\s*([\d.]+)(%?)\s*,\s*([\d.]+)(%?)\s*\)$/i.exec(s);
  if(m){
    const c=(v:string,p:string)=>Math.max(0,Math.min(255,Math.round(p?Number(v)*2.55:Number(v))));
    return (0xff000000|(c(m[1],m[2])<<16)|(c(m[3],m[4])<<8)|c(m[5],m[6]))|0;
  }
  // named colors through the canvas
  colorCtx??=createNativeCanvas(1,1).getContext("2d") as Native2D;
  colorCtx.fillStyle="#000000";
  colorCtx.fillStyle=s;
  const v=String(colorCtx.fillStyle);
  if(/^#[0-9a-f]{6}$/i.test(v))return (0xff000000|parseInt(v.slice(1),16))|0;
  return 0xff000000|0;
}

/** A length with units (pt, pc, mm, cm, in, px) in pixels, as Processing's SVG reader converts them. */
function unitSize(s:string|null,relativeTo=0):number{
  if(!s)return 0;
  const m=/^\s*([-+]?[\d.]+(?:e[-+]?\d+)?)\s*([a-z%]*)\s*$/i.exec(s);
  if(!m)return 0;
  const v=Number(m[1]);
  switch(m[2].toLowerCase()){
    case "pt":return v*1.25;
    case "pc":return v*15;
    case "mm":return v*3.543307;
    case "cm":return v*35.43307;
    case "in":return v*90;
    case "%":return v*relativeTo/100;
    default:return v;
  }
}

function parseTransform(s:string|null):PMatrix3D|null{
  if(!s)return null;
  const m=new PMatrix3D();
  const re=/(matrix|translate|scale|rotate|skewX|skewY)\s*\(([^)]*)\)/g;
  let found=false;
  for(const t of s.matchAll(re)){
    found=true;
    const a=t[2].trim().split(/[\s,]+/).filter((x)=>x!=="").map(Number);
    switch(t[1]){
      case "matrix":m.apply(a[0],a[2],a[4],a[1],a[3],a[5]);break;
      case "translate":m.translate(a[0],a[1]??0);break;
      case "scale":m.scale(a[0],a[1]??a[0]);break;
      case "rotate":{
        const r=a[0]*Math.PI/180;
        if(a.length>=3){
          m.translate(a[1],a[2]);
          m.rotateZ(r);
          m.translate(-a[1],-a[2]);
        }else m.rotateZ(r);
        break;
      }
      case "skewX":m.apply(1,Math.tan(a[0]*Math.PI/180),0,0,1,0);break;
      case "skewY":m.apply(1,0,0,Math.tan(a[0]*Math.PI/180),1,0);break;
    }
  }
  return found?m:null;
}

function styleOf(el:Element,parent:SvgStyle):SvgStyle{
  const s={...parent};
  const props=new Map<string,string>();
  for(const name of ["fill","stroke","stroke-width","fill-opacity","stroke-opacity","opacity","stroke-linecap","stroke-linejoin"]){
    const v=el.getAttribute(name);
    if(v!==null)props.set(name,v);
  }
  const st=el.getAttribute("style");
  if(st)for(const decl of st.split(";")){
    const i=decl.indexOf(":");
    if(i>0)props.set(decl.slice(0,i).trim(),decl.slice(i+1).trim());
  }
  if(props.has("fill"))s.fill=parseColor(props.get("fill")!);
  if(props.has("stroke"))s.stroke=parseColor(props.get("stroke")!);
  if(props.has("stroke-width"))s.strokeWeight=unitSize(props.get("stroke-width")!);
  if(props.has("fill-opacity"))s.fillOpacity=Number(props.get("fill-opacity"));
  if(props.has("stroke-opacity"))s.strokeOpacity=Number(props.get("stroke-opacity"));
  if(props.has("opacity"))s.opacity=parent.opacity*Number(props.get("opacity"));
  const cap=props.get("stroke-linecap");
  if(cap)s.cap=cap==="round"?2:cap==="square"?4:1;
  const join=props.get("stroke-linejoin");
  if(join)s.join=join==="round"?2:join==="bevel"?32:8;
  return s;
}

function withAlpha(c:number,a:number):number{
  return (((Math.round((c>>>24)*Math.max(0,Math.min(1,a))))<<24)|(c&0xffffff))|0;
}

function applySvgStyle(shape:PShape,s:SvgStyle){
  if(s.fill===null)shape.style.fill=false;
  else{
    shape.style.fill=true;
    shape.style.fillColor=withAlpha(s.fill,s.fillOpacity*s.opacity);
  }
  if(s.stroke===null)shape.style.stroke=false;
  else{
    shape.style.stroke=true;
    shape.style.strokeColor=withAlpha(s.stroke,s.strokeOpacity*s.opacity);
  }
  shape.style.strokeWeight=s.strokeWeight;
  shape.style.strokeCap=s.cap;
  shape.style.strokeJoin=s.join;
}

/** Numbers of an SVG path or points list (with exponents and run-together signs/dots). */
function numbers(s:string):number[]{
  return Array.from(s.matchAll(/[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/g),(m)=>Number(m[0]));
}

/** Arc (endpoint form) to cubic segments: control points and end, for bezierVertex(). */
function arcToCubics(x1:number,y1:number,rx:number,ry:number,phi:number,large:boolean,sweep:boolean,x2:number,y2:number):number[][]{
  if(rx===0||ry===0)return [[x1,y1,x2,y2,x2,y2]];
  rx=Math.abs(rx);ry=Math.abs(ry);
  const cp=Math.cos(phi),sp=Math.sin(phi);
  const dx=(x1-x2)/2,dy=(y1-y2)/2;
  const x1p=cp*dx+sp*dy,y1p=-sp*dx+cp*dy;
  const lam=x1p*x1p/(rx*rx)+y1p*y1p/(ry*ry);
  if(lam>1){rx*=Math.sqrt(lam);ry*=Math.sqrt(lam);}
  const num=rx*rx*ry*ry-rx*rx*y1p*y1p-ry*ry*x1p*x1p;
  const den=rx*rx*y1p*y1p+ry*ry*x1p*x1p;
  let k=Math.sqrt(Math.max(0,num/den));
  if(large===sweep)k=-k;
  const cxp=k*rx*y1p/ry,cyp=-k*ry*x1p/rx;
  const cx=cp*cxp-sp*cyp+(x1+x2)/2,cy=sp*cxp+cp*cyp+(y1+y2)/2;
  const ang=(ux:number,uy:number,vx:number,vy:number)=>{
    const a=Math.atan2(ux*vy-uy*vx,ux*vx+uy*vy);
    return a;
  };
  const t1=ang(1,0,(x1p-cxp)/rx,(y1p-cyp)/ry);
  let dt=ang((x1p-cxp)/rx,(y1p-cyp)/ry,(-x1p-cxp)/rx,(-y1p-cyp)/ry);
  if(!sweep&&dt>0)dt-=Math.PI*2;
  else if(sweep&&dt<0)dt+=Math.PI*2;
  const n=Math.max(1,Math.ceil(Math.abs(dt)/(Math.PI/2)-1e-9));
  const h=dt/n,kk=4/3*Math.tan(h/4);
  const out:number[][]=[];
  const pt=(t:number)=>[cx+rx*Math.cos(t)*cp-ry*Math.sin(t)*sp,cy+rx*Math.cos(t)*sp+ry*Math.sin(t)*cp];
  const der=(t:number)=>[-rx*Math.sin(t)*cp-ry*Math.cos(t)*sp,-rx*Math.sin(t)*sp+ry*Math.cos(t)*cp];
  for(let i=0;i<n;i++){
    const a=t1+h*i,b=a+h;
    const [px,py]=pt(a),[qx,qy]=pt(b),[dax,day]=der(a),[dbx,dby]=der(b);
    out.push([px+kk*dax,py+kk*day,qx-kk*dbx,qy-kk*dby,qx,qy]);
  }
  return out;
}

/** An SVG path's data as vertices of a PATH shape: subpaths after the first become contours. */
function parsePath(shape:PShape,d:string){
  const tokens=Array.from(d.matchAll(/([MmLlHhVvCcSsQqTtAaZz])|([-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?)/g));
  let i=0;
  let cmd="";
  let cx=0,cy=0,sx=0,sy=0;
  let lastC:[number,number]|null=null,lastQ:[number,number]|null=null;
  let started=false;
  const num=()=>Number(tokens[i++][2]);
  const hasNum=()=>i<tokens.length&&tokens[i][2]!==undefined;
  const move=(x:number,y:number)=>{
    if(started)shape.beginContour();
    shape.vertex(x,y);
    started=true;
    cx=sx=x;cy=sy=y;
  };
  while(i<tokens.length){
    if(tokens[i][1]!==undefined)cmd=tokens[i++][1];
    else if(!cmd){i++;continue;}
    const rel=cmd===cmd.toLowerCase();
    const C=cmd.toUpperCase();
    if(C==="Z"){
      // back to the start of the subpath (the outline closes without a vertex of its own)
      cx=sx;cy=sy;
      shape.closed=true;
      lastC=lastQ=null;
      continue;
    }
    if(!hasNum()){i++;continue;}
    switch(C){
      case "M":{
        const x=num()+(rel?cx:0),y=num()+(rel?cy:0);
        move(x,y);
        cmd=rel?"l":"L";
        lastC=lastQ=null;
        break;
      }
      case "L":{
        const x=num()+(rel?cx:0),y=num()+(rel?cy:0);
        shape.vertex(x,y);cx=x;cy=y;lastC=lastQ=null;
        break;
      }
      case "H":{
        const x=num()+(rel?cx:0);
        shape.vertex(x,cy);cx=x;lastC=lastQ=null;
        break;
      }
      case "V":{
        const y=num()+(rel?cy:0);
        shape.vertex(cx,y);cy=y;lastC=lastQ=null;
        break;
      }
      case "C":{
        const ox=rel?cx:0,oy=rel?cy:0;
        const x1=num()+ox,y1=num()+oy,x2=num()+ox,y2=num()+oy,x=num()+ox,y=num()+oy;
        shape.bezierVertex(x1,y1,x2,y2,x,y);
        lastC=[x2,y2];lastQ=null;cx=x;cy=y;
        break;
      }
      case "S":{
        const ox=rel?cx:0,oy=rel?cy:0;
        const x1=lastC?2*cx-lastC[0]:cx,y1=lastC?2*cy-lastC[1]:cy;
        const x2=num()+ox,y2=num()+oy,x=num()+ox,y=num()+oy;
        shape.bezierVertex(x1,y1,x2,y2,x,y);
        lastC=[x2,y2];lastQ=null;cx=x;cy=y;
        break;
      }
      case "Q":{
        const ox=rel?cx:0,oy=rel?cy:0;
        const qx=num()+ox,qy=num()+oy,x=num()+ox,y=num()+oy;
        shape.quadraticVertex(qx,qy,x,y);
        lastQ=[qx,qy];lastC=null;cx=x;cy=y;
        break;
      }
      case "T":{
        const ox=rel?cx:0,oy=rel?cy:0;
        const qx:number=lastQ?2*cx-lastQ[0]:cx,qy:number=lastQ?2*cy-lastQ[1]:cy;
        const x=num()+ox,y=num()+oy;
        shape.quadraticVertex(qx,qy,x,y);
        lastQ=[qx,qy];lastC=null;cx=x;cy=y;
        break;
      }
      case "A":{
        const rx=num(),ry=num(),rot=num(),large=num()!==0,sweep=num()!==0;
        const x=num()+(rel?cx:0),y=num()+(rel?cy:0);
        for(const c of arcToCubics(cx,cy,rx,ry,rot*Math.PI/180,large,sweep,x,y))shape.bezierVertex(c[0],c[1],c[2],c[3],c[4],c[5]);
        cx=x;cy=y;lastC=lastQ=null;
        break;
      }
      default:i++;
    }
  }
}

function svgElement(el:Element,g:PGraphics,parentStyle:SvgStyle):PShape|null{
  const tag=el.localName;
  if(tag==="defs"||tag==="title"||tag==="desc"||tag==="metadata"||tag==="style"||tag==="clipPath"||tag==="mask"||tag==="linearGradient"||tag==="radialGradient"||tag==="symbol"||tag==="pattern")return null;
  if(el.getAttribute("display")==="none")return null;
  const style=styleOf(el,parentStyle);
  let s:PShape|null=null;
  const n=(name:string)=>unitSize(el.getAttribute(name));
  switch(tag){
    case "g":case "svg":case "a":case "switch":{
      s=new PShape(g,GROUP);
      for(const c of Array.from(el.children)){
        const child=svgElement(c,g,style);
        if(child)s.addChild(child);
      }
      break;
    }
    case "path":{
      s=new PShape(g,PShape.PATH);
      s.kind=POLYGON;
      applySvgStyle(s,style);
      parsePath(s,el.getAttribute("d")??"");
      break;
    }
    case "rect":{
      s=new PShape(g,PShape.PATH);
      s.kind=POLYGON;
      applySvgStyle(s,style);
      const x=n("x"),y=n("y"),w=n("width"),h=n("height");
      let rx=el.hasAttribute("rx")?n("rx"):el.hasAttribute("ry")?n("ry"):0;
      let ry=el.hasAttribute("ry")?n("ry"):rx;
      rx=Math.min(rx,w/2);ry=Math.min(ry,h/2);
      if(rx>0&&ry>0){
        parsePath(s,`M${x+rx},${y}H${x+w-rx}A${rx},${ry} 0 0 1 ${x+w},${y+ry}V${y+h-ry}A${rx},${ry} 0 0 1 ${x+w-rx},${y+h}H${x+rx}A${rx},${ry} 0 0 1 ${x},${y+h-ry}V${y+ry}A${rx},${ry} 0 0 1 ${x+rx},${y}Z`);
      }else{
        s.vertex(x,y);s.vertex(x+w,y);s.vertex(x+w,y+h);s.vertex(x,y+h);
        s.closed=true;
      }
      break;
    }
    case "circle":case "ellipse":{
      s=new PShape(g,PShape.PATH);
      s.kind=POLYGON;
      applySvgStyle(s,style);
      const cx=n("cx"),cy=n("cy");
      const rx=tag==="circle"?n("r"):n("rx"),ry=tag==="circle"?n("r"):n("ry");
      parsePath(s,`M${cx+rx},${cy}A${rx},${ry} 0 0 1 ${cx},${cy+ry}A${rx},${ry} 0 0 1 ${cx-rx},${cy}A${rx},${ry} 0 0 1 ${cx},${cy-ry}A${rx},${ry} 0 0 1 ${cx+rx},${cy}Z`);
      break;
    }
    case "line":{
      s=new PShape(g,PShape.PATH);
      s.kind=POLYGON;
      applySvgStyle(s,style);
      s.style.fill=false;
      s.vertex(n("x1"),n("y1"));
      s.vertex(n("x2"),n("y2"));
      break;
    }
    case "polyline":case "polygon":{
      s=new PShape(g,PShape.PATH);
      s.kind=POLYGON;
      applySvgStyle(s,style);
      const p=numbers(el.getAttribute("points")??"");
      for(let k=0;k+1<p.length;k+=2)s.vertex(p[k],p[k+1]);
      s.closed=tag==="polygon";
      break;
    }
    default:
      return null;
  }
  const id=el.getAttribute("id");
  if(id)s.name=id;
  const t=parseTransform(el.getAttribute("transform"));
  if(t)s.matrix=t;
  return s;
}

/** An SVG document as a GROUP shape (its size from width/height, or the viewBox). */
export function loadSVG(text:string,g:PGraphics):PShape|null{
  if(typeof DOMParser==="undefined")return null;
  const doc=new DOMParser().parseFromString(text,"image/svg+xml");
  const root=doc.documentElement;
  if(!root||root.localName!=="svg")return null;
  const base:SvgStyle={fill:0xff000000|0,stroke:null,strokeWeight:1,fillOpacity:1,strokeOpacity:1,opacity:1,cap:2,join:8};
  const shape=svgElement(root,g,base)!;
  const vb=numbers(root.getAttribute("viewBox")??"");
  let w=unitSize(root.getAttribute("width")),h=unitSize(root.getAttribute("height"));
  if((!w||!h)&&vb.length===4){
    w||=vb[2];
    h||=vb[3];
  }
  shape.width=w;
  shape.height=h;
  if(vb.length===4&&vb[2]>0&&vb[3]>0&&(w!==vb[2]||h!==vb[3]||vb[0]!==0||vb[1]!==0)){
    const m=new PMatrix3D();
    m.scale(w/vb[2],h/vb[3]);
    m.translate(-vb[0],-vb[1]);
    shape.matrix=m;
  }
  return shape;
}

// --- OBJ -------------------------------------------------------------------------------------------------

type Material={kd:number,ka:number|null,ks:number|null,ns:number,d:number,map:PImage|null};

function parseMTL(text:string,dir:string,loadImage:(name:string)=>PImage|null):Map<string,Material>{
  const out=new Map<string,Material>();
  let cur:Material|null=null;
  const rgb=(a:string[])=>(0xff000000|(Math.round(Math.min(1,Number(a[0]))*255)<<16)|(Math.round(Math.min(1,Number(a[1]??a[0]))*255)<<8)|Math.round(Math.min(1,Number(a[2]??a[0]))*255))|0;
  for(const raw of text.split(/\r?\n/)){
    const line=raw.trim();
    if(!line||line.startsWith("#"))continue;
    const [k,...a]=line.split(/\s+/);
    if(k==="newmtl"){
      cur={kd:-1,ka:null,ks:null,ns:1,d:1,map:null};
      out.set(a.join(" "),cur);
    }else if(!cur)continue;
    else if(k==="Kd")cur.kd=rgb(a);
    else if(k==="Ka")cur.ka=rgb(a);
    else if(k==="Ks")cur.ks=rgb(a);
    else if(k==="Ns")cur.ns=Number(a[0]);
    else if(k==="d")cur.d=Number(a[0]);
    else if(k==="Tr")cur.d=1-Number(a[0]);
    else if(k==="map_Kd")cur.map=loadImage(dir+a[a.length-1]);
  }
  return out;
}

/**
 * A Wavefront OBJ model as a GROUP of faces (one GEOMETRY child per face, as Processing reads them),
 * colored by their material (Kd, its texture map_Kd; texture v counts from the bottom of the image).
 */
export function loadOBJ(text:string,g:PGraphics,dir:string,loadText:(name:string)=>string|null,loadImage:(name:string)=>PImage|null):PShape{
  const v:number[][]=[],vt:number[][]=[],vn:number[][]=[];
  const materials=new Map<string,Material>();
  let mtl:Material|null=null;
  const root=new PShape(g,GROUP);
  const idx=(s:string,n:number)=>{
    const i=parseInt(s,10);
    return Number.isNaN(i)?-1:i<0?n+i:i-1;
  };
  for(const raw of text.split(/\r?\n/)){
    const line=raw.trim();
    if(!line||line.startsWith("#"))continue;
    const [k,...a]=line.split(/\s+/);
    switch(k){
      case "v":v.push([Number(a[0]),Number(a[1]),Number(a[2])]);break;
      case "vt":vt.push([Number(a[0]),Number(a[1]??0)]);break;
      case "vn":vn.push([Number(a[0]),Number(a[1]),Number(a[2])]);break;
      case "mtllib":{
        const t=loadText(dir+a.join(" "));
        if(t)for(const [name,m] of parseMTL(t,dir,loadImage))materials.set(name,m);
        break;
      }
      case "usemtl":mtl=materials.get(a.join(" "))??null;break;
      case "f":{
        const face=new PShape(g,PShape.GEOMETRY);
        face.set3D(true);
        face.beginShape(a.length===3?TRIANGLES:a.length===4?QUADS:POLYGON);
        const fill=mtl?((Math.round(mtl.d*255)<<24)|(mtl.kd&0xffffff))|0:-1;
        face.style.fill=true;
        face.style.fillColor=fill;
        face.style.stroke=false;
        if(mtl?.ka!=null)face.style.ambient=mtl.ka;
        else face.style.ambient=fill;
        if(mtl?.ks!=null)face.style.specular=mtl.ks;
        if(mtl)face.style.shininess=mtl.ns;
        let textured=false;
        if(mtl?.map){
          face.texture(mtl.map);
          face.textureMode(NORMAL);
          textured=true;
        }
        for(const p of a){
          const [vi,ti,ni]=p.split("/");
          const pos=v[idx(vi,v.length)]??[0,0,0];
          const n=ni!==undefined&&ni!==""?vn[idx(ni,vn.length)]:null;
          if(n)face.normal(n[0],n[1],n[2]);
          const tc=ti!==undefined&&ti!==""?vt[idx(ti,vt.length)]:null;
          if(textured&&tc)face.vertex(pos[0],pos[1],pos[2],tc[0],1-tc[1]);
          else face.vertex(pos[0],pos[1],pos[2]);
        }
        face.endShape(2);
        root.addChild(face);
        break;
      }
    }
  }
  return root;
}
