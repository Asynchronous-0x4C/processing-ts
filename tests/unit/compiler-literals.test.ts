import { describe, expect, it } from "vitest";
import { decodeChar, decodeColor, decodeFloat, decodeInt, decodeString, decodeTextBlock } from "../../src/compiler/literals.ts";

describe("decodeInt", () => {
  it("reads decimal, hex, octal and binary literals with underscores", () => {
    expect(decodeInt("42")).toEqual({ value: 42, long: false });
    expect(decodeInt("1_000_000").value).toBe(1000000);
    expect(decodeInt("0x1F").value).toBe(31);
    expect(decodeInt("010").value).toBe(8);
    expect(decodeInt("0b1010").value).toBe(10);
    expect(decodeInt("0").value).toBe(0);
  });

  it("wraps hex/octal/binary int literals to 32 bits like Java", () => {
    expect(decodeInt("0xFFFFFFFF").value).toBe(-1);
    expect(decodeInt("0x80000000").value).toBe(-2147483648);
    expect(decodeInt("0x1FFFFFFFF").error).toMatch(/too large/);
  });

  it("allows 2147483648 only as the operand of unary minus", () => {
    expect(decodeInt("2147483647").error).toBeUndefined();
    expect(decodeInt("2147483648").error).toMatch(/too large/);
    expect(decodeInt("2147483648", true)).toEqual({ value: 2147483648, long: false });
    expect(decodeInt("2147483649", true).error).toMatch(/too large/);
  });

  it("reads long literals", () => {
    expect(decodeInt("5L")).toEqual({ value: 5, long: true });
    expect(decodeInt("3000000000l")).toEqual({ value: 3000000000, long: true });
    expect(decodeInt("0xFFFFFFFFFFFFFFFFL").value).toBe(-1);
    expect(decodeInt("9223372036854775808L").error).toMatch(/too large/);
  });

  it("rejects 8 and 9 in octal literals", () => {
    expect(decodeInt("09").error).toMatch(/octal/);
  });
});

describe("decodeFloat", () => {
  it("keeps the explicit suffix", () => {
    expect(decodeFloat("1.5")).toEqual({ value: 1.5, suffix: null });
    expect(decodeFloat("1.5f")).toEqual({ value: 1.5, suffix: "f" });
    expect(decodeFloat("2D")).toEqual({ value: 2, suffix: "d" });
    expect(decodeFloat("1e3")).toEqual({ value: 1000, suffix: null });
    expect(decodeFloat(".5")).toEqual({ value: 0.5, suffix: null });
    expect(decodeFloat("1_0.2_5")).toEqual({ value: 10.25, suffix: null });
  });

  it("reads hexadecimal floating-point literals", () => {
    expect(decodeFloat("0x1.8p1").value).toBe(3);
    expect(decodeFloat("0x1p-2f")).toEqual({ value: 0.25, suffix: "f" });
  });
});

describe("decodeColor", () => {
  it("adds an opaque alpha to #RRGGBB and keeps #AARRGGBB", () => {
    expect(decodeColor("#FF8800")).toBe(0xffff8800 | 0);
    expect(decodeColor("#000000")).toBe(0xff000000 | 0);
    expect(decodeColor("#80FFFFFF")).toBe(0x80ffffff | 0);
    expect(decodeColor("#00FF0000")).toBe(0x00ff0000);
  });
});

describe("string and char literals", () => {
  it("interprets escape sequences", () => {
    expect(decodeString('"a\\tb\\n"').value).toBe("a\tb\n");
    expect(decodeString('"\\"q\\" \\\\ \\u00e9 \\101 \\0"').value).toBe('"q" \\ é A \0');
    expect(decodeString('"\\q"').error).toMatch(/Illegal escape/);
    // Java 15's \s is a syntax error in Processing 4.5.2.
    expect(decodeString('"\\s*"').error).toMatch(/Illegal escape character '\\s'/);
    expect(decodeChar("'\\s'").error).toMatch(/Illegal escape/);
  });

  it("reads char literals as UTF-16 code units", () => {
    expect(decodeChar("'a'").value).toBe(97);
    expect(decodeChar("'\\n'").value).toBe(10);
    expect(decodeChar("'\\''").value).toBe(39);
    expect(decodeChar("'\\u0041'").value).toBe(65);
    expect(decodeChar("'\\377'").value).toBe(255);
  });
});

// Expected values were printed by Processing 4.5.2 (not Java's text block rules).
describe("decodeTextBlock", () => {
  it("keeps a leading newline and the raw lines, without stripping indentation or trailing spaces", () => {
    expect(decodeTextBlock('"""\n      x\n    y   \n    """').value).toBe("\n      x\n    y   \n    ");
    expect(decodeTextBlock('"""\n\n  z\n  """').value).toBe("\n\n  z\n  ");
    expect(decodeTextBlock('"""\n    end"""').value).toBe("\n    end");
    expect(decodeTextBlock('"""  \r\n  x\\\\y"""').value).toBe("\n  x\\y");
  });

  it("interprets ordinary escapes and rejects the ones Processing cannot compile", () => {
    expect(decodeTextBlock('"""\n    t\\ttab\n    """')).toEqual({ value: "\n    t\ttab\n    " });
    expect(decodeTextBlock('"""\n    say "hi"\n    """').value).toBe('\n    say "hi"\n    ');
    expect(decodeTextBlock('"""\n  \\"q\\"\n  """').error).toMatch(/'\\"' is not supported/);
    expect(decodeTextBlock('"""\n  one\\s\n  """').error).toMatch(/'\\s' is not supported/);
    expect(decodeTextBlock('"""\n  one \\\n  two\n  """').error).toMatch(/'\\<newline>' is not supported/);
  });
});
