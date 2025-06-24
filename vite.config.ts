import { resolve } from "path"
import { defineConfig } from "vite"
import { externalizeDeps } from 'vite-plugin-externalize-deps'

export default defineConfig({
  build: {
    target: 'esnext',
    lib:{
      entry: resolve(__dirname, 'src/lib/index.ts'),
      name: "processing-ts",
      fileName: "index",
    },
  },
  base:"/processing-ts/",
  esbuild:{
    minifyIdentifiers:false
  },
  plugins:[externalizeDeps({
    deps:true,
    devDeps:false,
    except:["antlr4"],
  })]
});