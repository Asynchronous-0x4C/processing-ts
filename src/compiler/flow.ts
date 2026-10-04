// Reachability (JLS 14.22): whether a body can complete normally (missing return) and which statements
// can never run ("Unreachable code"). Uses the constant values recorded by the checker for conditions
// (`while (true)`), so it runs after the body has been checked. Expressions (lambda bodies, local class
// bodies) are analyzed separately.
import type * as A from "./ast.ts";

interface Target {
  kind: "loop" | "switch" | "label";
  label?: string;
  broken: boolean;
  continued: boolean;
}

export function checkFlow(body: A.Block): { completes: boolean; unreachable: A.Statement[] } {
  const unreachable: A.Statement[] = [];
  const targets: Target[] = [];

  const list = (stmts: A.Statement[]): boolean => {
    let reachable = true;
    for (const s of stmts) {
      if (!reachable) {
        unreachable.push(s);
        return false;
      }
      reachable = stmt(s);
    }
    return reachable;
  };

  const withTarget = (t: Target, f: () => boolean): { completes: boolean; t: Target } => {
    targets.push(t);
    const completes = f();
    targets.pop();
    return { completes, t };
  };

  const stmt = (s: A.Statement): boolean => {
    switch (s.kind) {
      case "Block": return list(s.body);
      case "If": {
        // Java treats both branches as reachable even for constant conditions (conditional compilation).
        const a = stmt(s.consequent);
        if (!s.alternate) return true;
        const b = stmt(s.alternate);
        return a || b;
      }
      case "While": {
        const c = s.test.constant;
        if (c === false) {
          if (!(s.body.kind === "Block" && s.body.body.length === 0)) unreachable.push(s.body);
          return true;
        }
        const r = withTarget({ kind: "loop", broken: false, continued: false }, () => stmt(s.body));
        return c !== true || r.t.broken;
      }
      case "DoWhile": {
        const c = s.test.constant;
        const r = withTarget({ kind: "loop", broken: false, continued: false }, () => stmt(s.body));
        return ((r.completes || r.t.continued) && c !== true) || r.t.broken;
      }
      case "For": {
        const c = s.test ? s.test.constant : true;
        if (c === false) {
          unreachable.push(s.body);
          return true;
        }
        const r = withTarget({ kind: "loop", broken: false, continued: false }, () => stmt(s.body));
        return c !== true || r.t.broken;
      }
      case "ForEach":
        withTarget({ kind: "loop", broken: false, continued: false }, () => stmt(s.body));
        return true;
      case "Labeled": {
        const isLoop = s.body.kind === "While" || s.body.kind === "DoWhile" || s.body.kind === "For" || s.body.kind === "ForEach";
        const r = withTarget({ kind: "label", label: s.label.text, broken: false, continued: false }, () => stmt(s.body));
        void isLoop;
        return r.completes || r.t.broken;
      }
      case "Switch": {
        let hasDefault = false;
        const r = withTarget({ kind: "switch", broken: false, continued: false }, () => {
          let reachable = true;
          for (const c of s.cases) {
            if (c.labels.includes(null)) hasDefault = true;
            reachable = true; // a case label makes the following statements reachable
            for (const st of c.body) {
              if (!reachable) {
                unreachable.push(st);
                break;
              }
              reachable = stmt(st);
            }
          }
          return reachable;
        });
        return r.completes || !hasDefault || r.t.broken || s.cases.length === 0;
      }
      case "Break": {
        const t = s.label ? [...targets].reverse().find((x) => x.label === s.label!.text) : [...targets].reverse().find((x) => x.kind !== "label");
        if (t) t.broken = true;
        return false;
      }
      case "Continue": {
        // A labeled continue targets the loop under the label; mark the loop (the target after it).
        let t: Target | undefined;
        if (s.label) {
          const i = targets.findIndex((x) => x.label === s.label!.text);
          t = i >= 0 ? targets.slice(i + 1).find((x) => x.kind === "loop") : undefined;
        } else t = [...targets].reverse().find((x) => x.kind === "loop");
        if (t) t.continued = true;
        return false;
      }
      case "Return":
      case "Throw":
        return false;
      case "Try": {
        const a = list(s.block.body);
        let any = a;
        for (const c of s.catches) any = list(c.body.body) || any;
        if (s.finally && !list(s.finally.body)) return false;
        return any;
      }
      case "Synchronized": return list(s.body.body);
      default:
        return true;
    }
  };

  const completes = list(body.body);
  return { completes, unreachable };
}
