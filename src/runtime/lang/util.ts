// java.util helpers with Java's results: Collections, Arrays, Objects, Random (the documented 48-bit
// linear congruential generator, so seeded sequences match Java), StringJoiner, StringTokenizer and the
// static factories of List/Set/Map. The collection classes are in collections.ts and maps.ts.
import { LONG_ARRAY, arrayDescriptor, isArray, isLongArray } from "./arrays.ts";
import { doubleHash, floatToIntBits } from "./boxes.ts";
import { AbstractList, ArrayList, ArraysAsList, ImmutableList, UnmodifiableList, elementsOf, type Comparator } from "./collections.ts";
import { IllegalArgumentException, IndexOutOfBoundsException, NoSuchElementException, NullPointerException } from "./exceptions.ts";
import { ComparatorIface, Comparator as ComparatorStatics } from "./functional.ts";
import { AbstractMap, Entry, ImmutableMap, ImmutableSet } from "./maps.ts";
import { jcompare, jequals, jhash } from "./misc.ts";
import { JObject, lambda } from "./objects.ts";
import { doubleToString, floatToString, longToString } from "./numbers.ts";
import { valueOf } from "./strings.ts";

export * from "./collections.ts";
export * from "./maps.ts";

const cmpFn = <T>(c: Comparator<T>) => (c ? (x: T, y: T) => c.compare(x, y) : (x: T, y: T) => jcompare(x, y));
type List<T> = AbstractList<T>;

// --- Random ----------------------------------------------------------------------------------------------

const P24 = 0x1000000;
const MUL_HI = 0x5de;
const MUL_LO = 0xece66d;

/**
 * java.util.Random: seed = (seed * 0x5DEECE66D + 0xB) mod 2^48, kept as two 24-bit halves so that the
 * arithmetic stays exact in doubles. The derived methods follow the algorithms given in its Javadoc.
 * (A long seed beyond 2^53 loses precision like every long here.)
 */
export class Random extends JObject {
  private $hi = 0;
  private $lo = 0;
  private $nextNextGaussian = 0;
  private $haveNextNextGaussian = false;
  constructor(seed?: number) {
    super();
    this.setSeed(seed ?? Math.floor(Math.random() * 2 ** 48));
  }
  setSeed(seed: number): void {
    // The low 48 bits of the long (two's complement), scrambled with the multiplier.
    const s = ((seed % 2 ** 48) + 2 ** 48) % 2 ** 48;
    this.$hi = Math.floor(s / P24) ^ MUL_HI;
    this.$lo = (s % P24) ^ MUL_LO;
    this.$haveNextNextGaussian = false;
  }
  protected next(bits: number): number {
    const p = this.$lo * MUL_LO + 0xb;
    const lo = p % P24;
    this.$hi = (this.$hi * MUL_LO + this.$lo * MUL_HI + Math.floor(p / P24)) % P24;
    this.$lo = lo;
    return Math.floor((this.$hi * P24 + this.$lo) / 2 ** (48 - bits)) | 0;
  }
  /** nextInt() or nextInt(bound) */
  nextInt(bound?: number): number {
    if (bound === undefined) return this.next(32);
    if (bound <= 0) throw new IllegalArgumentException("bound must be positive");
    let r = this.next(31);
    const m = bound - 1;
    if ((bound & m) === 0) return Math.floor(r / 2 ** (31 - Math.log2(bound))) | 0;
    for (let u = r; ((u - (r = u % bound) + m) | 0) < 0; u = this.next(31));
    return r;
  }
  nextLong(): number {
    return this.next(32) * 2 ** 32 + this.next(32);
  }
  nextBoolean(): boolean {
    return this.next(1) !== 0;
  }
  nextFloat(): number {
    return this.next(24) / P24;
  }
  nextDouble(): number {
    return (this.next(26) * 2 ** 27 + this.next(27)) * 2 ** -53;
  }
  nextGaussian(): number {
    if (this.$haveNextNextGaussian) {
      this.$haveNextNextGaussian = false;
      return this.$nextNextGaussian;
    }
    let v1: number, v2: number, s: number;
    do {
      v1 = 2 * this.nextDouble() - 1;
      v2 = 2 * this.nextDouble() - 1;
      s = v1 * v1 + v2 * v2;
    } while (s >= 1 || s === 0);
    const multiplier = Math.sqrt((-2 * Math.log(s)) / s);
    this.$nextNextGaussian = v2 * multiplier;
    this.$haveNextNextGaussian = true;
    return v1 * multiplier;
  }
  nextBytes(bytes: Int8Array): void {
    for (let i = 0; i < bytes.length; ) {
      for (let rnd = this.nextInt(), n = Math.min(bytes.length - i, 4); n-- > 0; rnd >>= 8) bytes[i++] = rnd;
    }
  }
}

// --- Collections -----------------------------------------------------------------------------------------

let shuffleRandom: Random | null = null;

export const Collections = {
  sort<T>(list: List<T>, c?: Comparator<T>) {
    list.sort(c ?? null);
  },
  reverse<T>(list: List<T>) {
    for (let i = 0, j = list.size() - 1; i < j; i++, j--) list.set(i, list.set(j, list.get(i)));
  },
  /** shuffle(list) or shuffle(list, random): Java's algorithm, so a seeded Random gives Java's order. */
  shuffle<T>(list: List<T>, rnd?: Random) {
    const r = rnd ?? (shuffleRandom ??= new Random());
    for (let i = list.size(); i > 1; i--) Collections.swap(list, i - 1, r.nextInt(i));
  },
  swap<T>(list: List<T>, i: number, j: number) {
    list.set(i, list.set(j, list.get(i)));
  },
  rotate<T>(list: List<T>, distance: number) {
    const items = list.toArray();
    const n = items.length;
    if (!n) return;
    const d = ((distance % n) + n) % n;
    for (let i = 0; i < n; i++) list.set((i + d) % n, items[i]);
  },
  fill<T>(list: List<T>, x: T) {
    for (let i = 0, n = list.size(); i < n; i++) list.set(i, x);
  },
  copy<T>(dest: List<T>, src: List<T>) {
    if (src.size() > dest.size()) throw new IndexOutOfBoundsException("Source does not fit in dest");
    for (let i = 0, n = src.size(); i < n; i++) dest.set(i, src.get(i));
  },
  max<T>(c: unknown, cmp?: Comparator<T>): T {
    const items = Array.from(elementsOf<T>(c));
    if (!items.length) throw new NoSuchElementException(null);
    const f = cmpFn(cmp);
    return items.reduce((a, b) => (f(b, a) > 0 ? b : a));
  },
  min<T>(c: unknown, cmp?: Comparator<T>): T {
    const items = Array.from(elementsOf<T>(c));
    if (!items.length) throw new NoSuchElementException(null);
    const f = cmpFn(cmp);
    return items.reduce((a, b) => (f(b, a) < 0 ? b : a));
  },
  frequency(c: unknown, o: unknown): number {
    let n = 0;
    for (const x of elementsOf(c)) if (jequals(x, o)) n++;
    return n;
  },
  disjoint(a: unknown, b: unknown): boolean {
    const bs = Array.from(elementsOf(b));
    for (const x of elementsOf(a)) if (bs.some((y) => jequals(x, y))) return false;
    return true;
  },
  addAll<T>(c: { add(x: T): boolean }, items: ArrayLike<T>): boolean {
    let changed = false;
    for (const x of Array.from(items)) changed = c.add(x) || changed;
    return changed;
  },
  binarySearch<T>(list: List<T>, key: T, c?: Comparator<T>): number {
    const f = cmpFn(c);
    let lo = 0;
    let hi = list.size() - 1;
    while (lo <= hi) {
      const mid = (lo + hi) >>> 1;
      const r = f(list.get(mid), key);
      if (r < 0) lo = mid + 1;
      else if (r > 0) hi = mid - 1;
      else return mid;
    }
    return -(lo + 1);
  },
  /** reverseOrder() or reverseOrder(comparator) */
  reverseOrder<T>(c?: Comparator<T>) {
    return c ? lambda(ComparatorIface, "compare", (a: T, b: T) => c.compare(b, a)) : ComparatorStatics.reverseOrder<T>();
  },
  unmodifiableList: <T>(l: List<T>) => new UnmodifiableList<T>(l),
  unmodifiableCollection: <T>(c: unknown) => (c instanceof AbstractList ? new UnmodifiableList<T>(c as List<T>) : new ImmutableSet<T>(c).freeze()),
  unmodifiableSet: <T>(s: unknown) => new ImmutableSet<T>(s).freeze(),
  unmodifiableMap: <K, V>(m: AbstractMap<K, V>) => new ImmutableMap<K, V>(m).freeze(),
  synchronizedList: <T>(l: T) => l,
  synchronizedMap: <T>(m: T) => m,
  synchronizedSet: <T>(s: T) => s,
  emptyList: <T>() => new ImmutableList<T>([]),
  emptySet: <T>() => new ImmutableSet<T>().freeze(),
  emptyMap: <K, V>() => new ImmutableMap<K, V>().freeze(),
  singletonList: <T>(x: T) => new ImmutableList<T>([x]),
  singleton: <T>(x: T) => new ImmutableSet<T>([x]).freeze(),
  singletonMap: <K, V>(k: K, v: V) => ImmutableMap.of<K, V>([k, v]),
  nCopies: <T>(n: number, x: T) => {
    if (n < 0) throw new IllegalArgumentException(`List length = ${n}`);
    return new ImmutableList<T>(new Array<T>(n).fill(x));
  },
};

// --- List / Set / Map factories (Java 9+) ----------------------------------------------------------------

/** Varargs factories receive either the elements or one array (the `E...` overload). */
const items = <T>(args: unknown[]): T[] => (args.length === 1 && Array.isArray(args[0]) ? (args[0] as T[]) : (args as T[]));
const noNulls = <T>(xs: T[]): T[] => {
  if (xs.some((x) => x === null || x === undefined)) throw new NullPointerException(null);
  return xs;
};

export const ListStatics = {
  of: <T>(...args: unknown[]) => new ImmutableList<T>(noNulls(items<T>(args).slice())),
  copyOf: <T>(c: unknown) => new ImmutableList<T>(noNulls(Array.from(elementsOf<T>(c)))),
};
/** Java randomizes the iteration order of Set.of/Map.of per run; these keep insertion order. */
export const SetStatics = {
  of: <T>(...args: unknown[]) => new ImmutableSet<T>(noNulls(items<T>(args))).freeze(),
  copyOf: <T>(c: unknown) => new ImmutableSet<T>(c).freeze(),
};
export const MapStatics = {
  of: <K, V>(...kv: unknown[]) => ImmutableMap.of<K, V>(kv),
  entry: <K, V>(k: K, v: V) => new Entry(k, v),
  ofEntries: <K, V>(...args: unknown[]) => ImmutableMap.of<K, V>(items<Entry<K, V>>(args).flatMap((e) => [e.getKey(), e.getValue()])),
  copyOf: <K, V>(m: AbstractMap<K, V>) => new ImmutableMap<K, V>(m).freeze(),
};

// --- Arrays ------------------------------------------------------------------------------------------------

type AnyArray = ArrayLike<unknown> & { slice(a?: number, b?: number): AnyArray; constructor: Function };

/** Element text as Arrays.toString prints it (float/double/long/char typed arrays need their type). */
function elementText(a: unknown, x: unknown): string {
  if (a instanceof Float32Array) return floatToString(x as number);
  if (a instanceof Float64Array) return isLongArray(a) ? longToString(x as number) : doubleToString(x as number);
  if (a instanceof Uint16Array) return String.fromCharCode(x as number);
  return valueOf(x);
}

function elementHash(a: unknown, x: unknown): number {
  if (a instanceof Float32Array) return floatToIntBits(x as number);
  if (a instanceof Float64Array) {
    if (!isLongArray(a)) return doubleHash(x as number);
    const v = x as number;
    return (Math.floor(v / 2 ** 32) ^ (v % 2 ** 32 < 0 ? (v % 2 ** 32) + 2 ** 32 : v % 2 ** 32)) | 0;
  }
  if (ArrayBuffer.isView(a)) return x as number;
  if (typeof x === "boolean") return x ? 1231 : 1237;
  return jhash(x);
}

function defaultValue(a: unknown): unknown {
  return ArrayBuffer.isView(a) ? 0 : isArray(a) && arrayDescriptor(a) === "[Z" ? false : null;
}

export const Arrays = {
  toString(a: ArrayLike<unknown> | null): string {
    if (a === null) return "null";
    return "[" + Array.from(a, (x) => elementText(a, x)).join(", ") + "]";
  },
  deepToString(a: ArrayLike<unknown> | null): string {
    if (a === null) return "null";
    return "[" + Array.from(a, (x) => (isArray(x) ? Arrays.deepToString(x as ArrayLike<unknown>) : elementText(a, x))).join(", ") + "]";
  },
  /** sort(a), sort(a, comparator), sort(a, from, to), sort(a, from, to, comparator) */
  sort(a: AnyArray, x?: unknown, y?: unknown, z?: unknown) {
    const ranged = typeof x === "number";
    const from = ranged ? (x as number) : 0;
    const to = ranged ? (y as number) : a.length;
    const c = (ranged ? z : x) as Comparator<unknown>;
    if (from < 0 || to > a.length || from > to) throw new IndexOutOfBoundsException(`Array index out of range: ${to}`);
    if (ArrayBuffer.isView(a)) {
      (a as unknown as Float64Array).subarray(from, to).sort();
      return;
    }
    const part = (a as unknown as unknown[]).slice(from, to).sort(cmpFn(c));
    for (let i = 0; i < part.length; i++) (a as unknown as unknown[])[from + i] = part[i];
  },
  /** fill(a, value) or fill(a, from, to, value) */
  fill(a: { fill(v: unknown, s?: number, e?: number): unknown }, x: unknown, y?: unknown, z?: unknown) {
    if (z !== undefined) a.fill(z, x as number, y as number);
    else a.fill(x);
  },
  copyOf<T extends AnyArray>(a: T, n: number): T {
    if (n < 0) throw new IllegalArgumentException(String(n));
    if (n <= a.length) return Arrays.tag(a.slice(0, n), a) as T;
    const out = new (a.constructor as new (n: number) => T & { set(x: T): void })(n);
    if (Array.isArray(out)) {
      (out as unknown as unknown[]).fill(defaultValue(a));
      for (let i = 0; i < a.length; i++) (out as unknown as unknown[])[i] = a[i];
    } else out.set(a);
    return Arrays.tag(out, a) as T;
  },
  copyOfRange<T extends AnyArray>(a: T, from: number, to: number): T {
    if (from > to) throw new IllegalArgumentException(`${from} > ${to}`);
    if (from < 0 || from > a.length) throw new IndexOutOfBoundsException(`Array index out of range: ${from}`);
    return Arrays.copyOf(Arrays.tag(a.slice(from), a) as T, to - from);
  },
  /** Keep the long[] mark on copies. */
  tag(copy: unknown, of: unknown): unknown {
    if (isLongArray(of)) (copy as Record<symbol, boolean>)[LONG_ARRAY] = true;
    return copy;
  },
  asList<T>(a: T[]): ArraysAsList<T> {
    return new ArraysAsList<T>(a);
  },
  equals(a: ArrayLike<unknown> | null, b: ArrayLike<unknown> | null): boolean {
    if (a === b) return true;
    if (!a || !b || a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (!(Object.is(a[i], b[i]) || jequals(a[i], b[i]))) return false;
    return true;
  },
  deepEquals(a: ArrayLike<unknown> | null, b: ArrayLike<unknown> | null): boolean {
    if (a === b) return true;
    if (!a || !b || a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      const x = a[i];
      const y = b[i];
      if (isArray(x) && isArray(y) ? !Arrays.deepEquals(x as ArrayLike<unknown>, y as ArrayLike<unknown>) : !jequals(x, y)) return false;
    }
    return true;
  },
  hashCode(a: ArrayLike<unknown> | null): number {
    if (a === null) return 0;
    let h = 1;
    for (let i = 0; i < a.length; i++) h = (Math.imul(31, h) + elementHash(a, a[i])) | 0;
    return h;
  },
  deepHashCode(a: ArrayLike<unknown> | null): number {
    if (a === null) return 0;
    let h = 1;
    for (let i = 0; i < a.length; i++) {
      const x = a[i];
      h = (Math.imul(31, h) + (isArray(x) ? Arrays.deepHashCode(x as ArrayLike<unknown>) : elementHash(a, x))) | 0;
    }
    return h;
  },
  /** binarySearch(a, key), (a, key, comparator), (a, from, to, key[, comparator]) */
  binarySearch(a: ArrayLike<unknown>, x: unknown, y?: unknown, z?: unknown, w?: unknown): number {
    const ranged = arguments.length >= 4;
    let lo = ranged ? (x as number) : 0;
    let hi = (ranged ? (y as number) : a.length) - 1;
    const key = ranged ? z : x;
    const f = ArrayBuffer.isView(a) ? (p: unknown, q: unknown) => ((p as number) < (q as number) ? -1 : (p as number) > (q as number) ? 1 : 0) : cmpFn((ranged ? w : y) as Comparator<unknown>);
    while (lo <= hi) {
      const mid = (lo + hi) >>> 1;
      const r = f(a[mid], key);
      if (r < 0) lo = mid + 1;
      else if (r > 0) hi = mid - 1;
      else return mid;
    }
    return -(lo + 1);
  },
};

// --- Objects -----------------------------------------------------------------------------------------------

export const Objects = {
  equals: (a: unknown, b: unknown) => a === b || (a !== null && a !== undefined && jequals(a, b)),
  deepEquals: (a: unknown, b: unknown) => (isArray(a) && isArray(b) ? Arrays.deepEquals(a as ArrayLike<unknown>, b as ArrayLike<unknown>) : Objects.equals(a, b)),
  hashCode: (o: unknown) => (o === null || o === undefined ? 0 : jhash(o)),
  hash: (...args: unknown[]) => Arrays.hashCode(items(args)),
  toString: (o: unknown, nullDefault?: string) => (o === null && nullDefault !== undefined ? nullDefault : valueOf(o)),
  isNull: (o: unknown) => o === null || o === undefined,
  nonNull: (o: unknown) => o !== null && o !== undefined,
  requireNonNull<T>(o: T, message?: string | { get(): string }): T {
    if (o === null || o === undefined) throw new NullPointerException(message === undefined ? null : typeof message === "string" ? message : message.get());
    return o;
  },
  requireNonNullElse<T>(o: T, other: T): T {
    return o !== null && o !== undefined ? o : Objects.requireNonNull(other, "defaultObj");
  },
  compare<T>(a: T, b: T, c: { compare(a: T, b: T): number }): number {
    return a === b ? 0 : c.compare(a, b);
  },
  checkIndex(i: number, n: number): number {
    if (i < 0 || i >= n) throw new IndexOutOfBoundsException(`Index ${i} out of bounds for length ${n}`);
    return i;
  },
};

// --- StringJoiner / StringTokenizer ------------------------------------------------------------------------

export class StringJoiner extends JObject {
  private readonly $delim: string;
  private readonly $prefix: string;
  private readonly $suffix: string;
  private $parts: string[] = [];
  private $emptyValue: string | null = null;
  constructor(delim: string, prefix = "", suffix = "") {
    super();
    this.$delim = delim;
    this.$prefix = prefix;
    this.$suffix = suffix;
  }
  add(s: unknown): this {
    this.$parts.push(valueOf(s));
    return this;
  }
  setEmptyValue(s: string): this {
    this.$emptyValue = s;
    return this;
  }
  merge(o: StringJoiner): this {
    if (o.$parts.length) this.$parts.push(o.$parts.join(o.$delim));
    return this;
  }
  length(): number {
    return this.toString().length;
  }
  override toString(): string {
    if (!this.$parts.length && this.$emptyValue !== null) return this.$emptyValue;
    return this.$prefix + this.$parts.join(this.$delim) + this.$suffix;
  }
}

export class StringTokenizer extends JObject {
  private readonly $s: string;
  private $delims: string;
  private readonly $returnDelims: boolean;
  private $pos = 0;
  constructor(s: string, delims = " \t\n\r\f", returnDelims = false) {
    super();
    this.$s = s;
    this.$delims = delims;
    this.$returnDelims = returnDelims;
  }
  private skip(pos: number): number {
    if (this.$returnDelims) return pos;
    while (pos < this.$s.length && this.$delims.includes(this.$s[pos])) pos++;
    return pos;
  }
  private scan(pos: number): number {
    const start = pos;
    while (pos < this.$s.length && !this.$delims.includes(this.$s[pos])) pos++;
    if (this.$returnDelims && start === pos && pos < this.$s.length) pos++;
    return pos;
  }
  hasMoreTokens(): boolean {
    return this.skip(this.$pos) < this.$s.length;
  }
  hasMoreElements(): boolean {
    return this.hasMoreTokens();
  }
  /** nextToken() or nextToken(newDelimiters) */
  nextToken(delims?: string): string {
    if (delims !== undefined) this.$delims = delims;
    const start = this.skip(this.$pos);
    if (start >= this.$s.length) throw new NoSuchElementException(null);
    this.$pos = this.scan(start);
    return this.$s.slice(start, this.$pos);
  }
  nextElement(): string {
    return this.nextToken();
  }
  countTokens(): number {
    let n = 0;
    for (let p = this.$pos; ; n++) {
      p = this.skip(p);
      if (p >= this.$s.length) return n;
      p = this.scan(p);
    }
  }
}

