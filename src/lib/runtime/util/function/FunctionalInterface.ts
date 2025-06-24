import { Function } from "./Function";

export class FunctionalInterface{
  static get(f:any){
    return new (function():any{
      function result(){}
      result.prototype=new Function();
      result.prototype.get=f;
      result.prototype.test=f;
      result.prototype.accept=f;
      result.prototype.apply=f;
      result.prototype.call=f;
      result.prototype.run=f;
      return result;
    }())();
  }
}