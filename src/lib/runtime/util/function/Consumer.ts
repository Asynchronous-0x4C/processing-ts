export class Consumer{
  accept(v:any):void{}
  andThen(v:Consumer):void{
    this.accept(v);
  }
}