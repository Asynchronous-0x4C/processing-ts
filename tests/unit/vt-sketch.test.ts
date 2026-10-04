import { describe, expect, it } from "vitest";
import { blankCommentsAndStrings, detectMode, injectForReference } from "../../tools/vt/sketch.ts";

describe("blankCommentsAndStrings", () => {
  it("keeps offsets and newlines while blanking comments and literals", () => {
    const src = 'int a = 1; // size(1,2)\nString s = "void f() {";\n/* x */ char c = \'{\';';
    const out = blankCommentsAndStrings(src);
    expect(out.length).toBe(src.length);
    expect(out.split("\n").length).toBe(src.split("\n").length);
    expect(out).not.toContain("size");
    expect(out).not.toContain("void f()");
    expect(out).not.toContain("{");
  });
});

describe("detectMode", () => {
  it("detects active mode from top-level method declarations", () => {
    expect(detectMode([{ content: "void setup() {\n  size(100, 100);\n}\n" }])).toBe("active");
    expect(detectMode([{ content: "int[] make(int n) {\n  return new int[n];\n}\n" }])).toBe("active");
  });

  it("detects static mode for bare statements, including control flow", () => {
    const src = "size(100, 100);\nif (width > 50) {\n  background(0);\n} else if (width > 10) {\n  background(255);\n}\nfor (int i = 0; i < 3; i++) {\n  point(i, i);\n}\n";
    expect(detectMode([{ content: src }])).toBe("static");
  });

  it("ignores methods inside classes and in comments", () => {
    const src = "// void setup() {}\nclass A {\n  void f() {}\n}\nsize(100, 100);\n";
    expect(detectMode([{ content: src }])).toBe("static");
  });
});

describe("injectForReference", () => {
  it("inserts pixelDensity(1) after size() and appends the capture hook in active mode", () => {
    const out = injectForReference("void setup() {\n  size(320, 240);\n}\n", "active", 3, "C:\\out\\f.png");
    expect(out).toContain("size(320, 240); pixelDensity(1);");
    expect(out).toContain("public void handleDraw()");
    expect(out).toContain("frameCount > 3");
    expect(out).toContain('save("C:/out/f.png")');
    // Line numbers of the original code are unchanged.
    expect(out.split("\n")[1]).toContain("size(320, 240)");
  });

  it("adds settings() when there is no size() call in active mode", () => {
    expect(injectForReference("void draw() {}\n", "active", 1, "/tmp/f.png")).toContain("void settings() { pixelDensity(1); }");
  });

  it("appends save/exit at the end in static mode", () => {
    const out = injectForReference("size(320, 240);\nbackground(0);\n", "static", 1, "/tmp/f.png");
    expect(out.trimEnd().endsWith("exit();")).toBe(true);
    expect(out).not.toContain("handleDraw");
  });
});
