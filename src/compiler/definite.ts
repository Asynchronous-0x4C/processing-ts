// Definite assignment of local variables (JLS chapter 16), for the error "The local variable x may not
// have been initialized". Runs on a checked body (names carry their symbols, conditions their constant
// values). A state is the set of definitely assigned locals; `null` means the point is unreachable
// (vacuously, every variable is assigned there). Conditions are analyzed into "assigned when true" and
// "assigned when false" states so `if (a != null && (x = f(a)) > 0) use(x)` is accepted.
// Not covered: definite unassignment (assigning a final twice), blank final fields.
import type * as A from "./ast.ts";
import type { LocalSymbol } from "./types.ts";

type State = Set<LocalSymbol> | null;
type Cond = { t: State; f: State };
interface Target {
  kind: "loop" | "switch" | "label";
  label?: string;
  breaks: State[];
  continues: State[];
}

const copy = (s: State): State => (s === null ? null : new Set(s));

function meet(...states: State[]): State {
  let out: State = null;
  for (const s of states) {
    if (s === null) continue;
    if (out === null) out = new Set(s);
    else for (const v of out) if (!s.has(v)) out.delete(v);
  }
  return out;
}

function union(a: State, b: State): State {
  if (a === null || b === null) return null;
  const out = new Set(a);
  for (const v of b) out.add(v);
  return out;
}

const assign = (s: State, v: LocalSymbol): State => {
  if (s !== null) s.add(v);
  return s;
};

export function checkDefiniteAssignment(body: A.Block, initial: LocalSymbol[], report: (v: LocalSymbol, at: A.Identifier) => void): void {
  const reported = new Set<LocalSymbol>();
  const targets: Target[] = [];
  /** Locals declared in the analyzed code; parameters and captured variables are always assigned. */
  const declared = new Set<LocalSymbol>();

  const read = (e: A.Identifier, s: State) => {
    const v = e.sym;
    if (!v || v.kind !== "local" || s === null || s.has(v) || reported.has(v) || !declared.has(v)) return;
    reported.add(v);
    report(v, e);
  };

  const exprs = (es: (A.Expression | null)[], s: State): State => {
    for (const e of es) if (e) s = expr(e, s);
    return s;
  };

  const cond = (e: A.Expression, s: State): Cond => {
    if (e.constant === true) return { t: expr(e, s), f: null };
    if (e.constant === false) return { t: null, f: expr(e, s) };
    if (e.kind === "Unary" && e.op === "!") {
      const c = cond(e.operand, s);
      return { t: c.f, f: c.t };
    }
    if (e.kind === "Binary" && e.op === "&&") {
      const a = cond(e.left, s);
      const b = cond(e.right, copy(a.t));
      return { t: b.t, f: meet(a.f, b.f) };
    }
    if (e.kind === "Binary" && e.op === "||") {
      const a = cond(e.left, s);
      const b = cond(e.right, copy(a.f));
      return { t: meet(a.t, b.t), f: b.f };
    }
    if (e.kind === "Conditional" && e.ty?.tag === "prim" && e.ty.name === "boolean") {
      const c = cond(e.test, s);
      const x = cond(e.consequent, copy(c.t));
      const y = cond(e.alternate, copy(c.f));
      return { t: meet(x.t, y.t), f: meet(x.f, y.f) };
    }
    const after = expr(e, s);
    return { t: after, f: copy(after) };
  };

  const expr = (e: A.Expression, s: State): State => {
    switch (e.kind) {
      case "Identifier":
        read(e, s);
        return s;
      case "Assign": {
        if (e.target.kind === "Identifier" && e.target.sym?.kind === "local") {
          if (e.op !== "=") read(e.target, s);
          s = expr(e.value, s);
          return assign(s, e.target.sym);
        }
        if (e.target.kind === "FieldAccess") s = expr(e.target.target, s);
        else if (e.target.kind === "ArrayAccess") s = exprs([e.target.array, e.target.index], s);
        return expr(e.value, s);
      }
      case "Binary":
        if (e.op === "&&" || e.op === "||") {
          const c = cond(e, s);
          return meet(c.t, c.f);
        }
        return expr(e.right, expr(e.left, s));
      case "Conditional": {
        const c = cond(e.test, s);
        return meet(expr(e.consequent, copy(c.t)), expr(e.alternate, copy(c.f)));
      }
      case "Unary":
        if (e.op === "!") {
          const c = cond(e, s);
          return meet(c.t, c.f);
        }
        return expr(e.operand, s);
      case "Update": return expr(e.operand, s);
      case "FieldAccess": return expr(e.target, s);
      case "ArrayAccess": return exprs([e.array, e.index], s);
      case "MethodCall": return exprs(e.args, e.target ? expr(e.target, s) : s);
      case "NewObject": return exprs(e.args, e.outer ? expr(e.outer, s) : s);
      case "NewArray": {
        s = exprs(e.dimensions, s);
        return e.initializer ? expr(e.initializer, s) : s;
      }
      case "ArrayInit": return exprs(e.elements, s);
      case "InstanceOf": return expr(e.expr, s);
      case "Cast": return expr(e.expr, s);
      case "Conversion": return exprs(e.args, s);
      case "This": case "Super": return s;
      case "MethodRef": return e.target.kind === "Identifier" || e.target.kind === "FieldAccess" ? expr(e.target as A.Expression, s) : s;
      case "Lambda":
        // The body runs later: it sees the current state, and its assignments do not flow out.
        if (e.body.kind === "Block") stmt(e.body, copy(s));
        else expr(e.body, copy(s));
        return s;
      default:
        return s;
    }
  };

  const block = (stmts: A.Statement[], s: State): State => {
    for (const st of stmts) s = stmt(st, s);
    return s;
  };

  const loop = (t: Target, f: () => State): { after: State; t: Target } => {
    targets.push(t);
    const after = f();
    targets.pop();
    return { after, t };
  };

  const stmt = (st: A.Statement, s: State): State => {
    switch (st.kind) {
      case "Block": return block(st.body, s);
      case "LocalVar":
        for (const d of st.declarators) {
          const v = d.sym as LocalSymbol | undefined;
          if (!v) continue;
          declared.add(v);
          if (d.init) s = assign(expr(d.init, s), v);
        }
        return s;
      case "ExprStmt": return expr(st.expr, s);
      case "If": {
        const c = cond(st.test, s);
        const a = stmt(st.consequent, c.t);
        const b = st.alternate ? stmt(st.alternate, c.f) : c.f;
        return meet(a, b);
      }
      case "While": {
        const c = cond(st.test, s);
        const r = loop({ kind: "loop", breaks: [], continues: [] }, () => stmt(st.body, c.t));
        return meet(c.f, ...r.t.breaks);
      }
      case "DoWhile": {
        const r = loop({ kind: "loop", breaks: [], continues: [] }, () => stmt(st.body, s));
        const c = cond(st.test, meet(r.after, ...r.t.continues));
        return meet(c.f, ...r.t.breaks);
      }
      case "For": {
        for (const i of st.init) s = stmt(i, s);
        const c: Cond = st.test ? cond(st.test, s) : { t: s, f: null };
        const r = loop({ kind: "loop", breaks: [], continues: [] }, () => stmt(st.body, c.t));
        exprs(st.update, meet(r.after, ...r.t.continues));
        return meet(c.f, ...r.t.breaks);
      }
      case "ForEach": {
        s = expr(st.iterable, s);
        const r = loop({ kind: "loop", breaks: [], continues: [] }, () => stmt(st.body, copy(s)));
        return meet(s, ...r.t.breaks);
      }
      case "Labeled": {
        const r = loop({ kind: "label", label: st.label.text, breaks: [], continues: [] }, () => stmt(st.body, s));
        return meet(r.after, ...r.t.breaks);
      }
      case "Switch": {
        s = expr(st.discriminant, s);
        let hasDefault = false;
        const r = loop({ kind: "switch", breaks: [], continues: [] }, () => {
          let prev: State = null;
          let first = true;
          for (const c of st.cases) {
            if (c.labels.includes(null)) hasDefault = true;
            for (const l of c.labels) if (l) expr(l, copy(s));
            const start = first ? copy(s) : meet(s, prev);
            first = false;
            prev = block(c.body, start);
          }
          return st.cases.length ? prev : copy(s);
        });
        return hasDefault ? meet(r.after, ...r.t.breaks) : meet(s, r.after, ...r.t.breaks);
      }
      case "Break": {
        const t = st.label ? [...targets].reverse().find((x) => x.label === st.label!.text) : [...targets].reverse().find((x) => x.kind !== "label");
        t?.breaks.push(copy(s));
        return null;
      }
      case "Continue": {
        let t: Target | undefined;
        if (st.label) {
          const i = targets.findIndex((x) => x.label === st.label!.text);
          t = i >= 0 ? targets.slice(i + 1).find((x) => x.kind === "loop") : undefined;
        } else t = [...targets].reverse().find((x) => x.kind === "loop");
        t?.continues.push(copy(s));
        return null;
      }
      case "Return":
        if (st.value) expr(st.value, s);
        return null;
      case "Throw":
        expr(st.expr, s);
        return null;
      case "Assert":
        expr(st.test, copy(s));
        return s;
      case "Try": {
        let before = s;
        for (const r of st.resources) before = r.kind === "LocalVar" ? stmt(r, before) : expr(r, before);
        const afterTry = block(st.block.body, copy(before));
        const afterCatches = st.catches.map((c) => block(c.body.body, copy(s)));
        const joined = meet(afterTry, ...afterCatches);
        if (!st.finally) return joined;
        const afterFinally = block(st.finally.body, copy(s));
        return afterFinally === null ? null : joined === null ? null : union(joined, afterFinally);
      }
      case "Synchronized": return block(st.body.body, expr(st.lock, s));
      default:
        return s;
    }
  };

  block(body.body, new Set(initial));
}
