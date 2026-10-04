// java.lang.String semantics on JS strings (UTF-16 like Java). Generated code calls these where a JS
// method would behave differently (bounds, regex syntax, literal replacement, char arguments).
import { arrayDescriptor, isArray, isLongArray } from "./arrays.ts";
import { IllegalArgumentException, NullPointerException, NumberFormatException, StringIndexOutOfBoundsException } from "./exceptions.ts";
import { identityHash } from "./objects.ts";
import { doubleToString, longToString } from "./numbers.ts";

const npe = (): never => {
  throw new NullPointerException(null);
};

export function charAt(s: string, i: number): number {
  if (i >>> 0 >= s.length) throw new StringIndexOutOfBoundsException(`index ${i}, length ${s.length}`);
  return s.charCodeAt(i);
}

export function substring(s: string, begin: number, end = s.length): string {
  if (begin < 0 || end > s.length || begin > end) throw new StringIndexOutOfBoundsException(`begin ${begin}, end ${end}, length ${s.length}`);
  return s.substring(begin, end);
}

export function equals(s: string, o: unknown): boolean {
  if (s === null || s === undefined) npe();
  return s === o;
}

export function equalsIgnoreCase(s: string, o: string | null): boolean {
  return o !== null && o !== undefined && s.length === o.length && (s === o || s.toUpperCase() === o.toUpperCase() || s.toLowerCase() === o.toLowerCase());
}

export function compareTo(a: string, b: string): number {
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) {
    const d = a.charCodeAt(i) - b.charCodeAt(i);
    if (d !== 0) return d;
  }
  return a.length - b.length;
}

export function compareToIgnoreCase(a: string, b: string): number {
  return compareTo(a.toUpperCase().toLowerCase(), b.toUpperCase().toLowerCase());
}

export function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return h;
}

/** indexOf with a char (number) or String argument. */
export function indexOf(s: string, x: number | string, from = 0): number {
  return s.indexOf(typeof x === "number" ? String.fromCharCode(x) : x, Math.max(0, from));
}

export function lastIndexOf(s: string, x: number | string, from = Infinity): number {
  if (from < 0) return -1;
  return s.lastIndexOf(typeof x === "number" ? String.fromCharCode(x) : x, from);
}

/** Java trim: removes chars <= ' ' at both ends. */
export function trim(s: string): string {
  let a = 0;
  let b = s.length;
  while (a < b && s.charCodeAt(a) <= 32) a++;
  while (b > a && s.charCodeAt(b - 1) <= 32) b--;
  return a === 0 && b === s.length ? s : s.slice(a, b);
}

/** replace(char, char) */
export function replaceChar(s: string, a: number, b: number): string {
  return s.split(String.fromCharCode(a)).join(String.fromCharCode(b));
}

/** replace(CharSequence, CharSequence): literal, all occurrences. */
export function replace(s: string, target: string, repl: string): string {
  if (target === "") {
    let out = repl;
    for (const ch of s) out += ch + repl;
    return out;
  }
  return s.split(target).join(repl);
}

// --- regular expressions -----------------------------------------------------------------------------

const cache = new Map<string, RegExp>();
/** Java regex → JS RegExp (common syntax is shared; leading inline flags (?i) are translated). */
export function regex(java: string, global = true): RegExp {
  const key = (global ? "g" : "") + java;
  let r = cache.get(key);
  if (!r) {
    let src = java;
    let flags = global ? "g" : "";
    const m = /^\(\?([imsx]+)\)/.exec(src);
    if (m) {
      src = src.slice(m[0].length);
      for (const f of m[1]) if (f !== "x" && !flags.includes(f)) flags += f;
    }
    // Possessive quantifiers (a++, a*+) have no JS equivalent: use the greedy form.
    src = src.replace(/([*+?}])\+/g, "$1");
    r = new RegExp(src, flags);
    cache.set(key, r);
  }
  r.lastIndex = 0;
  return r;
}

/** Java replacement string ($1, \$) → a replacer function. */
function javaReplacement(repl: string): (m: string, ...groups: unknown[]) => string {
  return (match: string, ...rest: unknown[]) => {
    const groups = rest.slice(0, -2) as (string | undefined)[];
    let out = "";
    for (let i = 0; i < repl.length; i++) {
      const c = repl[i];
      if (c === "\\" && i + 1 < repl.length) out += repl[++i];
      else if (c === "$") {
        let j = i + 1;
        while (j < repl.length && /[0-9]/.test(repl[j])) j++;
        const n = Number(repl.slice(i + 1, j));
        if (j === i + 1) throw new IllegalArgumentException("Illegal group reference");
        out += n === 0 ? match : groups[n - 1] ?? "";
        i = j - 1;
      } else out += c;
    }
    return out;
  };
}

export function replaceAll(s: string, re: string, repl: string): string {
  return s.replace(regex(re), javaReplacement(repl));
}

export function replaceFirst(s: string, re: string, repl: string): string {
  return s.replace(regex(re, false), javaReplacement(repl));
}

export function matches(s: string, re: string): boolean {
  const r = regex(re, false);
  return new RegExp(`^(?:${r.source})$`, r.flags).test(s);
}

/**
 * String.split(regex, limit) with Java's rules: captured groups are not included, a zero-width match at
 * the start does not produce a leading empty string, trailing empty strings are removed when limit is 0,
 * and without any match the result is the string itself.
 */
export function split(s: string, re: string, limit = 0): string[] {
  const out: string[] = [];
  const r = regex(re);
  let last = 0;
  let matched = false;
  let m: RegExpExecArray | null;
  while ((m = r.exec(s)) !== null) {
    if (m[0].length === 0) {
      r.lastIndex++;
      if (m.index === 0 || m.index >= s.length) continue;
    }
    if (limit > 0 && out.length === limit - 1) break;
    matched = true;
    out.push(s.slice(last, m.index));
    last = m.index + m[0].length;
  }
  if (!matched) return [s];
  out.push(s.slice(last));
  if (limit === 0) while (out.length > 0 && out[out.length - 1] === "") out.pop();
  return out;
}

export function toCharArray(s: string): Uint16Array {
  const a = new Uint16Array(s.length);
  for (let i = 0; i < s.length; i++) a[i] = s.charCodeAt(i);
  return a;
}

/** new String(char[]) / String.valueOf(char[], offset, count) */
export function fromChars(a: Uint16Array, offset = 0, count = a.length - offset): string {
  let out = "";
  for (let i = offset; i < offset + count; i++) out += String.fromCharCode(a[i]);
  return out;
}

export function repeat(s: string, n: number): string {
  if (n < 0) throw new IllegalArgumentException("count is negative: " + n);
  return s.repeat(n);
}

export function join(delim: string, items: Iterable<unknown> | ArrayLike<unknown>): string {
  const parts: string[] = [];
  for (const x of Array.isArray(items) || !(Symbol.iterator in Object(items)) ? Array.from(items as ArrayLike<unknown>) : (items as Iterable<unknown>)) parts.push(valueOf(x));
  return parts.join(delim);
}

// --- conversions -------------------------------------------------------------------------------------

/** String.valueOf(Object) for values whose static type is a reference type. */
export function valueOf(x: unknown): string {
  if (x === null || x === undefined) return "null";
  switch (typeof x) {
    case "string": return x;
    case "boolean": return x ? "true" : "false";
    case "number":
      // A boxed Integer/Long/Short/Byte (Float and Double are JFloat/JDouble objects). A fractional
      // number can only come from host code; print it as a double.
      return Number.isInteger(x) ? longToString(x) : doubleToString(x);
    case "object":
      if (isArray(x)) return `${arrayDescriptor(x)}@${(identityHash(x as object) >>> 0).toString(16)}`;
      return String((x as { toString(): string }).toString());
    default:
      return String(x);
  }
}

// --- parsing -----------------------------------------------------------------------------------------

export function parseInt(s: string, radix = 10): number {
  if (s === null || s === undefined) throw new NumberFormatException("Cannot parse null string: null");
  const ok = radix === 10 ? /^[+-]?\d+$/ : radix === 16 ? /^[+-]?[0-9a-fA-F]+$/ : radix === 2 ? /^[+-]?[01]+$/ : /^[+-]?[0-9a-zA-Z]+$/;
  const v = Number.parseInt(s, radix);
  if (!ok.test(s) || Number.isNaN(v) || v > 2147483647 || v < -2147483648) throw new NumberFormatException(`For input string: "${s}"${radix !== 10 ? ` under radix ${radix}` : ""}`);
  return v;
}

export function parseLong(s: string): number {
  if (s === null || !/^[+-]?\d+$/.test(s)) throw new NumberFormatException(`For input string: "${s}"`);
  return Number(s);
}

export function parseDouble(s: string): number {
  if (s === null || s === undefined) throw new NullPointerException(null);
  const t = trim(s);
  if (/^[+-]?(NaN|Infinity)$/.test(t)) return Number(t);
  if (!/^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?[fFdD]?$/.test(t)) throw new NumberFormatException(`For input string: "${s}"`);
  return Number(t.replace(/[fFdD]$/, ""));
}

export const parseFloat = (s: string) => Math.fround(parseDouble(s));

// --- String.format ------------------------------------------------------------------------------------

/** java.util.Formatter subset: %[index$][flags][width][.precision]conversion for d o x X e E f g s S c b B n %. */
export function format(fmt: string, args: unknown[]): string {
  let auto = 0;
  return fmt.replace(/%(\d+\$)?([-#+ 0,(]*)(\d+)?(\.\d+)?([a-zA-Z%])/g, (all, index: string | undefined, flags: string, width: string | undefined, prec: string | undefined, conv: string) => {
    if (conv === "n") return "\n";
    if (conv === "%") return pad("%", flags, width);
    const arg = index ? args[Number(index.slice(0, -1)) - 1] : args[auto++];
    const p = prec ? Number(prec.slice(1)) : undefined;
    let s: string;
    switch (conv) {
      case "d": s = group(longToString(Number(arg)), flags); break;
      case "o": s = (Number(arg) >>> 0).toString(8); break;
      case "x": case "X": s = (Number(arg) >>> 0).toString(16); if (conv === "X") s = s.toUpperCase(); break;
      case "f": s = group(Number(arg).toFixed(p ?? 6), flags); break;
      case "e": case "E": {
        const [m, e] = Number(arg).toExponential(p ?? 6).split("e");
        const exp = Number(e);
        s = `${m}e${exp < 0 ? "-" : "+"}${String(Math.abs(exp)).padStart(2, "0")}`;
        if (conv === "E") s = s.toUpperCase();
        break;
      }
      case "g": s = Number(arg).toPrecision(p ?? 6); break;
      case "s": case "S": s = valueOf(arg); if (p !== undefined) s = s.slice(0, p); if (conv === "S") s = s.toUpperCase(); break;
      case "c": s = typeof arg === "number" ? String.fromCharCode(arg) : String(arg); break;
      case "b": case "B": s = arg === null || arg === undefined ? "false" : typeof arg === "boolean" ? String(arg) : "true"; if (conv === "B") s = s.toUpperCase(); break;
      default: return all;
    }
    if ((conv === "d" || conv === "f" || conv === "e" || conv === "E") && Number(arg) >= 0) {
      if (flags.includes("+")) s = "+" + s;
      else if (flags.includes(" ")) s = " " + s;
    }
    return pad(s, flags, width);
  });
}

function group(s: string, flags: string): string {
  if (!flags.includes(",")) return s;
  const [int, frac] = s.split(".");
  const neg = int.startsWith("-");
  const digits = neg ? int.slice(1) : int;
  const g = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return (neg ? "-" : "") + g + (frac !== undefined ? "." + frac : "");
}

function pad(s: string, flags: string, width: string | undefined): string {
  if (!width) return s;
  const w = Number(width);
  if (s.length >= w) return s;
  if (flags.includes("-")) return s.padEnd(w);
  if (flags.includes("0")) {
    const sign = /^[+-]/.test(s) ? s[0] : "";
    return sign + s.slice(sign.length).padStart(w - sign.length, "0");
  }
  return s.padStart(w);
}

export { isLongArray };
