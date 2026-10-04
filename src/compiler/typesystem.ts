// Relations between types (JLS 4.10 subtyping, chapter 5 conversions), simplified where Processing
// sketches never notice: no capture conversion (wildcards are read through their bounds), unchecked
// conversions between raw and parameterized types are allowed silently.
import type { Library } from "./library.ts";
import {
  T, asSuper, classType, isNumeric, isReference, sameType, upperBound,
  type ClassSymbol, type ClassType, type ConstValue, type PrimName, type PrimType, type Type,
} from "./types.ts";

const WIDENING: Record<PrimName, PrimName[]> = {
  byte: ["short", "int", "long", "float", "double"],
  short: ["int", "long", "float", "double"],
  char: ["int", "long", "float", "double"],
  int: ["long", "float", "double"],
  long: ["float", "double"],
  float: ["double"],
  double: [],
  boolean: [],
};

const BOXES: Record<PrimName, string> = {
  boolean: "java.lang.Boolean", byte: "java.lang.Byte", short: "java.lang.Short", char: "java.lang.Character",
  int: "java.lang.Integer", long: "java.lang.Long", float: "java.lang.Float", double: "java.lang.Double",
};

export class TypeSystem {
  readonly lib: Library;
  readonly object: ClassType;
  readonly string: ClassType;
  readonly throwable: ClassType;
  readonly exception: ClassType;
  readonly runtimeException: ClassType;
  readonly errorClass: ClassType;
  readonly iterable: ClassSymbol;
  private readonly boxSyms = new Map<ClassSymbol, PrimName>();
  private readonly boxTypes = {} as Record<PrimName, ClassType>;

  constructor(lib: Library) {
    this.lib = lib;
    this.object = lib.type("java.lang.Object");
    this.string = lib.type("java.lang.String");
    this.throwable = lib.type("java.lang.Throwable");
    this.exception = lib.type("java.lang.Exception");
    this.runtimeException = lib.type("java.lang.RuntimeException");
    this.errorClass = lib.type("java.lang.Error");
    this.iterable = lib.get("java.lang.Iterable");
    for (const [p, name] of Object.entries(BOXES) as [PrimName, string][]) {
      this.boxTypes[p] = lib.type(name);
      this.boxSyms.set(this.boxTypes[p].sym, p);
    }
  }

  isString(t: Type): boolean {
    return t.tag === "class" && t.sym === this.string.sym;
  }

  box(p: PrimType): ClassType {
    return this.boxTypes[p.name];
  }

  /** The primitive type of a box class (Integer → int), or null. */
  unboxed(t: Type): PrimType | null {
    if (t.tag === "tvar" || t.tag === "wild") return this.unboxed(upperBound(t));
    if (t.tag !== "class") return null;
    const p = this.boxSyms.get(t.sym);
    return p ? T[p] : null;
  }

  /** Primitive view of a type for numeric/boolean operators: itself, or the unboxed type. */
  primOf(t: Type): PrimType | null {
    return t.tag === "prim" ? t : this.unboxed(t);
  }

  isPrimWidening(from: PrimName, to: PrimName): boolean {
    return WIDENING[from].includes(to);
  }

  unaryPromote(p: PrimType): PrimType {
    return p.name === "byte" || p.name === "short" || p.name === "char" ? T.int : p;
  }

  binaryPromote(a: PrimType, b: PrimType): PrimType {
    if (a.name === "double" || b.name === "double") return T.double;
    if (a.name === "float" || b.name === "float") return T.float;
    if (a.name === "long" || b.name === "long") return T.long;
    return T.int;
  }

  // --- subtyping ------------------------------------------------------------------------------------

  isSubtype(s: Type, t: Type): boolean {
    if (s.tag === "error" || t.tag === "error") return true;
    if (s === t) return true;
    if (s.tag === "prim" || t.tag === "prim") return s.tag === "prim" && t.tag === "prim" && s.name === t.name;
    if (s.tag === "null") return isReference(t) || t.tag === "wild";
    if (t.tag === "tvar") return s.tag === "tvar" && (s.sym === t.sym || s.sym.bounds.some((b) => this.isSubtype(b, t)));
    if (s.tag === "tvar") return this.isSubtype(upperBound(s), t);
    if (s.tag === "wild") return this.isSubtype(upperBound(s), t);
    if (t.tag === "wild") return t.bound === null || (t.upper ? this.isSubtype(s, t.bound) : this.isSubtype(t.bound, s));
    if (s.tag === "array") {
      if (t.tag === "array") {
        if (s.elem.tag === "prim" || t.elem.tag === "prim") return sameType(s.elem, t.elem);
        return this.isSubtype(s.elem, t.elem);
      }
      return t.tag === "class" && (t.sym === this.object.sym || t.sym.fullName === "java.lang.Cloneable" || t.sym.fullName === "java.io.Serializable");
    }
    if (s.tag !== "class" || t.tag !== "class") return false;
    const sup = asSuper(s, t.sym);
    if (!sup) return false;
    if (t.args.length === 0 || sup.args.length === 0) return true; // raw types: unchecked
    if (sup.args.length !== t.args.length) return true;
    return t.args.every((ta, i) => this.contains(ta, sup.args[i]));
  }

  /** Type argument containment (JLS 4.5.1). */
  private contains(ta: Type, sa: Type): boolean {
    if (ta.tag === "error" || sa.tag === "error") return true;
    if (ta.tag === "wild") {
      if (!ta.bound) return true;
      if (ta.upper) return this.isSubtype(sa.tag === "wild" ? upperBound(sa) : sa, ta.bound);
      if (sa.tag === "wild") return !sa.upper && sa.bound !== null && this.isSubtype(ta.bound, sa.bound);
      return this.isSubtype(ta.bound, sa);
    }
    return sameType(ta, sa);
  }

  // --- conversions ----------------------------------------------------------------------------------

  /** Assignment context (JLS 5.2), including narrowing of int constants to byte/short/char. */
  isAssignable(from: Type, to: Type, constant?: ConstValue): boolean {
    if (from.tag === "error" || to.tag === "error") return true;
    if (this.isInvocationConvertible(from, to, true)) return true;
    if (constant !== undefined && typeof constant === "number" && from.tag === "prim" && (from.name === "int" || from.name === "short" || from.name === "char" || from.name === "byte")) {
      const target = to.tag === "prim" ? to.name : this.unboxed(to)?.name;
      if (target === "byte") return constant >= -128 && constant <= 127;
      if (target === "short") return constant >= -32768 && constant <= 32767;
      if (target === "char") return constant >= 0 && constant <= 0xffff;
    }
    return false;
  }

  /** Method invocation context (JLS 5.3): strict (no boxing) or loose. */
  isInvocationConvertible(from: Type, to: Type, loose: boolean): boolean {
    if (from.tag === "error" || to.tag === "error") return true;
    if (from.tag === "void" || to.tag === "void") return false;
    if (from.tag === "prim" && to.tag === "prim") return from.name === to.name || this.isPrimWidening(from.name, to.name);
    if (from.tag === "prim") return loose && this.isSubtype(this.box(from), to);
    if (to.tag === "prim") {
      if (!loose) return false;
      const u = this.unboxed(from);
      return u !== null && (u.name === to.name || this.isPrimWidening(u.name, to.name));
    }
    return this.isSubtype(from, to);
  }

  /** Casting context (JLS 5.5), permissive between reference types that could be related. */
  isCastable(from: Type, to: Type): boolean {
    if (from.tag === "error" || to.tag === "error") return true;
    if (from.tag === "void" || to.tag === "void") return false;
    if (from.tag === "prim" && to.tag === "prim") return (from.name === "boolean") === (to.name === "boolean");
    if (from.tag === "prim") return this.isSubtype(this.box(from), to);
    if (to.tag === "prim") {
      const u = this.unboxed(from);
      if (u) return u.name === to.name || this.isPrimWidening(u.name, to.name);
      // Object/Number/Comparable/Serializable to a primitive: checkcast to the box, then unbox.
      return this.isSubtype(this.box(to), from);
    }
    if (from.tag === "null") return true;
    if (this.isSubtype(from, to) || this.isSubtype(to, from)) return true;
    const f = from.tag === "tvar" || from.tag === "wild" ? upperBound(from) : from;
    const t = to.tag === "tvar" || to.tag === "wild" ? upperBound(to) : to;
    if (f !== from || t !== to) return this.isCastable(f, t);
    if (f.tag === "array" && t.tag === "array") {
      if (f.elem.tag === "prim" || t.elem.tag === "prim") return sameType(f.elem, t.elem);
      return this.isCastable(f.elem, t.elem);
    }
    if (f.tag === "class" && t.tag === "class") {
      // An interface and a non-final class (or two interfaces) may have a common subclass.
      const fi = f.sym.load().isInterface;
      const ti = t.sym.load().isInterface;
      if (fi && ti) return true;
      if (fi) return !(t.sym.flags & 2);
      if (ti) return !(f.sym.flags & 2);
      return this.isSubtype(classType(f.sym), classType(t.sym)) || this.isSubtype(classType(t.sym), classType(f.sym));
    }
    return false;
  }

  /** Least upper bound, simplified: the more general of two related types, else Object. */
  lub(a: Type, b: Type): Type {
    if (a.tag === "error" || b.tag === "error") return T.error;
    if (a.tag === "null") return b;
    if (b.tag === "null") return a;
    if (this.isSubtype(a, b)) return b;
    if (this.isSubtype(b, a)) return a;
    if (a.tag === "class" && b.tag === "class") {
      // Walk a's superclass chain for the first class b extends.
      for (let s: ClassType | null = a.sym.load().superclass; s; s = s.sym.load().superclass) {
        if (s.sym !== this.object.sym && this.isSubtype(b, classType(s.sym))) return classType(s.sym);
      }
    }
    return this.object;
  }

  isNumericLike(t: Type): boolean {
    const p = this.primOf(t);
    return p !== null && isNumeric(p);
  }
}
