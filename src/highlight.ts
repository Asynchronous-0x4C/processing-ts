const escapes:{from:string,to:string}[]=[{from:"&",to:"&amp;"},{from:"<",to:"&lt;"},{from:">",to:"&gt;"},{from:'"',to:"&quot;"},{from:"'",to:"&#039;"}];

type Processor={pattern:RegExp,type:string,original?:boolean,separator?:string}

const comments:Processor={pattern:/\/\/.*|\/\*[\S\s]*?\*\//g,type:"token-comment"};
const strings:Processor={pattern:/(?<!\\)(?<q>"|').*?(?<!\\)\k<q>/g,type:"token-string"};
const p5controls:Processor={pattern:/(?<=void\s+)(setup|draw)(?=\s*\()/g,type:"token-p5controls"};
const keywords:Processor={pattern:/\b(if|else|for|while|switch|return|try|catch|finally|case|default|throw|throws|break|continue|do)\b/g,type:"token-keyword"};
const modifiers:Processor={pattern:/\b(import|class|interface|enum|public|protected|private|static|final|volatile|transient|abstract|extends|implements|instanceof|native|new|super|strictfp)\b/g,type:"token-modifier"};
const constants:Processor={pattern:/\b(null|true|false)\b/g,type:"token-constant"};
const p5variables:Processor={pattern:/\b(key|keyCode|mouseX|mouseY|pmouseX|pmouseY|frameCount|frameRate|width|height|PI)\b(?!\s*\()/g,type:"token-p5variables"};
const numbers:Processor={pattern:/(?<!&#)\b-?\d+(\.\d+)?[lfd]?\b/g,type:"token-number"};
const functions:Processor={pattern:/\w+\s*(?=\()/g,type:"token-function",original:true};
const constantVariables:Processor={pattern:/\b[A-Z0-9_]+\b/g,type:"token-constant-variable"};
const classDeclarations:Processor={pattern:/(?<=(?:class|interface|enum)\s+)\w+|(?<=(?:extends|implements)\s+)\w+(\s*\.\s*\w+)*/g,type:"token-type",original:true,separator:"."};
const classSpecifications:Processor={pattern:/(?<=(?:new|throws)\s+)\w+(\s*\.\s*\w+)*|\w+(\s*\.\s*\w+)*(?=\.class)|(?<=(?<!\w+\s*)\(\s*)\w+(\s*\.\s*\w+)*/g,type:"token-type",original:true,separator:"."};
const genericTypes:Processor={pattern:/(?<=<\s*)(\w+|\?)(\s*,\s*(\w+|\?))*/g,type:"token-type",original:true,separator:","};
const typeDifinitions:Processor={pattern:/\b\w+(\s*\.\s*\w+)*(?=(\s*\[\s*\])?(\s+\w+\s*[;=,)]|\s*<|\s+\w+\s*\())/g,type:"token-type",original:true,separator:"."};
const annotations:Processor={pattern:/(?<=@)\b\w+(\s*\.\s*\w+)*/g,type:"token-type",original:true,separator:"."};
const variables:Processor={pattern:/\b\w+\b/g,type:"token-variable"};

const processors=[strings,comments,p5controls,keywords,modifiers,constants,p5variables,numbers,classDeclarations,classSpecifications,genericTypes,typeDifinitions,annotations,functions,constantVariables,variables];

export async function applySyntaxHighlighting(code: string,highlightingCode: HTMLElement) {
  const escapedCode=code;
  const tokens:{start:number,end:number,type:string,text:string}[]=[];
  let src=escapedCode;

  processors.forEach(p=>{
    const match=[...(p.original?escapedCode:src).matchAll(p.pattern)];
    for(const m of match){
      if(p.separator){
        let offset=m.index;
        const seg=m[0].split(p.separator);
        for(const s of seg){
          const data={start:offset,end:offset+s.length,type:p.type,text:s};
          if(p.original){
            if(src.slice(data.start,data.end)!==s)continue;
          }
          tokens.push(data);
          src=src.slice(0,data.start)+new Array<string>(s.length).fill(" ").join("")+src.slice(data.end);
          offset+=s.length+1;
        }
      }else{
        const data={start:m.index,end:m.index+m[0].length,type:p.type,text:m[0]};
        if(p.original){
          if(src.slice(data.start,data.end)!==m[0])continue;
        }
        tokens.push(data);
        src=src.slice(0,data.start)+new Array<string>(m[0].length).fill(" ").join("")+src.slice(data.end);
      }
    }
    if(p==comments){
      tokens.sort((a,b)=>a.start-b.start);
      let pos=0;
      for(let i=0;i<tokens.length;i++){
        if(tokens[i].end<pos){
          const start=tokens[i].start-tokens[i-1].start
          tokens[i-1].text=tokens[i-1].text.slice(0,start)+tokens[i].text+tokens[i-1].text.slice(start+tokens[i].text.length);
          tokens.splice(i,1);
          i--;
        }else{
          pos=tokens[i].end;
        }
      }
    }
  });

  let level=0;
  for(let i=0;i<src.length;i++){
    const c=src.charAt(i);
    let data;
    let bracket=false;
    switch(c){
      case "(":
        data={start:i,end:i+1,type:`token-bracket\" data-level=\"${level+1}`,text:c};
        level=mod(level+1,3);
        bracket=true;
        break;
      case ")":
        level=mod(level-1,3);
        data={start:i,end:i+1,type:`token-bracket\" data-level=\"${level+1}`,text:c};
        bracket=true;
        break;
      case "{":
        data={start:i,end:i+1,type:`token-bracket\" data-level=\"${mod(level+1,3)+1}`,text:c};
        level=mod(level+1,3);
        bracket=true;
        break;
      case "}":
        level=mod(level-1,3);
        data={start:i,end:i+1,type:`token-bracket\" data-level=\"${mod(level+1,3)+1}`,text:c};
        bracket=true;
        break;
      case "[":
        data={start:i,end:i+1,type:`token-bracket\" data-level=\"${level+1}`,text:c};
        level=mod(level+1,3);
        bracket=true;
        break;
      case "]":
        level=mod(level-1,3);
        data={start:i,end:i+1,type:`token-bracket\" data-level=\"${level+1}`,text:c};
        bracket=true;
        break;
    }
    if(bracket){
      tokens.push(data);
      src=src.slice(0,data.start)+" "+src.slice(data.end);
    }
  }

  tokens.sort((a,b)=>a.start-b.start);

  let result="";
  let pos=0;
  for(const t of tokens){
    if(pos<t.start)result+=escapeHtml(src.slice(pos,t.start));
    result+=`<span class="${t.type}">${escapeHtml(t.text)}</span>`;
    pos=t.end;
  }
  result+=escapeHtml(src.slice(pos));

  highlightingCode.innerHTML = result;
}

function escapeHtml(text: string) {
  escapes.forEach(e=>{
    text=text.replace(new RegExp(e.from,'g'),e.to);
  });
  return text;
}

function mod(x:number,y:number):number{
  return ((x%y)+y)%y;
}

function assignToken(name:string,target:string){
  return `<span class="${name}">${target}</span>`;
}