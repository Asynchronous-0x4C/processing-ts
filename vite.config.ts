import fs, { globSync } from "fs";
import { build as esbuild } from "esbuild";
import path, { resolve } from "path"
import { defineConfig } from "vite"
import { externalizeDeps } from 'vite-plugin-externalize-deps'

const SAMPLES_DIR=path.join("public","samples");

/** Write src/scripts/samples.json ({category: [sketch folder, ...]}) from public/samples/<category>/<name>/sketch.properties. */
function genSamples(){
  const files=globSync("public/samples/*/*/sketch.properties").sort();
  let m=new Map<string,Array<string>>();
  files.forEach(f=>{
    const [category,name]=path.relative(SAMPLES_DIR,path.dirname(f)).split(path.sep);
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
    // public/ holds the demo's samples; they must not end up in the published dist/.
    copyPublicDir: false,
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
      name: 'samples-generator',
      apply: 'serve',
      configureServer(server) {
        genSamples();
        const onChange=(file:string)=>{
          if(/public[\\/]samples[\\/].*sketch\.properties$/.test(file))genSamples();
        };
        server.watcher.on('add',onChange);
        server.watcher.on('unlink',onChange);
      },
    },
    {
      // The default font is loaded at run time from fonts/ next to the bundle (src/lib/runtime/PFont.ts); ship it with its license.
      name: 'copy-fonts',
      apply: 'build',
      writeBundle(options){
        fs.cpSync(resolve(__dirname,'src/lib/runtime/fonts'),path.join(options.dir!,'fonts'),{recursive:true});
      },
    },
    {
      // dist/library.js: single-file ESM with the dependencies (@lezer/*) bundled in, for use without a bundler.
      name: 'single-file-library',
      apply: 'build',
      async writeBundle(options,bundle){
        if(!bundle["index.js"])return;
        await esbuild({
          entryPoints:[path.join(options.dir!,"index.js")],
          bundle:true, format:"esm", platform:"browser", target:"esnext",
          outfile:path.join(options.dir!,"library.js"), logLevel:"warning",
          nodePaths:[resolve(__dirname,"node_modules")],
        });
      },
    }
  ]
});