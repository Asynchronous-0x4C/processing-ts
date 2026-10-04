// Constant folding with Java semantics (JLS 15.29): 32/64-bit wrap-around, truncating division,
// float rounding, saturating float-to-int casts. Values are JS numbers (char as its code unit), booleans
// and strings. Returns undefined when Java does not treat the result as a constant (e.g. division by
// zero) or when folding is not worth it (string conversion of float/double).
import type { ConstValue, PrimName } from "./types.ts";

const LONG_MIN = -(2 ** 63);
const LONG_MAX = 2 ** 63 - 1;

/** Java's (int) of a double: NaN → 0, saturating, toward zero. */
export function d2i(x: number): number {
  if (Number.isNaN(x)) return 0;
  if (x >= 2147483647) return 2147483647;
  if (x <= -2147483648) return -2147483648;
  return Math.trunc(x) | 0;
}

/** Java's (long) of a double, as a JS number. */
export function d2l(x: number): number {
  if (Number.isNaN(x)) return 0;
  if (x >= LONG_MAX) return LONG_MAX;
  if (x <= LONG_MIN) return LONG_MIN;
  return Math.trunc(x);
}

const wrapLong = (b: bigint) => Number(BigInt.asIntN(64, b));
const big = (x: number) => BigInt(Math.trunc(x));

/** Convert a constant of primitive type `from` to primitive type `to` (casts and promotions). */
export function convert(v: ConstValue, from: PrimName, to: PrimName): ConstValue | undefined {
  if (from === "boolean" || to === "boolean") return from === to ? v : undefined;
  const x = v as number;
  switch (to) {
    case "double": return x;
    case "float": return Math.fround(x);
    case "long": return from === "float" || from === "double" ? d2l(x) : x;
    case "int": return from === "float" || from === "double" ? d2i(x) : from === "long" ? Number(BigInt.asIntN(32, big(x))) : x | 0;
    case "short": return (convert(v, from, "int") as number) << 16 >> 16;
    case "byte": return (convert(v, from, "int") as number) << 24 >> 24;
    case "char": return (convert(v, from, "int") as number) & 0xffff;
  }
}

export function foldUnary(op: string, v: ConstValue, type: PrimName): ConstValue | undefined {
  if (op === "!") return typeof v === "boolean" ? !v : undefined;
  const x = v as number;
  switch (op) {
    case "+": return x;
    case "-":
      if (type === "int") return -x | 0;
      if (type === "long") return wrapLong(-big(x));
      return type === "float" ? Math.fround(-x) : -x;
    case "~":
      if (type === "int") return ~x;
      if (type === "long") return wrapLong(~big(x));
      return undefined;
  }
  return undefined;
}

/**
 * Binary operator on constants already converted to the operation type `type` (the promoted type for
 * arithmetic, the left operand's promoted type for shifts). Comparison results are booleans.
 */
export function foldBinary(op: string, a: ConstValue, b: ConstValue, type: PrimName | "String"): ConstValue | undefined {
  if (type === "String") return op === "+" ? String(a) + String(b) : undefined;
  if (type === "boolean") {
    const x = a as boolean;
    const y = b as boolean;
    switch (op) {
      case "&&": case "&": return x && y;
      case "||": case "|": return x || y;
      case "^": case "!=": return x !== y;
      case "==": return x === y;
    }
    return undefined;
  }
  const x = a as number;
  const y = b as number;
  switch (op) {
    case "==": return x === y;
    case "!=": return x !== y;
    case "<": return x < y;
    case ">": return x > y;
    case "<=": return x <= y;
    case ">=": return x >= y;
  }
  if (type === "int") {
    switch (op) {
      case "+": return (x + y) | 0;
      case "-": return (x - y) | 0;
      case "*": return Math.imul(x, y);
      case "/": return y === 0 ? undefined : (x / y) | 0;
      case "%": return y === 0 ? undefined : (x % y) | 0;
      case "<<": return x << y;
      case ">>": return x >> y;
      case ">>>": return (x >>> y) | 0;
      case "&": return x & y;
      case "|": return x | y;
      case "^": return x ^ y;
    }
    return undefined;
  }
  if (type === "long") {
    const p = big(x);
    const q = big(y);
    switch (op) {
      case "+": return wrapLong(p + q);
      case "-": return wrapLong(p - q);
      case "*": return wrapLong(p * q);
      case "/": return q === 0n ? undefined : wrapLong(p / q);
      case "%": return q === 0n ? undefined : wrapLong(p % q);
      case "<<": return wrapLong(p << (q & 63n));
      case ">>": return wrapLong(p >> (q & 63n));
      case ">>>": return wrapLong(BigInt.asUintN(64, p) >> (q & 63n));
      case "&": return wrapLong(p & q);
      case "|": return wrapLong(p | q);
      case "^": return wrapLong(p ^ q);
    }
    return undefined;
  }
  // float / double
  const r = (z: number) => (type === "float" ? Math.fround(z) : z);
  switch (op) {
    case "+": return r(x + y);
    case "-": return r(x - y);
    case "*": return r(x * y);
    case "/": return r(x / y);
    case "%": return r(x % y);
  }
  return undefined;
}

/** String conversion of a constant for folding `"a" + c` (floats are not folded: Java's formatting differs). */
export function constToString(v: ConstValue, type: PrimName | "String"): string | undefined {
  if (type === "String" || type === "boolean" || type === "int" || type === "long" || type === "short" || type === "byte") return String(v);
  if (type === "char") return String.fromCharCode(v as number);
  return undefined;
}
