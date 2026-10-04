// Type checker: symbol tables, name resolution, expression typing, overload resolution and statement
// checks for the sketch class built by sketch.ts. Results are recorded on the AST (see ast.ts: `ty`,
// `constant`, `sym`, `method`, ...). Diagnostics follow the wording of the Java compiler Processing uses
// (ECJ, with Processing's rewrites such as "The function f(int) does not exist.").
//
// Phases: declare all member classes → resolve class headers → enter members (signatures) → check
// bodies. Local and anonymous classes go through all phases when their declaration is reached.
//
// Not implemented yet (accepted silently): definite assignment, checked exceptions, generic method
// inference beyond simple unification, capture conversion.
import type * as A from "./ast.ts";
import { Modifier } from "./ast.ts";
import { constToString, convert, foldBinary, foldUnary } from "./constants.ts";
import { error, type Diagnostic } from "./diagnostics.ts";
import { checkDefiniteAssignment } from "./definite.ts";
import { checkFlow } from "./flow.ts";
import { Library } from "./library.ts";
import { buildSketch, type Sketch } from "./sketch.ts";
import { TypeSystem } from "./typesystem.ts";
import {
  ClassSymbol, Flags, T, asSuper, classType, directSupertypes, erasure, isNumeric, isRaw, isReference, primType,
  sameType, substOf, substitute, typeToString, upperBound,
  type ClassType, type ConstValue, type FieldSymbol, type LocalSymbol, type MethodSymbol, type PrimName, type PrimType,
  type Subst, type Type, type TypeVarSymbol,
} from "./types.ts";

// Processing's default imports (from `Processing cli --build` output), besides java.lang.*.
const DEFAULT_ON_DEMAND = ["java.lang", "processing.core", "processing.data", "processing.event", "processing.opengl"];
const DEFAULT_SINGLE = ["java.util.HashMap", "java.util.ArrayList", "java.io.File", "java.io.BufferedReader", "java.io.PrintWriter", "java.io.InputStream", "java.io.OutputStream", "java.io.IOException"];

const CONVERSIONS: Partial<Record<A.PrimitiveName, string>> = { int: "parseInt", float: "parseFloat", boolean: "parseBoolean", byte: "parseByte", char: "parseChar" };

let defaultLibrary: Library | null = null;
export function getLibrary(): Library {
  return (defaultLibrary ??= new Library());
}

export interface CheckResult {
  sketch: Sketch;
  sketchClass: ClassSymbol;
  diagnostics: Diagnostic[];
  /** Type relations used by the checker (code generation reuses them). */
  types: TypeSystem;
}

/** Check the sketch made from the tabs' ASTs. The ASTs are annotated in place. */
export function checkSketch(files: A.SketchFile[], options: { library?: Library } = {}): CheckResult {
  const diagnostics: Diagnostic[] = [];
  const sketch = buildSketch(files, diagnostics);
  const checker = new Checker(options.library ?? getLibrary(), diagnostics);
  const sketchClass = checker.run(sketch);
  return { sketch, sketchClass, diagnostics, types: checker.ts };
}

// ---------------------------------------------------------------------------------------------------
// Scopes

interface Ctx {
  cls: ClassSymbol;
  method: MethodSymbol | null;
  /** Declared return type, or null in initializers. For lambdas: the function type's return type. */
  returnType: Type | null;
  isStatic: boolean;
  isConstructor: boolean;
  lambda: boolean;
  /** Nesting of break/continue targets: "loop", "switch" or a label name. */
  targets: string[];
  /** Checked exceptions the body may throw (the method's `throws`, or the lambda's function type's). */
  throws: Type[];
  /** Enclosing try statements (innermost last): their catch types and what their body throws. */
  handlers: { types: Type[]; thrown: Type[] }[];
}

class Scope {
  readonly parent: Scope | null;
  readonly kind: "class" | "body" | "block";
  readonly cls: ClassSymbol;
  readonly ctx: Ctx | null;
  vars: Map<string, LocalSymbol> | null = null;
  types: Map<string, ClassSymbol> | null = null;
  tvars: Map<string, TypeVarSymbol> | null = null;

  constructor(parent: Scope | null, kind: Scope["kind"], cls: ClassSymbol, ctx: Ctx | null) {
    this.parent = parent;
    this.kind = kind;
    this.cls = cls;
    this.ctx = ctx;
  }

  declare(v: LocalSymbol) {
    (this.vars ??= new Map()).set(v.name, v);
  }
}

type Resolved<T> = { method: T; subst: Subst | null; varargs: boolean };
type Arg = { node: A.Expression; ty: Type | null /* null: poly expression typed against the parameter */ };
type FoundField = { field: FieldSymbol; ty: Type; cls: ClassSymbol; staticCtx: boolean };
/** Bounds collected for one type variable during inference (check.ts instantiate/unify). */
type InferBounds = { eq: Type | null; lower: Type[]; upper: Type[]; expected: Type | null };

function depthOf(c: ClassSymbol): number {
  let d = 0;
  for (let o = c.outer; o; o = o.outer) d++;
  return d;
}

function methodLabel(name: string, params: readonly Type[], varargs = false): string {
  return `${name}(${params.map((p, i) => (varargs && i === params.length - 1 && p.tag === "array" ? typeToString(p.elem) + "..." : typeToString(p))).join(", ")})`;
}

function argLabel(args: Arg[]): string {
  return args.map((a) => (a.ty ? typeToString(a.ty) : a.node.kind === "Lambda" ? "lambda" : "method reference")).join(", ");
}

const isStatementExpression = (e: A.Expression) => e.kind === "Assign" || e.kind === "Update" || e.kind === "MethodCall" || e.kind === "NewObject";

// ---------------------------------------------------------------------------------------------------

class Checker {
  readonly lib: Library;
  readonly ts: TypeSystem;
  readonly diags: Diagnostic[];
  private sketch!: ClassSymbol;
  /** Java mode: types declared at the top level of the file (not members of the sketch class). */
  private topLevel = new Set<A.Member>();
  private readonly singleImports = new Map<string, ClassSymbol>();
  private readonly onDemand: string[] = [];
  private readonly staticImports: { cls: ClassSymbol; name: string | null }[] = [];
  /** Simple names of imports that could not be resolved (already reported; no follow-up errors). */
  private readonly unavailable = new Set<string>();
  /**
   * Initializers of final fields that may be constants, checked on first reference so that a switch
   * label can use a constant declared further down or in another tab.
   */
  private readonly pendingConstants = new Map<FieldSymbol, () => void>();
  private anonCount = 0;

  constructor(lib: Library, diags: Diagnostic[]) {
    this.lib = lib;
    this.ts = new TypeSystem(lib);
    this.diags = diags;
  }

  private err(code: string, message: string, n: { start: number; end: number }) {
    this.diags.push(error(code, message, n.start, n.end));
  }

  run(sk: Sketch): ClassSymbol {
    this.imports(sk.imports);
    const sym = new ClassSymbol(sk.name, sk.name, Flags.Source);
    sym.isSketch = true;
    sym.decl = sk.decl;
    sk.decl.sym = sym;
    this.sketch = sym;
    this.topLevel = sk.topLevel;
    this.declareMembers(sym, sk.decl.body);
    const top = new Scope(null, "class", sym, null);
    this.resolveHeaders(sym, top);
    this.enterAllMembers(sym, top);
    this.registerConstants(sym, top);
    this.checkClass(sym, top);
    return sym;
  }

  // --- imports -------------------------------------------------------------------------------------

  private imports(decls: A.ImportDecl[]) {
    for (const n of DEFAULT_SINGLE) this.singleImports.set(n.slice(n.lastIndexOf(".") + 1), this.lib.get(n));
    this.onDemand.push(...DEFAULT_ON_DEMAND);
    for (const d of decls) {
      if (d.static) {
        const owner = d.wildcard ? d.name : d.name.slice(0, d.name.lastIndexOf("."));
        const cls = this.classByName(owner);
        if (!cls) {
          this.err("unresolved-import", `The import ${owner} cannot be resolved`, d);
          continue;
        }
        this.staticImports.push({ cls, name: d.wildcard ? null : d.name.slice(owner.length + 1) });
      } else if (d.wildcard) {
        if (this.lib.packageClasses(d.name)) this.onDemand.push(d.name);
        else if (this.classByName(d.name)) this.onDemand.push(d.name); // nested types of a class
        else this.err("unsupported", `The import ${d.name} cannot be resolved (the package is not available in processing-ts)`, d);
      } else {
        const cls = this.classByName(d.name);
        if (!cls) {
          this.err("unsupported", `The import ${d.name} cannot be resolved (the class is not available in processing-ts)`, d);
          this.unavailable.add(d.name.slice(d.name.lastIndexOf(".") + 1));
        } else this.singleImports.set(cls.name, cls);
      }
    }
  }

  /** Library class by qualified source name (`java.util.Map.Entry`). */
  private classByName(name: string): ClassSymbol | null {
    if (this.lib.has(name)) return this.lib.get(name);
    const parts = name.split(".");
    for (let i = parts.length - 1; i > 0; i--) {
      const binary = parts.slice(0, i).join(".") + "$" + parts.slice(i).join("$");
      if (this.lib.has(binary)) return this.lib.get(binary);
    }
    return null;
  }

  // --- declarations --------------------------------------------------------------------------------

  /** Create symbols for the member types of a class body (recursively). */
  private declareMembers(owner: ClassSymbol, body: A.Member[]) {
    for (const m of body) {
      if (m.kind === "ClassDecl" || m.kind === "InterfaceDecl" || m.kind === "EnumDecl") {
        // Processing's Java level: inner types cannot declare static member types (enums and interfaces are static).
        if (this.isInnerType(owner)) {
          if (m.kind !== "ClassDecl") this.err("static-in-inner", `The member ${m.kind === "EnumDecl" ? "enum" : "interface"} ${m.name.text} must be defined inside a static member type`, m.name);
          else if (m.modifiers & Modifier.Static) this.err("static-in-inner", `The member type ${m.name.text} cannot be declared static; static types can only be declared in static or top level types`, m.name);
        }
        const c = this.declareClass(m, owner, this.topLevel.has(m) ? Flags.TopLevel : 0);
        if (owner.memberTypes.has(c.name)) this.err("duplicate", `The type ${c.name} is already defined`, m.name);
        else owner.memberTypes.set(c.name, c);
      }
    }
  }

  private declareClass(d: A.ClassDecl | A.InterfaceDecl | A.EnumDecl, outer: ClassSymbol, extraFlags: number): ClassSymbol {
    let flags = Flags.Source | extraFlags;
    if (d.kind === "InterfaceDecl") flags |= Flags.Interface | Flags.Abstract | Flags.Static;
    if (d.kind === "EnumDecl") flags |= Flags.Enum | Flags.Static | Flags.Final;
    if (d.modifiers & Modifier.Static) flags |= Flags.Static;
    if (d.modifiers & Modifier.Abstract) flags |= Flags.Abstract;
    if (d.modifiers & Modifier.Final) flags |= Flags.Final;
    if (outer.isInterface) flags |= Flags.Static; // member types of interfaces are static
    if (!(flags & Flags.Static)) flags |= Flags.Inner;
    const sym = new ClassSymbol(flags & Flags.TopLevel ? d.name.text : `${outer.fullName}$${d.name.text}`, d.name.text, flags);
    sym.outer = outer;
    sym.decl = d;
    d.sym = sym;
    if (d.kind !== "EnumDecl") {
      sym.typeParams = d.typeParams.map((p) => ({ kind: "tvar", name: p.name.text, bounds: [], owner: d.name.text }));
    }
    this.declareMembers(sym, d.body);
    return sym;
  }

  /** Resolve superclass/interfaces/type parameter bounds of a class and its member types. */
  private resolveHeaders(c: ClassSymbol, scope: Scope) {
    const d = c.decl;
    const inner = this.classScope(c, scope);
    if (c.isSketch) {
      c.superclass = this.lib.type("processing.core.PApplet");
    } else if (d && d.kind !== "NewObject") {
      if (d.kind !== "EnumDecl") {
        d.typeParams.forEach((p, i) => {
          c.typeParams[i].bounds = p.bounds.map((b) => this.resolveType(b, inner));
        });
      }
      if (d.kind === "ClassDecl") {
        if (d.superclass) {
          const t = this.resolveType(d.superclass, inner);
          if (t.tag === "class") {
            if (t.sym.load().isInterface) this.err("type-mismatch", `The type ${t.sym.displayName} cannot be the superclass of ${c.name}; a superclass must be a class`, d.superclass);
            else if (t.sym.flags & Flags.Final) this.err("type-mismatch", `The type ${c.name} cannot subclass the final class ${t.sym.displayName}`, d.superclass);
            else c.superclass = t;
          }
        }
        c.superclass ??= this.ts.object;
        c.interfaces = this.interfaceTypes(d.interfaces, inner, c);
      } else if (d.kind === "InterfaceDecl") {
        c.interfaces = this.interfaceTypes(d.extends, inner, c);
      } else {
        c.superclass = this.lib.type("java.lang.Enum", [c.thisType]);
        c.interfaces = this.interfaceTypes(d.interfaces, inner, c);
      }
    }
    for (const m of c.memberTypes.values()) if (m.isSource) this.resolveHeaders(m, inner);
  }

  private interfaceTypes(nodes: A.ClassType[], scope: Scope, c: ClassSymbol): ClassType[] {
    const out: ClassType[] = [];
    for (const n of nodes) {
      const t = this.resolveType(n, scope);
      if (t.tag !== "class") continue;
      if (!t.sym.load().isInterface) this.err("type-mismatch", `The type ${t.sym.displayName} cannot be a superinterface of ${c.name}; a superinterface must be an interface`, n);
      else out.push(t);
    }
    return out;
  }

  private registerConstants(c: ClassSymbol, scope: Scope) {
    const cs = this.classScope(c, scope);
    const d = c.decl;
    if (d && d.kind !== "NewObject") {
      for (const m of d.body) {
        if (m.kind !== "FieldDecl") continue;
        for (const v of m.declarators) {
          const f = v.sym as FieldSymbol | undefined;
          if (!f || !v.init || !(f.flags & Flags.Final) || !this.isConstantType(f.type)) continue;
          this.pendingConstants.set(f, () => this.fieldInitializer(c, cs, f, v));
        }
      }
    }
    for (const m of c.memberTypes.values()) if (m.isSource) this.registerConstants(m, cs);
  }

  /** Run a pending constant initializer now (before the field's declaration is reached). */
  private forceConstant(f: FieldSymbol) {
    const run = this.pendingConstants.get(f);
    if (run) {
      this.pendingConstants.delete(f);
      run();
    }
  }

  private fieldInitializer(c: ClassSymbol, cs: Scope, f: FieldSymbol, v: A.VarDeclarator) {
    const ctx: Ctx = { cls: c, method: null, returnType: null, isStatic: (f.flags & Flags.Static) !== 0, isConstructor: false, lambda: false, targets: [], throws: [], handlers: [] };
    const ty = this.initializer(v.init!, f.type, new Scope(cs, "body", c, ctx));
    if (f.flags & Flags.Final && v.init!.constant !== undefined && this.isConstantType(f.type)) f.constant = this.coerceConstant(v.init!.constant, ty, f.type);
  }

  private enterAllMembers(c: ClassSymbol, scope: Scope) {
    const inner = this.classScope(c, scope);
    this.enterMembers(c, inner);
    for (const m of c.memberTypes.values()) if (m.isSource) this.enterAllMembers(m, inner);
  }

  /** Fields, methods and constructors of a source class (signatures only). */
  private enterMembers(c: ClassSymbol, scope: Scope) {
    const d = c.decl!;
    const body = d.kind === "NewObject" ? d.body ?? [] : d.body;
    const iface = c.isInterface;
    if (d.kind === "EnumDecl") {
      const self = c.thisType;
      d.constants.forEach((k) => {
        const f: FieldSymbol = { kind: "field", name: k.name.text, type: self, flags: Flags.Static | Flags.Final | Flags.Enum, owner: c };
        if (c.fields.has(f.name)) this.err("duplicate", `Duplicate field ${c.name}.${f.name}`, k.name);
        c.fields.set(f.name, f);
        k.sym = f;
      });
      const values: MethodSymbol = { kind: "method", name: "values", typeParams: [], params: [], ret: { tag: "array", elem: self }, flags: Flags.Static, owner: c };
      const valueOf: MethodSymbol = { kind: "method", name: "valueOf", typeParams: [], params: [this.ts.string], ret: self, flags: Flags.Static, owner: c };
      c.addMethod(values);
      c.addMethod(valueOf);
    }
    for (const m of body) {
      switch (m.kind) {
        case "FieldDecl": {
          let flags = Flags.Source;
          if (m.modifiers & Modifier.Static || iface) flags |= Flags.Static;
          if (m.modifiers & Modifier.Final || iface) flags |= Flags.Final;
          if (m.modifiers & Modifier.Private) flags |= Flags.Private;
          const base = this.resolveType(m.type, scope);
          if (base.tag === "void") this.err("type-mismatch", "void is an invalid type for a variable", m.type);
          // Inner types may only declare static constants (Processing's compiler predates Java 16).
          if (flags & Flags.Static && !iface && this.isInnerType(c)) {
            for (const v of m.declarators) {
              if (!(flags & Flags.Final) || !v.init || !this.isConstantType(base)) this.err("static-in-inner", `The field ${v.name.text} cannot be declared static in a non-static inner type, unless initialized with a constant expression`, v.name);
            }
          }
          for (const v of m.declarators) {
            const f: FieldSymbol = { kind: "field", name: v.name.text, type: this.withDims(base, v.dims), flags, owner: c, decl: v };
            if (c.fields.has(f.name)) this.err("duplicate", `Duplicate field ${c.displayName}.${f.name}`, v.name);
            else c.fields.set(f.name, f);
            v.sym = f;
          }
          break;
        }
        case "MethodDecl": {
          const sym = this.methodSymbol(m, c, scope);
          if (sym.flags & Flags.Static && this.isInnerType(c)) this.err("static-in-inner", `The method ${sym.name} cannot be declared static; static methods can only be declared in a static or top level type`, m.name);
          const dup = (c.methods.get(sym.name) ?? []).find((o) => this.sameErasedParams(o, sym));
          if (dup) this.err("duplicate", `Duplicate method ${methodLabel(sym.name, sym.params)} in type ${c.displayName}`, m.name);
          c.addMethod(sym);
          break;
        }
        case "ConstructorDecl": {
          if (iface) break;
          const sym = this.methodSymbol(m, c, scope);
          if (c.constructors.find((o) => this.sameErasedParams(o, sym))) this.err("duplicate", `Duplicate constructor ${methodLabel(c.name, sym.params)}`, m.name);
          c.constructors.push(sym);
          break;
        }
        default:
          break;
      }
    }
    if (!iface && c.constructors.length === 0 && d.kind !== "NewObject") {
      c.constructors.push({ kind: "method", name: "<init>", typeParams: [], params: [], ret: T.void, flags: Flags.Source, owner: c });
    }
  }

  private methodSymbol(m: A.MethodDecl | A.ConstructorDecl, c: ClassSymbol, scope: Scope): MethodSymbol {
    const typeParams: TypeVarSymbol[] = m.typeParams.map((p) => ({ kind: "tvar", name: p.name.text, bounds: [], owner: m.name.text }));
    const mscope = new Scope(scope, "block", c, null);
    if (typeParams.length) {
      mscope.tvars = new Map(typeParams.map((t) => [t.name, t]));
      m.typeParams.forEach((p, i) => (typeParams[i].bounds = p.bounds.map((b) => this.resolveType(b, mscope))));
    }
    let flags = Flags.Source;
    const iface = c.isInterface;
    if (m.modifiers & Modifier.Static) flags |= Flags.Static;
    if (m.modifiers & Modifier.Final) flags |= Flags.Final;
    if (m.modifiers & Modifier.Private) flags |= Flags.Private;
    if (m.modifiers & Modifier.Protected) flags |= Flags.Protected;
    if (m.kind === "MethodDecl") {
      if (m.modifiers & Modifier.Abstract) flags |= Flags.Abstract;
      if (iface && !m.body && !(m.modifiers & (Modifier.Static | Modifier.Default))) flags |= Flags.Abstract;
      if (m.modifiers & Modifier.Default) flags |= Flags.Default;
      if (!m.body && !(flags & Flags.Abstract) && !(m.modifiers & Modifier.Native)) this.err("syntax", "This method requires a body instead of a semicolon", m.name);
      if (m.body && flags & Flags.Abstract) this.err("syntax", `Abstract methods do not specify a body`, m.name);
      if (flags & Flags.Abstract && !c.isAbstract && !(c.flags & Flags.Anonymous)) {
        this.err("abstract", `The abstract method ${m.name.text} in type ${c.displayName} can only be defined by an abstract class`, m.name);
      }
    }
    // Access: interface members are public; sketch-level methods were made public by the preprocessor.
    const isPublic = iface || (m.modifiers & Modifier.Public) !== 0;
    if (!isPublic && !(flags & (Flags.Private | Flags.Protected))) flags |= Flags.Package;
    const params = m.params.map((p, i) => {
      let t = this.withDims(this.resolveType(p.type!, mscope), p.dims);
      if (p.varargs) {
        t = { tag: "array", elem: t };
        if (i === m.params.length - 1) flags |= Flags.Varargs;
      }
      return t;
    });
    const ret = m.kind === "MethodDecl" ? this.withDims(this.resolveType(m.returnType, mscope), m.dims) : T.void;
    const sym: MethodSymbol = { kind: "method", name: m.kind === "MethodDecl" ? m.name.text : "<init>", typeParams, params, ret, flags, owner: c, decl: m, paramNames: m.params.map((p) => p.name.text) };
    if (m.throws.length) sym.throws = m.throws.map((t) => this.resolveType(t, mscope));
    m.sym = sym;
    return sym;
  }

  /** Inner, local or anonymous class: Processing's Java level allows no static members there. */
  private isInnerType(c: ClassSymbol): boolean {
    return !c.isSketch && (c.isInner || (c.flags & (Flags.Local | Flags.Anonymous)) !== 0) && !c.isInterface && !c.isEnum;
  }

  private sameErasedParams(a: MethodSymbol, b: MethodSymbol): boolean {
    return a.params.length === b.params.length && a.params.every((p, i) => sameType(erasure(p), erasure(b.params[i])));
  }

  private withDims(t: Type, dims: number): Type {
    for (let i = 0; i < dims; i++) t = { tag: "array", elem: t };
    return t;
  }

  // --- types ---------------------------------------------------------------------------------------

  /** Scope for the body of class `c` (fields, member types, type parameters). */
  private classScope(c: ClassSymbol, parent: Scope): Scope {
    if (parent.kind === "class" && parent.cls === c) return parent;
    const s = new Scope(parent, "class", c, null);
    if (c.typeParams.length && c.isSource) s.tvars = new Map(c.typeParams.map((t) => [t.name, t]));
    return s;
  }

  resolveType(n: A.TypeNode, scope: Scope): Type {
    const t = this.resolveTypeInner(n, scope);
    n.resolved = t;
    return t;
  }

  private resolveTypeInner(n: A.TypeNode, scope: Scope): Type {
    switch (n.kind) {
      case "PrimitiveType": return primType(n.name);
      case "VoidType": return T.void;
      case "VarType": return T.error; // handled by the declaration
      case "ArrayType": {
        const e = this.resolveType(n.element, scope);
        return e.tag === "error" ? e : { tag: "array", elem: e };
      }
      case "ClassType": {
        const sym = this.resolveClassName(n, scope);
        if (!sym) return T.error;
        if (sym.kind === "tvar") {
          if (n.typeArgs) this.err("type-mismatch", `The type ${sym.name} is not generic; it cannot be parameterized with arguments`, n);
          return { tag: "tvar", sym };
        }
        sym.load();
        if (!n.typeArgs) return classType(sym);
        const args = n.typeArgs.map((a) => (a.kind === "WildcardType" ? { tag: "wild" as const, bound: a.bound ? this.resolveType(a.bound, scope) : null, upper: a.upper } : this.resolveType(a, scope)));
        for (const [i, a] of args.entries()) if (a.tag === "prim") this.err("type-mismatch", `Syntax error, insert "Dimensions" to complete ReferenceType`, n.typeArgs[i]);
        if (n.typeArgs.length === 0) return { tag: "class", sym, args: [] }; // diamond: inferred by the creation expression
        if (!sym.isOpaque && sym.typeParams.length !== args.length) {
          this.err("type-mismatch", sym.typeParams.length === 0
            ? `The type ${sym.displayName} is not generic; it cannot be parameterized with arguments <${args.map(typeToString).join(", ")}>`
            : `Incorrect number of arguments for type ${sym.displayName}<${sym.typeParams.map((p) => p.name).join(",")}>; it cannot be parameterized with arguments <${args.map(typeToString).join(", ")}>`, n);
          return classType(sym);
        }
        return classType(sym, args.map((a) => (a.tag === "prim" ? T.error : a)));
      }
    }
  }

  /** Class (or type variable) named by a ClassType node; reports unresolved names. */
  private resolveClassName(n: A.ClassType, scope: Scope): ClassSymbol | TypeVarSymbol | null {
    if (!n.qualifier) {
      const found = this.lookupType(n.name.text, scope);
      if (!found && !this.unavailable.has(n.name.text)) this.err("unresolved-type", `Cannot find a class or type named "${n.name.text}"`, n.name);
      return found;
    }
    // Qualified: a member type of a type, or a class in a package.
    const qualified = this.qualifiedName(n);
    const lib = this.classByName(qualified);
    if (lib) return lib;
    const outer = this.resolveClassName(n.qualifier, scope);
    if (outer && outer.kind === "class") {
      const m = this.findMemberType(outer, n.name.text);
      if (m) return m;
      this.err("unresolved-type", `${qualified} cannot be resolved to a type`, n);
    }
    return null;
  }

  private qualifiedName(n: A.ClassType): string {
    return n.qualifier ? `${this.qualifiedName(n.qualifier)}.${n.name.text}` : n.name.text;
  }

  private findMemberType(c: ClassSymbol, name: string): ClassSymbol | null {
    const seen = new Set<ClassSymbol>();
    const visit = (s: ClassSymbol): ClassSymbol | null => {
      if (seen.has(s)) return null;
      seen.add(s);
      s.load();
      const m = s.memberTypes.get(name);
      if (m) return m;
      if (s.superclass) {
        const r = visit(s.superclass.sym);
        if (r) return r;
      }
      for (const i of s.interfaces) {
        const r = visit(i.sym);
        if (r) return r;
      }
      return null;
    };
    return visit(c);
  }

  private lookupType(name: string, scope: Scope): ClassSymbol | TypeVarSymbol | null {
    for (let s: Scope | null = scope; s; s = s.parent) {
      const tv = s.tvars?.get(name);
      if (tv) return tv;
      const local = s.types?.get(name);
      if (local) return local;
      if (s.kind === "class") {
        if (s.cls.name === name && !(s.cls.flags & Flags.Anonymous)) return s.cls;
        const m = this.findMemberType(s.cls, name);
        if (m) return m;
      }
    }
    const single = this.singleImports.get(name);
    if (single) return single;
    for (const pkg of this.onDemand) {
      const c = this.lib.packageClasses(pkg)?.get(name) ?? this.classByName(pkg)?.load().memberTypes.get(name);
      if (c) return c;
    }
    return null;
  }

  // --- members of types ----------------------------------------------------------------------------

  /** Field `name` of type `t` (searching supertypes), with its type as seen through `t`. */
  findField(t: Type, name: string): { field: FieldSymbol; ty: Type } | null {
    if (t.tag === "tvar" || t.tag === "wild") return this.findField(upperBound(t), name);
    if (t.tag !== "class") return null;
    const seen = new Set<ClassSymbol>();
    const visit = (c: ClassType): { field: FieldSymbol; ty: Type } | null => {
      if (seen.has(c.sym)) return null;
      seen.add(c.sym);
      const f = c.sym.load().fields.get(name);
      if (f) return { field: f, ty: isRaw(c) ? erasure(f.type) : substitute(f.type, substOf(c)) };
      for (const s of directSupertypes(c)) {
        const r = visit(s);
        if (r) return r;
      }
      return null;
    };
    return visit(t);
  }

  /**
   * Methods named `name` visible in `t`: declared and inherited, overridden ones removed (most derived
   * first). Each comes with the substitution that views it through `t`.
   */
  collectMethods(t: Type, name: string): { m: MethodSymbol; subst: Subst | null; raw: boolean }[] {
    if (t.tag === "tvar" || t.tag === "wild") return this.collectMethods(upperBound(t), name);
    if (t.tag === "array") {
      if (name === "clone") return [{ m: { kind: "method", name: "clone", typeParams: [], params: [], ret: t, flags: 0, owner: this.ts.object.sym }, subst: null, raw: false }];
      return this.collectMethods(this.ts.object, name);
    }
    if (t.tag !== "class") return [];
    const out: { m: MethodSymbol; subst: Subst | null; raw: boolean }[] = [];
    const seen = new Set<ClassSymbol>();
    const visit = (c: ClassType) => {
      if (seen.has(c.sym)) return;
      seen.add(c.sym);
      const raw = isRaw(c);
      const subst = substOf(c);
      for (const m of c.sym.load().methods.get(name) ?? []) {
        const params = m.params.map((p) => (raw ? erasure(p) : substitute(p, subst)));
        const overridden = out.some((o) => o.m.params.length === params.length && o.m.params.every((p, i) => sameType(erasure(raw || o.raw ? erasure(p) : substitute(p, o.subst)), erasure(params[i]))));
        if (!overridden) out.push({ m, subst, raw });
      }
      for (const s of directSupertypes(c)) visit(s);
    };
    visit(t);
    return out;
  }

  /** The single abstract method of a functional interface type, viewed through `t`. */
  functionType(t: Type): { m: MethodSymbol; params: Type[]; ret: Type; throws: Type[] } | null {
    if (t.tag !== "class" || !t.sym.load().isInterface) return null;
    // Non-wildcard parameterization (JLS 9.9): Comparator<? super Ball> has the function type of Comparator<Ball>.
    if (t.args.some((a) => a.tag === "wild")) {
      const params = t.sym.typeParams;
      t = classType(t.sym, t.args.map((a, i) => (a.tag !== "wild" ? a : a.bound ?? (params[i]?.bounds[0] ?? this.ts.object))));
    }
    const abstract: { m: MethodSymbol; params: Type[]; ret: Type; throws: Type[] }[] = [];
    const seen = new Set<ClassSymbol>();
    const visit = (c: ClassType) => {
      if (seen.has(c.sym)) return;
      seen.add(c.sym);
      const raw = isRaw(c);
      const subst = substOf(c);
      const view = (x: Type) => {
        const y = raw ? erasure(x) : substitute(x, subst);
        return y.tag === "wild" ? upperBound(y) : y;
      };
      for (const ms of c.sym.load().methods.values()) {
        for (const m of ms) {
          if (!(m.flags & Flags.Abstract)) continue;
          if (this.isObjectMethod(m)) continue;
          const params = m.params.map(view);
          if (abstract.some((a) => a.m.name === m.name && a.params.length === params.length && a.params.every((p, i) => sameType(erasure(p), erasure(params[i]))))) continue;
          abstract.push({ m, params, ret: view(m.ret), throws: (m.throws ?? []).map(view) });
        }
      }
      for (const i of c.sym.interfaces) visit((raw ? erasure(i) : substitute(i, subst)) as ClassType);
    };
    visit(t);
    return abstract.length === 1 ? abstract[0] : null;
  }

  private isObjectMethod(m: MethodSymbol): boolean {
    const o = this.ts.object.sym.load().methods.get(m.name);
    return !!o && o.some((x) => x.params.length === m.params.length && x.params.every((p, i) => sameType(erasure(p), erasure(m.params[i]))));
  }

  // --- class bodies --------------------------------------------------------------------------------

  private checkClass(c: ClassSymbol, scope: Scope) {
    const d = c.decl!;
    const cs = this.classScope(c, scope);
    const body = d.kind === "NewObject" ? d.body ?? [] : d.body;
    const ctxFor = (isStatic: boolean, method: MethodSymbol | null, returnType: Type | null, isConstructor = false): Ctx =>
      ({ cls: c, method, returnType, isStatic, isConstructor, lambda: false, targets: [], throws: method?.throws ?? [], handlers: [] });
    if (d.kind === "EnumDecl") {
      for (const k of d.constants) this.checkEnumConstant(c, k, cs, ctxFor(true, null, null));
    }
    for (const m of body) {
      switch (m.kind) {
        case "FieldDecl":
          for (const v of m.declarators) {
            const f = v.sym as FieldSymbol;
            if (!v.init) continue;
            if (this.pendingConstants.has(f)) this.forceConstant(f);
            else if (v.init.ty === undefined) this.fieldInitializer(c, cs, f, v);
          }
          break;
        case "MethodDecl": {
          const sym = m.sym!;
          if (m.body) {
            const ctx = ctxFor((sym.flags & Flags.Static) !== 0, sym, sym.ret);
            const ms = this.methodScope(cs, c, ctx, sym, m);
            this.blockBody(m.body, ms);
            this.flow(m.body, sym.ret, m.name);
          }
          this.checkOverride(c, sym, m);
          break;
        }
        case "ConstructorDecl": {
          const sym = m.sym;
          if (!sym) break;
          const ctx = ctxFor(false, sym, T.void, true);
          const ms = this.methodScope(cs, c, ctx, sym, m);
          if (m.call) this.constructorCall(m.call, c, ms);
          else if (!c.isEnum) this.implicitSuper(c, m.name);
          this.blockBody(m.body, ms);
          this.flow(m.body, T.void, m.name);
          break;
        }
        case "Initializer": {
          const ctx = ctxFor(m.static, null, null);
          this.blockBody(m.body, new Scope(cs, "body", c, ctx));
          this.definite(m.body);
          break;
        }
        case "ClassDecl":
        case "InterfaceDecl":
        case "EnumDecl":
          this.checkClass(m.sym!, cs);
          break;
      }
    }
    if (!c.isInterface && d.kind !== "NewObject" && !c.constructors.some((k) => k.decl) && !c.isEnum) this.implicitSuper(c, d.name, true);
    if (!c.isAbstract) this.checkAbstractImplemented(c, d.kind === "NewObject" ? d.type : d.name);
  }

  private methodScope(parent: Scope, c: ClassSymbol, ctx: Ctx, sym: MethodSymbol, m: A.MethodDecl | A.ConstructorDecl): Scope {
    const s = new Scope(parent, "body", c, ctx);
    if (sym.typeParams.length) s.tvars = new Map(sym.typeParams.map((t) => [t.name, t]));
    const depth = depthOf(c);
    m.params.forEach((p, i) => {
      const v: LocalSymbol = { kind: "local", name: p.name.text, type: sym.params[i], final: (p.modifiers & Modifier.Final) !== 0, role: "param", decl: p, classDepth: depth };
      if (s.vars?.has(v.name)) this.err("duplicate", `Duplicate parameter ${v.name}`, p.name);
      s.declare(v);
      p.sym = v;
    });
    return s;
  }

  private checkEnumConstant(c: ClassSymbol, k: A.EnumConstant, scope: Scope, ctx: Ctx) {
    const s = new Scope(scope, "body", c, ctx);
    const args = (k.args ?? []).map((a) => this.arg(a, s));
    const r = this.resolveOverload(c.constructors.map((m) => ({ m, subst: null, raw: false })), args, s, null, k.name, c.name, "constructor", c);
    if (r) {
      k.ctor = r.method.m;
      if (r.varargs) k.varargsCall = true;
      this.finishArgs(args, r, s);
    }
    if (k.body) {
      const anon = new ClassSymbol(`${c.fullName}$${++this.anonCount}`, "", Flags.Source | Flags.Anonymous | Flags.Final);
      anon.outer = c;
      anon.superclass = c.thisType;
      const fake: A.NewObject = { kind: "NewObject", outer: null, typeArgs: null, type: { kind: "ClassType", qualifier: null, name: k.name, typeArgs: null, start: k.start, end: k.end }, args: [], body: k.body, start: k.start, end: k.end };
      anon.decl = fake;
      this.declareMembers(anon, k.body);
      const cs = this.classScope(anon, s);
      for (const m of anon.memberTypes.values()) this.resolveHeaders(m, cs);
      this.enterMembers(anon, cs);
      for (const m of anon.memberTypes.values()) this.enterAllMembers(m, cs);
      this.checkClass(anon, s);
      k.anonymous = anon;
    }
  }

  /** `super()` inserted by the compiler: the superclass needs an accessible no-argument constructor. */
  private implicitSuper(c: ClassSymbol, at: { start: number; end: number }, defaultCtor = false) {
    const sup = c.superclass;
    if (!sup || c.isSketch || c.isInterface) return;
    const ctors = sup.sym.load().constructors;
    if (sup.sym.isOpaque || ctors.length === 0 || ctors.some((k) => k.params.length === 0 || (k.flags & Flags.Varargs && k.params.length === 1))) return;
    const name = sup.sym.displayName;
    this.err("constructor", defaultCtor
      ? `Implicit super constructor ${name}() is undefined for default constructor. Must define an explicit constructor`
      : `Implicit super constructor ${name}() is undefined. Must explicitly invoke another constructor`, at);
  }

  private constructorCall(call: A.ConstructorCall, c: ClassSymbol, scope: Scope) {
    const target = call.super ? c.superclass : c.thisType;
    const prologue = new Scope(scope, "body", c, { ...scope.ctx!, isStatic: true });
    if (call.outer) this.expr(call.outer, scope);
    const args = call.args.map((a) => this.arg(a, prologue));
    if (!target) return;
    const sym = target.sym.load();
    const cands = sym.constructors.map((m) => ({ m, subst: substOf(target), raw: isRaw(target) }));
    const r = this.resolveOverload(cands, args, prologue, null, call, sym.displayName, "constructor", sym);
    if (r) {
      call.ctor = r.method.m;
      if (r.varargs) call.varargsCall = true;
      this.thrown(r.method.m.throws, call, scope);
      this.finishArgs(args, r, prologue);
    }
  }

  private checkAbstractImplemented(c: ClassSymbol, at: { start: number; end: number }) {
    // Collect abstract methods of all supertypes and look for an implementation.
    const self = c.thisType;
    const missing: { m: MethodSymbol; owner: ClassSymbol }[] = [];
    const seen = new Set<ClassSymbol>();
    const visit = (t: ClassType) => {
      if (seen.has(t.sym)) return;
      seen.add(t.sym);
      for (const ms of t.sym.load().methods.values()) {
        for (const m of ms) {
          if (!(m.flags & Flags.Abstract)) continue;
          const impl = this.collectMethods(self, m.name).find((x) => !(x.m.flags & Flags.Abstract) && x.m.params.length === m.params.length
            && x.m.params.every((p, i) => sameType(erasure(substitute(p, x.subst)), erasure(substitute(m.params[i], asSuper(self, t.sym) ? substOf(asSuper(self, t.sym)!) : null)))));
          if (!impl && !missing.some((x) => x.m.name === m.name && x.m.params.length === m.params.length)) missing.push({ m, owner: t.sym });
        }
      }
      for (const s of directSupertypes(t)) visit(s);
    };
    for (const s of directSupertypes(self)) visit(s);
    for (const { m, owner } of missing.slice(0, 1)) {
      const sup = asSuper(self, owner);
      const params = m.params.map((p) => substitute(p, sup ? substOf(sup) : null));
      const typeName = c.flags & Flags.Anonymous ? `new ${owner.displayName}(){}` : c.displayName;
      this.err("abstract", `The type ${typeName} must implement the inherited abstract method ${owner.displayName}.${methodLabel(m.name, params)}`, at);
    }
  }

  private checkOverride(c: ClassSymbol, sym: MethodSymbol, m: A.MethodDecl) {
    if (sym.flags & Flags.Private) return;
    const self = c.thisType;
    let overrides = false;
    for (const sup of directSupertypes(self)) {
      for (const o of this.collectMethods(sup, sym.name)) {
        if (o.m.flags & Flags.Private || o.m.params.length !== sym.params.length) continue;
        const params = o.m.params.map((p) => (o.raw ? erasure(p) : substitute(p, o.subst)));
        if (!params.every((p, i) => sameType(erasure(p), erasure(sym.params[i])))) continue;
        overrides = true;
        const ownerName = o.m.owner.displayName;
        const label = methodLabel(o.m.name, params);
        if ((o.m.flags & Flags.Static) !== (sym.flags & Flags.Static)) {
          this.err("override", sym.flags & Flags.Static
            ? `This static method cannot hide the instance method from ${ownerName}`
            : `This instance method cannot override the static method from ${ownerName}`, m.name);
          continue;
        }
        const ret = o.raw ? erasure(o.m.ret) : substitute(o.m.ret, o.subst);
        const okRet = ret.tag === "prim" || ret.tag === "void" || sym.ret.tag === "prim" || sym.ret.tag === "void" ? sameType(ret, sym.ret) : this.ts.isSubtype(sym.ret, erasure(ret)) || this.ts.isSubtype(sym.ret, ret);
        if (!okRet) this.err("override", `The return type is incompatible with ${ownerName}.${label}`, m.returnType);
        const supPublic = o.m.owner.isInterface || !(o.m.flags & (Flags.Protected | Flags.Private | Flags.Package));
        const supProtected = (o.m.flags & Flags.Protected) !== 0;
        const mine = sym.flags & Flags.Package ? 0 : sym.flags & Flags.Protected ? 1 : 2;
        if ((supPublic && mine < 2) || (supProtected && mine < 1)) this.err("override", `Cannot reduce the visibility of the inherited method from ${ownerName}`, m.name);
        if (o.m.flags & Flags.Final) this.err("override", `Cannot override the final method from ${ownerName}`, m.name);
      }
    }
    if (!overrides && m.annotations.some((a) => a.name === "Override")) {
      this.err("override", `The method ${methodLabel(sym.name, sym.params)} of type ${c.displayName} must override or implement a supertype method`, m.name);
    }
  }

  private flow(body: A.Block, ret: Type, at: A.Ident) {
    this.definite(body);
    const { completes, unreachable } = checkFlow(body);
    for (const u of unreachable) this.err("unreachable", "Unreachable code", u);
    if (completes && ret.tag !== "void" && ret.tag !== "error") this.err("missing-return", `This method must return a result of type ${typeToString(ret)}`, at);
  }

  private definite(body: A.Block) {
    checkDefiniteAssignment(body, [], (v, at) => this.err("uninitialized", `The local variable ${v.name} may not have been initialized`, at));
  }

  // --- statements ----------------------------------------------------------------------------------

  private blockBody(b: A.Block, scope: Scope) {
    for (const s of b.body) this.stmt(s, scope);
  }

  private block(b: A.Block, scope: Scope) {
    const s = new Scope(scope, "block", scope.cls, scope.ctx);
    this.blockBody(b, s);
  }

  /** Check a statement in a position that introduces no bindings of its own (if/loop bodies). */
  private nested(s: A.Statement, scope: Scope) {
    if (s.kind === "Block") this.block(s, scope);
    else this.stmt(s, new Scope(scope, "block", scope.cls, scope.ctx));
  }

  private stmt(s: A.Statement, scope: Scope) {
    const ctx = scope.ctx!;
    switch (s.kind) {
      case "Block": this.block(s, scope); return;
      case "Empty": return;
      case "LocalVar": this.localVar(s, scope, "local"); return;
      case "ExprStmt":
        this.expr(s.expr, scope);
        return;
      case "If":
        this.condition(s.test, scope);
        this.nested(s.consequent, scope);
        if (s.alternate) this.nested(s.alternate, scope);
        return;
      case "While":
        this.condition(s.test, scope);
        this.loopBody(s.body, scope, ctx);
        return;
      case "DoWhile":
        this.loopBody(s.body, scope, ctx);
        this.condition(s.test, scope);
        return;
      case "For": {
        const fs = new Scope(scope, "block", scope.cls, ctx);
        for (const i of s.init) {
          if (i.kind === "LocalVar") this.localVar(i, fs, "local");
          else this.expr(i.expr, fs);
        }
        if (s.test) this.condition(s.test, fs);
        for (const u of s.update) this.expr(u, fs);
        this.loopBody(s.body, fs, ctx);
        return;
      }
      case "ForEach": {
        const fs = new Scope(scope, "block", scope.cls, ctx);
        const it = this.expr(s.iterable, scope);
        let elem: Type = T.error;
        if (it.tag === "array") elem = it.elem;
        else if (it.tag !== "error") {
          const sup = asSuper(it, this.ts.iterable);
          if (!sup) this.err("type-mismatch", "Can only iterate over an array or an instance of java.lang.Iterable", s.iterable);
          else elem = !sup.args.length ? this.ts.object : sup.args[0].tag === "wild" ? upperBound(sup.args[0]) : sup.args[0];
        }
        let declared: Type;
        if (s.type.kind === "VarType") declared = this.withDims(elem, s.dims);
        else {
          declared = this.withDims(this.resolveType(s.type, scope), s.dims);
          if (!this.ts.isAssignable(elem, declared)) this.mismatch(elem, declared, s.iterable);
        }
        const v: LocalSymbol = { kind: "local", name: s.name.text, type: declared, final: (s.modifiers & Modifier.Final) !== 0, role: "foreach", decl: s, classDepth: depthOf(scope.cls) };
        this.declareLocal(v, fs, s.name);
        s.sym = v;
        this.loopBody(s.body, fs, ctx);
        return;
      }
      case "Labeled":
        ctx.targets.push("label:" + s.label.text + (s.body.kind === "While" || s.body.kind === "DoWhile" || s.body.kind === "For" || s.body.kind === "ForEach" ? ":loop" : ""));
        this.nested(s.body, scope);
        ctx.targets.pop();
        return;
      case "Switch": this.switchStmt(s, scope); return;
      case "Break":
      case "Continue": {
        const isBreak = s.kind === "Break";
        if (s.label) {
          const ok = ctx.targets.some((t) => t === "label:" + s.label!.text || (!isBreak ? t === "label:" + s.label!.text + ":loop" : t.startsWith("label:" + s.label!.text + ":")));
          if (!ok) this.err("label", `The label ${s.label.text} is missing`, s.label);
        } else if (!ctx.targets.some((t) => t === "loop" || (isBreak && t === "switch"))) {
          this.err("syntax", isBreak ? "break cannot be used outside of a loop or a switch" : "continue cannot be used outside of a loop", s);
        }
        return;
      }
      case "Return": this.returnStmt(s, scope); return;
      case "Throw": {
        const t = this.expr(s.expr, scope);
        if (t.tag !== "error" && !this.ts.isSubtype(t, this.ts.throwable)) this.err("type-mismatch", `No exception of type ${typeToString(t)} can be thrown; an exception type must be a subclass of Throwable`, s.expr);
        else this.thrown([t], s, scope);
        return;
      }
      case "Assert":
        this.condition(s.test, scope);
        if (s.message) this.expr(s.message, scope);
        return;
      case "Try": {
        const ts = new Scope(scope, "block", scope.cls, ctx);
        const catchTypes = s.catches.map((c) => c.types.map((t) => {
          const ty = this.resolveType(t, scope);
          if (ty.tag !== "error" && !this.ts.isSubtype(ty, this.ts.throwable)) this.err("type-mismatch", `No exception of type ${typeToString(ty)} can be thrown; an exception type must be a subclass of Throwable`, t);
          return ty;
        }));
        const frame = { types: catchTypes.flat(), thrown: [] as Type[] };
        ctx.handlers.push(frame);
        for (const r of s.resources) {
          let rt: Type;
          if (r.kind === "LocalVar") {
            this.localVar(r, ts, "resource");
            rt = (r.declarators[0]?.sym as LocalSymbol | undefined)?.type ?? T.error;
          } else rt = this.expr(r, ts);
          // close() of the resource may throw too (BufferedReader.close throws IOException).
          const close = this.collectMethods(rt, "close").find((x) => x.m.params.length === 0);
          if (close) this.thrown(close.m.throws, r, ts);
        }
        this.block(s.block, ts);
        ctx.handlers.pop();
        this.unreachableCatches(s, catchTypes, frame.thrown);
        for (const [ci, c] of s.catches.entries()) {
          const cs = new Scope(scope, "block", scope.cls, ctx);
          const types = catchTypes[ci];
          const ty = types.length === 1 ? types[0] : types.reduce((a, b) => this.ts.lub(a, b));
          const v: LocalSymbol = { kind: "local", name: c.name.text, type: ty, final: types.length > 1, role: "catch", decl: c, classDepth: depthOf(scope.cls) };
          this.declareLocal(v, cs, c.name);
          c.sym = v;
          this.blockBody(c.body, cs);
        }
        if (s.finally) this.block(s.finally, scope);
        return;
      }
      case "Synchronized": {
        const t = this.expr(s.lock, scope);
        if (t.tag === "prim") this.err("type-mismatch", `Cannot use ${typeToString(t)} as a lock: synchronized needs an object`, s.lock);
        this.block(s.body, scope);
        return;
      }
      case "ClassDecl":
      case "InterfaceDecl":
      case "EnumDecl":
        this.localClass(s, scope);
        return;
    }
  }

  // Exceptions ----------------------------------------------------------------------------------------

  private isChecked(t: Type): boolean {
    return t.tag === "class" && this.ts.isSubtype(t, this.ts.throwable) && !this.ts.isSubtype(t, this.ts.runtimeException) && !this.ts.isSubtype(t, this.ts.errorClass);
  }

  /** Checked exceptions thrown at `at` must be caught by an enclosing try or declared by the method. */
  private thrown(types: readonly Type[] | undefined, at: { start: number; end: number }, scope: Scope, view?: (t: Type) => Type) {
    const ctx = scope.ctx;
    if (!types?.length || !ctx) return;
    for (let t of types) {
      if (view) t = view(t);
      if (!this.isChecked(t)) continue;
      let handled = false;
      for (let i = ctx.handlers.length - 1; i >= 0 && !handled; i--) {
        const h = ctx.handlers[i];
        h.thrown.push(t);
        handled = h.types.some((c) => this.ts.isSubtype(t, c));
      }
      if (!handled && !ctx.throws.some((d) => this.ts.isSubtype(t, d))) this.err("unhandled-exception", `Unhandled exception type ${typeToString(t)}`, at);
    }
  }

  /** A catch of a checked exception the try body cannot throw is an error (Exception and Throwable excepted). */
  private unreachableCatches(s: A.Try, catchTypes: Type[][], thrown: Type[]) {
    const earlier: Type[] = [];
    s.catches.forEach((c, i) => {
      catchTypes[i].forEach((t, k) => {
        const at = c.types[k];
        const prior = earlier.find((e) => this.ts.isSubtype(t, e));
        if (prior) this.err("unreachable", `Unreachable catch block for ${typeToString(t)}. It is already handled by the catch block for ${typeToString(prior)}`, at);
        else if (this.isChecked(t) && !this.ts.isSubtype(this.ts.exception, t) && !thrown.some((x) => this.ts.isSubtype(x, t) || this.ts.isSubtype(t, x))) {
          this.err("unreachable", `Unreachable catch block for ${typeToString(t)}. This exception is never thrown from the try statement body`, at);
        }
      });
      earlier.push(...catchTypes[i]);
    });
  }

  private loopBody(body: A.Statement, scope: Scope, ctx: Ctx) {
    ctx.targets.push("loop");
    this.nested(body, scope);
    ctx.targets.pop();
  }

  private condition(e: A.Expression, scope: Scope) {
    const t = this.expr(e, scope, T.boolean);
    if (t.tag !== "error" && this.ts.primOf(t)?.name !== "boolean") this.mismatch(t, T.boolean, e);
  }

  private declareLocal(v: LocalSymbol, scope: Scope, at: A.Ident) {
    // Java forbids redeclaring a local of the same method (shadowing within one body).
    for (let s: Scope | null = scope; s && s.kind !== "class"; s = s.parent) {
      if (s.vars?.has(v.name)) {
        this.err("duplicate", `Duplicate local variable ${v.name}`, at);
        break;
      }
      if (s.kind === "body" && !s.ctx?.lambda) break;
    }
    scope.declare(v);
  }

  private localVar(d: A.LocalVar, scope: Scope, role: LocalSymbol["role"]) {
    const isVar = d.type.kind === "VarType";
    const base = isVar ? T.error : this.resolveType(d.type, scope);
    if (base.tag === "void") this.err("type-mismatch", "void is an invalid type for the variable " + d.declarators[0]?.name.text, d.type);
    if (isVar && d.declarators.length > 1) this.err("syntax", "'var' is not allowed in a compound declaration", d.type);
    for (const v of d.declarators) {
      let type = this.withDims(base, v.dims);
      const final = (d.modifiers & Modifier.Final) !== 0;
      if (isVar) {
        if (v.dims) this.err("syntax", `'var' is not allowed as an element type of an array`, v.name);
        if (!v.init) {
          this.err("syntax", `Cannot use 'var' on variable without initializer`, v.name);
          type = T.error;
        } else if (v.init.kind === "ArrayInit" || v.init.kind === "Lambda" || v.init.kind === "MethodRef") {
          this.err("syntax", `Cannot infer type for local variable initialized to an array initializer or a lambda`, v.name);
          type = T.error;
        } else {
          type = this.expr(v.init, scope);
          if (type.tag === "null") {
            this.err("syntax", `Cannot infer type for local variable initialized to 'null'`, v.name);
            type = T.error;
          } else if (type.tag === "void") {
            this.err("syntax", `Variable initializer is 'void' -- cannot infer variable type`, v.name);
            type = T.error;
          }
        }
      }
      const sym: LocalSymbol = { kind: "local", name: v.name.text, type, final, role, decl: v, classDepth: depthOf(scope.cls) };
      v.sym = sym;
      if (v.init && !isVar) this.initializer(v.init, type, scope);
      if (final && v.init && v.init.constant !== undefined && this.isConstantType(type)) sym.constant = this.coerceConstant(v.init.constant, v.init.ty ?? type, type);
      // The variable is in scope in its own initializer (Java), but declaring after checking it is
      // enough to catch `int x = x;` as unresolved only when x is not otherwise visible.
      this.declareLocal(sym, scope, v.name);
    }
  }

  private isConstantType(t: Type): boolean {
    return t.tag === "prim" || this.ts.isString(t);
  }

  private coerceConstant(v: ConstValue, from: Type, to: Type): ConstValue | undefined {
    if (to.tag === "prim" && from.tag === "prim") return convert(v, from.name, to.name);
    return typeof v === "string" ? v : undefined;
  }

  /** Variable initializer: an expression or an array initializer, checked against `type`. */
  private initializer(init: A.Expression, type: Type, scope: Scope): Type {
    if (init.kind === "ArrayInit") {
      if (type.tag !== "array") {
        if (type.tag !== "error") this.err("type-mismatch", `Type mismatch: cannot convert from an array initializer to ${typeToString(type)}`, init);
        for (const e of init.elements) this.expr(e, scope);
        return T.error;
      }
      this.arrayInit(init, type, scope);
      return type;
    }
    const t = this.expr(init, scope, type);
    if (!this.ts.isAssignable(t, type, init.constant)) this.mismatch(t, type, init);
    return t;
  }

  private arrayInit(init: A.ArrayInit, type: A.ArrayInit["ty"] & { tag: "array" }, scope: Scope) {
    init.ty = type;
    for (const e of init.elements) {
      if (e.kind === "ArrayInit") {
        if (type.elem.tag === "array") this.arrayInit(e, type.elem, scope);
        else this.err("type-mismatch", `Type mismatch: cannot convert from an array initializer to ${typeToString(type.elem)}`, e);
      } else {
        const t = this.expr(e, scope, type.elem);
        if (!this.ts.isAssignable(t, type.elem, e.constant)) this.mismatch(t, type.elem, e);
      }
    }
  }

  private switchStmt(s: A.Switch, scope: Scope) {
    const ctx = scope.ctx!;
    const t = this.expr(s.discriminant, scope);
    const p = this.ts.primOf(t);
    const isEnum = t.tag === "class" && t.sym.load().isEnum;
    const isString = this.ts.isString(t);
    if (t.tag !== "error" && !isEnum && !isString && !(p && (p.name === "int" || p.name === "char" || p.name === "short" || p.name === "byte"))) {
      this.err("type-mismatch", `Cannot switch on a value of type ${typeToString(t)}. Only convertible int values, strings or enum variables are permitted`, s.discriminant);
    }
    const ss = new Scope(scope, "block", scope.cls, ctx);
    const seen = new Set<string>();
    let hasDefault = false;
    ctx.targets.push("switch");
    for (const c of s.cases) {
      for (const l of c.labels) {
        if (l === null) {
          if (hasDefault) this.err("duplicate", "Duplicate default case", c);
          hasDefault = true;
          continue;
        }
        let key: string | undefined;
        if (isEnum && l.kind === "Identifier") {
          const f = (t as ClassType).sym.fields.get(l.name);
          if (!f || !(f.flags & Flags.Enum)) this.err("unresolved-name", `${l.name} cannot be resolved or is not a field`, l);
          else {
            l.sym = f;
            l.ty = t;
          }
          key = "enum:" + l.name;
        } else {
          const lt = this.expr(l, ss, t);
          if (l.constant === undefined) {
            if (lt.tag !== "error") this.err("constant", isEnum ? "The enum constant must be an unqualified name" : "case expressions must be constant expressions", l);
          } else if (!this.ts.isAssignable(lt, p ?? t, l.constant)) this.mismatch(lt, p ?? t, l);
          else key = typeof l.constant + ":" + String(lt.tag === "prim" && p && lt.name !== p.name ? convert(l.constant, lt.name, p.name) : l.constant);
        }
        if (key !== undefined) {
          if (seen.has(key)) this.err("duplicate", "Duplicate case", l);
          seen.add(key);
        }
      }
      for (const st of c.body) this.stmt(st, ss);
    }
    ctx.targets.pop();
  }

  private returnStmt(s: A.Return, scope: Scope) {
    const ctx = scope.ctx!;
    const ret = ctx.returnType;
    if (!s.value) {
      if (ret && ret.tag !== "void" && ret.tag !== "error") this.err("missing-return", `This method must return a result of type ${typeToString(ret)}`, s);
      return;
    }
    if (ret === null) {
      this.expr(s.value, scope);
      this.err("syntax", "Cannot return a value from an initializer", s);
      return;
    }
    if (ret.tag === "void") {
      this.expr(s.value, scope);
      this.err("type-mismatch", "Void methods cannot return a value", s.value);
      return;
    }
    const t = this.expr(s.value, scope, ret);
    if (!this.ts.isAssignable(t, ret, s.value.constant)) this.mismatch(t, ret, s.value);
  }

  private localClass(d: A.ClassDecl | A.InterfaceDecl | A.EnumDecl, scope: Scope) {
    const owner = scope.cls;
    // Local enums and interfaces are Java 16; Processing 4.5.2 fails on them.
    if (d.kind !== "ClassDecl") this.err("unsupported", `Local ${d.kind === "EnumDecl" ? "enums" : "interfaces"} are not supported by Processing; declare ${d.name.text} outside of the method`, d.name);
    const sym = this.declareClass(d, owner, Flags.Local);
    if (scope.ctx?.isStatic) sym.flags = (sym.flags & ~Flags.Inner) | Flags.Static;
    const exists = scope.types?.get(d.name.text);
    if (exists) this.err("duplicate", `Duplicate nested type ${d.name.text}`, d.name);
    (scope.types ??= new Map()).set(d.name.text, sym);
    this.resolveHeaders(sym, scope);
    this.enterAllMembers(sym, scope);
    this.checkClass(sym, scope);
  }

  // --- expressions ---------------------------------------------------------------------------------

  private mismatch(from: Type, to: Type, at: { start: number; end: number }) {
    if (from.tag === "error" || to.tag === "error") return;
    this.err("type-mismatch", `Type mismatch: cannot convert from ${typeToString(from)} to ${typeToString(to)}`, at);
  }

  /** Type an expression; `expected` guides poly expressions (lambdas, diamonds, generic calls). */
  expr(e: A.Expression, scope: Scope, expected?: Type): Type {
    const t = this.exprInner(e, scope, expected);
    e.ty = t;
    return t;
  }

  private exprInner(e: A.Expression, scope: Scope, expected?: Type): Type {
    switch (e.kind) {
      case "IntLiteral":
        e.constant = e.value;
        return e.long ? T.long : T.int;
      case "FloatLiteral": {
        // Processing reads unsuffixed literals as float (the preprocessor appends "f").
        if (e.suffix === "d") {
          e.constant = e.value;
          return T.double;
        }
        const f = Math.fround(e.value);
        if (!Number.isFinite(f) && Number.isFinite(e.value)) this.err("literal", `The literal ${this.literalText(e)} of type float is out of range`, e);
        else if (f === 0 && e.value !== 0) this.err("literal", `The literal ${this.literalText(e)} of type float is out of range`, e);
        e.constant = f;
        return T.float;
      }
      case "CharLiteral":
        e.constant = e.value;
        return T.char;
      case "StringLiteral":
        e.constant = e.value;
        return this.ts.string;
      case "BooleanLiteral":
        e.constant = e.value;
        return T.boolean;
      case "NullLiteral": return T.null;
      case "Identifier": return this.identifier(e, scope);
      case "FieldAccess": return this.fieldAccess(e, scope);
      case "This": return this.thisExpr(e, scope);
      case "Super": {
        this.err("syntax", "Syntax error on token \"super\"", e);
        return T.error;
      }
      case "ArrayAccess": {
        const a = this.expr(e.array, scope);
        const i = this.expr(e.index, scope);
        this.intIndex(i, e.index);
        if (a.tag === "error") return T.error;
        if (a.tag !== "array") {
          this.err("type-mismatch", `The type of the expression must be an array type but it resolved to ${typeToString(a)}`, e.array);
          return T.error;
        }
        return a.elem;
      }
      case "MethodCall": return this.methodCall(e, scope, expected);
      case "NewObject": return this.newObject(e, scope, expected);
      case "NewArray": {
        const elem = this.resolveType(e.elementType, scope);
        for (const d of e.dimensions) if (d) this.intIndex(this.expr(d, scope), d);
        let t: Type = elem;
        for (let k = 0; k < e.dimensions.length; k++) t = { tag: "array", elem: t };
        if (elem.tag === "void") this.err("type-mismatch", "void[] is an invalid type", e.elementType);
        if (e.initializer && t.tag === "array") this.arrayInit(e.initializer, t, scope);
        return elem.tag === "error" ? T.error : t;
      }
      case "ArrayInit": {
        this.err("syntax", "Array constants can only be used in initializers", e);
        for (const x of e.elements) this.expr(x, scope);
        return T.error;
      }
      case "Unary": return this.unary(e, scope);
      case "Update": {
        const t = this.expr(e.operand, scope);
        this.requireVariable(e.operand, scope);
        const p = this.ts.primOf(t);
        if (t.tag !== "error" && (!p || !isNumeric(p))) {
          this.err("invalid-operator", `Invalid argument to operation ${e.op}`, e.operand);
          return T.error;
        }
        return t;
      }
      case "Binary": return this.binary(e, scope);
      case "InstanceOf": {
        const t = this.expr(e.expr, scope);
        const target = this.resolveType(e.type, scope);
        if (t.tag === "prim") this.err("type-mismatch", `Incompatible conditional operand types ${typeToString(t)} and ${typeToString(target)}`, e);
        else if (target.tag === "prim") this.err("syntax", "Syntax error, insert \"Dimensions\" to complete ReferenceType", e.type);
        else if (!this.ts.isCastable(t, target)) this.err("type-mismatch", `Incompatible conditional operand types ${typeToString(t)} and ${typeToString(target)}`, e);
        return T.boolean;
      }
      case "Assign": return this.assign(e, scope);
      case "Conditional": return this.conditional(e, scope, expected);
      case "Cast": {
        const target = this.resolveType(e.type, scope);
        for (const b of e.bounds) this.resolveType(b, scope);
        const t = this.expr(e.expr, scope, target.tag === "class" ? target : undefined);
        if (!this.ts.isCastable(t, target)) this.err("invalid-cast", `Cannot cast from ${typeToString(t)} to ${typeToString(target)}`, e);
        else if (e.expr.constant !== undefined && target.tag === "prim" && t.tag === "prim") e.constant = convert(e.expr.constant, t.name, target.name);
        else if (e.expr.constant !== undefined && this.ts.isString(target) && typeof e.expr.constant === "string") e.constant = e.expr.constant;
        return target;
      }
      case "Lambda": {
        if (!expected) {
          this.err("syntax", "The target type of this expression must be a functional interface", e);
          this.lambdaBody(e, null, scope);
          return T.error;
        }
        return this.lambda(e, expected, scope);
      }
      case "MethodRef": {
        if (!expected) {
          this.err("syntax", "The target type of this expression must be a functional interface", e);
          return T.error;
        }
        return this.methodRef(e, expected, scope);
      }
      case "ClassLit": {
        const t = this.resolveType(e.type, scope);
        const arg = t.tag === "prim" ? this.ts.box(t) : t.tag === "void" ? this.lib.type("java.lang.Void") : t;
        return this.lib.type("java.lang.Class", [arg]);
      }
      case "Conversion": return this.conversion(e, scope);
      case "ErrorExpr": return T.error;
    }
  }

  private literalText(e: A.FloatLiteral): string {
    return String(e.value) + "f";
  }

  private intIndex(t: Type, at: A.Expression) {
    const p = this.ts.primOf(t);
    if (t.tag !== "error" && (!p || this.ts.unaryPromote(p).name !== "int")) this.mismatch(t, T.int, at);
  }

  // Names --------------------------------------------------------------------------------------------

  private lookupVar(name: string, scope: Scope): { sym: LocalSymbol } | (FoundField & { local?: undefined }) | null {
    let staticCtx = false;
    for (let s: Scope | null = scope; s; s = s.parent) {
      const v = s.vars?.get(name);
      if (v) return { sym: v };
      if (s.kind === "body" && s.ctx?.isStatic) staticCtx = true;
      if (s.kind === "class") {
        const f = this.findField(s.cls.thisType, name);
        if (f) return { field: f.field, ty: f.ty, cls: s.cls, staticCtx };
        if (!s.cls.isInner && !(s.cls.flags & (Flags.Local | Flags.Anonymous))) staticCtx = true;
      }
    }
    for (const imp of this.staticImports) {
      if (imp.name !== null && imp.name !== name) continue;
      const f = this.findField(classType(imp.cls), name);
      if (f && f.field.flags & Flags.Static) return { field: f.field, ty: f.ty, cls: imp.cls, staticCtx: true };
    }
    return null;
  }

  private identifier(e: A.Identifier, scope: Scope): Type {
    const found = this.lookupVar(e.name, scope);
    if (!found) {
      this.err("unresolved-name", `${e.name} cannot be resolved to a variable`, e);
      return T.error;
    }
    if ("sym" in found && found.sym) {
      e.sym = found.sym;
      if (found.sym.constant !== undefined) e.constant = found.sym.constant;
      return found.sym.type;
    }
    const f = found as FoundField;
    this.forceConstant(f.field);
    e.sym = f.field;
    if (!(f.field.flags & Flags.Static)) e.implicitThis = f.cls;
    if (!(f.field.flags & Flags.Static) && f.staticCtx) {
      this.err("static-reference", `Cannot make a static reference to the non-static field ${e.name}`, e);
    }
    if (f.field.constant !== undefined) e.constant = f.field.constant;
    return f.ty;
  }

  /**
   * Classify a qualifier: a value, a type (for static members) or a package. Names that are not
   * variables are tried as types, then as package prefixes.
   */
  private qualifier(e: A.Expression, scope: Scope, forCall = false): { kind: "value"; ty: Type } | { kind: "type"; sym: ClassSymbol } | { kind: "package"; name: string } {
    if (e.kind === "Identifier") {
      if (this.lookupVar(e.name, scope)) return { kind: "value", ty: this.expr(e, scope) };
      const t = this.lookupType(e.name, scope);
      if (t && t.kind === "class") {
        e.sym = t;
        return { kind: "type", sym: t };
      }
      if (this.lib.isPackagePrefix(e.name)) {
        e.sym = { kind: "package", name: e.name };
        return { kind: "package", name: e.name };
      }
      // ECJ's message, and Processing's rewrite of it for the receiver of a call.
      this.err("unresolved-name", forCall ? `Cannot find anything named "${e.name}"` : `${e.name} cannot be resolved to a variable`, e);
      e.ty = T.error;
      return { kind: "value", ty: T.error };
    }
    if (e.kind === "FieldAccess") {
      const q = this.qualifier(e.target, scope);
      if (q.kind === "package") {
        const full = `${q.name}.${e.name.text}`;
        const c = this.classByName(full);
        if (c) {
          e.sym = c;
          return { kind: "type", sym: c };
        }
        if (this.lib.isPackagePrefix(full)) {
          e.sym = { kind: "package", name: full };
          return { kind: "package", name: full };
        }
        this.err("unresolved-name", `${full} cannot be resolved`, e);
        e.ty = T.error;
        return { kind: "value", ty: T.error };
      }
      if (q.kind === "type") {
        const f = this.findField(classType(q.sym), e.name.text);
        if (!f) {
          const m = this.findMemberType(q.sym, e.name.text);
          if (m) {
            e.sym = m;
            return { kind: "type", sym: m };
          }
        }
      }
      return { kind: "value", ty: this.fieldAccessOn(e, q, scope) };
    }
    return { kind: "value", ty: this.expr(e, scope) };
  }

  private fieldAccess(e: A.FieldAccess, scope: Scope): Type {
    if (e.target.kind === "Super") return this.superField(e, scope);
    const q = this.qualifier(e.target, scope);
    if (q.kind === "package") {
      this.err("unresolved-name", `${q.name}.${e.name.text} cannot be resolved to a variable`, e);
      return T.error;
    }
    if (q.kind === "type") {
      // `Type.member` where member is not a field: a member type used as a value.
      const f = this.findField(classType(q.sym), e.name.text);
      if (!f && this.findMemberType(q.sym, e.name.text)) {
        this.err("unresolved-name", `${q.sym.displayName}.${e.name.text} cannot be resolved to a variable`, e);
        return T.error;
      }
    }
    return this.fieldAccessOn(e, q, scope);
  }

  private fieldAccessOn(e: A.FieldAccess, q: { kind: "value"; ty: Type } | { kind: "type"; sym: ClassSymbol }, scope: Scope): Type {
    const name = e.name.text;
    if (q.kind === "type") {
      const f = this.findField(classType(q.sym), name);
      if (!f) {
        this.err("unresolved-field", `${name} cannot be resolved or is not a field`, e.name);
        return T.error;
      }
      this.forceConstant(f.field);
      e.sym = f.field;
      if (!(f.field.flags & Flags.Static)) this.err("static-reference", `Cannot make a static reference to the non-static field ${q.sym.displayName}.${name}`, e);
      if (f.field.constant !== undefined) e.constant = f.field.constant;
      return f.ty;
    }
    const t = q.ty;
    if (t.tag === "error") return T.error;
    if (t.tag === "array") {
      if (name === "length") return T.int;
      this.err("unresolved-field", `${name} cannot be resolved or is not a field`, e.name);
      return T.error;
    }
    if (t.tag === "prim" || t.tag === "null" || t.tag === "void") {
      this.err("unresolved-field", `Cannot invoke ${name} on the ${t.tag === "prim" ? "primitive type " + t.name : typeToString(t)}`, e);
      return T.error;
    }
    if (t.tag === "class" && t.sym.isOpaque) return this.opaque(t.sym, e);
    const f = this.findField(t, name);
    if (!f) {
      this.err("unresolved-field", `${name} cannot be resolved or is not a field`, e.name);
      return T.error;
    }
    e.sym = f.field;
    if (f.field.constant !== undefined && f.field.flags & Flags.Static) e.constant = f.field.constant;
    return f.ty;
  }

  private superField(e: A.FieldAccess, scope: Scope): Type {
    const sup = e.target as A.SuperExpr;
    const cls = this.thisClass(sup, scope);
    if (!cls?.superclass) return T.error;
    sup.ty = cls.superclass;
    const f = this.findField(cls.superclass, e.name.text);
    if (!f) {
      this.err("unresolved-field", `${e.name.text} cannot be resolved or is not a field`, e.name);
      return T.error;
    }
    e.sym = f.field;
    return f.ty;
  }

  private opaque(c: ClassSymbol, at: { start: number; end: number }): Type {
    this.err("unsupported", `The type ${c.fullName.replace(/\$/g, ".")} is not available in processing-ts`, at);
    return T.error;
  }

  /** Class of `this`/`super`, qualified (`Outer.this`) or not; checks the static context. */
  private thisClass(e: A.ThisExpr | A.SuperExpr, scope: Scope): ClassSymbol | null {
    let target: ClassSymbol | null = scope.cls;
    if (e.qualifier) {
      const q = this.qualifier(e.qualifier, scope);
      if (q.kind !== "type") {
        this.err("syntax", `Illegal qualifier for ${e.kind === "This" ? "this" : "super"}`, e.qualifier);
        return null;
      }
      target = q.sym;
    }
    // Static context check: walk outward to the scope of `target`.
    for (let s: Scope | null = scope; s; s = s.parent) {
      if (s.kind === "body" && s.ctx?.isStatic) {
        this.err("static-reference", `Cannot use ${e.kind === "This" ? "this" : "super"} in a static context`, e);
        return null;
      }
      if (s.kind === "class") {
        if (s.cls === target) return target;
        if (!s.cls.isInner && !(s.cls.flags & (Flags.Local | Flags.Anonymous))) break;
      }
    }
    if (e.qualifier) {
      this.err("syntax", `No enclosing instance of the type ${target!.displayName} is accessible in scope`, e);
      return null;
    }
    return target;
  }

  private thisExpr(e: A.ThisExpr, scope: Scope): Type {
    const c = this.thisClass(e, scope);
    return c ? c.thisType : T.error;
  }

  // Operators ----------------------------------------------------------------------------------------

  private unary(e: A.Unary, scope: Scope): Type {
    const t = this.expr(e.operand, scope);
    if (t.tag === "error") return T.error;
    const p = this.ts.primOf(t);
    const bad = () => {
      this.err("invalid-operator", `The operator ${e.op} is undefined for the argument type(s) ${typeToString(t)}`, e);
      return T.error;
    };
    if (!p) return bad();
    let r: PrimType;
    if (e.op === "!") {
      if (p.name !== "boolean") return bad();
      r = T.boolean;
    } else if (e.op === "~") {
      if (p.name === "boolean" || p.name === "float" || p.name === "double") return bad();
      r = this.ts.unaryPromote(p);
    } else {
      if (p.name === "boolean") return bad();
      r = this.ts.unaryPromote(p);
    }
    const c = e.operand.constant;
    if (c !== undefined) {
      const v = e.op === "!" ? c : convert(c, p.name, r.name);
      if (v !== undefined) e.constant = foldUnary(e.op, v, r.name);
    }
    return r;
  }

  private binary(e: A.Binary, scope: Scope): Type {
    // Long chains of `+` are common (string building): check iteratively down the left spine.
    const lt = this.expr(e.left, scope);
    const rt = this.expr(e.right, scope);
    if (lt.tag === "error" || rt.tag === "error") return T.error;
    const op = e.op;
    const bad = () => {
      this.err("invalid-operator", `The operator ${op} is undefined for the argument type(s) ${typeToString(lt)}, ${typeToString(rt)}`, e);
      return T.error;
    };
    const lc = e.left.constant;
    const rc = e.right.constant;
    if (op === "+" && (this.ts.isString(lt) || this.ts.isString(rt))) {
      if (lt.tag === "void" || rt.tag === "void") return bad();
      if (lc !== undefined && rc !== undefined) {
        const a = constToString(lc, this.constKind(lt));
        const b = constToString(rc, this.constKind(rt));
        if (a !== undefined && b !== undefined) e.constant = a + b;
      }
      return this.ts.string;
    }
    const lp = this.ts.primOf(lt);
    const rp = this.ts.primOf(rt);
    switch (op) {
      case "*": case "/": case "%": case "+": case "-": {
        if (!lp || !rp || !isNumeric(lp) || !isNumeric(rp)) return bad();
        const r = this.ts.binaryPromote(lp, rp);
        this.fold(e, lc, rc, lp, rp, r, r.name);
        return r;
      }
      case "<<": case ">>": case ">>>": {
        if (!lp || !rp || !this.isIntegralPrim(lp) || !this.isIntegralPrim(rp)) return bad();
        const r = this.ts.unaryPromote(lp);
        if (lc !== undefined && rc !== undefined) {
          const a = convert(lc, lp.name, r.name);
          const b = convert(rc, rp.name, r.name === "long" ? "long" : "int");
          if (a !== undefined && b !== undefined) e.constant = foldBinary(op, a, b, r.name);
        }
        return r;
      }
      case "<": case ">": case "<=": case ">=": {
        if (!lp || !rp || !isNumeric(lp) || !isNumeric(rp)) return bad();
        const r = this.ts.binaryPromote(lp, rp);
        this.fold(e, lc, rc, lp, rp, r, r.name);
        return T.boolean;
      }
      case "==": case "!=": {
        if (lt.tag === "prim" || rt.tag === "prim") {
          if (lp && rp && isNumeric(lp) && isNumeric(rp)) {
            const r = this.ts.binaryPromote(lp, rp);
            this.fold(e, lc, rc, lp, rp, r, r.name);
            return T.boolean;
          }
          if (lp?.name === "boolean" && rp?.name === "boolean") {
            if (lc !== undefined && rc !== undefined) e.constant = foldBinary(op, lc, rc, "boolean");
            return T.boolean;
          }
          this.err("invalid-operator", `Incompatible operand types ${typeToString(lt)} and ${typeToString(rt)}`, e);
          return T.error;
        }
        if (!this.ts.isCastable(lt, rt) && !this.ts.isCastable(rt, lt)) {
          this.err("invalid-operator", `Incompatible operand types ${typeToString(lt)} and ${typeToString(rt)}`, e);
          return T.error;
        }
        if (lc !== undefined && rc !== undefined && typeof lc === "string" && typeof rc === "string") e.constant = op === "==" ? lc === rc : lc !== rc;
        return T.boolean;
      }
      case "&": case "|": case "^": {
        if (lp?.name === "boolean" && rp?.name === "boolean") {
          if (lc !== undefined && rc !== undefined) e.constant = foldBinary(op, lc, rc, "boolean");
          return T.boolean;
        }
        if (!lp || !rp || !this.isIntegralPrim(lp) || !this.isIntegralPrim(rp)) return bad();
        const r = this.ts.binaryPromote(lp, rp);
        this.fold(e, lc, rc, lp, rp, r, r.name);
        return r;
      }
      case "&&": case "||": {
        if (lp?.name !== "boolean" || rp?.name !== "boolean") return bad();
        if (lc !== undefined && rc !== undefined) e.constant = foldBinary(op, lc, rc, "boolean");
        return T.boolean;
      }
    }
    return bad();
  }

  private isIntegralPrim(p: PrimType): boolean {
    return p.name !== "boolean" && p.name !== "float" && p.name !== "double";
  }

  private constKind(t: Type): PrimName | "String" {
    return t.tag === "prim" ? t.name : "String";
  }

  private fold(e: A.Binary, lc: ConstValue | undefined, rc: ConstValue | undefined, lp: PrimType, rp: PrimType, r: PrimType, opType: PrimName) {
    if (lc === undefined || rc === undefined) return;
    const a = convert(lc, lp.name, r.name);
    const b = convert(rc, rp.name, r.name);
    if (a !== undefined && b !== undefined) e.constant = foldBinary(e.op, a, b, opType);
  }

  private requireVariable(e: A.Expression, scope: Scope): boolean {
    if (e.kind === "Identifier" || e.kind === "FieldAccess" || e.kind === "ArrayAccess") {
      const sym = e.kind === "ArrayAccess" ? null : e.sym;
      if (sym && sym.kind === "local" && sym.final) {
        this.err("final", `The final local variable ${sym.name} cannot be assigned`, e);
      } else if (sym && sym.kind === "field" && sym.flags & Flags.Final && !(sym.flags & Flags.Enum)) {
        // Blank finals may be assigned in constructors/initializers of their class.
        const ctx = scope.ctx;
        const inInit = ctx && ctx.cls === sym.owner && (ctx.isConstructor || ctx.method === null) && sym.decl && !sym.decl.init;
        if (!inInit) this.err("final", `The final field ${sym.owner.displayName}.${sym.name} cannot be assigned`, e);
      }
      if (e.kind === "FieldAccess" && e.target.kind === "Identifier" && e.sym === undefined && e.ty?.tag !== "error" && e.name.text === "length" && e.target.ty?.tag === "array") {
        this.err("final", "The final field array.length cannot be assigned", e);
      }
      return true;
    }
    if (e.kind !== "ErrorExpr") this.err("syntax", "The left-hand side of an assignment must be a variable", e);
    return false;
  }

  private assign(e: A.Assign, scope: Scope): Type {
    const target = this.expr(e.target, scope);
    if (!this.requireVariable(e.target, scope)) {
      this.expr(e.value, scope);
      return T.error;
    }
    if (e.op === "=") {
      if (e.value.kind === "ArrayInit") {
        this.err("syntax", "Array constants can only be used in initializers", e.value);
        return target;
      }
      const v = this.expr(e.value, scope, target);
      if (!this.ts.isAssignable(v, target, e.value.constant)) this.mismatch(v, target, e.value);
      return target;
    }
    const v = this.expr(e.value, scope);
    if (target.tag === "error" || v.tag === "error") return target;
    const op = e.op.slice(0, -1);
    if (op === "+" && this.ts.isString(target)) {
      if (v.tag === "void") this.err("invalid-operator", `The operator += is undefined for the argument type(s) String, void`, e);
      return target;
    }
    const tp = this.ts.primOf(target);
    const vp = this.ts.primOf(v);
    const ok =
      tp && vp &&
      ((op === "&" || op === "|" || op === "^") && tp.name === "boolean" && vp.name === "boolean" ||
        (op === "<<" || op === ">>" || op === ">>>" || op === "&" || op === "|" || op === "^") && this.isIntegralPrim(tp) && this.isIntegralPrim(vp) ||
        (op === "+" || op === "-" || op === "*" || op === "/" || op === "%") && isNumeric(tp) && isNumeric(vp));
    if (!ok) this.err("invalid-operator", `The operator ${e.op} is undefined for the argument type(s) ${typeToString(target)}, ${typeToString(v)}`, e);
    return target;
  }

  private conditional(e: A.Conditional, scope: Scope, expected?: Type): Type {
    this.condition(e.test, scope);
    const a = this.expr(e.consequent, scope, expected);
    const b = this.expr(e.alternate, scope, expected);
    if (a.tag === "error" || b.tag === "error") return T.error;
    let r: Type;
    const ap = this.ts.primOf(a);
    const bp = this.ts.primOf(b);
    if (sameType(a, b)) r = a;
    else if (ap && bp && isNumeric(ap) && isNumeric(bp)) {
      // Numeric conditional (JLS 15.25.2), boxed operands included: T and the box of T give T; an int
      // constant that fits the other operand's byte/short/char (or Byte/Short/Character) type keeps it.
      const fits = (c: ConstValue | undefined, t: PrimType, other: PrimType) => other.name === "int" && c !== undefined && this.ts.isAssignable(T.int, t, c);
      if (ap.name === bp.name) r = ap;
      else if (fits(e.alternate.constant, ap, bp) && (ap.name === "byte" || ap.name === "short" || ap.name === "char")) r = ap;
      else if (fits(e.consequent.constant, bp, ap) && (bp.name === "byte" || bp.name === "short" || bp.name === "char")) r = bp;
      else if ((ap.name === "byte" && bp.name === "short") || (ap.name === "short" && bp.name === "byte")) r = T.short;
      else r = this.ts.binaryPromote(ap, bp);
    } else if (ap?.name === "boolean" && bp?.name === "boolean") r = T.boolean;
    else if (a.tag === "null" && b.tag === "prim") r = this.ts.box(b);
    else if (b.tag === "null" && a.tag === "prim") r = this.ts.box(a);
    else {
      const ra = a.tag === "prim" ? this.ts.box(a) : a;
      const rb = b.tag === "prim" ? this.ts.box(b) : b;
      r = expected && isReference(expected) && this.ts.isAssignable(ra, expected) && this.ts.isAssignable(rb, expected) ? expected : this.ts.lub(ra, rb);
    }
    const t = e.test.constant;
    if (t !== undefined && e.consequent.constant !== undefined && e.alternate.constant !== undefined && r.tag === "prim") {
      const pick = t ? e.consequent : e.alternate;
      const from = pick.ty;
      if (from?.tag === "prim") e.constant = convert(pick.constant!, from.name, r.name);
    }
    return r;
  }

  private conversion(e: A.Conversion, scope: Scope): Type {
    const args = e.args.map((a) => this.arg(a, scope));
    const name = CONVERSIONS[e.type];
    const papplet = this.lib.get("processing.core.PApplet");
    const cands = name ? this.collectMethods(classType(papplet), name) : [];
    if (!cands.length) {
      this.err("unresolved-method", `The function ${e.type}(${argLabel(args)}) does not exist.`, e);
      return T.error;
    }
    const r = this.resolveOverload(cands, args, scope, null, e, e.type, "function", papplet);
    if (!r) return T.error;
    this.finishArgs(args, r, scope);
    const m = r.method.m;
    return substitute(m.ret, r.subst);
  }

  // Calls --------------------------------------------------------------------------------------------

  private arg(a: A.Expression, scope: Scope): Arg {
    if (a.kind === "Lambda" || a.kind === "MethodRef") return { node: a, ty: null };
    return { node: a, ty: this.expr(a, scope) };
  }

  private methodCall(e: A.MethodCall, scope: Scope, expected?: Type): Type {
    const name = e.name.text;
    let cands: { m: MethodSymbol; subst: Subst | null; raw: boolean }[] = [];
    let owner: ClassSymbol | null = null;
    let staticOnly = false;
    let staticCtx = false;
    let recvType: Type | null = null;
    if (e.target === null) {
      // Innermost class (lexically) with a method of that name.
      for (let s: Scope | null = scope; s; s = s.parent) {
        if (s.kind === "body" && s.ctx?.isStatic) staticCtx = true;
        if (s.kind !== "class") continue;
        const found = this.collectMethods(s.cls.thisType, name);
        if (found.length) {
          cands = found;
          owner = s.cls;
          recvType = s.cls.thisType;
          break;
        }
        if (!s.cls.isInner && !(s.cls.flags & (Flags.Local | Flags.Anonymous))) staticCtx = true;
      }
      if (!cands.length) {
        for (const imp of this.staticImports) {
          if (imp.name !== null && imp.name !== name) continue;
          const found = this.collectMethods(classType(imp.cls), name).filter((x) => x.m.flags & Flags.Static);
          if (found.length) {
            cands = found;
            owner = imp.cls;
            staticOnly = true;
            break;
          }
        }
      }
    } else if (e.target.kind === "Super") {
      const cls = this.thisClass(e.target, scope);
      const sup = cls?.superclass;
      if (cls && sup) {
        e.target.ty = sup;
        cands = this.collectMethods(sup, name);
        // Iface.super.m(): default method of a direct superinterface.
        if (e.target.qualifier && e.target.qualifier.kind !== "This") {
          const q = e.target.qualifier.kind === "Identifier" || e.target.qualifier.kind === "FieldAccess" ? e.target.qualifier.sym : undefined;
          if (q && q.kind === "class" && q.isInterface) cands = this.collectMethods(classType(q), name);
        }
        owner = sup.sym;
        recvType = sup;
      }
      if (!cls) {
        for (const a of e.args) this.arg(a, scope);
        return T.error;
      }
    } else {
      const q = this.qualifier(e.target, scope, true);
      if (q.kind === "package") {
        this.err("unresolved-name", `${q.name} cannot be resolved`, e.target);
        for (const a of e.args) this.arg(a, scope);
        return T.error;
      }
      if (q.kind === "type") {
        staticOnly = true;
        owner = q.sym;
        recvType = classType(q.sym);
        if (q.sym.isOpaque) {
          for (const a of e.args) this.arg(a, scope);
          return this.opaque(q.sym, e.target);
        }
        cands = this.collectMethods(recvType, name);
      } else {
        const t = q.ty;
        if (t.tag === "error") {
          for (const a of e.args) this.arg(a, scope);
          return T.error;
        }
        if (t.tag === "prim" || t.tag === "void" || t.tag === "null") {
          for (const a of e.args) this.arg(a, scope);
          this.err("invalid-call", `Cannot invoke ${name}(${argLabelOf(e.args)}) on the ${t.tag === "prim" ? "primitive type " + t.name : typeToString(t)}`, e);
          return T.error;
        }
        if (t.tag === "class" && t.sym.isOpaque) {
          for (const a of e.args) this.arg(a, scope);
          return this.opaque(t.sym, e.name);
        }
        recvType = t;
        owner = t.tag === "class" ? t.sym : t.tag === "tvar" || t.tag === "wild" ? (upperBound(t) as ClassType).sym ?? null : this.ts.object.sym;
        cands = this.collectMethods(t, name);
      }
    }
    const args = e.args.map((a) => this.arg(a, scope));
    if (!cands.length) {
      const lacking = recvType && this.unavailableIn(recvType, name);
      if (lacking) this.err("unsupported", `The method ${name}() of type ${lacking.displayName} is not available in processing-ts`, e.name);
      else this.err("unresolved-method", `The function ${name}(${argLabel(args)}) does not exist.`, e.name);
      this.argsWithoutTarget(args, scope);
      return T.error;
    }
    const r = this.resolveOverload(cands, args, scope, expected ?? null, e.name, name, "method", owner ?? cands[0].m.owner);
    if (!r) {
      this.argsWithoutTarget(args, scope);
      return T.error;
    }
    const m = r.method.m;
    e.method = m;
    if (r.varargs) e.varargsCall = true;
    if (e.target === null && !(m.flags & Flags.Static) && !staticOnly && owner) e.implicitThis = owner;
    this.thrown(m.throws, e.name, scope, (t) => substitute(r.method.raw ? erasure(t) : substitute(t, r.method.subst), r.subst));
    if (!(m.flags & Flags.Static)) {
      if (staticOnly) this.err("static-reference", `Cannot make a static reference to the non-static method ${methodLabel(name, m.params)} from the type ${(owner ?? m.owner).displayName}`, e.name);
      else if (staticCtx && e.target === null) this.err("static-reference", `Cannot make a static reference to the non-static method ${methodLabel(name, m.params)} from the type ${m.owner.displayName}`, e.name);
    }
    if (m.flags & Flags.Abstract && e.target?.kind === "Super") this.err("abstract", `Cannot directly invoke the abstract method ${methodLabel(name, m.params)} for the type ${m.owner.displayName}`, e.name);
    this.finishArgs(args, r, scope);
    let ret = substitute(r.method.raw ? erasure(m.ret) : substitute(m.ret, r.method.subst), r.subst);
    // getClass() is special: Class<? extends |T|>.
    if (name === "getClass" && m.params.length === 0 && recvType) ret = this.lib.type("java.lang.Class", [{ tag: "wild", bound: erasure(recvType), upper: true }]);
    return ret.tag === "wild" ? upperBound(ret) : ret;
  }

  /** The library class in `t`'s hierarchy that has a method `name` left out of the model. */
  private unavailableIn(t: Type, name: string): ClassSymbol | null {
    const seen = new Set<ClassSymbol>();
    const visit = (c: Type): ClassSymbol | null => {
      if (c.tag === "tvar" || c.tag === "wild") return visit(upperBound(c));
      if (c.tag !== "class" || seen.has(c.sym)) return null;
      seen.add(c.sym);
      if (c.sym.load().unavailableMethods?.has(name)) return c.sym;
      for (const s of directSupertypes(c)) {
        const r = visit(s);
        if (r) return r;
      }
      return null;
    };
    return visit(t);
  }

  /** Arguments that were not checked against a parameter (no method found): check lambdas loosely. */
  private argsWithoutTarget(args: Arg[], scope: Scope) {
    for (const a of args) if (a.ty === null && a.node.kind === "Lambda") this.lambdaBody(a.node, null, scope);
  }

  private newObject(e: A.NewObject, scope: Scope, expected?: Type): Type {
    let outerType: Type | null = null;
    if (e.outer) outerType = this.expr(e.outer, scope);
    let t: Type;
    if (e.outer && outerType?.tag === "class") {
      const m = this.findMemberType(outerType.sym, e.type.name.text);
      if (!m) {
        this.err("unresolved-type", `${outerType.sym.displayName}.${e.type.name.text} cannot be resolved to a type`, e.type);
        t = T.error;
      } else t = classType(m.load());
      e.type.resolved = t;
    } else t = this.resolveType(e.type, scope);
    const args = e.args.map((a) => this.arg(a, scope));
    if (t.tag !== "class") {
      if (t.tag === "tvar") this.err("syntax", `Cannot instantiate the type ${typeToString(t)}`, e.type);
      this.argsWithoutTarget(args, scope);
      if (e.body) this.anonymousBody(e, this.ts.object, scope);
      return T.error;
    }
    const sym = t.sym.load();
    if (sym.isOpaque) {
      this.argsWithoutTarget(args, scope);
      return this.opaque(sym, e.type);
    }
    // Diamond: infer the type arguments from the target type (or erase).
    const diamond = e.type.typeArgs !== null && e.type.typeArgs.length === 0;
    if (diamond) t = this.inferDiamond(sym, expected);
    if (sym.isEnum) {
      this.err("syntax", `Cannot instantiate the type ${sym.displayName}`, e.type);
      return T.error;
    }
    if (e.body) {
      // Anonymous class: an interface (no-arg) or a subclass.
      const anon = this.anonymousBody(e, t, scope, args);
      return anon ? t : T.error;
    }
    if (sym.isAbstract) {
      this.err("abstract", `Cannot instantiate the type ${sym.displayName}`, e.type);
      this.argsWithoutTarget(args, scope);
      return t;
    }
    this.checkEnclosingInstance(sym, e, scope);
    const cands = sym.constructors.map((m) => ({ m, subst: substOf(t as ClassType), raw: isRaw(t as ClassType) }));
    const r = this.resolveOverload(cands, args, scope, null, e.type, sym.displayName, "constructor", sym);
    if (r) {
      e.ctor = r.method.m;
      if (r.varargs) e.varargsCall = true;
      this.thrown(r.method.m.throws, e.type, scope);
      this.finishArgs(args, r, scope);
    } else this.argsWithoutTarget(args, scope);
    return t;
  }

  /** `new Inner()` needs an instance of the enclosing class. */
  private checkEnclosingInstance(sym: ClassSymbol, e: A.NewObject, scope: Scope) {
    if (!sym.isInner || !sym.isSource || e.outer || !sym.outer || sym.flags & Flags.Local) return;
    for (let s: Scope | null = scope; s; s = s.parent) {
      if (s.kind === "body" && s.ctx?.isStatic) break;
      if (s.kind === "class") {
        if (s.cls === sym.outer || this.ts.isSubtype(s.cls.thisType, classType(sym.outer))) return;
        if (!s.cls.isInner && !(s.cls.flags & (Flags.Local | Flags.Anonymous))) break;
      }
    }
    const o = sym.outer.displayName;
    this.err("static-reference", `No enclosing instance of type ${o} is accessible. Must qualify the allocation with an enclosing instance of type ${o} (e.g. x.new A() where x is an instance of ${o}).`, e);
  }

  private inferDiamond(sym: ClassSymbol, expected?: Type): ClassType {
    const params = sym.typeParams;
    if (!params.length) return classType(sym);
    if (expected && expected.tag === "class") {
      const sup = asSuper(sym.thisType, expected.sym);
      if (sup && expected.args.length) {
        const bounds = new Map<TypeVarSymbol, InferBounds>();
        this.unify(sup, expected, bounds, params, "lower");
        const value = (p: TypeVarSymbol) => bounds.get(p)?.eq ?? bounds.get(p)?.lower[0] ?? null;
        if (params.every((p) => value(p))) return classType(sym, params.map((p) => upperBoundArg(value(p)!)));
      }
    }
    return classType(sym); // raw: assignable anywhere with an unchecked conversion
  }

  private anonymousBody(e: A.NewObject, base: Type, scope: Scope, args: Arg[] = []): ClassSymbol | null {
    const anon = new ClassSymbol(`${scope.cls.fullName}$${++this.anonCount}`, "", Flags.Source | Flags.Anonymous | Flags.Final | (scope.ctx?.isStatic ? Flags.Static : Flags.Inner));
    anon.outer = scope.cls;
    anon.decl = e;
    e.anonymous = anon;
    if (base.tag === "class") {
      const sym = base.sym.load();
      if (sym.isInterface) {
        anon.superclass = this.ts.object;
        anon.interfaces = [base];
        if (args.length) this.err("syntax", `Anonymous classes cannot have arguments when they implement an interface`, e);
      } else {
        anon.superclass = base;
        if (sym.flags & Flags.Final) this.err("type-mismatch", `An anonymous class cannot subclass the final class ${sym.displayName}`, e.type);
        const cands = sym.constructors.map((m) => ({ m, subst: substOf(base), raw: isRaw(base) }));
        const r = this.resolveOverload(cands, args, scope, null, e.type, sym.displayName, "constructor", sym);
        if (r) {
          e.ctor = r.method.m;
          if (r.varargs) e.varargsCall = true;
          this.finishArgs(args, r, scope);
        }
      }
    } else anon.superclass = this.ts.object;
    this.declareMembers(anon, e.body ?? []);
    const cs = this.classScope(anon, scope);
    for (const m of anon.memberTypes.values()) this.resolveHeaders(m, cs);
    this.enterMembers(anon, cs);
    for (const m of anon.memberTypes.values()) this.enterAllMembers(m, cs);
    this.checkClass(anon, scope);
    return anon;
  }

  // Overload resolution -----------------------------------------------------------------------------

  /**
   * JLS 15.12.2, simplified: phase 1 (no boxing, no varargs), phase 2 (boxing), phase 3 (varargs); among
   * applicable methods the most specific wins. Generic methods get their type arguments by unifying
   * parameter types with argument types (and the return type with the expected type).
   */
  private resolveOverload(
    cands: { m: MethodSymbol; subst: Subst | null; raw: boolean }[], args: Arg[], scope: Scope, expected: Type | null,
    at: { start: number; end: number }, name: string, what: "method" | "constructor" | "function", owner: ClassSymbol,
  ): Resolved<{ m: MethodSymbol; subst: Subst | null; raw: boolean }> | null {
    if (args.some((a) => a.ty?.tag === "error")) {
      // An argument already failed: pick by arity silently to keep checking lambdas.
      const byArity = cands.find((c) => c.m.params.length === args.length) ?? cands[0];
      return byArity ? { method: byArity, subst: this.instantiate(byArity, args, null), varargs: false } : null;
    }
    for (const phase of [1, 2, 3] as const) {
      const applicable: { c: (typeof cands)[number]; subst: Subst | null }[] = [];
      for (const c of cands) {
        const n = c.m.params.length;
        const varargs = (c.m.flags & Flags.Varargs) !== 0;
        if (phase < 3 ? n !== args.length : !varargs || args.length < n - 1) continue;
        const subst = this.instantiate(c, args, phase === 3 ? "varargs" : null, expected);
        const params = this.paramTypes(c, subst, args.length, phase === 3);
        if (args.every((a, i) => this.argApplicable(a, params[i], phase >= 2))) applicable.push({ c, subst });
      }
      if (!applicable.length) continue;
      const best = this.mostSpecific(applicable, args.length, phase === 3);
      if (!best) {
        this.err("ambiguous", `The ${what === "constructor" ? "constructor" : "method"} ${methodLabel(what === "constructor" ? owner.displayName : name, this.paramTypes(applicable[0].c, applicable[0].subst, args.length, false))} is ambiguous for the type ${owner.displayName}`, at);
        return { method: applicable[0].c, subst: applicable[0].subst, varargs: phase === 3 };
      }
      return { method: best.c, subst: best.subst, varargs: phase === 3 };
    }
    // Not applicable: name the closest candidate the way ECJ does.
    const view = (c: (typeof cands)[number]) => c.m.params.map((p) => (c.raw ? erasure(p) : substitute(p, c.subst)));
    const shown = closestCandidate(cands, view, args.map((a) => a.ty));
    const params = view(shown);
    if (what === "constructor") {
      this.err("not-applicable", `The constructor ${owner.displayName}(${argLabel(args)}) is undefined`, at);
    } else if (what === "function") {
      this.err("not-applicable", `The function ${name}(${argLabel(args)}) does not exist.`, at);
    } else {
      // The declaring class as seen from the receiver: "ArrayList<Sketch.Ball>".
      const owner = shown.m.owner;
      const ownerType = shown.subst && !shown.raw && owner.typeParams.length ? classType(owner, owner.typeParams.map((p) => shown.subst!.get(p) ?? { tag: "tvar" as const, sym: p })) : classType(owner);
      this.err("not-applicable", `The method ${methodLabel(name, params, (shown.m.flags & Flags.Varargs) !== 0)} in the type ${typeToString(ownerType)} is not applicable for the arguments (${argLabel(args)})`, at);
    }
    return null;
  }

  /** Parameter types of a candidate for `n` arguments (expanding the varargs parameter). */
  private paramTypes(c: { m: MethodSymbol; subst: Subst | null; raw: boolean }, subst: Subst | null, n: number, varargs: boolean): Type[] {
    const view = (t: Type) => {
      let x = c.raw ? erasure(t) : substitute(t, c.subst);
      if (subst) x = substitute(x, subst);
      return x;
    };
    const ps = c.m.params.map(view);
    if (!varargs) return ps;
    const last = ps[ps.length - 1];
    const elem = last && last.tag === "array" ? last.elem : T.error;
    const out = ps.slice(0, -1);
    while (out.length < n) out.push(elem);
    return out;
  }

  private argApplicable(a: Arg, p: Type, loose: boolean): boolean {
    if (a.ty === null) {
      // Lambdas and method references: the parameter must be a functional interface of matching arity.
      const fn = this.functionType(p.tag === "tvar" ? upperBound(p) : p);
      if (!fn) return p.tag === "tvar";
      if (a.node.kind === "Lambda") return fn.params.length === a.node.params.length;
      return true;
    }
    return this.ts.isInvocationConvertible(a.ty, p, loose);
  }

  private mostSpecific<X extends { c: { m: MethodSymbol; subst: Subst | null; raw: boolean }; subst: Subst | null }>(list: X[], n: number, varargs: boolean): X | null {
    if (list.length === 1) return list[0];
    const types = list.map((x) => this.paramTypes(x.c, x.subst, n, varargs));
    const moreSpecific = (i: number, j: number) => types[i].every((p, k) => this.specificSubtype(p, types[j][k]));
    const maximal = list.filter((_, i) => list.every((__, j) => i === j || moreSpecific(i, j)));
    if (maximal.length === 1) return maximal[0];
    if (maximal.length > 1) {
      // Same signature inherited along different paths: prefer a concrete method.
      const concrete = maximal.filter((x) => !(x.c.m.flags & Flags.Abstract));
      return concrete[0] ?? maximal[0];
    }
    return null;
  }

  /** Subtyping for "more specific": primitive widening counts (int is more specific than float). */
  private specificSubtype(a: Type, b: Type): boolean {
    if (a.tag === "prim" && b.tag === "prim") return a.name === b.name || this.ts.isPrimWidening(a.name, b.name);
    if (a.tag === "prim" || b.tag === "prim") return false;
    return this.ts.isSubtype(a, b);
  }

  /** Type arguments of a generic method from the arguments (and the expected return type). */
  private instantiate(c: { m: MethodSymbol; subst: Subst | null; raw: boolean }, args: Arg[], mode: "varargs" | null, expected?: Type | null): Subst | null {
    const tps = c.m.typeParams;
    if (!tps.length || c.raw) return null;
    const bounds = new Map<TypeVarSymbol, InferBounds>();
    const params = c.m.params.map((p) => substitute(p, c.subst));
    args.forEach((a, i) => {
      if (!a.ty) return;
      let p = params[Math.min(i, params.length - 1)];
      if (!p) return;
      if (mode === "varargs" && i >= params.length - 1 && p.tag === "array") p = p.elem;
      const at = a.ty.tag === "prim" ? (p.tag === "tvar" ? this.ts.box(a.ty) : a.ty) : a.ty;
      this.unify(p, at, bounds, tps, "lower");
    });
    if (expected && expected.tag !== "void") this.unify(substitute(c.m.ret, c.subst), expected, bounds, tps, "expected");
    // An equality (invariant type argument) decides; then the arguments' types (their lub); then the
    // assignment context; then a `? super T` bound; else the declared bound.
    const map: Subst = new Map();
    for (const tp of tps) {
      const b = bounds.get(tp);
      const lower = b?.lower.reduce<Type | null>((acc, t) => (acc === null || sameType(acc, t) ? t : this.ts.lub(acc, t)), null) ?? null;
      map.set(tp, b?.eq ?? lower ?? b?.expected ?? b?.upper[0] ?? (tp.bounds.length ? substitute(erasure(tp.bounds[0]), null) : this.ts.object));
    }
    return map;
  }

  /**
   * Collect bounds on the type variables `vars` from `p` (a parameter or return type) against `a`:
   * "lower" where a must be a subtype of p (an argument, `? extends T`), "upper" for `? super T`, "eq"
   * inside an invariant type argument (`List<T>` against `ArrayList<String>`), "expected" from the
   * assignment context (return type against the target type).
   */
  private unify(p: Type, a: Type, bounds: Map<TypeVarSymbol, InferBounds>, vars: TypeVarSymbol[], kind: "lower" | "upper" | "eq" | "expected"): void {
    if (p.tag === "tvar" && vars.includes(p.sym)) {
      if (a.tag === "null" || a.tag === "error" || a.tag === "void") return;
      const val = a.tag === "prim" ? this.ts.box(a) : a;
      let b = bounds.get(p.sym);
      if (!b) bounds.set(p.sym, (b = { eq: null, lower: [], upper: [], expected: null }));
      if (kind === "eq") b.eq ??= val;
      else if (kind === "lower") b.lower.push(val);
      else if (kind === "upper") b.upper.push(val);
      else b.expected ??= val;
      return;
    }
    if (p.tag === "wild") {
      if (!p.bound) return;
      const aa = a.tag === "wild" ? upperBound(a) : a;
      this.unify(p.bound, aa, bounds, vars, kind === "expected" ? kind : p.upper ? "lower" : "upper");
      return;
    }
    if (p.tag === "array" && a.tag === "array") {
      this.unify(p.elem, a.elem, bounds, vars, kind);
      return;
    }
    if (p.tag === "class" && p.args.length) {
      if (kind === "expected") {
        const sup = a.tag === "class" ? asSuper(p, a.sym) && a : null;
        if (!sup || sup.tag !== "class") return;
        const ps = asSuper(p, sup.sym);
        if (ps) ps.args.forEach((x, i) => sup.args[i] && this.unify(x, upperBoundArg(sup.args[i]), bounds, vars, "expected"));
        return;
      }
      const sup = asSuper(a, p.sym);
      if (!sup) return;
      p.args.forEach((x, i) => sup.args[i] && this.unify(x, sup.args[i].tag === "wild" ? upperBound(sup.args[i]) : sup.args[i], bounds, vars, x.tag === "wild" ? "lower" : "eq"));
    }
  }

  /** After choosing a method: check lambdas and method references against their parameter types. */
  private finishArgs(args: Arg[], r: Resolved<{ m: MethodSymbol; subst: Subst | null; raw: boolean }>, scope: Scope) {
    const params = this.paramTypes(r.method, r.subst, args.length, r.varargs);
    args.forEach((a, i) => {
      if (a.ty !== null) return;
      const p = params[i] ?? T.error;
      if (a.node.kind === "Lambda") a.node.ty = this.lambda(a.node, p, scope);
      else if (a.node.kind === "MethodRef") a.node.ty = this.methodRef(a.node, p, scope);
    });
  }

  // Lambdas and method references --------------------------------------------------------------------

  private lambda(e: A.Lambda, target: Type, scope: Scope): Type {
    const t = target.tag === "tvar" ? upperBound(target) : target;
    const fn = this.functionType(t);
    if (!fn) {
      if (t.tag !== "error") this.err("syntax", `The target type of this expression must be a functional interface`, e);
      this.lambdaBody(e, null, scope);
      return T.error;
    }
    if (fn.params.length !== e.params.length) {
      this.err("type-mismatch", `Lambda expression's signature does not match the signature of the functional interface method ${methodLabel(fn.m.name, fn.params)}`, e);
      this.lambdaBody(e, null, scope);
      return T.error;
    }
    e.sam = fn.m;
    this.lambdaBody(e, fn, scope);
    return t;
  }

  private lambdaBody(e: A.Lambda, fn: { params: Type[]; ret: Type; throws: Type[] } | null, scope: Scope) {
    const ctx: Ctx = {
      cls: scope.cls, method: scope.ctx?.method ?? null, returnType: fn ? fn.ret : T.error, isStatic: scope.ctx?.isStatic ?? false,
      isConstructor: false, lambda: true, targets: [], throws: fn ? fn.throws : [this.ts.throwable], handlers: [],
    };
    const ls = new Scope(scope, "body", scope.cls, ctx);
    e.params.forEach((p, i) => {
      const declared = p.type ? this.withDims(this.resolveType(p.type, scope), p.dims) : null;
      const ty = declared ?? fn?.params[i] ?? T.error;
      if (declared && fn && !sameType(declared, fn.params[i]) && fn.params[i].tag !== "error") {
        this.err("type-mismatch", `Lambda expression's parameter ${p.name.text} is expected to be of type ${typeToString(fn.params[i])}`, p);
      }
      const v: LocalSymbol = { kind: "local", name: p.name.text, type: ty, final: false, role: "lambda", decl: p, classDepth: depthOf(scope.cls) };
      this.declareLocal(v, ls, p.name);
      p.sym = v;
    });
    if (e.body.kind === "Block") {
      this.blockBody(e.body, ls);
      if (fn && fn.ret.tag !== "void" && fn.ret.tag !== "error") {
        const { completes, unreachable } = checkFlow(e.body);
        for (const u of unreachable) this.err("unreachable", "Unreachable code", u);
        if (completes) this.err("missing-return", `This method must return a result of type ${typeToString(fn.ret)}`, e);
      }
    } else {
      const ret = fn?.ret ?? T.error;
      const t = this.expr(e.body, ls, ret.tag === "void" ? undefined : ret);
      if (ret.tag === "void") {
        if (!isStatementExpression(e.body) && t.tag !== "error") this.err("type-mismatch", "Void methods cannot return a value", e.body);
      } else if (!this.ts.isAssignable(t, ret, e.body.constant)) this.mismatch(t, ret, e.body);
    }
  }

  private methodRef(e: A.MethodRef, target: Type, scope: Scope): Type {
    const fn = this.functionType(target.tag === "tvar" ? upperBound(target) : target);
    if (!fn) {
      if (target.tag !== "error") this.err("syntax", `The target type of this expression must be a functional interface`, e);
      return T.error;
    }
    const name = e.name.text;
    const fakeArgs = (types: Type[]): Arg[] => types.map((ty) => ({ node: e as unknown as A.Expression, ty }));
    let found: { m: MethodSymbol; ret: Type } | null = null;
    const tryResolve = (recv: Type, params: Type[], staticOnly: boolean | null) => {
      const cands = name === "new" && recv.tag === "class"
        ? recv.sym.load().constructors.map((m) => ({ m, subst: substOf(recv), raw: isRaw(recv) }))
        : this.collectMethods(recv, name).filter((c) => staticOnly === null || ((c.m.flags & Flags.Static) !== 0) === staticOnly);
      if (!cands.length) return null;
      const before = this.diags.length;
      const r = this.resolveOverload(cands, fakeArgs(params), scope, null, e, name, name === "new" ? "constructor" : "method", recv.tag === "class" ? recv.sym : this.ts.object.sym);
      this.diags.length = before;
      if (!r) return null;
      const m = r.method.m;
      return { m, ret: name === "new" ? recv : substitute(r.method.raw ? erasure(m.ret) : substitute(m.ret, r.method.subst), r.subst) };
    };
    const tgt = e.target;
    const isType = tgt.kind === "PrimitiveType" || tgt.kind === "ClassType" || tgt.kind === "ArrayType" || tgt.kind === "VarType" || tgt.kind === "VoidType";
    if (isType || (tgt.kind === "Identifier" && !this.lookupVar(tgt.name, scope) && this.lookupType(tgt.name, scope))) {
      const recv = isType ? this.resolveType(tgt as A.TypeNode, scope) : classType((this.lookupType((tgt as A.Identifier).name, scope) as ClassSymbol).load());
      if (!isType) (tgt as A.Identifier).sym = (recv as ClassType).sym;
      if (recv.tag === "error") return T.error;
      // Type::staticMethod(args) or Type::instanceMethod with the first parameter as receiver.
      found = tryResolve(recv, fn.params, name === "new" ? null : true);
      if (!found && fn.params.length && name !== "new") found = tryResolve(recv, fn.params.slice(1), false);
    } else {
      const recv = tgt.kind === "Super" ? (this.thisClass(tgt, scope)?.superclass ?? T.error) : this.expr(tgt as A.Expression, scope);
      if (recv.tag === "error") return T.error;
      found = tryResolve(recv, fn.params, null);
    }
    if (!found) {
      this.err("unresolved-method", `The type of ${name}(${fn.params.map(typeToString).join(", ")}) is not compatible with the functional interface method`, e);
      return T.error;
    }
    e.method = found.m;
    if (fn.ret.tag !== "void" && !this.ts.isAssignable(found.ret, fn.ret)) this.mismatch(found.ret, fn.ret, e);
    return target;
  }
}

/**
 * The candidate ECJ names in "The method m(...) in the type T is not applicable for the arguments (...)"
 * (observed behavior): one point per argument whose type equals the parameter at the same position or
 * the one before; the most points wins; on a tie, the smaller difference in the number of parameters
 * (extra parameters count double); then the first in declaration order.
 */
function closestCandidate<C>(cands: C[], params: (c: C) => Type[], args: (Type | null)[]): C {
  let best = cands[0];
  let bestScore = -1;
  let bestDiff = Infinity;
  const diffOf = (n: number) => (n > args.length ? 2 * (n - args.length) : args.length - n);
  for (const c of cands) {
    const ps = params(c);
    let score = 0;
    args.forEach((a, i) => {
      if (!a) return;
      for (let p = Math.max(0, i - 1); p < ps.length && p <= i; p++) {
        if (sameType(ps[p], a)) {
          score++;
          return;
        }
      }
    });
    const diff = diffOf(ps.length);
    if (score > bestScore || (score === bestScore && diff < bestDiff)) {
      best = c;
      bestScore = score;
      bestDiff = diff;
    }
  }
  return best;
}

function upperBoundArg(t: Type): Type {
  return t.tag === "wild" ? (t.bound && t.upper ? t.bound : t) : t;
}

function argLabelOf(args: A.Expression[]): string {
  return args.map((a) => (a.ty ? typeToString(a.ty) : "?")).join(", ");
}
