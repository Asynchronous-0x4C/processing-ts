export class Function{
  [x: string]: any;
  apply(v:any):any{}
  andThen(after:Function):Function{
    const result=new Function();
    result.apply=(v:any)=>after.apply(this.apply(v));
    return result;
  }
  compose(before:Function):Function{
    const result=new Function();
    result.apply=(v:any)=>this.apply(before.apply(v));
    return result;
  }
}