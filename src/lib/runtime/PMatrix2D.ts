import { println } from "../../runtime/lang/print.ts";
import { nfsFloat } from "../../runtime/lang/misc.ts";
import { d2i } from "../../runtime/lang/numbers.ts";
import { IllegalArgumentException } from "../../runtime/lang/exceptions.ts";
import { PVector } from "./util/PVector";
import type { Matrix2DLike } from "./Matrix2D";

const f=Math.fround;

/**
 * Processing's PMatrix2D as sketches use it: float elements and float arithmetic, x' = m00*x + m01*y +
 * m02, y' = m10*x + m11*y + m12. Checked value for value against Processing 4.5.2 (case matrix_api),
 * including its shearX()/shearY(), which also add m00/m01 to the translation.
 * (The renderer keeps its own double-precision Matrix2D.)
 */
export class PMatrix2D{
  m00=1;m01=0;m02=0;
  m10=0;m11=1;m12=0;

  constructor(m00:number|Matrix2DLike=1,m01=0,m02=0,m10=0,m11=1,m12=0){
    this.set(m00 as number,m01,m02,m10,m11,m12);
  }

  reset(){
    this.set(1,0,0,0,1,0);
  }

  /** get() returns a copy; get(target) fills a float[6] (m00, m01, m02, m10, m11, m12), a new one when null. */
  get(target?:Float32Array|number[]|null):PMatrix2D|Float32Array|number[]{
    if(target===undefined)return new PMatrix2D(this);
    if(target===null||target.length!==6)target=new Float32Array(6);
    target[0]=this.m00;target[1]=this.m01;target[2]=this.m02;
    target[3]=this.m10;target[4]=this.m11;target[5]=this.m12;
    return target;
  }

  /** set(matrix), set(float[6]) or set(m00, m01, m02, m10, m11, m12) */
  set(a:Matrix2DLike|ArrayLike<number>|number,m01?:number,m02?:number,m10?:number,m11?:number,m12?:number){
    if(typeof a==="object"&&"m00" in a){
      this.set(a.m00,a.m01,a.m02,a.m10,a.m11,a.m12);
    }else if(typeof a!=="number"){
      this.set(a[0],a[1],a[2],a[3],a[4],a[5]);
    }else{
      this.m00=f(a);this.m01=f(m01!);this.m02=f(m02!);
      this.m10=f(m10!);this.m11=f(m11!);this.m12=f(m12!);
    }
  }

  translate(tx:number,ty:number,_tz?:number){
    this.m02=f(f(f(tx*this.m00)+f(ty*this.m01))+this.m02);
    this.m12=f(f(f(tx*this.m10)+f(ty*this.m11))+this.m12);
  }

  rotate(angle:number){
    const s=f(Math.sin(angle)),c=f(Math.cos(angle));
    this.apply(c,-s,0,s,c,0);
  }

  rotateZ(angle:number){
    this.rotate(angle);
  }

  rotateX(_angle:number):void{
    throw new IllegalArgumentException("Cannot use rotateX() on a PMatrix2D.");
  }

  rotateY(_angle:number):void{
    throw new IllegalArgumentException("Cannot use rotateY() on a PMatrix2D.");
  }

  scale(sx:number,sy:number=sx,_sz?:number){
    this.m00=f(this.m00*sx);this.m01=f(this.m01*sy);
    this.m10=f(this.m10*sx);this.m11=f(this.m11*sy);
  }

  shearX(angle:number){
    this.apply(1,0,1,f(Math.tan(angle)),0,0);
  }

  shearY(angle:number){
    this.apply(1,0,1,0,f(Math.tan(angle)),0);
  }

  /** Nothing to do for a 2D matrix (as in Processing). */
  transpose(){}

  /** this = this × n */
  apply(n00:number|Matrix2DLike,n01?:number,n02?:number,n10?:number,n11?:number,n12?:number):void{
    if(typeof n00==="object")return this.apply(n00.m00,n00.m01,n00.m02,n00.m10,n00.m11,n00.m12);
    let t0=this.m00,t1=this.m01;
    this.m00=f(f(n00*t0)+f(n10!*t1));
    this.m01=f(f(n01!*t0)+f(n11!*t1));
    this.m02=f(this.m02+f(f(n02!*t0)+f(n12!*t1)));
    t0=this.m10;t1=this.m11;
    this.m10=f(f(n00*t0)+f(n10!*t1));
    this.m11=f(f(n01!*t0)+f(n11!*t1));
    this.m12=f(this.m12+f(f(n02!*t0)+f(n12!*t1)));
  }

  /** this = n × this */
  preApply(n00:number|Matrix2DLike,n01?:number,n02?:number,n10?:number,n11?:number,n12?:number):void{
    if(typeof n00==="object")return this.preApply(n00.m00,n00.m01,n00.m02,n00.m10,n00.m11,n00.m12);
    let t0=this.m02,t1=this.m12;
    const r02=f(n02!+f(f(t0*n00)+f(t1*n01!)));
    const r12=f(n12!+f(f(t0*n10!)+f(t1*n11!)));
    this.m02=r02;this.m12=r12;
    t0=this.m00;t1=this.m10;
    this.m00=f(f(t0*n00)+f(t1*n01!));
    this.m10=f(f(t0*n10!)+f(t1*n11!));
    t0=this.m01;t1=this.m11;
    this.m01=f(f(t0*n00)+f(t1*n01!));
    this.m11=f(f(t0*n10!)+f(t1*n11!));
  }

  /** mult(PVector source, PVector target) or mult(float[2] source, float[2] target); a new target when null. */
  mult(source:PVector|Float32Array|number[],target?:PVector|Float32Array|number[]|null):PVector|Float32Array|number[]{
    if(source instanceof PVector){
      const out=target instanceof PVector?target:new PVector();
      const x=source.x,y=source.y;
      out.x=this.multX(x,y);
      out.y=this.multY(x,y);
      return out;
    }
    const x=source[0],y=source[1];
    const out=target&&!(target instanceof PVector)&&target.length===2?target:new Float32Array(2);
    out[0]=this.multX(x,y);
    out[1]=this.multY(x,y);
    return out;
  }

  multX(x:number,y:number){
    return f(f(f(this.m00*x)+f(this.m01*y))+this.m02);
  }

  multY(x:number,y:number){
    return f(f(f(this.m10*x)+f(this.m11*y))+this.m12);
  }

  determinant(){
    return f(f(this.m00*this.m11)-f(this.m01*this.m10));
  }

  /** Invert in place; false when the matrix is singular. */
  invert(){
    const d=this.determinant();
    if(Math.abs(d)<=1.4e-45)return false;
    const t00=this.m00,t01=this.m01,t02=this.m02,t10=this.m10,t11=this.m11,t12=this.m12;
    this.m00=f(t11/d);
    this.m10=f(-t10/d);
    this.m01=f(-t01/d);
    this.m11=f(t00/d);
    this.m02=f(f(f(t01*t12)-f(t11*t02))/d);
    this.m12=f(f(f(t10*t02)-f(t00*t12))/d);
    return true;
  }

  /**
   * Print the two rows to the console as Processing does: each element as nfs(value, digits, 4), where
   * digits is the number of integer digits of the largest magnitude, separated by a space.
   */
  print(){
    const els=[this.m00,this.m01,this.m02,this.m10,this.m11,this.m12];
    const digits=String(d2i(Math.max(...els.map(Math.abs)))).length;
    const row=(a:number[])=>a.map((v)=>nfsFloat(f(v),digits,4)).join(" ");
    println(row(els.slice(0,3)));
    println(row(els.slice(3)));
  }

  isIdentity(){
    return this.m00===1&&this.m01===0&&this.m02===0&&this.m10===0&&this.m11===1&&this.m12===0;
  }
}
