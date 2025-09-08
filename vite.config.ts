import fs, { globSync, writeFile } from "fs";
import path, { resolve } from "path"
import { defineConfig } from "vite"
import { externalizeDeps } from 'vite-plugin-externalize-deps'

function genSamples(){
  const files=globSync("./public/samples/**/sketch.properties");
  let m=new Map<string,Array<string>>();
  files.map(f=>f.replace("public\\samples\\","").replace("\\sketch.properties","")).forEach(f=>{
    const category=f.split("\\")[0].trim();
    const name=f.split("\\")[1].trim();
    if(!m.has(category))m.set(category,[]);
    m.get(category)!.push(name);
  });
  const j=JSON.stringify(m,(k,v)=>{
    if(v instanceof Map){
      return Object.fromEntries(v);
    }else{
      return v;
    }
  },2);
  
  const outPath = path.join('src', 'scripts', 'samples.json');
  fs.writeFileSync(outPath, j, 'utf-8');
}

export default defineConfig({
  build: {
    target: 'esnext',
    lib:{
      entry: resolve(__dirname, 'src/lib/index.ts'),
      name: "processing-ts",
      fileName: "index",
    },
  },
  server:{
    host:true,
    port:8080
  },
  base:"/processing-ts/",
  esbuild:{
    minifyIdentifiers:false
  },
  plugins:[
    externalizeDeps({
      deps:true,
      devDeps:false,
      except:["antlr4"],
    }),
    {
      name: 'tags-generator',
      apply: 'serve',
      configureServer(server) {
        genSamples();
        server.watcher.on('add', (file) => {
          if (file.startsWith('src/content/posts/')) {
            genSamples();
          }
        });
        server.watcher.on('change', (file) => {
          if (file.startsWith('src/content/posts/')) {
            genSamples();
          }
        });
        server.watcher.on('unlink', (file) => {
          if (file.startsWith('src/content/posts/')) {
            genSamples();
          }
        });
      },
    },
    {
      name: 'import-resolver',
      apply: 'build',
      writeBundle(options,bundle){
        let b;
        if(b=bundle["index.js"]){
          const codes=b.code.split("\n");
          const imports:string=codes[0];
          codes[0]=imports.match(/{(\s*([\w,\s])+)}/)![1].trim().split(",").map(i=>i.trim()).map(i=>`const ${i}=PIXI.${i};`).join("\n");
          writeFile(options.dir+"\\library.js",codes.join("\n"),"utf8",(err)=>{if(err)console.log(err)});
        }
      },
    }
  ]
});