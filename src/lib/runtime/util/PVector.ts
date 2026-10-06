import { floatToIntBits } from "../../../runtime/lang/boxes.ts";
import { floatToString } from "../../../runtime/lang/numbers.ts";

const f=Math.fround;
const TWO_PI=f(Math.PI*2);

/** x*x + y*y + z*z in float arithmetic (the components are floats). */
function sumSq(x:number,y:number,z:number):number{
  return f(f(f(x*x)+f(y*y))+f(z*z));
}

/**
 * Processing's PVector. The components are floats: every result is rounded to float as in Java.
 * Overloads are told apart by the argument types (the compiler passes Java's arguments as they are).
 */
export class PVector{
  public x: number;
  public y: number;
  public z: number;

  constructor(x: number=0, y: number=0, z: number=0) {
    this.x = f(x);
    this.y = f(y);
    this.z = f(z);
  }

  // --- set / copy ---------------------------------------------------------------------------------

  /** set(PVector), set(x, y, z), set(x, y) and set(float[]) of length 2 (both make z 0). */
  set(a:PVector|ArrayLike<number>|number,y?:number,z?:number): PVector {
    if(a instanceof PVector){
      this.x=a.x;this.y=a.y;this.z=a.z;
    }else if(typeof a==="number"){
      this.x=f(a);this.y=f(y!);this.z=f(z??0);
    }else{
      if(a.length>=2){
        this.x=f(a[0]);this.y=f(a[1]);
        this.z=a.length>=3?f(a[2]):0;
      }
    }
    return this;
  }

  copy(): PVector {
    return new PVector(this.x, this.y, this.z);
  }

  get(): PVector {
    return this.copy();
  }

  /** float[] { x, y, z } */
  array(): Float32Array {
    return Float32Array.of(this.x,this.y,this.z);
  }

  // --- arithmetic ---------------------------------------------------------------------------------

  add(a:PVector|number,y?:number,z?:number): PVector {
    if(a instanceof PVector){
      this.x=f(this.x+a.x);this.y=f(this.y+a.y);this.z=f(this.z+a.z);
    }else{
      this.x=f(this.x+a);this.y=f(this.y+y!);
      if(z!==undefined)this.z=f(this.z+z);
    }
    return this;
  }

  sub(a:PVector|number,y?:number,z?:number): PVector {
    if(a instanceof PVector){
      this.x=f(this.x-a.x);this.y=f(this.y-a.y);this.z=f(this.z-a.z);
    }else{
      this.x=f(this.x-a);this.y=f(this.y-y!);
      if(z!==undefined)this.z=f(this.z-z);
    }
    return this;
  }

  mult(n: number): PVector {
    this.x=f(this.x*n);this.y=f(this.y*n);this.z=f(this.z*n);
    return this;
  }

  /** Java float division: dividing by 0 yields Infinity/NaN, no exception. */
  div(n: number): PVector {
    this.x=f(this.x/n);this.y=f(this.y/n);this.z=f(this.z/n);
    return this;
  }

  static add(v1:PVector,v2:PVector,target?:PVector|null): PVector {
    return (target??new PVector()).set(f(v1.x+v2.x),f(v1.y+v2.y),f(v1.z+v2.z));
  }

  static sub(v1:PVector,v2:PVector,target?:PVector|null): PVector {
    return (target??new PVector()).set(f(v1.x-v2.x),f(v1.y-v2.y),f(v1.z-v2.z));
  }

  static mult(v:PVector,n:number,target?:PVector|null): PVector {
    return (target??new PVector()).set(f(v.x*n),f(v.y*n),f(v.z*n));
  }

  static div(v:PVector,n:number,target?:PVector|null): PVector {
    return (target??new PVector()).set(f(v.x/n),f(v.y/n),f(v.z/n));
  }

  // --- magnitude ----------------------------------------------------------------------------------

  mag(): number {
    return f(Math.sqrt(this.magSq()));
  }

  magSq():number{
    return sumSq(this.x,this.y,this.z);
  }

  /** normalize() in place, or normalize(target) into target (a new vector when null). */
  normalize(target?:PVector|null): PVector {
    const m=this.mag();
    if(target===undefined){
      if(m!==0&&m!==1)this.div(m);
      return this;
    }
    const t=target??new PVector();
    return m>0?t.set(f(this.x/m),f(this.y/m),f(this.z/m)):t.set(this.x,this.y,this.z);
  }

  /** setMag(len) in place, or setMag(target, len). */
  setMag(a:PVector|number|null,len?:number): PVector {
    if(len===undefined)return this.normalize().mult(a as number);
    return this.normalize(a as PVector|null).mult(len);
  }

  /** Limit the magnitude to max (in place). */
  limit(max:number):PVector{
    if(this.magSq()>f(max*max))this.normalize().mult(max);
    return this;
  }

  // --- products and distances ---------------------------------------------------------------------

  dot(a:PVector|number,y?:number,z?:number):number{
    if(a instanceof PVector)return PVector.dot(this,a);
    return f(f(f(this.x*a)+f(this.y*y!))+f(this.z*z!));
  }

  static dot(v1:PVector,v2:PVector):number{
    return f(f(f(v1.x*v2.x)+f(v1.y*v2.y))+f(v1.z*v2.z));
  }

  cross(v:PVector,target?:PVector|null):PVector{
    return PVector.cross(this,v,target);
  }

  static cross(v1:PVector,v2:PVector,target?:PVector|null):PVector{
    const x=f(f(v1.y*v2.z)-f(v2.y*v1.z));
    const y=f(f(v1.z*v2.x)-f(v2.z*v1.x));
    const z=f(f(v1.x*v2.y)-f(v2.x*v1.y));
    return (target??new PVector()).set(x,y,z);
  }

  dist(v:PVector):number{
    return PVector.dist(this,v);
  }

  static dist(v1:PVector,v2:PVector):number{
    return f(Math.sqrt(sumSq(f(v1.x-v2.x),f(v1.y-v2.y),f(v1.z-v2.z))));
  }

  /** The angle between two vectors: 0 when either is zero; the cosine is computed in double. */
  static angleBetween(v1:PVector,v2:PVector):number{
    if((v1.x===0&&v1.y===0&&v1.z===0)||(v2.x===0&&v2.y===0&&v2.z===0))return 0;
    const dot=PVector.dot(v1,v2);
    const amt=dot/(Math.sqrt(v1.magSq())*Math.sqrt(v2.magSq()));
    if(amt<=-1)return f(Math.PI);
    if(amt>=1)return 0;
    return f(Math.acos(amt));
  }

  // --- angles -------------------------------------------------------------------------------------

  heading():number{
    return f(Math.atan2(this.y,this.x));
  }

  /** @deprecated Processing 2 name of heading(). */
  heading2D():number{
    return this.heading();
  }

  setHeading(angle:number):PVector{
    const m=this.mag();
    this.x=f(m*f(Math.cos(angle)));
    this.y=f(m*f(Math.sin(angle)));
    return this;
  }

  /** Rotate in the x-y plane (z is unchanged). */
  rotate(theta:number):PVector{
    const c=f(Math.cos(theta)),s=f(Math.sin(theta));
    const x=this.x;
    this.x=f(f(x*c)-f(this.y*s));
    this.y=f(f(x*s)+f(this.y*c));
    return this;
  }

  static fromAngle(angle:number,target?:PVector|null):PVector{
    return (target??new PVector()).set(f(Math.cos(angle)),f(Math.sin(angle)),0);
  }

  /** A random unit vector in the x-y plane. */
  static random2D(target?:PVector|null):PVector{
    return PVector.fromAngle(f(Math.random()*TWO_PI),target);
  }

  /** A random unit vector. */
  static random3D(target?:PVector|null):PVector{
    const angle=f(Math.random()*TWO_PI);
    const vz=f(f(Math.random()*2)-1);
    const r=f(Math.sqrt(f(1-f(vz*vz))));
    return (target??new PVector()).set(f(r*f(Math.cos(angle))),f(r*f(Math.sin(angle))),vz);
  }

  // --- interpolation ------------------------------------------------------------------------------

  /** lerp(v, amt) or lerp(x, y, z, amt), in place. */
  lerp(a:PVector|number,b:number,c?:number,amt?:number):PVector{
    const lerp=(start:number,stop:number,t:number)=>f(start+f(f(stop-start)*t));
    if(a instanceof PVector){
      this.x=lerp(this.x,a.x,b);this.y=lerp(this.y,a.y,b);this.z=lerp(this.z,a.z,b);
    }else{
      this.x=lerp(this.x,a,amt!);this.y=lerp(this.y,b,amt!);this.z=lerp(this.z,c!,amt!);
    }
    return this;
  }

  static lerp(v1:PVector,v2:PVector,amt:number):PVector{
    return v1.copy().lerp(v2,amt);
  }

  // --- Object -------------------------------------------------------------------------------------

  equals(o:unknown):boolean{
    return o instanceof PVector&&o.x===this.x&&o.y===this.y&&o.z===this.z;
  }

  hashCode():number{
    let h=1;
    h=(Math.imul(31,h)+floatToIntBits(this.x))|0;
    h=(Math.imul(31,h)+floatToIntBits(this.y))|0;
    h=(Math.imul(31,h)+floatToIntBits(this.z))|0;
    return h;
  }

  toString():string{
    return `[ ${floatToString(this.x)}, ${floatToString(this.y)}, ${floatToString(this.z)} ]`;
  }
}
