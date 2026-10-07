// Java's Throwable hierarchy as JS Error subclasses (so stack traces work), plus the mapping of native
// JS errors to Java exceptions for `catch` clauses (a TypeError from reading a property of null is a
// NullPointerException; a RangeError from deep recursion is a StackOverflowError).

export class Throwable extends Error {
  /** Binary class name used by toString(), e.g. "java.lang.ArithmeticException". */
  static $javaName = "java.lang.Throwable";
  cause: Throwable | null = null;

  constructor(message?: string | null, cause?: Throwable | null) {
    super(message ?? undefined);
    this.message = message ?? (null as unknown as string);
    if (cause) this.cause = cause;
  }

  /** Java constructors (user subclasses call these through super). */
  $init(message?: string | null | Throwable, cause?: Throwable | null): this {
    if (message instanceof Throwable) {
      this.cause = message;
      this.message = message.toString();
    } else if (message !== undefined) this.message = message as string;
    if (cause) this.cause = cause;
    return this;
  }

  getMessage(): string | null {
    return this.message as string | null;
  }

  getLocalizedMessage(): string | null {
    return this.getMessage();
  }

  getCause(): Throwable | null {
    return this.cause;
  }

  override toString(): string {
    const name = (this.constructor as typeof Throwable).$javaName;
    const m = this.getLocalizedMessage();
    return m !== null && m !== undefined ? `${name}: ${m}` : name;
  }

  printStackTrace(): void {
    printErr(this.toString());
  }
}

const host = globalThis as unknown as { console?: { error(s: string): void; log(s: string): void } };
let printErr: (s: string) => void = (s) => host.console?.error(s);
/** Where printStackTrace() writes (the host's stderr). */
export function setErrorPrinter(f: (s: string) => void) {
  printErr = f;
}

/** Write a line to the host's stderr (System.err). */
export function printError(s: string) {
  printErr(s);
}

const define = (base: typeof Throwable, javaName: string): typeof Throwable => {
  const c = class extends base {};
  c.$javaName = javaName;
  Object.defineProperty(c, "name", { value: javaName.slice(javaName.lastIndexOf(".") + 1) });
  return c;
};

export class Exception extends Throwable {
  static override $javaName = "java.lang.Exception";
}
export class JError extends Throwable {
  static override $javaName = "java.lang.Error";
}
export class RuntimeException extends Exception {
  static override $javaName = "java.lang.RuntimeException";
}
export const ArithmeticException = define(RuntimeException, "java.lang.ArithmeticException");
export const IndexOutOfBoundsException = define(RuntimeException, "java.lang.IndexOutOfBoundsException");
export const ArrayIndexOutOfBoundsException = define(IndexOutOfBoundsException, "java.lang.ArrayIndexOutOfBoundsException");
export const StringIndexOutOfBoundsException = define(IndexOutOfBoundsException, "java.lang.StringIndexOutOfBoundsException");
export const NullPointerException = define(RuntimeException, "java.lang.NullPointerException");
export const ClassCastException = define(RuntimeException, "java.lang.ClassCastException");
export const IllegalArgumentException = define(RuntimeException, "java.lang.IllegalArgumentException");
export const NumberFormatException = define(IllegalArgumentException, "java.lang.NumberFormatException");
export const IllegalStateException = define(RuntimeException, "java.lang.IllegalStateException");
export const UnsupportedOperationException = define(RuntimeException, "java.lang.UnsupportedOperationException");
export const NegativeArraySizeException = define(RuntimeException, "java.lang.NegativeArraySizeException");
export const ArrayStoreException = define(RuntimeException, "java.lang.ArrayStoreException");
export const ConcurrentModificationException = define(RuntimeException, "java.util.ConcurrentModificationException");
export const NoSuchElementException = define(RuntimeException, "java.util.NoSuchElementException");
export const EmptyStackException = define(RuntimeException, "java.util.EmptyStackException");
export const CloneNotSupportedException = define(Exception, "java.lang.CloneNotSupportedException");
export const InterruptedException = define(Exception, "java.lang.InterruptedException");
export const IOException = define(Exception, "java.io.IOException");
export const FileNotFoundException = define(IOException, "java.io.FileNotFoundException");
export const EOFException = define(IOException, "java.io.EOFException");
export const UncheckedIOException = define(RuntimeException, "java.io.UncheckedIOException");
export const StackOverflowError = define(JError, "java.lang.StackOverflowError");
export const OutOfMemoryError = define(JError, "java.lang.OutOfMemoryError");
export const AssertionError = define(JError, "java.lang.AssertionError");

/**
 * The Java exception for anything caught by generated code. Java exceptions pass through; native errors
 * are converted (and remembered, so rethrowing keeps the same object).
 */
export function toJava(e: unknown): Throwable {
  if (e instanceof Throwable) return e;
  const err = e as Error;
  let t: Throwable;
  if (err instanceof TypeError && /null|undefined/.test(err.message)) t = new NullPointerException(null);
  else if (err instanceof RangeError && /call stack/i.test(err.message)) t = new StackOverflowError(null);
  else t = new RuntimeException(err && err.message !== undefined ? err.message : String(e));
  if (err && typeof err === "object" && err.stack) t.stack = err.stack;
  return t;
}
