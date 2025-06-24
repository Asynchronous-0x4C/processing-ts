export abstract class IOBase{
  base_path:string;
  preload:{path:string,content:ArrayBuffer}[]|null=null;

  constructor(base_path:string){
    this.base_path=base_path;
  }
  
  abstract request(path:string):string;

  toBlob(src:string,mime:string):Blob{
    const len = src.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = src.charCodeAt(i) & 0xff;
    }
    return new Blob([bytes],{type:mime});
  }

  readBlob(blob:Blob):string{
    const xhr=new XMLHttpRequest();
    const url=URL.createObjectURL(blob);

    // required if you need to read binary data:
    xhr.overrideMimeType('text/plain; charset=x-user-defined');
    xhr.open('GET',url,false);
    xhr.send();

    return xhr.response;
  }

  save_blob(name:string,data:Blob){
    window.localStorage.setItem(name,this.readBlob(data));
  }

  save_string(name:string,data:string){
    window.localStorage.setItem(name,data);
  }

  load_buffer_as_blob(name:string,mime:string):Blob|null{
    if(this.preload==null)return null;
    const result=this.preload.filter(p=>p.path==name);
    if(result.length>0){
      return new Blob([result[0].content],{type:mime});
    }
    return null;
  }

  load_buffer_as_string(name:string):string|null{
    if(this.preload==null)return null;
    const result=this.preload.filter(p=>p.path==name);
    if(result.length>0){
      return new TextDecoder("utf-8").decode(result[0].content);
    }
    return null;
  }

  load_as_blob(name:string,mime:string):Blob|null{
    let result;
    if((result=this.toBlob(window.localStorage.getItem(name)!,mime))!=null){
      return result;
    }else if((result=this.load_buffer_as_blob(name,mime))!=null){
      return result;
    }else if((result=this.toBlob(this.request(name),mime))!=null){
      return result;
    }
    return null;
  }

  load_as_string(name:string):string|null{
    let result;
    if((result=window.localStorage.getItem(name))!=null){
      return result;
    }else if((result=this.load_buffer_as_string(name))!=null){
      return result;
    }else if((result=this.request(name))!=null){
      return result;
    }
    return null;
  }
}