import { describe, expect, it } from "vitest";
import { PVector } from "../../src/lib/runtime/util/PVector";

describe("PVector", () => {
  it("adds and subtracts vectors and components", () => {
    const v = new PVector(1, 2, 3);
    v.add(new PVector(1, 1, 1));
    expect([v.x, v.y, v.z]).toEqual([2, 3, 4]);
    v.sub(1, 1);
    expect([v.x, v.y, v.z]).toEqual([1, 2, 4]);
  });

  it("normalizes and limits magnitude", () => {
    const v = new PVector(3, 4);
    expect(v.mag()).toBeCloseTo(5);
    v.normalize();
    expect(v.mag()).toBeCloseTo(1);
    const w = new PVector(30, 40);
    w.limit(10);
    expect(w.mag()).toBeCloseTo(10);
  });
});

describe("PVector in-place semantics (Processing)", () => {
  it("setMag modifies the vector and returns it", () => {
    const v = new PVector(3, 4);
    const r = v.setMag(10);
    expect(r).toBe(v);
    expect(v.mag()).toBeCloseTo(10);
  });

  it("normalize leaves a zero vector unchanged and returns it", () => {
    const v = new PVector(0, 0, 0);
    expect(v.normalize()).toBe(v);
    expect([v.x, v.y, v.z]).toEqual([0, 0, 0]);
  });

  it("div by zero follows float semantics instead of throwing", () => {
    const v = new PVector(1, -1, 0);
    v.div(0);
    expect(v.x).toBe(Infinity);
    expect(v.y).toBe(-Infinity);
    expect(Number.isNaN(v.z)).toBe(true);
  });
});
