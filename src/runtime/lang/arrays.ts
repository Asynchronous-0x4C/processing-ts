// Java arrays: primitive element types map to typed arrays, so stores convert like Java (int wraps,
// float rounds, char masks); boolean and reference arrays are plain arrays. long[] shares Float64Array
// with double[] and is tagged so printing can tell them apart.
import { ArrayIndexOutOfBoundsException, NegativeArraySizeException } from "./exceptions.ts";

/** Element kind: JVM descriptor letters, L for references. */
export type ElemKind = "I" | "F" | "D" | "J" | "C" | "B" | "S" | "Z" | "L";

export const LONG_ARRAY = Symbol("long[]");

type AnyArray = Int32Array | Float32Array | Float64Array | Uint16Array | Int8Array | Int16Array | unknown[];

function leaf(kind: ElemKind, n: number): AnyArray {
  if (n < 0) throw new NegativeArraySizeException(String(n));
  switch (kind) {
    case "I": return new Int32Array(n);
    case "F": return new Float32Array(n);
    case "D": return new Float64Array(n);
    case "J": {
      const a = new Float64Array(n);
      (a as unknown as Record<symbol, boolean>)[LONG_ARRAY] = true;
      return a;
    }
    case "C": return new Uint16Array(n);
    case "B": return new Int8Array(n);
    case "S": return new Int16Array(n);
    case "Z": return new Array<boolean>(n).fill(false);
    default: return new Array<unknown>(n).fill(null);
  }
}

/**
 * `new T[d0][d1]...[]` with `rank` dimensions in total, `dims` the given sizes: missing trailing
 * dimensions are left null like Java.
 */
export function newArray(kind: ElemKind, rank: number, ...dims: number[]): AnyArray {
  const make = (level: number): AnyArray => {
    const n = dims[level];
    if (level === rank - 1) return leaf(kind, n);
    if (n < 0) throw new NegativeArraySizeException(String(n));
    if (level === dims.length - 1) return new Array<unknown>(n).fill(null);
    const out = new Array<unknown>(n);
    for (let i = 0; i < n; i++) out[i] = make(level + 1);
    return out;
  };
  return make(0);
}

/** Array initializer `{a, b, c}` of the given element kind. */
export function arrayOf(kind: ElemKind, values: unknown[]): AnyArray {
  if (kind === "Z" || kind === "L") return values;
  const a = leaf(kind, values.length) as Float64Array;
  a.set(values as number[]);
  return a;
}

/** Bounds-checked index (Java's ArrayIndexOutOfBoundsException). */
export function ck(a: { length: number }, i: number): number {
  if (i >>> 0 < a.length && i === (i | 0)) return i;
  throw new ArrayIndexOutOfBoundsException(`Index ${i} out of bounds for length ${a.length}`);
}

export function isLongArray(a: unknown): boolean {
  return a instanceof Float64Array && (a as unknown as Record<symbol, boolean>)[LONG_ARRAY] === true;
}

/** JVM type descriptor of an array value ("[I", "[[F", "[Ljava.lang.Object;"). */
export function arrayDescriptor(a: unknown): string {
  if (a instanceof Int32Array) return "[I";
  if (a instanceof Float32Array) return "[F";
  if (a instanceof Float64Array) return isLongArray(a) ? "[J" : "[D";
  if (a instanceof Uint16Array) return "[C";
  if (a instanceof Int8Array) return "[B";
  if (a instanceof Int16Array) return "[S";
  if (Array.isArray(a)) {
    if (a.length && typeof a[0] === "boolean") return "[Z";
    if (a.length && (ArrayBuffer.isView(a[0]) || Array.isArray(a[0]))) return "[" + arrayDescriptor(a[0]);
    return "[Ljava.lang.Object;";
  }
  return "?";
}

export function isArray(a: unknown): boolean {
  return Array.isArray(a) || (ArrayBuffer.isView(a) && !(a instanceof DataView));
}

/** `x.clone()`: arrays are copied (shallow, keeping the long[] tag); other objects use their clone(). */
export function clone<T extends AnyArray>(a: T): T {
  if (!isArray(a)) return (a as unknown as { clone(): T }).clone();
  const c = a.slice() as T;
  if (isLongArray(a)) (c as unknown as Record<symbol, boolean>)[LONG_ARRAY] = true;
  return c;
}
