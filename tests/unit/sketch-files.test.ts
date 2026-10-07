import { afterEach, describe, expect, it, vi } from "vitest";
import { SketchFiles, normalizePath } from "../../src/lib/runtime/io/SketchFiles";
import { encodeTGA, encodeTIFF } from "../../src/lib/runtime/io/imageEncode";

describe("SketchFiles", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("looks in data/ first, then in the sketch folder, as Processing", () => {
    const f = new SketchFiles("http://host/sketch/");
    expect(f.candidates("a.png")).toEqual(["data/a.png", "a.png"]);
    expect(f.candidates("./sub/../a.png")).toEqual(["data/a.png", "a.png"]);
    expect(f.candidates("data/a.png")).toEqual(["data/a.png", "data/data/a.png"]);
    expect(f.candidates("http://x/y.png")).toEqual(["http://x/y.png"]);
    expect(normalizePath("a\\b/./c/../d")).toBe("a/b/d");
  });

  it("fetches the named and listed files before the sketch runs", async () => {
    const served: Record<string, string> = {
      "http://host/sketch/data/t.txt": "in data",
      "http://host/sketch/r.txt": "in folder",
      "http://host/sketch/data/frame1.txt": "listed",
      "http://host/sketch/data/page.txt": "<html>",
    };
    const fetched: string[] = [];
    vi.stubGlobal("fetch", async (url: string) => {
      fetched.push(url);
      const body = served[url];
      // a dev server's fallback page for unknown paths
      if (url.endsWith("page.txt") || body === undefined) return new Response("<!doctype html>", { status: url.endsWith("page.txt") ? 200 : 404, headers: { "content-type": "text/html" } });
      return new Response(body, { status: 200, headers: { "content-type": "text/plain" } });
    });
    const f = new SketchFiles("http://host/sketch/");
    f.add("data/mem.txt", "from host");
    await f.preload(["t.txt", "r.txt", "missing.txt", "page.txt", "mem.txt"], ["data/frame1.txt"]);
    expect(f.text("t.txt")).toBe("in data");
    expect(f.text("r.txt")).toBe("in folder");
    expect(f.text("frame1.txt")).toBe("listed");
    expect(f.text("mem.txt")).toBe("from host");
    expect(f.text("missing.txt")).toBeNull();
    expect(f.text("page.txt")).toBeNull();
    expect(fetched).not.toContain("http://host/sketch/data/mem.txt");
  });

  it("keeps what the sketch saves, relative to the sketch folder, and reports it", () => {
    const f = new SketchFiles("");
    const saved: string[] = [];
    f.onSave = (s) => saved.push(`${s.path} ${s.mime} ${s.data.length}`);
    f.save("out/../o.txt", "abc");
    expect(f.text("o.txt")).toBe("abc");
    expect(saved).toEqual(["o.txt text/plain 3"]);
  });
});

describe("image encoders", () => {
  const px = Int32Array.from([0xff102030, 0x80405060, 0xff708090, 0x00a0b0c0]);

  it("writes an uncompressed big-endian TIFF", () => {
    const t = encodeTIFF(px, 2, 2);
    const v = new DataView(t.buffer);
    expect([...t.slice(0, 4)]).toEqual([0x4d, 0x4d, 0, 42]);
    const entries = v.getUint16(8);
    const tags = new Map<number, number>();
    for (let i = 0; i < entries; i++) {
      const at = 10 + i * 12;
      tags.set(v.getUint16(at), v.getUint16(at + 2) === 3 && v.getUint32(at + 4) === 1 ? v.getUint16(at + 8) : v.getUint32(at + 8));
    }
    expect(tags.get(256)).toBe(2);
    expect(tags.get(277)).toBe(3);
    const data = tags.get(273)!;
    expect([...t.slice(data, data + 6)]).toEqual([0x10, 0x20, 0x30, 0x40, 0x50, 0x60]);
    const a = encodeTIFF(px, 2, 2, true);
    const av = new DataView(a.buffer);
    const spp = [...Array(av.getUint16(8)).keys()].map((i) => 10 + i * 12).find((at) => av.getUint16(at) === 277)!;
    expect(av.getUint16(spp + 8)).toBe(4);
    expect([...a.slice(a.length - 4)]).toEqual([0xa0, 0xb0, 0xc0, 0x00]);
  });

  it("writes a top-left TGA with BGR(A) pixels", () => {
    const t = encodeTGA(px, 2, 2, true);
    expect(t[2]).toBe(2);
    expect(t[16]).toBe(32);
    expect(t[17]).toBe(0x28);
    expect([...t.slice(18, 26)]).toEqual([0x30, 0x20, 0x10, 0xff, 0x60, 0x50, 0x40, 0x80]);
  });
});
