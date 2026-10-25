// Compiled sketches by a hash of their source (ROADMAP P4-3): an editor that runs the same sketch again,
// or a page that compiles its sketch on every visit, skips the compiler. Kept in memory and, when the
// browser has it, in IndexedDB (survives reloads). Only sketches without compile errors are kept.
import { COMPILER_VERSION } from "../compiler/index.ts";
import type { CompiledSketch, SketchData } from "./types";

/** What is stored per sketch (CompiledSketch without the host's file list and timings). */
type Entry = Pick<CompiledSketch, "result" | "map" | "usesText" | "files"> & { time: number };

const STORE = "sketches";

/** cyrb53-style 53-bit string hash with a seed (two of them make the 106-bit key). */
function hash53(s: string, seed: number): string {
  let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 2654435761);
    h2 = Math.imul(h2 ^ c, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}

function request<T>(r: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
}

/**
 * @param name IndexedDB database name (null: memory only).
 * @param maxEntries How many sketches to keep (the least recently used go first).
 */
export class CompileCache {
  private readonly memory = new Map<string, Entry>();
  private readonly name: string | null;
  private readonly maxEntries: number;
  private db: Promise<IDBDatabase | null> | null = null;

  constructor(options: { name?: string | null; maxEntries?: number } = {}) {
    this.name = options.name === undefined ? "processing-ts-compile-cache" : options.name;
    this.maxEntries = options.maxEntries ?? 50;
  }

  /** The key of a sketch: its tabs in order, and the compiler version. */
  key(data: SketchData): string {
    const main = data.content.filter((f) => f.name === data.main);
    const tabs = [...main, ...data.content.filter((f) => f.name !== data.main)];
    const text = COMPILER_VERSION + "\u0000" + tabs.map((t) => t.name + "\u0000" + t.content).join("\u0000");
    return hash53(text, 1) + "-" + hash53(text, 2) + "-" + text.length.toString(36);
  }

  /** A sketch kept in memory (no IndexedDB lookup). */
  getSync(key: string): CompiledSketch | undefined {
    const e = this.memory.get(key);
    if (!e) return undefined;
    this.memory.delete(key);
    this.memory.set(key, e);
    return toSketch(e);
  }

  /** A sketch kept in memory or in IndexedDB. */
  async get(key: string): Promise<CompiledSketch | undefined> {
    const m = this.getSync(key);
    if (m) return m;
    const db = await this.open();
    if (!db) return undefined;
    try {
      const e = (await request(db.transaction(STORE, "readonly").objectStore(STORE).get(key))) as Entry | undefined;
      if (!e) return undefined;
      this.remember(key, e);
      void this.write(key, { ...e, time: Date.now() });
      return toSketch(e);
    } catch {
      return undefined;
    }
  }

  /** Keep a compiled sketch (ignored when it has errors). IndexedDB is written in the background. */
  put(key: string, sketch: CompiledSketch) {
    if (sketch.error?.error || sketch.result === "") return;
    const e: Entry = { result: sketch.result, map: sketch.map ?? null, usesText: sketch.usesText ?? false, files: sketch.files ?? [], time: Date.now() };
    this.remember(key, e);
    void this.write(key, e);
  }

  /** Forget every sketch (memory and IndexedDB). */
  async clear() {
    this.memory.clear();
    const db = await this.open();
    if (!db) return;
    try {
      await request(db.transaction(STORE, "readwrite").objectStore(STORE).clear());
    } catch {
      // storage unavailable
    }
  }

  private remember(key: string, e: Entry) {
    this.memory.delete(key);
    this.memory.set(key, e);
    while (this.memory.size > this.maxEntries) this.memory.delete(this.memory.keys().next().value!);
  }

  private open(): Promise<IDBDatabase | null> {
    if (!this.db) {
      this.db = (async () => {
        if (this.name === null || typeof indexedDB === "undefined") return null;
        try {
          const r = indexedDB.open(this.name, 1);
          r.onupgradeneeded = () => r.result.createObjectStore(STORE).createIndex("time", "time");
          return await request(r);
        } catch {
          // private browsing, blocked storage...
          return null;
        }
      })();
    }
    return this.db;
  }

  private async write(key: string, e: Entry) {
    const db = await this.open();
    if (!db) return;
    try {
      const store = db.transaction(STORE, "readwrite").objectStore(STORE);
      await request(store.put(e, key));
      const count = await request(store.count());
      if (count <= this.maxEntries) return;
      // Drop the least recently used entries.
      let extra = count - this.maxEntries;
      const cursor = store.index("time").openKeyCursor();
      await new Promise<void>((resolve, reject) => {
        cursor.onsuccess = () => {
          const c = cursor.result;
          if (!c || extra-- <= 0) return resolve();
          store.delete(c.primaryKey);
          c.continue();
        };
        cursor.onerror = () => reject(cursor.error);
      });
    } catch {
      // quota or storage errors: the memory cache still works
    }
  }
}

function toSketch(e: Entry): CompiledSketch {
  return { result: e.result, error: null, map: e.map, usesText: e.usesText, files: e.files };
}
