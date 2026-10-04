// The Processing preprocessor step: turn the tabs' top-level code into one Java class extending PApplet,
// the way Processing 4.5.2 does (checked against `Processing cli --build` output):
//   active mode (a top-level method exists): top-level variables become fields, methods and classes
//     become members, methods without an access modifier become public;
//   static mode: every top-level statement, local classes included, goes into `public void setup()`,
//     followed by `noLoop()`.
// Imports are hoisted. Mixing the two modes is an error. Synthesized nodes are marked `synthetic`.
// Like Processing, every method declared in a class body (member, local and anonymous classes; not
// interfaces) without an access modifier becomes public, so `void display()` can implement an
// interface method.
// Not done here yet (ROADMAP P1-6): moving size()/fullScreen()/smooth()/pixelDensity() to settings().
import type * as A from "./ast.ts";
import { Modifier, walk } from "./ast.ts";
import { error, type Diagnostic } from "./diagnostics.ts";

export interface Sketch {
  /** Class name: the main tab's file name without ".pde". */
  name: string;
  mode: "active" | "static";
  imports: A.ImportDecl[];
  /** The sketch class (superclass PApplet). */
  decl: A.ClassDecl;
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
  let mode: Sketch["mode"];
  if (firstMethod) {
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
  return { name, mode, imports, decl };
}

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
