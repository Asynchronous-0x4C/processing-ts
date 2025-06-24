import { JSONArray } from "./JSONArray";

export class JSONObject{
  json:JSON;

  constructor(source:JSON){
    this.json=source;
  }

  static parse(str:string):JSONObject{
    return new JSONObject(JSON.parse(str));
  }

  hasKey(str:string):boolean{
    return this.json[str as keyof typeof this.json]!=null;
  }

  isNull(str:string):boolean{
    return this.json[str as keyof typeof this.json]==null;
  }

  toString():string{
    return JSON.stringify(this.json);
  }

  getInt(name:string,init:number):number{
    return this.json[name as keyof typeof this.json]==null?init:Number(this.json[name as keyof typeof this.json]);
  }

  setInt(name:string,val:number){
    if(val!=null)(this.json[name as keyof typeof this.json]as any)=val;
    return this;
  }

  getFloat(name:string,init:number):number{
    return this.json[name as keyof typeof this.json]==null?init:Number(this.json[name as keyof typeof this.json]);
  }

  setFloat(name:string,val:number){
    if(val!=null)(this.json[name as keyof typeof this.json]as any)=val;
    return this;
  }

  getString(name:string,init:string):string{
    return this.json[name as keyof typeof this.json]==null?init:String(this.json[name as keyof typeof this.json]);
  }

  setString(name:string,val:string){
    if(val!=null)(this.json[name as keyof typeof this.json]as any)=val;
    return this;
  }

  getBoolean(name:string,init:boolean):boolean{
    return this.json[name as keyof typeof this.json]==null?init:Boolean(this.json[name as keyof typeof this.json]);
  }

  setBoolean(name:string,val:boolean){
    if(val!=null)(this.json[name as keyof typeof this.json]as any)=val;
    return this;
  }

  getJSONObject(name:string):JSONObject{
    return new JSONObject(this.json[name as keyof typeof this.json]as unknown as JSON);
  }

  setJSONObject(name:string,val:JSONObject){
    if(val!=null)(this.json[name as keyof typeof this.json]as any)=val.json;
    return this;
  }

  getJSONArray(name:string):JSONArray{
    return new JSONArray(this.json[name as keyof typeof this.json]as unknown as JSON);
  }

  setJSONArray(name:string,val:JSONArray){
    if(val!=null)(this.json[name as keyof typeof this.json]as any)=val.json;
    return this;
  }

  keys():string[]{
    return Object.keys(this.json);
  }

  remove(name:string){
    delete this.json[name as keyof typeof this.json];
  }
}