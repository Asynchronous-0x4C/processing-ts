// Pixel operations of PImage: blendColor()/blend() and filter(). Written from Processing's documented
// behaviour and fitted to its actual output (Processing 4.5.2: every blendColor() mode over a grid of
// colors and alphas, filter() on color sweeps and impulse images; cases image_blend / image_filter).
// Colors are ARGB ints.

const A = (c: number) => (c >>> 24) & 0xff;
const R = (c: number) => (c >> 16) & 0xff;
const G = (c: number) => (c >> 8) & 0xff;
const B = (c: number) => c & 0xff;
const argb = (a: number, r: number, g: number, b: number) => ((a << 24) | (r << 16) | (g << 8) | b) | 0;

// Processing's blend modes (PConstants).
export const REPLACE = 0, BLEND = 1, ADD = 2, SUBTRACT = 4, LIGHTEST = 8, DARKEST = 16, DIFFERENCE = 32, EXCLUSION = 64,
  MULTIPLY = 128, SCREEN = 256, OVERLAY = 512, HARD_LIGHT = 1024, SOFT_LIGHT = 2048, DODGE = 4096, BURN = 8192;

/** The blended value of one channel (d: destination, s: source), before mixing by the source alpha. */
function channel(mode: number, d: number, s: number): number {
  switch (mode) {
    case BLEND: return s;
    case LIGHTEST: return d > s ? d : s;
    case DARKEST: return d < s ? d : s;
    case DIFFERENCE: return d > s ? d - s : s - d;
    case EXCLUSION: return d + s - (((d + (d >= 127 ? 1 : 0)) * s) >> 7);
    case MULTIPLY: return ((d + 1) * s) >> 8;
    case SCREEN: return 255 - (((255 - d) * (256 - s)) >> 8);
    case OVERLAY: return d < 128 ? (d * (s + 1)) >> 7 : 255 - (((255 - d) * (256 - s) + 127) >> 7);
    case HARD_LIGHT: return s < 128 ? ((d + 1) * s) >> 7 : 255 - (((256 - d) * (255 - s) + 127) >> 7);
    // Approximation: Processing's integer arithmetic for SOFT_LIGHT is not reproduced exactly (STATUS R19).
    case SOFT_LIGHT: return Math.min(255, Math.floor((d * (d + Math.round((2 * s * (255 - d)) / 255))) / 255));
    case DODGE: {
      const v = ((d << 8) / (256 - s)) | 0;
      return v > 255 ? 255 : v;
    }
    case BURN: {
      const v = 255 - ((((255 - d) << 8) / (s + 1)) | 0);
      return v < 0 ? 0 : v;
    }
  }
  return s;
}

/**
 * blendColor(dst, src, mode). The result's alpha is min(dst alpha + src alpha, 255); each channel is the
 * mode's value mixed into the destination by the source alpha (with 255 → 256, so that an opaque source
 * gives the value exactly). As in Processing, SOFT_LIGHT and BURN take the source's blue channel for
 * all three channels.
 */
export function blendColor(dst: number, src: number, mode: number): number {
  if (mode === REPLACE) return src;
  const sa = A(src);
  const ap = sa + (sa >> 7);
  const alpha = Math.min(A(dst) + sa, 255);
  if (mode === ADD || mode === SUBTRACT) {
    const add = mode === ADD;
    const ch = (d: number, s: number) => {
      const v = add ? d + ((s * ap) >> 8) : d - ((s * ap) >> 8);
      return v < 0 ? 0 : v > 255 ? 255 : v;
    };
    return argb(alpha, ch(R(dst), R(src)), ch(G(dst), G(src)), ch(B(dst), B(src)));
  }
  const blueOnly = mode === SOFT_LIGHT || mode === BURN;
  const ch = (d: number, s: number) => {
    let x = channel(mode, d, blueOnly ? B(src) : s);
    x = x < 0 ? 0 : x > 255 ? 255 : x;
    return d + (((x - d) * ap) >> 8);
  };
  return argb(alpha, ch(R(dst), R(src)), ch(G(dst), G(src)), ch(B(dst), B(src)));
}

// --- filter() ---------------------------------------------------------------------------------------

export const THRESHOLD = 16, GRAY = 12, OPAQUE = 14, INVERT = 13, POSTERIZE = 15, BLUR = 11, ERODE = 17, DILATE = 18;

/** Luminance used by GRAY, ERODE and DILATE. */
const luminance = (c: number) => (77 * R(c) + 151 * G(c) + 28 * B(c)) >> 8;

/**
 * filter(kind[, param]) on ARGB pixels (width × height), in place. `format` is RGB (1), ARGB (2) or
 * ALPHA (4); returns the format afterwards (OPAQUE makes the image RGB).
 */
export function filterPixels(px: Int32Array, width: number, height: number, format: number, kind: number, param?: number): number {
  switch (kind) {
    case GRAY:
      for (let i = 0; i < px.length; i++) {
        const c = px[i], l = luminance(c);
        px[i] = (c & 0xff000000) | (l << 16) | (l << 8) | l;
      }
      return format;
    case INVERT:
      for (let i = 0; i < px.length; i++) px[i] ^= 0xffffff;
      return format;
    case OPAQUE:
      for (let i = 0; i < px.length; i++) px[i] |= 0xff000000;
      return 1;
    case THRESHOLD: {
      // white where the brightest channel reaches level × 255 (level 0.5 by default)
      const level = Math.trunc((param ?? 0.5) * 255);
      for (let i = 0; i < px.length; i++) {
        const c = px[i];
        const max = Math.max(R(c), G(c), B(c));
        px[i] = (c & 0xff000000) | (max < level ? 0 : 0xffffff);
      }
      return format;
    }
    case POSTERIZE: {
      const levels = Math.trunc(param ?? 2);
      if (levels < 2 || levels > 255) throw new RangeError("Levels must be between 2 and 255 for filter(POSTERIZE, levels)");
      const q = (v: number) => Math.trunc((((v * levels) >> 8) * 255) / (levels - 1));
      for (let i = 0; i < px.length; i++) {
        const c = px[i];
        px[i] = (c & 0xff000000) | (q(R(c)) << 16) | (q(G(c)) << 8) | q(B(c));
      }
      return format;
    }
    case ERODE:
    case DILATE:
      morph(px, width, height, kind === DILATE);
      return format;
    case BLUR:
      blur(px, width, height, format, param ?? 1);
      return format;
  }
  return format;
}

/** ERODE / DILATE: each pixel becomes the darkest / brightest (by luminance) of itself and its 4 neighbours. */
function morph(px: Int32Array, w: number, h: number, dilate: boolean) {
  const src = px.slice();
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      let best = src[i], bl = luminance(best);
      const visit = (j: number) => {
        const l = luminance(src[j]);
        if (dilate ? l > bl : l < bl) {
          best = src[j];
          bl = l;
        }
      };
      if (x > 0) visit(i - 1);
      if (x < w - 1) visit(i + 1);
      if (y > 0) visit(i - w);
      if (y < h - 1) visit(i + w);
      px[i] = best;
    }
  }
}

/**
 * BLUR: two passes (rows, then columns) of the kernel (R − |k|)² for |k| < R, R = trunc(3.5 × radius)
 * (1 to 248, and at most half the image's smaller side), each channel separately, dividing by the
 * weights inside the image (integer division). As in Processing, an image 1 pixel high becomes black
 * (transparent for ARGB), and R = 1 leaves the image as it is.
 */
function blur(px: Int32Array, w: number, h: number, format: number, radius: number) {
  if (h === 1) {
    px.fill(format === 2 ? 0 : 0xff000000 | 0);
    return;
  }
  let r = Math.trunc(radius * 3.5);
  r = r < 1 ? 1 : r > 248 ? 248 : r;
  r = Math.min(r, Math.trunc(Math.min(w, h) / 2));
  if (r <= 1) return;
  const size = 2 * r - 1;
  const kernel = new Int32Array(size);
  for (let k = 0; k < size; k++) {
    const t = r - Math.abs(k - (r - 1));
    kernel[k] = t * t;
  }
  const alpha = format === 2;
  const tmp = new Int32Array(px.length);
  // rows
  for (let y = 0; y < h; y++) {
    const row = y * w;
    for (let x = 0; x < w; x++) {
      let sa = 0, sr = 0, sg = 0, sb = 0, sum = 0;
      for (let k = 0; k < size; k++) {
        const xx = x + k - (r - 1);
        if (xx < 0 || xx >= w) continue;
        const c = px[row + xx], wk = kernel[k];
        sa += wk * A(c); sr += wk * R(c); sg += wk * G(c); sb += wk * B(c);
        sum += wk;
      }
      tmp[row + x] = argb(alpha ? (sa / sum) | 0 : 0xff, (sr / sum) | 0, (sg / sum) | 0, (sb / sum) | 0);
    }
  }
  // columns
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      let sa = 0, sr = 0, sg = 0, sb = 0, sum = 0;
      for (let k = 0; k < size; k++) {
        const yy = y + k - (r - 1);
        if (yy < 0 || yy >= h) continue;
        const c = tmp[yy * w + x], wk = kernel[k];
        sa += wk * A(c); sr += wk * R(c); sg += wk * G(c); sb += wk * B(c);
        sum += wk;
      }
      px[y * w + x] = argb(alpha ? (sa / sum) | 0 : 0xff, (sr / sum) | 0, (sg / sum) | 0, (sb / sum) | 0);
    }
  }
}
