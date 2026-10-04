#!/usr/bin/env node
// API coverage: which Processing reference functions/variables have an implementation in the runtime.
// Writes docs/api-coverage.md. Usage: node tools/manifest/coverage.ts
// A name being present does not mean the behaviour matches Processing (see docs/STATUS.md and the visual tests).
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "../..");
const INVENTORY = path.join(ROOT, "docs/research/processing-api-inventory-2026-10.txt");
const MANIFEST = path.join(ROOT, "src/compiler/api/processing-core.json");
const OUT = path.join(ROOT, "docs/api-coverage.md");

// Language constructs listed in the reference (handled by the compiler, not the runtime API).
const LANGUAGE_CATEGORIES = new Set(["Control", "Data", "structure"]);

/** Members defined on the runtime PApplet (methods, arrow-function properties, fields). */
function runtimeMembers(): Set<string> {
  const src = fs.readFileSync(path.join(ROOT, "src/lib/runtime/PApplet.ts"), "utf8");
  const names = new Set<string>();
  for (const m of src.matchAll(/^\s{2}(?:async\s+)?([A-Za-z_]\w*)\s*(?:\(|=|:)/gm)) {
    const name = m[1];
    if (name === "constructor") continue;
    names.add(name);
    // Event handlers and overloaded APIs are stored with a leading underscore (_mousePressed, _frameRate).
    if (name.startsWith("_") && !name.startsWith("__")) names.add(name.slice(1));
  }
  // Constants come from PConstants.
  const constants = fs.readFileSync(path.join(ROOT, "src/lib/runtime/PConstants.ts"), "utf8");
  for (const m of constants.matchAll(/readonly\s+([A-Z_][A-Z0-9_]*)\s*=/g)) names.add(m[1]);
  return names;
}

function runtimeClasses(): Set<string> {
  const classes = new Set<string>();
  const walk = (dir: string) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.isDirectory()) walk(path.join(dir, e.name));
      else if (e.name.endsWith(".ts")) {
        for (const m of fs.readFileSync(path.join(dir, e.name), "utf8").matchAll(/export (?:abstract )?class (\w+)/g)) classes.add(m[1]);
      }
    }
  };
  walk(path.join(ROOT, "src/lib/runtime"));
  return classes;
}

type Entry = { name: string; kind: "function" | "variable" | "class" | "other" };
type Section = { category: string; sub: string; entries: Entry[] };

function parseInventory(): Section[] {
  const sections: Section[] = [];
  let category = "";
  for (const line of fs.readFileSync(INVENTORY, "utf8").split(/\r?\n/)) {
    const h = line.match(/^## (.+?) \(\d+\)$/);
    if (h) {
      category = h[1];
      continue;
    }
    const s = line.match(/^\s+- (.+?) \[\d+; ([^\]]+)\]: (.+)$/);
    if (!s || !category) continue;
    const kinds = s[2];
    const entries = s[3].split(", ").map((raw): Entry => {
      const name = raw.trim();
      if (name.endsWith("()")) return { name: name.slice(0, -2), kind: "function" };
      if (/^[A-Z][A-Za-z]+$/.test(name) && kinds.includes("class")) return { name, kind: "class" };
      if (/^[A-Za-z_]\w*(\[\])?$/.test(name)) return { name: name.replace("[]", ""), kind: "variable" };
      return { name, kind: "other" };
    });
    sections.push({ category, sub: s[1], entries });
  }
  return sections;
}

const members = runtimeMembers();
const classes = runtimeClasses();
const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8")) as { processing: string; classes: { name: string; methods: { name: string }[] }[] };
const sections = parseInventory().filter((s) => !LANGUAGE_CATEGORIES.has(s.category));
const has = (e: Entry) => (e.kind === "class" ? classes.has(e.name) : members.has(e.name));

const byCategory = new Map<string, Section[]>();
for (const s of sections) byCategory.set(s.category.toLowerCase(), [...(byCategory.get(s.category.toLowerCase()) ?? []), s]);

const lines = [
  "# API カバレッジ（自動生成）",
  "",
  "`node tools/manifest/coverage.ts` で生成。Processing のリファレンス（[docs/research/processing-api-inventory-2026-10.txt](research/processing-api-inventory-2026-10.txt)）の関数・変数・クラスのうち、ランタイム（`src/lib/runtime`）に**同名の実装があるもの**を数えている。",
  "**挙動が Processing と一致するかは別問題**（[STATUS.md](STATUS.md) と視覚テストを参照）。言語構文（Control / Data の型・演算子・構文キーワード）はコンパイラの担当なので除外。",
  "",
  "| カテゴリ | 関数 | 変数 | クラス |",
  "|---|---:|---:|---:|",
];
const count = (ss: Section[], kind: Entry["kind"]) => {
  const es = ss.flatMap((s) => s.entries).filter((e) => e.kind === kind);
  return es.length ? `${es.filter(has).length}/${es.length}` : "-";
};
let total = 0;
let done = 0;
for (const [cat, ss] of [...byCategory].sort()) {
  lines.push(`| ${cat} | ${count(ss, "function")} | ${count(ss, "variable")} | ${count(ss, "class")} |`);
  const fs_ = ss.flatMap((s) => s.entries).filter((e) => e.kind === "function");
  total += fs_.length;
  done += fs_.filter(has).length;
}
lines.splice(5, 0, `関数の合計: **${done}/${total}（${((done / total) * 100).toFixed(0)}%）**`, "");
lines.push("", "## 未実装の一覧", "");
for (const [cat, ss] of [...byCategory].sort()) {
  const missing = ss.flatMap((s) => s.entries.filter((e) => e.kind !== "other" && !has(e)).map((e) => (e.kind === "function" ? `${e.name}()` : e.name)));
  if (missing.length) lines.push(`- **${cat}**: ${missing.join(", ")}`);
}
const papplet = manifest.classes.find((c) => c.name === "processing.core.PApplet")!;
const pappletNames = new Set(papplet.methods.map((m) => m.name));
lines.push(
  "",
  "## 参考: core の public API の規模（`src/compiler/api/processing-core.json`）",
  "",
  `Processing ${manifest.processing} の PApplet は public メソッド ${pappletNames.size} 名 / ${papplet.methods.length} オーバーロード（内部用の handleDraw や main などを含む）。`,
  "",
);
fs.writeFileSync(OUT, lines.join("\n"));
console.log(lines.slice(0, 30).join("\n"));
console.log(`\nwrote ${path.relative(ROOT, OUT)}`);
