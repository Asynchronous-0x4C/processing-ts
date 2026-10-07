// Input scripts (vt.json "input"): mouse and key actions replayed between frames, in both runs.
// - Processing: AWT events dispatched to the sketch's canvas (surface.getNative()), so they go through
//   PSurfaceAWT's translation into Processing events exactly as OS input does. The AWT event sequence
//   for each action is the one Windows produces (pressed/typed/released, clicked after a press and a
//   release without moving, dragged instead of moved while a button is down).
// - processing-ts: real input through Playwright (page.mouse / page.keyboard → DOM events on the canvas).
// `frame: n` sends the action after n draw() calls (0 = right after setup()); like OS input arriving
// during the next frame, the sketch handles it after the next draw().
import type { Page } from "playwright-core";

export type InputAction =
  | { frame: number; type: "move"; x: number; y: number }
  | { frame: number; type: "down" | "up" | "click"; x: number; y: number; button?: "left" | "middle" | "right" }
  | { frame: number; type: "wheel"; x: number; y: number; delta: number }
  /** `key` is a DOM / Playwright key name: "a", "1", " ", "Enter", "ArrowLeft", "Shift", "Control"... */
  | { frame: number; type: "key" | "keydown" | "keyup"; key: string };

const CHAR_UNDEFINED = 0xffff;

/** AWT key code and character of a DOM key name. */
function awtKey(key: string): { vk: number; ch: number } {
  const named: Record<string, [number, number]> = {
    Enter: [10, 10], Backspace: [8, 8], Tab: [9, 9], Escape: [27, 27], Delete: [127, 127],
    ArrowLeft: [37, CHAR_UNDEFINED], ArrowUp: [38, CHAR_UNDEFINED], ArrowRight: [39, CHAR_UNDEFINED], ArrowDown: [40, CHAR_UNDEFINED],
    Shift: [16, CHAR_UNDEFINED], Control: [17, CHAR_UNDEFINED], Alt: [18, CHAR_UNDEFINED],
    Home: [36, CHAR_UNDEFINED], End: [35, CHAR_UNDEFINED], PageUp: [33, CHAR_UNDEFINED], PageDown: [34, CHAR_UNDEFINED],
    F1: [112, CHAR_UNDEFINED], " ": [32, 32],
  };
  if (key in named) return { vk: named[key][0], ch: named[key][1] };
  if (key.length !== 1) throw new Error(`input: unsupported key ${JSON.stringify(key)}`);
  const c = key.charCodeAt(0);
  if (/[a-z]/i.test(key)) return { vk: key.toUpperCase().charCodeAt(0), ch: c };
  if (/[0-9]/.test(key)) return { vk: c, ch: c };
  const punct: Record<string, number> = { ",": 44, "-": 45, ".": 46, "/": 47, ";": 59, "=": 61, "[": 91, "\\": 92, "]": 93 };
  if (key in punct) return { vk: punct[key], ch: c };
  throw new Error(`input: unsupported key ${JSON.stringify(key)}`);
}

const BUTTONS = { left: { awt: 1, mask: 1 << 10 }, middle: { awt: 2, mask: 1 << 11 }, right: { awt: 3, mask: 1 << 12 } };
const MODIFIER_MASKS: Record<number, number> = { 16: 1 << 6, 17: 1 << 7, 18: 1 << 9 }; // SHIFT/CTRL/ALT_DOWN_MASK

/**
 * Java statements for the reference run: a method `__vtInput(int frame)` that dispatches the AWT events
 * of the actions for that frame to the canvas.
 */
export function javaInputMethod(actions: InputAction[]): string {
  const byFrame = new Map<number, string[]>();
  let buttons = 0; // extended mask of the buttons that are down
  let keyMods = 0;
  let pressAt: { x: number; y: number } | null = null;
  let moved = false;
  let mx = 0, my = 0;
  const mouse = (id: number, mods: number, x: number, y: number, count: number, button: number) =>
    `__c.dispatchEvent(new java.awt.event.MouseEvent(__c, ${id}, __t, ${mods}, ${x}, ${y}, ${count}, false, ${button}));`;
  const key = (id: number, mods: number, vk: number, ch: number) =>
    `__c.dispatchEvent(new java.awt.event.KeyEvent(__c, ${id}, __t, ${mods}, ${vk}, (char) ${ch}));`;
  for (const a of actions) {
    const out: string[] = byFrame.get(a.frame) ?? [];
    byFrame.set(a.frame, out);
    const mods = () => buttons | keyMods;
    switch (a.type) {
      case "move":
        mx = a.x; my = a.y;
        if (buttons) moved = true;
        out.push(mouse(buttons ? 506 : 503, mods(), a.x, a.y, 0, 0)); // MOUSE_DRAGGED / MOUSE_MOVED
        break;
      case "down":
      case "up":
      case "click": {
        const b = BUTTONS[a.button ?? "left"];
        if (a.x !== mx || a.y !== my) {
          mx = a.x; my = a.y;
          if (buttons) moved = true;
          out.push(mouse(buttons ? 506 : 503, mods(), a.x, a.y, 0, 0));
        }
        if (a.type !== "up") {
          buttons |= b.mask;
          pressAt = { x: a.x, y: a.y };
          moved = false;
          out.push(mouse(501, mods(), a.x, a.y, 1, b.awt)); // MOUSE_PRESSED
        }
        if (a.type !== "down") {
          buttons &= ~b.mask;
          out.push(mouse(502, mods(), a.x, a.y, 1, b.awt)); // MOUSE_RELEASED
          if (pressAt && !moved) out.push(mouse(500, mods(), a.x, a.y, 1, b.awt)); // MOUSE_CLICKED
          pressAt = null;
        }
        break;
      }
      case "wheel":
        // MouseWheelEvent(source, MOUSE_WHEEL, when, modifiers, x, y, clickCount, popupTrigger, WHEEL_UNIT_SCROLL, scrollAmount, wheelRotation)
        out.push(`__c.dispatchEvent(new java.awt.event.MouseWheelEvent(__c, 507, __t, ${mods()}, ${a.x}, ${a.y}, 0, false, 0, 3, ${a.delta}));`);
        break;
      case "key":
      case "keydown":
      case "keyup": {
        const { vk, ch } = awtKey(a.key);
        // Control+letter types the control character (Ctrl+A = 1), as on Windows.
        const typed = keyMods & MODIFIER_MASKS[17] && /^[a-z]$/i.test(a.key) ? a.key.toUpperCase().charCodeAt(0) - 64 : ch;
        if (a.type !== "keyup") {
          if (MODIFIER_MASKS[vk]) keyMods |= MODIFIER_MASKS[vk];
          out.push(key(401, keyMods, vk, typed)); // KEY_PRESSED
          if (typed !== CHAR_UNDEFINED) out.push(key(400, keyMods, 0, typed)); // KEY_TYPED (VK_UNDEFINED)
        }
        if (a.type !== "keydown") {
          if (MODIFIER_MASKS[vk]) keyMods &= ~MODIFIER_MASKS[vk];
          out.push(key(402, keyMods, vk, typed)); // KEY_RELEASED
        }
        break;
      }
    }
  }
  const cases = [...byFrame].map(([f, stmts]) => `    case ${f}:\n${stmts.map((s) => "      " + s).join("\n")}\n      break;`);
  return `void __vtInput(int __frame) {
  java.awt.Component __c = (java.awt.Component) surface.getNative();
  long __t = System.currentTimeMillis();
  switch (__frame) {
${cases.join("\n")}
  }
}
`;
}

/** Replay the actions of `frame` with Playwright on the page (the canvas is at `rect`). */
export async function playInput(page: Page, actions: InputAction[], frame: number, rect: { x: number; y: number }) {
  // Playwright sends a mousemove even to the current position; the OS (and the AWT side) does not.
  const at = ((page as unknown as { __vtMouse?: { x: number; y: number } }).__vtMouse ??= { x: NaN, y: NaN });
  const moveTo = async (x: number, y: number) => {
    if (x === at.x && y === at.y) return;
    at.x = x;
    at.y = y;
    await page.mouse.move(rect.x + x, rect.y + y);
  };
  for (const a of actions) {
    if (a.frame !== frame) continue;
    switch (a.type) {
      case "move":
        await moveTo(a.x, a.y);
        break;
      case "down":
      case "up":
      case "click":
        await moveTo(a.x, a.y);
        if (a.type !== "up") await page.mouse.down({ button: a.button ?? "left" });
        if (a.type !== "down") await page.mouse.up({ button: a.button ?? "left" });
        break;
      case "wheel":
        await moveTo(a.x, a.y);
        await page.mouse.wheel(0, a.delta * 100);
        break;
      case "key":
        await page.keyboard.press(a.key);
        break;
      case "keydown":
        await page.keyboard.down(a.key);
        break;
      case "keyup":
        await page.keyboard.up(a.key);
        break;
    }
  }
  // Let the DOM events reach the runner's queue before the next frame.
  // (wheel events are delivered asynchronously, after an animation frame).
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0))));
}
