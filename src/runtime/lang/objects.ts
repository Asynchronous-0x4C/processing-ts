// Objects, interfaces and enums for generated code.
//
// User classes extend JObject (Java's Object: equals/hashCode/toString). Interfaces are runtime objects
// (Iface) because a JS class has one superclass: a class records the interfaces it implements in
// `$ifaces` (transitively) and gets their default methods copied onto its prototype. Lambdas and method
// references become objects of the functional interface with the single method set (`lambda`), so a
// call through the interface is a plain method call whether the target is a lambda or a class.
import { ClassCastException, IllegalArgumentException } from "./exceptions.ts";

const hashes = new WeakMap<object, number>();
let seed = 0x1b6d3586;
/** Identity hash code (System.identityHashCode): stable per object, pseudo-random like the JVM's. */
export function identityHash(o: object): number {
  let h = hashes.get(o);
  if (h === undefined) {
    seed = (Math.imul(seed ^ (seed >>> 15), 0x2c1b3c6d) + 0x297a2d39) | 0;
    h = seed & 0x7fffffff;
    hashes.set(o, h);
  }
  return h;
}

export interface JavaClassInfo {
  /** Binary name, e.g. "MySketch$Ball". */
  $javaName?: string;
  $ifaces?: Set<Iface>;
}

export class JObject {
  /** Java's Object() constructor (generated constructors are `$init...` methods). */
  $init(..._args: unknown[]): this {
    return this;
  }
  equals(o: unknown): boolean {
    return this === o;
  }
  hashCode(): number {
    return identityHash(this);
  }
  toString(): string {
    return `${javaName(this)}@${(this.hashCode() >>> 0).toString(16)}`;
  }
  getClass(): JClass {
    return classOf(this);
  }
}

/**
 * $init of runtime library classes: a user class extending one (class Bag extends ArrayList<String>)
 * passes the Java constructor's arguments as `super.$init(args)`; the library state is rebuilt from a
 * fresh instance made with them (the nearest class marked `$library` in the prototype chain).
 */
export function libraryInit(this: object, ...args: unknown[]): object {
  if (!args.length) return this;
  let proto = Object.getPrototypeOf(this);
  while (proto && !Object.prototype.hasOwnProperty.call(proto.constructor, "$library")) proto = Object.getPrototypeOf(proto);
  if (proto) Object.assign(this, new proto.constructor(...args));
  return this;
}

export function javaName(o: object): string {
  const c = o.constructor as JavaClassInfo & { name: string };
  return c.$javaName ?? c.name;
}

/** Minimal java.lang.Class: what sketches print or compare. */
export class JClass {
  readonly ctor: Function;
  constructor(ctor: Function) {
    this.ctor = ctor;
  }
  getName(): string {
    return (this.ctor as JavaClassInfo).$javaName ?? this.ctor.name;
  }
  getSimpleName(): string {
    const n = this.getName();
    return n.slice(Math.max(n.lastIndexOf("$"), n.lastIndexOf(".")) + 1);
  }
  toString(): string {
    return "class " + this.getName();
  }
  equals(o: unknown): boolean {
    return o instanceof JClass && o.ctor === this.ctor;
  }
  hashCode(): number {
    return identityHash(this.ctor);
  }
}

const classes = new WeakMap<Function, JClass>();
export function classOf(o: object): JClass {
  const ctor = o.constructor;
  let c = classes.get(ctor);
  if (!c) classes.set(ctor, (c = new JClass(ctor)));
  return c;
}

// ---------------------------------------------------------------------------------------------------
// Interfaces

export class Iface {
  readonly name: string;
  readonly supers: Iface[];
  /** Default methods (copied to implementing classes) and the prototype of lambdas. */
  readonly proto: Record<string, unknown>;
  readonly all: Set<Iface>;

  constructor(name: string, supers: Iface[] = [], defaults: Record<string, unknown> = {}) {
    this.name = name;
    this.supers = supers;
    this.all = new Set([this]);
    for (const s of supers) for (const x of s.all) this.all.add(x);
    this.proto = Object.create(JObject.prototype);
    for (const s of supers) copyDefaults(this.proto, s.proto);
    Object.assign(this.proto, defaults);
    (this.proto as JavaClassInfo).$ifaces = this.all;
  }
}

function copyDefaults(target: object, from: object) {
  for (const k of Object.getOwnPropertyNames(from)) {
    if (k === "$ifaces" || k === "constructor" || Object.prototype.hasOwnProperty.call(target, k)) continue;
    Object.defineProperty(target, k, Object.getOwnPropertyDescriptor(from, k)!);
  }
}

const ifaceRegistry = new Map<string, Iface>();
/** Library interfaces by binary name, created on first use (java.lang.Runnable, java.util.Comparator...). */
export function libraryIface(name: string, supers: Iface[] = [], defaults: Record<string, unknown> = {}): Iface {
  let i = ifaceRegistry.get(name);
  if (!i) ifaceRegistry.set(name, (i = new Iface(name, supers, defaults)));
  return i;
}

/** Record that `cls` implements `ifaces`; inherit the superclass's set and copy default methods. */
export function implement(cls: Function & JavaClassInfo, ifaces: Iface[]) {
  const parent = Object.getPrototypeOf(cls) as JavaClassInfo;
  const set = new Set<Iface>(parent?.$ifaces ?? []);
  for (const i of ifaces) for (const x of i.all) set.add(x);
  cls.$ifaces = set;
  for (const i of ifaces) {
    for (const k of Object.getOwnPropertyNames(i.proto)) {
      if (k === "$ifaces" || k === "constructor" || k in cls.prototype) continue;
      Object.defineProperty(cls.prototype, k, Object.getOwnPropertyDescriptor(i.proto, k)!);
    }
  }
}

/** Lambda / method reference: an object of the functional interface whose single method is `fn`. */
export function lambda<F extends Function>(iface: Iface, method: string, fn: F): object {
  const o = Object.create(iface.proto);
  o[method] = fn;
  return o;
}

export type JType = Function | Iface;

/** `x instanceof T` for classes and interfaces. */
export function isInstance(x: unknown, t: JType): boolean {
  if (x === null || x === undefined) return false;
  if (t instanceof Iface) {
    const own = (x as JavaClassInfo).$ifaces ?? ((x as object).constructor as JavaClassInfo | undefined)?.$ifaces;
    return !!own && own.has(t);
  }
  return x instanceof (t as new (...a: never[]) => unknown);
}

/** Checked reference cast. */
export function cast<T>(x: T, t: JType, name: string): T {
  if (x === null || x === undefined || isInstance(x, t)) return x;
  throw new ClassCastException(`class ${typeof x === "object" ? javaName(x as object) : typeof x} cannot be cast to class ${name}`);
}

// ---------------------------------------------------------------------------------------------------
// Enums

export class JEnum extends JObject {
  $name = "";
  $ordinal = 0;
  name(): string {
    return this.$name;
  }
  ordinal(): number {
    return this.$ordinal;
  }
  override toString(): string {
    return this.$name;
  }
  compareTo(o: JEnum): number {
    return this.$ordinal - o.$ordinal;
  }
}

/** Create an enum constant (after the class's own constructor ran). */
export function enumConstant<E extends JEnum>(e: E, name: string, ordinal: number): E {
  e.$name = name;
  e.$ordinal = ordinal;
  return e;
}

export function enumValueOf<E extends JEnum>(values: E[], name: string, typeName: string): E {
  const v = values.find((x) => x.$name === name);
  if (v) return v;
  throw new IllegalArgumentException(`No enum constant ${typeName}.${name}`);
}
