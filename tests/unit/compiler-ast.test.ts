import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { forEachChild, printAst, walk, type Node } from "../../src/compiler/ast.ts";
import { formatDiagnostic } from "../../src/compiler/diagnostics.ts";
import { parseSketch, parseTab } from "../../src/compiler/parse.ts";
import { readSketch } from "../../tools/vt/sketch.ts";

const ROOT = path.resolve(import.meta.dirname, "../..");

/** AST of the single top-level member of `src`, asserting there are no diagnostics. */
function one(src: string): string {
  const r = parseTab(src);
  expect(r.diagnostics.map((d) => formatDiagnostic(r.source, d))).toEqual([]);
  expect(r.file.members).toHaveLength(1);
  return printAst(r.file.members[0]);
}

/** Expression of `x = <expr>;`. */
function expr(src: string): string {
  const m = one(`x = ${src};`).match(/^\(ExprStmt \(Assign = \(Identifier x\) (.*)\)\)$/);
  expect(m).not.toBeNull();
  return m![1];
}

function messages(src: string): string[] {
  const r = parseTab(src);
  return r.diagnostics.map((d) => `${r.source.locate(d.start).line}: ${d.message}`);
}

describe("AST: top level", () => {
  it("keeps active-mode members as written and collects imports", () => {
    const r = parseTab("import java.util.*;\nint x = 1;\nvoid setup() {\n  size(100, 100);\n}\nimport java.io.File;\n");
    expect(r.diagnostics).toEqual([]);
    expect(r.file.imports.map((i) => `${i.name}${i.wildcard ? ".*" : ""}`)).toEqual(["java.util.*", "java.io.File"]);
    expect(r.file.members.map((m) => m.kind)).toEqual(["LocalVar", "MethodDecl"]);
  });

  it("keeps static-mode statements", () => {
    const r = parseTab("size(200, 200);\nfor (int i = 0; i < 3; i++) point(i, i);\n");
    expect(r.file.members.map((m) => m.kind)).toEqual(["ExprStmt", "For"]);
  });
});

describe("AST: Processing specifics", () => {
  it("reads `color` as int and #RRGGBB as an ARGB int", () => {
    expect(one("color c = #FF8800;")).toBe(`(LocalVar (PrimitiveType int color=true) (declarators (VarDeclarator c (IntLiteral ${0xffff8800 | 0}))))`);
    expect(one("color[] cs;")).toBe("(LocalVar (ArrayType (PrimitiveType int color=true)) (declarators (VarDeclarator cs)))");
  });

  it("reads conversion functions", () => {
    expect(expr("int(3.5)")).toBe("(Conversion type=\"int\" (args (FloatLiteral 3.5)))");
    expect(expr("float(\"1\") + char(65)")).toBe("(Binary + (Conversion type=\"float\" (args (StringLiteral \"1\"))) (Conversion type=\"char\" (args (IntLiteral 65))))");
  });
});

describe("AST: expressions", () => {
  it("re-associates binary chains with Java precedences", () => {
    // Lezer puts == and < on one level; Java binds < tighter.
    expect(expr("f == a < b")).toBe("(Binary == (Identifier f) (Binary < (Identifier a) (Identifier b)))");
    expect(expr("a + b * c - d")).toBe("(Binary - (Binary + (Identifier a) (Binary * (Identifier b) (Identifier c))) (Identifier d))");
    expect(expr("a || b && c | d ^ e & f")).toBe(
      "(Binary || (Identifier a) (Binary && (Identifier b) (Binary | (Identifier c) (Binary ^ (Identifier d) (Binary & (Identifier e) (Identifier f))))))");
    expect(expr("a + b instanceof C")).toBe("(InstanceOf (Binary + (Identifier a) (Identifier b)) (ClassType C))");
    expect(expr("(a + b) * c")).toBe("(Binary * (Binary + (Identifier a) (Identifier b)) (Identifier c))");
  });

  it("reads (Name) - x as a subtraction and keeps real casts", () => {
    expect(expr("(N) - 1 * 2")).toBe("(Binary - (Identifier N) (Binary * (IntLiteral 1) (IntLiteral 2)))");
    expect(expr("a * (N) - 1")).toBe("(Binary - (Binary * (Identifier a) (Identifier N)) (IntLiteral 1))");
    expect(expr("(Outer.N) + 1")).toBe("(Binary + (FieldAccess (Identifier Outer) N) (IntLiteral 1))");
    expect(expr("(int) -x")).toBe("(Cast (PrimitiveType int) (Unary - (Identifier x)))");
    // `color` is lowercase, so the grammar sees a parenthesized name; Processing sees a cast.
    expect(expr("(color) -1")).toBe("(Cast (PrimitiveType int color=true) (Unary - (IntLiteral 1)))");
    expect(expr("x * (color) - 1 + 2")).toBe("(Binary + (Binary * (Identifier x) (Cast (PrimitiveType int color=true) (Unary - (IntLiteral 1)))) (IntLiteral 2))");
    expect(expr("(color) x")).toBe("(Cast (PrimitiveType int color=true) (Identifier x))");
    expect(expr("(String) o")).toBe("(Cast (ClassType String) (Identifier o))");
    expect(expr("(A & B) o")).toBe("(Cast (ClassType A) (bounds (ClassType B)) (Identifier o))");
    expect(expr("(float) x / 2")).toBe("(Binary / (Cast (PrimitiveType float) (Identifier x)) (IntLiteral 2))");
  });

  it("reads member access, calls and object creation", () => {
    expect(expr("a.b.c(1)")).toBe("(MethodCall (FieldAccess (Identifier a) b) c (args (IntLiteral 1)))");
    expect(expr("super.f()")).toBe("(MethodCall (Super) f)");
    expect(expr("Outer.this.x")).toBe("(FieldAccess (This (qualifier (Identifier Outer))) x)");
    expect(expr("m[i][j]")).toBe("(ArrayAccess (array (ArrayAccess (array (Identifier m)) (index (Identifier i)))) (index (Identifier j)))");
    expect(expr("new ArrayList<PVector>()")).toBe("(NewObject (ClassType ArrayList (typeArgs (ClassType PVector))))");
    expect(expr("new HashMap<>()")).toBe("(NewObject (ClassType HashMap))");
    expect(expr("outer.new Inner(1)")).toBe("(NewObject (outer (Identifier outer)) (ClassType Inner) (args (IntLiteral 1)))");
    expect(expr("new Runnable() { public void run() {} }")).toBe(
      "(NewObject (ClassType Runnable) (body (MethodDecl [public] (VoidType) run (Block))))");
  });

  it("reads array creation", () => {
    expect(expr("new int[3][]")).toBe("(NewArray (PrimitiveType int) (dimensions (IntLiteral 3) null))");
    expect(expr("new String[] {\"a\", \"b\"}")).toBe("(NewArray (ClassType String) (dimensions null) (initializer (ArrayInit (elements (StringLiteral \"a\") (StringLiteral \"b\")))))");
  });

  it("reads lambdas and method references", () => {
    expect(expr("v -> v + 1")).toBe("(Lambda (params (Param v)) (Binary + (Identifier v) (IntLiteral 1)))");
    expect(expr("(a, b) -> {}")).toBe("(Lambda (params (Param a) (Param b)) (Block))");
    expect(expr("(int a) -> a")).toBe("(Lambda (params (Param (PrimitiveType int) a)) (Identifier a))");
    expect(expr("String::valueOf")).toBe("(MethodRef (ClassType String) valueOf)");
    expect(expr("ArrayList::new")).toBe("(MethodRef (ClassType ArrayList) new)");
  });

  it("reads literals, unary and update expressions", () => {
    expect(expr("-2147483648")).toBe("(Unary - (IntLiteral 2147483648))");
    expect(expr("0xFFFFFFFF")).toBe("(IntLiteral -1)");
    expect(expr("10L")).toBe("(IntLiteral 10 long=true)");
    expect(expr("1.5d")).toBe("(FloatLiteral 1.5 suffix=\"d\")");
    expect(expr("'a'")).toBe("(CharLiteral 97)");
    expect(expr("!done")).toBe("(Unary ! (Identifier done))");
    expect(expr("i++ + ++j")).toBe("(Binary + (Update ++ (Identifier i)) (Update ++ prefix=true (Identifier j)))");
    expect(expr("c ? 1 : 2")).toBe("(Conditional (test (Identifier c)) (consequent (IntLiteral 1)) (alternate (IntLiteral 2)))");
    expect(expr("int[].class")).toBe("(ClassLit (ArrayType (PrimitiveType int)))");
  });
});

describe("AST: statements", () => {
  it("keeps empty statements in branches", () => {
    expect(one("if (x) ; else foo();")).toBe("(If (test (Identifier x)) (consequent (Empty)) (alternate (ExprStmt (MethodCall foo))))");
  });

  it("reads for, for-each and labeled loops", () => {
    expect(one("for (int i = 0, j = 1; i < 3; i++, j--) {}")).toBe(
      "(For (init (LocalVar (PrimitiveType int) (declarators (VarDeclarator i (IntLiteral 0)) (VarDeclarator j (IntLiteral 1))))) (test (Binary < (Identifier i) (IntLiteral 3))) (update (Update ++ (Identifier i)) (Update -- (Identifier j))) (Block))");
    expect(one("for (;;) ;")).toBe("(For (Empty))");
    expect(one("for (final PVector p : points) p.x = 0;")).toBe(
      "(ForEach [final] (ClassType PVector) p (iterable (Identifier points)) (ExprStmt (Assign = (FieldAccess (Identifier p) x) (IntLiteral 0))))");
    expect(one("outer: while (true) { continue outer; }")).toBe("(Labeled (label outer) (While (test (BooleanLiteral true)) (Block (body (Continue (label outer))))))");
  });

  it("groups switch labels with their statements", () => {
    expect(one("switch (k) { case 1: case 2: a(); break; default: b(); }")).toBe(
      "(Switch (discriminant (Identifier k)) (cases (SwitchCase (labels (IntLiteral 1) (IntLiteral 2)) (body (ExprStmt (MethodCall a)) (Break))) (SwitchCase (labels null) (body (ExprStmt (MethodCall b))))))");
  });

  it("reads try with resources, multi-catch and finally", () => {
    expect(one("try (Reader r = open(); other) { } catch (IOException | RuntimeException e) { } finally { }")).toBe(
      "(Try (resources (LocalVar (ClassType Reader) (declarators (VarDeclarator r (MethodCall open)))) (Identifier other)) (block (Block)) (catches (Catch (types (ClassType IOException) (ClassType RuntimeException)) e (Block))) (finally (Block)))");
  });

  it("reads local declarations with C-style array brackets", () => {
    expect(one("int a = 1, b[] = {2};")).toBe("(LocalVar (PrimitiveType int) (declarators (VarDeclarator a (IntLiteral 1)) (VarDeclarator b dims=1 (ArrayInit (elements (IntLiteral 2))))))");
  });
});

describe("AST: declarations", () => {
  it("reads classes with generics, constructors and initializers", () => {
    expect(one("class Box<T extends Comparable<T>> extends Base implements A, B { T v; Box() { this(null); } Box(T v) { super(); this.v = v; } static { } }")).toBe(
      "(ClassDecl Box (typeParams (TypeParam T (bounds (ClassType Comparable (typeArgs (ClassType T)))))) (superclass (ClassType Base)) (interfaces (ClassType A) (ClassType B)) (body " +
      "(FieldDecl (ClassType T) (declarators (VarDeclarator v))) " +
      "(ConstructorDecl Box (call (ConstructorCall (args (NullLiteral)))) (Block)) " +
      "(ConstructorDecl Box (params (Param (ClassType T) v)) (call (ConstructorCall super=true)) (Block (body (ExprStmt (Assign = (FieldAccess (This) v) (Identifier v)))))) " +
      "(Initializer static=true (Block))))");
  });

  it("reads methods with modifiers, annotations, varargs and throws", () => {
    expect(one("@Override public static int[] f(final int a, String... rest) throws Exception { return null; }")).toBe(
      "(MethodDecl [public static] (annotations (Annotation Override)) (ArrayType (PrimitiveType int)) f (params (Param [final] (PrimitiveType int) a) (Param (ClassType String) rest varargs=true)) (throws (ClassType Exception)) (Block (body (Return (NullLiteral)))))");
  });

  it("reads interfaces with default methods and enums with bodies", () => {
    expect(one("interface S { int N = 3; float area(); default String name() { return \"s\"; } }")).toBe(
      "(InterfaceDecl S (body (FieldDecl (PrimitiveType int) (declarators (VarDeclarator N (IntLiteral 3)))) (MethodDecl (PrimitiveType float) area) (MethodDecl [default] (ClassType String) name (Block (body (Return (StringLiteral \"s\")))))))");
    expect(one("enum Dir { UP(1), DOWN(-1) { int f() { return 0; } }; final int d; Dir(int d) { this.d = d; } }")).toBe(
      "(EnumDecl Dir (constants (EnumConstant UP (args (IntLiteral 1))) (EnumConstant DOWN (args (Unary - (IntLiteral 1))) (body (MethodDecl (PrimitiveType int) f (Block (body (Return (IntLiteral 0)))))))) " +
      "(body (FieldDecl [final] (PrimitiveType int) (declarators (VarDeclarator d))) (ConstructorDecl Dir (params (Param (PrimitiveType int) d)) (Block (body (ExprStmt (Assign = (FieldAccess (This) d) (Identifier d))))))))");
  });

  it("reads wildcards and nested generic types", () => {
    expect(one("Map.Entry<String, ? extends List<int[]>> e;")).toBe(
      "(LocalVar (ClassType (qualifier (ClassType Map)) Entry (typeArgs (ClassType String) (WildcardType (bound (ClassType List (typeArgs (ArrayType (PrimitiveType int))))) upper=true))) (declarators (VarDeclarator e)))");
  });
});

describe("positions", () => {
  it("map every node back to its tab, line and column", () => {
    const r = parseSketch([
      { name: "Main.pde", text: "void setup() {\n  size(100, 100);\n}\n" },
      { name: "Ball.pde", text: "class Ball {\n  float x;\n  void move() {\n    x += 1;\n  }\n}\n" },
    ]);
    expect(r.diagnostics).toEqual([]);
    const ball = r.files[1].members[0];
    expect(ball.kind).toBe("ClassDecl");
    let assign: Node | undefined;
    walk(ball, (n) => { if (n.kind === "Assign") assign = n; });
    const loc = r.source.locate(assign!.start);
    expect([loc.tab.name, loc.tabIndex, loc.line, loc.column]).toEqual(["Ball.pde", 1, 4, 5]);
    expect(r.source.slice(assign!.start, assign!.end)).toBe("x += 1");
  });

  it("report diagnostics with the tab name and line", () => {
    const r = parseSketch([
      { name: "Main.pde", text: "void setup() {}\n" },
      { name: "Second.pde", text: "void f() {\n  int a = 3\n}\n" },
    ]);
    expect(r.diagnostics.map((d) => formatDiagnostic(r.source, d))).toEqual(["Second.pde:2:12: error: Missing ';'"]);
  });
});

describe("syntax errors", () => {
  it("names the missing token and where it belongs", () => {
    expect(messages("void f() {\n  int a = 3\n  int b = 4;\n}")).toEqual(["2: Missing ';'"]);
    expect(messages("void f() {\n  foo(a, b;\n  int c = 4;\n}")).toEqual(["2: Missing ')'"]);
    expect(messages("void f() {\n  for (int i = 0; i < 3 i++) {}\n}")).toEqual(["2: Missing ';' in the 'for' header"]);
    expect(messages("void f() {\n  int a = 3 4;\n}")).toEqual(["2: Missing ';' or an operator before '4'"]);
    expect(messages("void f() {\n  foo();\n}\n}\n")).toEqual(["4: Unexpected '}' without a matching '{'"]);
    expect(messages("void f() {\n  String s = \"abc;\n}")).toEqual(["2: Unterminated string: missing '\"'"]);
    expect(messages("/* open\nvoid f() {}")).toEqual(["1: Unterminated comment: missing '*/'"]);
  });

  it("points a missing '}' at the block that is not closed", () => {
    const src = "void a() {\n  if (x) {\n    foo();\n\n}\n\nvoid b() {\n  if (y &&\n      z) {\n    bar();\n  }\n}\n";
    expect(messages(src)).toEqual(["2: Missing '}': this '{' is never closed"]);
    // Missing at the end of the last method: the outermost unclosed block.
    expect(messages("void a() {\n  foo();\n}\nvoid b() {\n  bar();\n")).toEqual(["4: Missing '}': this '{' is never closed"]);
  });

  it("reports what the permissive grammar accepts but Java rejects", () => {
    expect(messages("void f() {\n  a + b;\n  (g());\n}")).toEqual(["2: Not a statement", "3: Not a statement"]);
    expect(messages("void f() {\n  static int x = 1;\n  final int y = 2;\n}")).toEqual(["2: Modifier 'static' is not allowed here"]);
    expect(messages("void f() {\n  import java.util.List;\n}")).toEqual(["2: Import declarations are only allowed at the top level of a tab"]);
    expect(messages("int[] a = new int[];\nint[] b = new int[2] {1, 2};\nint[][] c = new int[][3];")).toEqual([
      "1: Array dimension missing",
      "2: An array creation cannot have both dimension expressions and an initializer",
      "3: Array dimension missing",
      "3: Array dimension expressions must come before empty dimensions",
    ]);
    expect(messages("int a = 2147483648;\nlong b = 0x1FFFFFFFFFFFFFFFFL;")).toEqual(["1: Integer number too large: 2147483648", "2: Integer number too large: 0x1FFFFFFFFFFFFFFFFL"]);
    expect(messages("public public int x;")).toEqual(["1: Repeated modifier 'public'"]);
    expect(messages("void f() {\n  try { }\n}")).toEqual(["2: 'try' without 'catch' or 'finally'"]);
    expect(messages("class A {\n  B() {}\n}")).toEqual(["2: Invalid method declaration; return type required (or a constructor named 'A')"]);
    expect(messages("void f(int... a, int b) {}")).toEqual(["1: A variable-arity parameter must be the last parameter"]);
    expect(messages("package foo;")).toEqual(["1: Package declarations are not supported in sketches"]);
  });
});

// --- robustness over the repository's sketches ----------------------------------------------------

function sketchDirs(): string[] {
  const out: string[] = [];
  const visit = (dir: string) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    if (entries.some((e) => e.isFile() && e.name.endsWith(".pde"))) out.push(dir);
    else for (const e of entries) if (e.isDirectory() && e.name !== "data") visit(path.join(dir, e.name));
  };
  visit(path.join(ROOT, "public/samples"));
  visit(path.join(ROOT, "tests/visual/cases"));
  return out;
}

function checkSpans(file: Node, tabStart: number, tabEnd: number) {
  const bad: string[] = [];
  const check = (n: Node, parent: Node | null) => {
    if (!(n.start <= n.end) || n.start < tabStart || n.end > tabEnd) bad.push(`${n.kind} ${n.start}-${n.end}`);
    if (parent && (n.start < parent.start || n.end > parent.end)) bad.push(`${n.kind} ${n.start}-${n.end} outside ${parent.kind} ${parent.start}-${parent.end}`);
    forEachChild(n, (c) => check(c, n));
  };
  check(file, null);
  return bad;
}

describe("repository sketches", () => {
  const dirs = sketchDirs();

  it("build without diagnostics, with nested spans inside their own tab", () => {
    expect(dirs.length).toBeGreaterThan(30);
    for (const dir of dirs) {
      const sketch = readSketch(dir);
      const r = parseSketch(sketch.files.map((f) => ({ name: f.name, text: f.content })));
      expect(r.diagnostics.map((d) => formatDiagnostic(r.source, d)), dir).toEqual([]);
      r.files.forEach((file, i) => {
        const tab = r.source.tabs[i];
        expect(checkSpans(file, tab.base, tab.base + tab.text.length), `${dir} ${tab.name}`).toEqual([]);
      });
    }
  });

  it("never throw on truncated input (error recovery paths)", () => {
    for (const dir of dirs.slice(0, 12)) {
      const text = readSketch(dir).files[0].content;
      for (let cut = 1; cut < text.length; cut += Math.max(1, Math.floor(text.length / 40))) {
        const r = parseTab(text.slice(0, cut));
        for (const d of r.diagnostics) expect(d.code).not.toBe("internal");
      }
    }
  });
});
