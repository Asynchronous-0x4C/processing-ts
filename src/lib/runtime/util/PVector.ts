export class PVector{
  public x: number;
  public y: number;
  public z: number=0;

  constructor(x: number=0, y: number=0, z: number=0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  /**
   * Add vector
   * @param args Argments.You can only use `add(vector:PVector)` or `add(x:number,y:number,z?:number)`.
   * @returns Returns own vector.
   */
  add(...args:PVector[]|number[]): PVector {
    if(args.length==1&&args[0].constructor.name==="PVector"){
      const v=args[0] as PVector;
      this.x += v.x;
      this.y += v.y;
      this.z += v.z;
    }else if(args.length>=2&&args.length<=3&&args[0].constructor.name==="Number"&&args[1].constructor.name==="Number"&&(args[2]??args[1]).constructor.name==="Number"){
      const {x,y,z}={x:args[0]as number,y:args[1]as number,z:(args[2]??0)as number};
      this.x+=x;
      this.y+=y;
      this.z+=z;
    }
    return this;
  }

  sub(...args:PVector[]|number[]): PVector {
    if(args.length==1&&args[0].constructor.name==="PVector"){
      const v=args[0] as PVector;
      this.x -= v.x;
      this.y -= v.y;
      this.z -= v.z;
    }else if(args.length>=2&&args.length<=3&&args[0].constructor.name==="Number"&&args[1].constructor.name==="Number"&&(args[2]??args[1]).constructor.name==="Number"){
      const {x,y,z}={x:args[0]as number,y:args[1]as number,z:(args[2]??0)as number};
      this.x-=x;
      this.y-=y;
      this.z-=z;
    }
    return this;
  }

  mult(scalar: number): PVector {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
    return this;
  }

  div(scalar: number): PVector {
    // Java float division: dividing by 0 yields Infinity/NaN, no exception.
    this.x /= scalar;
    this.y /= scalar;
    this.z /= scalar;
    return this;
  }

  mag(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  magSq():number{
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  /** Set the magnitude of this vector (modifies it in place, like Processing). */
  setMag(len:number){
    return this.normalize().mult(len);
  }

  normalize(): PVector {
    const mag = this.mag();
    if (mag !== 0 && mag !== 1) this.div(mag);
    return this;
  }

  copy(): PVector {
    return new PVector(this.x, this.y, this.z);
  }

  set(...args:PVector[]|number[]): PVector {
    if(args.length==1&&args[0].constructor.name==="PVector"){
      const v=args[0] as PVector;
      this.x = v.x;
      this.y = v.y;
      this.z = v.z;
    }else if(args.length>=2&&args.length<=3&&args[0].constructor.name==="Number"&&args[1].constructor.name==="Number"&&(args[2]??args[1]).constructor.name==="Number"){
      const {x,y,z}={x:args[0]as number,y:args[1]as number,z:(args[2]??0)as number};
      this.x=x;
      this.y=y;
      this.z=z;
    }
    return this;
  }

  /** Limit the magnitude of this vector to max (modifies it in place). */
  limit(max:number):PVector{
    if(this.magSq()>max*max)this.normalize().mult(max);
    return this;
  }
}