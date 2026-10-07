// Zoom into a region of a case's reference and actual images, side by side (for looking at pixels).
// Usage: node tools/vt/zoom.ts <case> <x> <y> <w> <h> [scale] [--out dir]
//   reads tests/visual/refs/<case>.png and tests/visual/out/<case>/actual.png (or --out <dir>/<case>/actual.png)
//   writes <out>/<case>/zoom.png: left = Processing, right = processing-ts, `scale` times larger (default 8).
import path from "node:path";
import { parseArgs } from "node:util";
import { PNG } from "pngjs";
import { readPng, writePng } from "./image.ts";

const { values, positionals } = parseArgs({ allowPositionals: true, options: { out: { type: "string" } } });
const [name, xs, ys, ws, hs, ss] = positionals;
if (!name || hs === undefined) {
  console.error("usage: node tools/vt/zoom.ts <case> <x> <y> <w> <h> [scale] [--out dir]");
  process.exit(2);
}
const ROOT = path.resolve(import.meta.dirname, "../..");
const out = path.resolve(values.out ?? path.join(ROOT, "tests/visual/out"));
const [x0, y0, w, h, scale] = [xs, ys, ws, hs, ss ?? "8"].map(Number);
const ref = readPng(path.join(ROOT, "tests/visual/refs", `${name}.png`));
const act = readPng(path.join(out, name, "actual.png"));
const gap = 4;
const img = new PNG({ width: w * scale * 2 + gap, height: h * scale });
img.data.fill(255);
const put = (src: PNG, ox: number) => {
  for (let y = 0; y < h * scale; y++) {
    for (let x = 0; x < w * scale; x++) {
      const sx = x0 + Math.floor(x / scale), sy = y0 + Math.floor(y / scale);
      const di = (y * img.width + ox + x) * 4;
      if (sx >= src.width || sy >= src.height) continue;
      const si = (sy * src.width + sx) * 4;
      for (let k = 0; k < 4; k++) img.data[di + k] = src.data[si + k];
    }
  }
};
put(ref, 0);
put(act, w * scale + gap);
const file = path.join(out, name, "zoom.png");
writePng(file, img);
console.log(file);
