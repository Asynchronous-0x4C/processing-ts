// URLs of the files the runtime loads itself: the default font and the worker script (thread "worker").
// Relative to this module: in the sources src/lib/runtime/fonts/ and worker/entry.ts; in the built copies
// (dist/, dist/standalone/) fonts/ and worker.js next to the chunk. The builds rewrite these to literal
// `new URL("./…", import.meta.url)` (vite.config.ts "literal-asset-urls", src/aot/standalone.ts), the form
// that bundlers taking the package in copy as assets; here they are not literal, or Vite's library build
// would inline the font as base64 (+288 KB) and bundle the worker script.

const FONT = "ProcessingSansPro-Regular.ttf";
const WORKER = "worker/" + "entry.ts";

/** The bundled default font (SIL OFL 1.1). */
export function defaultFontFileURL(): URL {
  return new URL("./fonts/" + FONT, import.meta.url);
}

/** The worker script of the Worker execution mode. */
export function workerScriptURL(): URL {
  return new URL("./" + WORKER, import.meta.url);
}
