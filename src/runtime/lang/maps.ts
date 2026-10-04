// java.util maps and sets with Java semantics. HashMap reproduces Java's bucket table (sizes, resizing,
// the pre-sizing of copies and putAll), so iteration and printing follow Processing exactly;
// LinkedHashMap keeps insertion (or access) order; TreeMap/TreeSet are sorted arrays searched with the
// comparator (or compareTo). Iterators are fail-fast; keySet/values/entrySet are live views. The
// navigation views of TreeMap/TreeSet (headMap, subSet, descendingMap...) are copies, not views.
import { AbstractCollection, Ifaces, elementsOf, sizeOf, type Comparator, type JIterator } from "./collections.ts";
import { ConcurrentModificationException, IllegalArgumentException, IllegalStateException, NoSuchElementException, NullPointerException, UnsupportedOperationException } from "./exceptions.ts";
import { jcompare, jequals, jhash } from "./misc.ts";
import { JObject, implement, isInstance } from "./objects.ts";
import { valueOf } from "./strings.ts";

type BiFn<A, B, R> = { apply(a: A, b: B): R };
type Fn<A, R> = { apply(a: A): R };

/** Map.Entry */
export class Entry<K, V> extends JObject {
  key: K;
  value: V;
  constructor(key: K, value: V) {
    super();
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
    if (!isInstance(o, Ifaces.MapEntry)) return false;
    const e = o as Entry<unknown, unknown>;
    return jequals(e.getKey(), this.key) && jequals(e.getValue(), this.value);
  }
  override hashCode(): number {
    return jhash(this.key) ^ jhash(this.value);
  }
}
implement(Entry as never, [Ifaces.MapEntry]);

/** The java.util.Map methods shared by HashMap and TreeMap (Map's default methods included). */
export abstract class AbstractMap<K, V> extends JObject {
  $modCount = 0;
  abstract size(): number;
  abstract get(k: unknown): V | null;
  abstract containsKey(k: unknown): boolean;
  abstract put(k: K, v: V): V | null;
  protected abstract $removeKey(k: unknown): Entry<K, V> | null;
  /** Fail-fast iterator over the entries in the map's order; remove() deletes the current entry. */
  abstract $entryIterator(): JIterator<Entry<K, V>>;
  abstract clear(): void;

  isEmpty(): boolean {
    return this.size() === 0;
  }
  /** remove(key) or remove(key, value) */
  remove(k: unknown, v?: unknown): V | null | boolean {
    if (arguments.length === 2) {
      if (!this.containsKey(k) || !jequals(this.get(k), v)) return false;
      this.$removeKey(k);
      return true;
    }
    const e = this.$removeKey(k);
    return e ? e.value : null;
  }
  *$entries(): Generator<Entry<K, V>> {
    const it = this.$entryIterator();
    while (it.hasNext()) yield it.next();
  }
  containsValue(v: unknown): boolean {
    for (const e of this.$entries()) if (jequals(e.value, v)) return true;
    return false;
  }
  getOrDefault(k: unknown, d: V): V {
    return this.containsKey(k) ? (this.get(k) as V) : d;
  }
  putIfAbsent(k: K, v: V): V | null {
    const old = this.get(k);
    if (old === null) this.put(k, v);
    return old;
  }
  putAll(m: AbstractMap<K, V>): void {
    for (const e of Array.from(m.$entries())) this.put(e.key, e.value);
  }
  merge(k: K, v: V, f: BiFn<V, V, V | null>): V | null {
    const old = this.get(k);
    const nv = old === null ? v : f.apply(old, v);
    if (nv === null) this.$removeKey(k);
    else this.put(k, nv);
    return nv;
  }
  compute(k: K, f: BiFn<K, V | null, V | null>): V | null {
    const old = this.get(k);
    const nv = f.apply(k, old);
    if (nv === null) {
      if (old !== null || this.containsKey(k)) this.$removeKey(k);
      return null;
    }
    this.put(k, nv);
    return nv;
  }
  computeIfAbsent(k: K, f: Fn<K, V | null>): V | null {
    const old = this.get(k);
    if (old !== null) return old;
    const v = f.apply(k);
    if (v !== null) this.put(k, v);
    return v;
  }
  computeIfPresent(k: K, f: BiFn<K, V, V | null>): V | null {
    const old = this.get(k);
    if (old === null) return null;
    const nv = f.apply(k, old);
    if (nv === null) this.$removeKey(k);
    else this.put(k, nv);
    return nv;
  }
  /** replace(key, value) or replace(key, oldValue, newValue) */
  replace(k: K, a: V, b?: V): V | null | boolean {
    if (arguments.length === 3) {
      if (!this.containsKey(k) || !jequals(this.get(k), a)) return false;
      this.put(k, b as V);
      return true;
    }
    return this.containsKey(k) ? this.put(k, a) : null;
  }
  replaceAll(f: BiFn<K, V, V>): void {
    for (const e of this.$entries()) e.value = f.apply(e.key, e.value);
  }
  forEach(f: { accept(k: K, v: V): void }): void {
    for (const e of this.$entries()) f.accept(e.key, e.value);
  }
  keySet(): MapView<K, K, V> {
    return new MapView(this, (e) => e.key, "key");
  }
  values(): MapView<V, K, V> {
    return new MapView(this, (e) => e.value, "value");
  }
  entrySet(): MapView<Entry<K, V>, K, V> {
    return new MapView(this, (e) => e, "entry");
  }
  override toString(): string {
    const t = (x: unknown) => (x === this ? "(this Map)" : valueOf(x));
    return "{" + Array.from(this.$entries(), (e) => `${t(e.key)}=${t(e.value)}`).join(", ") + "}";
  }
  override equals(o: unknown): boolean {
    if (o === this) return true;
    if (!isInstance(o, Ifaces.Map)) return false;
    const m = o as AbstractMap<K, V>;
    if (m.size() !== this.size()) return false;
    for (const e of this.$entries()) if (!m.containsKey(e.key) || !jequals(m.get(e.key), e.value)) return false;
    return true;
  }
  override hashCode(): number {
    let h = 0;
    for (const e of this.$entries()) h = (h + e.hashCode()) | 0;
    return h;
  }
}
implement(AbstractMap as never, [Ifaces.Map]);

/** keySet()/values()/entrySet(): live views. */
class MapView<T, K, V> extends AbstractCollection<T> {
  private readonly $map: AbstractMap<K, V>;
  private readonly pick: (e: Entry<K, V>) => T;
  private readonly kind: "key" | "value" | "entry";
  constructor(map: AbstractMap<K, V>, pick: (e: Entry<K, V>) => T, kind: "key" | "value" | "entry") {
    super();
    this.$map = map;
    this.pick = pick;
    this.kind = kind;
  }
  size(): number {
    return this.$map.size();
  }
  iterator(): JIterator<T> {
    const it = this.$map.$entryIterator();
    return { hasNext: () => it.hasNext(), next: () => this.pick(it.next()), remove: () => it.remove() };
  }
  override contains(o: unknown): boolean {
    if (this.kind === "key") return this.$map.containsKey(o);
    if (this.kind === "value") return this.$map.containsValue(o);
    const e = o as Entry<K, V>;
    return isInstance(o, Ifaces.MapEntry) && this.$map.containsKey(e.getKey()) && jequals(this.$map.get(e.getKey()), e.getValue());
  }
  override remove(o: unknown): boolean {
    if (this.kind === "key") {
      if (!this.$map.containsKey(o)) return false;
      this.$map.remove(o);
      return true;
    }
    return super.remove(o);
  }
  override clear(): void {
    this.$map.clear();
  }
  override equals(o: unknown): boolean {
    if (this.kind === "value") return o === this;
    if (!isInstance(o, Ifaces.Set)) return false;
    return sizeOf(o) === this.size() && this.containsAll(o);
  }
  override hashCode(): number {
    let h = 0;
    for (const x of this) h = (h + jhash(x)) | 0;
    return h;
  }
}
implement(MapView as never, [Ifaces.Set]);

// --- HashMap -------------------------------------------------------------------------------------------

class Node<K, V> extends Entry<K, V> {
  hash: number;
  next: Node<K, V> | null = null;
  /** LinkedHashMap's order. */
  before: Node<K, V> | null = null;
  after: Node<K, V> | null = null;
  constructor(hash: number, key: K, value: V) {
    super(key, value);
    this.hash = hash;
  }
}

const spread = (k: unknown) => {
  if (k === null || k === undefined) return 0;
  const h = jhash(k);
  return h ^ (h >>> 16);
};
const MAX_CAPACITY = 1 << 30;
function tableSizeFor(cap: number): number {
  let n = 1;
  while (n < cap) n *= 2;
  return Math.min(n, MAX_CAPACITY);
}
const f32 = Math.fround;

export class HashMap<K, V> extends AbstractMap<K, V> {
  private $table: (Node<K, V> | null)[] | null = null;
  private $count = 0;
  private $threshold = 0;

  /** new HashMap(), new HashMap(initialCapacity[, loadFactor]), new HashMap(map) */
  constructor(init?: number | AbstractMap<K, V>) {
    super();
    if (typeof init === "number") this.$threshold = tableSizeFor(init);
    else if (init instanceof AbstractMap) this.putAll(init);
  }

  private $resize(): (Node<K, V> | null)[] {
    const old = this.$table;
    const oldCap = old ? old.length : 0;
    let newCap: number;
    if (oldCap > 0) newCap = Math.min(oldCap * 2, MAX_CAPACITY);
    else newCap = this.$threshold > 0 ? this.$threshold : 16;
    this.$threshold = Math.floor(newCap * 0.75);
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
    this.$table = tab;
    return tab;
  }

  protected $node(k: unknown): Node<K, V> | null {
    const tab = this.$table;
    if (!tab) return null;
    const h = spread(k);
    for (let e = tab[(tab.length - 1) & h]; e; e = e.next) if (e.hash === h && jequals(e.key, k)) return e;
    return null;
  }
  /** Hooks for LinkedHashMap. */
  protected $newNode(h: number, k: K, v: V): Node<K, V> {
    return new Node(h, k, v);
  }
  protected $afterRemove(_e: Node<K, V>): void {}
  protected $afterAccess(_e: Node<K, V>): void {}
  protected $afterInsert(): void {}

  size(): number {
    return this.$count;
  }
  get(k: unknown): V | null {
    const e = this.$node(k);
    if (!e) return null;
    this.$afterAccess(e);
    return e.value;
  }
  override getOrDefault(k: unknown, d: V): V {
    const e = this.$node(k);
    if (!e) return d;
    this.$afterAccess(e);
    return e.value;
  }
  containsKey(k: unknown): boolean {
    return this.$node(k) !== null;
  }
  put(k: K, v: V): V | null {
    const tab = this.$table ?? this.$resize();
    const h = spread(k);
    const i = (tab.length - 1) & h;
    let e = tab[i];
    if (!e) tab[i] = this.$newNode(h, k, v);
    else {
      for (;;) {
        if (e.hash === h && jequals(e.key, k)) {
          const old = e.setValue(v);
          this.$afterAccess(e);
          return old;
        }
        if (!e.next) break;
        e = e.next;
      }
      e.next = this.$newNode(h, k, v);
    }
    this.$modCount++;
    if (++this.$count > this.$threshold) this.$resize();
    this.$afterInsert();
    return null;
  }
  override putAll(m: AbstractMap<K, V>): void {
    const s = m.size();
    if (s > 0) {
      if (!this.$table) {
        // Pre-size the table for the incoming entries, as java.util.HashMap does.
        const t = Math.trunc(f32(f32(s / 0.75) + 1));
        if (t > this.$threshold) this.$threshold = tableSizeFor(t);
      } else {
        while (s > this.$threshold && this.$table.length < MAX_CAPACITY) this.$resize();
      }
    }
    super.putAll(m);
  }
  protected $removeKey(k: unknown): Node<K, V> | null {
    const tab = this.$table;
    if (!tab) return null;
    const h = spread(k);
    const i = (tab.length - 1) & h;
    let prev: Node<K, V> | null = null;
    for (let e = tab[i]; e; prev = e, e = e.next) {
      if (e.hash === h && jequals(e.key, k)) {
        if (prev) prev.next = e.next;
        else tab[i] = e.next;
        this.$count--;
        this.$modCount++;
        this.$afterRemove(e);
        return e;
      }
    }
    return null;
  }
  clear(): void {
    if (this.$table && this.$count > 0) this.$table.fill(null);
    this.$count = 0;
    this.$modCount++;
  }
  $entryIterator(): JIterator<Entry<K, V>> {
    const tab = this.$table;
    let index = 0;
    let current: Node<K, V> | null = null;
    let expected = this.$modCount;
    const advance = (from: Node<K, V> | null): Node<K, V> | null => {
      let e = from ? from.next : null;
      while (!e && tab && index < tab.length) e = tab[index++];
      return e;
    };
    let next = this.$count > 0 ? advance(null) : null;
    return {
      hasNext: () => next !== null,
      next: () => {
        if (this.$modCount !== expected) throw new ConcurrentModificationException(null);
        if (!next) throw new NoSuchElementException(null);
        current = next;
        next = advance(current);
        return current;
      },
      remove: () => {
        if (!current) throw new IllegalStateException(null);
        if (this.$modCount !== expected) throw new ConcurrentModificationException(null);
        this.$removeKey(current.key);
        current = null;
        expected = this.$modCount;
      },
    };
  }
  clone(): HashMap<K, V> {
    return new (this.constructor as new (m: AbstractMap<K, V>) => HashMap<K, V>)(this);
  }
}
implement(HashMap as never, [Ifaces.Cloneable, Ifaces.Serializable]);

/** Insertion order (or access order with `new LinkedHashMap(capacity, loadFactor, true)`). */
export class LinkedHashMap<K, V> extends HashMap<K, V> {
  private $head: Node<K, V> | null = null;
  private $tail: Node<K, V> | null = null;
  private readonly $accessOrder: boolean;
  constructor(init?: number | AbstractMap<K, V>, _loadFactor?: number, accessOrder = false) {
    super(typeof init === "number" ? init : undefined);
    this.$accessOrder = accessOrder;
    if (init instanceof AbstractMap) this.putAll(init);
  }
  protected override $newNode(h: number, k: K, v: V): Node<K, V> {
    const e = new Node(h, k, v);
    e.before = this.$tail;
    if (this.$tail) this.$tail.after = e;
    else this.$head = e;
    this.$tail = e;
    return e;
  }
  protected override $afterRemove(e: Node<K, V>): void {
    if (e.before) e.before.after = e.after;
    else this.$head = e.after;
    if (e.after) e.after.before = e.before;
    else this.$tail = e.before;
    e.before = e.after = null;
  }
  protected override $afterAccess(e: Node<K, V>): void {
    if (!this.$accessOrder || this.$tail === e) return;
    this.$afterRemove(e);
    e.before = this.$tail;
    if (this.$tail) this.$tail.after = e;
    else this.$head = e;
    this.$tail = e;
    this.$modCount++;
  }
  protected override $afterInsert(): void {
    const eldest = this.$head;
    if (eldest && this.removeEldestEntry(eldest)) this.$removeKey(eldest.key);
  }
  /** Overridable in Java; always false here. */
  protected removeEldestEntry(_e: Entry<K, V>): boolean {
    return false;
  }
  override clear(): void {
    super.clear();
    this.$head = this.$tail = null;
  }
  override $entryIterator(): JIterator<Entry<K, V>> {
    let next = this.$head;
    let current: Node<K, V> | null = null;
    let expected = this.$modCount;
    return {
      hasNext: () => next !== null,
      next: () => {
        if (this.$modCount !== expected) throw new ConcurrentModificationException(null);
        if (!next) throw new NoSuchElementException(null);
        current = next;
        next = next.after;
        return current;
      },
      remove: () => {
        if (!current) throw new IllegalStateException(null);
        this.$removeKey(current.key);
        current = null;
        expected = this.$modCount;
      },
    };
  }
}

// --- TreeMap -------------------------------------------------------------------------------------------

export class TreeMap<K, V> extends AbstractMap<K, V> {
  private $es: Entry<K, V>[] = [];
  private readonly $cmp: Comparator<K>;
  /** new TreeMap(), new TreeMap(comparator), new TreeMap(map) (keeps a sorted map's comparator) */
  constructor(init?: unknown) {
    super();
    if (init instanceof AbstractMap) {
      this.$cmp = init instanceof TreeMap ? init.$cmp : null;
      this.putAll(init as AbstractMap<K, V>);
    } else this.$cmp = (init as Comparator<K>) ?? null;
  }
  private $c(a: unknown, b: unknown): number {
    if (this.$cmp) return this.$cmp.compare(a as K, b as K);
    if (a === null || a === undefined || b === null || b === undefined) throw new NullPointerException(null);
    return jcompare(a, b);
  }
  /** Index of the key, or -(insertion point) - 1. */
  private $find(k: unknown): number {
    let lo = 0;
    let hi = this.$es.length - 1;
    while (lo <= hi) {
      const mid = (lo + hi) >>> 1;
      const r = this.$c(this.$es[mid].key, k);
      if (r < 0) lo = mid + 1;
      else if (r > 0) hi = mid - 1;
      else return mid;
    }
    return -(lo + 1);
  }
  size(): number {
    return this.$es.length;
  }
  get(k: unknown): V | null {
    const i = this.$find(k);
    return i >= 0 ? this.$es[i].value : null;
  }
  containsKey(k: unknown): boolean {
    return this.$find(k) >= 0;
  }
  put(k: K, v: V): V | null {
    if (!this.$es.length) this.$c(k, k); // type and null check, as Java does
    const i = this.$find(k);
    if (i >= 0) return this.$es[i].setValue(v);
    this.$es.splice(-i - 1, 0, new Entry(k, v));
    this.$modCount++;
    return null;
  }
  protected $removeKey(k: unknown): Entry<K, V> | null {
    const i = this.$find(k);
    if (i < 0) return null;
    this.$modCount++;
    return this.$es.splice(i, 1)[0];
  }
  clear(): void {
    this.$modCount++;
    this.$es = [];
  }
  $entryIterator(): JIterator<Entry<K, V>> {
    let i = 0;
    let last = -1;
    let expected = this.$modCount;
    return {
      hasNext: () => i < this.$es.length,
      next: () => {
        if (this.$modCount !== expected) throw new ConcurrentModificationException(null);
        if (i >= this.$es.length) throw new NoSuchElementException(null);
        return this.$es[(last = i++)];
      },
      remove: () => {
        if (last < 0) throw new IllegalStateException(null);
        this.$es.splice(last, 1);
        i = last;
        last = -1;
        expected = ++this.$modCount;
      },
    };
  }
  comparator(): Comparator<K> {
    return this.$cmp;
  }
  private $at(i: number): Entry<K, V> | null {
    return i >= 0 && i < this.$es.length ? this.$es[i] : null;
  }
  /** Index of the greatest key below k (or at k when inclusive). */
  private $below(k: unknown, inclusive: boolean): number {
    const i = this.$find(k);
    return i >= 0 ? (inclusive ? i : i - 1) : -i - 2;
  }
  /** Index of the least key above k (or at k when inclusive). */
  private $above(k: unknown, inclusive: boolean): number {
    const i = this.$find(k);
    return i >= 0 ? (inclusive ? i : i + 1) : -i - 1;
  }
  private $key(e: Entry<K, V> | null): K | null {
    return e ? e.key : null;
  }
  private $first(): Entry<K, V> {
    if (!this.$es.length) throw new NoSuchElementException(null);
    return this.$es[0];
  }
  firstKey(): K {
    return this.$first().key;
  }
  lastKey(): K {
    if (!this.$es.length) throw new NoSuchElementException(null);
    return this.$es[this.$es.length - 1].key;
  }
  firstEntry(): Entry<K, V> | null {
    return this.$at(0);
  }
  lastEntry(): Entry<K, V> | null {
    return this.$at(this.$es.length - 1);
  }
  pollFirstEntry(): Entry<K, V> | null {
    if (!this.$es.length) return null;
    this.$modCount++;
    return this.$es.shift()!;
  }
  pollLastEntry(): Entry<K, V> | null {
    if (!this.$es.length) return null;
    this.$modCount++;
    return this.$es.pop()!;
  }
  floorEntry(k: K): Entry<K, V> | null {
    return this.$at(this.$below(k, true));
  }
  lowerEntry(k: K): Entry<K, V> | null {
    return this.$at(this.$below(k, false));
  }
  ceilingEntry(k: K): Entry<K, V> | null {
    return this.$at(this.$above(k, true));
  }
  higherEntry(k: K): Entry<K, V> | null {
    return this.$at(this.$above(k, false));
  }
  floorKey(k: K): K | null {
    return this.$key(this.floorEntry(k));
  }
  lowerKey(k: K): K | null {
    return this.$key(this.lowerEntry(k));
  }
  ceilingKey(k: K): K | null {
    return this.$key(this.ceilingEntry(k));
  }
  higherKey(k: K): K | null {
    return this.$key(this.higherEntry(k));
  }
  private $slice(from: number, to: number, cmp: Comparator<K> = this.$cmp): TreeMap<K, V> {
    const m = new TreeMap<K, V>(cmp);
    m.$es = this.$es.slice(Math.max(0, from), Math.max(0, to)).map((e) => new Entry(e.key, e.value));
    return m;
  }
  headMap(to: K, inclusive = false): TreeMap<K, V> {
    return this.$slice(0, this.$below(to, inclusive) + 1);
  }
  tailMap(from: K, inclusive = true): TreeMap<K, V> {
    return this.$slice(this.$above(from, inclusive), this.$es.length);
  }
  /** subMap(from, to) or subMap(from, fromInclusive, to, toInclusive) */
  subMap(from: K, a: unknown, b?: unknown, c?: unknown): TreeMap<K, V> {
    const [fi, to, ti] = arguments.length === 4 ? [a as boolean, b as K, c as boolean] : [true, a as K, false];
    return this.$slice(this.$above(from, fi), this.$below(to, ti) + 1);
  }
  descendingMap(): TreeMap<K, V> {
    const base = this.$cmp;
    const m = this.$slice(0, this.$es.length, { compare: (x: K, y: K) => (base ? base.compare(y, x) : jcompare(y, x)) });
    m.$es.reverse();
    return m;
  }
  navigableKeySet(): TreeSet<K> {
    return TreeSet.ofSorted(this.$es.map((e) => e.key), this.$cmp);
  }
  descendingKeySet(): TreeSet<K> {
    return this.descendingMap().navigableKeySet();
  }
  clone(): TreeMap<K, V> {
    return this.$slice(0, this.$es.length);
  }
}
implement(TreeMap as never, [Ifaces.NavigableMap, Ifaces.Cloneable, Ifaces.Serializable]);

// --- sets ----------------------------------------------------------------------------------------------

export class HashSet<T> extends AbstractCollection<T> {
  protected $map: HashMap<T, boolean>;
  /** new HashSet(), new HashSet(capacity[, loadFactor]), new HashSet(collection) */
  constructor(init?: number | unknown, map?: HashMap<T, boolean>) {
    super();
    if (map) this.$map = map;
    else if (typeof init === "number") this.$map = new HashMap(init);
    else if (init !== undefined && init !== null) this.$map = new HashMap(Math.max(Math.trunc(f32(sizeOf(init) / 0.75)) + 1, 16));
    else this.$map = new HashMap();
    if (init !== undefined && init !== null && typeof init !== "number") for (const x of elementsOf<T>(init)) this.add(x);
  }
  size(): number {
    return this.$map.size();
  }
  override add(x: T): boolean {
    return this.$map.put(x, true) === null;
  }
  override contains(o: unknown): boolean {
    return this.$map.containsKey(o);
  }
  override remove(o: unknown): boolean {
    return this.$map.remove(o) !== null;
  }
  override clear(): void {
    this.$map.clear();
  }
  iterator(): JIterator<T> {
    return this.$map.keySet().iterator();
  }
  override equals(o: unknown): boolean {
    if (o === this) return true;
    return isInstance(o, Ifaces.Set) && sizeOf(o) === this.size() && this.containsAll(o);
  }
  override hashCode(): number {
    let h = 0;
    for (const x of this) h = (h + jhash(x)) | 0;
    return h;
  }
  clone(): HashSet<T> {
    return new (this.constructor as new (c: unknown) => HashSet<T>)(this);
  }
}
implement(HashSet as never, [Ifaces.Set, Ifaces.Cloneable, Ifaces.Serializable]);

export class LinkedHashSet<T> extends HashSet<T> {
  constructor(init?: number | unknown) {
    super(typeof init === "number" ? init : undefined, new LinkedHashMap<T, boolean>(typeof init === "number" ? init : undefined));
    if (init !== undefined && init !== null && typeof init !== "number") for (const x of elementsOf<T>(init)) this.add(x);
  }
}

export class TreeSet<T> extends AbstractCollection<T> {
  private $map: TreeMap<T, boolean>;
  /** new TreeSet(), new TreeSet(comparator), new TreeSet(collection) (a sorted set keeps its comparator) */
  constructor(init?: unknown) {
    super();
    const isCmp = init !== null && typeof init === "object" && typeof (init as { compare?: unknown }).compare === "function";
    if (isCmp) this.$map = new TreeMap<T, boolean>(init);
    else {
      this.$map = new TreeMap<T, boolean>(init instanceof TreeSet ? init.comparator() : null);
      if (init !== undefined && init !== null) for (const x of elementsOf<T>(init)) this.add(x);
    }
  }
  /** A set over keys already in order (no comparisons). */
  static ofSorted<T>(keys: T[], cmp: Comparator<T>): TreeSet<T> {
    const s = new TreeSet<T>(cmp ?? undefined);
    for (const k of keys) s.add(k);
    return s;
  }
  size(): number {
    return this.$map.size();
  }
  override add(x: T): boolean {
    return this.$map.put(x, true) === null;
  }
  override contains(o: unknown): boolean {
    return this.$map.containsKey(o);
  }
  override remove(o: unknown): boolean {
    return this.$map.remove(o) !== null;
  }
  override clear(): void {
    this.$map.clear();
  }
  iterator(): JIterator<T> {
    return this.$map.keySet().iterator();
  }
  descendingIterator(): JIterator<T> {
    return this.descendingSet().iterator();
  }
  comparator(): Comparator<T> {
    return this.$map.comparator();
  }
  first(): T {
    return this.$map.firstKey();
  }
  last(): T {
    return this.$map.lastKey();
  }
  floor(x: T): T | null {
    return this.$map.floorKey(x);
  }
  lower(x: T): T | null {
    return this.$map.lowerKey(x);
  }
  ceiling(x: T): T | null {
    return this.$map.ceilingKey(x);
  }
  higher(x: T): T | null {
    return this.$map.higherKey(x);
  }
  pollFirst(): T | null {
    const e = this.$map.pollFirstEntry();
    return e ? e.key : null;
  }
  pollLast(): T | null {
    const e = this.$map.pollLastEntry();
    return e ? e.key : null;
  }
  private static from<T>(m: TreeMap<T, boolean>): TreeSet<T> {
    const s = new TreeSet<T>();
    s.$map = m;
    return s;
  }
  headSet(to: T, inclusive = false): TreeSet<T> {
    return TreeSet.from(this.$map.headMap(to, inclusive));
  }
  tailSet(from: T, inclusive = true): TreeSet<T> {
    return TreeSet.from(this.$map.tailMap(from, inclusive));
  }
  /** subSet(from, to) or subSet(from, fromInclusive, to, toInclusive) */
  subSet(from: T, a: unknown, b?: unknown, c?: unknown): TreeSet<T> {
    return TreeSet.from(arguments.length === 4 ? this.$map.subMap(from, a, b, c) : this.$map.subMap(from, a));
  }
  descendingSet(): TreeSet<T> {
    return TreeSet.from(this.$map.descendingMap());
  }
  override equals(o: unknown): boolean {
    if (o === this) return true;
    return isInstance(o, Ifaces.Set) && sizeOf(o) === this.size() && this.containsAll(o);
  }
  override hashCode(): number {
    let h = 0;
    for (const x of this) h = (h + jhash(x)) | 0;
    return h;
  }
  clone(): TreeSet<T> {
    return TreeSet.from(this.$map.clone());
  }
}
implement(TreeSet as never, [Ifaces.NavigableSet, Ifaces.Cloneable, Ifaces.Serializable]);

/** Map.of / Collections.unmodifiableMap...: read-only maps (insertion order). */
export class ImmutableMap<K, V> extends LinkedHashMap<K, V> {
  private $frozen = false;
  /** From alternating keys and values (null keys or values and duplicate keys are errors, like Map.of). */
  static of<K, V>(kv: unknown[]): ImmutableMap<K, V> {
    const m = new ImmutableMap<K, V>();
    for (let i = 0; i < kv.length; i += 2) {
      if (kv[i] === null || kv[i + 1] === null) throw new NullPointerException(null);
      if (m.containsKey(kv[i])) throw new IllegalArgumentException(`duplicate key: ${valueOf(kv[i])}`);
      m.put(kv[i] as K, kv[i + 1] as V);
    }
    return m.freeze();
  }
  freeze(): this {
    this.$frozen = true;
    return this;
  }
  override put(k: K, v: V): V | null {
    if (this.$frozen) throw new UnsupportedOperationException(null);
    return super.put(k, v);
  }
  protected override $removeKey(k: unknown): Node<K, V> | null {
    if (this.$frozen) throw new UnsupportedOperationException(null);
    return super.$removeKey(k);
  }
  override clear(): void {
    if (this.$frozen) throw new UnsupportedOperationException(null);
    super.clear();
  }
}

/** Set.of / Collections.emptySet/singleton/unmodifiableSet: read-only sets (insertion order). */
export class ImmutableSet<T> extends LinkedHashSet<T> {
  private $frozen = false;
  freeze(): this {
    this.$frozen = true;
    return this;
  }
  override add(x: T): boolean {
    if (this.$frozen) throw new UnsupportedOperationException(null);
    return super.add(x);
  }
  override remove(o: unknown): boolean {
    if (this.$frozen) throw new UnsupportedOperationException(null);
    return super.remove(o);
  }
  override clear(): void {
    if (this.$frozen) throw new UnsupportedOperationException(null);
    super.clear();
  }
}
