// java.lang classes used through $rt.classes: static methods of the box classes and StringBuilder.
// Boxed Integer/Long/Boolean are plain JS numbers/booleans, Character, Float and Double are JChar,
// JFloat and JDouble objects (boxes.ts); these are their static helpers.
import { NumberFormatException, StringIndexOutOfBoundsException } from "./exceptions.ts";
import { JDouble, JFloat, boxC, compareReal, doubleHash, floatToIntBits } from "./boxes.ts";
import { JObject } from "./objects.ts";
import { doubleToString, floatToString, longToString } from "./numbers.ts";
import { parseDouble, parseInt, parseLong } from "./strings.ts";

const cmp = (a: number, b: number) => (a < b ? -1 : a > b ? 1 : 0);

export const Integer = {
  parseInt: (s: string, radix = 10) => parseInt(s, radix),
  valueOf: (x: string | number, radix = 10) => (typeof x === "string" ? parseInt(x, radix) : x),
  toString: (i: number, radix = 10) => i.toString(radix),
  toBinaryString: (i: number) => (i >>> 0).toString(2),
  toHexString: (i: number) => (i >>> 0).toString(16),
  toOctalString: (i: number) => (i >>> 0).toString(8),
  compare: cmp,
  signum: (i: number) => Math.sign(i),
  max: Math.max,
  min: Math.min,
  sum: (a: number, b: number) => (a + b) | 0,
  bitCount: (i: number) => {
    let n = 0;
    for (let v = i >>> 0; v; v >>>= 1) n += v & 1;
    return n;
  },
  hashCode: (i: number) => i,
};

export const Long = {
  parseLong: (s: string) => parseLong(s),
  valueOf: (x: string | number) => (typeof x === "string" ? parseLong(x) : x),
  toString: (x: number) => longToString(x),
  compare: cmp,
  max: Math.max,
  min: Math.min,
};

const floatBits = new Float32Array(1);
const floatInt = new Int32Array(floatBits.buffer);

export const Float = {
  parseFloat: (s: string) => Math.fround(parseDouble(s)),
  valueOf: (x: string | number) => new JFloat(typeof x === "string" ? Math.fround(parseDouble(x)) : Math.fround(x)),
  toString: (f: number) => floatToString(f),
  compare: compareReal,
  hashCode: floatToIntBits,
  isNaN: (f: number) => f !== f,
  isInfinite: (f: number) => f === Infinity || f === -Infinity,
  isFinite: (f: number) => Number.isFinite(f),
  max: Math.max,
  min: Math.min,
  sum: (a: number, b: number) => Math.fround(a + b),
  floatToIntBits,
  floatToRawIntBits: (f: number) => {
    floatBits[0] = f;
    return floatInt[0];
  },
  intBitsToFloat: (i: number) => {
    floatInt[0] = i;
    return floatBits[0];
  },
};

export const Double = {
  parseDouble: (s: string) => parseDouble(s),
  valueOf: (x: string | number) => new JDouble(typeof x === "string" ? parseDouble(x) : x),
  toString: (d: number) => doubleToString(d),
  compare: compareReal,
  hashCode: doubleHash,
  isNaN: (d: number) => d !== d,
  isInfinite: Float.isInfinite,
  isFinite: (d: number) => Number.isFinite(d),
  max: Math.max,
  min: Math.min,
  sum: (a: number, b: number) => a + b,
};

const ch = (c: number) => String.fromCharCode(c);
export const Character = {
  isDigit: (c: number) => /\p{Nd}/u.test(ch(c)),
  isLetter: (c: number) => /\p{L}/u.test(ch(c)),
  isLetterOrDigit: (c: number) => /[\p{L}\p{Nd}]/u.test(ch(c)),
  isAlphabetic: (c: number) => /\p{Alphabetic}/u.test(ch(c)),
  isUpperCase: (c: number) => /\p{Lu}/u.test(ch(c)),
  isLowerCase: (c: number) => /\p{Ll}/u.test(ch(c)),
  isWhitespace: (c: number) => (c >= 9 && c <= 13) || (c >= 28 && c <= 32) || (/\s/.test(ch(c)) && c !== 160 && c !== 8199 && c !== 8239),
  isSpaceChar: (c: number) => /\p{Zs}|\p{Zl}|\p{Zp}/u.test(ch(c)),
  toUpperCase: (c: number) => {
    const u = ch(c).toUpperCase();
    return u.length === 1 ? u.charCodeAt(0) : c;
  },
  toLowerCase: (c: number) => {
    const l = ch(c).toLowerCase();
    return l.length === 1 ? l.charCodeAt(0) : c;
  },
  getNumericValue: (c: number) => {
    const d = Number.parseInt(ch(c), 36);
    return Number.isNaN(d) ? -1 : d;
  },
  digit: (c: number, radix: number) => {
    const d = Number.parseInt(ch(c), 36);
    return Number.isNaN(d) || d >= radix ? -1 : d;
  },
  forDigit: (d: number, radix: number) => (d >= 0 && d < radix ? d.toString(radix).charCodeAt(0) : 0),
  toString: (c: number) => ch(c),
  valueOf: boxC,
  compare: (a: number, b: number) => a - b,
  toChars: (c: number) => new Uint16Array([c]),
};

export const Boolean = {
  parseBoolean: (s: string | null) => s !== null && s.toLowerCase() === "true",
  valueOf: (x: string | boolean) => (typeof x === "string" ? x.toLowerCase() === "true" : x),
  toString: (b: boolean) => String(b),
  compare: (a: boolean, b: boolean) => (a === b ? 0 : a ? 1 : -1),
  logicalAnd: (a: boolean, b: boolean) => a && b,
  logicalOr: (a: boolean, b: boolean) => a || b,
  logicalXor: (a: boolean, b: boolean) => a !== b,
};

/** java.lang.StringBuilder (and StringBuffer). append/insert receive Java strings from generated code. */
export class StringBuilder extends JObject {
  private s: string;
  constructor(init?: string | number | null) {
    super();
    this.s = typeof init === "string" ? init : init !== null && init !== undefined && typeof init === "object" ? String(init) : "";
  }
  append(x: string): this {
    this.s += x;
    return this;
  }
  insert(i: number, x: string): this {
    if (i < 0 || i > this.s.length) throw new StringIndexOutOfBoundsException(`offset ${i}, length ${this.s.length}`);
    this.s = this.s.slice(0, i) + x + this.s.slice(i);
    return this;
  }
  length(): number {
    return this.s.length;
  }
  charAt(i: number): number {
    if (i >>> 0 >= this.s.length) throw new StringIndexOutOfBoundsException(`index ${i},length ${this.s.length}`);
    return this.s.charCodeAt(i);
  }
  setCharAt(i: number, c: number): void {
    this.s = this.s.slice(0, i) + String.fromCharCode(c) + this.s.slice(i + 1);
  }
  deleteCharAt(i: number): this {
    if (i >>> 0 >= this.s.length) throw new StringIndexOutOfBoundsException(`index ${i},length ${this.s.length}`);
    this.s = this.s.slice(0, i) + this.s.slice(i + 1);
    return this;
  }
  delete(a: number, b: number): this {
    this.s = this.s.slice(0, a) + this.s.slice(Math.min(b, this.s.length));
    return this;
  }
  replace(a: number, b: number, x: string): this {
    this.s = this.s.slice(0, a) + x + this.s.slice(Math.min(b, this.s.length));
    return this;
  }
  reverse(): this {
    this.s = Array.from(this.s).reverse().join("");
    return this;
  }
  setLength(n: number): void {
    this.s = n <= this.s.length ? this.s.slice(0, n) : this.s + "\0".repeat(n - this.s.length);
  }
  indexOf(x: string, from = 0): number {
    return this.s.indexOf(x, from);
  }
  lastIndexOf(x: string): number {
    return this.s.lastIndexOf(x);
  }
  substring(a: number, b = this.s.length): string {
    return this.s.substring(a, b);
  }
  isEmpty(): boolean {
    return this.s.length === 0;
  }
  override toString(): string {
    return this.s;
  }
}

export function numberFormatError(s: string): never {
  throw new NumberFormatException(`For input string: "${s}"`);
}
