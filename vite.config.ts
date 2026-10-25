import fs, { globSync } from "fs";
import { build as esbuild } from "esbuild";
import path, { resolve } from "path"
import { defineConfig } from "vite"
import { externalizeDeps } from 'vite-plugin-externalize-deps'
import { buildStandaloneRuntime, literalAssetURLs } from "./src/aot/standalone"

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
    // Subpath exports (package.json "exports"): the compatibility layer (SketchManager = compiler + runtime),
    // the runtime alone, the compiler alone, and the OpenGL renderers imported statically. Shared code
    // goes to chunks; the OpenGL renderers stay a chunk loaded on demand.
    lib:{
      entry: {
        index: resolve(__dirname, 'src/lib/index.ts'),
        runtime: resolve(__dirname, 'src/lib/runtime.ts'),
        compiler: resolve(__dirname, 'src/lib/compiler.ts'),
        webgl: resolve(__dirname, 'src/lib/webgl.ts'),
      },
      formats: ["es"],
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
      // The default font and the worker script as literal `new URL("./…", import.meta.url)` in dist/, which
      // bundlers taking the package in copy as assets. After Vite's own asset handling ("post"), which would
      // inline a literal font as base64. See src/lib/runtime/assetURLs.ts.
      name: 'literal-asset-urls',
      apply: 'build',
      enforce: 'post',
      transform(_code,id){
        if(!/src[\\/]lib[\\/]runtime[\\/]assetURLs\.ts$/.test(id))return null;
        return [
          `export function defaultFontFileURL() { return new URL("./fonts/ProcessingSansPro-Regular.ttf", import.meta.url); }`,
          `export function workerScriptURL() { return new URL("./worker.js", import.meta.url); }`,
        ].join("\n");
      },
    },
    {
      // Node tools: the CLI (dist/cli.js, "bin") and the Vite plugin (dist/vite.js), with the compiler bundled
      // in (the dependencies stay imports). Node does not strip types under node_modules, so they ship as JS.
      name: 'node-tools',
      apply: 'build',
      async writeBundle(options,bundle){
        if(!bundle["index.js"])return;
        for(const name of ["cli","vite"]){
          await esbuild({
            entryPoints:[resolve(__dirname,`src/aot/${name}.ts`)],
            bundle:true, format:"esm", platform:"node", target:"node22", packages:"external",
            outfile:path.join(options.dir!,`${name}.js`), logLevel:"warning",
          });
        }
        fs.copyFileSync(resolve(__dirname,"src/aot/client.d.ts"),path.join(options.dir!,"client.d.ts"));
        // dist/worker.js: the Worker execution mode's script in one file (with the OpenGL renderers and
        // libtess), so that a bundler only has to copy it.
        await esbuild({
          entryPoints:[resolve(__dirname,"src/lib/runtime/worker/entry.ts")],
          bundle:true, format:"esm", platform:"browser", target:"es2022", minify:true, legalComments:"eof",
          outfile:path.join(options.dir!,"worker.js"), logLevel:"warning", plugins:[literalAssetURLs(__dirname)],
        });
      },
    },
    {
      // dist/standalone/: the runtime as plain ES modules with its dependencies, copied by `processing-ts build`.
      name: 'standalone-runtime',
      apply: 'build',
      async writeBundle(options,bundle){
        if(!bundle["index.js"])return;
        await buildStandaloneRuntime(__dirname,path.join(options.dir!,"standalone"));
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