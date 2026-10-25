// Messages between the page (WorkerRunner) and the sketch's worker (entry.ts) in the Worker execution mode
// (SketchSettings.thread "worker", ROADMAP P4-4). DOM events cross as plain objects with the canvas's
// position at the time, so the worker converts mouse coordinates as on the page.
import type { SavedFile } from "../io/SketchFiles";
import type { Rect, RunOptions } from "../runner/DefaultRunner";

/** The fields of DOM pointer/keyboard/wheel events the runner reads. */
export type EventData = {
  kind: "pointermove" | "pointerdown" | "pointerup" | "pointerenter" | "pointerleave" | "keydown" | "keyup" | "wheel";
  clientX: number;
  clientY: number;
  button: number;
  buttons: number;
  key: string;
  keyCode: number;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  metaKey: boolean;
  repeat: boolean;
  deltaX: number;
  deltaY: number;
  deltaMode: number;
};

/**
 * init: the sketch (compiled code, or a precompiled function's source), its files, the OffscreenCanvas
 * and the page's state. The worker answers "ready" after setup().
 */
export type ToWorker =
  | {
      type: "init";
      canvas: OffscreenCanvas;
      code: string;
      isFunction: boolean;
      options: RunOptions;
      base_uri: string;
      files: [string, Uint8Array | string][];
      frameRate: number;
      manual_step: boolean;
      rect: Rect;
      dpr: number;
      focused: boolean;
    }
  | { type: "event"; event: EventData; rect: Rect }
  | { type: "rect"; rect: Rect; dpr: number }
  | { type: "focus"; focused: boolean }
  | { type: "resize" }
  | { type: "step"; id: number }
  | { type: "flush"; id: number }
  | { type: "capture"; id: number; mime: string };

export type FromWorker =
  | { type: "ready"; ok: boolean }
  | { type: "size"; width: number; height: number; fullscreen: boolean }
  | { type: "log"; args: unknown[] }
  | { type: "error"; message: string }
  | { type: "save"; file: SavedFile }
  | { type: "cursor"; css: string }
  | { type: "cursorImage"; image: ImageBitmap; x: number; y: number }
  | { type: "title"; title: string }
  | { type: "stepped"; id: number; code: number }
  | { type: "flushed"; id: number }
  | { type: "captured"; id: number; blob: Blob | null };

export function eventData(kind: EventData["kind"], e: globalThis.MouseEvent | KeyboardEvent | WheelEvent): EventData {
  const m = e as Partial<globalThis.MouseEvent & WheelEvent>;
  const k = e as Partial<KeyboardEvent>;
  return {
    kind,
    clientX: m.clientX ?? 0,
    clientY: m.clientY ?? 0,
    button: m.button ?? 0,
    buttons: m.buttons ?? 0,
    key: k.key ?? "",
    keyCode: k.keyCode ?? 0,
    ctrlKey: e.ctrlKey,
    shiftKey: e.shiftKey,
    altKey: e.altKey,
    metaKey: e.metaKey,
    repeat: k.repeat ?? false,
    deltaX: m.deltaX ?? 0,
    deltaY: m.deltaY ?? 0,
    deltaMode: m.deltaMode ?? 0,
  };
}
