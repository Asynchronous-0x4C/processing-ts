// Decoding of Java/Processing literal tokens (JLS §3.10). Errors are returned as messages; the caller
// attaches positions.

export interface Decoded<T> {
  value: T;
  error?: string;
}

const INT_LIMIT = 2n ** 31n;
const LONG_LIMIT = 2n ** 63n;

/**
 * Integer literal. Decimal literals must fit the signed range (2147483648 / 9223372036854775808L only as
 * the operand of unary minus: `negated`); hex/octal/binary literals may use all 32/64 bits and wrap.
 */
export function decodeInt(text: string, negated = false): Decoded<number> & { long: boolean } {
  let t = text.includes("_") ? text.replace(/_/g, "") : text;
  const last = t.charCodeAt(t.length - 1);
  const long = last === 0x6c || last === 0x4c; // l L
  if (long) t = t.slice(0, -1);
  // Fast path: short decimal int.
  if (!long && t.length <= 9 && (t.length === 1 || t.charCodeAt(0) !== 0x30)) return { value: Number(t), long };
  let radix = 10;
  let digits = t;
  const c1 = t.charCodeAt(1) | 0x20;
  if (t.length > 1 && t[0] === "0" && c1 === 0x78 /* x */) { radix = 16; digits = t.slice(2); }
  else if (t.length > 1 && t[0] === "0" && c1 === 0x62 /* b */) { radix = 2; digits = t.slice(2); }
  else if (t.length > 1 && t[0] === "0") {
    radix = 8;
    digits = t.slice(1);
    if (/[89]/.test(digits)) return { value: 0, long, error: `Invalid octal literal '${text}'` };
  }
  const prefix = radix === 16 ? "0x" : radix === 2 ? "0b" : radix === 8 ? "0o" : "";
  const big = BigInt(prefix + digits);
  if (radix === 10) {
    const limit = long ? LONG_LIMIT : INT_LIMIT;
    if (big > limit || (big === limit && !negated)) return { value: 0, long, error: `Integer number too large: ${text}` };
    return { value: Number(big), long };
  }
  const bits = long ? 64 : 32;
  if (big >= 2n ** BigInt(bits)) return { value: 0, long, error: `Integer number too large: ${text}` };
  return { value: Number(BigInt.asIntN(bits, big)), long };
}

/** Floating-point literal: exact value as a double, and the explicit suffix if any. */
export function decodeFloat(text: string): Decoded<number> & { suffix: "f" | "d" | null } {
  let t = text.includes("_") ? text.replace(/_/g, "") : text;
  const last = t[t.length - 1];
  let suffix: "f" | "d" | null = null;
  // A trailing d/f is a suffix except inside a hex mantissa, which always ends with a p-exponent.
  if (/[fFdD]/.test(last)) {
    suffix = last === "f" || last === "F" ? "f" : "d";
    t = t.slice(0, -1);
  }
  if (/^0[xX]/.test(t)) {
    const m = /^0[xX]([0-9a-fA-F]*)(?:\.([0-9a-fA-F]*))?[pP]([+-]?\d+)$/.exec(t);
    if (!m) return { value: NaN, suffix, error: `Malformed floating-point literal '${text}'` };
    const frac = m[2] ?? "";
    const mantissa = parseInt((m[1] || "0") + frac, 16);
    return { value: mantissa * 2 ** (Number(m[3]) - 4 * frac.length), suffix };
  }
  return { value: Number(t), suffix };
}

/** `#RRGGBB` → 0xFFRRGGBB, `#AARRGGBB` as written; both as a signed 32-bit int. */
export function decodeColor(text: string): number {
  const hex = text.slice(1);
  return hex.length === 6 ? (0xff000000 | parseInt(hex, 16)) | 0 : parseInt(hex, 16) | 0;
}

// No `\s` (Java 15): Processing 4.5.2's lexer rejects it (checked with the real Processing).
const SIMPLE_ESCAPES: Record<string, string> = { b: "\b", t: "\t", n: "\n", f: "\f", r: "\r", '"': '"', "'": "'", "\\": "\\" };

/**
 * Interpret escape sequences in the body of a string/char literal (without quotes). `\uXXXX` is
 * accepted here although Java translates it before lexing.
 */
export function unescape(body: string): Decoded<string> {
  if (!body.includes("\\")) return { value: body };
  let out = "";
  let error: string | undefined;
  for (let i = 0; i < body.length; i++) {
    const c = body[i];
    if (c !== "\\") {
      out += c;
      continue;
    }
    const n = body[++i];
    if (n === undefined) {
      error ??= "Illegal escape character at end of literal";
      break;
    }
    if (n in SIMPLE_ESCAPES) out += SIMPLE_ESCAPES[n];
    else if (n === "u") {
      while (body[i + 1] === "u") i++;
      const hex = body.slice(i + 1, i + 5);
      if (!/^[0-9a-fA-F]{4}$/.test(hex)) {
        error ??= "Illegal unicode escape";
        continue;
      }
      out += String.fromCharCode(parseInt(hex, 16));
      i += 4;
    } else if (n >= "0" && n <= "7") {
      // \0 - \377: up to three digits, three only when the first is 0-3.
      let digits = n;
      const max = n <= "3" ? 3 : 2;
      while (digits.length < max && body[i + 1] >= "0" && body[i + 1] <= "7") digits += body[++i];
      out += String.fromCharCode(parseInt(digits, 8));
    } else {
      error ??= `Illegal escape character '\\${n}'`;
      out += n;
    }
  }
  return { value: out, error };
}

/** String literal token including quotes. */
export function decodeString(text: string): Decoded<string> {
  return unescape(text.slice(1, -1));
}

/** Character literal token including quotes → UTF-16 code unit. */
export function decodeChar(text: string): Decoded<number> {
  const { value, error } = unescape(text.slice(1, -1));
  if (error) return { value: 0, error };
  if (value.length !== 1) return { value: value.charCodeAt(0) || 0, error: "Character literal must contain exactly one character" };
  return { value: value.charCodeAt(0) };
}

/**
 * Text block token (`"""` ... `"""`) as Processing 4.5.2 reads it, which is NOT Java's text block
 * (verified with the real Processing): the value is a newline followed by the raw lines after the
 * opening line, up to the closing `"""` — no incidental indentation or trailing space is stripped.
 * Ordinary escapes are interpreted; `\"`, `\s` and `\<newline>` fail to compile in Processing.
 */
export function decodeTextBlock(text: string): Decoded<string> {
  const open = text.indexOf("\n");
  const content = "\n" + text.slice(open + 1, -3).replace(/\r\n?/g, "\n");
  const unsupported = /\\(["s\n])/.exec(content.replace(/\\\\/g, ""));
  const { value, error } = unescape(content);
  if (unsupported) return { value, error: `Escape sequence '\\${unsupported[1] === "\n" ? "<newline>" : unsupported[1]}' is not supported in Processing text blocks` };
  return { value, error };
}
