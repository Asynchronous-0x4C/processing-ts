# Measurements: parser and rendering library candidates for processing-ts

Measured on 2026-10-04: Windows 11, Node v25.8.2, npm 11.11.1, esbuild 0.28.2.
Scripts are in this directory. To reproduce, run `npm install` here first, then run the scripts in this order:
1. `node size.mjs` for Task 1.
2. `node build-antlr.mjs`.
3. `node gen-inputs.mjs`.
4. `node bench.mjs`.
5. `node antlr-sll-check.mjs`.
6. `node constructs.mjs`.

Raw JSON is saved in `size-results.json`, `bench-results.json`, `antlr-sll-check.json` and `constructs-results.json`. Bundles and metafiles go to `out/`.

## Installed versions (scratch dir, `npm install --save-exact`, latest at time of run)

| Package | Version | | Package | Version |
|---|---|---|---|---|
| antlr4 | 4.13.2 | | pixi.js | 8.22.0 |
| web-tree-sitter | 0.27.0 | | p5 | 2.3.4 |
| tree-sitter-java | 0.23.5 | | three | 0.186.1 |
| tree-sitter-wasms | 0.1.13 | | twgl.js | 7.0.0 |
| @vscode/tree-sitter-wasm | 0.3.1 | | regl | 2.1.1 |
| @lezer/java | 1.1.4 | | gl-matrix | 3.4.4 |
| @lezer/lr | 1.4.10 | | earcut | 3.2.4 |
| @lezer/common | 1.5.3 | | libtess | 1.2.2 |
| java-parser | 3.0.1 | | opentype.js | 2.0.0 |
| @codemirror/view | 6.43.13 | | fast-xml-parser | 5.11.2 |
| @codemirror/state | 6.7.6 | | papaparse | 5.7.0 |
| @codemirror/language | 6.12.4 | | esbuild | 0.28.2 |
| @codemirror/lang-java | 6.0.2 | | | |
| @codemirror/commands | 6.11.1 | | | |

The project's own lockfile (installed with `npm ci` in the project) pins these versions: antlr4 4.13.2, pixi.js **8.9.1**, p5 **2.0.3** and vite 6.3.5.

**Project source state.** All project-dependent measurements were built from commit `587ba38` with a clean tree:
- the vite build at 10:44,
- the `antlr4-project-parser` and `project-lib-full` bundles at 10:49,
- the ANTLR Node bundle at 10:51:48 (it depends only on the parser files, which are unchanged).

Between 10:51 and 11:02, someone else started uncommitted changes in the project: a visual-test harness (`tools/vt`, `tests/visual`, playwright-core and pixelmatch in package.json) plus edits to `SketchManager.ts` and `DefaultRunner.ts`. Re-running `size.mjs` now would pick up those `src/lib` edits in the `project-lib-full` row.

## Task 1: Bundle sizes

Method:
- **Bundler:** `esbuild --bundle --minify --format=esm --platform=browser` (JS API, same flags), with no code splitting unless the row says otherwise.
- **Compression:** gzip uses zlib level 9. Brotli uses quality 11.
- **Units:** KiB = 1024 bytes.
- **Entry files:** they are in `entries/`. Each one imports and *uses* only what a real app would, so tree-shaking applies.

### Parsing

| Bundle (entry) | min KiB | gzip KiB | brotli KiB | min bytes | gzip bytes |
|---|---:|---:|---:|---:|---:|
| antlr4 runtime alone (the 17 classes the generated parser and Control.ts import) | 111.3 | 29.3 | 25.7 | 114,012 | 29,977 |
| antlr4 + project `ProcessingLexer.ts` + `ProcessingParser.ts` (parse a string) | **341.6** | **68.7** | **52.5** | 349,786 | 70,349 |
|  ↳ split: generated lexer+parser = 230.1 KiB, antlr4 runtime = 111.4 KiB (minified bytes in output) | | | | | |
| web-tree-sitter JS glue (bundled; wasm loaded separately) | 75.3 | 19.7 | 17.2 | 77,128 | 20,139 |
| @lezer/java + @lezer/lr + @lezer/common (+@lezer/highlight, pulled in by @lezer/java) | 88.6 | 32.3 | 27.8 | 90,754 | 33,051 |
| java-parser 3.0.1 (Chevrotain 86 KiB, java-parser 65 KiB, lodash-es 30 KiB, other 33 KiB) | 216.3 | 63.5 | 51.7 | 221,445 | 65,025 |

The antlr4 runtime does not tree-shake. Its `browser` entry `dist/antlr4.web.mjs` is a single prebuilt, minified webpack bundle of 113.0 KiB, which is 29.4 KiB gzip and 25.6 KiB brotli.

**WASM files.** The npm package `tree-sitter-java@0.23.5` **does ship a prebuilt `tree-sitter-java.wasm`**. The copy in `@vscode/tree-sitter-wasm` is byte-identical in size.

| File | raw KiB | gzip KiB | brotli KiB | raw bytes | gzip bytes |
|---|---:|---:|---:|---:|---:|
| `web-tree-sitter.wasm` (core runtime, web-tree-sitter 0.27.0) | 204.7 | 81.3 | 66.5 | 209,613 | 83,230 |
| `tree-sitter-java.wasm` (npm tree-sitter-java 0.23.5) | 404.9 | 51.4 | 36.3 | 414,641 | 52,670 |
| `tree-sitter-java.wasm` (npm tree-sitter-wasms 0.1.13) | 420.2 | 55.3 | 40.3 | 430,239 | 56,600 |
| `tree-sitter-java.wasm` (npm @vscode/tree-sitter-wasm 0.3.1) | 404.9 | 51.4 | 36.3 | 414,641 | 52,670 |
| `tree-sitter.wasm` (@vscode/tree-sitter-wasm core; alternative runtime) | 201.4 | 79.2 | 64.6 | 206,218 | 81,112 |

**Total tree-sitter download** (JS glue + core wasm + java wasm) is 685 KiB raw (701,382 B), **152.4 KiB gzip** (156,039 B) or **119.9 KiB brotli** (122,819 B).

### Project's current build

`npm run build` runs `vite build && tsc`. I ran only `vite build`, with `--outDir` pointed at this scratch directory so that the tracked `dist/` was not touched. It **succeeded** in 0.7 s. I skipped `tsc` because it only emits `.d.ts` files into the project.

The vite config externalizes `pixi.js` and `p5`, so the build contains antlr4, the generated parser, the transpiler and the runtime. The ES build is not identifier-minified (`esbuild.minifyIdentifiers: false`), and Vite lib-mode ES output keeps whitespace.

| File | raw KiB | gzip KiB | brotli KiB | raw bytes | gzip bytes |
|---|---:|---:|---:|---:|---:|
| fresh `vite build` → `index.js` (ES) | 710.7 | 102.9 | 78.1 | 727,807 | 105,383 |
| fresh `vite build` → `index.umd.cjs` (UMD, minified) | 465.0 | 91.2 | 71.2 | 476,174 | 93,434 |
| committed `dist/index.js` | 748.0 | 103.5 | 78.7 | 765,981 | 106,013 |
| committed `dist/index.umd.cjs` | 465.0 | 91.3 | 71.2 | 476,210 | 93,451 |
| esbuild `src/lib/index.ts` with **all** deps bundled, incl. pixi.js 8.9.1 | 896.8 | 228.5 | 183.6 | 918,290 | 234,004 |
|  ↳ split: pixi.js 469.8 KiB, project src (incl. generated parser) 293.6 KiB, antlr4 111.7 KiB, rest ~21 KiB | | | | | |

### Rendering / graphics

| Bundle (entry) | min KiB | gzip KiB | brotli KiB | min bytes | gzip bytes |
|---|---:|---:|---:|---:|---:|
| pixi.js 8.22.0 subset: Application, Graphics, Text, Texture, Sprite, RenderTexture, Matrix | **551.2** | **161.1** | 132.2 | 564,387 | 164,951 |
| same subset, pixi.js 8.9.1 (project lockfile version) | 490.2 | 141.1 | 116.7 | 502,012 | 144,496 |
| pixi.js 8.22.0 full (`import * as PIXI`) | 900.4 | 259.9 | 207.7 | 922,027 | 266,161 |
| pixi subset with `--splitting`: entry plus its *static* import closure (16 files, each compressed separately) | 554.3 | 168.2 | 150.3 | 567,595 | 172,280 |
| pixi subset with `--splitting`: all 23 chunks | 555.8 | 169.2 | 151.1 | 569,126 | 173,258 |
| p5 2.3.4 `lib/p5.min.js` (prebuilt UMD) | **967.4** | **279.3** | 228.3 | 990,638 | 285,996 |
| p5 2.3.4 `lib/p5.esm.min.js` (prebuilt ESM) | 1076.2 | 306.5 | 250.4 | 1,102,035 | 313,859 |
| p5 2.0.3 `lib/p5.min.js` (project lockfile version) | 878.3 | 253.5 | 208.7 | 899,417 | 259,541 |
| p5 2.3.4 via esbuild (`import p5 from 'p5'`, i.e. `dist/app.js`) | 1567.1 | 413.2 | 335.8 | 1,604,713 | 423,139 |
|  ↳ split: p5 735 KiB, zod 443 KiB, acorn 119 KiB, pako 46 KiB, colorjs.io 41 KiB, i18next 40 KiB, escodegen 32 KiB, … | | | | | |
| three 0.186.1 subset: WebGLRenderer, Scene, PerspectiveCamera, Mesh, BufferGeometry(+BufferAttribute), ShaderMaterial | 516.9 | 129.7 | 107.0 | 529,342 | 132,764 |
| twgl.js 7.0.0 full (`import *`) | 78.9 | 24.3 | 20.4 | 80,780 | 24,919 |
| twgl.js typical (createProgramInfo, createBufferInfoFromArrays, setBuffersAndAttributes, setUniforms, drawBufferInfo, createTexture, m4) | 62.1 | 18.9 | 15.8 | 63,603 | 19,374 |
| regl 2.1.1 (monolithic) | 120.4 | 40.6 | 35.5 | 123,338 | 41,538 |
| gl-matrix 3.4.4 full (`import *`) | 52.6 | 13.4 | 10.6 | 53,910 | 13,720 |
| gl-matrix typical (mat4 + vec3) | 21.8 | 6.9 | 5.4 | 22,289 | 7,071 |
| earcut 3.2.4 | 7.1 | 3.1 | 2.7 | 7,267 | 3,128 |
| libtess 1.2.2 | 15.8 | 6.3 | 5.5 | 16,135 | 6,451 |
| opentype.js 2.0.0 (parse + getPath + getAdvanceWidth) | 240.3 | 66.7 | 55.7 | 246,097 | 68,264 |
| fast-xml-parser 5.11.2 (XMLParser) | 62.1 | 20.8 | 18.3 | 63,557 | 21,318 |
| papaparse 5.7.0 (Papa.parse) | 19.1 | 7.1 | 6.5 | 19,585 | 7,314 |

### Editor

| Bundle (entry) | min KiB | gzip KiB | brotli KiB | min bytes | gzip bytes |
|---|---:|---:|---:|---:|---:|
| CodeMirror 6: EditorView + lineNumbers + highlightActiveLine + history + indentOnInput + bracketMatching + defaultHighlightStyle + default/history keymap + `java()` | 341.3 | 114.1 | 98.1 | 349,505 | 116,856 |
|  ↳ split: @codemirror/view 156 KiB, state 46 KiB, @lezer/java 38.5 KiB, @lezer/lr 25.6 KiB, commands 22.7 KiB, @lezer/common 19.9 KiB, language 19.0 KiB, @lezer/highlight 6.9 KiB | | | | | |

CodeMirror's `java()` already bundles @lezer/java, @lezer/lr and @lezer/common. If the app ships CodeMirror anyway, using Lezer as the transpiler parser adds about 0 KiB of new parser code.

## Task 2: Parse speed in Node

### Inputs (`gen-inputs.mjs`)

- **sample.pde** is `public/samples/Games/simple_shooter_game/SimpleShooterGame.pde`, unchanged: 199 lines, 4,106 B.
- **sample-wrapped.java** is the same file wrapped as `class Sketch { … }`.
- **synthetic.java** is 5,013 lines, 131,127 B of plain Java at Java 8 feature level. It repeats 3 templates 82 times:
  - Template A: a class with fields, a constructor, for/while/do loops, classic switch, casts and arrays.
  - Template B: a generic interface plus an implementing class with `java.util` collections, varargs, a lambda, a method reference, an anonymous class and a generic method with `? extends`.
  - Template C: an enum, an abstract class with a static nested class, try/multi-catch/finally, try-with-resources, labeled break/continue, bit operations and classic instanceof.
- **Why there are no `default` methods:** the first version of the synthetic file had a Java 8 interface `default` method. @lezer/java 1.1.4 produced 28 errors on it, one per template-B instance. I replaced it with an abstract method so that **every parser accepts the final synthetic file with 0 errors**.

### Method (`bench.mjs` → `bench-one.mjs`, adapters in `parsers.mjs`)

- **Process isolation:** each (parser, input) pair runs in **3 fresh Node processes**.
  - **cold** is the first parse in a fresh process, after the module has loaded. The table shows the median over the 3 processes.
  - **warm** comes from 20 further parses per process, pooled (60 samples). The table shows the median and the minimum.
  - Exception: ANTLR LL on synthetic.java takes about 8 s per parse, so it got 1 process × 5 warm runs.
- **load** is the module import plus any init, timed separately from cold.
- **tree walk** is a separate measurement that visits every node of the finished tree and reads its type id. This is the minimum a transpiler pass costs. It uses `TreeCursor` for tree-sitter and lezer, children arrays for ANTLR and java-parser, and is timed apart from parsing.
- **How each parser was set up:**
  - **ANTLR:** the project's generated `.ts` lexer and parser are bundled for Node with esbuild (`build-antlr.mjs`) and constructed exactly as in `src/lib/transpiler/Control.ts`. The one change is that the default ConsoleErrorListener is replaced by a collecting listener.
  - **tree-sitter:** loads `tree-sitter-java.wasm` from the `tree-sitter-java` npm package.
  - **java-parser:** it throws on the first error, so it never reports more than 1 error and gives no partial tree.
- **Variance:** the whole suite was run **twice**, about 5 minutes apart, and both runs are shown.
  - The machine had about 20% background CPU load during run 2. Run 2 is up to about 40% slower in absolute terms (a few small cases were about 10% faster), with identical ordering, node counts and error counts.
  - Treat absolute numbers as ±30%. The ratios between parsers are stable.
  - These are Node / V8 numbers. Browser V8 should behave similarly, but I did not measure it there.

### Results

| Parser | Input | load (ms) | cold 1st parse (ms) run1 / run2 | warm median (ms) run1 / run2 | warm min (ms) | tree walk (ms) | nodes | errors |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| ANTLR4 project grammar, `processingSketch`, LL (as Control.ts) | sample.pde | 14.9 | 207 / 253 | **16.5 / 19.8** | 12.5 | 0.15 | 2585 | 0 |
| ANTLR4 project grammar, `processingSketch`, LL (as Control.ts) | sample-wrapped.java | 13.9 | 634 / 776 | **277 / 344** | 257 | 0.16 | 2593 | 0 |
| ANTLR4 project grammar, `processingSketch`, LL (as Control.ts) | synthetic.java | 14.3 | 8337 / 8975 | **7956 / 8507** | 7793 | 5.03 | 86940 | 0 |
| ANTLR4 project grammar, `processingSketch`, SLL | sample.pde | 14.4 | 186 / 212 | **1.01 / 1.13** | 0.65 | 0.07 | 2585 | 0 |
| ANTLR4 project grammar, `processingSketch`, SLL | sample-wrapped.java | 14.9 | 340 / 387 | **1.07 / 1.13** | 0.62 | 0.08 | 2593 | 0 |
| ANTLR4 project grammar, `processingSketch`, SLL | synthetic.java | 14.6 | 475 / 549 | **29.2 / 33.5** | 16.9 | 3.27 | 86940 | 0 |
| ANTLR4 project grammar, `compilationUnit`, LL | sample-wrapped.java | 14.6 | 214 / 268 | **16.8 / 23.8** | 12.6 | 0.15 | 2591 | 0 |
| ANTLR4 project grammar, `compilationUnit`, LL | synthetic.java | 14.4 | 578 / 660 | **361 / 423** | 336 | 4.06 | 86830 | 0 |
| web-tree-sitter 0.27 + tree-sitter-java 0.23.5 | sample.pde | 12.4 | 6.14 / 6.45 | **0.94 / 0.85** | 0.55 | 0.36 | 1585 | 1 |
| web-tree-sitter 0.27 + tree-sitter-java 0.23.5 | sample-wrapped.java | 11.4 | 6.52 / 6.86 | **0.74 / 0.81** | 0.56 | 0.34 | 1591 | 1 |
| web-tree-sitter 0.27 + tree-sitter-java 0.23.5 | synthetic.java | 11.6 | 37.9 / 37.7 | **17.9 / 19.5** | 16.4 | 8.29 | 55788 | 0 |
| @lezer/java 1.1.4 | sample.pde | 9.72 | 7.97 / 8.55 | **1.23 / 1.26** | 0.73 | 0.04 | 1611 | 8 |
| @lezer/java 1.1.4 | sample-wrapped.java | 9.66 | 8.36 / 8.96 | **1.17 / 1.18** | 0.79 | 0.05 | 1605 | 2 |
| @lezer/java 1.1.4 | synthetic.java | 10.1 | 40.9 / 44.4 | **26.6 / 27.9** | 22.5 | 0.86 | 53831 | 0 |
| java-parser 3.0.1 | sample.pde | 309 | 26.5 / 30.6 | **2.70 / 3.69** | 1.79 | 0.38 | 4380 | 0 |
| java-parser 3.0.1 | sample-wrapped.java | 326 | 26.6 / 35.0 | **2.87 / 4.05** | 1.85 | 0.37 | 4398 | 0 |
| java-parser 3.0.1 | synthetic.java | 330 | 147 / 152 | **84.0 / 84.3** | 64.8 | 12.1 | 132956 | 0 |

**One-time init costs (run 1, median of 3 processes):**

| Parser | Phase | Time |
|---|---|---:|
| tree-sitter | ESM import | 3.3 ms |
| tree-sitter | `Parser.init()` (compile and instantiate `web-tree-sitter.wasm`) | 4.9 ms |
| tree-sitter | `Language.load(tree-sitter-java.wasm)` from local disk | 3.4 ms |
| tree-sitter | `new Parser()` + `setLanguage` | 0.3 ms |
| tree-sitter | **total** (network fetch of the 152 KiB-gzip assets not included) | **≈ 12 ms** |
| java-parser | import, including Chevrotain `performSelfAnalysis()` at module load | **309 ms** (run 2: 337–453 ms) |
| ANTLR | import of the 663 KB unminified Node bundle | 14–15 ms |
| lezer | import | 10 ms |

**Where ANTLR's cold cost goes** (`antlr-cold-breakdown.mjs`, run after the main suite while the machine was busier):
- `parse("")` in a fresh process forces lazy ATN deserialization of the lexer and parser, with almost no prediction work. It takes **11–26 ms**.
- The first real parse of sample.pde then takes 235–540 ms. The 2nd parse takes 4–20 ms with SLL and 32–41 ms with LL.
- So the cold penalty is almost entirely ANTLR building its DFA cache plus V8 JIT warm-up. Loading the serialized ATN is a small part of it.

**SLL vs LL check** (`antlr-sll-check.mjs`): SLL gives a **byte-identical `toStringTree`** to LL on all 3 inputs, with 0 errors in both modes.

| Input | Mode chosen by `processingSketch` (LL and SLL) | Identical tree |
|---|---|---|
| sample.pde | `activeProcessingSketch` | yes |
| sample-wrapped.java | **`staticProcessingSketch`** | yes |
| synthetic.java | **`staticProcessingSketch`** | yes |

For class-only files, the static, java and active alternatives are all viable all the way to EOF. ANTLR's LL prediction therefore runs full-context lookahead and settles on the first alternative, `static`, rather than `javaProcessingSketch`. That ambiguity is why `processingSketch`+LL costs 8 s on 5k lines, against 0.36 s for `compilationUnit`+LL and 0.03 s for `processingSketch`+SLL.

### Errors reported on the Processing sample

| Parser | sample.pde (raw Processing) | sample-wrapped.java (`class Sketch { … }`) |
|---|---|---|
| project ANTLR | 0 | 0 |
| tree-sitter-java | **1**: ERROR node at L170:18 on `int` in `coolingTime = int(random(60));`. Top-level fields **and top-level methods are accepted**, because tree-sitter-java's `program` = `repeat(choice(statement, method_declaration))`. | **1**: the same `int(` at L171 |
| @lezer/java | **8** error nodes: 3 at L17 `void setup(){`, 3 at L26 `void draw(){` (top-level *methods* are rejected; top-level fields and classes are accepted), 2 at L170 `int(` | **2**: both at L171 `int(` |
| java-parser | **0**. Top-level methods and fields parse as Java 25 *compact source file* members (`typeDeclaration > methodDeclaration / fieldDeclaration`). `int(random(60))` is accepted by a lenient rule: `primaryPrefix` = primitive type `int` + `methodInvocationSuffix`. | 0 |

### Processing-specific and modern-Java constructs (`constructs.mjs`)

Each snippet is wrapped in `class Sketch { … }`, or in `class Sketch { void m() { … } }` for statements. "accepts" means 0 error nodes. The last column, the project's ANTLR grammar, is included for reference.

| Construct | tree-sitter-java 0.23.5 | @lezer/java 1.1.4 | java-parser 3.0.1 | project ANTLR grammar |
|---|---|---|---|---|
| `color c = #FF8800;` | **rejects** (ERROR at `#`) | **rejects** (error at `#`) | **rejects** (lexer error "unexpected character `#`", throws) | accepts (`hexColorLiteral`) |
| `color c = color(255);` | accepts (`color` as a type identifier + method call) | accepts | accepts | accepts (`colorPrimitiveType`, `functionWithPrimitiveTypeName`) |
| `int x = int(3.5);` | **rejects** (ERROR at `int`) | **rejects** (4 error nodes) | accepts (lenient: prefix `int` + invocation suffix) | accepts (`functionWithPrimitiveTypeName`) |
| `float f = 1.0;` | accepts | accepts | accepts | accepts (syntactically valid; only a type error in Java) |
| text block `"""\n abc\n """` | accepts (`string_literal` / `multiline_string_fragment`) | accepts (`TextBlock`) | accepts (`TextBlock`) | accepts (`multilineStringLiteral`) |
| `Runnable r = () -> {};` | accepts (`lambda_expression`) | accepts (`LambdaExpression`) | accepts | accepts (`lambdaExpression`) |
| `var x = 1;` (in method) | accepts (`var` as `type_identifier`) | accepts (`var` node) | accepts (`Var` token) | accepts (`VAR` token in `typeType`) |
| `int y = switch(x){ case 1 -> 2; default -> 3; };` | accepts (`switch_expression`) | **rejects** (5 errors) | accepts (reuses `switchStatement` with `switchRule` in expression position) | **rejects** ("no viable alternative", L4:12) |
| `record P(int x){}` (class member) | accepts (`record_declaration`) | accepts **but misparsed** as a method `P` returning type `record` | accepts **but misparsed** as a method returning `record`. A *top-level* `record` does parse as `recordDeclaration`. | accepts **but misparsed** as a method returning `record` |
| `if (o instanceof String s) {}` | accepts (`instanceof_expression` with binding) | **rejects** (error at `s`) | accepts (`typePattern`) | **rejects** ("no viable alternative", L4:28) |
| *extra:* interface `default` method (Java 8) | accepts | **rejects** | accepts | accepts |
| *extra:* `fill(#FF8800);` (in method) | **rejects** | **rejects** | **rejects** (lexer, throws) | accepts |

Summary of which constructs each stock parser fails:
- **tree-sitter-java:** fails only on the Processing syntax `#hex` and `int(...)`. It handles every modern Java construct tested.
- **@lezer/java 1.1.4:** fails on Processing syntax and on switch expressions, pattern instanceof, records (silently misparsed as a method) and Java 8 `default` methods.
- **java-parser:** fails only on `#hex`, and it accepts `int(...)`. However, it gives up on the first error with no tree, and it silently misparses nested records.

## Observations

1. **The project's current ANTLR setup has a pathological, input-dependent slowdown, and it comes from the grammar entry rule and prediction mode rather than from ANTLR itself.**
   - `processingSketch` with the default LL mode takes 16 ms warm on the 199-line sample, **277 ms** once the same code is wrapped in a class, and **about 8 s** on 5k lines.
   - Switching the same generated parser to `PredictionMode.SLL` gives byte-identical trees on all 3 inputs and is **16–270× faster**: 1.0 ms, 1.1 ms and 29 ms respectively.
   - This is a one-line change. The usual safe form is two-stage: SLL with BailErrorStrategy, then a fallback to LL on error.
2. **With SLL, ANTLR warm parsing is competitive with tree-sitter and lezer** (29 ms vs 18 ms and 27 ms on 5k lines). Its remaining weakness is **cold start**: 186–550 ms for the first parse per page load, which is DFA warm-up plus JIT. tree-sitter's first parse is about 6–38 ms after about 12 ms of init, and lezer's is about 8–41 ms.
3. **Bundle cost of the parser options:**

   | Option | gzip | brotli |
   |---|---:|---:|
   | antlr4 + generated parser | 68.7 KiB | 52.5 KiB |
   | tree-sitter (JS glue + 2 wasm files) | 152 KiB | 120 KiB |
   | @lezer/java | 32.3 KiB | 27.8 KiB |
   | java-parser | 63.5 KiB | 51.7 KiB |

   If CodeMirror is used for the editor, Lezer is already included, so it is effectively free. The generated ANTLR parser and lexer are 230 KiB minified, but their serialized-ATN arrays compress very well under brotli.
4. **Tree access cost differs from parse cost.** A full tree walk on 5k lines costs 8.3 ms through tree-sitter's wasm-boundary `TreeCursor`, against 0.9 ms for lezer and 3–5 ms for ANTLR. A transpiler that reads node text and fields will pay more than this on tree-sitter. Parse plus walk on 5k lines (run 1) comes to **tree-sitter 26 ms, lezer 27 ms, ANTLR-SLL 32 ms, java-parser 96 ms**. That is much closer than parse alone (18 / 27 / 29 / 84 ms).
5. **No stock Java parser accepts Processing source unmodified.**
   - All three reject `#RRGGBB` color literals at the lexer or token level.
   - tree-sitter and lezer also reject `int(...)`, `float(...)` and similar conversion calls. java-parser accepts them only by accident of a lenient rule.
   - Top-level methods work in tree-sitter-java and java-parser, but not in lezer.
   - A stock-parser route therefore needs a pre-pass (for example rewriting `#hex` → `0xFFhex` and `int(` → a function call) or a forked grammar.
6. **Modern-Java coverage:**
   - tree-sitter-java is the most complete stock grammar tested: switch expressions, pattern instanceof, records and text blocks all work.
   - @lezer/java 1.1.4 lacks switch expressions, pattern instanceof, records and even interface `default` methods.
   - The project's ANTLR grammar lacks switch expressions and pattern instanceof, and misparses records as methods.
7. **java-parser has a 300–450 ms module-load cost** from Chevrotain self-analysis, and it has no error recovery: it throws on the first error with no partial tree. That makes it a poor fit for live-editing feedback even though its warm parse speed is fine (2.7 ms on the sample, 84 ms on 5k lines).
8. **Renderer bundle sizes vary widely:**

   | Option | gzip | Notes |
   |---|---:|---|
   | pixi.js v8, small subset | 161 KiB | 141 KiB at the project's 8.9.1. Code splitting does not help: the static import closure from the `pixi.js` barrel is already about 99% of the bundle. |
   | p5 2.3.4 | 279 KiB | prebuilt `p5.min.js`. Bundling its ESM `dist/app.js` with esbuild is worse, at 413 KiB, because it pulls in zod (443 KiB minified), acorn and escodegen. |
   | three, comparable subset | 130 KiB | |
   | twgl.js typical | 19 KiB | |
   | regl | 41 KiB | |
   | gl-matrix typical | 7 KiB | |

   A thin WebGL layer such as twgl plus gl-matrix plus earcut or libtess comes to about 30 KiB gzip, against about 160 KiB for pixi.
9. **The project's current shipped library:** a fresh `vite build` succeeds and produces 711 KiB raw / 103 KiB gzip for `index.js` (ES, not identifier-minified) and 465 KiB / 91 KiB for `index.umd.cjs`. Both have pixi and p5 external. Bundling `src/lib/index.ts` with all dependencies, pixi included, gives 897 KiB minified / 229 KiB gzip / 184 KiB brotli.

### Not measured, and why

- Browser-side timings (Chrome/Firefox): only Node was available, and the task asked for Node.
- tree-sitter's network fetch and streaming-compile time for the wasm files in a real page.
- Memory use: `heapMB` is recorded in the raw `bench-one` output only for the JS heap. It does not cover wasm linear memory, so it is not comparable across parsers and is not reported.
- `npm run build`'s `tsc` step: it only emits `.d.ts` files into the project's `dist/types`, and I skipped it to avoid modifying the project.
