import { println } from "../../runtime/lang/print.ts";
import { nfsFloat } from "../../runtime/lang/misc.ts";
import { d2i } from "../../runtime/lang/numbers.ts";
import { PVector } from "./util/PVector";
import type { Matrix2DLike } from "./Matrix2D";

const f=Math.fround;

/** The sixteen elements of a 4×4 matrix (PMatrix3D). */
export type Matrix3DLike={
  m00:number,m01:number,m02:number,m03:number,
  m10:number,m11:number,m12:number,m13:number,
  m20:number,m21:number,m22:number,m23:number,
  m30:number,m31:number,m32:number,m33:number,
};

function is3D(m:object):m is Matrix3DLike{
  return "m33" in m;
}

/**
 * Processing's PMatrix3D: a 4×4 matrix of floats with float arithmetic (each product and sum rounded,
 * summed left to right). Operations multiply on the right, as PMatrix2D. Checked value for value against
 * Processing 4.5.2 (case matrix3d_api). The OpenGL renderer keeps its modelview, camera and projection
 * in these, as Processing does, so screenX() and printMatrix() round the same way.
 */
export class PMatrix3D{
  m00=1;m01=0;m02=0;m03=0;
  m10=0;m11=1;m12=0;m13=0;
  m20=0;m21=0;m22=1;m23=0;
  m30=0;m31=0;m32=0;m33=1;

  /** new PMatrix3D(), (PMatrix), 6 floats (a 2D matrix) or 16 floats */
  constructor(...a:(number|Matrix3DLike|Matrix2DLike)[]){
    if(a.length)this.set(...(a as [number]));
  }

  reset(){
    this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);
  }

  /** get() returns a copy; get(target) fills a float[16] (row by row), a new one when null. */
  get(target?:Float32Array|number[]|null):PMatrix3D|Float32Array|number[]{
    if(target===undefined)return new PMatrix3D(this);
    if(target===null||target.length!==16)target=new Float32Array(16);
    target[0]=this.m00;target[1]=this.m01;target[2]=this.m02;target[3]=this.m03;
    target[4]=this.m10;target[5]=this.m11;target[6]=this.m12;target[7]=this.m13;
    target[8]=this.m20;target[9]=this.m21;target[10]=this.m22;target[11]=this.m23;
    target[12]=this.m30;target[13]=this.m31;target[14]=this.m32;target[15]=this.m33;
    return target;
  }

  /** set(matrix), set(float[16] or float[6]), set(6 floats) (a 2D matrix) or set(16 floats) */
  set(...a:(number|Matrix3DLike|Matrix2DLike|ArrayLike<number>)[]):void{
    const x=a[0];
    if(typeof x==="object"&&x!==null&&"m00" in x){
      if(is3D(x))return this.set(x.m00,x.m01,x.m02,x.m03,x.m10,x.m11,x.m12,x.m13,x.m20,x.m21,x.m22,x.m23,x.m30,x.m31,x.m32,x.m33);
      return this.set(x.m00,x.m01,x.m02,x.m10,x.m11,x.m12);
    }
    if(typeof x==="object"&&x!==null){
      const v=x as ArrayLike<number>;
      if(v.length===6)return this.set(v[0],v[1],v[2],v[3],v[4],v[5]);
      if(v.length===16)return this.set(...Array.from(v));
      return;
    }
    const n=a as number[];
    if(n.length===6){
      this.set(n[0],n[1],0,n[2],n[3],n[4],0,n[5],0,0,1,0,0,0,0,1);
      return;
    }
    this.m00=f(n[0]);this.m01=f(n[1]);this.m02=f(n[2]);this.m03=f(n[3]);
    this.m10=f(n[4]);this.m11=f(n[5]);this.m12=f(n[6]);this.m13=f(n[7]);
    this.m20=f(n[8]);this.m21=f(n[9]);this.m22=f(n[10]);this.m23=f(n[11]);
    this.m30=f(n[12]);this.m31=f(n[13]);this.m32=f(n[14]);this.m33=f(n[15]);
  }

  translate(tx:number,ty:number,tz=0){
    this.m03=f(this.m03+f(f(f(tx*this.m00)+f(ty*this.m01))+f(tz*this.m02)));
    this.m13=f(this.m13+f(f(f(tx*this.m10)+f(ty*this.m11))+f(tz*this.m12)));
    this.m23=f(this.m23+f(f(f(tx*this.m20)+f(ty*this.m21))+f(tz*this.m22)));
    this.m33=f(this.m33+f(f(f(tx*this.m30)+f(ty*this.m31))+f(tz*this.m32)));
  }

  rotateX(angle:number){
    const c=f(Math.cos(angle)),s=f(Math.sin(angle));
    this.apply(1,0,0,0,0,c,-s,0,0,s,c,0,0,0,0,1);
  }

  rotateY(angle:number){
    const c=f(Math.cos(angle)),s=f(Math.sin(angle));
    this.apply(c,0,s,0,0,1,0,0,-s,0,c,0,0,0,0,1);
  }

  rotateZ(angle:number){
    const c=f(Math.cos(angle)),s=f(Math.sin(angle));
    this.apply(c,-s,0,0,s,c,0,0,0,0,1,0,0,0,0,1);
  }

  /** rotate(angle) about z, or rotate(angle, x, y, z) about an axis (normalized; a zero axis does nothing). */
  rotate(angle:number,v0?:number,v1?:number,v2?:number){
    if(v0===undefined){
      this.rotateZ(angle);
      return;
    }
    let x=f(v0),y=f(v1!),z=f(v2!);
    const norm2=f(f(f(x*x)+f(y*y))+f(z*z));
    if(norm2<1e-4)return;
    if(Math.abs(f(norm2-1))>1e-4){
      const norm=f(Math.sqrt(norm2));
      x=f(x/norm);y=f(y/norm);z=f(z/norm);
    }
    const c=f(Math.cos(angle)),s=f(Math.sin(angle)),t=f(1-c);
    this.apply(
      f(f(f(t*x)*x)+c),f(f(f(t*x)*y)-f(s*z)),f(f(f(t*x)*z)+f(s*y)),0,
      f(f(f(t*x)*y)+f(s*z)),f(f(f(t*y)*y)+c),f(f(f(t*y)*z)-f(s*x)),0,
      f(f(f(t*x)*z)-f(s*y)),f(f(f(t*y)*z)+f(s*x)),f(f(f(t*z)*z)+c),0,
      0,0,0,1);
  }

  /** scale(s), scale(sx, sy) or scale(sx, sy, sz) */
  scale(sx:number,sy?:number,sz?:number){
    if(sy===undefined){
      sy=sz=sx;
    }else if(sz===undefined){
      sz=1;
    }
    this.m00=f(this.m00*sx);this.m01=f(this.m01*sy);this.m02=f(this.m02*sz);
    this.m10=f(this.m10*sx);this.m11=f(this.m11*sy);this.m12=f(this.m12*sz);
    this.m20=f(this.m20*sx);this.m21=f(this.m21*sy);this.m22=f(this.m22*sz);
    this.m30=f(this.m30*sx);this.m31=f(this.m31*sy);this.m32=f(this.m32*sz);
  }

  shearX(angle:number){
    const t=f(Math.tan(angle));
    this.apply(1,t,0,0,0,1,0,0,0,0,1,0,0,0,0,1);
  }

  shearY(angle:number){
    const t=f(Math.tan(angle));
    this.apply(1,0,0,0,t,1,0,0,0,0,1,0,0,0,0,1);
  }

  /** this = this × n: apply(PMatrix2D|PMatrix3D), apply(6 floats) or apply(16 floats) */
  apply(...a:(number|Matrix3DLike|Matrix2DLike)[]):void{
    const n=PMatrix3D.args(a);
    const r=new Array<number>(16);
    const m=this.get(null) as Float32Array;
    for(let i=0;i<4;i++){
      for(let j=0;j<4;j++){
        r[i*4+j]=f(f(f(f(m[i*4]*n[j])+f(m[i*4+1]*n[4+j]))+f(m[i*4+2]*n[8+j]))+f(m[i*4+3]*n[12+j]));
      }
    }
    this.set(...r);
  }

  /** this = n × this */
  preApply(...a:(number|Matrix3DLike|Matrix2DLike)[]):void{
    const n=PMatrix3D.args(a);
    const r=new Array<number>(16);
    const m=this.get(null) as Float32Array;
    for(let i=0;i<4;i++){
      for(let j=0;j<4;j++){
        r[i*4+j]=f(f(f(f(n[i*4]*m[j])+f(n[i*4+1]*m[4+j]))+f(n[i*4+2]*m[8+j]))+f(n[i*4+3]*m[12+j]));
      }
    }
    this.set(...r);
  }

  /** The 16 elements of a matrix argument (a 2D matrix or 6 floats become a 4×4 one). */
  private static args(a:(number|Matrix3DLike|Matrix2DLike)[]):number[]{
    const x=a[0];
    if(typeof x==="object"){
      if(is3D(x))return [x.m00,x.m01,x.m02,x.m03,x.m10,x.m11,x.m12,x.m13,x.m20,x.m21,x.m22,x.m23,x.m30,x.m31,x.m32,x.m33];
      return [x.m00,x.m01,0,x.m02,x.m10,x.m11,0,x.m12,0,0,1,0,0,0,0,1];
    }
    const n=a as number[];
    if(n.length===6)return [n[0],n[1],0,n[2],n[3],n[4],0,n[5],0,0,1,0,0,0,0,1];
    return n.map(f);
  }

  /**
   * mult(PVector source, PVector target) (x, y, z; w is not divided), or mult(float[] source, float[]
   * target) with 3 or 4 elements; a new target when null.
   */
  mult(source:PVector|Float32Array|number[],target?:PVector|Float32Array|number[]|null):PVector|Float32Array|number[]{
    if(source instanceof PVector){
      const out=target instanceof PVector?target:new PVector();
      const x=source.x,y=source.y,z=source.z;
      out.x=this.multX(x,y,z);
      out.y=this.multY(x,y,z);
      out.z=this.multZ(x,y,z);
      return out;
    }
    const n=source.length===3?3:4;
    const out=target&&!(target instanceof PVector)&&target.length===n?target:new Float32Array(n);
    if(n===3){
      const x=source[0],y=source[1],z=source[2];
      out[0]=this.multX(x,y,z);out[1]=this.multY(x,y,z);out[2]=this.multZ(x,y,z);
    }else{
      const x=source[0],y=source[1],z=source[2],w=source[3];
      out[0]=this.multX(x,y,z,w);out[1]=this.multY(x,y,z,w);out[2]=this.multZ(x,y,z,w);out[3]=this.multW(x,y,z,w);
    }
    return out;
  }

  private row(a:number,b:number,c:number,d:number,x:number,y:number,z:number|undefined,w:number|undefined){
    if(z===undefined)return f(f(f(a*x)+f(b*y))+d);
    if(w===undefined)return f(f(f(f(a*x)+f(b*y))+f(c*z))+d);
    return f(f(f(f(a*x)+f(b*y))+f(c*z))+f(d*w));
  }

  multX(x:number,y:number,z?:number,w?:number){
    return this.row(this.m00,this.m01,this.m02,this.m03,x,y,z,w);
  }

  multY(x:number,y:number,z?:number,w?:number){
    return this.row(this.m10,this.m11,this.m12,this.m13,x,y,z,w);
  }

  multZ(x:number,y:number,z:number,w?:number){
    return this.row(this.m20,this.m21,this.m22,this.m23,x,y,z,w);
  }

  multW(x:number,y:number,z:number,w?:number){
    return this.row(this.m30,this.m31,this.m32,this.m33,x,y,z,w);
  }

  transpose(){
    let t:number;
    t=this.m01;this.m01=this.m10;this.m10=t;
    t=this.m02;this.m02=this.m20;this.m20=t;
    t=this.m03;this.m03=this.m30;this.m30=t;
    t=this.m12;this.m12=this.m21;this.m21=t;
    t=this.m13;this.m13=this.m31;this.m31=t;
    t=this.m23;this.m23=this.m32;this.m32=t;
  }

  /** Determinant of the 3×3 matrix of the elements a..i (row by row), in float. */
  private static det3(a:number,b:number,c:number,d:number,e:number,g:number,h:number,i:number,j:number){
    return f(f(f(a*f(f(e*j)-f(g*i)))+f(b*f(f(g*h)-f(d*j))))+f(c*f(f(d*i)-f(e*h))));
  }

  determinant(){
    const D=PMatrix3D.det3;
    let d=f(this.m00*D(this.m11,this.m12,this.m13,this.m21,this.m22,this.m23,this.m31,this.m32,this.m33));
    d=f(d-f(this.m01*D(this.m10,this.m12,this.m13,this.m20,this.m22,this.m23,this.m30,this.m32,this.m33)));
    d=f(d+f(this.m02*D(this.m10,this.m11,this.m13,this.m20,this.m21,this.m23,this.m30,this.m31,this.m33)));
    d=f(d-f(this.m03*D(this.m10,this.m11,this.m12,this.m20,this.m21,this.m22,this.m30,this.m31,this.m32)));
    return d;
  }

  /** Invert in place (the adjugate over the determinant); false when the matrix is singular. */
  invert(){
    const det=this.determinant();
    if(det===0)return false;
    const D=PMatrix3D.det3;
    const {m00,m01,m02,m03,m10,m11,m12,m13,m20,m21,m22,m23,m30,m31,m32,m33}=this;
    // cofactor (i, j), transposed into (j, i)
    const c00=D(m11,m12,m13,m21,m22,m23,m31,m32,m33),c01=-D(m10,m12,m13,m20,m22,m23,m30,m32,m33);
    const c02=D(m10,m11,m13,m20,m21,m23,m30,m31,m33),c03=-D(m10,m11,m12,m20,m21,m22,m30,m31,m32);
    const c10=-D(m01,m02,m03,m21,m22,m23,m31,m32,m33),c11=D(m00,m02,m03,m20,m22,m23,m30,m32,m33);
    const c12=-D(m00,m01,m03,m20,m21,m23,m30,m31,m33),c13=D(m00,m01,m02,m20,m21,m22,m30,m31,m32);
    const c20=D(m01,m02,m03,m11,m12,m13,m31,m32,m33),c21=-D(m00,m02,m03,m10,m12,m13,m30,m32,m33);
    const c22=D(m00,m01,m03,m10,m11,m13,m30,m31,m33),c23=-D(m00,m01,m02,m10,m11,m12,m30,m31,m32);
    const c30=-D(m01,m02,m03,m11,m12,m13,m21,m22,m23),c31=D(m00,m02,m03,m10,m12,m13,m20,m22,m23);
    const c32=-D(m00,m01,m03,m10,m11,m13,m20,m21,m23),c33=D(m00,m01,m02,m10,m11,m12,m20,m21,m22);
    this.set(
      f(c00/det),f(c10/det),f(c20/det),f(c30/det),
      f(c01/det),f(c11/det),f(c21/det),f(c31/det),
      f(c02/det),f(c12/det),f(c22/det),f(c32/det),
      f(c03/det),f(c13/det),f(c23/det),f(c33/det));
    return true;
  }

  /**
   * Print the four rows as Processing does: each element as nfs(value, digits, 4), where digits is the
   * number of integer digits of the largest magnitude, separated by a space.
   */
  print(){
    const els=Array.from(this.get(null) as Float32Array);
    const digits=String(d2i(Math.max(...els.map(Math.abs)))).length;
    for(let i=0;i<4;i++)println(els.slice(i*4,i*4+4).map((v)=>nfsFloat(f(v),digits,4)).join(" "));
  }

  isIdentity(){
    return this.m00===1&&this.m01===0&&this.m02===0&&this.m03===0&&this.m10===0&&this.m11===1&&this.m12===0&&this.m13===0&&
      this.m20===0&&this.m21===0&&this.m22===1&&this.m23===0&&this.m30===0&&this.m31===0&&this.m32===0&&this.m33===1;
  }
}
