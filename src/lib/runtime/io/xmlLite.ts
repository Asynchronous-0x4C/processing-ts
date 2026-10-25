// A small XML reader for where DOMParser does not exist (Web Workers): elements and attributes only,
// with the parts of the DOM Element interface the loaders use (localName, getAttribute(), children).

export interface XmlElement{
  /** The name without its namespace prefix ("svg:path" → "path"), as Element.localName. */
  readonly localName:string;
  readonly children:ArrayLike<XmlElement>;
  getAttribute(name:string):string|null;
  hasAttribute(name:string):boolean;
}

class Elem implements XmlElement{
  readonly localName:string;
  readonly children:Elem[]=[];
  readonly attrs=new Map<string,string>();
  constructor(name:string){
    const i=name.indexOf(":");
    this.localName=i>=0?name.slice(i+1):name;
  }
  getAttribute(name:string):string|null{
    return this.attrs.get(name)??null;
  }
  hasAttribute(name:string):boolean{
    return this.attrs.has(name);
  }
}

const ENTITIES:Record<string,string>={amp:"&",lt:"<",gt:">",quot:"\"",apos:"'"};

function decode(s:string):string{
  return s.replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi,(m,e:string)=>{
    if(e[0]==="#")return String.fromCodePoint(e[1]==="x"||e[1]==="X"?parseInt(e.slice(2),16):parseInt(e.slice(1),10));
    return ENTITIES[e]??m;
  });
}

/** The root element of an XML document, or null when there is none or the markup is broken. */
export function parseXml(text:string):XmlElement|null{
  const stack:Elem[]=[];
  let root:Elem|null=null;
  let i=0;
  const n=text.length;
  while(i<n){
    const lt=text.indexOf("<",i);
    if(lt<0)break;
    if(text.startsWith("<!--",lt)){
      const e=text.indexOf("-->",lt+4);
      if(e<0)return null;
      i=e+3;
    }else if(text.startsWith("<![CDATA[",lt)){
      const e=text.indexOf("]]>",lt+9);
      if(e<0)return null;
      i=e+3;
    }else if(text.startsWith("<?",lt)){
      const e=text.indexOf("?>",lt+2);
      if(e<0)return null;
      i=e+2;
    }else if(text.startsWith("<!",lt)){
      // <!DOCTYPE ...> with an optional [internal subset]
      let k=lt+2,depth=0;
      for(;k<n;k++){
        const c=text[k];
        if(c==="[")depth++;
        else if(c==="]")depth--;
        else if(c===">"&&depth<=0)break;
      }
      i=k+1;
    }else if(text[lt+1]==="/"){
      const e=text.indexOf(">",lt);
      if(e<0)return null;
      stack.pop();
      i=e+1;
    }else{
      const m=/^<([^\s/>]+)/.exec(text.slice(lt,lt+256));
      if(!m)return null;
      const el=new Elem(m[1]);
      let k=lt+m[0].length;
      // attributes up to > or />
      const attr=/\s*([^\s=/>]+)\s*=\s*("([^"]*)"|'([^']*)')|\s*(\/?>)/y;
      let closed=false,selfClosing=false;
      while(k<n){
        attr.lastIndex=k;
        const a=attr.exec(text);
        if(!a)return null;
        k=attr.lastIndex;
        if(a[5]){
          closed=true;
          selfClosing=a[5]==="/>";
          break;
        }
        el.attrs.set(a[1],decode(a[3]??a[4]??""));
      }
      if(!closed)return null;
      if(stack.length)stack[stack.length-1].children.push(el);
      else if(!root)root=el;
      if(!selfClosing)stack.push(el);
      i=k;
    }
  }
  return root;
}
