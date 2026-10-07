// The sketch's files. Processing reads files synchronously (loadImage() returns the decoded image), so
// the files a sketch uses are fetched (and images decoded) before setup(): the names the compiler found
// as constant strings, the files the host listed (SketchData.files, sketch.properties), and the files
// the host added in memory. No synchronous XHR: everything goes through fetch(), so a Service Worker
// can serve the files offline.
//
// Names resolve as in Processing: a URL as is, otherwise data/<name> first, then <name> in the sketch
// folder. Files the sketch saves (saveStrings(), save()...) are kept in memory under the sketch folder
// and reported to the host (SketchManager "save" listeners).

export type SavedFile = { path: string; data: Uint8Array; mime: string };

/** The pixels of an image the sketch saved, so that loadImage() can read it back at once. */
export type SavedPixels = { width: number; height: number; format: number; pixels: Int32Array };

/** Processing's message (on stderr) for a file it cannot read; the load function then returns null. */
export function missingFileMessage(name: string): string {
  return `The file "${name}" is missing or inaccessible, make sure the URL is valid or that the file has been added to your sketch and is readable.`;
}

const IMAGE_EXTENSIONS = new Set(["png", "jpg", "jpeg", "gif", "bmp", "webp", "ico", "svg"]);

export function extensionOf(name: string): string {
  const m = /\.([a-z0-9]+)$/i.exec(name.replace(/[?#].*$/, ""));
  return m ? m[1].toLowerCase() : "";
}

export function isImageFile(name: string): boolean {
  return IMAGE_EXTENSIONS.has(extensionOf(name));
}

export function mimeOf(name: string): string {
  const ext = extensionOf(name);
  const mimes: Record<string, string> = {
    png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", gif: "image/gif", bmp: "image/bmp", webp: "image/webp",
    svg: "image/svg+xml", ico: "image/x-icon", tif: "image/tiff", tiff: "image/tiff", tga: "image/x-tga",
    txt: "text/plain", csv: "text/csv", tsv: "text/tab-separated-values", json: "application/json", xml: "application/xml",
    html: "text/html", htm: "text/html", glsl: "text/plain", frag: "text/plain", vert: "text/plain", obj: "text/plain",
  };
  return mimes[ext] ?? "application/octet-stream";
}

const isURL = (name: string) => /^(?:https?|data|blob|file):/i.test(name);

/** a\b/./c/../d → a/b/d (no leading "./"). */
export function normalizePath(p: string): string {
  const out: string[] = [];
  for (const part of p.replace(/\\/g, "/").split("/")) {
    if (part === "." || part === "") continue;
    if (part === ".." && out.length > 0 && out[out.length - 1] !== "..") out.pop();
    else out.push(part);
  }
  return out.join("/");
}

export class SketchFiles {
  /** URL of the sketch folder (ends with "/"), against which relative names are fetched. */
  readonly base: string;
  private readonly files = new Map<string, Uint8Array>();
  private readonly images = new Map<string, ImageBitmap>();
  private readonly savedPixels = new Map<string, SavedPixels>();
  /** CSS families of the font files (.ttf/.otf) registered with the document, by key. */
  private readonly fonts = new Map<string, string>();
  /** Keys that were fetched and not found. */
  private readonly absent = new Set<string>();
  onSave: ((file: SavedFile) => void) | null = null;

  constructor(base: string) {
    this.base = base === "" || base.endsWith("/") ? base : base + "/";
  }

  /** Where Processing looks for `name`, in order (keys of this store). */
  candidates(name: string): string[] {
    if (isURL(name)) return [name];
    if (name.startsWith("/") || /^[a-z]:[\\/]/i.test(name)) return [name.replace(/\\/g, "/")];
    const n = normalizePath(name);
    return n.startsWith("data/") ? [n, "data/" + n] : ["data/" + n, n];
  }

  /** The key `name` resolves to, or null when it is not available. */
  find(name: string): string | null {
    return this.candidates(name).find((k) => this.files.has(k)) ?? null;
  }

  /** Add a file under a path relative to the sketch folder ("data/a.png") or a URL. */
  add(path: string, data: Uint8Array | ArrayBuffer | string) {
    const bytes = typeof data === "string" ? new TextEncoder().encode(data) : data instanceof Uint8Array ? data : new Uint8Array(data);
    const key = isURL(path) ? path : normalizePath(path);
    this.files.set(key, bytes);
    this.images.delete(key);
    this.absent.delete(key);
  }

  /** Fetch the files `names` refer to (the first candidate that exists) and decode the images. */
  async preload(names: Iterable<string>, listed: Iterable<string> = []): Promise<void> {
    const jobs: Promise<unknown>[] = [];
    for (const path of listed) jobs.push(this.fetchKey(isURL(path) ? path : normalizePath(path)));
    for (const name of new Set(names)) {
      jobs.push((async () => {
        for (const key of this.candidates(name)) if (await this.fetchKey(key)) return;
      })());
    }
    await Promise.all(jobs);
    await Promise.all([...this.files.keys()].filter((k) => isImageFile(k) && !this.images.has(k)).map((k) => this.decode(k)));
    await Promise.all([...this.files.keys()].filter((k) => /\.(ttf|otf|woff2?)$/i.test(k) && !this.fonts.has(k)).map((k) => this.registerFont(k)));
  }

  /** Make a font file usable by CSS name (createFont("a.ttf", size)). */
  private async registerFont(key: string) {
    const bytes = this.files.get(key);
    const set = (globalThis as { document?: { fonts?: FontFaceSet } }).document?.fonts;
    if (!bytes || typeof FontFace === "undefined" || !set) return;
    const family = "__sketchfont_" + key.replace(/[^A-Za-z0-9]/g, "_");
    try {
      const face = new FontFace(family, bytes.slice().buffer as ArrayBuffer);
      await face.load();
      set.add(face);
      this.fonts.set(key, family);
    } catch {
      // not a font the browser can read
    }
  }

  /** The CSS family of the font file `name` refers to (null when missing or unreadable). */
  fontFamily(name: string): string | null {
    const key = this.find(name);
    return key === null ? null : this.fonts.get(key) ?? null;
  }

  private readonly fetching = new Map<string, Promise<boolean>>();

  private fetchKey(key: string): Promise<boolean> {
    if (this.files.has(key)) return Promise.resolve(true);
    if (this.absent.has(key)) return Promise.resolve(false);
    let p = this.fetching.get(key);
    if (!p) {
      p = this.fetchURL(key).then((bytes) => {
        if (bytes) this.files.set(key, bytes);
        else this.absent.add(key);
        return bytes !== null;
      });
      this.fetching.set(key, p);
    }
    return p;
  }

  private async fetchURL(key: string): Promise<Uint8Array | null> {
    if (typeof fetch === "undefined") return null;
    try {
      const url = isURL(key) ? key : new URL(key, new URL(this.base || "./", globalThis.document?.baseURI ?? "http://localhost/")).href;
      const res = await fetch(url);
      if (!res.ok) return null;
      // Dev servers answer unknown paths with the app's index.html.
      const type = res.headers.get("content-type") ?? "";
      if (type.includes("text/html") && !/\.html?$/i.test(key)) return null;
      return new Uint8Array(await res.arrayBuffer());
    } catch {
      return null;
    }
  }

  private async decode(key: string) {
    const bytes = this.files.get(key);
    if (!bytes || typeof createImageBitmap === "undefined") return;
    try {
      // No color management or premultiplication: the pixels as stored in the file, as Java decodes them.
      const bmp = await createImageBitmap(new Blob([bytes as BlobPart], { type: mimeOf(key) }), { premultiplyAlpha: "none", colorSpaceConversion: "none" });
      this.images.set(key, bmp);
    } catch {
      // not an image the browser can decode
    }
  }

  bytes(name: string): Uint8Array | null {
    const key = this.find(name);
    return key === null ? null : this.files.get(key)!;
  }

  text(name: string): string | null {
    const b = this.bytes(name);
    if (b === null) return null;
    // UTF-8, keeping a byte order mark (Processing's loadStrings() does).
    return new TextDecoder("utf-8", { ignoreBOM: true }).decode(b);
  }

  /** The decoded image `name` refers to (null when missing or not decodable). */
  image(name: string): ImageBitmap | null {
    const key = this.find(name);
    return key === null ? null : this.images.get(key) ?? null;
  }

  /** An image the sketch saved under the name `name` refers to (before its file is encoded and decoded). */
  savedImage(name: string): SavedPixels | null {
    const key = this.candidates(name).find((k) => this.savedPixels.has(k));
    return key === undefined ? null : this.savedPixels.get(key)!;
  }

  /** Path of a file the sketch writes: relative to the sketch folder, as Processing's save functions. */
  savePath(name: string): string {
    return isURL(name) ? name : name.startsWith("/") || /^[a-z]:[\\/]/i.test(name) ? name.replace(/\\/g, "/") : normalizePath(name);
  }

  /** Record the pixels of an image being saved (save() encodes PNG/JPEG asynchronously). */
  saveImagePixels(name: string, image: SavedPixels) {
    this.savedPixels.set(this.savePath(name), image);
  }

  /** Read a file that was not preloaded (requestImage(), dynamic names): fetch it now. */
  async load(name: string): Promise<string | null> {
    for (const key of this.candidates(name)) {
      if (await this.fetchKey(key)) {
        if (isImageFile(key) && !this.images.has(key)) await this.decode(key);
        return key;
      }
    }
    return null;
  }

  imageByKey(key: string): ImageBitmap | null {
    return this.images.get(key) ?? null;
  }

  /** A file written by the sketch, relative to the sketch folder (as Processing's saveStrings() etc.). */
  save(name: string, data: Uint8Array | string, mime = mimeOf(name)) {
    const bytes = typeof data === "string" ? new TextEncoder().encode(data) : data;
    const key = this.savePath(name);
    this.files.set(key, bytes);
    this.images.delete(key);
    this.absent.delete(key);
    if (isImageFile(key)) void this.decode(key);
    this.onSave?.({ path: key, data: bytes, mime });
  }
}
