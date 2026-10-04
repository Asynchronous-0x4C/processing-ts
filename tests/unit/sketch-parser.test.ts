import { describe, expect, it } from "vitest";
import { parseSketch } from "../../src/lib/transpiler/SketchParser";

describe("parseSketch", () => {
  it("parses an active-mode sketch without errors", () => {
    const { error } = parseSketch("void setup() {\n  size(320, 240);\n}\n\nvoid draw() {\n  background(0);\n}\n");
    expect(error.error).toBe(false);
  });

  it("parses Processing extensions (color type, #hex literal, int() conversion)", () => {
    const { error } = parseSketch("color c = #FF8800;\nint x = int(3.5);\nvoid setup() { fill(c); }\n");
    expect(error.error).toBe(false);
  });

  it("reports a syntax error with its position (LL fallback)", () => {
    const { error } = parseSketch("void setup() {\n  int x = 3\n  rect(0, 0, x, x);\n}\n");
    expect(error.error).toBe(true);
    expect(error.message).toContain("missing ';'");
    expect(error.line).toBe(3);
  });

  it("reports errors raised from grammar actions", () => {
    const { error } = parseSketch("void setup() {\n  int float = 3;\n}\n");
    expect(error.error).toBe(true);
    expect(error.message).toContain("Type names are not allowed as variable names");
  });

  it("parses a sketch made only of classes quickly (SLL prediction)", () => {
    const body = Array.from({ length: 200 }, (_, i) => `  int f${i}(int a) { return a * ${i}; }`).join("\n");
    const source = `class Big {\n${body}\n}\n`;
    parseSketch(source); // warm up
    const t = performance.now();
    const { error } = parseSketch(source);
    expect(error.error).toBe(false);
    // Full LL prediction took seconds on inputs like this; SLL takes a few milliseconds.
    expect(performance.now() - t).toBeLessThan(500);
  });
});
