// processing-ts/compiler: .pde → JavaScript (parse, type check, code generation, source maps). DOM-free:
// runs in browsers, workers and Node.
export { compileSketch, analyzeSketch, formatDiagnostic, COMPILER_VERSION, type CompileResult, type Diagnostic, type SourceMapV3 } from "../compiler/index.ts";
export { sketchModule, type SketchModuleOptions } from "../compiler/module.ts";
