const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';

export class PFont{
  id:string="";
  name:string;

  constructor(name:string){
    for(let i = 0; i < 12; i++) {
      this.id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.name=name;
  }

  clone(){
    const f=new PFont(this.name);
    f.id=this.id.slice();
    return f;
  }
}