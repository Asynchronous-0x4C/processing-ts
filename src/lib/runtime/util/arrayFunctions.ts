// Processing's array functions (append, concat, expand, reverse, shorten, sort, splice, subset, arrayCopy)
// and splitTokens(). Java arrays are typed arrays for primitives and plain arrays otherwise (see
// src/runtime/lang/arrays.ts); every function returns the same kind of array it was given.
import { LONG_ARRAY } from "../../../runtime/lang/arrays.ts";
import { ArrayIndexOutOfBoundsException } from "../../../runtime/lang/exceptions.ts";

type TypedArray = Int32Array | Float32Array | Float64Array | Uint16Array | Int8Array | Int16Array;
export type JavaArray = TypedArray | unknown[];

/** A new array of the same kind as `a` with length n (zeros, false or null). */
function like<T extends JavaArray>(a: T, n: number): T {
  if (ArrayBuffer.isView(a)) {
    const out = new (a.constructor as new (n: number) => TypedArray)(n);
    if ((a as unknown as Record<symbol, boolean>)[LONG_ARRAY]) (out as unknown as Record<symbol, boolean>)[LONG_ARRAY] = true;
    return out as T;
  }
  // boolean[] is a plain array of booleans.
  return new Array(n).fill(a.length > 0 && typeof a[0] === "boolean" ? false : null) as T;
}

/** Copy `len` elements of src from srcPos into dst at dstPos (overlap-safe, like System.arraycopy). */
function copyInto(src: JavaArray, srcPos: number, dst: JavaArray, dstPos: number, len: number) {
  if (srcPos < 0 || dstPos < 0 || len < 0 || srcPos + len > src.length || dstPos + len > dst.length) {
    throw new ArrayIndexOutOfBoundsException(`arraycopy: last source index ${srcPos + len} out of bounds for length ${src.length}`);
  }
  if (ArrayBuffer.isView(src) && ArrayBuffer.isView(dst)) (dst as TypedArray).set((src as TypedArray).subarray(srcPos, srcPos + len), dstPos);
  else {
    const part = Array.prototype.slice.call(src, srcPos, srcPos + len);
    for (let i = 0; i < len; i++) (dst as unknown[])[dstPos + i] = part[i];
  }
}

export function append<T extends JavaArray>(a: T, value: unknown): T {
  const out = expand(a, a.length + 1);
  (out as unknown[])[a.length] = value;
  return out;
}

export function concat<T extends JavaArray>(a: T, b: T): T {
  const out = like(a, a.length + b.length);
  copyInto(a, 0, out, 0, a.length);
  copyInto(b, 0, out, a.length, b.length);
  return out;
}

/** expand(a) doubles the length (1 for an empty array); expand(a, n) resizes to n (truncating). */
export function expand<T extends JavaArray>(a: T, newSize?: number): T {
  const n = newSize ?? (a.length > 0 ? a.length * 2 : 1);
  const out = like(a, n);
  copyInto(a, 0, out, 0, Math.min(n, a.length));
  return out;
}

export function reverse<T extends JavaArray>(a: T): T {
  const out = like(a, a.length);
  for (let i = 0; i < a.length; i++) (out as unknown[])[i] = (a as unknown[])[a.length - 1 - i];
  return out;
}

export function shorten<T extends JavaArray>(a: T): T {
  return subset(a, 0, a.length - 1);
}

/** A sorted copy; sort(a, count) sorts only the first count elements. Numbers ascending, Strings by UTF-16 code unit. */
export function sort<T extends JavaArray>(a: T, count?: number): T {
  const out = like(a, a.length);
  copyInto(a, 0, out, 0, a.length);
  const n = count ?? a.length;
  if (ArrayBuffer.isView(out)) (out as TypedArray).subarray(0, n).sort();
  else {
    const head = (out as unknown[]).slice(0, n).sort((x, y) => ((x as string) < (y as string) ? -1 : (x as string) > (y as string) ? 1 : 0));
    for (let i = 0; i < n; i++) (out as unknown[])[i] = head[i];
  }
  return out;
}

/** splice(a, value, index) or splice(a, array, index): insert before index. */
export function splice<T extends JavaArray>(a: T, value: unknown, index: number): T {
  const insert = Array.isArray(value) || ArrayBuffer.isView(value) ? (value as JavaArray) : null;
  const k = insert ? insert.length : 1;
  const out = like(a, a.length + k);
  copyInto(a, 0, out, 0, index);
  if (insert) copyInto(insert, 0, out, index, k);
  else (out as unknown[])[index] = value;
  copyInto(a, index, out, index + k, a.length - index);
  return out;
}

/** subset(a, start) or subset(a, start, count). */
export function subset<T extends JavaArray>(a: T, start: number, count?: number): T {
  const n = count ?? a.length - start;
  const out = like(a, n);
  copyInto(a, start, out, 0, n);
  return out;
}

/** arrayCopy(src, srcPos, dst, dstPos, length), arrayCopy(src, dst, length), arrayCopy(src, dst) (src.length elements). */
export function arrayCopy(src: JavaArray, a: number | JavaArray, b?: JavaArray | number, c?: number, d?: number) {
  if (typeof a === "number") copyInto(src, a, b as JavaArray, c!, d!);
  else copyInto(src, 0, a, 0, (b as number | undefined) ?? src.length);
}

const WHITESPACE = " \t\n\r\f ";

/** Split at any of the delimiter characters (whitespace by default), dropping empty tokens. */
export function splitTokens(value: string, delim: string = WHITESPACE): string[] {
  const out: string[] = [];
  let token = "";
  for (const ch of value) {
    if (delim.includes(ch)) {
      if (token) out.push(token);
      token = "";
    } else token += ch;
  }
  if (token) out.push(token);
  return out;
}
