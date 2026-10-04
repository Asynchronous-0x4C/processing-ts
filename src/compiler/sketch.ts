// The Processing preprocessor step: turn the tabs' top-level code into one Java class extending PApplet,
// the way Processing 4.5.2 does (checked against `Processing cli --build` output):
//   active mode (a top-level method exists): top-level variables become fields, methods and classes
//     become members, methods without an access modifier become public;
//   static mode: every top-level statement, local classes included, goes into `public void setup()`,
//     followed by `noLoop()`.
//   Java mode (only type declarations at the top level, one of them declaring `public static void
//     main`): the code is a Java file as it is; the class named like the sketch is the sketch class and
//     the other types stay top-level classes.
// Imports are hoisted. Mixing the active and static modes is an error. Synthesized nodes are marked
// `synthetic`. Like Processing, every method declared in a class body (member, local and anonymous
// classes; not interfaces) without an access modifier becomes public, so `void display()` can
// implement an interface method; Processing's literals and `color` work in all modes (check.ts).
// size()/fullScreen()/pixelDensity()/noSmooth()/smooth() calls written directly in a setup() body move
// to a generated `settings()` (moveSettingsCalls).
import type * as A from "./ast.ts";
import { Modifier, walk } from "./ast.ts";
import { error, type Diagnostic } from "./diagnostics.ts";

export interface Sketch {
  /** Class name: the main tab's file name without ".pde". */
  name: string;
  mode: "active" | "static" | "java";
  imports: A.ImportDecl[];
  /** The sketch class (superclass PApplet). */
  decl: A.ClassDecl;
  /** Java mode: the other top-level types, kept in `decl.body` as static members for scoping. */
  topLevel: Set<A.Member>;
}

/** Top-level nodes that are class members in active mode. */
function isMember(n: A.Statement | A.MethodDecl): boolean {
  return n.kind === "MethodDecl" || n.kind === "LocalVar" || n.kind === "ClassDecl" || n.kind === "InterfaceDecl" || n.kind === "EnumDecl" || n.kind === "Block" || n.kind === "Empty";
}

export function sketchName(mainTab: string): string {
  return mainTab.replace(/\.pde$/i, "");
}

export function buildSketch(files: A.SketchFile[], diagnostics: Diagnostic[]): Sketch {
  const name = sketchName(files[0]?.name ?? "sketch.pde");
  const imports = files.flatMap((f) => f.imports);
  const top = files.flatMap((f) => f.members);
  const start = files[0]?.start ?? 0;
  const end = files[files.length - 1]?.end ?? 0;
  const firstMethod = top.find((m) => m.kind === "MethodDecl");
  const body: A.Member[] = [];
  const topLevel = new Set<A.Member>();
  let mode: Sketch["mode"];
  if (isJavaMode(top)) {
    mode = "java";
    const types = top.filter((m): m is A.TypeDecl => m.kind !== "Empty");
    const main = types.find((t): t is A.ClassDecl => t.kind === "ClassDecl" && t.name.text === name);
    for (const t of types) {
      if (t === main) continue;
      if (t.modifiers & Modifier.Public) diagnostics.push(error("public-type", `The public type ${t.name.text} must be defined in its own file`, t.name.start, t.name.end));
      t.modifiers |= Modifier.Static;
      topLevel.add(t);
      body.push(t);
    }
    if (main) {
      for (const m of main.body) {
        if (m.kind === "ConstructorDecl") diagnostics.push(error("unsupported", `A constructor of the sketch class ${name} is not supported in processing-ts`, m.start, m.end));
      }
      // The sketch class is the user's own; the other top-level types are kept in its body.
      main.body.push(...body);
      makeMethodsPublic(main);
      moveSettingsCalls(main, false);
      return { name, mode, imports, decl: main, topLevel };
    }
    diagnostics.push(error("unsupported", `Java mode: the sketch has no class named ${name} (the sketch class, extending PApplet)`, start, start));
  } else if (firstMethod) {
    mode = "active";
    for (const m of top) {
      if (!isMember(m)) {
        diagnostics.push(error("mixed-modes", "This statement must be inside a function: the sketch mixes \"active\" mode (with setup()/draw() or other functions) and \"static\" mode (top-level statements)", m.start, m.end));
        continue;
      }
      switch (m.kind) {
        case "MethodDecl":
          body.push(m);
          break;
        case "LocalVar":
          body.push({ kind: "FieldDecl", modifiers: m.modifiers, annotations: m.annotations, type: m.type, declarators: m.declarators, start: m.start, end: m.end });
          break;
        case "Block":
          body.push({ kind: "Initializer", static: false, body: m, start: m.start, end: m.end });
          break;
        case "Empty":
          break;
        default:
          body.push(m as A.ClassDecl | A.InterfaceDecl | A.EnumDecl);
      }
    }
  } else {
    mode = "static";
    const stmts = top as A.Statement[];
    const s = stmts[0]?.start ?? start;
    const e = stmts[stmts.length - 1]?.end ?? start;
    const noLoop: A.ExprStmt = {
      kind: "ExprStmt", synthetic: true, start: e, end: e,
      expr: { kind: "MethodCall", synthetic: true, target: null, typeArgs: null, name: { text: "noLoop", start: e, end: e }, args: [], start: e, end: e },
    };
    body.push({
      kind: "MethodDecl", synthetic: true, modifiers: Modifier.Public, annotations: [], typeParams: [],
      returnType: { kind: "VoidType", synthetic: true, start: s, end: s },
      name: { text: "setup", start: s, end: s }, params: [], dims: 0, throws: [],
      body: { kind: "Block", synthetic: true, body: [...stmts, noLoop], start: s, end: e },
      start: s, end: e,
    });
  }
  const decl: A.ClassDecl = {
    kind: "ClassDecl", synthetic: true, modifiers: Modifier.Public, annotations: [],
    name: { text: name, start, end: start }, typeParams: [],
    superclass: { kind: "ClassType", synthetic: true, qualifier: null, name: { text: "PApplet", start, end: start }, typeArgs: null, start, end: start },
    interfaces: [], body, start, end,
  };
  makeMethodsPublic(decl);
  moveSettingsCalls(decl, true);
  return { name, mode, imports, decl, topLevel };
}

/**
 * Java mode: the top level is only type declarations (and stray `;`), and a top-level type declares
 * `public static void main`. Processing then compiles the code as written (otherwise a sketch made of
 * classes is static mode: the classes become local classes of setup()).
 */
function isJavaMode(top: (A.Statement | A.MethodDecl)[]): boolean {
  const types = top.filter((m) => m.kind !== "Empty");
  if (!types.length || !types.every((m) => m.kind === "ClassDecl" || m.kind === "InterfaceDecl" || m.kind === "EnumDecl")) return false;
  const both = Modifier.Public | Modifier.Static;
  return (types as A.TypeDecl[]).some((t) => t.body.some((m) => m.kind === "MethodDecl" && m.name.text === "main" && (m.modifiers & both) === both && m.returnType.kind === "VoidType"));
}

/** settings() gets the last call of each kind in this order (fullScreen() takes the size slot). */
const SETTINGS_ORDER = ["size", "pixelDensity", "noSmooth", "smooth"];

/**
 * Processing moves size()/fullScreen()/pixelDensity()/noSmooth()/smooth() to `settings()` when the call
 * is a statement written directly in the body of a method named setup (of any class: Processing's
 * preprocessor only looks at the method name; static mode's statements are in setup()). A size() whose
 * width or height uses a name (`size(w, 300)`, `size(displayWidth, 400)`) stays where it is (it then
 * fails at run time unless it keeps the current size). The moved statements are blanked; settings()
 * gets the last call of each kind, fullScreen() winning over size() whatever the order. Java mode
 * blanks them without generating settings() (`withSettings` false), as Processing does.
 */
function moveSettingsCalls(decl: A.ClassDecl, withSettings: boolean) {
  const last = new Map<string, A.ExprStmt>();
  let full: A.ExprStmt | null = null;
  walk(decl, (n) => {
    if (n.kind !== "MethodDecl" || n.name.text !== "setup" || !n.body) return true;
    const stmts = n.body.body;
    for (let i = 0; i < stmts.length; i++) {
      const st = stmts[i];
      if (st.kind !== "ExprStmt" || st.expr.kind !== "MethodCall") continue;
      const call = st.expr;
      if (call.target !== null && call.target.kind !== "This") continue;
      const fn = call.name.text;
      if (fn === "size") {
        if (call.args.slice(0, 2).some(usesName)) continue;
        last.set("size", st);
      } else if (fn === "fullScreen") full = st;
      else if (fn === "pixelDensity" || fn === "noSmooth" || fn === "smooth") last.set(fn, st);
      else continue;
      stmts[i] = { kind: "Empty", start: st.start, end: st.end };
    }
    return true;
  });
  if (full) last.set("size", full);
  if (!withSettings || !last.size) return;
  const calls = SETTINGS_ORDER.map((k) => last.get(k)).filter((x): x is A.ExprStmt => !!x);
  const at = calls[0].start;
  // First in the body, so that a user-written settings() is the one reported as a duplicate.
  decl.body.unshift({
    kind: "MethodDecl", synthetic: true, modifiers: Modifier.Public, annotations: [], typeParams: [],
    returnType: { kind: "VoidType", synthetic: true, start: at, end: at },
    name: { text: "settings", start: at, end: at }, params: [], dims: 0, throws: [],
    body: { kind: "Block", synthetic: true, body: calls, start: at, end: at },
    start: at, end: at,
  });
}

/** Does an expression use a name (variable, field, method, class)? Otherwise it is literals and operators. */
function usesName(e: A.Expression): boolean {
  let found = false;
  walk(e, (n) => {
    if (NAMED.has(n.kind)) found = true;
    return !found;
  });
  return found;
}
const NAMED = new Set(["Identifier", "FieldAccess", "MethodCall", "Conversion", "ClassType", "NewObject", "NewArray", "This", "Super", "Lambda", "MethodRef", "ClassLit"]);

const ACCESS = Modifier.Public | Modifier.Protected | Modifier.Private;

function makeMethodsPublic(root: A.Node) {
  const publish = (members: A.Member[] | null) => {
    for (const m of members ?? []) if (m.kind === "MethodDecl" && !(m.modifiers & ACCESS)) m.modifiers |= Modifier.Public;
  };
  walk(root, (n) => {
    if (n.kind === "ClassDecl" || n.kind === "EnumDecl") publish(n.body);
    else if (n.kind === "NewObject" || n.kind === "EnumConstant") publish(n.body);
  });
}
