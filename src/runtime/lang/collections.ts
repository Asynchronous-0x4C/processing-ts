// java.util collections (lists and queues) with Java semantics: equals/hashCode elements, fail-fast
// iterators (ConcurrentModificationException at the same moments as Java), views (subList,
// unmodifiableList, Arrays.asList write through), and the printed order of ArrayDeque/PriorityQueue
// (the binary heap is laid out like Java's, so `println(queue)` matches). Maps and sets are in maps.ts.
// The java.util interfaces are registered here so `x instanceof List` works and user classes that
// implement Iterator/Iterable get the default methods.
import { ConcurrentModificationException, EmptyStackException, IllegalStateException, IndexOutOfBoundsException, NoSuchElementException, UnsupportedOperationException } from "./exceptions.ts";
import { jcompare, jequals, jhash } from "./misc.ts";
import { JObject, implement, isInstance, libraryIface, type Iface } from "./objects.ts";
import { valueOf } from "./strings.ts";

export interface JIterator<T> {
  hasNext(): boolean;
  next(): T;
  remove(): void;
}
export type Comparator<T> = { compare(a: T, b: T): number } | null | undefined;
type Consumer<T> = { accept(x: T): void };
type Predicate<T> = { test(x: T): boolean };
type UnaryOp<T> = { apply(x: T): T };

// --- interfaces --------------------------------------------------------------------------------------

const IterableI = libraryIface("java.lang.Iterable", [], {
  forEach<T>(this: { iterator(): JIterator<T> }, f: Consumer<T>) {
    const it = this.iterator();
    while (it.hasNext()) f.accept(it.next());
  },
});
const CollectionI = libraryIface("java.util.Collection", [IterableI]);
const SetI = libraryIface("java.util.Set", [CollectionI]);
const SortedSetI = libraryIface("java.util.SortedSet", [SetI]);
const QueueI = libraryIface("java.util.Queue", [CollectionI]);
const MapI = libraryIface("java.util.Map");
const SortedMapI = libraryIface("java.util.SortedMap", [MapI]);
export const Ifaces = {
  Iterable: IterableI,
  Collection: CollectionI,
  List: libraryIface("java.util.List", [CollectionI]),
  Set: SetI,
  SortedSet: SortedSetI,
  NavigableSet: libraryIface("java.util.NavigableSet", [SortedSetI]),
  Queue: QueueI,
  Deque: libraryIface("java.util.Deque", [QueueI]),
  Map: MapI,
  SortedMap: SortedMapI,
  NavigableMap: libraryIface("java.util.NavigableMap", [SortedMapI]),
  MapEntry: libraryIface("java.util.Map$Entry"),
  RandomAccess: libraryIface("java.util.RandomAccess"),
  Cloneable: libraryIface("java.lang.Cloneable"),
  Serializable: libraryIface("java.io.Serializable"),
  Iterator: libraryIface("java.util.Iterator", [], {
    remove() {
      throw new UnsupportedOperationException("remove");
    },
    forEachRemaining<T>(this: JIterator<T>, f: Consumer<T>) {
      while (this.hasNext()) f.accept(this.next());
    },
  }),
};
libraryIface("java.util.ListIterator", [Ifaces.Iterator]);

/** Elements of a Java collection, an Iterable, a JS iterable or an array-like. */
export function* elementsOf<T>(c: unknown): Generator<T> {
  if (c === null || c === undefined) return;
  if (typeof (c as { iterator?: unknown }).iterator === "function") {
    const it = (c as { iterator(): JIterator<T> }).iterator();
    while (it.hasNext()) yield it.next();
  } else if (typeof (c as Iterable<T>)[Symbol.iterator] === "function") yield* c as Iterable<T>;
  else for (const x of Array.from(c as ArrayLike<T>)) yield x;
}

/** Collection size without iterating when possible. */
export const sizeOf = (c: unknown): number =>
  typeof (c as { size?: unknown }).size === "function" ? (c as { size(): number }).size() : Array.from(elementsOf(c)).length;

const text = (x: unknown, self: unknown) => (x === self ? "(this Collection)" : valueOf(x));
const cmpFn = <T>(c: Comparator<T>) => (c ? (x: T, y: T) => c.compare(x, y) : (x: T, y: T) => jcompare(x, y));
const outOfBounds = (i: number, n: number) => new IndexOutOfBoundsException(`Index ${i} out of bounds for length ${n}`);

export abstract class AbstractCollection<T> extends JObject {
  /** Structural modification count, checked by iterators (public for the iterator classes). */
  $modCount = 0;
  abstract iterator(): JIterator<T>;
  abstract size(): number;
  isEmpty(): boolean {
    return this.size() === 0;
  }
  add(_x: T): boolean {
    throw new UnsupportedOperationException(null);
  }
  contains(o: unknown): boolean {
    for (const x of this) if (jequals(x, o)) return true;
    return false;
  }
  containsAll(c: unknown): boolean {
    for (const x of elementsOf(c)) if (!this.contains(x)) return false;
    return true;
  }
  addAll(c: unknown): boolean {
    let changed = false;
    for (const x of Array.from(elementsOf<T>(c))) changed = this.add(x) || changed;
    return changed;
  }
  remove(o: unknown): boolean {
    const it = this.iterator();
    while (it.hasNext()) {
      if (jequals(it.next(), o)) {
        it.remove();
        return true;
      }
    }
    return false;
  }
  removeIf(p: Predicate<T>): boolean {
    let changed = false;
    const it = this.iterator();
    while (it.hasNext()) {
      if (p.test(it.next())) {
        it.remove();
        changed = true;
      }
    }
    return changed;
  }
  removeAll(c: unknown): boolean {
    const drop = Array.from(elementsOf(c));
    return this.removeIf({ test: (x) => drop.some((d) => jequals(x, d)) });
  }
  retainAll(c: unknown): boolean {
    const keep = Array.from(elementsOf(c));
    return this.removeIf({ test: (x) => !keep.some((d) => jequals(x, d)) });
  }
  clear(): void {
    const it = this.iterator();
    while (it.hasNext()) {
      it.next();
      it.remove();
    }
  }
  toArray(_a?: unknown): T[] {
    return Array.from(this);
  }
  forEach(f: Consumer<T>): void {
    for (const x of this) f.accept(x);
  }
  stream(): never {
    throw new UnsupportedOperationException("streams are not available in processing-ts");
  }
  *[Symbol.iterator](): Generator<T> {
    const it = this.iterator();
    while (it.hasNext()) yield it.next();
  }
  override toString(): string {
    return "[" + Array.from(this, (x) => text(x, this)).join(", ") + "]";
  }
}
implement(AbstractCollection as never, [CollectionI]);

// --- lists -------------------------------------------------------------------------------------------

/** Index-based list iterator, fail-fast like java.util.AbstractList's. */
class ListItr<T> {
  private cursor: number;
  private lastRet = -1;
  private $expected: number;
  private readonly list: AbstractList<T>;
  constructor(list: AbstractList<T>, index: number) {
    this.list = list;
    this.cursor = index;
    this.$expected = list.$modCount;
  }
  private $check() {
    if (this.list.$modCount !== this.$expected) throw new ConcurrentModificationException(null);
  }
  hasNext(): boolean {
    return this.cursor !== this.list.size();
  }
  next(): T {
    this.$check();
    const i = this.cursor;
    if (i >= this.list.size()) throw new NoSuchElementException(null);
    this.cursor = i + 1;
    return this.list.get((this.lastRet = i));
  }
  hasPrevious(): boolean {
    return this.cursor !== 0;
  }
  previous(): T {
    this.$check();
    const i = this.cursor - 1;
    if (i < 0) throw new NoSuchElementException(null);
    this.cursor = i;
    return this.list.get((this.lastRet = i));
  }
  nextIndex(): number {
    return this.cursor;
  }
  previousIndex(): number {
    return this.cursor - 1;
  }
  remove(): void {
    if (this.lastRet < 0) throw new IllegalStateException(null);
    this.$check();
    this.list.removeAt(this.lastRet);
    this.cursor = this.lastRet;
    this.lastRet = -1;
    this.$expected = this.list.$modCount;
  }
  set(e: T): void {
    if (this.lastRet < 0) throw new IllegalStateException(null);
    this.$check();
    this.list.set(this.lastRet, e);
  }
  add(e: T): void {
    this.$check();
    this.list.$addAt(this.cursor++, e);
    this.lastRet = -1;
    this.$expected = this.list.$modCount;
  }
  forEachRemaining(f: Consumer<T>): void {
    while (this.hasNext()) f.accept(this.next());
  }
}
implement(ListItr as never, [libraryIface("java.util.ListIterator")]);

export abstract class AbstractList<T> extends AbstractCollection<T> {
  abstract get(i: number): T;
  set(_i: number, _v: T): T {
    throw new UnsupportedOperationException(null);
  }
  /** add(int, E) */
  $addAt(_i: number, _v: T): void {
    throw new UnsupportedOperationException(null);
  }
  /** remove(int) (the compiler emits removeAt for it) */
  removeAt(_i: number): T {
    throw new UnsupportedOperationException(null);
  }
  /** add(e) or add(index, e) */
  override add(x: T | number, y?: T): boolean {
    if (arguments.length === 2) {
      this.$addAt(x as number, y as T);
      return true;
    }
    this.$addAt(this.size(), x as T);
    return true;
  }
  /** addAll(c) or addAll(index, c) */
  override addAll(x: unknown, y?: unknown): boolean {
    let at = arguments.length === 2 ? (x as number) : this.size();
    const items = Array.from(elementsOf<T>(arguments.length === 2 ? y : x));
    if (at < 0 || at > this.size()) throw outOfBounds(at, this.size());
    for (const e of items) this.$addAt(at++, e);
    return items.length > 0;
  }
  override remove(o: unknown): boolean {
    const i = this.indexOf(o);
    if (i < 0) return false;
    this.removeAt(i);
    return true;
  }
  indexOf(o: unknown): number {
    for (let i = 0, n = this.size(); i < n; i++) if (jequals(this.get(i), o)) return i;
    return -1;
  }
  lastIndexOf(o: unknown): number {
    for (let i = this.size() - 1; i >= 0; i--) if (jequals(this.get(i), o)) return i;
    return -1;
  }
  override contains(o: unknown): boolean {
    return this.indexOf(o) >= 0;
  }
  override clear(): void {
    for (let i = this.size() - 1; i >= 0; i--) this.removeAt(i);
  }
  iterator(): JIterator<T> {
    return new ListItr(this, 0);
  }
  listIterator(index = 0): ListItr<T> {
    if (index < 0 || index > this.size()) throw new IndexOutOfBoundsException(`Index: ${index}`);
    return new ListItr(this, index);
  }
  subList(from: number, to: number): AbstractList<T> {
    if (from < 0) throw new IndexOutOfBoundsException(`fromIndex = ${from}`);
    if (to > this.size()) throw new IndexOutOfBoundsException(`toIndex = ${to}`);
    if (from > to) throw new IndexOutOfBoundsException(`fromIndex(${from}) > toIndex(${to})`);
    return new SubList(this, from, to - from);
  }
  sort(c: Comparator<T>): void {
    const items = this.toArray().sort(cmpFn(c));
    for (let i = 0; i < items.length; i++) this.set(i, items[i]);
    this.$modCount++;
  }
  replaceAll(f: UnaryOp<T>): void {
    for (let i = 0, n = this.size(); i < n; i++) this.set(i, f.apply(this.get(i)));
  }
  override removeIf(p: Predicate<T>): boolean {
    let changed = false;
    for (let i = this.size() - 1; i >= 0; i--) {
      if (p.test(this.get(i))) {
        this.removeAt(i);
        changed = true;
      }
    }
    return changed;
  }
  override toArray(_a?: unknown): T[] {
    const out: T[] = [];
    for (let i = 0, n = this.size(); i < n; i++) out.push(this.get(i));
    return out;
  }
  override equals(o: unknown): boolean {
    if (o === this) return true;
    if (!isInstance(o, Ifaces.List)) return false;
    const other = o as AbstractList<T>;
    if (other.size() !== this.size()) return false;
    const a = this.iterator();
    const b = other.iterator();
    while (a.hasNext()) if (!jequals(a.next(), b.next())) return false;
    return true;
  }
  override hashCode(): number {
    let h = 1;
    for (const x of this) h = (Math.imul(31, h) + jhash(x)) | 0;
    return h;
  }
}
implement(AbstractList as never, [Ifaces.List]);

export class ArrayList<T> extends AbstractList<T> {
  protected $a: T[] = [];

  /** new ArrayList(), new ArrayList(capacity), new ArrayList(collection) */
  constructor(init?: number | unknown) {
    super();
    if (init !== undefined && typeof init !== "number") this.$a = Array.from(elementsOf<T>(init));
  }
  protected $check(i: number) {
    if (i < 0 || i >= this.$a.length) throw outOfBounds(i, this.$a.length);
  }
  size(): number {
    return this.$a.length;
  }
  get(i: number): T {
    this.$check(i);
    return this.$a[i];
  }
  override set(i: number, v: T): T {
    this.$check(i);
    const old = this.$a[i];
    this.$a[i] = v;
    return old;
  }
  override $addAt(i: number, v: T): void {
    if (i < 0 || i > this.$a.length) throw outOfBounds(i, this.$a.length);
    this.$modCount++;
    if (i === this.$a.length) this.$a.push(v);
    else this.$a.splice(i, 0, v);
  }
  override removeAt(i: number): T {
    this.$check(i);
    this.$modCount++;
    return this.$a.splice(i, 1)[0];
  }
  override indexOf(o: unknown): number {
    return this.$a.findIndex((x) => jequals(x, o));
  }
  override clear(): void {
    this.$modCount++;
    this.$a.length = 0;
  }
  override sort(c: Comparator<T>): void {
    this.$a.sort(cmpFn(c));
    this.$modCount++;
  }
  override removeIf(p: Predicate<T>): boolean {
    const kept = this.$a.filter((x) => !p.test(x));
    if (kept.length === this.$a.length) return false;
    this.$a = kept;
    this.$modCount++;
    return true;
  }
  override toArray(_a?: unknown): T[] {
    return this.$a.slice();
  }
  ensureCapacity(_n: number): void {}
  trimToSize(): void {}
  clone(): ArrayList<T> {
    const c = new (this.constructor as new () => ArrayList<T>)();
    c.$a = this.$a.slice();
    return c;
  }
}
implement(ArrayList as never, [Ifaces.RandomAccess, Ifaces.Cloneable, Ifaces.Serializable]);

/** Live view of a range of a list (List.subList). */
class SubList<T> extends AbstractList<T> {
  private readonly $root: AbstractList<T>;
  private readonly $offset: number;
  private $n: number;
  private $expected: number;
  constructor(root: AbstractList<T>, offset: number, n: number) {
    super();
    this.$root = root;
    this.$offset = offset;
    this.$n = n;
    this.$expected = root.$modCount;
  }
  private $checkMod() {
    if (this.$root.$modCount !== this.$expected) throw new ConcurrentModificationException(null);
  }
  private $range(i: number, n = this.$n) {
    if (i < 0 || i >= n) throw outOfBounds(i, this.$n);
  }
  size(): number {
    this.$checkMod();
    return this.$n;
  }
  get(i: number): T {
    this.$range(i);
    this.$checkMod();
    return this.$root.get(this.$offset + i);
  }
  override set(i: number, v: T): T {
    this.$range(i);
    this.$checkMod();
    return this.$root.set(this.$offset + i, v);
  }
  override $addAt(i: number, v: T): void {
    this.$range(i, this.$n + 1);
    this.$checkMod();
    this.$root.$addAt(this.$offset + i, v);
    this.$expected = this.$root.$modCount;
    this.$modCount++;
    this.$n++;
  }
  override removeAt(i: number): T {
    this.$range(i);
    this.$checkMod();
    const r = this.$root.removeAt(this.$offset + i);
    this.$expected = this.$root.$modCount;
    this.$modCount++;
    this.$n--;
    return r;
  }
}

/** Arrays.asList: fixed size, backed by the array (set writes through, add/remove throw). */
export class ArraysAsList<T> extends AbstractList<T> {
  private readonly $a: T[];
  constructor(a: T[]) {
    super();
    this.$a = a;
  }
  size(): number {
    return this.$a.length;
  }
  get(i: number): T {
    if (i < 0 || i >= this.$a.length) throw new IndexOutOfBoundsException(`Index ${i} out of bounds for length ${this.$a.length}`);
    return this.$a[i];
  }
  override set(i: number, v: T): T {
    const old = this.get(i);
    this.$a[i] = v;
    return old;
  }
  override sort(c: Comparator<T>): void {
    this.$a.sort(cmpFn(c));
    this.$modCount++;
  }
}
implement(ArraysAsList as never, [Ifaces.RandomAccess, Ifaces.Serializable]);

/** List.of, Collections.emptyList/singletonList/nCopies: immutable lists. */
export class ImmutableList<T> extends AbstractList<T> {
  private readonly $a: T[];
  constructor(a: T[]) {
    super();
    this.$a = a;
  }
  size(): number {
    return this.$a.length;
  }
  get(i: number): T {
    if (i < 0 || i >= this.$a.length) throw outOfBounds(i, this.$a.length);
    return this.$a[i];
  }
  override sort(): void {
    throw new UnsupportedOperationException(null);
  }
  override removeIf(): boolean {
    throw new UnsupportedOperationException(null);
  }
  override clear(): void {
    throw new UnsupportedOperationException(null);
  }
}
implement(ImmutableList as never, [Ifaces.RandomAccess]);

/** Collections.unmodifiableList: a read-only live view. */
export class UnmodifiableList<T> extends AbstractList<T> {
  private readonly $src: AbstractList<T>;
  constructor(src: AbstractList<T>) {
    super();
    this.$src = src;
  }
  size(): number {
    return this.$src.size();
  }
  get(i: number): T {
    return this.$src.get(i);
  }
  override sort(): void {
    throw new UnsupportedOperationException(null);
  }
  override removeIf(): boolean {
    throw new UnsupportedOperationException(null);
  }
  override clear(): void {
    throw new UnsupportedOperationException(null);
  }
  override equals(o: unknown): boolean {
    return o === this || this.$src.equals(o);
  }
  override hashCode(): number {
    return this.$src.hashCode();
  }
}

// --- deques ------------------------------------------------------------------------------------------

/** Deque operations over an array `a` (LinkedList and ArrayDeque). */
interface DequeHost<T> {
  $a: T[];
  $modCount: number;
}
const dequeMethods = {
  addFirst<T>(this: DequeHost<T>, x: T): void {
    this.$modCount++;
    this.$a.unshift(x);
  },
  addLast<T>(this: DequeHost<T>, x: T): void {
    this.$modCount++;
    this.$a.push(x);
  },
  offerFirst<T>(this: DequeHost<T>, x: T): boolean {
    dequeMethods.addFirst.call(this, x);
    return true;
  },
  offerLast<T>(this: DequeHost<T>, x: T): boolean {
    dequeMethods.addLast.call(this, x);
    return true;
  },
  offer<T>(this: DequeHost<T>, x: T): boolean {
    dequeMethods.addLast.call(this, x);
    return true;
  },
  push<T>(this: DequeHost<T>, x: T): void {
    dequeMethods.addFirst.call(this, x);
  },
  pollFirst<T>(this: DequeHost<T>): T | null {
    if (!this.$a.length) return null;
    this.$modCount++;
    return this.$a.shift()!;
  },
  pollLast<T>(this: DequeHost<T>): T | null {
    if (!this.$a.length) return null;
    this.$modCount++;
    return this.$a.pop()!;
  },
  poll<T>(this: DequeHost<T>): T | null {
    return dequeMethods.pollFirst.call(this) as T | null;
  },
  removeFirst<T>(this: DequeHost<T>): T {
    if (!this.$a.length) throw new NoSuchElementException(null);
    return dequeMethods.pollFirst.call(this) as T;
  },
  removeLast<T>(this: DequeHost<T>): T {
    if (!this.$a.length) throw new NoSuchElementException(null);
    return dequeMethods.pollLast.call(this) as T;
  },
  pop<T>(this: DequeHost<T>): T {
    return dequeMethods.removeFirst.call(this) as T;
  },
  peekFirst<T>(this: DequeHost<T>): T | null {
    return this.$a.length ? this.$a[0] : null;
  },
  peekLast<T>(this: DequeHost<T>): T | null {
    return this.$a.length ? this.$a[this.$a.length - 1] : null;
  },
  peek<T>(this: DequeHost<T>): T | null {
    return this.$a.length ? this.$a[0] : null;
  },
  getFirst<T>(this: DequeHost<T>): T {
    if (!this.$a.length) throw new NoSuchElementException(null);
    return this.$a[0];
  },
  getLast<T>(this: DequeHost<T>): T {
    if (!this.$a.length) throw new NoSuchElementException(null);
    return this.$a[this.$a.length - 1];
  },
  element<T>(this: DequeHost<T>): T {
    return dequeMethods.getFirst.call(this) as T;
  },
  removeFirstOccurrence<T>(this: DequeHost<T>, o: unknown): boolean {
    const i = this.$a.findIndex((x) => jequals(x, o));
    if (i < 0) return false;
    this.$modCount++;
    this.$a.splice(i, 1);
    return true;
  },
  removeLastOccurrence<T>(this: DequeHost<T>, o: unknown): boolean {
    for (let i = this.$a.length - 1; i >= 0; i--) {
      if (jequals(this.$a[i], o)) {
        this.$modCount++;
        this.$a.splice(i, 1);
        return true;
      }
    }
    return false;
  },
  descendingIterator<T>(this: DequeHost<T>): JIterator<T> {
    let i = this.$a.length;
    let last = -1;
    let expected = this.$modCount;
    return {
      hasNext: () => i > 0,
      next: () => {
        if (this.$modCount !== expected) throw new ConcurrentModificationException(null);
        if (i <= 0) throw new NoSuchElementException(null);
        return this.$a[(last = --i)];
      },
      remove: () => {
        if (last < 0) throw new IllegalStateException(null);
        this.$a.splice(last, 1);
        last = -1;
        expected = ++this.$modCount;
      },
    };
  },
};
type DequeMethods<T> = {
  addFirst(x: T): void; addLast(x: T): void; offerFirst(x: T): boolean; offerLast(x: T): boolean; offer(x: T): boolean; push(x: T): void;
  pollFirst(): T | null; pollLast(): T | null; poll(): T | null; removeFirst(): T; removeLast(): T; pop(): T;
  peekFirst(): T | null; peekLast(): T | null; peek(): T | null; getFirst(): T; getLast(): T; element(): T;
  removeFirstOccurrence(o: unknown): boolean; removeLastOccurrence(o: unknown): boolean; descendingIterator(): JIterator<T>;
};

export class LinkedList<T> extends ArrayList<T> {
  /** remove() (the head), remove(Object) */
  override remove(o?: unknown): boolean {
    if (arguments.length === 0) return (this as unknown as DequeMethods<T>).removeFirst() as unknown as boolean;
    return super.remove(o);
  }
}
export interface LinkedList<T> extends DequeMethods<T> {}
Object.assign(LinkedList.prototype, dequeMethods);
implement(LinkedList as never, [Ifaces.Deque]);

export class ArrayDeque<T> extends AbstractCollection<T> {
  $a: T[] = [];
  /** new ArrayDeque(), new ArrayDeque(capacity), new ArrayDeque(collection) */
  constructor(init?: number | unknown) {
    super();
    if (init !== undefined && typeof init !== "number") this.$a = Array.from(elementsOf<T>(init));
  }
  size(): number {
    return this.$a.length;
  }
  override add(x: T): boolean {
    this.$modCount++;
    this.$a.push(x);
    return true;
  }
  /** remove() (the head), remove(Object) */
  override remove(o?: unknown): boolean {
    if (arguments.length === 0) return (this as unknown as DequeMethods<T>).removeFirst() as unknown as boolean;
    return (this as unknown as DequeMethods<T>).removeFirstOccurrence(o);
  }
  override contains(o: unknown): boolean {
    return this.$a.some((x) => jequals(x, o));
  }
  override clear(): void {
    this.$modCount++;
    this.$a.length = 0;
  }
  iterator(): JIterator<T> {
    let i = 0;
    let last = -1;
    let expected = this.$modCount;
    return {
      hasNext: () => i < this.$a.length,
      next: () => {
        if (this.$modCount !== expected) throw new ConcurrentModificationException(null);
        if (i >= this.$a.length) throw new NoSuchElementException(null);
        return this.$a[(last = i++)];
      },
      remove: () => {
        if (last < 0) throw new IllegalStateException(null);
        this.$a.splice(last, 1);
        i = last;
        last = -1;
        expected = ++this.$modCount;
      },
    };
  }
  clone(): ArrayDeque<T> {
    return new ArrayDeque<T>(this.$a);
  }
}
export interface ArrayDeque<T> extends DequeMethods<T> {}
Object.assign(ArrayDeque.prototype, dequeMethods);
implement(ArrayDeque as never, [Ifaces.Deque, Ifaces.Cloneable, Ifaces.Serializable]);

// --- legacy lists and copy-on-write --------------------------------------------------------------------

export class Vector<T> extends ArrayList<T> {
  addElement(x: T): void {
    this.add(x);
  }
  insertElementAt(x: T, i: number): void {
    this.$addAt(i, x);
  }
  elementAt(i: number): T {
    return this.get(i);
  }
  setElementAt(x: T, i: number): void {
    this.set(i, x);
  }
  removeElementAt(i: number): void {
    this.removeAt(i);
  }
  removeElement(o: unknown): boolean {
    return this.remove(o);
  }
  removeAllElements(): void {
    this.clear();
  }
  firstElement(): T {
    if (!this.$a.length) throw new NoSuchElementException(null);
    return this.$a[0];
  }
  lastElement(): T {
    if (!this.$a.length) throw new NoSuchElementException(null);
    return this.$a[this.$a.length - 1];
  }
}

export class Stack<T> extends Vector<T> {
  push(x: T): T {
    this.add(x);
    return x;
  }
  pop(): T {
    const x = this.peek();
    this.removeAt(this.$a.length - 1);
    return x;
  }
  peek(): T {
    if (!this.$a.length) throw new EmptyStackException(null);
    return this.$a[this.$a.length - 1];
  }
  empty(): boolean {
    return this.$a.length === 0;
  }
  /** 1-based distance from the top, -1 if absent. */
  search(o: unknown): number {
    const i = this.lastIndexOf(o);
    return i >= 0 ? this.$a.length - i : -1;
  }
}

/** Iterators work on a snapshot: the list can change while it is iterated (no exception). */
export class CopyOnWriteArrayList<T> extends ArrayList<T> {
  override iterator(): JIterator<T> {
    const snap = this.$a.slice();
    let i = 0;
    return {
      hasNext: () => i < snap.length,
      next: () => {
        if (i >= snap.length) throw new NoSuchElementException(null);
        return snap[i++];
      },
      remove: () => {
        throw new UnsupportedOperationException(null);
      },
    };
  }
  addIfAbsent(x: T): boolean {
    if (this.contains(x)) return false;
    this.add(x);
    return true;
  }
}

// --- PriorityQueue -------------------------------------------------------------------------------------

/** Binary heap laid out like java.util.PriorityQueue (its toString/iterator show the heap order). */
export class PriorityQueue<T> extends AbstractCollection<T> {
  private $q: T[] = [];
  private readonly $cmp: Comparator<T>;
  /** (), (capacity), (comparator), (capacity, comparator), (collection) */
  constructor(x?: unknown, y?: unknown) {
    super();
    const isCmp = (v: unknown) => v !== null && typeof v === "object" && typeof (v as { compare?: unknown }).compare === "function";
    if (isCmp(y)) this.$cmp = y as Comparator<T>;
    else if (isCmp(x)) this.$cmp = x as Comparator<T>;
    else this.$cmp = null;
    if (x !== undefined && x !== null && typeof x === "object" && !isCmp(x)) {
      if (x instanceof PriorityQueue) {
        this.$cmp = x.$cmp;
        this.$q = x.$q.slice();
      } else if (typeof (x as { comparator?: unknown }).comparator === "function" && isInstance(x, Ifaces.SortedSet)) {
        this.$cmp = (x as { comparator(): Comparator<T> }).comparator();
        this.$q = Array.from(elementsOf<T>(x));
      } else {
        this.$q = Array.from(elementsOf<T>(x));
        for (let i = (this.$q.length >>> 1) - 1; i >= 0; i--) this.$siftDown(i, this.$q[i]);
      }
    }
  }
  private $c(a: T, b: T): number {
    return this.$cmp ? this.$cmp.compare(a, b) : jcompare(a, b);
  }
  private $siftUp(k: number, x: T) {
    while (k > 0) {
      const parent = (k - 1) >>> 1;
      const e = this.$q[parent];
      if (this.$c(x, e) >= 0) break;
      this.$q[k] = e;
      k = parent;
    }
    this.$q[k] = x;
  }
  private $siftDown(k: number, x: T) {
    const n = this.$q.length;
    const half = n >>> 1;
    while (k < half) {
      let child = 2 * k + 1;
      let c = this.$q[child];
      const right = child + 1;
      if (right < n && this.$c(c, this.$q[right]) > 0) c = this.$q[(child = right)];
      if (this.$c(x, c) <= 0) break;
      this.$q[k] = c;
      k = child;
    }
    this.$q[k] = x;
  }
  size(): number {
    return this.$q.length;
  }
  override add(x: T): boolean {
    return this.offer(x);
  }
  offer(x: T): boolean {
    this.$modCount++;
    this.$q.push(x);
    this.$siftUp(this.$q.length - 1, x);
    return true;
  }
  peek(): T | null {
    return this.$q.length ? this.$q[0] : null;
  }
  element(): T {
    if (!this.$q.length) throw new NoSuchElementException(null);
    return this.$q[0];
  }
  poll(): T | null {
    if (!this.$q.length) return null;
    this.$modCount++;
    const result = this.$q[0];
    const x = this.$q.pop()!;
    if (this.$q.length) this.$siftDown(0, x);
    return result;
  }
  private $removeAtIndex(i: number) {
    this.$modCount++;
    const s = this.$q.length - 1;
    if (s === i) {
      this.$q.pop();
      return;
    }
    const moved = this.$q.pop()!;
    this.$siftDown(i, moved);
    if (this.$q[i] === moved) this.$siftUp(i, moved);
  }
  /** remove() (the head), remove(Object) */
  override remove(o?: unknown): boolean {
    if (arguments.length === 0) {
      if (!this.$q.length) throw new NoSuchElementException(null);
      return this.poll() as unknown as boolean;
    }
    const i = this.$q.findIndex((x) => jequals(x, o));
    if (i < 0) return false;
    this.$removeAtIndex(i);
    return true;
  }
  override contains(o: unknown): boolean {
    return this.$q.some((x) => jequals(x, o));
  }
  override clear(): void {
    this.$modCount++;
    this.$q.length = 0;
  }
  comparator(): Comparator<T> {
    return this.$cmp;
  }
  iterator(): JIterator<T> {
    let i = 0;
    let last = -1;
    let expected = this.$modCount;
    return {
      hasNext: () => i < this.$q.length,
      next: () => {
        if (this.$modCount !== expected) throw new ConcurrentModificationException(null);
        if (i >= this.$q.length) throw new NoSuchElementException(null);
        return this.$q[(last = i++)];
      },
      remove: () => {
        if (last < 0) throw new IllegalStateException(null);
        this.$removeAtIndex(last);
        i = last;
        last = -1;
        expected = this.$modCount;
      },
    };
  }
  override toArray(): T[] {
    return this.$q.slice();
  }
}
implement(PriorityQueue as never, [Ifaces.Queue, Ifaces.Serializable]);

export type { Iface };
