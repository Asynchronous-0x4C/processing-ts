import libtess from "libtess";

const f=Math.fround;

/**
 * Processing's sine/cosine tables for the OpenGL renderer's curves: 720 entries, one per half degree, in
 * float. Ellipses and points take their outline from these (measured: a 40-pixel circle has 35 segments
 * at table indices 0, 20, 41, 61, 82…).
 */
export const SINCOS_LENGTH=720;
export const sinLUT=new Float32Array(SINCOS_LENGTH);
export const cosLUT=new Float32Array(SINCOS_LENGTH);
for(let i=0;i<SINCOS_LENGTH;i++){
  sinLUT[i]=Math.sin(i*Math.PI/180*0.5);
  cosLUT[i]=Math.cos(i*Math.PI/180*0.5);
}

/**
 * Number of segments of an ellipse whose bounding box has the given diagonal in screen pixels
 * (measured against Processing 4.5.2: 2π·diagonal/10, at least 20 and at most 200).
 */
export function ellipseSegments(diagonal:number):number{
  return Math.min(200,Math.max(20,Math.trunc(f(f(Math.PI*2)*f(diagonal))/10)));
}

/** The outline of an ellipse as table points: x, y pairs, starting at angle 0 and going clockwise on screen. */
export function ellipsePoints(cx:number,cy:number,rx:number,ry:number,segments:number):number[]{
  const out:number[]=[];
  const inc=f(SINCOS_LENGTH/segments);
  let val=0;
  for(let i=0;i<segments;i++){
    const idx=Math.trunc(val)%SINCOS_LENGTH;
    out.push(f(cx+f(cosLUT[idx]*rx)),f(cy+f(sinLUT[idx]*ry)));
    val=f(val+inc);
  }
  return out;
}

const tessellator=new libtess.GluTesselator();
const E=libtess.gluEnum;
let tessOut:number[]=[];
let tessCombine:((coords:number[],data:number[],weights:number[])=>number)|null=null;
tessellator.gluTessCallback(E.GLU_TESS_VERTEX_DATA,(data:number)=>{tessOut.push(data);});
// An edge flag callback makes libtess emit separate triangles only (no fans or strips).
tessellator.gluTessCallback(E.GLU_TESS_EDGE_FLAG,()=>{});
tessellator.gluTessCallback(E.GLU_TESS_COMBINE,(coords:number[],data:number[],weights:number[])=>tessCombine?tessCombine(coords,data,weights):data[0]);
tessellator.gluTessCallback(E.GLU_TESS_ERROR,()=>{});

/**
 * Triangulate polygons (the GLU tessellator, as Processing uses): contours of vertex indices whose
 * coordinates `xyz` gives; intersections create vertices through `combine` (which returns the new
 * index). Returns the triangles as index triples.
 */
export function tessellate(
  xyz:(i:number)=>[number,number,number],
  contours:number[][],
  nonzero:boolean,
  combine:(coords:number[],data:number[],weights:number[])=>number,
  normal:[number,number,number]=[0,0,0],
):number[]{
  tessOut=[];
  tessCombine=combine;
  tessellator.gluTessProperty(E.GLU_TESS_WINDING_RULE,nonzero?libtess.windingRule.GLU_TESS_WINDING_NONZERO:libtess.windingRule.GLU_TESS_WINDING_ODD);
  tessellator.gluTessNormal(normal[0],normal[1],normal[2]);
  tessellator.gluTessBeginPolygon();
  for(const c of contours){
    if(c.length<3)continue;
    tessellator.gluTessBeginContour();
    for(const i of c)tessellator.gluTessVertex(xyz(i),i);
    tessellator.gluTessEndContour();
  }
  tessellator.gluTessEndPolygon();
  tessCombine=null;
  const out=tessOut;
  tessOut=[];
  return out.length%3===0?out:out.slice(0,out.length-out.length%3);
}

/**
 * Triangles (flat x, y lists) of 2D polygons merged into one area (nonzero rule), so overlapping parts
 * of a stroke are not drawn twice.
 */
export function unionPolygons(polys:number[][]):number[]{
  const pts:number[]=[];
  const contours:number[][]=[];
  for(const p of polys){
    // nonzero union needs one orientation for all pieces
    let area=0;
    for(let i=0;i<p.length;i+=2){
      const j=(i+2)%p.length;
      area+=p[i]*p[j+1]-p[j]*p[i+1];
    }
    const c:number[]=[];
    const n=p.length/2;
    for(let k=0;k<n;k++){
      const i=area<0?n-1-k:k;
      c.push(pts.length/2);
      pts.push(p[i*2],p[i*2+1]);
    }
    contours.push(c);
  }
  const tris=tessellate((i)=>[pts[i*2],pts[i*2+1],0],contours,true,(coords)=>{
    pts.push(coords[0],coords[1]);
    return pts.length/2-1;
  },[0,0,1]);
  const out:number[]=[];
  for(const i of tris)out.push(pts[i*2],pts[i*2+1]);
  return out;
}

const ROUND=2,SQUARE=1,PROJECT=4,MITER=8,BEVEL=32;

/** Number of segments of a round join, cap or point of the given radius (pixels). */
export function roundSegments(radius:number):number{
  return Math.min(200,Math.max(8,Math.trunc(Math.PI*2*radius/4)));
}

/** A circle polygon (flat x, y). */
export function circlePolygon(cx:number,cy:number,r:number,n=roundSegments(r)):number[]{
  const out:number[]=[];
  for(let i=0;i<n;i++){
    const a=i*Math.PI*2/n;
    out.push(cx+Math.cos(a)*r,cy+Math.sin(a)*r);
  }
  return out;
}

/**
 * The polygons covering a 2D stroke: one quad per segment, the joins (miter, bevel or round) and, for an
 * open polyline, the caps (round, square = butt, project). Points are x, y pairs in pixels.
 */
export function strokePolygons(pts:number[],closed:boolean,weight:number,cap:number,join:number,out:number[][]=[]):number[][]{
  const h=weight/2;
  // drop repeated points
  const p:number[]=[];
  for(let i=0;i<pts.length;i+=2){
    const n=p.length;
    if(n&&Math.abs(p[n-2]-pts[i])<1e-6&&Math.abs(p[n-1]-pts[i+1])<1e-6)continue;
    p.push(pts[i],pts[i+1]);
  }
  if(closed&&p.length>=4&&Math.abs(p[0]-p[p.length-2])<1e-6&&Math.abs(p[1]-p[p.length-1])<1e-6)p.length-=2;
  const n=p.length/2;
  if(n===0)return out;
  if(n===1){
    // a zero-length line: a round cap draws a dot, a project cap a square
    if(cap===ROUND)out.push(circlePolygon(p[0],p[1],h));
    else if(cap===PROJECT)out.push([p[0]-h,p[1]-h,p[0]+h,p[1]-h,p[0]+h,p[1]+h,p[0]-h,p[1]+h]);
    return out;
  }
  const segs=closed?n:n-1;
  const dir=(i:number)=>{
    const a=i%n,b=(i+1)%n;
    const dx=p[b*2]-p[a*2],dy=p[b*2+1]-p[a*2+1];
    const len=Math.hypot(dx,dy);
    return [dx/len,dy/len];
  };
  for(let s=0;s<segs;s++){
    const a=s%n,b=(s+1)%n;
    let ax=p[a*2],ay=p[a*2+1],bx=p[b*2],by=p[b*2+1];
    const [dx,dy]=dir(s);
    if(!closed&&cap===PROJECT){
      if(s===0){ax-=dx*h;ay-=dy*h;}
      if(s===segs-1){bx+=dx*h;by+=dy*h;}
    }
    const nx=-dy*h,ny=dx*h;
    out.push([ax+nx,ay+ny,bx+nx,by+ny,bx-nx,by-ny,ax-nx,ay-ny]);
  }
  // joins
  const first=closed?0:1,last=closed?n:n-1;
  for(let v=first;v<last;v++){
    const [d0x,d0y]=dir((v-1+n)%n),[d1x,d1y]=dir(v);
    const cx=p[v*2],cy=p[v*2+1];
    const cross=d0x*d1y-d0y*d1x;
    if(Math.abs(cross)<1e-9&&d0x*d1x+d0y*d1y>0)continue;
    // the outer side is where the segments' offset edges open up
    const side=cross>0?-1:1;
    const ax=cx-d0y*h*side,ay=cy+d0x*h*side;
    const bx=cx-d1y*h*side,by=cy+d1x*h*side;
    if(join===ROUND){
      out.push(circlePolygon(cx,cy,h));
    }else if(join===MITER){
      const cosT=d0x*d1x+d0y*d1y;
      const miterLen=h/Math.sqrt(Math.max(1e-12,(1+cosT)/2));
      if(miterLen<=h*10&&Math.abs(cross)>1e-9){
        // intersection of the two outer edges
        const mx=-d0y*side+(-d1y*side),my=d0x*side+d1x*side;
        const ml=Math.hypot(mx,my);
        const k=miterLen/ml;
        out.push([cx,cy,ax,ay,cx+mx*k,cy+my*k,bx,by]);
      }else{
        out.push([cx,cy,ax,ay,bx,by]);
      }
    }else{
      out.push([cx,cy,ax,ay,bx,by]);
    }
  }
  if(!closed&&cap===ROUND){
    out.push(circlePolygon(p[0],p[1],h));
    out.push(circlePolygon(p[(n-1)*2],p[(n-1)*2+1],h));
  }
  return out;
}

export const CAPS={ROUND,SQUARE,PROJECT,MITER,BEVEL};
