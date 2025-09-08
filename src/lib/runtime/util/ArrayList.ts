export class ArrayList<T> extends Array<T>{

  constructor(c?:T[]|number) {
    if(c){
      if(typeof c === "number"){
        super(c);
        this.fill(null as any);
      }else{
        super(...c);
      }
    }else{
      super();
    }
  }

  add(item: T): void {
    this.push(item);
  }

  addAll(item:T[]){
    this.push(...item);
  }

  clear(): void {
    this.splice(0,this.length);
  }

  contains(v:T){
    return this.includes(v);
  }

  get(index: number): T|null {
    return this[index];
  }

  isEmpty(){
    return this.length===0;
  }

  remove(arg:T|number): void {
    if (typeof arg === "number") {
      if (arg >= 0 && arg < this.length) {
        this.splice(arg, 1);
      }
    } else {
      const index = this.indexOf(arg);
      if (index !== -1) {
        this.splice(index, 1);
      }
    }
  }

  removeAll(a:T[]){
    a.forEach(e=>this.remove(this.indexOf(e)));
  }

  set(index:number,element:T){
    this[index]=element;
  }

  size(): number {
    return this.length;
  }

  toArray():T[]{
    return new Array<T>(...this);
  }
}