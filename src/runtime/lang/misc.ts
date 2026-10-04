// Helpers generated code calls for operations on values whose run-time representation is a JS primitive
// (String, boxed numbers seen as Object/Comparable), Processing's conversion and formatting functions,
// and java.lang.System.
import { ArrayIndexOutOfBoundsException, ArrayStoreException, ClassCastException, RuntimeException, UnsupportedOperationException } from "./exceptions.ts";
import { JChar, JDouble, JFloat } from "./boxes.ts";
import { JClass, JObject, classOf, identityHash, implement, javaName, type Iface } from "./objects.ts";
import { print, println } from "./print.ts";
import { compareTo, hashCode, parseDouble, valueOf } from "./strings.ts";
import { d2i, doubleToString, exactDecimal, floatToString } from "./numbers.ts";

/** Object.equals for any value (strings and boxed numbers are JS primitives). */
export function jequals(a: unknown, b: unknown): boolean {
  if (a !== null && typeof a === "object" && typeof (a as { equals?: unknown }).equals === "function") return (a as JObject).equals(b);
  return a === b || (a !== a && b !== b);
}

/** Object.hashCode for any value. */
export function jhash(x: unknown): number {
  switch (typeof x) {
    case "string": return hashCode(x);
    case "boolean": return x ? 1231 : 1237;
    case "number": {
      if (Number.isInteger(x) && x >= -2147483648 && x <= 2147483647) return x;
      const f = new Float32Array([x]);
      return new Int32Array(f.buffer)[0];
    }
    case "object":
      if (x === null) return 0;
      if (typeof (x as JObject).hashCode === "function") return (x as JObject).hashCode();
      return identityHash(x);
    default: return 0;
  }
}

/** Comparable.compareTo for any value. */
export function jcompare(a: unknown, b: unknown): number {
  if (typeof a === "string") return compareTo(a, b as string);
  if (typeof a === "number") return a < (b as number) ? -1 : a > (b as number) ? 1 : 0;
  if (typeof a === "boolean") return a === b ? 0 : a ? 1 : -1;
  return (a as { compareTo(o: unknown): number }).compareTo(b);
}

export const csLength = (s: unknown) => (typeof s === "string" ? s.length : (s as { length(): number }).length());
export const csCharAt = (s: unknown, i: number) => (typeof s === "string" ? s.charCodeAt(i) : (s as { charAt(i: number): number }).charAt(i));

export function getClass(x: unknown): JClass {
  if (typeof x === "string") return classLiteral("java.lang.String");
  if (typeof x === "number") return classLiteral(Number.isInteger(x) ? "java.lang.Integer" : "java.lang.Double");
  if (typeof x === "boolean") return classLiteral("java.lang.Boolean");
  return classOf(x as object);
}

const literals = new Map<string, JClass>();
/** `T.class` for types without a JS constructor of their own. */
export function classLiteral(name: string): JClass {
  let c = literals.get(name);
  if (!c) {
    const ctor = function () {} as unknown as Function & { $javaName: string };
    ctor.$javaName = name;
    literals.set(name, (c = new JClass(ctor)));
  }
  return c;
}

/** An anonymous class: record its interfaces and Java name. */
export function anonClass<C extends Function>(cls: C, ifaces: Iface[], javaName: string): C {
  (cls as unknown as { $javaName: string }).$javaName = javaName;
  implement(cls, ifaces);
  return cls;
}

/**
 * Checked cast to String or a box type: "number" is Integer/Long/Short/Byte (JS numbers), "char",
 * "float" and "double" a JChar/JFloat/JDouble.
 */
export function castPrim<T>(x: T, kind: "string" | "number" | "boolean" | "char" | "float" | "double", name: string): T {
  if (x === null || x === undefined) return x;
  const ok = kind === "char" ? x instanceof JChar : kind === "float" ? x instanceof JFloat : kind === "double" ? x instanceof JDouble : typeof x === kind;
  if (ok) return x;
  const from = typeof x === "object" ? javaName(x as object) : typeof x === "number" ? "java.lang.Integer" : typeof x === "string" ? "java.lang.String" : typeof x;
  throw new ClassCastException(`class ${from} cannot be cast to class ${name}`);
}

/**
 * Stand-in for a library class the runtime does not provide (the type checker's model is larger):
 * constructing it, calling its static methods or reading its fields throws; `instanceof` is false.
 */
export function missingClass(name: string): unknown {
  const fail = (): never => {
    throw new UnsupportedOperationException(`${name} is not available in processing-ts`);
  };
  const target = function () {} as unknown as object;
  return new Proxy(target, {
    construct: fail,
    apply: fail,
    get: (t, k) => (k === Symbol.hasInstance ? () => false : k === "prototype" ? (t as { prototype: unknown }).prototype : fail()),
  });
}

/** Placeholder for code the checker rejected (never reached when compilation succeeded). */
export function unreachable(): never {
  throw new RuntimeException("Unresolved compilation problem");
}

// --- Processing conversions (int(), float(), str(), hex() ...) --------------------------------------

/** PApplet.parseInt(String): 0 (or `otherwise`) for text that is not an integer. */
export function parseIntOr(s: string | null, otherwise: number): number {
  if (s === null) return otherwise;
  const t = s.trim();
  if (/^[+-]?\d+$/.test(t)) {
    const v = Number(t);
    return v > 2147483647 || v < -2147483648 ? otherwise : v;
  }
  // Processing also accepts "3.7" and truncates it.
  const f = Number(t);
  return Number.isFinite(f) && t !== "" ? d2i(f) : otherwise;
}

/** PApplet.parseFloat(String): NaN (or `otherwise`) for text that is not a number. */
export function parseFloatOr(s: string | null, otherwise: number): number {
  if (s === null) return otherwise;
  try {
    return Math.fround(parseDouble(s));
  } catch {
    return otherwise;
  }
}

export const parseBooleanStr = (s: string | null) => s !== null && s.toLowerCase() === "true";

export function parseIntArray(a: ArrayLike<unknown>): Int32Array {
  const out = new Int32Array(a.length);
  for (let i = 0; i < a.length; i++) {
    const x = a[i];
    out[i] = typeof x === "string" ? parseIntOr(x, 0) : typeof x === "boolean" ? (x ? 1 : 0) : d2i(x as number);
  }
  return out;
}

export function parseFloatArray(a: ArrayLike<unknown>): Float32Array {
  const out = new Float32Array(a.length);
  for (let i = 0; i < a.length; i++) {
    const x = a[i];
    out[i] = typeof x === "string" ? parseFloatOr(x, NaN) : (x as number);
  }
  return out;
}

/** str(array) */
export function strArray(a: ArrayLike<unknown>): string[] {
  const out: string[] = [];
  for (let i = 0; i < a.length; i++) {
    const x = a[i];
    out.push(a instanceof Float32Array ? floatToString(x as number) : a instanceof Uint16Array ? String.fromCharCode(x as number) : a instanceof Float64Array ? doubleToString(x as number) : valueOf(x));
  }
  return out;
}

/** println(String[]): the elements, space-separated (an array passed as Object... varargs). */
export function joinValues(a: ArrayLike<unknown> | null): string {
  if (a === null) return "null";
  const parts: string[] = [];
  for (let i = 0; i < a.length; i++) parts.push(valueOf(a[i]));
  return parts.join(" ");
}

/** hex(value, digits): two's complement, upper case, padded or cut to `digits`. */
export function hex(v: number, digits = 8): string {
  const s = (v >>> 0).toString(16).toUpperCase().padStart(8, "0");
  return digits >= 8 ? s.padStart(digits, "0") : s.slice(8 - digits);
}

export function binary(v: number, digits = 32): string {
  const s = (v >>> 0).toString(2).padStart(32, "0");
  return digits >= 32 ? s : s.slice(32 - digits);
}

export const unhex = (s: string) => Number.parseInt(s, 16) | 0;
export const unbinary = (s: string) => Number.parseInt(s, 2) | 0;

export function constrain(x: number, lo: number, hi: number): number {
  return x < lo ? lo : x > hi ? hi : x;
}

export const sq = (x: number) => Math.fround(x * x);

export function floorDiv(a: number, b: number): number {
  return Math.floor(a / b) | 0;
}

export function floorMod(a: number, b: number): number {
  return ((a % b) + b) % b;
}

// --- System --------------------------------------------------------------------------------------

const t0 = Date.now();
const perf = (globalThis as unknown as { performance?: { now(): number } }).performance;

export const currentTimeMillis = () => Date.now();
export const nanoTime = () => Math.round((perf ? perf.now() : Date.now() - t0) * 1e6);

/** Thread.sleep: blocks (busy-waits). Sketches should prefer delay()/frame timing. */
export function sleep(ms: number): void {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    // busy wait
  }
}

export function arraycopy(src: ArrayLike<unknown> & { [i: number]: unknown }, sp: number, dst: { [i: number]: unknown; length: number }, dp: number, n: number): void {
  if (src === null || dst === null) throw new RuntimeException("null");
  if (sp < 0 || dp < 0 || n < 0 || sp + n > src.length || dp + n > dst.length) {
    throw new ArrayIndexOutOfBoundsException(`arraycopy: last source index ${sp + n} out of bounds for length ${src.length}`);
  }
  if (ArrayBuffer.isView(src) !== ArrayBuffer.isView(dst)) throw new ArrayStoreException("arraycopy: type mismatch");
  if (src === dst && sp < dp) for (let i = n - 1; i >= 0; i--) dst[dp + i] = src[sp + i];
  else for (let i = 0; i < n; i++) dst[dp + i] = src[sp + i];
}

/** System.out / System.err as an object (when passed around; direct calls are compiled to print/println). */
export const systemOut = {
  println(x: unknown = "") {
    println(valueOf(x));
  },
  print(x: unknown) {
    print(valueOf(x));
  },
  flush() {},
};

// --- nf(), nfc(), nfs(), nfp() ----------------------------------------------------------------------
// Processing formats with java.text.NumberFormat: minimum integer digits `left`, exactly `right`
// fraction digits (up to 3 when right is 0), HALF_EVEN rounding of the exact binary value.

function group(int: string): string {
  return int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/** nf(int, digits) / nfc(int) */
export function nfInt(n: number, digits: number, commas = false): string {
  const neg = n < 0;
  let s = String(Math.abs(n)).padStart(digits, "0");
  if (commas) s = group(s);
  return neg ? "-" + s : s;
}

/** nf(float, left, right) / nfc(float, right) */
export function nfFloat(x: number, left: number, right: number, commas = false): string {
  if (x !== x) return "�";
  if (x === Infinity || x === -Infinity) return x > 0 ? "∞" : "-∞";
  const neg = x < 0 || Object.is(x, -0);
  const a = Math.abs(x);
  const maxFrac = right === 0 ? 3 : right;
  // Exact decimal of the value, rounded half-even to maxFrac fraction digits.
  const d = a === 0 ? { digits: "0", exp: 1 } : exactDecimal(a);
  let digits = d.digits;
  let pointAt = d.exp; // digits before the decimal point
  if (pointAt < 0) {
    digits = "0".repeat(-pointAt) + digits;
    pointAt = 0;
  }
  const keep = pointAt + maxFrac;
  let intDigits: bigint;
  if (digits.length <= keep) intDigits = BigInt((digits + "0".repeat(keep - digits.length)) || "0");
  else {
    intDigits = BigInt(digits.slice(0, keep) || "0");
    const rest = digits.slice(keep);
    const first = rest.charCodeAt(0) - 48;
    const tie = first === 5 && /^50*$/.test(rest);
    if (first > 5 || (first === 5 && !tie) || (tie && intDigits % 2n === 1n)) intDigits += 1n;
  }
  let str = intDigits.toString().padStart(maxFrac + 1, "0");
  let intPart = str.slice(0, str.length - maxFrac);
  let frac = str.slice(str.length - maxFrac);
  if (right === 0) frac = frac.replace(/0+$/, "");
  intPart = intPart.replace(/^0+(?=\d)/, "").padStart(Math.max(left, 1), "0");
  if (commas) intPart = group(intPart);
  const out = frac ? `${intPart}.${frac}` : intPart;
  return neg && /[1-9]/.test(out) ? "-" + out : out;
}

export const nfs = (s: string) => (s.startsWith("-") ? s : " " + s);
export const nfp = (s: string) => (s.startsWith("-") ? s : "+" + s);
