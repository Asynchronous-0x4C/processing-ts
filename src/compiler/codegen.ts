// Code generation: the checked AST (check.ts) → JavaScript (ES2022) + a Source Map v3.
//
// The output is the body of `new Function("$rt", "__renderer__", code)`; it returns the sketch instance.
//   - Prologue: aliases of runtime helpers ($L = $rt.lang ...) and of library classes, in the function's
//     own scope so user names (a class called Math...) cannot shadow them.
//   - A block with the user's code: interfaces (lang Iface objects), classes, the sketch's fields as
//     `let` variables and its methods as functions (fast and simple to reach from inner classes), the
//     sketch class extending $rt.PApplet with the methods the runtime calls, then field initializers.
// Java semantics are kept with static types: int arithmetic wraps (|0, Math.imul), float results are
// rounded to float32 after each operation, casts saturate, compound assignments narrow, chars are
// numbers, string conversion follows Java (Float.toString...). Overloaded user methods get mangled
// names (move$F$F); Java constructors become `$init...` methods called after `new`.
// Source maps are per statement (enough to report runtime errors at the right .pde line).
import type * as A from "./ast.ts";
import { Modifier, walk } from "./ast.ts";
import type { CheckResult } from "./check.ts";
import { convert } from "./constants.ts";
import { libraryCall, libraryField, type Emit } from "./intrinsics.ts";
import type { SketchSource } from "./source.ts";
import { SourceMapBuilder, type SourceMapV3 } from "./sourcemap.ts";
import type { TypeSystem } from "./typesystem.ts";
import {
  Flags, T, asSuper, erasure, isNumeric, substOf, substitute, typeToString, upperBound,
  type ClassSymbol, type ClassType, type ConstValue, type FieldSymbol, type LocalSymbol, type MethodSymbol, type PrimName, type Type,
} from "./types.ts";

export interface GenerateOptions {
  /** Check array indices (ArrayIndexOutOfBoundsException). Default true. */
  boundsChecks?: boolean;
}

export interface GenerateResult {
  code: string;
  map: SourceMapV3;
  /** The sketch calls a text drawing/measuring method of PApplet or PGraphics (the runtime loads the default font before setup()). */
  usesText: boolean;
}

// JS operator precedence (higher binds tighter).
export const P = { Comma: 1, Assign: 2, Cond: 3, Or: 4, And: 5, BitOr: 6, BitXor: 7, BitAnd: 8, Eq: 9, Rel: 10, Shift: 11, Add: 12, Mul: 13, Unary: 15, Postfix: 16, Call: 18, Primary: 19 } as const;

const BINARY_PREC: Record<string, number> = {
  "||": P.Or, "&&": P.And, "|": P.BitOr, "^": P.BitXor, "&": P.BitAnd, "==": P.Eq, "!=": P.Eq, "===": P.Eq, "!==": P.Eq,
  "<": P.Rel, ">": P.Rel, "<=": P.Rel, ">=": P.Rel, "<<": P.Shift, ">>": P.Shift, ">>>": P.Shift,
  "+": P.Add, "-": P.Add, "*": P.Mul, "/": P.Mul, "%": P.Mul,
};

const JS_RESERVED = new Set([
  "arguments", "await", "debugger", "delete", "eval", "export", "function", "in", "let", "typeof", "var", "with", "yield",
  "undefined", "NaN", "Infinity", "of", "async", "get", "set", "constructor", "prototype", "__proto__", "globalThis",
]);

/** A Java identifier as a JS identifier. Generated names start with "$"; user "$" is doubled. */
export function escapeName(n: string): string {
  const s = n.includes("$") ? n.replace(/\$/g, "$$$$") : n;
  return JS_RESERVED.has(s) ? s + "$" : s;
}

export const par = (e: Emit, min: number): string => (e.p < min ? `(${e.c})` : e.c);

/** Literal for a constant of a primitive or String type. */
export function literal(v: ConstValue): Emit {
  if (typeof v === "string") return { c: JSON.stringify(v), p: P.Primary };
  if (typeof v === "boolean") return { c: String(v), p: P.Primary };
  if (v !== v) return { c: "(0/0)", p: P.Primary };
  if (v === Infinity) return { c: "(1/0)", p: P.Primary };
  if (v === -Infinity) return { c: "(-1/0)", p: P.Primary };
  if (Object.is(v, -0)) return { c: "-0", p: P.Unary };
  return v < 0 ? { c: String(v), p: P.Unary } : { c: String(v), p: P.Primary };
}

/** JVM-like letter of a type for mangled names and intrinsic keys. */
export function typeCode(t: Type): string {
  const e = erasure(t);
  switch (e.tag) {
    case "prim": return { boolean: "Z", byte: "B", short: "S", char: "C", int: "I", long: "J", float: "F", double: "D" }[e.name];
    case "array": return "A" + typeCode(e.elem);
    case "class": return e.sym.name || "Anon";
    default: return "O";
  }
}

function elemKind(t: Type): string {
  if (t.tag !== "prim") return "L";
  return { boolean: "Z", byte: "B", short: "S", char: "C", int: "I", long: "J", float: "F", double: "D" }[t.name];
}

/** Java's default value of a field of type `t`. */
function defaultValue(t: Type): string {
  if (t.tag !== "prim") return "null";
  return t.name === "boolean" ? "false" : "0";
}

const PAPPLET = "processing.core.PApplet";
/** Library methods whose result depends on the default font being loaded (GenerateResult.usesText). */
const TEXT_METHODS = new Set(["text", "textWidth", "textAscent", "textDescent"]);
const TEXT_OWNERS = new Set([PAPPLET, "processing.core.PGraphics"]);

/**
 * Methods the current runtime (src/lib/runtime) calls under other names: event handlers share their
 * names with PApplet's boolean fields (mousePressed), so they are installed with a leading underscore.
 */
const RUNTIME_HANDLER_NAMES: Record<string, string> = {
  mousePressed: "_mousePressed", mouseReleased: "_mouseReleased", mouseClicked: "_mouseClicked", mouseMoved: "_mouseMoved",
  mouseDragged: "_mouseDragged", mouseWheel: "_mouseWheel", keyPressed: "_keyPressed", keyReleased: "_keyReleased",
  keyTyped: "_keyTyped", windowResized: "_windowResized",
};

interface FnCtx {
  /** Number of `$t` temporaries used (declared with `var` at the end of the function). */
  temps: number;
  /** The function is async (sketch settings/setup/draw calling size()). */
  async: boolean;
}

export function generate(check: CheckResult, source: SketchSource, options: GenerateOptions = {}): GenerateResult {
  const g = new Gen(check, source, options);
  return g.run();
}

export class Gen {
  readonly ts: TypeSystem;
  readonly sketch: ClassSymbol;
  readonly check: CheckResult;
  readonly source: SketchSource;
  readonly boundsChecks: boolean;
  private readonly lines: string[] = [];
  private indent = 0;
  /** Current class whose code is being emitted. */
  cls!: ClassSymbol;
  /** See GenerateResult.usesText. */
  private usesText = false;
  private fn: FnCtx = { temps: 0, async: false };
  /** Library classes and interfaces referenced, by binary name → local alias. */
  private readonly libAliases = new Map<string, string>();
  private readonly ifaceAliases = new Map<string, string>();
  /** Names used as locals anywhere (sketch-level names avoid them). */
  private readonly localNames = new Set<string>();
  private readonly overloaded = new Set<string>();
  private readonly fieldNames = new Set<string>();
  private readonly classNames = new Map<ClassSymbol, string>();
  private readonly sketchFieldNames = new Map<FieldSymbol, string>();
  private readonly methodNames = new Map<MethodSymbol, string>();
  private readonly helpers = new Set<string>();

  constructor(check: CheckResult, source: SketchSource, options: GenerateOptions) {
    this.check = check;
    this.ts = check.types;
    this.sketch = check.sketchClass;
    this.source = source;
    this.boundsChecks = options.boundsChecks ?? true;
  }

  // --- output -------------------------------------------------------------------------------------

  /** Emit one line; `at` maps it to a source position. */
  line(text: string, at?: { start: number; synthetic?: true }) {
    const pad = "  ".repeat(this.indent);
    if (at && !at.synthetic) {
      const loc = this.source.locate(at.start);
      this.rawMappings.push([this.lines.length, pad.length, loc.tabIndex, loc.line - 1, loc.column - 1]);
    }
    for (const l of text.split("\n")) this.lines.push(pad + l);
  }

  /** A runtime helper from $rt.lang, bound to a local `$name` in the prologue. */
  h(name: string): string {
    this.helpers.add(name);
    return "$" + name;
  }

  /** Alias of a library class (by binary name) from $rt.classes. */
  lib(fullName: string): string {
    let a = this.libAliases.get(fullName);
    if (!a) {
      const simple = fullName.slice(Math.max(fullName.lastIndexOf("."), fullName.lastIndexOf("$")) + 1);
      a = "$" + simple;
      let k = 2;
      while ([...this.libAliases.values()].includes(a) || this.helpers.has(a.slice(1))) a = "$" + simple + k++;
      this.libAliases.set(fullName, a);
    }
    return a;
  }

  /** Iface object of a library interface. */
  libIface(fullName: string): string {
    let a = this.ifaceAliases.get(fullName);
    if (!a) {
      a = "$I_" + fullName.slice(Math.max(fullName.lastIndexOf("."), fullName.lastIndexOf("$")) + 1);
      let k = 2;
      while ([...this.ifaceAliases.values()].includes(a)) a = a.replace(/\d*$/, "") + k++;
      this.ifaceAliases.set(fullName, a);
    }
    return a;
  }

  temp(): string {
    return "$t" + ++this.fn.temps;
  }

  // --- names --------------------------------------------------------------------------------------

  private collectNames() {
    const methodsByName = new Map<string, Set<string>>();
    walk(this.sketch.decl!, (n) => {
      switch (n.kind) {
        case "LocalVar": for (const d of n.declarators) this.localNames.add(d.name.text); break;
        case "Param": this.localNames.add(n.name.text); break;
        case "ForEach": this.localNames.add(n.name.text); break;
        case "Catch": this.localNames.add(n.name.text); break;
        case "FieldDecl": for (const d of n.declarators) this.fieldNames.add(d.name.text); break;
        case "MethodDecl":
          if (n.sym) {
            let s = methodsByName.get(n.name.text);
            if (!s) methodsByName.set(n.name.text, (s = new Set()));
            s.add(n.sym.params.map(typeCode).join(","));
          }
          break;
      }
    });
    for (const [name, sigs] of methodsByName) if (sigs.size > 1) this.overloaded.add(name);
  }

  /** JS name of a source class (flattened: Outer$Inner), unique and not shadowed by locals. */
  className(c: ClassSymbol): string {
    let n = this.classNames.get(c);
    if (n) return n;
    if (c.isSketch) n = "$Sketch";
    else if (c.flags & Flags.Anonymous) n = "$Anon";
    else {
      const parts: string[] = [];
      for (let o: ClassSymbol | null = c; o && !o.isSketch; o = o.outer) parts.unshift(escapeName(o.name));
      n = parts.join("$");
      if (c.flags & Flags.Local) n += "$L" + this.classNames.size;
      if (this.localNames.has(n) || this.fieldNames.has(n)) n += "$C";
    }
    this.classNames.set(c, n);
    return n;
  }

  /** Expression for a class used as a value (constructor / static member owner). */
  classRef(c: ClassSymbol): string {
    if (!c.isSource) return this.libClassRef(c);
    return this.className(c);
  }

  /** Runtime class of a library class: lang's exceptions and objects, else $rt.classes. */
  libClassRef(c: ClassSymbol): string {
    const n = c.fullName;
    if (n === "java.lang.Object") return this.h("JObject");
    if (n === "java.lang.Error") return this.h("JError");
    if (n === "java.lang.Enum") return this.h("JEnum");
    if (LANG_EXCEPTIONS.has(n)) return this.h(n.slice(n.lastIndexOf(".") + 1));
    return this.lib(n);
  }

  /** Runtime object for `instanceof`/casts: classes or Iface objects. */
  typeRef(c: ClassSymbol): string {
    c.load();
    if (c.isInterface) return c.isSource ? this.className(c) : this.libIface(c.fullName);
    return this.classRef(c);
  }

  sketchField(f: FieldSymbol): string {
    let n = this.sketchFieldNames.get(f);
    if (!n) {
      n = escapeName(f.name);
      if (this.localNames.has(f.name) || [...this.classNames.values()].includes(n)) n += "$f";
      this.sketchFieldNames.set(f, n);
    }
    return n;
  }

  /** The library method a source method overrides (its runtime name must be kept). */
  private overriddenLibrary(m: MethodSymbol): MethodSymbol | null {
    if (m.name === "<init>" || m.flags & Flags.Static) return null;
    const seen = new Set<ClassSymbol>();
    const visit = (c: ClassSymbol): MethodSymbol | null => {
      if (seen.has(c)) return null;
      seen.add(c);
      c.load();
      if (!c.isSource) {
        const hit = (c.methods.get(m.name) ?? []).find((x) => x.params.length === m.params.length && x.params.every((p, i) => typeCode(p) === typeCode(m.params[i]) || erasure(p).tag !== "prim" && erasure(m.params[i]).tag !== "prim"));
        if (hit && !(hit.flags & Flags.Static)) return hit;
      }
      const sups = [c.superclass?.sym, ...c.interfaces.map((i) => i.sym)].filter((x): x is ClassSymbol => !!x);
      for (const s of sups) {
        const r = visit(s);
        if (r) return r;
      }
      return null;
    };
    const sups = [m.owner.superclass?.sym, ...m.owner.interfaces.map((i) => i.sym)].filter((x): x is ClassSymbol => !!x);
    for (const s of sups) {
      const r = visit(s);
      if (r) return r;
    }
    return null;
  }

  /** JS property/function name of a method. */
  methodName(m: MethodSymbol): string {
    const cached = this.methodNames.get(m);
    if (cached) return cached;
    let n: string;
    if (m.name === "<init>") {
      n = m.owner.isSource && m.owner.constructors.length > 1 ? "$init$" + m.params.map(typeCode).join("$") : "$init";
    } else if (!m.owner.isSource) n = m.name;
    else {
      const lib = this.overriddenLibrary(m);
      // Sketch methods are plain functions, so PApplet overloads (mousePressed() and
      // mousePressed(MouseEvent)) need distinct names; the $Sketch class picks the one to call.
      if (lib && !(m.owner.isSketch && this.overloaded.has(m.name))) n = lib.name;
      else if (lib) n = escapeName(m.name) + "$" + m.params.map(typeCode).join("$");
      else {
        n = escapeName(m.name);
        if (this.overloaded.has(m.name)) n += "$" + m.params.map(typeCode).join("$");
        if (this.fieldNames.has(m.name)) n += "$m";
        if (m.owner.isSketch && (this.localNames.has(n) || [...this.classNames.values()].includes(n))) n += "$fn";
      }
    }
    this.methodNames.set(m, n);
    return n;
  }

  // --- program ------------------------------------------------------------------------------------

  run(): GenerateResult {
    this.collectNames();
    this.cls = this.sketch;
    const body: string[] = [];
    const savedLines = this.lines.length;
    // The user scope is emitted first (into this.lines), the prologue is put in front of it afterwards;
    // mappings are shifted by the prologue's line count.
    this.indent = 1;
    this.emitProgram();
    this.indent = 0;
    const user = this.lines.splice(savedLines);
    body.push(...this.prologue());
    const offset = body.length + 1; // "{" line
    body.push("{", ...user, "}");
    const code = body.join("\n") + "\n";
    const map = new SourceMapBuilder();
    for (const [gl, gc, s, l, c] of this.rawMappings) map.add(gl - savedLines + offset, gc, s, l, c);
    return { code, map: map.toJSON(this.source.tabs.map((t) => t.name), this.source.tabs.map((t) => t.text)), usesText: this.usesText };
  }

  /** [generated line, column, tab, line, column] (0-based), lines relative to the user block. */
  private readonly rawMappings: [number, number, number, number, number][] = [];

  private prologue(): string[] {
    const out = ['"use strict";', "const $L = $rt.lang, $S = $L.S, $M = Math, $f = Math.fround, $imul = Math.imul;"];
    const helpers = [...this.helpers].filter((n) => !["L", "S", "M", "f", "imul"].includes(n)).sort();
    if (helpers.length) out.push(`const { ${helpers.map((n) => `${n}: $${n}`).join(", ")} } = $L;`);
    // A class the type checker knows but the runtime lacks fails when it is used, with a clear message.
    for (const [name, alias] of this.libAliases) out.push(`const ${alias} = $rt.classes[${JSON.stringify(name)}] ?? $L.missingClass(${JSON.stringify(name)});`);
    for (const [name, alias] of this.ifaceAliases) out.push(`const ${alias} = $L.libraryIface(${JSON.stringify(name)});`);
    return out;
  }

  /** Classes in an order where superclasses and implemented interfaces come first. */
  private orderedClasses(): ClassSymbol[] {
    const all: ClassSymbol[] = [];
    const collect = (c: ClassSymbol) => {
      for (const m of c.memberTypes.values()) {
        if (!m.isSource) continue;
        all.push(m);
        collect(m);
      }
    };
    collect(this.sketch);
    const out: ClassSymbol[] = [];
    const done = new Set<ClassSymbol>();
    const visit = (c: ClassSymbol) => {
      if (done.has(c) || !all.includes(c)) return;
      done.add(c);
      if (c.superclass) visit(c.superclass.sym);
      for (const i of c.interfaces) visit(i.sym);
      out.push(c);
    };
    for (const c of all) visit(c);
    return out;
  }

  private emitProgram() {
    const sk = this.sketch;
    const decl = this.check.sketch.decl;
    for (const c of this.orderedClasses()) this.className(c); // fix names before use
    // Sketch fields with Java default values.
    const fields = decl.body.filter((m): m is A.FieldDecl => m.kind === "FieldDecl");
    for (const f of fields) {
      for (const d of f.declarators) {
        const sym = d.sym as FieldSymbol;
        this.line(`let ${this.sketchField(sym)} = ${defaultValue(sym.type)};`, d);
      }
    }
    // Sketch methods as functions.
    for (const m of decl.body) if (m.kind === "MethodDecl" && m.body) this.sketchFunction(m);
    // Interfaces and classes.
    for (const c of this.orderedClasses()) this.classDecl(c);
    // The sketch class: methods the runtime calls.
    this.line(`class $Sketch extends $rt.PApplet {`);
    this.indent++;
    // One entry per runtime name: of overloads such as keyPressed() and keyPressed(KeyEvent), PApplet
    // calls the one with the event (its default implementation calls the other).
    const entries = new Map<string, A.MethodDecl>();
    for (const m of decl.body) {
      if (m.kind !== "MethodDecl" || !m.sym || !m.body) continue;
      const lib = this.overriddenLibrary(m.sym);
      if (!lib || lib.owner.fullName !== PAPPLET) continue;
      const name = RUNTIME_HANDLER_NAMES[m.name.text] ?? m.name.text;
      const prev = entries.get(name);
      if (!prev || prev.sym!.params.length < m.sym.params.length) entries.set(name, m);
    }
    for (const [name, m] of entries) {
      const fn = this.methodName(m.sym!);
      const isAsync = this.asyncSketchMethods.has(m.sym!);
      this.line(`${isAsync ? "async " : ""}${name}(...a) { return ${isAsync ? "await " : ""}${fn}(...a); }`);
    }
    this.indent--;
    this.line("}");
    this.line(`$Sketch.$javaName = ${JSON.stringify(sk.name)};`);
    this.line("const $p = new $Sketch(__renderer__);");
    // Static initializers of classes, then the sketch's field initializers (Java: in the constructor).
    for (const c of this.orderedClasses()) this.staticInit(c);
    this.fn = { temps: 0, async: false };
    for (const m of decl.body) {
      if (m.kind === "FieldDecl") {
        for (const d of m.declarators) {
          const sym = d.sym as FieldSymbol;
          if (!d.init) continue;
          this.line(`${this.sketchField(sym)} = ${this.init(d.init, sym.type).c};`, d);
        }
      } else if (m.kind === "Initializer" && !m.static) {
        this.block(m.body);
      }
    }
    this.declareTemps();
    this.line("return $p;");
  }

  /** Sketch methods that must be async: settings/setup/draw calling size()/fullScreen() (async in the runtime). */
  private readonly asyncSketchMethods = new Set<MethodSymbol>();

  private sketchFunction(m: A.MethodDecl) {
    const sym = m.sym!;
    const name = this.methodName(sym);
    const isAsync = ["settings", "setup", "draw"].includes(m.name.text) && callsAsyncApi(m.body!);
    if (isAsync) this.asyncSketchMethods.add(sym);
    const params = m.params.map((p) => this.localName(p.sym!)).join(", ");
    this.functionBody(`${isAsync ? "async " : ""}function ${name}(${params})`, m.body!, m, sym.ret, isAsync);
  }

  /** Emit `header { body }` with the function's temporaries declared at the end (var hoists). */
  private functionBody(header: string, body: A.Block, at: { start: number; synthetic?: true }, ret: Type, isAsync = false, prelude: string[] = []) {
    const saved = this.fn;
    this.fn = { temps: 0, async: isAsync };
    this.retStack.push(ret);
    this.line(`${header} {`, at);
    this.indent++;
    for (const p of prelude) this.line(p);
    for (const s of body.body) this.stmt(s);
    this.declareTemps();
    this.indent--;
    this.line("}");
    this.retStack.pop();
    this.fn = saved;
  }

  private declareTemps() {
    if (this.fn.temps) this.line(`var ${Array.from({ length: this.fn.temps }, (_, i) => "$t" + (i + 1)).join(", ")};`);
  }

  /** JS name of a local; names starting with "$gen" are synthesized (user names never start with one "$"). */
  localName(v: LocalSymbol): string {
    return v.name.startsWith("$gen") ? v.name : escapeName(v.name);
  }

  // --- classes ------------------------------------------------------------------------------------

  /** Whether instances of `c` carry `$outer` (inner member classes of user classes). */
  private hasOuterField(c: ClassSymbol): boolean {
    return c.isInner && !!c.outer && !c.outer.isSketch && !(c.flags & (Flags.Local | Flags.Anonymous));
  }

  private superRef(c: ClassSymbol): string {
    if (c.isEnum) return this.h("JEnum");
    if (!c.superclass) return this.h("JObject");
    return this.classRef(c.superclass.sym);
  }

  private classDecl(c: ClassSymbol) {
    const d = c.decl!;
    if (c.isInterface) {
      this.interfaceDecl(c, d as A.InterfaceDecl);
      return;
    }
    const name = this.className(c);
    this.line(`class ${name} extends ${this.superRef(c)} {`, d);
    this.classBody(c, name);
    this.line("}");
    this.classEpilogue(c, name);
  }

  /** Members of a class (between the braces). */
  private classBody(c: ClassSymbol, name: string) {
    const saved = this.cls;
    this.cls = c;
    this.indent++;
    const d = c.decl!;
    const body = d.kind === "NewObject" ? d.body ?? [] : d.body;
    // JS constructor: Java default values of instance fields (and the enclosing instance).
    const instanceFields = body.flatMap((m) => (m.kind === "FieldDecl" && !(m.modifiers & Modifier.Static) ? m.declarators : []));
    const outer = this.hasOuterField(c);
    const superHasOuter = c.superclass?.sym.isSource ? this.hasOuterField(c.superclass.sym) : false;
    if (instanceFields.length || outer) {
      this.line(`constructor($o) {`);
      this.indent++;
      this.line(superHasOuter ? "super($o);" : "super();");
      if (outer) this.line("this.$outer = $o;");
      for (const v of instanceFields) this.line(`this.${escapeName(v.name.text)} = ${defaultValue((v.sym as FieldSymbol).type)};`);
      this.indent--;
      this.line("}");
    }
    // Java constructors.
    const ctors = body.filter((m): m is A.ConstructorDecl => m.kind === "ConstructorDecl");
    if (ctors.length === 0) this.defaultConstructor(c, body);
    for (const k of ctors) this.constructorDecl(c, k, body);
    for (const m of body) {
      if (m.kind === "MethodDecl" && m.body && m.sym) {
        const isStatic = (m.sym.flags & Flags.Static) !== 0;
        const params = m.params.map((p) => this.localName(p.sym!)).join(", ");
        const prelude = this.needsSelf(m.body) && !isStatic ? [`const $this_${name} = this;`] : [];
        this.functionBody(`${isStatic ? "static " : ""}${this.methodName(m.sym)}(${params})`, m.body, m, m.sym.ret, false, prelude);
      }
    }
    if (c.isEnum) {
      this.line(`static values() { return ${name}.$values.slice(); }`);
      this.line(`static valueOf(s) { return ${this.h("enumValueOf")}(${name}.$values, s, ${JSON.stringify(c.displayName)}); }`);
    }
    this.indent--;
    this.cls = saved;
  }

  private classEpilogue(c: ClassSymbol, name: string) {
    this.line(`${name}.$javaName = ${JSON.stringify(c.fullName)};`);
    const ifaces = c.interfaces.map((i) => this.typeRef(i.sym));
    if (ifaces.length) this.line(`${this.h("implement")}(${name}, [${ifaces.join(", ")}]);`);
    // Static fields with default values (initializers run in staticInit).
    const d = c.decl!;
    if (d.kind === "NewObject") return;
    for (const m of d.body) {
      if (m.kind !== "FieldDecl" || !(m.modifiers & Modifier.Static || c.isInterface)) continue;
      for (const v of m.declarators) this.line(`${name}.${this.staticFieldName(v.name.text)} = ${defaultValue((v.sym as FieldSymbol).type)};`);
    }
  }

  /** Static members are properties of the class function: avoid its own `name`/`length`/`prototype`. */
  staticFieldName(n: string): string {
    const e = escapeName(n);
    return ["name", "length", "prototype", "caller", "arguments", "supers", "proto", "all"].includes(e) ? e + "$" : e;
  }

  private staticInit(c: ClassSymbol) {
    const d = c.decl!;
    if (d.kind === "NewObject") return;
    const name = this.className(c);
    const saved = this.cls;
    this.cls = c;
    if (d.kind === "EnumDecl") {
      d.constants.forEach((k, i) => {
        const ctor = k.ctor;
        const target = k.anonymous ? this.anonymousClassExpr(k.anonymous, ctor, name) : name;
        const args = ctor ? this.args(k.args ?? [], ctor, k.varargsCall ?? false) : "";
        const init = k.anonymous ? "$init" : ctor ? this.methodName(ctor) : "$init";
        this.line(`${name}.${this.staticFieldName(k.name.text)} = ${this.h("enumConstant")}(new (${target})().${init}(${args}), ${JSON.stringify(k.name.text)}, ${i});`, k);
      });
      this.line(`${name}.$values = [${d.constants.map((k) => `${name}.${this.staticFieldName(k.name.text)}`).join(", ")}];`);
    }
    for (const m of d.body) {
      if (m.kind === "FieldDecl" && (m.modifiers & Modifier.Static || c.isInterface)) {
        for (const v of m.declarators) {
          const f = v.sym as FieldSymbol;
          if (!v.init) continue;
          this.line(`${name}.${this.staticFieldName(v.name.text)} = ${this.init(v.init, f.type).c};`, v);
        }
      } else if (m.kind === "Initializer" && m.static) this.block(m.body);
    }
    this.cls = saved;
  }

  private interfaceDecl(c: ClassSymbol, d: A.InterfaceDecl) {
    const name = this.className(c);
    const supers = c.interfaces.map((i) => this.typeRef(i.sym));
    const saved = this.cls;
    this.cls = c;
    this.line(`const ${name} = new ${this.h("Iface")}(${JSON.stringify(c.fullName)}, [${supers.join(", ")}], {`, d);
    this.indent++;
    for (const m of d.body) {
      if (m.kind === "MethodDecl" && m.body && m.sym && !(m.sym.flags & Flags.Static)) {
        const params = m.params.map((p) => this.localName(p.sym!)).join(", ");
        this.functionBody(`${this.methodName(m.sym)}(${params})`, m.body, m, m.sym.ret);
        this.lines[this.lines.length - 1] += ",";
      }
    }
    this.indent--;
    this.line("});");
    for (const m of d.body) {
      if (m.kind === "MethodDecl" && m.body && m.sym && m.sym.flags & Flags.Static) {
        const params = m.params.map((p) => this.localName(p.sym!)).join(", ");
        this.functionBody(`${name}.${this.methodName(m.sym)} = function (${params})`, m.body, m, m.sym.ret);
      }
    }
    this.cls = saved;
    for (const m of d.body) {
      if (m.kind !== "FieldDecl") continue;
      for (const v of m.declarators) this.line(`${name}.${this.staticFieldName(v.name.text)} = ${defaultValue((v.sym as FieldSymbol).type)};`);
    }
  }

  /** Implicit constructor: superclass no-arg constructor, then field initializers. */
  private defaultConstructor(c: ClassSymbol, body: A.Member[]) {
    const ctor = c.constructors[0];
    const name = ctor ? this.methodName(ctor) : "$init";
    this.line(`${name}(...$a) {`);
    this.indent++;
    if (c.flags & Flags.Anonymous) {
      // Anonymous classes pass their arguments to the superclass constructor the expression chose.
      const sup = this.anonSuper.get(c);
      this.line(`super.${sup ? this.methodName(sup) : "$init"}(...$a);`);
    } else {
      const sup = this.superConstructor(c);
      if (sup) this.line(`super.${this.methodName(sup)}();`);
    }
    this.fieldInitializers(c, body);
    this.line("return this;");
    this.indent--;
    this.line("}");
  }

  /** Superclass constructor of anonymous classes (from the creation expression or enum constant). */
  private readonly anonSuper = new Map<ClassSymbol, MethodSymbol | undefined>();

  /** The superclass constructor an implicit `super()` calls. */
  private superConstructor(c: ClassSymbol): MethodSymbol | null {
    if (c.isEnum || !c.superclass) return null;
    const ctors = c.superclass.sym.load().constructors;
    return ctors.find((k) => k.params.length === 0) ?? ctors.find((k) => k.flags & Flags.Varargs && k.params.length === 1) ?? null;
  }

  private constructorDecl(c: ClassSymbol, k: A.ConstructorDecl, body: A.Member[]) {
    const sym = k.sym!;
    const saved = this.fn;
    this.fn = { temps: 0, async: false };
    const params = k.params.map((p) => this.localName(p.sym!)).join(", ");
    this.line(`${this.methodName(sym)}(${params}) {`, k);
    this.indent++;
    if (this.needsSelf(k.body)) this.line(`const $this_${this.className(c)} = this;`);
    const call = k.call;
    if (call && !call.super) {
      // this(...): the other constructor runs the field initializers.
      this.line(`this.${call.ctor ? this.methodName(call.ctor) : "$init"}(${call.ctor ? this.args(call.args, call.ctor, call.varargsCall ?? false) : ""});`, call);
    } else {
      if (call?.ctor) this.line(`super.${this.methodName(call.ctor)}(${this.args(call.args, call.ctor, call.varargsCall ?? false)});`, call);
      else {
        const sup = this.superConstructor(c);
        if (sup) this.line(`super.${this.methodName(sup)}();`);
      }
      this.fieldInitializers(c, body);
    }
    this.retStack.push(T.void);
    for (const s of k.body.body) this.stmt(s);
    this.retStack.pop();
    this.line("return this;");
    this.declareTemps();
    this.indent--;
    this.line("}");
    this.fn = saved;
  }

  private fieldInitializers(c: ClassSymbol, body: A.Member[]) {
    for (const m of body) {
      if (m.kind === "FieldDecl" && !(m.modifiers & Modifier.Static) && !c.isInterface) {
        for (const v of m.declarators) {
          if (!v.init) continue;
          const f = v.sym as FieldSymbol;
          this.line(`this.${escapeName(v.name.text)} = ${this.init(v.init, f.type).c};`, v);
        }
      } else if (m.kind === "Initializer" && !m.static) this.block(m.body);
    }
  }

  /** Does a body declare local or anonymous classes (they need the enclosing `this` captured)? */
  private needsSelf(b: A.Block): boolean {
    let found = false;
    walk(b, (n) => {
      if (found) return false;
      if (n.kind === "ClassDecl" || n.kind === "EnumDecl" || n.kind === "InterfaceDecl" || (n.kind === "NewObject" && n.body)) found = true;
      return !found;
    });
    return found;
  }

  /** Class expression for an anonymous class body (a NewObject or an enum constant body). */
  anonymousClassExpr(c: ClassSymbol, superCtor: MethodSymbol | undefined, superExpr?: string): string {
    this.anonSuper.set(c, superCtor);
    // Render into a separate buffer.
    const start = this.lines.length;
    const base = superExpr ?? this.superRef(c);
    this.lines.push(`class extends ${base} {`);
    const keepIndent = this.indent;
    this.indent = 1;
    this.classBody(c, "$Anon");
    this.indent = keepIndent;
    this.lines.push("}");
    const text = this.lines.splice(start).join("\n" + "  ".repeat(this.indent));
    const ifaces = c.interfaces.map((i) => this.typeRef(i.sym));
    return ifaces.length ? `${this.h("anonClass")}(${text}, [${ifaces.join(", ")}], ${JSON.stringify(c.fullName)})` : `${this.h("anonClass")}(${text}, [], ${JSON.stringify(c.fullName)})`;
  }

  // --- statements ---------------------------------------------------------------------------------

  block(b: A.Block) {
    for (const s of b.body) this.stmt(s);
  }

  private nestedStmt(header: string, s: A.Statement, at: A.Node) {
    this.line(`${header} {`, at);
    this.indent++;
    if (s.kind === "Block") this.block(s);
    else this.stmt(s);
    this.indent--;
    this.line("}");
  }

  stmt(s: A.Statement) {
    switch (s.kind) {
      case "Block":
        this.line("{", s);
        this.indent++;
        this.block(s);
        this.indent--;
        this.line("}");
        return;
      case "Empty": return;
      case "LocalVar": {
        const parts = s.declarators.map((d) => {
          const v = d.sym as LocalSymbol;
          return d.init ? `${this.localName(v)} = ${this.init(d.init, v.type).c}` : this.localName(v);
        });
        this.line(`let ${parts.join(", ")};`, s);
        return;
      }
      case "ExprStmt":
        this.line(this.exprStmt(s.expr) + ";", s);
        return;
      case "If": {
        this.line(`if (${this.expr(s.test).c}) {`, s);
        this.indent++;
        this.inner(s.consequent);
        this.indent--;
        if (s.alternate) {
          if (s.alternate.kind === "If") {
            this.line("} else");
            this.stmt(s.alternate);
            return;
          }
          this.line("} else {");
          this.indent++;
          this.inner(s.alternate);
          this.indent--;
        }
        this.line("}");
        return;
      }
      case "While":
        this.nestedStmt(`while (${this.expr(s.test).c})`, s.body, s);
        return;
      case "DoWhile":
        this.line("do {", s);
        this.indent++;
        this.inner(s.body);
        this.indent--;
        this.line(`} while (${this.expr(s.test).c});`, s.test);
        return;
      case "For": {
        let init = "";
        if (s.init.length === 1 && s.init[0].kind === "LocalVar") {
          const lv = s.init[0];
          init = "let " + lv.declarators.map((d) => {
            const v = d.sym as LocalSymbol;
            return d.init ? `${this.localName(v)} = ${this.init(d.init, v.type).c}` : this.localName(v);
          }).join(", ");
        } else init = s.init.map((i) => (i.kind === "ExprStmt" ? this.exprStmt(i.expr) : "")).join(", ");
        const test = s.test ? this.expr(s.test).c : "";
        const update = s.update.map((u) => this.exprStmt(u)).join(", ");
        this.nestedStmt(`for (${init}; ${test}; ${update})`, s.body, s);
        return;
      }
      case "ForEach": this.forEach(s); return;
      case "Labeled": {
        this.line(`${escapeName(s.label.text)}:`, s);
        this.stmt(s.body.kind === "Block" ? s.body : s.body);
        return;
      }
      case "Switch": this.switchStmt(s); return;
      case "Break": this.line(s.label ? `break ${escapeName(s.label.text)};` : "break;", s); return;
      case "Continue": this.line(s.label ? `continue ${escapeName(s.label.text)};` : "continue;", s); return;
      case "Return": {
        if (!s.value) {
          this.line("return;", s);
          return;
        }
        const ret = this.returnType();
        this.line(`return ${ret ? this.coerce(s.value, ret).c : this.expr(s.value).c};`, s);
        return;
      }
      case "Throw": this.line(`throw ${this.expr(s.expr).c};`, s); return;
      case "Assert": return; // assertions are disabled in Processing
      case "Try": this.tryStmt(s); return;
      case "Synchronized":
        this.line(`${this.exprStmt(s.lock)};`, s);
        this.stmt(s.body);
        return;
      case "ClassDecl":
      case "EnumDecl":
      case "InterfaceDecl":
        this.localClassDecl(s);
        return;
    }
  }

  /** Statement inside braces we already opened (if/else bodies). */
  private inner(s: A.Statement) {
    if (s.kind === "Block") this.block(s);
    else this.stmt(s);
  }

  private retStack: (Type | null)[] = [];
  private returnType(): Type | null {
    return this.retStack[this.retStack.length - 1] ?? null;
  }

  private forEach(s: A.ForEach) {
    const it = this.expr(s.iterable);
    const itType = s.iterable.ty!;
    const v = s.sym!;
    const name = this.localName(v);
    if (itType.tag === "array") {
      const a = this.temp();
      const i = this.temp();
      this.line(`for (${a} = ${it.c}, ${i} = 0; ${i} < ${a}.length; ${i}++) {`, s);
      this.indent++;
      this.line(`let ${name} = ${this.convertCode({ c: `${a}[${i}]`, p: P.Call }, itType.elem, v.type).c};`);
    } else {
      const t = this.temp();
      this.line(`for (${t} = ${par(it, P.Call)}.iterator(); ${t}.hasNext();) {`, s);
      this.indent++;
      // Element type as the checker computed it: unboxed when the variable is primitive (float f : List<Float>).
      const sup = asSuper(itType, this.ts.iterable);
      const elem = !sup?.args.length ? this.ts.object : sup.args[0].tag === "wild" ? upperBound(sup.args[0]) : sup.args[0];
      this.line(`let ${name} = ${this.convertCode({ c: `${t}.next()`, p: P.Call }, elem, v.type).c};`);
    }
    this.inner(s.body);
    this.indent--;
    this.line("}");
  }

  private switchStmt(s: A.Switch) {
    const dt = s.discriminant.ty;
    const d = dt && dt.tag !== "prim" && this.ts.unboxed(dt) ? this.unbox(this.expr(s.discriminant), dt) : this.expr(s.discriminant);
    this.line(`switch (${d.c}) {`, s);
    this.indent++;
    const enumType = s.discriminant.ty?.tag === "class" && s.discriminant.ty.sym.isEnum ? s.discriminant.ty.sym : null;
    for (const c of s.cases) {
      for (const l of c.labels) {
        if (l === null) this.line("default:", c);
        else if (enumType && l.kind === "Identifier") this.line(`case ${this.classRef(enumType)}.${this.staticFieldName(l.name)}:`, l);
        else this.line(`case ${l.constant !== undefined ? literal(l.constant).c : this.expr(l).c}:`, l);
      }
      this.indent++;
      for (const st of c.body) this.stmt(st);
      this.indent--;
    }
    this.indent--;
    this.line("}");
  }

  private tryStmt(s: A.Try) {
    const hasCatch = s.catches.length > 0;
    this.line("try {", s);
    this.indent++;
    if (s.resources.length) {
      // try-with-resources: close in reverse order before the catch clauses run.
      const names: string[] = [];
      for (const r of s.resources) {
        if (r.kind === "LocalVar") {
          const d = r.declarators[0];
          const v = d.sym as LocalSymbol;
          this.line(`const ${this.localName(v)} = ${this.init(d.init!, v.type).c};`, r);
          names.push(this.localName(v));
        } else {
          const t = this.temp();
          this.line(`${t} = ${this.expr(r).c};`, r);
          names.push(t);
        }
      }
      this.line("try {");
      this.indent++;
      this.block(s.block);
      this.indent--;
      this.line("} finally {");
      this.indent++;
      for (const n of [...names].reverse()) this.line(`if (${n} !== null) ${n}.close();`);
      this.indent--;
      this.line("}");
    } else this.block(s.block);
    this.indent--;
    if (hasCatch) {
      this.line("} catch ($e) {");
      this.indent++;
      this.line(`$e = ${this.h("toJava")}($e);`);
      s.catches.forEach((c, i) => {
        const test = c.types.map((t) => {
          const ty = t.resolved;
          return ty?.tag === "class" ? `$e instanceof ${this.classRef(ty.sym)}` : "true";
        }).join(" || ");
        this.line(`${i === 0 ? "if" : "} else if"} (${test}) {`, c);
        this.indent++;
        this.line(`let ${this.localName(c.sym!)} = $e;`);
        this.block(c.body);
        this.indent--;
      });
      this.line("} else throw $e;");
      this.indent--;
    }
    if (s.finally) {
      this.line("} finally {");
      this.indent++;
      this.block(s.finally);
      this.indent--;
    }
    this.line("}");
  }

  private localClassDecl(d: A.ClassDecl | A.EnumDecl | A.InterfaceDecl) {
    const c = d.sym!;
    if (c.isInterface) {
      this.interfaceDecl(c, d as A.InterfaceDecl);
      return;
    }
    const name = this.className(c);
    this.line(`class ${name} extends ${this.superRef(c)} {`, d);
    this.classBody(c, name);
    this.line("}");
    this.classEpilogue(c, name);
    this.staticInit(c);
  }

  // --- expressions --------------------------------------------------------------------------------

  /** Expression evaluated for its side effects (statement position): simpler forms for ++ and assignments. */
  exprStmt(e: A.Expression): string {
    if (e.kind === "Update") return this.update(e, false).c;
    if (e.kind === "Assign") return this.assign(e, false).c;
    return this.expr(e).c;
  }

  /** Variable initializer converted to the variable's type. */
  init(e: A.Expression, type: Type): Emit {
    if (e.kind === "ArrayInit") return this.arrayInit(e, type);
    return this.coerce(e, type);
  }

  /** Expression converted (assignment/invocation conversion) to `to`. */
  coerce(e: A.Expression, to: Type): Emit {
    if (e.constant !== undefined && e.ty && (to.tag === "prim" || this.ts.isString(to)) && e.ty.tag === "prim" && to.tag === "prim") {
      const v = convert(e.constant, e.ty.name, to.name);
      if (v !== undefined) return literal(v);
    }
    if (e.constant !== undefined && e.ty && e.ty.tag === "prim" && to.tag !== "prim" && to.tag !== "error") {
      // Boxing a constant, narrowed to the box's type first (Java allows `Character c = 65`, `Byte b = 1`).
      const k = this.ts.unboxed(to)?.name ?? e.ty.name;
      return this.box(literal(convert(e.constant, e.ty.name, k) ?? e.constant), k);
    }
    if (e.kind === "Lambda" || e.kind === "MethodRef") return this.expr(e);
    return this.convertCode(this.expr(e), e.ty ?? T.error, to);
  }

  /** Conversion code from `from` to `to`: primitive widening/narrowing, boxing and unboxing. */
  convertCode(x: Emit, from: Type, to: Type): Emit {
    if (from.tag === "prim" && to.tag !== "prim" && to.tag !== "error") {
      // The box's type is the target's (Float), or the primitive's own for Object/Number/type variables.
      const k = this.ts.unboxed(to)?.name ?? from.name;
      return this.box(k === from.name ? x : this.primConvert(x, from.name, k, false), k);
    }
    if (to.tag === "prim" && from.tag !== "prim") x = this.unbox(x, from);
    const fp = from.tag === "prim" ? from : this.ts.unboxed(from);
    const tp = to.tag === "prim" ? to : this.ts.unboxed(to);
    if (!fp || !tp || fp.name === tp.name) return x;
    return this.primConvert(x, fp.name, tp.name, false);
  }

  /**
   * Box a primitive value of type `k`. Boxed chars/floats/doubles are JChar/JFloat/JDouble objects (so
   * they print, hash, compare and test instanceof like Character/Float/Double); the other boxes are the
   * JS values themselves.
   */
  box(x: Emit, k: PrimName): Emit {
    if (k === "char") return { c: `${this.h("boxC")}(${x.c})`, p: P.Call };
    if (k === "float") return { c: `${this.h("boxF")}(${x.c})`, p: P.Call };
    if (k === "double") return { c: `${this.h("boxD")}(${x.c})`, p: P.Call };
    return x;
  }

  /** Value of a boxed type as its primitive (null throws like Java for Character/Float/Double). */
  unbox(x: Emit, from: Type): Emit {
    const u = this.ts.unboxed(from)?.name;
    if (u === "char" || u === "float" || u === "double") return { c: `${par(x, P.Call)}.valueOf()`, p: P.Call };
    return x;
  }

  /** Primitive conversion; `cast` allows narrowing. */
  primConvert(x: Emit, from: PrimName, to: PrimName, cast: boolean): Emit {
    if (from === to || to === "double" || from === "boolean" || to === "boolean") return x;
    const call = (fn: string) => ({ c: `${fn}(${x.c})`, p: P.Call });
    switch (to) {
      case "float":
        return from === "byte" || from === "short" || from === "char" ? x : call("$f");
      case "long":
        return from === "float" || from === "double" ? call(this.h("d2l")) : x;
      case "int":
        if (from === "float" || from === "double") return call(this.h("d2i"));
        if (from === "long") return call(this.h("l2i"));
        return x;
      case "short":
        if (!cast) return x;
        return { c: `${par(this.primConvert(x, from, "int", true), P.Shift + 1)} << 16 >> 16`, p: P.Shift };
      case "byte":
        if (!cast) return x;
        return { c: `${par(this.primConvert(x, from, "int", true), P.Shift + 1)} << 24 >> 24`, p: P.Shift };
      case "char":
        if (!cast) return x;
        return { c: `${par(this.primConvert(x, from, "int", true), P.BitAnd + 1)} & 65535`, p: P.BitAnd };
    }
    return x;
  }

  expr(e: A.Expression): Emit {
    // Constant expressions of primitive/String type are emitted as literals.
    if (e.constant !== undefined && e.ty && (e.ty.tag === "prim" || this.ts.isString(e.ty)) && e.kind !== "Assign" && e.kind !== "Update") {
      return literal(e.constant);
    }
    switch (e.kind) {
      case "IntLiteral": case "FloatLiteral": case "CharLiteral": case "StringLiteral": case "BooleanLiteral":
        return literal(e.constant ?? (e as { value: ConstValue }).value);
      case "NullLiteral": return { c: "null", p: P.Primary };
      case "Identifier": return this.identifier(e);
      case "FieldAccess": return this.fieldAccess(e);
      case "This": return this.thisRef(e.qualifier ? (e.ty as ClassType).sym : this.cls);
      case "Super": return { c: "super", p: P.Primary };
      case "ArrayAccess": {
        const a = this.expr(e.array);
        const i = this.expr(e.index);
        if (!this.boundsChecks) return { c: `${par(a, P.Call)}[${i.c}]`, p: P.Call };
        const t = this.simple(e.array) ? par(a, P.Call) : null;
        if (t) return { c: `${t}[${this.h("ck")}(${t}, ${i.c})]`, p: P.Call };
        const tmp = this.temp();
        return { c: `(${tmp} = ${a.c})[${this.h("ck")}(${tmp}, ${i.c})]`, p: P.Call };
      }
      case "MethodCall": return this.methodCall(e);
      case "NewObject": return this.newObject(e);
      case "NewArray": return this.newArray(e);
      case "ArrayInit": return this.arrayInit(e, e.ty ?? T.error);
      case "Unary": return this.unary(e);
      case "Update": return this.update(e, true);
      case "Binary": return this.binary(e);
      case "InstanceOf": return this.instanceOf(e);
      case "Assign": return this.assign(e, true);
      case "Conditional": {
        const t = e.ty!;
        const test = this.expr(e.test);
        const a = this.coerce(e.consequent, t);
        const b = this.coerce(e.alternate, t);
        return { c: `${par(test, P.Or)} ? ${par(a, P.Assign)} : ${par(b, P.Assign)}`, p: P.Cond };
      }
      case "Cast": return this.cast(e);
      case "Lambda": return this.lambda(e);
      case "MethodRef": return this.methodRef(e);
      case "ClassLit": return { c: `${this.h("classLiteral")}(${JSON.stringify(typeToString(e.type.resolved ?? T.error))})`, p: P.Call };
      case "Conversion": return this.conversion(e);
      case "ErrorExpr": return { c: `${this.h("unreachable")}()`, p: P.Call };
    }
  }

  /** An expression that can be evaluated twice without side effects. */
  simple(e: A.Expression): boolean {
    return e.kind === "Identifier" || e.kind === "This" || (e.kind === "FieldAccess" && (e.target.kind === "This" || e.target.kind === "Identifier")) || e.constant !== undefined;
  }

  // Names ---------------------------------------------------------------------------------------------

  private identifier(e: A.Identifier): Emit {
    const s = e.sym;
    if (!s) return { c: escapeName(e.name), p: P.Primary };
    if (s.kind === "local") return { c: this.localName(s), p: P.Primary };
    if (s.kind === "class") return { c: this.typeRef(s), p: P.Primary };
    if (s.kind === "package") return { c: "undefined", p: P.Primary };
    return this.fieldRef(s, null, e.implicitThis ?? null);
  }

  /** Read of field `f` on `target` (null: implicit this / static). */
  fieldRef(f: FieldSymbol, target: Emit | null, implicit: ClassSymbol | null): Emit {
    const owner = f.owner;
    if (f.constant !== undefined && f.flags & Flags.Static) return literal(f.constant);
    if (!owner.isSource) {
      const lib = libraryField(this, f, target);
      if (lib) return lib;
      if (f.flags & Flags.Static) return { c: `${this.libClassRef(owner)}.${f.name}`, p: P.Call };
      const recv = target ?? (implicit?.isSketch ? { c: "$p", p: P.Primary } : this.thisRef(implicit ?? this.cls));
      return { c: `${par(recv, P.Call)}.${f.name}`, p: P.Call };
    }
    if (f.flags & Flags.Static) {
      if (owner.isSketch) return { c: this.sketchField(f), p: P.Primary };
      return { c: `${this.classRef(owner)}.${this.staticFieldName(f.name)}`, p: P.Call };
    }
    if (owner.isSketch && (!target || target.c === "$p")) return { c: this.sketchField(f), p: P.Primary };
    const recv = target ?? this.thisRef(implicit ?? this.cls);
    return { c: `${par(recv, P.Call)}.${escapeName(f.name)}`, p: P.Call };
  }

  /** `this` of class `c` as seen from the current class (outer instances of inner classes). */
  thisRef(c: ClassSymbol): Emit {
    if (c.isSketch) return { c: "$p", p: P.Primary };
    let cur: ClassSymbol | null = this.cls;
    let code = "this";
    while (cur && cur !== c && !this.ts.isSubtype(cur.thisType, c.thisType)) {
      if (cur.flags & (Flags.Local | Flags.Anonymous)) {
        const outer: ClassSymbol | null = cur.outer;
        if (!outer || outer.isSketch) return { c: "$p", p: P.Primary };
        code = `$this_${this.className(outer)}`;
        cur = outer;
      } else if (this.hasOuterField(cur)) {
        code += ".$outer";
        cur = cur.outer;
      } else break;
    }
    return { c: code, p: code.includes(".") ? P.Call : P.Primary };
  }

  private fieldAccess(e: A.FieldAccess): Emit {
    const s = e.sym;
    if (s && s.kind === "class") return { c: this.typeRef(s), p: P.Primary };
    if (s && s.kind === "package") return { c: "undefined", p: P.Primary };
    if (!s) {
      // array.length
      return { c: `${par(this.expr(e.target), P.Call)}.length`, p: P.Call };
    }
    if (s.kind !== "field") return { c: "undefined", p: P.Primary };
    if (s.flags & Flags.Static) {
      if (s.constant !== undefined) return literal(s.constant);
      if (!this.simple(e.target) || (e.target.kind !== "Identifier" && e.target.kind !== "FieldAccess")) {
        // Java evaluates the qualifier expression even for static fields; rare in sketches.
      }
      return this.fieldRef(s, null, null);
    }
    const target = e.target.kind === "Super" ? { c: "this", p: P.Primary } : this.expr(e.target);
    return this.fieldRef(s, target, null);
  }

  // Calls ---------------------------------------------------------------------------------------------

  /** Arguments of a call converted to the parameter types; packs varargs into an array. */
  args(args: A.Expression[], m: MethodSymbol, varargs: boolean): string {
    const params = m.params;
    const out: string[] = [];
    const fixed = varargs ? params.length - 1 : params.length;
    for (let i = 0; i < fixed && i < args.length; i++) out.push(this.coerce(args[i], params[i] ?? T.error).c);
    if (varargs) {
      const last = params[params.length - 1];
      const elem = last.tag === "array" ? last.elem : T.error;
      const rest = args.slice(fixed).map((a) => this.coerce(a, elem).c);
      out.push(`${this.h("arrayOf")}(${JSON.stringify(elemKind(elem))}, [${rest.join(", ")}])`);
    }
    return out.join(", ");
  }

  private methodCall(e: A.MethodCall): Emit {
    const m = e.method;
    if (!m) return { c: `${this.h("unreachable")}()`, p: P.Call };
    const isStatic = (m.flags & Flags.Static) !== 0;
    if (!m.owner.isSource) {
      if (TEXT_METHODS.has(m.name) && TEXT_OWNERS.has(m.owner.fullName)) this.usesText = true;
      // Library method: intrinsics first.
      let recv: Emit | null = null;
      if (e.target && !isStatic) recv = e.target.kind === "Super" ? { c: "super", p: P.Primary } : this.expr(e.target);
      else if (!e.target && !isStatic) recv = e.implicitThis && !e.implicitThis.isSketch ? this.thisRef(e.implicitThis) : { c: "$p", p: P.Primary };
      const lib = libraryCall(this, m, recv, e.args, e.varargsCall ?? false, e);
      if (lib) return this.awaitIfNeeded(m, lib);
      const args = this.args(e.args, m, e.varargsCall ?? false);
      if (isStatic) {
        // PApplet's static helpers are instance methods of the current runtime.
        const owner = m.owner.fullName === PAPPLET ? "$p" : this.libClassRef(m.owner);
        return this.floatResult(m, { c: `${owner}.${m.name}(${args})`, p: P.Call });
      }
      return this.awaitIfNeeded(m, this.floatResult(m, { c: `${par(recv!, P.Call)}.${m.name}(${args})`, p: P.Call }));
    }
    const name = this.methodName(m);
    const args = this.args(e.args, m, e.varargsCall ?? false);
    if (isStatic) {
      if (m.owner.isSketch) return { c: `${name}(${args})`, p: P.Call };
      return { c: `${this.classRef(m.owner)}.${name}(${args})`, p: P.Call };
    }
    if (!e.target) {
      const implicit = e.implicitThis ?? this.cls;
      if (implicit.isSketch && m.owner.isSketch) return { c: `${name}(${args})`, p: P.Call };
      return { c: `${par(this.thisRef(implicit), P.Call)}.${name}(${args})`, p: P.Call };
    }
    if (e.target.kind === "Super") return { c: `super.${name}(${args})`, p: P.Call };
    const recv = this.expr(e.target);
    if (recv.c === "$p" && m.owner.isSketch) return { c: `${name}(${args})`, p: P.Call };
    return { c: `${par(recv, P.Call)}.${name}(${args})`, p: P.Call };
  }

  /** Library methods returning float may return doubles from the JS runtime: round. */
  floatResult(m: MethodSymbol, x: Emit): Emit {
    return m.ret.tag === "prim" && m.ret.name === "float" ? { c: `$f(${x.c})`, p: P.Call } : x;
  }

  private awaitIfNeeded(m: MethodSymbol, x: Emit): Emit {
    if (m.owner.fullName === PAPPLET && (m.name === "size" || m.name === "fullScreen") && this.fn.async) return { c: `await ${par(x, P.Unary)}`, p: P.Unary };
    return x;
  }

  private newObject(e: A.NewObject): Emit {
    const t = e.ty;
    if (!t || t.tag !== "class") return { c: `${this.h("unreachable")}()`, p: P.Call };
    const c = t.sym;
    if (e.anonymous) {
      const cls = this.anonymousClassExpr(e.anonymous, e.ctor);
      const args = e.ctor ? this.args(e.args, e.ctor, e.varargsCall ?? false) : "";
      return { c: `new (${cls})().$init(${args})`, p: P.Call };
    }
    if (!c.isSource) {
      const lib = libraryCall(this, e.ctor ?? { kind: "method", name: "<init>", typeParams: [], params: [], ret: T.void, flags: 0, owner: c }, null, e.args, e.varargsCall ?? false, e);
      if (lib) return lib;
      const args = e.ctor ? this.args(e.args, e.ctor, e.varargsCall ?? false) : e.args.map((a) => this.expr(a).c).join(", ");
      return { c: `new ${this.libClassRef(c)}(${args})`, p: P.Call };
    }
    const outer = this.hasOuterField(c) ? (e.outer ? this.expr(e.outer).c : this.thisRef(c.outer!).c) : "";
    const ctor = e.ctor;
    const args = ctor ? this.args(e.args, ctor, e.varargsCall ?? false) : "";
    return { c: `new ${this.className(c)}(${outer}).${ctor ? this.methodName(ctor) : "$init"}(${args})`, p: P.Call };
  }

  private newArray(e: A.NewArray): Emit {
    const t = e.ty;
    if (!t || t.tag !== "array") return { c: "null", p: P.Primary };
    if (e.initializer) return this.arrayInit(e.initializer, t);
    let leaf: Type = t;
    let rank = 0;
    while (leaf.tag === "array") {
      leaf = leaf.elem;
      rank++;
    }
    const dims = e.dimensions.filter((d): d is A.Expression => d !== null).map((d) => this.coerce(d, T.int).c);
    return { c: `${this.h("newArray")}(${JSON.stringify(elemKind(leaf))}, ${rank}, ${dims.join(", ")})`, p: P.Call };
  }

  private arrayInit(e: A.ArrayInit, type: Type): Emit {
    if (type.tag !== "array") return { c: "null", p: P.Primary };
    const elem = type.elem;
    const items = e.elements.map((x) => (x.kind === "ArrayInit" ? this.arrayInit(x, elem).c : this.coerce(x, elem).c));
    return { c: `${this.h("arrayOf")}(${JSON.stringify(elemKind(elem))}, [${items.join(", ")}])`, p: P.Call };
  }

  // Operators -----------------------------------------------------------------------------------------

  private prim(t: Type | undefined): PrimName | null {
    if (!t) return null;
    if (t.tag === "prim") return t.name;
    return this.ts.unboxed(t)?.name ?? null;
  }

  private unary(e: A.Unary): Emit {
    const ot = e.operand.ty;
    const x = ot && ot.tag !== "prim" ? this.unbox(this.expr(e.operand), ot) : this.expr(e.operand);
    const t = this.prim(e.ty);
    switch (e.op) {
      case "!": return { c: `!${par(x, P.Unary)}`, p: P.Unary };
      case "+": return x;
      case "~": return t === "long" ? { c: `${this.h("lnot")}(${x.c})`, p: P.Call } : { c: `~${par(x, P.Unary)}`, p: P.Unary };
      case "-":
        if (t === "int") return { c: `-${par(x, P.Unary)} | 0`, p: P.BitOr };
        return { c: `-${par(x, P.Unary)}`, p: P.Unary };
    }
  }

  /** Arithmetic on primitives of type `t` with Java semantics. */
  arith(op: string, a: Emit, b: Emit, t: PrimName, divisorConst?: ConstValue): Emit {
    const bin = (o: string, l: Emit, r: Emit): Emit => {
      const p = BINARY_PREC[o];
      return { c: `${par(l, p)} ${o} ${par(r, p + 1)}`, p };
    };
    if (t === "int") {
      switch (op) {
        case "+": case "-": return { c: `${par(bin(op, a, b), P.BitOr + 1)} | 0`, p: P.BitOr };
        case "*": return { c: `$imul(${a.c}, ${b.c})`, p: P.Call };
        case "/":
          if (typeof divisorConst === "number" && divisorConst !== 0) return { c: `${par(bin("/", a, b), P.BitOr + 1)} | 0`, p: P.BitOr };
          return { c: `${this.h("idiv")}(${a.c}, ${b.c})`, p: P.Call };
        case "%":
          if (typeof divisorConst === "number" && divisorConst !== 0) return { c: `${par(bin("%", a, b), P.BitOr + 1)} | 0`, p: P.BitOr };
          return { c: `${this.h("irem")}(${a.c}, ${b.c})`, p: P.Call };
        case ">>>": return { c: `${par(bin(">>>", a, b), P.BitOr + 1)} | 0`, p: P.BitOr };
        default: return bin(op, a, b);
      }
    }
    if (t === "long") {
      switch (op) {
        case "*": return { c: `${this.h("lmul")}(${a.c}, ${b.c})`, p: P.Call };
        case "/": return { c: `${this.h("ldiv")}(${a.c}, ${b.c})`, p: P.Call };
        case "%": return { c: `${this.h("lrem")}(${a.c}, ${b.c})`, p: P.Call };
        case "<<": return { c: `${this.h("lshl")}(${a.c}, ${b.c})`, p: P.Call };
        case ">>": return { c: `${this.h("lshr")}(${a.c}, ${b.c})`, p: P.Call };
        case ">>>": return { c: `${this.h("lushr")}(${a.c}, ${b.c})`, p: P.Call };
        case "&": return { c: `${this.h("land")}(${a.c}, ${b.c})`, p: P.Call };
        case "|": return { c: `${this.h("lor")}(${a.c}, ${b.c})`, p: P.Call };
        case "^": return { c: `${this.h("lxor")}(${a.c}, ${b.c})`, p: P.Call };
        default: return bin(op, a, b);
      }
    }
    if (t === "float") return { c: `$f(${bin(op, a, b).c})`, p: P.Call };
    return bin(op, a, b);
  }

  private binary(e: A.Binary): Emit {
    const op = e.op;
    const t = e.ty!;
    if (op === "+" && this.ts.isString(t)) return this.concat(e);
    const lt = e.left.ty!;
    const rt = e.right.ty!;
    if (op === "&&" || op === "||") {
      const p = BINARY_PREC[op];
      return { c: `${par(this.expr(e.left), p)} ${op} ${par(this.expr(e.right), p + 1)}`, p };
    }
    if (op === "==" || op === "!=") {
      const lp = this.prim(lt);
      const rp = this.prim(rt);
      const jsOp = op === "==" ? "===" : "!==";
      if ((lt.tag === "prim" || rt.tag === "prim") && lp && rp && isNumeric(lt.tag === "prim" ? lt : rt)) {
        const w = this.ts.binaryPromote(this.ts.primOf(lt)!, this.ts.primOf(rt)!).name;
        const a = this.operand(e.left, lp, w);
        const b = this.operand(e.right, rp, w);
        return { c: `${par(a, P.Eq)} ${jsOp} ${par(b, P.Eq + 1)}`, p: P.Eq };
      }
      return { c: `${par(this.expr(e.left), P.Eq)} ${jsOp} ${par(this.expr(e.right), P.Eq + 1)}`, p: P.Eq };
    }
    const lp = this.prim(lt);
    const rp = this.prim(rt);
    if (!lp || !rp) return { c: `${this.h("unreachable")}()`, p: P.Call };
    if (lp === "boolean") {
      // Non-short-circuit boolean operators.
      const a = this.expr(e.left);
      const b = this.expr(e.right);
      if (op === "^") return { c: `${par(a, P.Eq)} !== ${par(b, P.Eq + 1)}`, p: P.Eq };
      return { c: `!!(${par(a, BINARY_PREC[op])} ${op} ${par(b, BINARY_PREC[op] + 1)})`, p: P.Unary };
    }
    if (op === "<<" || op === ">>" || op === ">>>") {
      const r = this.ts.unaryPromote(this.ts.primOf(lt)!).name;
      const a = this.operand(e.left, lp, r);
      const b = this.primConvert(this.operand(e.right, rp, rp), rp, rp === "long" ? "long" : "int", false);
      return this.arith(op, a, rp === "long" ? { c: `${this.h("l2i")}(${b.c})`, p: P.Call } : b, r);
    }
    const w = this.ts.binaryPromote(this.ts.primOf(lt)!, this.ts.primOf(rt)!).name;
    const a = this.operand(e.left, lp, w);
    const b = this.operand(e.right, rp, w);
    if (op === "<" || op === ">" || op === "<=" || op === ">=") {
      const p = BINARY_PREC[op];
      return { c: `${par(a, p)} ${op} ${par(b, p + 1)}`, p };
    }
    return this.arith(op, a, b, w, e.right.constant !== undefined ? convert(e.right.constant, rp, w) : undefined);
  }

  /** A primitive operand converted to the operation type; constants are converted at compile time. */
  private operand(e: A.Expression, from: PrimName, to: PrimName): Emit {
    if (e.constant !== undefined && e.ty?.tag === "prim") {
      const v = convert(e.constant, e.ty.name, to);
      if (v !== undefined) return literal(v);
    }
    const x = e.ty && e.ty.tag !== "prim" ? this.unbox(this.expr(e), e.ty) : this.expr(e);
    return this.primConvert(x, from, to, false);
  }

  /** String conversion of a value of static type `t` (Java String.valueOf / string concatenation). */
  str(x: Emit, t: Type): Emit {
    const p = this.prim(t) && t.tag === "prim" ? t.name : null;
    if (p === "float") return { c: `${this.h("floatToString")}(${x.c})`, p: P.Call };
    if (p === "double") return { c: `${this.h("doubleToString")}(${x.c})`, p: P.Call };
    if (p === "char") return { c: `${this.h("charToString")}(${x.c})`, p: P.Call };
    if (p === "long") return { c: `${this.h("longToString")}(${x.c})`, p: P.Call };
    if (p) return x; // int/short/byte/boolean: JS string conversion matches Java
    if (this.ts.isString(t)) return x;
    // Integer/Short/Byte/Boolean: JS's conversion matches Java, null included; the other boxes print
    // through String.valueOf (Long digits, JFloat/JDouble toString, a Character string).
    const u = this.ts.unboxed(t)?.name;
    if (u === "int" || u === "short" || u === "byte" || u === "boolean") return x;
    return { c: `$S.valueOf(${x.c})`, p: P.Call };
  }

  private concat(e: A.Binary): Emit {
    // Flatten left-nested string concatenations: "a" + b + c.
    const parts: A.Expression[] = [];
    let cur: A.Expression = e;
    while (cur.kind === "Binary" && cur.op === "+" && cur.ty && this.ts.isString(cur.ty) && cur.constant === undefined) {
      parts.unshift(cur.right);
      cur = cur.left;
    }
    parts.unshift(cur);
    const codes = parts.map((p) => {
      if (p.constant !== undefined && p.ty && (p.ty.tag === "prim" || this.ts.isString(p.ty))) {
        const s = p.ty.tag === "prim" ? constString(p.constant, p.ty.name) : String(p.constant);
        if (s !== undefined) return JSON.stringify(s);
      }
      const x = this.str(this.expr(p), p.ty ?? T.error);
      return par(x, P.Add + 1);
    });
    // Start with a string so JS never adds two numbers and a null String becomes "null".
    if (!codes[0].startsWith('"')) codes.unshift('""');
    return { c: codes.join(" + "), p: P.Add };
  }

  private instanceOf(e: A.InstanceOf): Emit {
    const x = this.expr(e.expr);
    const t = e.type.resolved;
    if (!t || t.tag !== "class") {
      if (t?.tag === "array") return { c: `${this.h("isArray")}(${x.c})`, p: P.Call };
      return { c: "false", p: P.Primary };
    }
    const c = t.sym;
    if (this.ts.isString(t)) return { c: `typeof ${par(x, P.Unary)} === "string"`, p: P.Eq };
    const u = this.ts.unboxed(t)?.name;
    if (u === "float" || u === "double" || u === "char") return { c: `${par(x, P.Rel)} instanceof ${this.h(u === "float" ? "JFloat" : u === "double" ? "JDouble" : "JChar")}`, p: P.Rel };
    if (u) return { c: `typeof ${par(x, P.Unary)} === ${u === "boolean" ? '"boolean"' : '"number"'}`, p: P.Eq };
    if (c.fullName === "java.lang.Number") return { c: `${this.h("isNumber")}(${x.c})`, p: P.Call };
    if (c.isInterface || !c.isSource) return { c: `${this.h("isInstance")}(${x.c}, ${this.typeRef(c)})`, p: P.Call };
    return { c: `${par(x, P.Rel)} instanceof ${this.typeRef(c)}`, p: P.Rel };
  }

  private cast(e: A.Cast): Emit {
    const to = e.type.resolved ?? T.error;
    const from = e.expr.ty ?? T.error;
    const x = this.expr(e.expr);
    const fp = this.prim(from);
    if (to.tag === "prim") {
      if (!fp) return x;
      return this.primConvert(x, fp, to.name, true);
    }
    if (from.tag === "prim") return this.convertCode(x, from, to); // boxing
    if (to.tag === "class" && !this.ts.isSubtype(from, to) && from.tag !== "null") {
      // Checked downcast: JS values of String/box types are primitives, user types are classes/Ifaces.
      const name = JSON.stringify(to.sym.displayName);
      if (this.ts.isString(to)) return { c: `${this.h("castPrim")}(${x.c}, "string", ${name})`, p: P.Call };
      const u = this.ts.unboxed(to);
      if (u) {
        const kind = u.name === "boolean" || u.name === "char" || u.name === "float" || u.name === "double" ? u.name : "number";
        return { c: `${this.h("castPrim")}(${x.c}, "${kind}", ${name})`, p: P.Call };
      }
      if (to.sym.isSource) return { c: `${this.h("cast")}(${x.c}, ${this.typeRef(to.sym)}, ${name})`, p: P.Call };
    }
    return x;
  }

  /**
   * Read-modify-write of a variable (`target op= value`, `++x`, `x--`). Complex targets evaluate their
   * object/index once into temporaries. JS evaluates an assignment target before its value, so
   * `writeFirst` sets the temporaries in the target and `read` (in the value) reuses them; `first`
   * is a read that sets them, for when the old value is needed first (postfix with a used value).
   */
  private lvalue(target: A.Expression): { first: Emit; read: Emit; writeFirst: (v: string) => string; write: (v: string) => string } {
    const plain = (r: Emit) => ({ first: r, read: r, writeFirst: (v: string) => `${r.c} = ${v}`, write: (v: string) => `${r.c} = ${v}` });
    if (target.kind === "FieldAccess") {
      const f = target.sym;
      if (f && f.kind === "field" && f.flags & Flags.Static) return plain(this.fieldRef(f, null, null));
      if (this.simple(target.target)) return plain(this.expr(target));
      const t = this.temp();
      const obj = this.expr(target.target);
      const name = f && f.kind === "field" ? (f.owner.isSource ? escapeName(f.name) : f.name) : "length";
      return {
        first: { c: `(${t} = ${obj.c}).${name}`, p: P.Call },
        read: { c: `${t}.${name}`, p: P.Call },
        writeFirst: (v) => `(${t} = ${obj.c}).${name} = ${v}`,
        write: (v) => `${t}.${name} = ${v}`,
      };
    }
    if (target.kind === "ArrayAccess") {
      const a = this.expr(target.array);
      const i = this.expr(target.index);
      if (this.simple(target.array) && (target.index.kind === "Identifier" || target.index.constant !== undefined)) {
        const ac = par(a, P.Call);
        const checked = this.boundsChecks ? `${this.h("ck")}(${ac}, ${i.c})` : i.c;
        const r = { c: `${ac}[${i.c}]`, p: P.Call };
        return { first: { c: `${ac}[${checked}]`, p: P.Call }, read: r, writeFirst: (v) => `${ac}[${checked}] = ${v}`, write: (v) => `${r.c} = ${v}` };
      }
      const ta = this.temp();
      const ti = this.temp();
      const idx = this.boundsChecks ? `${this.h("ck")}(${ta}, ${i.c})` : i.c;
      return {
        first: { c: `(${ta} = ${a.c})[${ti} = ${idx}]`, p: P.Call },
        read: { c: `${ta}[${ti}]`, p: P.Call },
        writeFirst: (v) => `(${ta} = ${a.c})[${ti} = ${idx}] = ${v}`,
        write: (v) => `${ta}[${ti}] = ${v}`,
      };
    }
    return plain(this.expr(target));
  }

  private assign(e: A.Assign, valueUsed: boolean): Emit {
    const tt = e.target.ty ?? T.error;
    if (e.op === "=") {
      const v = this.coerce(e.value, tt);
      if (e.target.kind === "ArrayAccess" && this.boundsChecks) {
        const a = this.expr(e.target.array);
        const i = this.expr(e.target.index);
        if (this.simple(e.target.array)) return { c: `${par(a, P.Call)}[${this.h("ck")}(${a.c}, ${i.c})] = ${par(v, P.Assign)}`, p: P.Assign };
        const t = this.temp();
        return { c: `(${t} = ${a.c})[${this.h("ck")}(${t}, ${i.c})] = ${par(v, P.Assign)}`, p: P.Assign };
      }
      const target = e.target.kind === "ArrayAccess" ? { c: `${par(this.expr(e.target.array), P.Call)}[${this.expr(e.target.index).c}]`, p: P.Call } : this.expr(e.target);
      return { c: `${target.c} = ${par(v, P.Assign)}`, p: P.Assign };
    }
    // Compound assignment: target = (T)(target op value).
    const op = e.op.slice(0, -1);
    const lv = this.lvalue(e.target);
    if (this.ts.isString(tt)) {
      const v = this.str(this.expr(e.value), e.value.ty ?? T.error);
      return { c: lv.writeFirst(`${par(lv.read, P.Add)} + ${par(v, P.Add + 1)}`), p: P.Assign };
    }
    const tp = this.prim(tt)!;
    const vp = this.prim(e.value.ty) ?? tp;
    // A boxed target (Float f; f += 1) is unboxed, operated on and boxed again.
    const boxed = tt.tag !== "prim";
    const read = boxed ? this.unbox(lv.read, tt) : lv.read;
    let result: Emit;
    if (tp === "boolean") {
      const v = this.operand(e.value, vp, vp);
      result = op === "^" ? { c: `${par(read, P.Eq)} !== ${par(v, P.Eq + 1)}`, p: P.Eq } : { c: `!!(${par(read, BINARY_PREC[op])} ${op} ${par(v, BINARY_PREC[op] + 1)})`, p: P.Unary };
    } else if (op === "<<" || op === ">>" || op === ">>>") {
      const r = this.ts.unaryPromote(T[tp]).name;
      const v = this.primConvert(this.operand(e.value, vp, vp), vp, vp === "long" ? "long" : "int", false);
      result = this.primConvert(this.arith(op, this.primConvert(read, tp, r, false), vp === "long" ? { c: `${this.h("l2i")}(${v.c})`, p: P.Call } : v, r), r, tp, true);
    } else {
      const w = this.ts.binaryPromote(T[tp], T[vp]).name;
      const v = this.operand(e.value, vp, w);
      const r = this.arith(op, this.primConvert(read, tp, w, false), v, w, e.value.constant !== undefined ? convert(e.value.constant, vp, w) : undefined);
      result = this.primConvert(r, w, tp, true);
    }
    void valueUsed;
    return { c: lv.writeFirst(par(boxed ? this.box(result, tp) : result, P.Assign)), p: P.Assign };
  }

  private update(e: A.Update, valueUsed: boolean): Emit {
    const t = this.prim(e.ty) ?? "int";
    const lv = this.lvalue(e.operand);
    const one: Emit = { c: "1", p: P.Primary };
    const ot = e.operand.ty;
    const boxed = !!ot && ot.tag !== "prim";
    const step = (x: Emit) => {
      if (boxed) x = this.unbox(x, ot);
      let r: Emit;
      if (t === "double" || t === "long") r = { c: `${par(x, P.Add)} ${e.op[0]} 1`, p: P.Add };
      else {
        const w = this.ts.binaryPromote(T[t], T.int).name;
        r = this.primConvert(this.arith(e.op[0], x, one, w), w, t, true);
      }
      return boxed ? this.box(r, t) : r;
    };
    if (!valueUsed || e.prefix) {
      return { c: lv.writeFirst(par(step(lv.read), P.Assign)), p: P.Assign };
    }
    // Postfix with the value used: (tmp = x, x = tmp + 1, tmp)
    const tmp = this.temp();
    return { c: `(${tmp} = ${lv.first.c}, ${lv.write(par(step({ c: tmp, p: P.Primary }), P.Assign))}, ${tmp})`, p: P.Primary };
  }

  // Lambdas -------------------------------------------------------------------------------------------

  /** Iface object for a functional interface type. */
  private ifaceOf(t: Type): string {
    if (t.tag === "class") return this.typeRef(t.sym);
    return `${this.h("libraryIface")}("?")`;
  }

  private lambda(e: A.Lambda): Emit {
    const sam = e.sam;
    const fnType = e.ty ?? T.error;
    if (!sam) return { c: "null", p: P.Primary };
    const params = e.params.map((p) => this.localName(p.sym!)).join(", ");
    const ret = this.samReturn(fnType, sam);
    let body: string;
    if (e.body.kind === "Block") {
      const saved = { indent: this.indent, fn: this.fn };
      this.fn = { temps: 0, async: false };
      this.retStack.push(ret);
      const start = this.lines.length;
      this.indent = 1;
      for (const s of e.body.body) this.stmt(s);
      this.declareTemps();
      this.retStack.pop();
      const inner = this.lines.splice(start);
      this.indent = saved.indent;
      this.fn = saved.fn;
      body = `{\n${inner.map((l) => "  ".repeat(this.indent) + l).join("\n")}\n${"  ".repeat(this.indent)}}`;
    } else {
      const saved = this.fn;
      this.fn = { temps: 0, async: false };
      const x = ret && ret.tag !== "void" ? this.coerce(e.body, ret) : { c: this.exprStmt(e.body), p: P.Assign };
      const temps = this.fn.temps;
      this.fn = saved;
      body = temps ? `{ var ${Array.from({ length: temps }, (_, i) => "$t" + (i + 1)).join(", ")}; return ${x.c}; }` : x.c.startsWith("{") ? `(${x.c})` : par(x, P.Assign);
      if (ret && ret.tag === "void" && !temps) body = `{ ${x.c}; }`;
    }
    return { c: `${this.h("lambda")}(${this.ifaceOf(fnType)}, ${JSON.stringify(this.methodName(sam))}, (${params}) => ${body})`, p: P.Call };
  }

  /** Return type of the function type of `t` (the SAM's return viewed through t's type arguments). */
  private samReturn(t: Type, sam: MethodSymbol): Type {
    if (t.tag !== "class") return sam.ret;
    // The SAM may be inherited (BinaryOperator<T> → BiFunction<T,T,T>.apply): view t as its owner.
    const sup = asSuper(t, sam.owner);
    if (!sup || !sup.args.length) return erasure(sam.ret);
    return substitute(sam.ret, substOf({ ...sup, args: sup.args.map(upperBound) }));
  }

  /**
   * Method reference: a lambda whose body is a synthesized call (so library calls go through the same
   * intrinsics). A bound receiver expression is evaluated once, when the reference is created.
   */
  private methodRef(e: A.MethodRef): Emit {
    const m = e.method;
    const fnType = e.ty ?? T.error;
    if (!m || fnType.tag !== "class") return { c: "null", p: P.Primary };
    const sam = this.samOf(fnType);
    if (!sam) return { c: "null", p: P.Primary };
    const sup = asSuper(fnType, sam.owner);
    const subst = sup ? substOf(sup) : null;
    const samParams = sam.params.map((t) => upperBound(substitute(t, subst)));
    const samRet = upperBound(substitute(sam.ret, subst));
    const at = { start: e.start, end: e.end };
    const local = (name: string, ty: Type): A.Identifier => ({
      kind: "Identifier", name, ty, ...at,
      sym: { kind: "local", name, type: ty, final: true, role: "lambda", decl: e, classDepth: 0 },
    });
    const params = samParams.map((t, i) => local("$gen" + i, t));
    const tgt = e.target;
    const isType = tgt.kind === "ClassType" || tgt.kind === "PrimitiveType" || tgt.kind === "ArrayType" || (tgt.kind === "Identifier" && tgt.sym?.kind === "class");
    let body: Emit;
    let bound: { name: string; value: Emit } | null = null;
    if (m.name === "<init>") {
      const ctorType: ClassType = { tag: "class", sym: m.owner, args: [] };
      const fake: A.NewObject = {
        kind: "NewObject", outer: null, typeArgs: null, args: params, body: null, ctor: m, ty: ctorType, ...at,
        type: { kind: "ClassType", qualifier: null, name: { text: m.owner.name, ...at }, typeArgs: null, resolved: ctorType, ...at },
      };
      body = this.newObject(fake);
    } else {
      let target: A.Expression | null = null;
      let args: A.Expression[] = params;
      if (m.flags & Flags.Static) target = null;
      else if (isType) {
        target = params[0];
        args = params.slice(1);
      } else if (tgt.kind === "Super" || tgt.kind === "This" || (tgt.kind === "Identifier" && tgt.sym?.kind === "local")) target = tgt as A.Expression;
      else {
        bound = { name: "$genr", value: this.expr(tgt as A.Expression) };
        target = local("$genr", (tgt as A.Expression).ty ?? T.error);
      }
      const call: A.MethodCall = {
        kind: "MethodCall", target, typeArgs: null, name: { text: m.name, ...at }, args, method: m, ty: m.ret, ...at,
        ...(m.flags & Flags.Varargs && args.length !== m.params.length ? { varargsCall: true } : {}),
        ...(target === null && !(m.flags & Flags.Static) ? { implicitThis: this.cls } : {}),
      };
      body = this.methodCall(call);
      if (samRet.tag !== "void") body = this.convertCode(body, m.ret, samRet);
    }
    const fn = `${this.h("lambda")}(${this.ifaceOf(fnType)}, ${JSON.stringify(this.methodName(sam))}, (${params.map((p) => p.name).join(", ")}) => ${body.c.startsWith("{") ? `(${body.c})` : body.c})`;
    return bound ? { c: `((${bound.name}) => ${fn})(${bound.value.c})`, p: P.Call } : { c: fn, p: P.Call };
  }

  private samOf(t: ClassType): MethodSymbol | null {
    const seen = new Set<ClassSymbol>();
    const visit = (c: ClassSymbol): MethodSymbol | null => {
      if (seen.has(c)) return null;
      seen.add(c);
      for (const ms of c.load().methods.values()) for (const m of ms) if (m.flags & Flags.Abstract && !["equals", "hashCode", "toString"].includes(m.name)) return m;
      for (const i of c.interfaces) {
        const r = visit(i.sym);
        if (r) return r;
      }
      return null;
    };
    return visit(t.sym);
  }

  private conversion(e: A.Conversion): Emit {
    // int(x) etc. are PApplet.parseInt(...) calls resolved by the checker on the node's type.
    const arg = e.args[0];
    const at = arg?.ty ?? T.error;
    const x = arg ? this.expr(arg) : { c: "0", p: P.Primary };
    const ap = this.prim(at);
    switch (e.type) {
      case "int":
        if (at.tag === "array") return { c: `${this.h("parseIntArray")}(${x.c})`, p: P.Call };
        if (ap === "float" || ap === "double") return { c: `${this.h("d2i")}(${x.c})`, p: P.Call };
        if (ap === "boolean") return { c: `${par(x, P.Cond + 1)} ? 1 : 0`, p: P.Cond };
        if (ap) return x;
        return { c: `${this.h("parseIntOr")}(${x.c}, 0)`, p: P.Call };
      case "float":
        if (at.tag === "array") return { c: `${this.h("parseFloatArray")}(${x.c})`, p: P.Call };
        if (ap) return this.primConvert(x, ap, "float", true);
        return { c: `${this.h("parseFloatOr")}(${x.c}, NaN)`, p: P.Call };
      case "boolean":
        if (ap) return { c: `${par(x, P.Eq)} !== 0`, p: P.Eq };
        return { c: `${this.h("parseBooleanStr")}(${x.c})`, p: P.Call };
      case "byte": return ap ? this.primConvert(x, ap, "byte", true) : x;
      case "char": return ap ? this.primConvert(x, ap, "char", true) : x;
      default: return x;
    }
  }
}

const LANG_EXCEPTIONS = new Set([
  "java.lang.Throwable", "java.lang.Exception", "java.lang.RuntimeException", "java.lang.ArithmeticException",
  "java.lang.IndexOutOfBoundsException", "java.lang.ArrayIndexOutOfBoundsException", "java.lang.StringIndexOutOfBoundsException",
  "java.lang.NullPointerException", "java.lang.ClassCastException", "java.lang.IllegalArgumentException", "java.lang.NumberFormatException",
  "java.lang.IllegalStateException", "java.lang.UnsupportedOperationException", "java.lang.NegativeArraySizeException",
  "java.lang.ArrayStoreException", "java.util.ConcurrentModificationException", "java.util.NoSuchElementException",
  "java.lang.CloneNotSupportedException", "java.lang.InterruptedException", "java.io.IOException", "java.io.FileNotFoundException",
  "java.io.EOFException", "java.io.UncheckedIOException", "java.lang.StackOverflowError", "java.lang.OutOfMemoryError", "java.lang.AssertionError",
]);

/** String form of a constant for folding into a concatenation (null: not foldable). */
function constString(v: ConstValue, t: PrimName): string | undefined {
  switch (t) {
    case "char": return String.fromCharCode(v as number);
    case "float": case "double": return undefined;
    default: return String(v);
  }
}

/** Does a sketch method body call size()/fullScreen() (async in the current runtime)? */
function callsAsyncApi(b: A.Block): boolean {
  let found = false;
  walk(b, (n) => {
    if (n.kind === "MethodCall" && n.method && n.method.owner.fullName === PAPPLET && (n.method.name === "size" || n.method.name === "fullScreen")) found = true;
    return !found && n.kind !== "Lambda" && n.kind !== "ClassDecl";
  });
  return found;
}
