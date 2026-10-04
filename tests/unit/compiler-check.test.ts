import { describe, expect, it } from "vitest";
import { walk, type Expression, type Node } from "../../src/compiler/ast.ts";
import { checkSketch } from "../../src/compiler/check.ts";
import { parseSketch } from "../../src/compiler/parse.ts";
import { typeToString } from "../../src/compiler/types.ts";

function check(src: string | { name: string; text: string }[]) {
  const tabs = typeof src === "string" ? [{ name: "sketch.pde", text: src }] : src;
  const p = parseSketch(tabs);
  expect(p.diagnostics).toEqual([]);
  const r = checkSketch(p.files);
  const messages = r.diagnostics.map((d) => `${p.source.locate(d.start).line}: ${d.message}`);
  return { ...r, p, messages };
}

/** Errors of a sketch, as "line: message". */
const errors = (src: string) => check(src).messages;

/** Type and constant of the expression `x = <expr>` inside setup(). */
function typed(decls: string, expr: string): { type: string; constant: unknown } {
  const r = check(`${decls}\nvoid setup() {\n  Object probe = (${expr});\n}\n`);
  expect(r.messages).toEqual([]);
  let found: Expression | undefined;
  walk(r.sketch.decl, (n: Node) => {
    if (n.kind === "VarDeclarator" && n.name.text === "probe") found = n.init!;
  });
  return { type: typeToString(found!.ty!), constant: found!.constant };
}

describe("checker: valid sketches", () => {
  it("accepts typical active-mode code with classes, generics and lambdas", () => {
    // Map is not among Processing's default imports (HashMap and ArrayList are).
    expect(errors(`
import java.util.Map;
ArrayList<Ball> balls = new ArrayList<Ball>();
HashMap<String, Integer> counts = new HashMap<>();
color bg = #202830;
final int N = 10;

void setup() {
  size(320, 240);
  for (int i = 0; i < N; i++) balls.add(new Ball(random(width), random(height)));
  counts.put("a", 1);
  int c = counts.get("a") + 1;
  for (Map.Entry<String, Integer> e : counts.entrySet()) println(e.getKey() + e.getValue());
  balls.sort((a, b) -> Float.compare(a.x, b.x));
  Runnable r = () -> println("run");
  r.run();
}

void draw() {
  background(bg);
  for (Ball b : balls) b.move();
  Ball first = balls.get(0);
  float d = dist(first.x, first.y, mouseX, mouseY);
  if (d < 10 && mousePressed) fill(255, 0, 0); else fill(255);
}

class Ball implements Comparable<Ball> {
  float x, y;
  PVector v = new PVector(1, 2);
  Ball(float x, float y) { this.x = x; this.y = y; }
  void move() { x += v.x; y += v.y; ellipse(x, y, 10, 10); }
  int compareTo(Ball o) { return Float.compare(x, o.x); }
}
`)).toEqual([]);
  });

  it("accepts static mode, enums, interfaces, switch and anonymous classes", () => {
    expect(errors(`
size(320, 240);
int k = 2;
switch (k) { case 1: println("one"); break; case 2: case 3: println("two"); break; default: println("?"); }
String s = "b";
switch (s) { case "a": break; case "b": println("b"); }
Runnable r = new Runnable() { public void run() { println("anon"); } };
r.run();
class Local { int v = 3; }
println(new Local().v);
`)).toEqual([]);
    expect(errors(`
enum Dir { UP, DOWN; Dir flip() { return this == UP ? DOWN : UP; } }
interface Shape { float area(); default String label() { return "shape"; } }
Dir d = Dir.UP;
void setup() {
  switch (d) { case UP: println("up"); break; case DOWN: break; }
  Shape sq = () -> 4;
  println(sq.area() + sq.label() + d.flip() + Dir.values().length + d.ordinal());
}
`)).toEqual([]);
  });

  it("uses constants declared later or in another tab as switch labels", () => {
    expect(check([
      { name: "Main.pde", text: "void keyPressed() {\n  switch (keyCode) { case LEFT_KEY: break; case Keys.UP_KEY: break; case DOUBLE: break; }\n}\n" },
      { name: "Keys.pde", text: "final int LEFT_KEY = 37;\nfinal int DOUBLE = LEFT_KEY * 2;\nstatic class Keys { static final int UP_KEY = 38; }\n" },
    ]).messages).toEqual([]);
  });

  it("accepts Processing conversion functions, hex colors, varargs and arrays", () => {
    expect(errors(`
void setup() {
  int a = int(3.7);
  float b = float("2.5");
  char c = char(65);
  int[] xs = { 1, 2, 3 };
  int[][] grid = new int[3][4];
  String[] parts = split("a,b", ',');
  float m = max(1, 2.5, 3);
  int total = sum(1, 2, 3);
  color col = color(255, 0, 0);
  fill(#FF8800);
  println(a, b, c, xs.length, grid[1].length, parts[0], m, total, col);
  byte small = 10;
  char ch = 'a' + 1;
  long big = 1L << 40;
  double dd = 0.1;
}
int sum(int... values) { int s = 0; for (int v : values) s += v; return s; }
`)).toEqual([]);
  });
});

// Messages verified with the real Processing 4.5.2 (`Processing cli --build`).
describe("checker: errors reported like Processing", () => {
  it.each([
    ["void setup() { int q = nope + 1; }", "1: nope cannot be resolved to a variable"],
    ["void setup() { undefinedCall(2, \"a\"); }", "1: The function undefinedCall(int, String) does not exist."],
    ["void setup() { fill(\"red\"); }", "1: The method fill(int) in the type PApplet is not applicable for the arguments (String)"],
    ["void setup() { Foo f = null; }", "1: Cannot find a class or type named \"Foo\""],
    ["int f(int a) { if (a > 0) return 1; }\nvoid setup() { }", "1: This method must return a result of type int"],
    ["void setup() { return; println(1); }", "1: Unreachable code"],
    ["int count = 0;\nstatic class A { void f() { count++; } }\nvoid setup() { }", "2: Cannot make a static reference to the non-static field count"],
    ["void setup() { PVector v = new PVector(); v.w = 1; }", "1: w cannot be resolved or is not a field"],
    ["void setup() { PVector v = new PVector(); v.foo(); }", "1: The function foo() does not exist."],
    ["void setup() { int a = 1; int a = 2; }", "1: Duplicate local variable a"],
    ["void setup() { String s = \"a\"; int i = (int) s; }", "1: Cannot cast from String to int"],
    ["void setup() { int a = 1; if (a) { } }", "1: Type mismatch: cannot convert from int to boolean"],
    ["void setup() { int a = 1.5; }", "1: Type mismatch: cannot convert from float to int"],
    ["abstract class Shape { abstract void draw(); }\nclass Sq extends Shape { }\nvoid setup() { }", "2: The type sketch.Sq must implement the inherited abstract method sketch.Shape.draw()"],
    ["class C { void t() {} static void s() {} }\nvoid setup() { }", "1: The method s cannot be declared static; static methods can only be declared in a static or top level type"],
    ["class C { static int n = 0; static final int K = 3; }\nvoid setup() { }", "1: The field n cannot be declared static in a non-static inner type, unless initialized with a constant expression"],
    ["class C { enum E { A } }\nvoid setup() { }", "1: The member enum E must be defined inside a static member type"],
    // Checked exceptions
    ["void setup() { Thread.sleep(10); }", "1: Unhandled exception type InterruptedException"],
    ["void setup() { BufferedReader r = createReader(\"a.txt\"); String l = r.readLine(); }", "1: Unhandled exception type IOException"],
    ["void setup() { Runnable r = () -> Thread.sleep(1); }", "1: Unhandled exception type InterruptedException"],
    ["void f() throws Exception { Thread.sleep(1); }\nvoid setup() { f(); }", "2: Unhandled exception type Exception"],
    ["void setup() { try { int a = 1; } catch (java.io.IOException e) { } }", "1: Unreachable catch block for IOException. This exception is never thrown from the try statement body"],
    ["void setup() { try { Thread.sleep(1); } catch (Exception e) { } catch (InterruptedException e) { } }", "1: Unreachable catch block for InterruptedException. It is already handled by the catch block for Exception"],
  ])("%s", (src, message) => {
    expect(errors(src)).toEqual([message]);
  });

  it("accepts handled and declared exceptions", () => {
    expect(errors(`
void setup() {
  try { Thread.sleep(1); } catch (InterruptedException e) { println(e); }
  try { int a = 1; } catch (Exception e) { }
  try (BufferedReader r = createReader("a.txt")) { println(r.readLine()); } catch (IOException e) { e.printStackTrace(); }
  Runnable ok = () -> { try { Thread.sleep(1); } catch (InterruptedException e) { } };
}
void f() throws InterruptedException { Thread.sleep(1); }
`)).toEqual([]);
  });

  it("tracks definite assignment of locals", () => {
    const uninit = (body: string) => errors(`boolean c = true;\nint k = 1;\nvoid setup() {\n${body}\n}`);
    expect(uninit("int x; if (random(1) > 0.5) x = 1; println(x);")).toEqual(["4: The local variable x may not have been initialized"]);
    expect(uninit("int x; for (int i = 0; i < 3; i++) x = i; println(x);")).toEqual(["4: The local variable x may not have been initialized"]);
    expect(uninit("int x; switch (k) { case 1: x = 1; break; } println(x);")).toEqual(["4: The local variable x may not have been initialized"]);
    expect(uninit("String s; boolean b = s == null;")).toEqual(["4: The local variable s may not have been initialized"]);
    expect(uninit("int x; if (c) x = 1; else x = 2; println(x);")).toEqual([]);
    expect(uninit("int x; while (true) { x = 1; break; } println(x);")).toEqual([]);
    expect(uninit("int x; switch (k) { case 1: x = 1; break; default: x = 2; } println(x);")).toEqual([]);
    expect(uninit("int x; try { x = 1; } catch (Exception e) { x = 2; } println(x);")).toEqual([]);
    expect(uninit("int x; if (c && (x = 3) > 0) println(x);")).toEqual([]);
    expect(uninit("int x; if (!c) return; else x = 1; println(x);")).toEqual([]);
    expect(uninit("int x; do { x = 1; } while (c); println(x);")).toEqual([]);
  });

  it("reports more errors in one pass", () => {
    expect(errors("void setup() {\n  int a = \"x\";\n  undefinedThing();\n  float f = 1.0;\n  boolean b = f;\n}")).toEqual([
      "2: Type mismatch: cannot convert from String to int",
      "3: The function undefinedThing() does not exist.",
      "5: Type mismatch: cannot convert from float to boolean",
    ]);
  });
});

describe("checker: types and constants", () => {
  it("types unsuffixed decimal literals as float (Processing) and folds Java arithmetic", () => {
    expect(typed("", "1.5")).toEqual({ type: "float", constant: 1.5 });
    expect(typed("", "1.5d")).toEqual({ type: "double", constant: 1.5 });
    expect(typed("", "7 / 2")).toEqual({ type: "int", constant: 3 });
    expect(typed("", "-7 / 2")).toEqual({ type: "int", constant: -3 });
    expect(typed("", "-7 % 3")).toEqual({ type: "int", constant: -1 });
    expect(typed("", "2147483647 + 1")).toEqual({ type: "int", constant: -2147483648 });
    expect(typed("", "'a' + 1")).toEqual({ type: "int", constant: 98 });
    expect(typed("", "(char) ('a' + 1)")).toEqual({ type: "char", constant: 98 });
    expect(typed("", "(int) 3.99")).toEqual({ type: "int", constant: 3 });
    expect(typed("", "(int) -3.99")).toEqual({ type: "int", constant: -3 });
    expect(typed("", "0.1f + 0.2f")).toEqual({ type: "float", constant: Math.fround(Math.fround(0.1) + Math.fround(0.2)) });
    expect(typed("", "1L << 40")).toEqual({ type: "long", constant: 2 ** 40 });
    expect(typed("", "\"x\" + 'a' + 1")).toEqual({ type: "String", constant: "xa1" });
    expect(typed("final int K = 4;", "K * 2")).toEqual({ type: "int", constant: 8 });
    expect(typed("", "PI")).toEqual({ type: "float", constant: Math.fround(Math.PI) });
  });

  it("types generic members through their type arguments", () => {
    expect(typed("ArrayList<PVector> ps = new ArrayList<PVector>();", "ps.get(0)").type).toBe("PVector");
    expect(typed("HashMap<String, Float> m = new HashMap<>();", "m.get(\"a\")").type).toBe("Float");
    expect(typed("ArrayList raw = new ArrayList();", "raw.get(0)").type).toBe("Object");
    expect(typed("", "java.util.Collections.max(new ArrayList<Integer>())").type).toBe("Integer");
  });

  it("records the implicit receiver of unqualified members (for code generation)", () => {
    const r = check("int count = 0;\nvoid setup() { }\nclass Ball {\n  float x;\n  void move() { x += 1; count++; fill(255); step(); }\n  void step() { }\n}");
    const seen: string[] = [];
    walk(r.sketch.decl, (n) => {
      if (n.kind === "Identifier" && n.implicitThis) seen.push(`${n.name}@${n.implicitThis.name}`);
      if (n.kind === "MethodCall" && n.implicitThis) seen.push(`${n.name.text}()@${n.implicitThis.name}`);
    });
    expect(seen).toEqual(["x@Ball", "count@sketch", "fill()@sketch", "step()@Ball"]);
  });

  it("records the chosen overload", () => {
    const r = check("void setup() {\n  fill(255);\n  fill(255.0);\n  fill(255, 0, 0);\n}");
    const calls: string[] = [];
    walk(r.sketch.decl, (n) => {
      if (n.kind === "MethodCall" && n.method) calls.push(`${n.method.owner.name}.${n.method.name}(${n.method.params.map(typeToString).join(",")})`);
    });
    expect(calls).toEqual(["PApplet.fill(int)", "PApplet.fill(float)", "PApplet.fill(float,float,float)", "PApplet.noLoop()"].slice(0, 3));
  });
});

describe("checker: settings() and Java mode", () => {
  it("reports a settings() written next to moved size() calls as a duplicate (like Processing)", () => {
    expect(errors("void setup() {\n  size(400, 300);\n}\nvoid settings() { pixelDensity(1); }\n")).toEqual(["4: Duplicate method settings() in type sketch"]);
    expect(errors("void settings() {\n  size(400, 300);\n}\nvoid setup() { }\n")).toEqual([]);
  });

  it("checks a Java mode sketch with its top-level classes", () => {
    const r = check([{ name: "J.pde", text: "public class J extends PApplet {\n  Helper h = new Helper();\n  public void setup() { float f = 1.5; println(h.name(), f); }\n  public static void main(String[] a) { PApplet.main(\"J\"); }\n}\nclass Helper {\n  String name() { return \"helper\"; }\n}\nclass Bad { void f() { undefinedName(); } }\n" }]);
    expect(r.messages).toEqual(["9: The function undefinedName() does not exist."]); // Processing 4.5.2 (cli --build)
  });
});

describe("checker: generics", () => {
  it("types members of an inner class of a generic class through the outer type arguments", () => {
    expect(errors("class Box<T> {\n  class Item { T v; }\n  Item make() { return new Item(); }\n}\nvoid setup() {\n  Box<String> b = new Box<String>();\n  int n = b.make().v.length();\n}\n")).toEqual([]);
  });

  it("rejects a call whose inferred type argument is outside its bound", () => {
    const src = (arg: string) => `import java.util.*;\n<T extends Number> double mean(List<T> xs) { return 0; }\nvoid setup() {\n  println(mean(${arg}));\n}\n`;
    expect(errors(src("Arrays.asList(1, 2.5)"))).toEqual([]);
    expect(errors(src("Arrays.asList(1, \"x\")"))).toEqual(["4: The method mean(List<T>) in the type sketch is not applicable for the arguments (List<Object>)"]);
  });
});
