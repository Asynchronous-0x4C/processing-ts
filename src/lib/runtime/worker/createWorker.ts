// The sketch's worker script: worker/entry.ts in the sources, the self-contained worker.js in the builds
// (assetURLs.ts).
import { workerScriptURL } from "../assetURLs";

/** Start the sketch's worker (from `url` when given: SketchSettings.workerURL). */
export function createSketchWorker(url?: string | URL): Worker {
  return new Worker(url ?? workerScriptURL(), { type: "module" });
}
