// Types of the checker and the symbols they refer to.
//
// Types are plain objects compared structurally (`sameType`). Primitive, void, null and error types are
// singletons. Generic class types carry their arguments; a generic class used without arguments is a
// raw type. The error type is compatible with everything so one mistake produces one diagnostic.
import type * as A from "./ast.ts";

export type PrimName = "boolean" | "byte" | "short" | "char" | "int" | "long" | "float" | "double";

export interface PrimType { tag: "prim"; name: PrimName }
export interface VoidType { tag: "void" }
export interface NullType { tag: "null" }
export interface ErrorType { tag: "error" }
/**
 * `outer` is the parameterization of the enclosing class for an inner class of a generic class
 * (`Tree<Integer>.Node`): the inner class's members may use the outer type variables.
 */
export interface ClassType { tag: "class"; sym: ClassSymbol; args: readonly Type[]; outer?: ClassType }
export interface ArrayType { tag: "array"; elem: Type }
export interface TypeVar { tag: "tvar"; sym: TypeVarSymbol }
/** Only as a type argument. */
export interface Wildcard { tag: "wild"; bound: Type | null; upper: boolean }

export type Type = PrimType | VoidType | NullType | ErrorType | ClassType | ArrayType | TypeVar | Wildcard;
export type RefType = ClassType | ArrayType | TypeVar | NullType;

const prim = (name: PrimName): PrimType => ({ tag: "prim", name });
export const T = {
  boolean: prim("boolean"), byte: prim("byte"), short: prim("short"), char: prim("char"),
  int: prim("int"), long: prim("long"), float: prim("float"), double: prim("double"),
  void: { tag: "void" } as VoidType,
  null: { tag: "null" } as NullType,
  error: { tag: "error" } as ErrorType,
} as const;

export function primType(name: PrimName): PrimType {
  return T[name];
}

// ---------------------------------------------------------------------------------------------------
// Symbols

export const Flags = {
  Static: 1, Final: 2, Abstract: 4, Interface: 8, Enum: 16, Protected: 32, Varargs: 64, Default: 128, Annotation: 256,
  /** Declared in the sketch (source), not the library. */
  Source: 1 << 10,
  Private: 1 << 11,
  /** Inner (non-static nested) class: has an enclosing instance. */
  Inner: 1 << 12,
  Local: 1 << 13,
  Anonymous: 1 << 14,
  /** Library class referenced by a signature but not part of the model: no members. */
  Opaque: 1 << 15,
  /** Package (default) access: not public, protected or private. */
  Package: 1 << 16,
  /** Library class that is not public (only present as a supertype, e.g. AbstractStringBuilder). */
  NonPublic: 512,
  /** Java mode: a top-level class of the sketch's file other than the sketch class (kept as a static member). */
  TopLevel: 1 << 17,
} as const;

export interface TypeVarSymbol {
  kind: "tvar";
  name: string;
  /** Upper bounds; empty means Object. Filled lazily for library type parameters. */
  bounds: Type[];
  /** Declaring class or method (for messages). */
  owner: string;
}

export interface FieldSymbol {
  kind: "field";
  name: string;
  type: Type;
  flags: number;
  owner: ClassSymbol;
  /** Compile-time constant value (static final primitives/Strings, and source constants once checked). */
  constant?: ConstValue;
  decl?: A.VarDeclarator;
}

export interface MethodSymbol {
  kind: "method";
  /** "<init>" for constructors. */
  name: string;
  typeParams: TypeVarSymbol[];
  params: Type[];
  ret: Type;
  flags: number;
  owner: ClassSymbol;
  decl?: A.MethodDecl | A.ConstructorDecl;
  /** Parameter names (source methods only; for messages and code generation). */
  paramNames?: string[];
  /** Declared exceptions (`throws`); absent when none. */
  throws?: Type[];
}

export interface LocalSymbol {
  kind: "local";
  name: string;
  type: Type;
  final: boolean;
  /** Parameter, catch parameter, for-each variable, lambda parameter or local variable. */
  role: "param" | "local" | "catch" | "lambda" | "foreach" | "resource";
  decl: A.Node;
  constant?: ConstValue;
  /** Depth of the class that declares it (to detect captures by local/anonymous classes and lambdas). */
  classDepth: number;
}

export type ConstValue = number | boolean | string;

/**
 * A class, interface or enum, from the library or the sketch. Library members are materialized on
 * first use (`load`).
 */
export class ClassSymbol {
  readonly kind = "class";
  /** Binary name, e.g. "java.util.Map$Entry", "processing.core.PApplet", "Sketch$Ball". */
  readonly fullName: string;
  /** Simple name, e.g. "Entry". */
  readonly name: string;
  flags: number;
  typeParams: TypeVarSymbol[] = [];
  superclass: ClassType | null = null;
  interfaces: ClassType[] = [];
  /** Lexically enclosing class for nested, inner, local and anonymous classes. */
  outer: ClassSymbol | null = null;
  fields = new Map<string, FieldSymbol>();
  methods = new Map<string, MethodSymbol[]>();
  constructors: MethodSymbol[] = [];
  /** Member types by simple name. */
  memberTypes = new Map<string, ClassSymbol>();
  /** Library methods that exist in Java but are not part of the model (not usable in processing-ts). */
  unavailableMethods: Set<string> | null = null;
  decl?: A.ClassDecl | A.InterfaceDecl | A.EnumDecl | A.NewObject;
  /** Set by the library loader: materializes header and members on first access. */
  loader: ((c: ClassSymbol) => void) | null = null;
  private loaded = false;

  constructor(fullName: string, name: string, flags: number) {
    this.fullName = fullName;
    this.name = name;
    this.flags = flags;
  }

  /** Make sure header and members are available (library classes are loaded lazily). */
  load(): this {
    if (!this.loaded) {
      this.loaded = true;
      this.loader?.(this);
    }
    return this;
  }

  get isInterface(): boolean { return (this.flags & Flags.Interface) !== 0; }
  get isEnum(): boolean { return (this.flags & Flags.Enum) !== 0; }
  get isAbstract(): boolean { return (this.flags & (Flags.Abstract | Flags.Interface)) !== 0; }
  get isSource(): boolean { return (this.flags & Flags.Source) !== 0; }
  get isOpaque(): boolean { return (this.flags & Flags.Opaque) !== 0; }
  get isInner(): boolean { return (this.flags & Flags.Inner) !== 0; }

  /** Name as ECJ prints it in messages: "Map.Entry", "PVector", "Sketch.Ball" (member classes of the sketch are qualified). */
  get displayName(): string {
    return this.outer && !(this.flags & (Flags.Local | Flags.Anonymous | Flags.TopLevel)) ? `${this.outer.displayName}.${this.name}` : this.name;
  }

  /** The class generated for the sketch itself. */
  isSketch = false;

  /** This class as a type with its own type variables as arguments. */
  get thisType(): ClassType {
    this.load();
    return { tag: "class", sym: this, args: this.typeParams.map((p) => ({ tag: "tvar", sym: p }) as TypeVar) };
  }

  addMethod(m: MethodSymbol) {
    const list = this.methods.get(m.name);
    if (list) list.push(m);
    else this.methods.set(m.name, [m]);
  }
}

export function classType(sym: ClassSymbol, args: readonly Type[] = []): ClassType {
  return { tag: "class", sym, args };
}

// ---------------------------------------------------------------------------------------------------
// Predicates and display

export const isPrim = (t: Type): t is PrimType => t.tag === "prim";
export const isNumeric = (t: Type): t is PrimType => t.tag === "prim" && t.name !== "boolean";
export const isIntegral = (t: Type): t is PrimType => t.tag === "prim" && (t.name === "int" || t.name === "long" || t.name === "short" || t.name === "byte" || t.name === "char");
export const isReference = (t: Type): t is RefType => t.tag === "class" || t.tag === "array" || t.tag === "tvar" || t.tag === "null";
export const isError = (t: Type) => t.tag === "error";

export function typeToString(t: Type): string {
  switch (t.tag) {
    case "prim": return t.name;
    case "void": return "void";
    case "null": return "null";
    case "error": return "<error>";
    case "array": return typeToString(t.elem) + "[]";
    case "tvar": return t.sym.name;
    case "wild": return t.bound ? `? ${t.upper ? "extends" : "super"} ${typeToString(t.bound)}` : "?";
    case "class": {
      const name = t.outer?.args.length ? `${typeToString(t.outer)}.${t.sym.name}` : t.sym.displayName;
      return t.args.length ? `${name}<${t.args.map(typeToString).join(",")}>` : name;
    }
  }
}

export function sameType(a: Type, b: Type): boolean {
  if (a === b) return true;
  if (a.tag !== b.tag) return false;
  switch (a.tag) {
    case "prim": return a.name === (b as PrimType).name;
    case "array": return sameType(a.elem, (b as ArrayType).elem);
    case "tvar": return a.sym === (b as TypeVar).sym;
    case "wild": {
      const w = b as Wildcard;
      return a.upper === w.upper && (a.bound === null ? w.bound === null : w.bound !== null && sameType(a.bound, w.bound));
    }
    case "class": {
      const c = b as ClassType;
      return a.sym === c.sym && a.args.length === c.args.length && a.args.every((x, i) => sameType(x, c.args[i]));
    }
    default: return true;
  }
}

// ---------------------------------------------------------------------------------------------------
// Substitution and erasure

export type Subst = Map<TypeVarSymbol, Type>;

export function substitute(t: Type, s: Subst | null): Type {
  if (!s || s.size === 0) return t;
  switch (t.tag) {
    case "tvar": return s.get(t.sym) ?? t;
    case "array": {
      const e = substitute(t.elem, s);
      return e === t.elem ? t : { tag: "array", elem: e };
    }
    case "class": {
      if (!t.args.length && !t.outer) return t;
      const r: ClassType = { tag: "class", sym: t.sym, args: t.args.map((a) => substitute(a, s)) };
      if (t.outer) r.outer = substitute(t.outer, s) as ClassType;
      return r;
    }
    case "wild": return t.bound ? { tag: "wild", bound: substitute(t.bound, s), upper: t.upper } : t;
    default: return t;
  }
}

/** Substitution that maps the class's type parameters to the arguments of `t` (none for raw types). */
export function substOf(t: ClassType): Subst | null {
  const params = t.sym.load().typeParams;
  const outer = t.outer ? substOf(t.outer) : null;
  if (!params.length || t.args.length !== params.length) return outer;
  const s: Subst = new Map(outer ?? []);
  params.forEach((p, i) => s.set(p, t.args[i]));
  return s;
}

export function isRaw(t: ClassType): boolean {
  return t.args.length === 0 && t.sym.load().typeParams.length > 0;
}

export function erasure(t: Type): Type {
  switch (t.tag) {
    case "tvar": return t.sym.bounds.length ? erasure(t.sym.bounds[0]) : objectTypeOf(t.sym);
    case "array": return { tag: "array", elem: erasure(t.elem) };
    case "class": return t.args.length || t.outer ? { tag: "class", sym: t.sym, args: [] } : t;
    case "wild": return t.bound && t.upper ? erasure(t.bound) : T.error;
    default: return t;
  }
}

// java.lang.Object is needed by erasure of unbounded type variables; the library registers it.
let OBJECT: ClassType | null = null;
export function setObjectType(t: ClassType) {
  OBJECT = t;
}
function objectTypeOf(_: TypeVarSymbol): Type {
  return OBJECT ?? T.error;
}

/** Upper bound used when reading through a type: wildcards and type variables become their bounds. */
export function upperBound(t: Type): Type {
  if (t.tag === "wild") return t.bound && t.upper ? t.bound : OBJECT ?? T.error;
  if (t.tag === "tvar") return t.sym.bounds.length ? t.sym.bounds[0] : OBJECT ?? T.error;
  return t;
}

/** Direct supertypes of a class type, with the type's arguments applied (erased for raw types). */
export function directSupertypes(t: ClassType): ClassType[] {
  const sym = t.sym.load();
  const s = substOf(t);
  const raw = isRaw(t);
  const out: ClassType[] = [];
  const add = (x: ClassType) => out.push(raw ? (erasure(x) as ClassType) : (substitute(x, s) as ClassType));
  if (sym.superclass) add(sym.superclass);
  for (const i of sym.interfaces) add(i);
  // Interfaces have Object as a supertype for member lookup and assignability.
  if (!sym.superclass && OBJECT && sym !== OBJECT.sym) out.push(OBJECT);
  return out;
}

/** `t` viewed as an instance of `target` (e.g. ArrayList<String> as Iterable<String>), or null. */
export function asSuper(t: Type, target: ClassSymbol): ClassType | null {
  if (t.tag === "tvar" || t.tag === "wild") return asSuper(upperBound(t), target);
  if (t.tag !== "class") return null;
  if (t.sym === target) return t;
  const seen = new Set<ClassSymbol>();
  const visit = (c: ClassType): ClassType | null => {
    if (c.sym === target) return c;
    if (seen.has(c.sym)) return null;
    seen.add(c.sym);
    for (const s of directSupertypes(c)) {
      const r = visit(s);
      if (r) return r;
    }
    return null;
  };
  return visit(t);
}
