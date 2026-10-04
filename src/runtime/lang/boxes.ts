// Boxed Float, Double and Character. Integer/Long/Short/Byte boxes are JS numbers and Boolean a JS
// boolean, but these must stay distinguishable from them and from String: `ArrayList<Float>` prints
// [1.0, 2.5], `o instanceof Character` and getClass() must work. valueOf() gives the primitive (a char
// code for JChar), so runtime code that expects a number (Math.fround, String.format) can use a box.
import { doubleToString, floatToString } from "./numbers.ts";

const f32 = new Float32Array(1);
const i32 = new Int32Array(f32.buffer);
const f64 = new Float64Array(1);
const i64 = new Int32Array(f64.buffer);

/** Float.floatToIntBits (NaN is canonical). */
export function floatToIntBits(f: number): number {
  if (f !== f) return 0x7fc00000;
  f32[0] = f;
  return i32[0];
}

/** Double.hashCode: the two halves of doubleToLongBits xor-ed (NaN is canonical; xor ignores endianness). */
export function doubleHash(d: number): number {
  if (d !== d) return 0x7ff80000;
  f64[0] = d;
  return i64[0] ^ i64[1];
}

/** Float.compare / Double.compare: -0.0 < 0.0, NaN is greater than everything and equal to itself. */
export function compareReal(a: number, b: number): number {
  if (a < b) return -1;
  if (a > b) return 1;
  const an = a !== a;
  const bn = b !== b;
  if (an || bn) return an === bn ? 0 : an ? 1 : -1;
  if (a === 0) {
    const az = Object.is(a, -0);
    return az === Object.is(b, -0) ? 0 : az ? -1 : 1;
  }
  return 0;
}

export class JFloat {
  static $javaName = "java.lang.Float";
  readonly v: number;
  constructor(v: number) {
    this.v = v;
  }
  valueOf(): number {
    return this.v;
  }
  toString(): string {
    return floatToString(this.v);
  }
  equals(o: unknown): boolean {
    return o instanceof JFloat && Object.is(o.v, this.v);
  }
  hashCode(): number {
    return floatToIntBits(this.v);
  }
  compareTo(o: JFloat): number {
    return compareReal(this.v, o.v);
  }
}

export class JDouble {
  static $javaName = "java.lang.Double";
  readonly v: number;
  constructor(v: number) {
    this.v = v;
  }
  valueOf(): number {
    return this.v;
  }
  toString(): string {
    return doubleToString(this.v);
  }
  equals(o: unknown): boolean {
    return o instanceof JDouble && Object.is(o.v, this.v);
  }
  hashCode(): number {
    return doubleHash(this.v);
  }
  compareTo(o: JDouble): number {
    return compareReal(this.v, o.v);
  }
}

export class JChar {
  static $javaName = "java.lang.Character";
  readonly v: number;
  constructor(v: number) {
    this.v = v;
  }
  valueOf(): number {
    return this.v;
  }
  toString(): string {
    return String.fromCharCode(this.v);
  }
  equals(o: unknown): boolean {
    return o instanceof JChar && o.v === this.v;
  }
  hashCode(): number {
    return this.v;
  }
  compareTo(o: JChar): number {
    return this.v - o.v;
  }
}

export const boxF = (v: number) => new JFloat(v);
export const boxD = (v: number) => new JDouble(v);

const charCache: JChar[] = [];
for (let i = 0; i < 128; i++) charCache.push(new JChar(i));
/** Character.valueOf: 0-127 are cached like Java's, so `==` on those boxes holds as in Java. */
export const boxC = (c: number) => (c < 128 ? charCache[c] : new JChar(c));

/** `x instanceof Number`. */
export function isNumber(x: unknown): boolean {
  return typeof x === "number" || x instanceof JFloat || x instanceof JDouble;
}
