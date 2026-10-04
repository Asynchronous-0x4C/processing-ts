// Reading sketch folders and preparing them for the reference (Java Processing) run.
import fs from "node:fs";
import path from "node:path";

export type SketchSource = {
  /** Folder that contains the .pde files (and optionally data/). */
  dir: string;
  /** Main tab file name, e.g. "Foo.pde". */
  main: string;
  /** All tabs in Processing order: main first, then the rest alphabetically. */
  files: { name: string; content: string }[];
};

/**
 * Read a sketch folder. The main tab is resolved in this order:
 * `main =` in sketch.properties, `<folder name>.pde`, then the first .pde alphabetically.
 */
export function readSketch(dir: string): SketchSource {
  const pdes = fs.readdirSync(dir).filter((f) => f.endsWith(".pde")).sort();
  if (pdes.length === 0) throw new Error(`No .pde files in ${dir}`);
  let main = pdes[0];
  const folderMain = path.basename(dir) + ".pde";
  if (pdes.includes(folderMain)) main = folderMain;
  const propsPath = path.join(dir, "sketch.properties");
  if (fs.existsSync(propsPath)) {
    const m = fs.readFileSync(propsPath, "utf8").match(/^\s*main\s*=\s*(\S+\.pde)/m);
    if (m && pdes.includes(m[1])) main = m[1];
  }
  const ordered = [main, ...pdes.filter((f) => f !== main)];
  return {
    dir,
    main,
    files: ordered.map((name) => ({ name, content: fs.readFileSync(path.join(dir, name), "utf8") })),
  };
}

/** Replace comments, string and char literals with spaces (keeps offsets and newlines). */
export function blankCommentsAndStrings(src: string): string {
  const out = src.split("");
  let i = 0;
  const blank = (from: number, to: number) => {
    for (let k = from; k < to; k++) if (out[k] !== "\n") out[k] = " ";
  };
  while (i < src.length) {
    const c = src[i];
    const n = src[i + 1];
    if (c === "/" && n === "/") {
      const end = src.indexOf("\n", i);
      const stop = end === -1 ? src.length : end;
      blank(i, stop);
      i = stop;
    } else if (c === "/" && n === "*") {
      const end = src.indexOf("*/", i + 2);
      const stop = end === -1 ? src.length : end + 2;
      blank(i, stop);
      i = stop;
    } else if (c === '"' && src.startsWith('"""', i)) {
      const end = src.indexOf('"""', i + 3);
      const stop = end === -1 ? src.length : end + 3;
      blank(i + 1, stop - 1);
      i = stop;
    } else if (c === '"' || c === "'") {
      let k = i + 1;
      while (k < src.length && src[k] !== c && src[k] !== "\n") k += src[k] === "\\" ? 2 : 1;
      blank(i + 1, k);
      i = k + 1;
    } else {
      i++;
    }
  }
  return out.join("");
}

/**
 * Processing decides between "static" mode (bare statements) and "active" mode (method declarations).
 * This is a heuristic: a method declaration at brace depth 0 means active mode.
 */
export function detectMode(files: { content: string }[]): "static" | "active" {
  // "<modifiers> <type> <name>(<params>) [throws ...]" right before a top-level "{"
  const methodHeader = /^(?:@\w+\s+)*(?:(?:public|private|protected|static|final|synchronized|abstract)\s+)*[A-Za-z_][\w.]*(?:<[^{}]*>)?(?:\s*\[\s*\])*\s+[A-Za-z_]\w*\s*\([^{}]*\)\s*(?:throws\s+[\w.,\s]+)?$/;
  for (const f of files) {
    const code = blankCommentsAndStrings(f.content);
    let depth = 0;
    let headerStart = 0;
    for (let i = 0; i < code.length; i++) {
      const ch = code[i];
      if (ch === "{") {
        const header = code.slice(headerStart, i).trim();
        if (depth === 0 && methodHeader.test(header) && !/\b(if|else|for|while|switch|catch|do|try|return|new)\b/.test(header.split("(")[0])) return "active";
        depth++;
      } else if (ch === "}") {
        depth--;
        if (depth === 0) headerStart = i + 1;
      } else if (ch === ";" && depth === 0) {
        headerStart = i + 1;
      }
    }
  }
  return "static";
}

/** Escape a path for use inside a Java string literal (forward slashes work on Windows). */
function javaPath(p: string) {
  return p.replace(/\\/g, "/").replace(/"/g, '\\"');
}

export const DONE_MARKER = "__VT_DONE__";

/**
 * Produce the main tab for the reference run:
 * - forces pixelDensity(1) (Processing 4.5 defaults to 2 on HiDPI screens),
 * - saves the frame after `frames` draw() calls and exits,
 * - with `outStdout`, sends System.out to that file in UTF-8 (the console uses the system code page,
 *   which loses or garbles non-ASCII text on Windows).
 * Only appends code / inserts on the size() line (or the first line), so compiler line numbers stay valid.
 */
export function injectForReference(
  main: string,
  mode: "static" | "active",
  frames: number,
  outPng: string,
  outStdout?: string,
): string {
  let code = main;
  const redirect = outStdout
    ? `try { System.setOut(new java.io.PrintStream(new java.io.FileOutputStream("${javaPath(outStdout)}"), true, "UTF-8")); } catch (Exception e) { }`
    : "";
  const blanked = blankCommentsAndStrings(code);
  // A call of the sketch's own size()/fullScreen(), not a method such as list.size().
  const sizeCall = /(?<![.\w$])(size|fullScreen)\s*\([^;]*\)\s*;/.exec(blanked);
  if (sizeCall) {
    const at = sizeCall.index + sizeCall[0].length;
    code = code.slice(0, at) + " pixelDensity(1);" + code.slice(at);
  } else if (mode === "active") {
    if (/\bvoid\s+settings\s*\(/.test(blanked)) {
      const m = /\bvoid\s+settings\s*\([^)]*\)\s*\{/.exec(blanked)!;
      const at = m.index + m[0].length;
      code = code.slice(0, at) + " pixelDensity(1);" + code.slice(at);
    } else {
      code += "\n\nvoid settings() { pixelDensity(1); }\n";
    }
  } else {
    code = "pixelDensity(1); " + code;
  }
  if (redirect && mode === "static") code = redirect + " " + code;

  const out = javaPath(outPng);
  if (mode === "active") {
    // handleDraw(): frameCount is 0 during setup(), 1 during the first draw(), and is incremented
    // after each call, so "frameCount > frames" right after super.handleDraw() means `frames`
    // draw() calls have completed. noLoop() sketches only get one draw().
    code += `

// ---- injected by tools/vt (reference capture) ----
${redirect ? `boolean __vtStdout = __vtRedirectStdout();
boolean __vtRedirectStdout() {
  ${redirect}
  return true;
}
` : ""}@Override
public void handleDraw() {
  super.handleDraw();
  if (frameCount > ${frames} || (!isLooping() && frameCount > 1)) {
    save("${out}");
    System.out.println("${DONE_MARKER}");
    exit();
  }
}
`;
  } else {
    code += `

// ---- injected by tools/vt (reference capture) ----
save("${out}");
System.out.println("${DONE_MARKER}");
exit();
`;
  }
  return code;
}
