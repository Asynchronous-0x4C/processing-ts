// Types of the Vite plugin's sketch modules: add
//   /// <reference types="@async0x4c/processing-ts/client" />
// (or "types": ["@async0x4c/processing-ts/client"] in tsconfig.json) to import sketches in TypeScript.
declare module "*?pde" {
  const sketch: import("@async0x4c/processing-ts/runtime").PrecompiledSketch;
  export default sketch;
}
declare module "*.pde" {
  const sketch: import("@async0x4c/processing-ts/runtime").PrecompiledSketch;
  export default sketch;
}
