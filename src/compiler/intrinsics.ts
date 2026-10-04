// Library calls whose JS form depends on static types: the print functions (a float prints as "1.0"),
// methods of values that are JS primitives at run time (String, boxed numbers, Object-typed receivers),
// overloads JS cannot tell apart (StringBuilder.append(char) vs append(int)), and the math functions of
// PApplet/Math (float results). Everything else is a plain call on the runtime object.
import type * as A from "./ast.ts";
import type { Gen } from "./codegen.ts";
import { Flags, erasure, type FieldSymbol, type MethodSymbol, type PrimType, type Type } from "./types.ts";

export type Emit = { c: string; p: number };

// Same values as codegen's P (kept local to avoid a runtime import cycle).
const P = { Assign: 2, Cond: 3, Eq: 9, Add: 12, Unary: 15, Call: 18, Primary: 19 } as const;
const par = (e: Emit, min: number): string => (e.p < min ? `(${e.c})` : e.c);
const call = (c: string): Emit => ({ c, p: P.Call });

const BOXES = new Set(["java.lang.Integer", "java.lang.Float", "java.lang.Double", "java.lang.Long", "java.lang.Short", "java.lang.Byte", "java.lang.Character", "java.lang.Boolean", "java.lang.Number"]);

function code(t: Type): string {
  const e = erasure(t);
  if (e.tag === "prim") return { boolean: "Z", byte: "B", short: "S", char: "C", int: "I", long: "J", float: "F", double: "D" }[e.name];
  if (e.tag === "array") return "[" + code(e.elem);
  if (e.tag === "class") return e.sym.fullName;
  return "?";
}

/** Arguments converted to the parameter types. */
function args(g: Gen, m: MethodSymbol, as: A.Expression[]): Emit[] {
  return as.map((a, i) => g.coerce(a, m.params[Math.min(i, m.params.length - 1)] ?? a.ty!));
}

/** Text of print/println arguments for Processing's overloads. */
function printText(g: Gen, m: MethodSymbol, as: A.Expression[], varargs: boolean, processing: boolean): Emit {
  if (as.length === 0) return { c: '""', p: P.Primary };
  if (varargs) {
    // println(a, b, ...) gets an Object[]: every argument is evaluated before any is converted, so
    // `println(list, list.remove(0))` prints the list after the removal. Mutable objects followed by
    // other expressions are kept in temporaries until the end.
    const mutable = (t: Type | undefined) => !!t && t.tag !== "prim" && t.tag !== "null" && !g.ts.isString(t) && !g.ts.unboxed(t);
    const simple = (a: A.Expression) => a.constant !== undefined || a.kind === "Identifier" || a.kind === "This";
    if (as.some((a, i) => mutable(a.ty) && as.slice(i + 1).some((b) => !simple(b)))) {
      const temps = as.map((a) => ({ t: g.temp(), a }));
      const assigns = temps.map(({ t, a }) => `${t} = ${g.expr(a).c}`);
      const parts = temps.map(({ t, a }) => par(g.str({ c: t, p: P.Primary }, a.ty!), P.Add + 1));
      return { c: `(${assigns.join(", ")}, ${parts.join(' + " " + ')})`, p: P.Primary };
    }
    const parts = as.map((a) => par(g.str(g.expr(a), a.ty!), P.Add + 1));
    return { c: parts.join(' + " " + '), p: P.Add };
  }
  const p = m.params[0];
  const a = as[0];
  if (p.tag === "array") {
    // An array passed as the varargs array itself (println(String[])): its elements, space-separated.
    return call(`${g.h("joinValues")}(${g.expr(a).c})`);
  }
  if (p.tag === "prim" || g.ts.isString(p)) return g.str(g.coerce(a, p), p);
  if (code(p) === "[C") return call(`$S.fromChars(${g.expr(a).c})`);
  // Object parameter: Processing prints arrays like printArray; PrintStream uses String.valueOf.
  return processing ? call(`${g.h("objectText")}(${g.expr(a).c})`) : call(`$S.valueOf(${g.expr(a).c})`);
}

export function libraryField(g: Gen, f: FieldSymbol, target: Emit | null): Emit | null {
  const owner = f.owner.fullName;
  if (owner === "java.lang.System" && (f.name === "out" || f.name === "err")) return call(`${g.h("systemOut")}`);
  void target;
  return null;
}

/**
 * Code for a call of library method (or constructor) `m`, or null to emit the plain call.
 * `recv` is the receiver for instance methods (null for static methods and constructors).
 */
export function libraryCall(g: Gen, m: MethodSymbol, recv: Emit | null, as: A.Expression[], varargs: boolean, node: A.Node): Emit | null {
  const owner = m.owner.fullName;
  const name = m.name;
  const sig = m.params.map(code).join(",");
  void node;

  // --- printing -------------------------------------------------------------------------------------
  if (owner === "processing.core.PApplet") {
    switch (name) {
      case "println": return call(`${g.h("println")}(${printText(g, m, as, varargs, true).c})`);
      case "print": return call(`${g.h("print")}(${printText(g, m, as, varargs, true).c})`);
      case "printArray": return call(`${g.h("println")}(${g.h("arrayLines")}(${g.expr(as[0]).c}))`);
      case "str":
        if (m.params[0]?.tag === "array") return call(`${g.h("strArray")}(${g.expr(as[0]).c})`);
        return g.str(g.coerce(as[0], m.params[0]), m.params[0]);
      case "frameRate":
        // The current runtime stores the measured rate in the frameRate field and names the method _frameRate.
        return recv ? call(`${par(recv, P.Call)}._frameRate(${args(g, m, as)[0].c})`) : null;
      case "abs":
        if (sig === "I") return { c: `$M.abs(${args(g, m, as)[0].c}) | 0`, p: 6 };
        if (sig === "F") return call(`$M.abs(${args(g, m, as)[0].c})`);
        break;
      case "min": case "max":
        if (!sig.includes("[")) return call(`$M.${name}(${args(g, m, as).map((a) => a.c).join(", ")})`);
        break;
      case "sq": return call(`${g.h("sq")}(${args(g, m, as)[0].c})`);
      case "sqrt": case "sin": case "cos": case "tan": case "asin": case "acos": case "atan": case "exp": case "log":
        return call(`$f($M.${name}(${args(g, m, as)[0].c}))`);
      case "atan2": case "pow": {
        const [a, b] = args(g, m, as);
        return call(`$f($M.${name}(${a.c}, ${b.c}))`);
      }
      case "floor": case "ceil": case "round":
        if (sig === "F") return call(`${g.h("d2i")}($M.${name}(${args(g, m, as)[0].c}))`);
        break;
      case "constrain": {
        const [x, lo, hi] = args(g, m, as);
        return call(`${g.h("constrain")}(${x.c}, ${lo.c}, ${hi.c})`);
      }
      // DEG_TO_RAD and RAD_TO_DEG are float constants in Processing.
      case "radians": return call(`$f(${par(args(g, m, as)[0], P.Call)} * 0.01745329238474369)`);
      case "degrees": return call(`$f(${par(args(g, m, as)[0], P.Call)} * 57.2957763671875)`);
      case "hex":
        if (sig === "I") return call(`${g.h("hex")}(${args(g, m, as)[0].c}, 8)`);
        if (sig === "I,I") return call(`${g.h("hex")}(${args(g, m, as).map((a) => a.c).join(", ")})`);
        if (sig === "C") return call(`${g.h("hex")}(${args(g, m, as)[0].c}, 4)`);
        if (sig === "B") return call(`${g.h("hex")}(${args(g, m, as)[0].c}, 2)`);
        break;
      case "binary":
        if (sig === "I") return call(`${g.h("binary")}(${args(g, m, as)[0].c}, 32)`);
        if (sig === "I,I") return call(`${g.h("binary")}(${args(g, m, as).map((a) => a.c).join(", ")})`);
        if (sig === "C") return call(`${g.h("binary")}(${args(g, m, as)[0].c}, 16)`);
        if (sig === "B") return call(`${g.h("binary")}(${args(g, m, as)[0].c}, 8)`);
        break;
      case "nf": case "nfc": case "nfs": case "nfp": {
        // Scalar overloads only; the array forms are left to the runtime.
        if (sig.includes("[")) break;
        const xs = args(g, m, as).map((x) => x.c);
        const isFloat = m.params[0].tag === "prim" && m.params[0].name === "float";
        let text: string;
        if (name === "nfc") text = isFloat ? `${g.h("nfFloat")}(${xs[0]}, 0, ${xs[1] ?? 0}, true)` : `${g.h("nfInt")}(${xs[0]}, 0, true)`;
        else if (isFloat) text = `${g.h("nfFloat")}(${xs[0]}, ${xs[1] ?? 0}, ${xs[2] ?? 0})`;
        else text = `${g.h("nfInt")}(${xs[0]}, ${xs[1] ?? 0})`;
        return name === "nfs" || name === "nfp" ? call(`${g.h(name)}(${text})`) : call(text);
      }
      case "unhex": return call(`${g.h("unhex")}(${args(g, m, as)[0].c})`);
      case "unbinary": return call(`${g.h("unbinary")}(${args(g, m, as)[0].c})`);
      case "parseInt": case "parseFloat": case "parseBoolean": case "parseByte": case "parseChar":
        return null; // handled through Conversion for int(x) etc.; direct calls use the runtime
    }
    return null;
  }
  if (owner === "java.io.PrintStream" && (name === "println" || name === "print")) {
    return call(`${g.h(name)}(${printText(g, m, as, varargs, false).c})`);
  }
  if (owner === "java.io.PrintStream" && (name === "printf" || name === "format")) {
    const [fmt, ...rest] = as;
    return call(`${g.h("print")}($S.format(${g.expr(fmt).c}, [${rest.map((a) => g.expr(a).c).join(", ")}]))`);
  }

  // --- String -----------------------------------------------------------------------------------------
  if (owner === "java.lang.String") {
    const xs = args(g, m, as);
    const r = recv ? par(recv, P.Call) : "";
    const a = xs.map((x) => x.c);
    if (name === "<init>") {
      if (sig === "") return { c: '""', p: P.Primary };
      if (sig === "java.lang.String") return xs[0];
      if (sig.startsWith("[C")) return call(`$S.fromChars(${a.join(", ")})`);
      return null;
    }
    if (m.flags & Flags.Static) {
      switch (name) {
        case "valueOf": case "copyValueOf":
          if (sig.startsWith("[C")) return call(`$S.fromChars(${a.join(", ")})`);
          return g.str(xs[0], m.params[0]);
        case "format": {
          const [fmt, ...rest] = as;
          if (fmt.ty && g.ts.isString(fmt.ty)) return call(`$S.format(${g.expr(fmt).c}, [${rest.map((x) => g.expr(x).c).join(", ")}])`);
          return null;
        }
        case "join":
          if (varargs) return call(`$S.join(${a[0]}, [${as.slice(1).map((x) => g.expr(x).c).join(", ")}])`);
          return call(`$S.join(${a[0]}, ${a[1]})`);
      }
      return null;
    }
    switch (name) {
      case "length": return call(`${r}.length`);
      case "isEmpty": return { c: `${r}.length === 0`, p: P.Eq };
      case "charAt": return call(`$S.charAt(${r}, ${a[0]})`);
      case "equals": return call(`$S.equals(${r}, ${a[0]})`);
      case "equalsIgnoreCase": return call(`$S.equalsIgnoreCase(${r}, ${a[0]})`);
      case "compareTo": return call(`$S.compareTo(${r}, ${a[0]})`);
      case "compareToIgnoreCase": return call(`$S.compareToIgnoreCase(${r}, ${a[0]})`);
      case "hashCode": return call(`$S.hashCode(${r})`);
      case "indexOf": return call(`$S.indexOf(${r}, ${a.join(", ")})`);
      case "lastIndexOf": return call(`$S.lastIndexOf(${r}, ${a.join(", ")})`);
      case "substring": case "subSequence": return call(`$S.substring(${r}, ${a.join(", ")})`);
      case "trim": return call(`$S.trim(${r})`);
      case "strip": return call(`${r}.trim()`);
      case "toUpperCase": case "toLowerCase": return call(`${r}.${name}()`);
      case "contains": return call(`${r}.includes(${a[0]})`);
      case "startsWith": return call(`${r}.startsWith(${a.join(", ")})`);
      case "endsWith": return call(`${r}.endsWith(${a[0]})`);
      case "replace": return sig === "C,C" ? call(`$S.replaceChar(${r}, ${a.join(", ")})`) : call(`$S.replace(${r}, ${a.join(", ")})`);
      case "replaceAll": return call(`$S.replaceAll(${r}, ${a.join(", ")})`);
      case "replaceFirst": return call(`$S.replaceFirst(${r}, ${a.join(", ")})`);
      case "matches": return call(`$S.matches(${r}, ${a[0]})`);
      case "split": return call(`$S.split(${r}, ${a.join(", ")})`);
      case "toCharArray": return call(`$S.toCharArray(${r})`);
      case "concat": return { c: `${par(recv!, P.Add)} + ${par(xs[0], P.Add + 1)}`, p: P.Add };
      case "repeat": return call(`$S.repeat(${r}, ${a[0]})`);
      case "toString": case "intern": return recv;
      case "codePointAt": return call(`${r}.codePointAt(${a[0]})`);
      case "isBlank": return call(`(${r}.trim().length === 0)`);
    }
    return null;
  }

  // --- values that are JS primitives at run time -------------------------------------------------------
  if (BOXES.has(owner) && !(m.flags & Flags.Static) && recv) {
    const xs = args(g, m, as);
    // equals/hashCode/compareTo/toString work on the box; the xxxValue methods on the primitive (a
    // Number is a JS number or a JFloat/JDouble: valueOf() gives the number either way).
    const p = unboxedOf(g, owner)?.name ?? "double";
    const v = (): Emit => (owner === "java.lang.Number" ? call(`${par(recv, P.Call)}.valueOf()`) : g.unbox(recv, m.owner.thisType));
    switch (name) {
      case "equals": return call(`${g.h("jequals")}(${recv.c}, ${xs[0].c})`);
      case "hashCode": return call(`${g.h("jhash")}(${recv.c})`);
      case "toString": return g.str(recv, m.owner.thisType);
      case "compareTo": case "compare": return call(`${g.h("jcompare")}(${recv.c}, ${xs[0].c})`);
      case "intValue": return g.primConvert(v(), p, "int", true);
      case "longValue": return g.primConvert(v(), p, "long", true);
      case "floatValue": return g.primConvert(v(), p, "float", true);
      case "doubleValue": return g.primConvert(v(), p, "double", true);
      case "shortValue": return g.primConvert(v(), p, "short", true);
      case "byteValue": return g.primConvert(v(), p, "byte", true);
      case "charValue": case "booleanValue": return v();
      case "isNaN": return call(`Number.isNaN(${v().c})`);
      case "isInfinite": return { c: `$M.abs(${v().c}) === 1/0`, p: P.Eq };
    }
    return null;
  }
  if ((owner === "java.lang.Object" || owner === "java.lang.Comparable" || owner === "java.lang.CharSequence") && recv && recv.c !== "super") {
    const xs = args(g, m, as);
    switch (`${name}(${sig})`) {
      case "equals(java.lang.Object)": return call(`${g.h("jequals")}(${recv.c}, ${xs[0].c})`);
      case "hashCode()": return call(`${g.h("jhash")}(${recv.c})`);
      case "toString()": return call(`$S.valueOf(${recv.c})`);
      case "getClass()": return call(`${g.h("getClass")}(${recv.c})`);
      case "clone()": return call(`${g.h("clone")}(${recv.c})`);
      case "compareTo(java.lang.Object)": return call(`${g.h("jcompare")}(${recv.c}, ${xs[0].c})`);
      case "length()": return call(`${g.h("csLength")}(${recv.c})`);
      case "charAt(I)": return call(`${g.h("csCharAt")}(${recv.c}, ${xs[0].c})`);
    }
    return null;
  }

  // --- java.lang statics that need static types -------------------------------------------------------
  if (owner === "java.lang.Math") {
    const xs = args(g, m, as).map((x) => x.c);
    switch (name) {
      case "abs":
        if (sig === "I") return { c: `$M.abs(${xs[0]}) | 0`, p: 6 };
        return call(`$M.abs(${xs[0]})`);
      case "max": case "min": return call(`$M.${name}(${xs.join(", ")})`);
      case "round": return sig === "F" ? call(`${g.h("d2i")}($M.round(${xs[0]}))`) : call(`$M.round(${xs[0]})`);
      case "floor": case "ceil": case "sqrt": case "cbrt": case "pow": case "sin": case "cos": case "tan": case "asin": case "acos": case "atan": case "atan2":
      case "exp": case "log": case "log10": case "hypot": case "random": case "sinh": case "cosh": case "tanh": case "expm1": case "log1p":
        return call(`$M.${name}(${xs.join(", ")})`);
      case "signum": return sig === "F" ? call(`$f($M.sign(${xs[0]}))`) : call(`$M.sign(${xs[0]})`);
      case "toRadians": return call(`(${xs[0]} / 180 * $M.PI)`);
      case "toDegrees": return call(`(${xs[0]} * 180 / $M.PI)`);
      case "floorDiv": return call(`${g.h("floorDiv")}(${xs.join(", ")})`);
      case "floorMod": return call(`${g.h("floorMod")}(${xs.join(", ")})`);
    }
    return null;
  }
  if (owner === "java.lang.System") {
    switch (name) {
      case "currentTimeMillis": return call(`${g.h("currentTimeMillis")}()`);
      case "nanoTime": return call(`${g.h("nanoTime")}()`);
      case "arraycopy": return call(`${g.h("arraycopy")}(${args(g, m, as).map((x) => x.c).join(", ")})`);
      case "exit": return call(`$p.exit()`);
      case "identityHashCode": return call(`${g.h("identityHash")}(${args(g, m, as)[0].c})`);
    }
    return null;
  }
  if (owner === "java.lang.Thread" && name === "sleep") return call(`${g.h("sleep")}(${args(g, m, as)[0].c})`);
  // List.remove(int index) and Collection.remove(Object) are both "remove" in JS: the index form is removeAt.
  if (name === "remove" && sig === "I" && recv && owner.startsWith("java.util.")) return call(`${par(recv, P.Call)}.removeAt(${args(g, m, as)[0].c})`);
  if ((owner === "java.lang.StringBuilder" || owner === "java.lang.StringBuffer") && (name === "append" || name === "insert") && m.params.length) {
    // append(char) and append(int) are different methods; JS sees two numbers.
    const xs = args(g, m, as);
    const k = name === "append" ? 0 : 1;
    const p = m.params[k];
    const text = code(p) === "[C" ? call(`$S.fromChars(${as.slice(k).map((x) => g.expr(x).c).join(", ")})`) : g.str(xs[k], p.tag === "prim" || g.ts.isString(p) ? p : as[k].ty ?? p);
    const rest = name === "append" ? text.c : `${xs[0].c}, ${text.c}`;
    return call(`${par(recv!, P.Call)}.${name}(${rest})`);
  }
  return null;
}

function unboxedOf(g: Gen, owner: string): PrimType | null {
  return g.ts.unboxed(g.ts.lib.type(owner));
}
