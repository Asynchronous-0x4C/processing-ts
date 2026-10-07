// Processing's noise(): value noise on a table of 4096 random floats, smoothed with a cosine curve and
// summed over octaves (noiseDetail). Written from the documented behaviour and checked value-for-value
// against Processing 4.5.2 (case noise_values); every step is float arithmetic as in Java.
import { Random } from "../../../runtime/lang/util.ts";

const f = Math.fround;

const SIZE = 4095;
/** Offsets of the next y / z lattice row in the table (16 and 256). */
const Y_SHIFT = 4;
const Z_SHIFT = 8;
const Y_STEP = 1 << Y_SHIFT;
const Z_STEP = 1 << Z_SHIFT;

/** The cosine table at half-degree steps (Processing's cosLUT: 720 floats). */
const COS_STEPS = 720;
const HALF_TURN = COS_STEPS >> 1;
const COS = (() => {
  const t = new Float32Array(COS_STEPS);
  const degToRad = f(f(Math.PI) / 180);
  for (let i = 0; i < COS_STEPS; i++) t[i] = Math.cos(f(f(i * degToRad) * 0.5));
  return t;
})();

/** 0..1 → 0..1 along half a cosine period. */
function ease(t: number): number {
  return f(0.5 * f(1 - COS[Math.trunc(f(t * HALF_TURN)) % COS_STEPS]));
}

export class Noise {
  private random: Random | null = null;
  private table: Float32Array | null = null;
  private octaves = 4;
  private falloff = 0.5;

  seed(seed: number): void {
    (this.random ??= new Random()).setSeed(seed);
    this.table = null;
  }

  /** noiseDetail(lod[, falloff]): values ≤ 0 keep the current setting. */
  detail(lod: number, falloff?: number): void {
    if (lod > 0) this.octaves = lod;
    if (falloff !== undefined && falloff > 0) this.falloff = f(falloff);
  }

  noise(x: number, y = 0, z = 0): number {
    let p = this.table;
    if (p === null) {
      const r = (this.random ??= new Random());
      p = this.table = new Float32Array(SIZE + 1);
      for (let i = 0; i <= SIZE; i++) p[i] = r.nextFloat();
    }
    x = f(Math.abs(x));
    y = f(Math.abs(y));
    z = f(Math.abs(z));
    let xi = Math.trunc(x), yi = Math.trunc(y), zi = Math.trunc(z);
    let xf = f(x - xi), yf = f(y - yi), zf = f(z - zi);
    let sum = 0;
    let amp = 0.5;
    for (let o = 0; o < this.octaves; o++) {
      let at = xi + (yi << Y_SHIFT) + (zi << Z_SHIFT);
      const ex = ease(xf), ey = ease(yf);
      // bilinear on the z plane, then on the next one, then between them
      let a = p[at & SIZE];
      a = f(a + f(ex * f(p[(at + 1) & SIZE] - a)));
      let b = p[(at + Y_STEP) & SIZE];
      b = f(b + f(ex * f(p[(at + Y_STEP + 1) & SIZE] - b)));
      a = f(a + f(ey * f(b - a)));
      at += Z_STEP;
      b = p[at & SIZE];
      b = f(b + f(ex * f(p[(at + 1) & SIZE] - b)));
      let c = p[(at + Y_STEP) & SIZE];
      c = f(c + f(ex * f(p[(at + Y_STEP + 1) & SIZE] - c)));
      b = f(b + f(ey * f(c - b)));
      a = f(a + f(ease(zf) * f(b - a)));
      sum = f(sum + f(a * amp));
      amp = f(amp * this.falloff);
      xi <<= 1; xf = f(xf * 2);
      yi <<= 1; yf = f(yf * 2);
      zi <<= 1; zf = f(zf * 2);
      if (xf >= 1) { xi++; xf = f(xf - 1); }
      if (yf >= 1) { yi++; yf = f(yf - 1); }
      if (zf >= 1) { zi++; zf = f(zf - 1); }
    }
    return sum;
  }
}
