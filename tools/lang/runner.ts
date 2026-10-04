// Run a sketch compiled by the new compiler in Node, without drawing: a stub PApplet accepts every
// drawing call. Used to check language semantics through println output (ROADMAP P1-5/P1-8).
import { compileSketch, formatDiagnostic } from "../../src/compiler/index.ts";
import { javaClasses, lang } from "../../src/runtime/lang/index.ts";

export interface RunResult {
  /** Compile errors (formatted); empty when the sketch compiled. */
  errors: string[];
  stdout: string;
  /** Uncaught exception, formatted like Java's toString(). */
  exception?: string;
  code?: string;
}

/** A PApplet stand-in: Processing variables and no-op drawing functions. */
function stubPApplet() {
  class StubPApplet {
    width = 100;
    height = 100;
    frameCount = 0;
    mouseX = 0;
    mouseY = 0;
    pmouseX = 0;
    pmouseY = 0;
    mousePressed = false;
    keyPressed = false;
    key = 0;
    keyCode = 0;
    frameRate = 60;
    __loop__ = true;
    constructor(_r?: unknown) {
      return new Proxy(this, {
        get(t, k, r) {
          if (k in t) return Reflect.get(t, k, r);
          return typeof k === "string" && !k.startsWith("__") ? () => 0 : undefined;
        },
      });
    }
    size(w: number, h: number) {
      this.width = w;
      this.height = h;
    }
    noLoop() {
      this.__loop__ = false;
    }
    loop() {
      this.__loop__ = true;
    }
    millis() {
      return 0;
    }
    color(...a: number[]) {
      return a.length >= 3 ? (0xff000000 | (a[0] << 16) | (a[1] << 8) | a[2]) | 0 : a[0] | 0;
    }
  }
  return StubPApplet;
}

export async function runSketch(tabs: { name: string; text: string }[], opts: { frames?: number } = {}): Promise<RunResult> {
  const c = compileSketch(tabs);
  if (c.code === null) return { errors: c.diagnostics.filter((d) => d.severity === "error").map((d) => formatDiagnostic(c.parse.source, d)), stdout: "" };
  const code = c.code;
  let stdout = "";
  lang.setOutput((s) => (stdout += s));
  const rt = { lang, PApplet: stubPApplet(), classes: { ...javaClasses } };
  try {
    const sketch = new Function("$rt", "__renderer__", code)(rt, {}) as Record<string, (() => unknown) | number | boolean>;
    const call = async (name: string) => {
      if (typeof sketch[name] === "function") await (sketch[name] as () => unknown)();
    };
    await call("settings");
    await call("setup");
    for (let i = 0; i < (opts.frames ?? 1); i++) {
      if (!sketch.__loop__ && i > 0) break;
      (sketch as Record<string, number>).frameCount = i + 1;
      await call("draw");
      if (!sketch.__loop__) break;
    }
  } catch (e) {
    const j = lang.toJava(e);
    return { errors: [], stdout, exception: j.toString() + (e instanceof Error && !(e instanceof lang.Throwable) ? `\n${e.stack}` : ""), code };
  }
  return { errors: [], stdout, code };
}
