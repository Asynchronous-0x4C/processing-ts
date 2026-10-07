import { describe, expect, it } from "vitest";
import { lang } from "../../src/runtime/lang/index.ts";

const f = Math.fround;

// Expected strings were printed by Processing 4.5.2 (Java 17).
describe("Java number formatting", () => {
  it("formats floats like Float.toString", () => {
    const cases: [number, string][] = [
      [1e7, "1.0E7"], [1e6, "1000000.0"], [0.001, "0.001"], [0.0001, "1.0E-4"], [100 / 3, "33.333332"],
      [-0, "-0.0"], [Infinity, "Infinity"], [NaN, "NaN"], [3.4028234663852886e38, "3.4028235E38"], [1.401298464324817e-45, "1.4E-45"],
      [16777217, "1.6777216E7"], [1.1 * 1.1, "1.21"], [1 / 3, "0.33333334"], [2.5, "2.5"], [1, "1.0"], [0.1 + 0.2, "0.3"],
    ];
    for (const [x, s] of cases) expect(lang.floatToString(f(x)), String(x)).toBe(s);
    let acc = 0;
    for (let i = 0; i < 10; i++) acc = f(acc + f(0.1));
    expect(lang.floatToString(acc)).toBe("1.0000001");
  });

  it("prints powers of two with JDK 17's narrower interval (one digit more than the shortest)", () => {
    // from Java 17: Float.toString((float) Math.pow(2, k)), Double.toString(Math.pow(2, k))
    expect(lang.floatToString(2 ** -27)).toBe("7.4505806E-9");
    expect(lang.floatToString(2 ** -10)).toBe("9.765625E-4");
    expect(lang.doubleToString(2 ** -144)).toBe("4.4841550858394146E-44");
    expect(lang.doubleToString(2 ** -134)).toBe("4.5917748078995606E-41");
  });

  it("formats doubles and longs like Double.toString / Long.toString", () => {
    expect(lang.doubleToString(Number.MAX_VALUE)).toBe("1.7976931348623157E308");
    expect(lang.doubleToString(Math.PI)).toBe("3.141592653589793");
    expect(lang.doubleToString(100)).toBe("100.0");
    expect(lang.doubleToString(1e21)).toBe("1.0E21");
    expect(lang.doubleToString(1e-5)).toBe("1.0E-5");
    expect(lang.doubleToString(Number.MIN_VALUE)).toBe("4.9E-324");
    expect(lang.longToString(9223372036854775807)).toBe("9223372036854775807");
    expect(lang.longToString(9000000000)).toBe("9000000000");
  });
});

describe("Java numeric conversions", () => {
  it("casts like Java", () => {
    expect([lang.d2i(2.9), lang.d2i(-2.9), lang.d2i(1e10), lang.d2i(NaN), lang.d2i(-1e10)]).toEqual([2, -2, 2147483647, 0, -2147483648]);
    expect(lang.longToString(lang.d2l(1e19))).toBe("9223372036854775807");
    expect([lang.i2b(200), lang.i2s(70000), lang.i2c(65)]).toEqual([-56, 4464, 65]);
    expect(lang.l2i(3000000000)).toBe(-1294967296);
  });

  it("divides integers like Java", () => {
    expect([lang.idiv(7, 2), lang.idiv(-7, 2), lang.irem(-7, 3)]).toEqual([3, -3, -1]);
    expect(() => lang.idiv(1, 0)).toThrow(lang.ArithmeticException);
    expect(lang.lmul(3000000000, 3)).toBe(9000000000);
  });
});

describe("Java strings", () => {
  it("splits like String.split", () => {
    expect(lang.S.split("a,b,,c,,", ",")).toEqual(["a", "b", "", "c"]);
    expect(lang.S.split(",a", ",")).toEqual(["", "a"]);
    expect(lang.S.split("", ",")).toEqual([""]);
    expect(lang.S.split(",", ",")).toEqual([]);
    expect(lang.S.split("a1b22c", "\\d+")).toEqual(["a", "b", "c"]);
    expect(lang.S.split("abc", "")).toEqual(["a", "b", "c"]);
    expect(lang.S.split("a,b,c", ",", 2)).toEqual(["a", "b,c"]);
  });

  it("compares, hashes and replaces like Java", () => {
    expect(lang.S.compareTo("apple", "banana")).toBe(-1);
    expect(lang.S.compareTo("ab", "abc")).toBe(-1);
    expect(lang.S.hashCode("hello")).toBe(99162322);
    expect(lang.S.replace("a.b.c", ".", "$")).toBe("a$b$c");
    expect(lang.S.replaceAll("a1b2", "(\\d)", "<$1>")).toBe("a<1>b<2>");
    expect(lang.S.matches("abc123", "[a-z]+\\d+")).toBe(true);
    expect(lang.S.matches("abc123x", "[a-z]+\\d+")).toBe(false);
    expect(lang.S.trim(" \t x \n")).toBe("x");
  });

  it("formats like String.format", () => {
    expect(lang.S.format("%.2f|%5d|%-4s|%05.1f|%x|%,d|%c|%b%n", [3.14159, 42, "ab", 2.5, 255, 1234567, 65, true])).toBe("3.14|   42|ab  |002.5|ff|1,234,567|A|true\n");
  });

  it("converts objects like String.valueOf", () => {
    expect(lang.S.valueOf(null)).toBe("null");
    expect(lang.S.valueOf(true)).toBe("true");
    expect(lang.S.valueOf(new Int32Array(2))).toMatch(/^\[I@[0-9a-f]+$/);
    expect(lang.objectText(new Float32Array([1, 2.5]))).toBe("[0] 1.0\n[1] 2.5");
    expect(lang.arrayLines(["a", "b"])).toBe('[0] "a"\n[1] "b"');
  });
});

describe("arrays, objects and exceptions", () => {
  it("creates typed and nested arrays", () => {
    const a = lang.newArray("I", 2, 2, 3) as Int32Array[];
    expect(a.length).toBe(2);
    expect(a[1]).toBeInstanceOf(Int32Array);
    expect(a[1].length).toBe(3);
    expect(lang.newArray("F", 2, 3)).toEqual([null, null, null]);
    expect(() => lang.ck(new Int32Array(3), 3)).toThrow("Index 3 out of bounds for length 3");
  });

  it("supports interfaces, lambdas and casts", () => {
    const Shape = new lang.Iface("Shape", [], { label(this: { area(): number }) { return "area " + this.area(); } });
    class Sq extends lang.JObject {
      area() { return 4; }
    }
    lang.implement(Sq, [Shape]);
    const s = new Sq();
    expect(lang.isInstance(s, Shape)).toBe(true);
    expect((s as unknown as { label(): string }).label()).toBe("area 4");
    const l = lang.lambda(Shape, "area", () => 9) as { area(): number; label(): string };
    expect(l.label()).toBe("area 9");
    expect(lang.isInstance(l, Shape)).toBe(true);
    expect(() => lang.cast(s as unknown, class Other {}, "Other")).toThrow(lang.ClassCastException);
  });

  it("maps native errors to Java exceptions", () => {
    let caught: unknown;
    try {
      (null as unknown as { x: number }).x;
    } catch (e) {
      caught = lang.toJava(e);
    }
    expect(caught).toBeInstanceOf(lang.NullPointerException);
    expect(String(new lang.ArithmeticException("/ by zero"))).toBe("java.lang.ArithmeticException: / by zero");
  });
});
