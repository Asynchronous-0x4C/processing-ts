import { describe, expect, it } from "vitest";
import { CODED, javaKey, typesCharacter } from "../../src/lib/runtime/event/KeyEvent";

describe("key events", () => {
  it("maps DOM keys to Processing's key and keyCode", () => {
    expect(javaKey("a", 65)).toEqual({ key: 97, keyCode: 65 });
    expect(javaKey("Enter", 13)).toEqual({ key: 10, keyCode: 10 });
    expect(javaKey("Delete", 46)).toEqual({ key: 127, keyCode: 127 });
    expect(javaKey("ArrowUp", 38)).toEqual({ key: CODED, keyCode: 38 });
    expect(javaKey("Shift", 16)).toEqual({ key: CODED, keyCode: 16 });
  });

  it("calls keyTyped only for keys that type a character (as AWT's KEY_TYPED)", () => {
    const typed = (domKey: string, code: number) => typesCharacter(javaKey(domKey, code).key);
    expect(typed("a", 65)).toBe(true);
    expect(typed(" ", 32)).toBe(true);
    for (const [k, c] of [["Enter", 13], ["Backspace", 8], ["Tab", 9], ["Escape", 27], ["Delete", 46]] as const) expect(typed(k, c)).toBe(true);
    for (const [k, c] of [["ArrowLeft", 37], ["Shift", 16], ["Control", 17], ["F1", 112], ["Home", 36]] as const) expect(typed(k, c)).toBe(false);
  });
});
