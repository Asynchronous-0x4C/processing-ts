// Java numeric semantics on JS numbers: int is a number kept in the 32-bit range (`| 0`), float is a
// number rounded with Math.fround after every operation, long is a number (exact up to 2^53), char is
// its UTF-16 code unit. These helpers are what generated code calls where plain JS operators differ.
import { ArithmeticException } from "./exceptions.ts";

export const fround = Math.fround;

/** (int) of a float/double: NaN → 0, saturating, toward zero. */
export function d2i(x: number): number {
  if (x !== x) return 0;
  if (x >= 2147483647) return 2147483647;
  if (x <= -2147483648) return -2147483648;
  return x < 0 ? Math.ceil(x) | 0 : Math.floor(x) | 0;
}

const LONG_MAX = 9223372036854775807;
const LONG_MIN = -9223372036854775808;

/** (long) of a float/double. */
export function d2l(x: number): number {
  if (x !== x) return 0;
  if (x >= LONG_MAX) return LONG_MAX;
  if (x <= LONG_MIN) return LONG_MIN;
  return Math.trunc(x);
}

/** (int) of a long: the low 32 bits. */
export function l2i(x: number): number {
  return Math.abs(x) < 2147483648 ? x | 0 : Number(BigInt.asIntN(32, BigInt(Math.trunc(x))));
}

/** int division (Java: truncates, throws on zero). */
export function idiv(a: number, b: number): number {
  if (b === 0) throw new ArithmeticException("/ by zero");
  return (a / b) | 0;
}

export function irem(a: number, b: number): number {
  if (b === 0) throw new ArithmeticException("/ by zero");
  return a % b | 0;
}

export function ldiv(a: number, b: number): number {
  if (b === 0) throw new ArithmeticException("/ by zero");
  return Math.trunc(a / b);
}

export function lrem(a: number, b: number): number {
  if (b === 0) throw new ArithmeticException("/ by zero");
  return a % b;
}

const big = (x: number) => BigInt(Math.trunc(x));
const wrap64 = (b: bigint) => Number(BigInt.asIntN(64, b));

/** long operators that need 64-bit two's complement. */
export function lmul(a: number, b: number): number {
  const r = a * b;
  return Number.isSafeInteger(r) ? r : wrap64(big(a) * big(b));
}
export function ladd(a: number, b: number): number {
  const r = a + b;
  return Number.isSafeInteger(r) ? r : wrap64(big(a) + big(b));
}
export function lsub(a: number, b: number): number {
  const r = a - b;
  return Number.isSafeInteger(r) ? r : wrap64(big(a) - big(b));
}
export const lshl = (a: number, n: number) => wrap64(big(a) << BigInt(n & 63));
export const lshr = (a: number, n: number) => wrap64(big(a) >> BigInt(n & 63));
export const lushr = (a: number, n: number) => wrap64(BigInt.asUintN(64, big(a)) >> BigInt(n & 63));
export const land = (a: number, b: number) => wrap64(big(a) & big(b));
export const lor = (a: number, b: number) => wrap64(big(a) | big(b));
export const lxor = (a: number, b: number) => wrap64(big(a) ^ big(b));
export const lnot = (a: number) => wrap64(~big(a));

/** Narrowing int conversions. */
export const i2b = (x: number) => (x << 24) >> 24;
export const i2s = (x: number) => (x << 16) >> 16;
export const i2c = (x: number) => x & 0xffff;

// ---------------------------------------------------------------------------------------------------
// String conversion (Float.toString / Double.toString / Long.toString)

/** Java's layout of shortest digits: plain for 1e-3 <= |x| < 1e7, else d.dddE±n. */
function javaLayout(neg: boolean, digits: string, exp: number): string {
  // value = 0.d1d2d3... × 10^exp  →  decimal exponent of the first digit is exp - 1
  const e = exp - 1;
  let out: string;
  if (e >= -3 && e < 7) {
    if (e >= 0) {
      const intPart = digits.slice(0, e + 1).padEnd(e + 1, "0");
      const frac = digits.slice(e + 1) || "0";
      out = `${intPart}.${frac}`;
    } else out = `0.${"0".repeat(-e - 1)}${digits}`;
  } else {
    out = `${digits[0]}.${digits.slice(1) || "0"}E${e}`;
  }
  return neg ? "-" + out : out;
}

/**
 * Exact decimal digits of a finite positive double: { digits, exp } with value = 0.digits × 10^exp.
 * (Every binary fraction has a finite decimal expansion.)
 */
export function exactDecimal(a: number): { digits: string; exp: number } {
  // a = m × 2^e with m a 53-bit integer
  let e = 0;
  let m = a;
  while (!Number.isInteger(m)) {
    m *= 2;
    e--;
  }
  while (m >= 2 ** 53) {
    m /= 2;
    e++;
  }
  let n = BigInt(m);
  let scale = 0; // value = n × 10^-scale
  if (e >= 0) n <<= BigInt(e);
  else {
    n *= 5n ** BigInt(-e);
    scale = -e;
  }
  const str = n.toString();
  return { digits: str.replace(/0+$/, "") || "0", exp: str.length - scale };
}

/** Round exact digits to p significant digits, ties to even (Java FloatingDecimal). */
function roundDigits(d: { digits: string; exp: number }, p: number): { digits: string; exp: number } {
  if (d.digits.length <= p) return d;
  const head = d.digits.slice(0, p);
  const rest = d.digits.slice(p);
  const first = rest.charCodeAt(0) - 48;
  const tie = first === 5 && /^5$/.test(rest);
  let up = first > 5 || (first === 5 && !tie) || (tie && (head.charCodeAt(p - 1) - 48) % 2 === 1);
  if (!up) return { digits: head.replace(/0+$/, "") || "0", exp: d.exp };
  const inc = (BigInt(head) + 1n).toString();
  return inc.length > head.length ? { digits: inc.replace(/0+$/, "") || "0", exp: d.exp + 1 } : { digits: inc.replace(/0+$/, "") || "0", exp: d.exp };
}

/** Digits of an integral value 1 <= a < 2^63 the way JDK 17 prints it: exact, minus insignificant digits. */
function integerDigits(a: number, significantBits: number): { digits: string; exp: number } {
  let binExp = 0;
  while (2 ** (binExp + 1) <= a) binExp++;
  let v = BigInt(a);
  let dropped = 0;
  const p2 = binExp - significantBits - 1;
  if (binExp > significantBits && p2 > 1) {
    dropped = Math.floor(p2 * Math.LOG10E * Math.LN2 + 1e-9);
    if (dropped > 0) {
      const pow = 10n ** BigInt(dropped);
      const r = v % pow;
      v /= pow;
      if (r * 2n >= pow) v++;
    }
  }
  const str = v.toString();
  return { digits: str.replace(/0+$/, "") || "0", exp: str.length + dropped };
}

/**
 * Shortest digits (at least two) that round-trip through `roundTrip`, ties to even. `halfGap`, when
 * given, is the largest distance from `a` the digits may be (instead of round-tripping).
 */
function shortestDigits(a: number, maxDigits: number, roundTrip: (x: number) => number, halfGap?: number): { digits: string; exp: number } {
  const exact = exactDecimal(a);
  for (let p = 2; p < maxDigits; p++) {
    const r = roundDigits(exact, p);
    if (halfGap !== undefined ? closer(r, exact, exactDecimal(halfGap)) : roundTrip(Number(`0.${r.digits}e${r.exp}`)) === a) return r;
  }
  return roundDigits(exact, maxDigits);
}

/** |d - a| < h, exactly (decimal digit strings: value = 0.digits × 10^exp). */
function closer(d: { digits: string; exp: number }, a: { digits: string; exp: number }, h: { digits: string; exp: number }): boolean {
  const lo = Math.min(d.exp - d.digits.length, a.exp - a.digits.length, h.exp - h.digits.length);
  const int = (x: { digits: string; exp: number }) => BigInt(x.digits) * 10n ** BigInt(x.exp - x.digits.length - lo);
  const diff = int(d) - int(a);
  return (diff < 0n ? -diff : diff) < int(h);
}

/**
 * For a float or double whose significand is a power of two, JDK 17 accepts only digits within half the
 * gap to the value below (the smaller one) on both sides: 2^-27f prints as 7.4505806E-9, not 7.450581E-9.
 */
function powerOfTwoHalfGap(a: number, bits: number, minNormal: number): number | undefined {
  const e = Math.round(Math.log2(a));
  if (2 ** e !== a || a < minNormal * 2) return undefined;
  return 2 ** (e - bits - 1);
}

/**
 * Java Float.toString as in JDK 17 (Processing 4.5.2), not the shortest-digits algorithm of JDK 19+:
 * integral values print their exact digits (minus the digits below float precision), other values
 * print the shortest digits that identify the float (at least two), ties rounded to even.
 */
export function floatToString(x: number): string {
  x = Math.fround(x);
  if (x !== x) return "NaN";
  if (x === Infinity) return "Infinity";
  if (x === -Infinity) return "-Infinity";
  if (x === 0) return 1 / x < 0 ? "-0.0" : "0.0";
  const neg = x < 0;
  const a = neg ? -x : x;
  const d = Number.isInteger(a) && a >= 1 && a < 2 ** 63 ? integerDigits(a, 24) : shortestDigits(a, 9, Math.fround, powerOfTwoHalfGap(a, 24, 2 ** -126));
  return javaLayout(neg, d.digits, d.exp);
}

/** Java Double.toString as in JDK 17 (see floatToString). */
export function doubleToString(x: number): string {
  if (x !== x) return "NaN";
  if (x === Infinity) return "Infinity";
  if (x === -Infinity) return "-Infinity";
  if (x === 0) return 1 / x < 0 ? "-0.0" : "0.0";
  const neg = x < 0;
  const a = neg ? -x : x;
  const d = Number.isInteger(a) && a >= 1 && a < 2 ** 63 ? integerDigits(a, 53) : shortestDigits(a, 17, (v) => v, powerOfTwoHalfGap(a, 53, 2 ** -1022));
  return javaLayout(neg, d.digits, d.exp);
}

/** Long.toString; values at the 64-bit limits print as Java's extremes. */
export function longToString(x: number): string {
  if (x >= LONG_MAX) return "9223372036854775807";
  if (x <= LONG_MIN) return "-9223372036854775808";
  return Number.isSafeInteger(x) || Math.abs(x) < 1e21 ? String(x) : big(x).toString();
}

export const charToString = (c: number) => String.fromCharCode(c);
