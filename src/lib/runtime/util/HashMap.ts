export class HashMap<K,V>{
  private map:Map<K,V>

  constructor(iterable?: Iterable<readonly [K, V]> | number | readonly (readonly [K, V])[] | null | undefined){
    if(typeof iterable === "number"){
      this.map=new Map<K,V>();
    }else{
      this.map=new Map<K,V>(iterable);
    }
  }

  containsKey(key:K){
    return this.map.has(key);
  }

  containsValue(value:V){
    return new Array(...this.map.values()).includes(value);
  }

  get(key:K){
    return this.map.get(key);
  }

  getOrDefault(key:K,value:V){
    return this.map.get(key)??value;
  }

  isEmpty(){
    return this.map.size===0;
  }

  keySet(){
    return this.map.keys();
  }

  put(key:K,value:V){
    this.map.set(key,value);
  }

  putIfAbsent(key:K,value:V){
    if(!this.map.has(key)){
      this.map.set(key,value);
    }
  }

  remove(k:K,v?:V){
    if(v){
      if(this.map.get(k)===v)this.map.delete(k);
    }else{
      this.map.delete(k);
    }
  }

  size(){
    return this.map.size;
  }

  values(){
    return this.map.values();
  }
}