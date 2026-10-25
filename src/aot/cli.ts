#!/usr/bin/env node
// processing-ts command line (ROADMAP P4-1).
//   processing-ts build <sketchDir> [--out dir] [--sw] [--runtime url] [--sketch-only] [--title text]
//   processing-ts check <sketchDir>
import path from "node:path";
import { parseArgs } from "node:util";
import { COMPILER_VERSION } from "../compiler/index.ts";
import { buildSketch } from "./build.ts";
import { compileSketchFolder, readSketchFolder } from "./sketchFolder.ts";

const USAGE = `processing-ts ${COMPILER_VERSION}

  processing-ts build <sketchDir>   Compile a sketch folder into a static web page
      --out <dir>        output folder (default: <sketchDir>/web-export; replaced)
      --sw               add a Service Worker that caches every file (works offline)
      --runtime <url>    load runtime.js from this folder URL instead of copying the runtime
      --sketch-only      write only sketch.js (and sketch.js.map), for pages with their own runtime
      --title <text>     page title (default: the sketch name)
  processing-ts check <sketchDir>   Report compile errors (exit code 1 when there are any)

<sketchDir> is a Processing sketch folder (main tab <folder>.pde, other tabs, data/) or its main .pde file.`;

function main(argv: string[]): Promise<number> | number {
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      out: { type: "string" },
      sw: { type: "boolean", default: false },
      runtime: { type: "string" },
      "sketch-only": { type: "boolean", default: false },
      title: { type: "string" },
      help: { type: "boolean", short: "h", default: false },
      version: { type: "boolean", short: "v", default: false },
    },
  });
  if (values.version) {
    console.log(COMPILER_VERSION);
    return 0;
  }
  const [command, dir] = positionals;
  if (values.help || !command || !dir || positionals.length > 2) {
    console.log(USAGE);
    return values.help ? 0 : 2;
  }
  if (command === "check") {
    const folder = readSketchFolder(dir);
    const { errors } = compileSketchFolder(folder);
    for (const e of errors) console.error(e);
    if (!errors.length) console.log(`${folder.name}: no errors (${folder.tabs.length} tab${folder.tabs.length === 1 ? "" : "s"})`);
    return errors.length ? 1 : 0;
  }
  if (command === "build") {
    return buildSketch(dir, { out: values.out, sw: values.sw, runtime: values.runtime, sketchOnly: values["sketch-only"], title: values.title }).then((r) => {
      for (const e of r.errors) console.error(e);
      if (!r.ok) return 1;
      console.log(`${r.name}: ${r.files.length} files in ${path.relative(process.cwd(), r.out) || "."} (compiled in ${r.compileMs.toFixed(0)}ms)`);
      return 0;
    });
  }
  console.log(USAGE);
  return 2;
}

try {
  process.exitCode = await main(process.argv.slice(2));
} catch (e) {
  console.error(e instanceof Error ? e.message : e);
  process.exitCode = 1;
}
