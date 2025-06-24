import { JSONObject } from "./JSONObject";

export class JSONArray{
  json:JSON;

  constructor(json:JSON){
    this.json=json;
  }

  static parse(str:string):JSONArray{
    return new JSONArray(JSON.parse(str));
  }

  isNull(index:number):boolean{
    return this.json[index as unknown as keyof typeof this.json]==null;
  }

  toString():string{
    return JSON.stringify(this.json);
  }

  getJSONArray(index:number,init:JSONArray):JSONArray{
    return this.json[index as unknown as keyof typeof this.json]==null?init:new JSONArray(this.json[index as unknown as keyof typeof this.json]as unknown as JSON);
  }

  setJSONArray(index:number,val:JSONArray){
    if(val!=null)(this.json[index as unknown as keyof typeof this.json]as any)=val;
    return this;
  }

  getJSONObject(index:number):JSONObject{
    return new JSONObject(this.json[index as unknown as keyof typeof this.json]as unknown as JSON);
  }

  setJSONObject(index:number,val:JSONObject){
    if(val!=null)(this.json[index as unknown as keyof typeof this.json]as any)=val;
    return this;
  }

  getInt(index:number,init:number):number{
    return this.json[index as unknown as keyof typeof this.json]==null?init:Number(this.json[index as unknown as keyof typeof this.json]);
  }

  setInt(index:number,val:number){
    if(val!=null)(this.json[index as unknown as keyof typeof this.json]as any)=val;
    return this;
  }

  toIntArray():number[]{
    let arr:number[]=[];
    for(let i in this.json){
      arr.push(Number(i));
    }
    return arr;
  }

  getFloat(index:number,init:number):number{
    return this.json[index as unknown as keyof typeof this.json]==null?init:Number(this.json[index as unknown as keyof typeof this.json]);
  }

  setFloat(index:number,val:number){
    if(val!=null)(this.json[index as unknown as keyof typeof this.json]as any)=val;
    return this;
  }

  toFloatArray():number[]{
    let arr:number[]=[];
    for(let i in this.json){
      arr.push(Number(i));
    }
    return arr;
  }

  getString(index:number,init:string):string{
    return this.json[index as unknown as keyof typeof this.json]==null?init:String(this.json[index as unknown as keyof typeof this.json]);
  }

  setString(index:number,val:string){
    if(val!=null)(this.json[index as unknown as keyof typeof this.json]as any)=val;
    return this;
  }

  toStringArray():string[]{
    let arr:string[]=[];
    for(let i in this.json){
      arr.push(i);
    }
    return arr;
  }

  getBoolean(index:number,init:boolean):boolean{
    return this.json[index as unknown as keyof typeof this.json]==null?init:Boolean(this.json[index as unknown as keyof typeof this.json]);
  }

  setBoolean(index:number,val:boolean):JSONArray{
    if(val!=null)(this.json[index as unknown as keyof typeof this.json]as any)=val;
    return this;
  }

  toBooleanArray():boolean[]{
    let arr:boolean[]=[];
    for(let i in this.json){
      arr.push(Boolean(i));
    }
    return arr;
  }

  size():number{
    return this.json==undefined?0:Object.keys(this.json).length;
  }

  append(val:number|string|boolean|JSONObject|JSONArray):JSONArray{
    (this.json as any).push(val);
    return this;
  }

  remove(index:number){
    delete this.json[index as unknown as keyof typeof this.json];
  }
}