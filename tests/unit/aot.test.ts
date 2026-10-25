import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { compileSketch } from "../../src/compiler/index.ts";
import { sketchModule, usesOpenGL, usesShapes } from "../../src/compiler/module.ts";
import { CompileCache } from "../../src/lib/CompileCache";
import { buildSketch } from "../../src/aot/build.ts";
import { readSketchFolder } from "../../src/aot/sketchFolder.ts";
import processing from "../../src/aot/vite.ts";

const tab = (text: string, name = "Sketch.pde") => ({ name, text });

describe("sketchModule (ahead-of-time modules)", () => {
  it("exports the compiled code as a function with what the runtime needs", async () => {
    const r = compileSketch([tab(`void setup() { size(400, 300, P3D); text("x", 0, 0); PImage i = loadImage("a.png"); }`)]);
    const { code, map } = sketchModule(r, { name: "Sketch", listed: ["data/a.png"], urls: { "data/a.png": "/assets/a-123.png" } });
    expect(code).toMatch(/^export function sketch\(\$rt, __renderer__\) \{$/m);
    expect(code).toContain(`listed: ["data/a.png"]`);
    expect(code).toContain(`"data/a.png": "/assets/a-123.png"`);
    expect(code).toContain("opengl: true");
    expect(code).toContain("usesText: true");
    // The module evaluates (no imports) and its function is the compiled body.
    const mod = await import("data:text/javascript," + encodeURIComponent(code));
    expect(typeof mod.default.sketch).toBe("function");
    expect(mod.default.files).toEqual(["a.png"]);
    // The map is the compiler's, shifted by the line of the function header.
    expect(map!.mappings.startsWith(";")).toBe(true);
    expect(map!.mappings.slice(1)).toBe(r.map!.mappings);
  });

  it("imports bundler URLs and the default font", () => {
    const r = compileSketch([tab(`void draw() { text("hi", 10, 10); }`)]);
    const { code } = sketchModule(r, { name: "Sketch", imports: { "data/a.png": "/abs/a.png?url" }, fontImport: "/f.ttf?url" });
    expect(code).toContain(`import $url0 from "/abs/a.png?url";`);
    expect(code).toContain(`"data/a.png": $url0`);
    expect(code).toContain(`import $font from "/f.ttf?url";`);
    expect(code).toContain("font: $font,");
  });

  it("detects the on-demand modules from the code", () => {
    expect(usesOpenGL(`$p.size(1, 1, "processing.opengl.PGraphics2D")`)).toBe(true);
    expect(usesOpenGL(`$p.size(1, 1)`)).toBe(false);
    expect(usesShapes(`$p.createShape()`)).toBe(true);
  });
});

describe("CompileCache", () => {
  const data = (text: string) => ({ main: "A.pde", content: [{ name: "B.pde", content: "int b;" }, { name: "A.pde", content: text }] });

  it("keys sketches by their tabs (main first) and keeps only compiled ones", () => {
    const c = new CompileCache({ name: null });
    expect(c.key(data("void setup() {}"))).toBe(c.key(data("void setup() {}")));
    expect(c.key(data("void setup() {}"))).not.toBe(c.key(data("void setup() { }")));
    // The main tab goes first whatever the order of `content` is.
    const swapped = { main: "A.pde", content: [...data("x").content].reverse() };
    expect(c.key(swapped)).toBe(c.key(data("x")));
    c.put("k", { result: "", error: null });
    expect(c.getSync("k")).toBeUndefined();
    c.put("k", { result: "code", error: null, usesText: true, files: ["a.png"] });
    expect(c.getSync("k")).toMatchObject({ result: "code", usesText: true, files: ["a.png"], error: null });
  });

  it("drops the least recently used sketches", () => {
    const c = new CompileCache({ name: null, maxEntries: 2 });
    for (const k of ["a", "b"]) c.put(k, { result: k, error: null });
    c.getSync("a");
    c.put("c", { result: "c", error: null });
    expect(c.getSync("b")).toBeUndefined();
    expect(c.getSync("a")?.result).toBe("a");
    expect(c.getSync("c")?.result).toBe("c");
  });
});

describe("processing-ts build / Vite plugin", () => {
  const cases = path.resolve(import.meta.dirname, "../visual/cases");

  it("reads a sketch folder in Processing's order with its data files", () => {
    const f = readSketchFolder(path.join(cases, "multi_tab"));
    expect(f.main).toBe("multi_tab.pde");
    expect(f.tabs[0].name).toBe("multi_tab.pde");
    expect(f.tabs.slice(1).map((t) => t.name)).toEqual([...f.tabs.slice(1).map((t) => t.name)].sort());
    expect(readSketchFolder(path.join(cases, "files_load")).dataFiles).toContain("data/sub/frame0.png");
  });

  it("writes the page, the module, the data and the files next to the tabs the sketch names", async () => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), "pts-build-"));
    try {
      const r = await buildSketch(path.join(cases, "files_load"), { out, runtime: "https://cdn.example/processing-ts/", sw: true });
      expect(r.ok).toBe(true);
      expect(fs.existsSync(path.join(out, "data/sub/frame0.png"))).toBe(true);
      expect(fs.existsSync(path.join(out, "root.txt"))).toBe(true);
      expect(fs.existsSync(path.join(out, "processing-ts"))).toBe(false);
      const html = fs.readFileSync(path.join(out, "index.html"), "utf8");
      expect(html).toContain(`"https://cdn.example/processing-ts/runtime.js"`);
      expect(html).toContain(`serviceWorker.register("./sw.js")`);
      const sw = fs.readFileSync(path.join(out, "sw.js"), "utf8");
      const files: string[] = JSON.parse(/const FILES = (\[[\s\S]*?\]);/.exec(sw)![1]);
      expect(new Set(files).size).toBe(files.length);
      expect(files).toContain("./root.txt");
    } finally {
      fs.rmSync(out, { recursive: true, force: true });
    }
  });

  it("reports compile errors with the tab, line and column", async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "pts-bad-"));
    try {
      fs.writeFileSync(path.join(dir, path.basename(dir) + ".pde"), "void setup() {\n  int x = 1\n}\n");
      const r = await buildSketch(dir, { sketchOnly: true });
      expect(r.ok).toBe(false);
      expect(r.errors[0]).toMatch(/\.pde:2:\d+: error: /);
      const plugin = processing();
      const id = plugin.resolveId(dir + "/?pde", undefined)!;
      expect(() => plugin.load.call({ addWatchFile() {}, error: (m: string) => { throw new Error(m); } }, id)).toThrow(/:2:\d+: error: /);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});

import { parseXml } from "../../src/lib/runtime/io/xmlLite";

describe("parseXml (SVG in workers, where there is no DOMParser)", () => {
  it("reads elements, attributes and namespaces as Element does", () => {
    const root = parseXml(`<?xml version="1.0"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd" [ <!ENTITY e "x"> ]>
<!-- comment <rect/> -->
<svg:svg xmlns:svg="http://www.w3.org/2000/svg" width='100' height="50">
  <g id="a&amp;b" transform="translate(1, 2)"><rect x="1" y="2"/><![CDATA[<circle/>]]>text</g>
  <path d="M 0 0 L 10 10" style="fill:#ff0000"></path>
</svg:svg>`)!;
    expect(root.localName).toBe("svg");
    expect(root.getAttribute("width")).toBe("100");
    expect(root.getAttribute("missing")).toBeNull();
    expect(Array.from(root.children).map((c) => c.localName)).toEqual(["g", "path"]);
    const g = root.children[0];
    expect(g.getAttribute("id")).toBe("a&b");
    expect(g.hasAttribute("transform")).toBe(true);
    expect(Array.from(g.children).map((c) => c.localName)).toEqual(["rect"]);
    expect(root.children[1].getAttribute("d")).toBe("M 0 0 L 10 10");
  });

  it("returns null for broken markup", () => {
    expect(parseXml("<svg width=\"1\"")).toBeNull();
    expect(parseXml("no markup")).toBeNull();
  });
});

import { WARM_UP_SKETCH } from "../../src/lib/SketchManager";

describe("SketchManager.warmUp()", () => {
  it("compiles its sketch without diagnostics", () => {
    const r = compileSketch([{ name: "WarmUp.pde", text: WARM_UP_SKETCH }]);
    expect(r.diagnostics).toEqual([]);
    expect(r.code).not.toBeNull();
  });
});
