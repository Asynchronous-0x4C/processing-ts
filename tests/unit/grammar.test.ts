import { describe, expect, it } from "vitest";
import { parser } from "../../src/compiler/grammar/parser";

function parse(source: string) {
  const tree = parser.parse(source);
  let error = -1;
  tree.iterate({ enter: (n) => { if (error < 0 && n.type.isError) error = n.from; } });
  return { tree, error, text: tree.toString() };
}

describe("Processing Lezer grammar", () => {
  it("accepts top-level method declarations (active mode)", () => {
    const { error, tree } = parse("int x = 1;\nvoid setup() {\n  size(100, 100);\n}\nvoid draw() {}\n");
    expect(error).toBe(-1);
    const top: string[] = [];
    for (let c = tree.topNode.firstChild; c; c = c.nextSibling) top.push(c.name);
    expect(top).toEqual(["LocalVariableDeclaration", "MethodDeclaration", "MethodDeclaration"]);
  });

  it("accepts bare statements (static mode)", () => {
    expect(parse("size(100, 100);\nfor (int i = 0; i < 3; i++) point(i, i);\n").error).toBe(-1);
  });

  it("parses #RRGGBB and #AARRGGBB as ColorLiteral and rejects other lengths", () => {
    expect(parse("color a = #FF8800; color b = #80FFFFFF;").text.match(/ColorLiteral/g)).toHaveLength(2);
    expect(parse("color c = #FF88;").error).toBeGreaterThanOrEqual(0);
  });

  it("parses conversion functions on primitive type names", () => {
    const { error, text } = parse("int a = int(3.5); float b = float(\"1\"); char c = char(65);");
    expect(error).toBe(-1);
    expect(text.match(/ConversionCall/g)).toHaveLength(3);
  });

  it("still parses casts and class literals with primitive types", () => {
    const { error, text } = parse("void f() { int a = (int) 3.5; Class<?> k = int.class; }");
    expect(error).toBe(-1);
    expect(text).toContain("CastExpression");
    expect(text).toContain("ClassLiteral");
  });

  it("accepts default methods in interfaces", () => {
    expect(parse("interface S {\n  default float area() { return 0; }\n}\n").error).toBe(-1);
  });

  it("rejects primitive type names used as variable names", () => {
    expect(parse("void setup() { int float = 3; }").error).toBeGreaterThanOrEqual(0);
  });
});
