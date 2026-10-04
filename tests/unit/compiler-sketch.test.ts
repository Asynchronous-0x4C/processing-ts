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
    expect(sketch.decl.body).toHaveLength(1);
    const setup = sketch.decl.body[0];
    expect(setup.kind === "MethodDecl" && setup.name.text).toBe("setup");
    expect(setup.kind === "MethodDecl" && setup.modifiers & Modifier.Public).toBeTruthy();
    expect(printAst(setup)).toMatch(/^\(MethodDecl \[public\] \(VoidType\) setup \(Block \(body \(ExprStmt \(MethodCall size .*\)\) \(ClassDecl P .*\) \(ExprStmt \(MethodCall println .*\)\) \(ExprStmt \(MethodCall noLoop\)\)\)\)\)$/);
  });

  it("rejects statements next to functions (mixed modes)", () => {
    const { diagnostics, p } = build([{ name: "s.pde", text: "size(200, 200);\nvoid draw() { }\n" }]);
    expect(diagnostics.map((d) => `${p.source.locate(d.start).line}: ${d.code}`)).toEqual(["1: mixed-modes"]);
  });
});
