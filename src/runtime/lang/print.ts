// Text output of sketches (print/println/printArray). Generated code converts primitive arguments to
// Java strings itself (it knows their static types); these handle values whose type is only known at
// run time (Object parameters, arrays).
import { isArray, isLongArray } from "./arrays.ts";
import { doubleToString, floatToString, longToString } from "./numbers.ts";
import { valueOf } from "./strings.ts";

const host = globalThis as unknown as { process?: { stdout?: { write(s: string): void } }; console?: { log(s: string): void } };
let sink: (text: string) => void = (text) => {
  if (host.process?.stdout) host.process.stdout.write(text);
  else host.console?.log(text);
};

/** Where sketch output goes (the host's console). Text includes the newlines. */
export function setOutput(f: (text: string) => void) {
  sink = f;
}

export function print(text: string): void {
  sink(text);
}

export function println(text = ""): void {
  sink(text + "\n");
}

function elementString(a: unknown, x: unknown): string {
  if (a instanceof Float32Array) return floatToString(x as number);
  if (a instanceof Float64Array) return isLongArray(a) ? longToString(x as number) : doubleToString(x as number);
  if (a instanceof Uint16Array) return `'${String.fromCharCode(x as number)}'`;
  if (typeof x === "string") return `"${x}"`;
  return typeof x === "number" ? String(x) : valueOf(x);
}

/** printArray(Object): one "[index] value" line per element (strings quoted). */
export function arrayLines(a: unknown): string {
  if (a === null || a === undefined) return "null";
  if (!isArray(a)) return valueOf(a);
  const arr = a as ArrayLike<unknown>;
  const lines: string[] = [];
  for (let i = 0; i < arr.length; i++) lines.push(`[${i}] ${elementString(a, arr[i])}`);
  return lines.join("\n");
}

/** println(Object) / print(Object): arrays print like printArray (Processing), other values as String.valueOf. */
export function objectText(x: unknown): string {
  return isArray(x) ? arrayLines(x) : valueOf(x);
}
