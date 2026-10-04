// Deterministic edits that may introduce semantic errors into a valid sketch. Whether an edit really
// makes the sketch invalid is decided by the real Processing (compare.ts), not here. Each kind edits
// the "middle" candidate of the sketch so the inputs stay stable between runs.
import { Modifier, walk, type Node } from "../../src/compiler/ast.ts";
import type * as A from "../../src/compiler/ast.ts";
import type { ParseResult } from "../../src/compiler/parse.ts";

export type Tab = { name: string; text: string };
export type Mutation = { kind: string; tabs: Tab[] };

type Edit = { start: number; end: number; text: string };

function middle<T>(xs: T[]): T | undefined {
  return xs[Math.floor(xs.length / 2)];
}

/** Apply edits (positions in the sketch position space) to the tabs. */
function apply(p: ParseResult, edits: Edit[]): Tab[] {
  return p.source.tabs.map((tab) => {
    let text = tab.text;
    const mine = edits.filter((e) => p.source.tabIndexAt(e.start) === p.source.tabs.indexOf(tab)).sort((a, b) => b.start - a.start);
    for (const e of mine) text = text.slice(0, e.start - tab.base) + e.text + text.slice(e.end - tab.base);
    return { name: tab.name, text };
  });
}

/** `p` must have been checked (checkSketch) so names carry their symbols. */
export function mutations(p: ParseResult): Mutation[] {
  const nodes: Node[] = [];
  const parents = new Map<Node, Node>();
  const stack: Node[] = [];
  for (const f of p.files) {
    walk(f, (n) => {
      if (stack.length) parents.set(n, stack[stack.length - 1]);
      stack.push(n);
      nodes.push(n);
    }, () => stack.pop());
  }
  const of = <K extends Node["kind"]>(k: K) => nodes.filter((n): n is Extract<Node, { kind: K }> => n.kind === k && !n.synthetic);
  const out: Mutation[] = [];
  const add = (kind: string, edits: Edit[] | null) => {
    if (edits) out.push({ kind, tabs: apply(p, edits) });
  };
  const enclosing = (n: Node, kinds: string[]): Node | undefined => {
    for (let x = parents.get(n); x; x = parents.get(x)) if (kinds.includes(x.kind)) return x;
    return undefined;
  };

  // A variable use renamed to something undefined.
  const vars = of("Identifier").filter((n) => n.sym && (n.sym.kind === "local" || n.sym.kind === "field"));
  const v = middle(vars);
  add("undefined-variable", v ? [{ start: v.start, end: v.end, text: v.name + "Undef" }] : null);

  // An unqualified call renamed.
  const calls = of("MethodCall").filter((n) => n.target === null && n.method);
  const c = middle(calls);
  add("undefined-function", c ? [{ start: c.name.start, end: c.name.end, text: c.name.text + "Undef" }] : null);

  // One argument too many.
  const withArgs = of("MethodCall").filter((n) => n.args.length > 0 && n.method);
  const w = middle(withArgs);
  add("extra-argument", w ? [{ start: w.args[w.args.length - 1].end, end: w.args[w.args.length - 1].end, text: ", 1" }] : null);

  // A number argument replaced by a string.
  const numArgs = of("MethodCall").flatMap((m) => m.args.filter((a) => a.kind === "IntLiteral" || a.kind === "FloatLiteral"));
  const na = middle(numArgs);
  add("string-argument", na ? [{ start: na.start, end: na.end, text: '"s"' }] : null);

  // float local declared as int.
  const floats = of("LocalVar").filter((d) => d.type.kind === "PrimitiveType" && d.type.name === "float" && d.declarators.some((x) => x.init));
  const fl = middle(floats);
  add("float-to-int-declaration", fl ? [{ start: fl.type.start, end: fl.type.end, text: "int" }] : null);

  // A reference-typed local declared as String.
  const refs = of("LocalVar").filter((d) => d.type.kind === "ClassType" && d.type.name.text !== "String" && d.declarators.some((x) => x.init));
  const rf = middle(refs);
  add("declared-as-string", rf ? [{ start: rf.type.start, end: rf.type.end, text: "String" }] : null);

  // The final return of a non-void method removed.
  const finals = of("MethodDecl").filter((m) => m.body && m.returnType.kind !== "VoidType" && m.body.body.length && m.body.body[m.body.body.length - 1].kind === "Return");
  const fr = middle(finals);
  if (fr) {
    const ret = fr.body!.body[fr.body!.body.length - 1];
    add("missing-return", [{ start: ret.start, end: ret.end, text: "" }]);
  }

  // `return;` at the start of a void method with statements.
  const voids = of("MethodDecl").filter((m) => m.body && m.returnType.kind === "VoidType" && m.body.body.length > 0);
  const vm = middle(voids);
  add("unreachable-code", vm ? [{ start: vm.body!.start + 1, end: vm.body!.start + 1, text: " return; " }] : null);

  // A method of a user class made static (inner classes cannot have static methods in Processing).
  const members = of("MethodDecl").filter((m) => {
    const cls = enclosing(m, ["ClassDecl", "InterfaceDecl", "EnumDecl"]) as A.ClassDecl | undefined;
    return cls && cls.kind === "ClassDecl" && !cls.synthetic && !(cls.modifiers & Modifier.Static) && m.body;
  });
  const sm = middle(members);
  add("static-method-in-class", sm ? [{ start: sm.returnType.start, end: sm.returnType.start, text: "static " }] : null);

  // A local variable declared twice.
  const locals = of("LocalVar").filter((d) => d.declarators.length === 1 && parents.get(d)?.kind === "Block");
  const dl = middle(locals);
  add("duplicate-local", dl ? [{ start: dl.end, end: dl.end, text: " " + p.source.slice(dl.start, dl.end) }] : null);

  return out;
}
