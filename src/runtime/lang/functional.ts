// Library interfaces with default and static methods (java.util.Comparator, java.util.function.*,
// Iterable): registered as Iface objects so lambdas and user classes get the default methods, and the
// static methods are exported for $rt.classes.
import { jcompare } from "./misc.ts";
import { Iface, lambda, libraryIface } from "./objects.ts";

type Cmp<T> = { compare(a: T, b: T): number };
type Fn<A, B> = { apply(a: A): B };
type Pred<T> = { test(x: T): boolean };

export const ComparatorIface: Iface = libraryIface("java.util.Comparator", [], {
  reversed<T>(this: Cmp<T>): Cmp<T> {
    return lambda(ComparatorIface, "compare", (a: T, b: T) => this.compare(b, a)) as Cmp<T>;
  },
  thenComparing<T>(this: Cmp<T>, other: Cmp<T> | Fn<T, unknown>): Cmp<T> {
    const next: Cmp<T> = typeof (other as Cmp<T>).compare === "function" ? (other as Cmp<T>) : Comparator.comparing(other as Fn<T, unknown>);
    return lambda(ComparatorIface, "compare", (a: T, b: T) => this.compare(a, b) || next.compare(a, b)) as Cmp<T>;
  },
});

export const Comparator = {
  naturalOrder: <T>() => lambda(ComparatorIface, "compare", (a: T, b: T) => jcompare(a, b)) as Cmp<T>,
  reverseOrder: <T>() => lambda(ComparatorIface, "compare", (a: T, b: T) => jcompare(b, a)) as Cmp<T>,
  comparing: <T>(key: Fn<T, unknown>, cmp?: Cmp<unknown>) =>
    lambda(ComparatorIface, "compare", (a: T, b: T) => (cmp ? cmp.compare(key.apply(a), key.apply(b)) : jcompare(key.apply(a), key.apply(b)))) as Cmp<T>,
  comparingInt: <T>(key: { applyAsInt(a: T): number }) => lambda(ComparatorIface, "compare", (a: T, b: T) => jcompare(key.applyAsInt(a), key.applyAsInt(b))) as Cmp<T>,
  comparingDouble: <T>(key: { applyAsDouble(a: T): number }) => lambda(ComparatorIface, "compare", (a: T, b: T) => jcompare(key.applyAsDouble(a), key.applyAsDouble(b))) as Cmp<T>,
};

export const FunctionIface: Iface = libraryIface("java.util.function.Function", [], {
  andThen<A, B, C>(this: Fn<A, B>, after: Fn<B, C>): Fn<A, C> {
    return lambda(FunctionIface, "apply", (a: A) => after.apply(this.apply(a))) as Fn<A, C>;
  },
  compose<A, B, C>(this: Fn<B, C>, before: Fn<A, B>): Fn<A, C> {
    return lambda(FunctionIface, "apply", (a: A) => this.apply(before.apply(a))) as Fn<A, C>;
  },
});
export const FunctionStatics = { identity: <T>() => lambda(FunctionIface, "apply", (x: T) => x) };
libraryIface("java.util.function.UnaryOperator", [FunctionIface]);

export const PredicateIface: Iface = libraryIface("java.util.function.Predicate", [], {
  negate<T>(this: Pred<T>): Pred<T> {
    return lambda(PredicateIface, "test", (x: T) => !this.test(x)) as Pred<T>;
  },
  and<T>(this: Pred<T>, o: Pred<T>): Pred<T> {
    return lambda(PredicateIface, "test", (x: T) => this.test(x) && o.test(x)) as Pred<T>;
  },
  or<T>(this: Pred<T>, o: Pred<T>): Pred<T> {
    return lambda(PredicateIface, "test", (x: T) => this.test(x) || o.test(x)) as Pred<T>;
  },
});
export const PredicateStatics = { not: <T>(p: Pred<T>) => lambda(PredicateIface, "test", (x: T) => !p.test(x)) };

export const ConsumerIface: Iface = libraryIface("java.util.function.Consumer", [], {
  andThen<T>(this: { accept(x: T): void }, after: { accept(x: T): void }) {
    return lambda(ConsumerIface, "accept", (x: T) => {
      this.accept(x);
      after.accept(x);
    });
  },
});

/** Iterable's default forEach for user classes implementing Iterable. */
libraryIface("java.lang.Iterable", [], {
  forEach<T>(this: { iterator(): { hasNext(): boolean; next(): T } }, f: { accept(x: T): void }) {
    const it = this.iterator();
    while (it.hasNext()) f.accept(it.next());
  },
});
