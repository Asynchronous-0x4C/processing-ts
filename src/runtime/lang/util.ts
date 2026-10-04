// java.util collections with Java semantics: equals/hashCode keys, Java's HashMap iteration order (the
// bucket table is reproduced, so printing a map gives the same text as Processing), Java iterators
// (hasNext/next/remove) plus the JS iteration protocol. A first set for code generation; ROADMAP P1-7
// extends it (LinkedList, TreeMap, ArrayDeque...).
import { arrayDescriptor, isArray, isLongArray } from "./arrays.ts";
import { ConcurrentModificationException, IllegalStateException, IndexOutOfBoundsException, NoSuchElementException, UnsupportedOperationException } from "./exceptions.ts";
import { jcompare, jequals, jhash } from "./misc.ts";
import { JObject } from "./objects.ts";
import { doubleToString, floatToString, longToString } from "./numbers.ts";
import { valueOf } from "./strings.ts";

interface JIterator<T> {
  hasNext(): boolean;
  next(): T;
  remove(): void;
}
type Comparator<T> = { compare(a: T, b: T): number } | null | undefined;
type Consumer<T> = { accept(x: T): void };
type Predicate<T> = { test(x: T): boolean };

/** Elements of a Java collection, an Iterable, a JS iterable or an array-like. */
function* elementsOf<T>(c: unknown): Generator<T> {
  if (c === null || c === undefined) return;
  if (typeof (c as { iterator?: unknown }).iterator === "function") {
    const it = (c as { iterator(): JIterator<T> }).iterator();
    while (it.hasNext()) yield it.next();
  } else if (typeof (c as Iterable<T>)[Symbol.iterator] === "function") yield* c as Iterable<T>;
  else for (const x of Array.from(c as ArrayLike<T>)) yield x;
}

const text = (x: unknown, self: unknown) => (x === self ? "(this Collection)" : valueOf(x));

abstract class AbstractCollection<T> extends JObject {
  abstract iterator(): JIterator<T>;
  abstract size(): number;
  isEmpty(): boolean {
    return this.size() === 0;
  }
  contains(o: unknown): boolean {
    for (const x of this) if (jequals(x, o)) return true;
    return false;
  }
  containsAll(c: unknown): boolean {
    for (const x of elementsOf(c)) if (!this.contains(x)) return false;
    return true;
  }
  toArray(): T[] {
    return Array.from(this);
  }
  forEach(f: Consumer<T>): void {
    for (const x of this) f.accept(x);
  }
  *[Symbol.iterator](): Generator<T> {
    const it = this.iterator();
    while (it.hasNext()) yield it.next();
  }
  override toString(): string {
    return "[" + Array.from(this, (x) => text(x, this)).join(", ") + "]";
  }
}

// --- lists -----------------------------------------------------------------------------------------

export class ArrayList<T> extends AbstractCollection<T> {
  protected a: T[] = [];
  protected modCount = 0;

  /** new ArrayList(), new ArrayList(capacity), new ArrayList(collection) */
  constructor(init?: number | unknown) {
    super();
    if (init !== undefined && typeof init !== "number") for (const x of elementsOf<T>(init)) this.a.push(x);
  }

  private check(i: number, n = this.a.length) {
    if (i < 0 || i >= n) throw new IndexOutOfBoundsException(`Index ${i} out of bounds for length ${this.a.length}`);
  }

  size(): number {
    return this.a.length;
  }
  get(i: number): T {
    this.check(i);
    return this.a[i];
  }
  set(i: number, v: T): T {
    this.check(i);
    const old = this.a[i];
    this.a[i] = v;
    return old;
  }
  /** add(e) or add(index, e) */
  add(x: T | number, y?: T): boolean {
    this.modCount++;
    if (arguments.length === 2) {
      this.check(x as number, this.a.length + 1);
      this.a.splice(x as number, 0, y as T);
      return true;
    }
    this.a.push(x as T);
    return true;
  }
  addAll(x: unknown, y?: unknown): boolean {
    this.modCount++;
    if (arguments.length === 2) {
      const items = Array.from(elementsOf<T>(y));
      this.a.splice(x as number, 0, ...items);
      return items.length > 0;
    }
    const items = Array.from(elementsOf<T>(x));
    for (const i of items) this.a.push(i);
    return items.length > 0;
  }
  /** remove(int) is compiled to removeAt; remove(Object) removes the first equal element. */
  removeAt(i: number): T {
    this.check(i);
    this.modCount++;
    return this.a.splice(i, 1)[0];
  }
  remove(o: unknown): boolean {
    const i = this.indexOf(o);
    if (i < 0) return false;
    this.removeAt(i);
    return true;
  }
  removeAll(c: unknown): boolean {
    const drop = Array.from(elementsOf(c));
    return this.removeIf({ test: (x) => drop.some((d) => jequals(x, d)) });
  }
  retainAll(c: unknown): boolean {
    const keep = Array.from(elementsOf(c));
    return this.removeIf({ test: (x) => !keep.some((d) => jequals(x, d)) });
  }
  removeIf(p: Predicate<T>): boolean {
    const before = this.a.length;
    this.a = this.a.filter((x) => !p.test(x));
    if (this.a.length !== before) this.modCount++;
    return this.a.length !== before;
  }
  indexOf(o: unknown): number {
    return this.a.findIndex((x) => jequals(x, o));
  }
  lastIndexOf(o: unknown): number {
    for (let i = this.a.length - 1; i >= 0; i--) if (jequals(this.a[i], o)) return i;
    return -1;
  }
  override contains(o: unknown): boolean {
    return this.indexOf(o) >= 0;
  }
  clear(): void {
    this.modCount++;
    this.a.length = 0;
  }
  sort(c: Comparator<T>): void {
    this.modCount++;
    this.a.sort(c ? (x, y) => c.compare(x, y) : jcompare);
  }
  subList(from: number, to: number): ArrayList<T> {
    const l = new ArrayList<T>();
    l.a = this.a.slice(from, to);
    return l;
  }
  override toArray(arr?: unknown[]): T[] {
    void arr;
    return this.a.slice();
  }
  iterator(): JIterator<T> {
    let i = 0;
    let last = -1;
    let expected = this.modCount;
    return {
      hasNext: () => i < this.a.length,
      next: () => {
        if (this.modCount !== expected) throw new ConcurrentModificationException(null);
        if (i >= this.a.length) throw new NoSuchElementException(null);
        last = i;
        return this.a[i++];
      },
      remove: () => {
        if (last < 0) throw new IllegalStateException(null);
        this.a.splice(last, 1);
        i = last;
        last = -1;
        expected = ++this.modCount;
      },
    };
  }
  override equals(o: unknown): boolean {
    if (!(o instanceof ArrayList) || o.size() !== this.size()) return false;
    return this.a.every((x, i) => jequals(x, (o as ArrayList<T>).a[i]));
  }
  override hashCode(): number {
    let h = 1;
    for (const x of this.a) h = (Math.imul(31, h) + jhash(x)) | 0;
    return h;
  }
  override *[Symbol.iterator](): Generator<T> {
    yield* this.a;
  }
}

// --- HashMap with Java's iteration order --------------------------------------------------------------

class Node<K, V> extends JObject {
  hash: number;
  key: K;
  value: V;
  next: Node<K, V> | null = null;
  constructor(hash: number, key: K, value: V) {
    super();
    this.hash = hash;
    this.key = key;
    this.value = value;
  }
  getKey(): K {
    return this.key;
  }
  getValue(): V {
    return this.value;
  }
  setValue(v: V): V {
    const old = this.value;
    this.value = v;
    return old;
  }
  override toString(): string {
    return `${valueOf(this.key)}=${valueOf(this.value)}`;
  }
  override equals(o: unknown): boolean {
    return o instanceof Node && jequals(o.key, this.key) && jequals(o.value, this.value);
  }
  override hashCode(): number {
    return jhash(this.key) ^ jhash(this.value);
  }
}

const spread = (k: unknown) => {
  if (k === null || k === undefined) return 0;
  const h = jhash(k);
  return h ^ (h >>> 16);
};

function tableSizeFor(cap: number): number {
  let n = 1;
  while (n < cap) n <<= 1;
  return Math.max(1, Math.min(n, 1 << 30));
}

export class HashMap<K, V> extends JObject {
  private table: (Node<K, V> | null)[] | null = null;
  private count = 0;
  private threshold = 0;
  private modCount = 0;

  /** new HashMap(), new HashMap(initialCapacity), new HashMap(map) */
  constructor(init?: number | HashMap<K, V>) {
    super();
    if (typeof init === "number") this.threshold = tableSizeFor(init);
    else if (init instanceof HashMap) this.putAll(init);
  }

  private resize(): (Node<K, V> | null)[] {
    const old = this.table;
    const oldCap = old ? old.length : 0;
    let newCap: number;
    if (oldCap > 0) newCap = oldCap * 2;
    else newCap = this.threshold > 0 ? this.threshold : 16;
    this.threshold = Math.floor(newCap * 0.75);
    const tab: (Node<K, V> | null)[] = new Array(newCap).fill(null);
    if (old) {
      for (let j = 0; j < oldCap; j++) {
        let e = old[j];
        if (!e) continue;
        let loHead: Node<K, V> | null = null, loTail: Node<K, V> | null = null;
        let hiHead: Node<K, V> | null = null, hiTail: Node<K, V> | null = null;
        while (e) {
          const next: Node<K, V> | null = e.next;
          e.next = null;
          if ((e.hash & oldCap) === 0) {
            if (loTail) loTail.next = e;
            else loHead = e;
            loTail = e;
          } else {
            if (hiTail) hiTail.next = e;
            else hiHead = e;
            hiTail = e;
          }
          e = next;
        }
        tab[j] = loHead;
        tab[j + oldCap] = hiHead;
      }
    }
    this.table = tab;
    return tab;
  }

  private node(k: unknown): Node<K, V> | null {
    const tab = this.table;
    if (!tab) return null;
    const h = spread(k);
    for (let e = tab[(tab.length - 1) & h]; e; e = e.next) if (e.hash === h && jequals(e.key, k)) return e;
    return null;
  }

  size(): number {
    return this.count;
  }
  isEmpty(): boolean {
    return this.count === 0;
  }
  get(k: unknown): V | null {
    const e = this.node(k);
    return e ? e.value : null;
  }
  getOrDefault(k: unknown, d: V): V {
    const e = this.node(k);
    return e ? e.value : d;
  }
  containsKey(k: unknown): boolean {
    return this.node(k) !== null;
  }
  containsValue(v: unknown): boolean {
    for (const e of this.nodes()) if (jequals(e.value, v)) return true;
    return false;
  }
  put(k: K, v: V): V | null {
    const tab = this.table ?? this.resize();
    const h = spread(k);
    const i = (tab.length - 1) & h;
    let e = tab[i];
    if (!e) tab[i] = new Node(h, k, v);
    else {
      for (;;) {
        if (e.hash === h && jequals(e.key, k)) return e.setValue(v);
        if (!e.next) break;
        e = e.next;
      }
      e.next = new Node(h, k, v);
    }
    this.modCount++;
    if (++this.count > this.threshold) this.resize();
    return null;
  }
  putIfAbsent(k: K, v: V): V | null {
    const e = this.node(k);
    if (e && e.value !== null) return e.value;
    if (e) return e.setValue(v);
    this.put(k, v);
    return null;
  }
  putAll(m: HashMap<K, V>): void {
    for (const e of m.nodes()) this.put(e.key, e.value);
  }
  remove(k: unknown): V | null {
    const tab = this.table;
    if (!tab) return null;
    const h = spread(k);
    const i = (tab.length - 1) & h;
    let prev: Node<K, V> | null = null;
    for (let e = tab[i]; e; prev = e, e = e.next) {
      if (e.hash === h && jequals(e.key, k)) {
        if (prev) prev.next = e.next;
        else tab[i] = e.next;
        this.count--;
        this.modCount++;
        return e.value;
      }
    }
    return null;
  }
  clear(): void {
    if (this.table) this.table.fill(null);
    this.count = 0;
    this.modCount++;
  }
  /** Entries in Java's iteration order. */
  *nodes(): Generator<Node<K, V>> {
    const tab = this.table;
    if (!tab) return;
    const expected = this.modCount;
    for (let i = 0; i < tab.length; i++) {
      for (let e = tab[i]; e; e = e.next) {
        if (this.modCount !== expected) throw new ConcurrentModificationException(null);
        yield e;
      }
    }
  }
  keySet(): MapView<K> {
    return new MapView(this, (e) => e.key);
  }
  values(): MapView<V> {
    return new MapView(this, (e) => e.value);
  }
  entrySet(): MapView<Node<K, V>> {
    return new MapView(this, (e) => e);
  }
  forEach(f: { accept(k: K, v: V): void }): void {
    for (const e of this.nodes()) f.accept(e.key, e.value);
  }
  merge(k: K, v: V, f: { apply(a: V, b: V): V | null }): V | null {
    const old = this.get(k);
    const nv = old === null ? v : f.apply(old, v);
    if (nv === null) this.remove(k);
    else this.put(k, nv);
    return nv;
  }
  computeIfAbsent(k: K, f: { apply(k: K): V }): V {
    const e = this.node(k);
    if (e && e.value !== null) return e.value;
    const v = f.apply(k);
    if (v !== null) this.put(k, v);
    return v;
  }
  override toString(): string {
    return "{" + Array.from(this.nodes(), (e) => `${e.key === (this as unknown) ? "(this Map)" : valueOf(e.key)}=${e.value === (this as unknown) ? "(this Map)" : valueOf(e.value)}`).join(", ") + "}";
  }
  override equals(o: unknown): boolean {
    if (!(o instanceof HashMap) || o.size() !== this.size()) return false;
    for (const e of this.nodes()) if (!o.containsKey(e.key) || !jequals(o.get(e.key), e.value)) return false;
    return true;
  }
  override hashCode(): number {
    let h = 0;
    for (const e of this.nodes()) h = (h + e.hashCode()) | 0;
    return h;
  }
}

/** keySet()/values()/entrySet(): live views of a HashMap. */
class MapView<T> extends AbstractCollection<T> {
  private readonly map: HashMap<unknown, unknown>;
  private readonly pick: (e: Node<unknown, unknown>) => T;
  constructor(map: unknown, pick: (e: Node<never, never>) => T) {
    super();
    this.map = map as HashMap<unknown, unknown>;
    this.pick = pick as (e: Node<unknown, unknown>) => T;
  }
  size(): number {
    return this.map.size();
  }
  iterator(): JIterator<T> {
    const nodes = Array.from(this.map.nodes());
    let i = 0;
    let last: Node<unknown, unknown> | null = null;
    return {
      hasNext: () => i < nodes.length,
      next: () => {
        if (i >= nodes.length) throw new NoSuchElementException(null);
        last = nodes[i++];
        return this.pick(last);
      },
      remove: () => {
        if (!last) throw new IllegalStateException(null);
        this.map.remove(last.key);
        last = null;
      },
    };
  }
  remove(o: unknown): boolean {
    for (const e of this.map.nodes()) {
      if (jequals(this.pick(e), o)) {
        this.map.remove(e.key);
        return true;
      }
    }
    return false;
  }
  add(): boolean {
    throw new UnsupportedOperationException(null);
  }
}

export class HashSet<T> extends AbstractCollection<T> {
  private readonly map = new HashMap<T, boolean>();
  constructor(init?: number | unknown) {
    super();
    if (init !== undefined && typeof init !== "number") for (const x of elementsOf<T>(init)) this.add(x);
  }
  size(): number {
    return this.map.size();
  }
  add(x: T): boolean {
    return this.map.put(x, true) === null;
  }
  addAll(c: unknown): boolean {
    let changed = false;
    for (const x of elementsOf<T>(c)) changed = this.add(x) || changed;
    return changed;
  }
  override contains(o: unknown): boolean {
    return this.map.containsKey(o);
  }
  remove(o: unknown): boolean {
    return this.map.remove(o) !== null;
  }
  clear(): void {
    this.map.clear();
  }
  iterator(): JIterator<T> {
    return this.map.keySet().iterator();
  }
  removeIf(p: Predicate<T>): boolean {
    let changed = false;
    for (const x of Array.from(this)) if (p.test(x)) changed = this.remove(x) || changed;
    return changed;
  }
  override equals(o: unknown): boolean {
    return o instanceof HashSet && o.size() === this.size() && this.containsAll(o);
  }
  override hashCode(): number {
    let h = 0;
    for (const x of this) h = (h + jhash(x)) | 0;
    return h;
  }
}

// --- Collections / Arrays (first part) ---------------------------------------------------------------

function elementText(a: unknown, x: unknown): string {
  if (a instanceof Float32Array) return floatToString(x as number);
  if (a instanceof Float64Array) return isLongArray(a) ? longToString(x as number) : doubleToString(x as number);
  if (a instanceof Uint16Array) return String.fromCharCode(x as number);
  return valueOf(x);
}

export const Collections = {
  sort<T>(list: ArrayList<T>, c?: Comparator<T>) {
    list.sort(c ?? null);
  },
  reverse<T>(list: ArrayList<T>) {
    const items = list.toArray().reverse();
    list.clear();
    for (const x of items) list.add(x);
  },
  shuffle<T>(list: ArrayList<T>) {
    const items = list.toArray();
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    list.clear();
    for (const x of items) list.add(x);
  },
  swap<T>(list: ArrayList<T>, i: number, j: number) {
    list.set(i, list.set(j, list.get(i)));
  },
  max<T>(c: unknown, cmp?: Comparator<T>): T {
    const items = Array.from(elementsOf<T>(c));
    if (!items.length) throw new NoSuchElementException(null);
    return items.reduce((a, b) => ((cmp ? cmp.compare(a, b) : jcompare(a, b)) >= 0 ? a : b));
  },
  min<T>(c: unknown, cmp?: Comparator<T>): T {
    const items = Array.from(elementsOf<T>(c));
    if (!items.length) throw new NoSuchElementException(null);
    return items.reduce((a, b) => ((cmp ? cmp.compare(a, b) : jcompare(a, b)) <= 0 ? a : b));
  },
  frequency(c: unknown, o: unknown): number {
    let n = 0;
    for (const x of elementsOf(c)) if (jequals(x, o)) n++;
    return n;
  },
  addAll<T>(c: ArrayList<T>, items: T[]): boolean {
    for (const x of items) c.add(x);
    return items.length > 0;
  },
  unmodifiableList: <T>(l: T) => l,
  emptyList: <T>() => new ArrayList<T>(),
  nCopies<T>(n: number, x: T): ArrayList<T> {
    const l = new ArrayList<T>();
    for (let i = 0; i < n; i++) l.add(x);
    return l;
  },
};

export const Arrays = {
  toString(a: ArrayLike<unknown> | null): string {
    if (a === null) return "null";
    return "[" + Array.from(a, (x) => elementText(a, x)).join(", ") + "]";
  },
  sort(a: { sort(f?: (x: never, y: never) => number): unknown; subarray?: unknown } & ArrayLike<unknown>, x?: unknown, y?: unknown, z?: unknown) {
    if (typeof x === "number") {
      const part = Array.from(a).slice(x, y as number);
      part.sort(ArrayBuffer.isView(a) ? (p, q) => (p as number) - (q as number) : z ? (p, q) => (z as { compare(a: unknown, b: unknown): number }).compare(p, q) : jcompare);
      for (let i = 0; i < part.length; i++) (a as unknown as unknown[])[x + i] = part[i];
      return;
    }
    if (ArrayBuffer.isView(a)) (a as unknown as Float64Array).sort();
    else (a as unknown as unknown[]).sort(x ? (p, q) => (x as { compare(a: unknown, b: unknown): number }).compare(p, q) : jcompare);
  },
  fill(a: { fill(v: unknown, s?: number, e?: number): unknown }, x: unknown, y?: unknown, z?: unknown) {
    if (z !== undefined) a.fill(z, x as number, y as number);
    else a.fill(x);
  },
  copyOf<T extends { slice(a?: number, b?: number): T; length: number; constructor: Function }>(a: T, n: number): T {
    if (n <= a.length) return a.slice(0, n);
    const out = new (a.constructor as new (n: number) => T & { set(x: T): void; fill?(v: unknown, s?: number): void })(n);
    if (Array.isArray(out)) {
      (out as unknown as unknown[]).fill(isArray(a) && arrayDescriptor(a) === "[Z" ? false : null);
      for (let i = 0; i < a.length; i++) (out as unknown as unknown[])[i] = (a as unknown as unknown[])[i];
    } else out.set(a);
    return out;
  },
  copyOfRange<T extends { slice(a?: number, b?: number): T }>(a: T, from: number, to: number): T {
    return a.slice(from, to);
  },
  asList<T>(items: ArrayLike<T>): ArrayList<T> {
    return new ArrayList<T>(Array.from(items));
  },
  equals(a: ArrayLike<unknown> | null, b: ArrayLike<unknown> | null): boolean {
    if (a === b) return true;
    if (!a || !b || a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (!jequals(a[i], b[i])) return false;
    return true;
  },
  binarySearch(a: ArrayLike<number>, key: number): number {
    let lo = 0;
    let hi = a.length - 1;
    while (lo <= hi) {
      const mid = (lo + hi) >>> 1;
      if (a[mid] < key) lo = mid + 1;
      else if (a[mid] > key) hi = mid - 1;
      else return mid;
    }
    return -(lo + 1);
  },
};
