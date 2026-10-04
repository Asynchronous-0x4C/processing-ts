import { describe, expect, it } from "vitest";
import { Modifier, printAst } from "../../src/compiler/ast.ts";
import type { Diagnostic } from "../../src/compiler/diagnostics.ts";
import { parseSketch } from "../../src/compiler/parse.ts";
import { buildSketch } from "../../src/compiler/sketch.ts";

function build(tabs: { name: string; text: string }[]) {
  const p = parseSketch(tabs);
  expect(p.diagnostics).toEqual([]);
  const diagnostics: Diagnostic[] = [];
  const sketch = buildSketch(p.files, diagnostics);
  return { sketch, diagnostics, p };
}

// The expected shapes follow `Processing cli --build` output (Processing 4.5.2).
describe("sketch class (Processing preprocessor)", () => {
  it("active mode: top-level variables become fields, methods and classes members; tabs are merged", () => {
    const { sketch, diagnostics } = build([
      { name: "Main.pde", text: "int x = 1;\nvoid setup() { }\n" },
      { name: "Ball.pde", text: "class Ball { void move() { } }\n" },
    ]);
    expect(diagnostics).toEqual([]);
    expect(sketch.name).toBe("Main");
    expect(sketch.mode).toBe("active");
    expect(sketch.decl.body.map((m) => m.kind)).toEqual(["FieldDecl", "MethodDecl", "ClassDecl"]);
    expect(sketch.decl.superclass?.name.text).toBe("PApplet");
  });

  it("makes methods without an access modifier public, in all classes but interfaces", () => {
    const { sketch } = build([{ name: "s.pde", text: "interface I { void f(); }\nvoid setup() { Runnable r = new Runnable() { void run() { } }; }\nclass C { void t() { } private void p() { } protected void q() { } }\n" }]);
    const text = printAst(sketch.decl);
    expect(text).toContain("(MethodDecl [public] (VoidType) setup");
    expect(text).toContain("(MethodDecl [public] (VoidType) run");
    expect(text).toContain("(MethodDecl [public] (VoidType) t");
    expect(text).toContain("(MethodDecl [private] (VoidType) p");
    expect(text).toContain("(MethodDecl [protected] (VoidType) q");
    expect(text).toContain("(InterfaceDecl I (body (MethodDecl (VoidType) f)))");
  });

  it("static mode: all statements, local classes included, go into setup() followed by noLoop()", () => {
    const { sketch } = build([{ name: "s.pde", text: "size(320, 240);\nclass P { int v = 3; }\nprintln(new P().v);\n" }]);
    expect(sketch.mode).toBe("static");
    expect(sketch.decl.body.map((m) => m.kind === "MethodDecl" && m.name.text)).toEqual(["settings", "setup"]);
    const setup = sketch.decl.body[1];
    expect(setup.kind === "MethodDecl" && setup.modifiers & Modifier.Public).toBeTruthy();
    expect(printAst(setup)).toMatch(/^\(MethodDecl \[public\] \(VoidType\) setup \(Block \(body \(Empty\) \(ClassDecl P .*\) \(ExprStmt \(MethodCall println .*\)\) \(ExprStmt \(MethodCall noLoop\)\)\)\)\)$/);
  });

  // Each case: the sketch, then settings() as Processing generates it ("" = none) and what stays in setup().
  const settingsCases: [string, string, string][] = [
    ["void setup() { background(0); size(400, 300, P2D); smooth(4); pixelDensity(1); fill(255); }", "size(400, 300, P2D); pixelDensity(1); smooth(4);", "background(0); fill(255);"],
    ["int w = 400; void setup() { size(w, 300); }", "", "size(w, 300);"],
    ["void setup() { size(displayWidth / 2, 400); }", "", "size(displayWidth / 2, 400);"],
    ["void setup() { size(400, int(300.5)); }", "", "size(400, int(300.5));"],
    ["void setup() { size(400, (int) 300.5 * 2 + -1); }", "size(400, (int) 300.5 * 2 + -1);", ""],
    ["void setup() { if (true) { size(200, 200); } noSmooth(); }", "noSmooth();", "if (true) { size(200, 200); }"],
    ["void setup() { smooth(); noSmooth(); pixelDensity(2); fullScreen(); size(400, 300); }", "fullScreen(); pixelDensity(2); noSmooth(); smooth();", ""],
    ["void setup() { size(200, 200); size(300, 300); smooth(2); smooth(4); }", "size(300, 300); smooth(4);", ""],
    ["void setup() { this.size(200, 200); g.smooth(); }", "this.size(200, 200);", "g.smooth();"],
    ["void setup() { } void draw() { size(100, 100); } class A { void setup() { size(300, 200); } }", "size(300, 200);", ""],
    ["if (true) { size(300, 300); }\nsmooth();", "smooth();", "if (true) { size(300, 300); } noLoop()"],
  ];
  it.each(settingsCases)("moves size()/fullScreen()/pixelDensity()/smooth() to settings(): %s", (text, settings, rest) => {
    const { sketch, p } = build([{ name: "s.pde", text }]);
    const method = (name: string) => sketch.decl.body.find((m) => m.kind === "MethodDecl" && m.name.text === name) as import("../../src/compiler/ast.ts").MethodDecl | undefined;
    const code = (m: import("../../src/compiler/ast.ts").MethodDecl | undefined) =>
      (m?.body?.body ?? []).filter((s) => s.kind !== "Empty").map((s) => (s.synthetic ? "noLoop()" : p.source.slice(s.start, s.end))).join(" ");
    expect(code(method("settings"))).toBe(settings);
    expect(code(sketch.decl.body.find((m) => m.kind === "MethodDecl" && m.name.text === "setup" && !m.synthetic) as never ?? method("setup"))).toBe(rest);
  });

  it("Java mode: a public static main() and only classes at the top level; the code is kept as written", () => {
    const { sketch, diagnostics } = build([{
      name: "J.pde",
      text: "import java.util.*;\npublic class J extends PApplet {\n  public void setup() { size(200, 200); }\n  void draw() { }\n  public static void main(String[] a) { PApplet.main(\"J\"); }\n}\nclass Helper { }\n",
    }]);
    expect(diagnostics).toEqual([]);
    expect(sketch.mode).toBe("java");
    expect(sketch.decl.synthetic).toBeUndefined();
    expect(sketch.decl.body.map((m) => m.kind === "ClassDecl" || m.kind === "MethodDecl" ? m.name.text : m.kind)).toEqual(["setup", "draw", "main", "Helper"]);
    expect([...sketch.topLevel].map((t) => t.kind === "ClassDecl" && t.name.text)).toEqual(["Helper"]);
    // draw() becomes public; size() is blanked and no settings() is generated (as Processing does).
    expect(printAst(sketch.decl.body[1])).toMatch(/^\(MethodDecl \[public\] \(VoidType\) draw/);
    expect(printAst(sketch.decl.body[0])).toContain("(Block (body (Empty)))");
  });

  it("Java mode needs main(); a class named like the sketch alone is static mode", () => {
    expect(build([{ name: "K.pde", text: "public class K extends PApplet {\n  public void setup() { }\n}\n" }]).sketch.mode).toBe("static");
    const { diagnostics, p } = build([{ name: "K.pde", text: "public class Other extends PApplet {\n  public static void main(String[] a) { }\n}\n" }]);
    expect(diagnostics.map((d) => `${p.source.locate(d.start).line}: ${d.message}`)).toEqual([
      "1: The public type Other must be defined in its own file",
      "1: Java mode: the sketch has no class named K (the sketch class, extending PApplet)",
    ]);
  });

  it("rejects statements next to functions (mixed modes)", () => {
    const { diagnostics, p } = build([{ name: "s.pde", text: "size(200, 200);\nvoid draw() { }\n" }]);
    expect(diagnostics.map((d) => `${p.source.locate(d.start).line}: ${d.code}`)).toEqual(["1: mixed-modes"]);
  });
});
