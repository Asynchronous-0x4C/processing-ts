// The sketch's worker (Worker execution mode, ROADMAP P4-4): runs the sketch with DefaultRunner on the
// OffscreenCanvas transferred from the page. The page's side is WorkerRunner (protocol.ts for the messages).
// The page can end the worker at any time (stopSketch()), even in an endless loop.
import { setSurfaceHost } from "../PSurface";
import { DefaultRunner, type Rect, type RunnerHost } from "../runner/DefaultRunner";
import type { SketchFunction } from "../../types";
import type { EventData, FromWorker, ToWorker } from "./protocol";

const scope = globalThis as unknown as {
  postMessage(message: FromWorker, transfer?: Transferable[]): void;
  onmessage: ((e: MessageEvent<ToWorker>) => void) | null;
  devicePixelRatio?: number;
};
const post = (m: FromWorker, transfer: Transferable[] = []) => scope.postMessage(m, transfer);

class WorkerSideRunner extends DefaultRunner {
  rect: Rect = { left: 0, top: 0, width: 0, height: 0 };
  dpr = 1;
  focused = false;

  element_rect(): Rect {
    return this.rect;
  }

  device_pixel_ratio(): number {
    return this.dpr;
  }

  has_focus(): boolean {
    return this.focused;
  }

  protected surface_ready() {
    const a = this.applet!;
    post({ type: "size", width: a.width, height: a.height, fullscreen: a.__fullscreen__ });
  }
}

let runner: WorkerSideRunner | null = null;

/** Events in the order the page saw them, applied before the next frame (as on the page). */
function dispatch(r: WorkerSideRunner, e: EventData) {
  const ev = e as unknown as PointerEvent & KeyboardEvent & WheelEvent;
  switch (e.kind) {
    case "pointermove": return r.on_pointermove(ev);
    case "pointerdown": return r.on_pointerdown(ev);
    case "pointerup": return r.on_pointerup(ev);
    case "pointerenter": return r.on_pointerenter(ev);
    case "pointerleave": return r.on_pointerleave(ev);
    case "keydown": return r.on_keydown(ev);
    case "keyup": return r.on_keyup(ev);
    case "wheel": return r.on_wheel(ev);
  }
}

async function init(m: Extract<ToWorker, { type: "init" }>) {
  scope.devicePixelRatio = m.dpr;
  const host: RunnerHost = {
    target_element: m.canvas,
    base_uri: m.base_uri,
    provided_files: new Map(m.files),
    settings: { frameRate: m.frameRate, manual_step: m.manual_step },
  };
  const r = (runner = new WorkerSideRunner(host));
  r.rect = m.rect;
  r.dpr = m.dpr;
  r.focused = m.focused;
  r.addEventListener("log", (args) => post({ type: "log", args }));
  r.addEventListener("error", (message) => post({ type: "error", message: String(message) }));
  r.addEventListener("save", (file) => post({ type: "save", file }));
  setSurfaceHost({
    cursor: (css) => post({ type: "cursor", css }),
    cursorImage: (image, x, y) => post({ type: "cursorImage", image, x, y }, [image]),
    title: (title) => post({ type: "title", title }),
  });
  // A precompiled sketch's function crosses as its source (it uses nothing but its two parameters).
  const sketch: string | SketchFunction = m.isFunction ? (new Function(`return (${m.code})`)() as SketchFunction) : m.code;
  await r.init(sketch, null, m.options);
  post({ type: "ready", ok: r.initiated });
}

scope.onmessage = (e) => {
  const m = e.data;
  const r = runner;
  switch (m.type) {
    case "init":
      void init(m);
      break;
    case "event":
      if (!r) break;
      r.rect = m.rect;
      dispatch(r, m.event);
      break;
    case "rect":
      if (!r) break;
      r.rect = m.rect;
      r.dpr = m.dpr;
      r.set_scaling();
      break;
    case "focus":
      if (!r) break;
      r.focused = m.focused;
      if (m.focused) r.on_focus();
      else r.on_blur();
      break;
    case "resize":
      r?.on_resize();
      break;
    case "step":
      void (r ? r.step() : Promise.resolve(0)).then((code) => post({ type: "stepped", id: m.id, code }));
      break;
    case "flush":
      r?.flushOutput();
      post({ type: "flushed", id: m.id });
      break;
    case "capture": {
      const canvas = r?.manager.target_element as OffscreenCanvas | undefined;
      const blob = canvas ? canvas.convertToBlob({ type: m.mime }) : Promise.resolve(null);
      void blob.then((b) => post({ type: "captured", id: m.id, blob: b }), () => post({ type: "captured", id: m.id, blob: null }));
      break;
    }
  }
};
