import { describe, expect, it } from "vitest";
import { compileSketch, type SourceMapV3 } from "../../src/compiler/index.ts";
import { runSketch } from "../../tools/lang/runner.ts";

const sketch = (text: string, name = "Sketch.pde") => [{ name, text }];
const run = async (text: string) => {
  const r = await runSketch(sketch(text));
  expect(r.errors).toEqual([]);
  return r;
};

/** Decode Source Map v3 mappings: per generated line, [genCol, source, line, col] (absolute). */
function decode(map: SourceMapV3): [number, number, number, number][][] {
  const B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  const state = [0, 0, 0, 0];
  return map.mappings.split(";").map((line) => {
    state[0] = 0;
    if (!line) return [];
    return line.split(",").map((seg) => {
      const vals: number[] = [];
      let shift = 0;
      let v = 0;
      for (const ch of seg) {
        const d = B64.indexOf(ch);
        v += (d & 31) << shift;
        if (d & 32) shift += 5;
        else {
          vals.push(v & 1 ? -(v >>> 1) : v >>> 1);
          v = 0;
          shift = 0;
        }
      }
      vals.forEach((x, i) => (state[i] += x));
      return [state[0], state[1], state[2], state[3]] as [number, number, number, number];
    });
  });
}

describe("compileSketch", () => {
  it("generates code only when there are no errors", () => {
    const ok = compileSketch(sketch("void setup() { println(1); }"));
    expect(ok.diagnostics).toEqual([]);
    expect(ok.code).toContain("class $Sketch extends $rt.PApplet");
    const bad = compileSketch(sketch("void setup() { int x = \"s\"; }"));
    expect(bad.code).toBeNull();
    expect(bad.diagnostics.map((d) => d.message)).toEqual(["Type mismatch: cannot convert from String to int"]);
  });

  it("maps statements back to their tab and line", () => {
    const tabs = [
      { name: "Main.pde", text: "void setup() {\n  helper();\n}\n" },
      { name: "Other.pde", text: "// helper tab\n\nvoid helper() {\n    println(\"in-other\");\n}\n" },
    ];
    const r = compileSketch(tabs);
    expect(r.map!.sources).toEqual(["Main.pde", "Other.pde"]);
    expect(r.map!.sourcesContent).toEqual(tabs.map((t) => t.text));
    const genLine = r.code!.split("\n").findIndex((l) => l.includes('"in-other"'));
    expect(genLine).toBeGreaterThanOrEqual(0);
    const seg = decode(r.map!)[genLine][0];
    expect(seg.slice(1)).toEqual([1, 3, 4]);
  });
});

describe("sketch modes", () => {
  it("runs size() moved to settings() before setup()", async () => {
    const r = await run("void setup() {\n  size(400, 300);\n  println(width, height);\n}\n");
    expect(r.stdout).toBe("400 300\n");
    expect(r.code).toMatch(/async settings\(\.\.\.a\)/);
  });

  it("runs a Java mode sketch with a top-level class", async () => {
    const r = await runSketch([{ name: "J.pde", text: "public class J extends PApplet {\n  Helper h = new Helper();\n  int n = 2;\n  public void setup() { println(h, h.getClass().getName(), n * 1.5, getClass().getName()); }\n  public static void main(String[] a) { PApplet.main(\"J\"); }\n}\nclass Helper {\n  public String toString() { return \"H\"; }\n}\n" }]);
    expect(r.errors).toEqual([]);
    expect(r.stdout).toBe("H Helper 3.0 J\n");
  });
});

describe("generated code keeps Java semantics", () => {
  it("int and float arithmetic", async () => {
    const r = await run(`
void setup() {
  int a = 2147483647;
  float f = 0;
  for (int i = 0; i < 10; i++) f += 0.1;
  println(a + 1, 7 / 2, -7 % 3, f, 1 / 3.0, (int) -2.7, (byte) 200);
}`);
    expect(r.stdout).toBe("-2147483648 3 -1 1.0000001 0.33333334 -2 -56\n");
  });

  it("string conversion with chars, floats and nulls", async () => {
    const r = await run(`
void setup() {
  char c = 'a';
  String s = null;
  println("" + c + 1, c + 1, "x" + 2.0 + s, 'a' + 'b' + "!");
}`);
    expect(r.stdout).toBe("a1 98 x2.0null 195!\n");
  });

  it("overloads, classes and constructors", async () => {
    const r = await run(`
class P {
  int v;
  P() { this(3); }
  P(int v) { this.v = v; }
  String f(int x) { return "int"; }
  String f(float x) { return "float"; }
  String f(Object x) { return "Object"; }
}
void setup() {
  P p = new P();
  println(p.v, p.f(1), p.f(1.5), p.f("s"), p.f('c'));
}`);
    expect(r.stdout).toBe("3 int float Object int\n");
  });

  it("reports uncaught exceptions like Java", async () => {
    const r = await run(`
void setup() {
  int[] a = new int[2];
  a[3] = 1;
}`);
    expect(r.exception).toBe("java.lang.ArrayIndexOutOfBoundsException: Index 3 out of bounds for length 2");
  });

  it("catches Java exceptions raised by the runtime", async () => {
    const r = await run(`
void setup() {
  try {
    Integer.parseInt("x");
  } catch (NumberFormatException e) {
    println(e.getMessage());
  }
  String s = null;
  try {
    s.length();
  } catch (NullPointerException e) {
    println("npe");
  }
}`);
    expect(r.stdout).toBe('For input string: "x"\nnpe\n');
  });
});
