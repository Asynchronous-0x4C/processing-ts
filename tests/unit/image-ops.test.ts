// Values recorded from Processing 4.5.2 (see tests/visual/cases/image_filter and image_blend).
import { describe, expect, it } from "vitest";
import { BLUR, GRAY, POSTERIZE, THRESHOLD, blendColor, filterPixels } from "../../src/lib/runtime/util/imageOps";

const hex = (c: number) => (c >>> 0).toString(16).toUpperCase().padStart(8, "0");

describe("filter", () => {
  it("GRAY, THRESHOLD and POSTERIZE per pixel", () => {
    const px = Int32Array.from([0xff123456, 0x80ff8040, 0xff7f7f7f, 0xff808080]);
    filterPixels(px, 4, 1, 2, GRAY);
    expect([...px].map(hex)).toEqual(["FF2D2D2D", "809F9F9F", "FF7F7F7F", "FF808080"]);
    const t = Int32Array.from([0xff7f7f7f, 0xff808080, 0xff123456]);
    filterPixels(t, 3, 1, 1, THRESHOLD, 0.502);
    expect([...t].map(hex)).toEqual(["FF000000", "FFFFFFFF", "FF000000"]);
    const p = Int32Array.from([0xff808080, 0xff123456]);
    filterPixels(p, 2, 1, 1, POSTERIZE, 7);
    expect([...p].map(hex)).toEqual(["FF7F7F7F", "FF002A55"]);
  });

  it("BLUR: the kernel (R - |k|)^2 with R = 3.5 r, limited to half the smaller side", () => {
    const n = 31;
    const px = new Int32Array(n * n).fill(0xff000000 | 0);
    px[15 * n + 15] = 0xffffffff | 0;
    filterPixels(px, n, n, 1, BLUR, 1);
    expect(Array.from(px.subarray(15 * n + 12, 15 * n + 19), (c) => c & 255)).toEqual([0, 6, 25, 56, 25, 6, 0]);
    const small = new Int32Array(16).fill(0xff000000 | 0);
    for (let y = 0; y < 4; y++) small[y * 4] = 0xffffffff | 0;
    filterPixels(small, 4, 4, 1, BLUR, 1);
    expect(Array.from(small.subarray(0, 4), (c) => c & 255)).toEqual([204, 42, 0, 0]);
  });
});

describe("blendColor", () => {
  it("matches Processing for the integer modes", () => {
    // dst, src, mode, expected
    const cases: [number, number, number, string][] = [
      [0xff0000ff, 0xff0064ff, 1, "FF0064FF"],
      [0x6420df60, 0x80a0045f, 1, "E460705F"],
      [0xff20df60, 0xff2084df, 8192, "FF01DB4A"], // BURN uses the source's blue for every channel
      [0xff00ff00, 0xff0064ff, 64, "FF009BFF"],
      [0xff7f807d, 0xff0165fe, 64, "FF7F8083"],
    ];
    for (const [d, s, m, want] of cases) expect(hex(blendColor(d | 0, s | 0, m))).toBe(want);
  });
});
