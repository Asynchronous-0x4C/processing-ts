// PNG comparison and side-by-side composites.
import fs from "node:fs";
import pngjs from "pngjs";
import pixelmatch from "pixelmatch";

const { PNG } = pngjs;
type Png = InstanceType<typeof PNG>;

export type CompareResult = {
  width: number;
  height: number;
  sizeMismatch: boolean;
  diffPixels: number;
  /** diffPixels / (width * height) */
  diffRatio: number;
};

export function readPng(file: string): Png {
  return PNG.sync.read(fs.readFileSync(file));
}

export function writePng(file: string, png: Png) {
  fs.writeFileSync(file, PNG.sync.write(png));
}

export function pngFromDataUrl(dataUrl: string): Png {
  return PNG.sync.read(Buffer.from(dataUrl.slice(dataUrl.indexOf(",") + 1), "base64"));
}

/**
 * Compare two images with pixelmatch. Anti-aliased pixels are ignored (includeAA: false),
 * which absorbs most rasterizer differences between Java2D/OpenGL and the browser.
 * Images of different size are compared over the overlapping area and flagged.
 */
export function compare(ref: Png, actual: Png, threshold: number, diffOut?: string): CompareResult {
  const width = Math.min(ref.width, actual.width);
  const height = Math.min(ref.height, actual.height);
  const sizeMismatch = ref.width !== actual.width || ref.height !== actual.height;
  const a = crop(ref, width, height);
  const b = crop(actual, width, height);
  const diff = new PNG({ width, height });
  const diffPixels = pixelmatch(a.data, b.data, diff.data, width, height, { threshold, includeAA: false, alpha: 0.25 });
  if (diffOut) writePng(diffOut, diff);
  return { width, height, sizeMismatch, diffPixels, diffRatio: width * height === 0 ? 1 : diffPixels / (width * height) };
}

function crop(src: Png, width: number, height: number): Png {
  if (src.width === width && src.height === height) return src;
  const out = new PNG({ width, height });
  PNG.bitblt(src, out, 0, 0, width, height, 0, 0);
  return out;
}

/**
 * Lay out panels left to right on a dark background with a colored strip above each one
 * (blue = Processing reference, green = processing-ts, red = diff), so a single image can be
 * inspected at a glance.
 */
export function composite(panels: (Png | null)[], file: string) {
  const colors: [number, number, number][] = [
    [66, 133, 244],
    [52, 168, 83],
    [234, 67, 53],
  ];
  const gap = 8;
  const strip = 6;
  const present = panels.map((p) => p ?? new PNG({ width: 64, height: 64 }));
  const width = present.reduce((s, p) => s + p.width, 0) + gap * (present.length + 1);
  const height = Math.max(...present.map((p) => p.height)) + strip + gap * 2;
  const out = new PNG({ width, height });
  for (let i = 0; i < out.data.length; i += 4) {
    out.data[i] = 40;
    out.data[i + 1] = 40;
    out.data[i + 2] = 40;
    out.data[i + 3] = 255;
  }
  let x = gap;
  present.forEach((p, idx) => {
    const [r, g, b] = colors[idx % colors.length];
    for (let yy = gap; yy < gap + strip - 2; yy++) {
      for (let xx = x; xx < x + p.width; xx++) {
        const o = (yy * width + xx) * 4;
        out.data[o] = r;
        out.data[o + 1] = g;
        out.data[o + 2] = b;
      }
    }
    if (panels[idx]) PNG.bitblt(p, out, 0, 0, p.width, p.height, x, gap + strip);
    x += p.width + gap;
  });
  writePng(file, out);
}
