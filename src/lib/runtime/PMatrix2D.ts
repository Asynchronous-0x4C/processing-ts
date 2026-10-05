/**
 * 2D affine matrix as Processing's PMatrix2D: x' = m00*x + m01*y + m02, y' = m10*x + m11*y + m12.
 * Operations multiply on the right (translate() then rotate() rotates in the translated frame), like
 * Processing and the Canvas 2D API.
 */
export class PMatrix2D{
  m00=1;m01=0;m02=0;
  m10=0;m11=1;m12=0;

  constructor(m00=1,m01=0,m02=0,m10=0,m11=1,m12=0){
    this.set(m00,m01,m02,m10,m11,m12);
  }

  reset(){
    this.set(1,0,0,0,1,0);
  }

  /** get() returns a copy; get(target) fills a float[6] (m00, m01, m02, m10, m11, m12). */
  get(target?:Float32Array|number[]):PMatrix2D|Float32Array|number[]{
    if(target===undefined)return new PMatrix2D(this.m00,this.m01,this.m02,this.m10,this.m11,this.m12);
    target[0]=this.m00;target[1]=this.m01;target[2]=this.m02;
    target[3]=this.m10;target[4]=this.m11;target[5]=this.m12;
    return target;
  }

  /** set(matrix), set(float[6]) or set(m00, m01, m02, m10, m11, m12) */
  set(a:PMatrix2D|ArrayLike<number>|number,m01?:number,m02?:number,m10?:number,m11?:number,m12?:number){
    if(a instanceof PMatrix2D){
      this.set(a.m00,a.m01,a.m02,a.m10,a.m11,a.m12);
    }else if(typeof a!=="number"){
      this.set(a[0],a[1],a[2],a[3],a[4],a[5]);
    }else{
      this.m00=a;this.m01=m01!;this.m02=m02!;
      this.m10=m10!;this.m11=m11!;this.m12=m12!;
    }
  }

  translate(tx:number,ty:number){
    this.m02=tx*this.m00+ty*this.m01+this.m02;
    this.m12=tx*this.m10+ty*this.m11+this.m12;
  }

  rotate(angle:number){
    const s=Math.sin(angle),c=Math.cos(angle);
    this.apply(c,-s,0,s,c,0);
  }

  scale(sx:number,sy:number=sx){
    this.m00*=sx;this.m01*=sy;
    this.m10*=sx;this.m11*=sy;
  }

  shearX(angle:number){
    this.apply(1,Math.tan(angle),0,0,1,0);
  }

  shearY(angle:number){
    this.apply(1,0,0,Math.tan(angle),1,0);
  }

  /** this = this × n */
  apply(n00:number|PMatrix2D,n01?:number,n02?:number,n10?:number,n11?:number,n12?:number):void{
    if(n00 instanceof PMatrix2D)return this.apply(n00.m00,n00.m01,n00.m02,n00.m10,n00.m11,n00.m12);
    const t0=this.m00,t1=this.m01;
    this.m00=n00*t0+n10!*t1;
    this.m01=n01!*t0+n11!*t1;
    this.m02=n02!*t0+n12!*t1+this.m02;
    const t3=this.m10,t4=this.m11;
    this.m10=n00*t3+n10!*t4;
    this.m11=n01!*t3+n11!*t4;
    this.m12=n02!*t3+n12!*t4+this.m12;
  }

  /** this = n × this */
  preApply(n00:number|PMatrix2D,n01?:number,n02?:number,n10?:number,n11?:number,n12?:number):void{
    if(n00 instanceof PMatrix2D)return this.preApply(n00.m00,n00.m01,n00.m02,n00.m10,n00.m11,n00.m12);
    const r00=n00*this.m00+n01!*this.m10,r01=n00*this.m01+n01!*this.m11,r02=n00*this.m02+n01!*this.m12+n02!;
    const r10=n10!*this.m00+n11!*this.m10,r11=n10!*this.m01+n11!*this.m11,r12=n10!*this.m02+n11!*this.m12+n12!;
    this.set(r00,r01,r02,r10,r11,r12);
  }

  multX(x:number,y:number){
    return this.m00*x+this.m01*y+this.m02;
  }

  multY(x:number,y:number){
    return this.m10*x+this.m11*y+this.m12;
  }

  determinant(){
    return this.m00*this.m11-this.m01*this.m10;
  }

  /** Invert in place; false when the matrix is singular. */
  invert(){
    const d=this.determinant();
    if(Math.abs(d)<=Number.MIN_VALUE)return false;
    const t00=this.m00,t01=this.m01,t02=this.m02,t10=this.m10,t11=this.m11,t12=this.m12;
    this.m00=t11/d;this.m10=-t10/d;
    this.m01=-t01/d;this.m11=t00/d;
    this.m02=(t01*t12-t11*t02)/d;
    this.m12=(t10*t02-t00*t12)/d;
    return true;
  }

  isIdentity(){
    return this.m00===1&&this.m01===0&&this.m02===0&&this.m10===0&&this.m11===1&&this.m12===0;
  }
}
