#!/usr/bin/env node
// Generate src/compiler/api/processing-core.json from the installed Processing's core jar by reflection.
// Usage: node tools/manifest/generate.ts [--processing <Processing executable>]
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { parseArgs } from "node:util";
import { findProcessing } from "../vt/processing.ts";

const ROOT = path.resolve(import.meta.dirname, "../..");
const OUT = path.join(ROOT, "src/compiler/api/processing-core.json");

const { values: flags } = parseArgs({ options: { processing: { type: "string" } } });
const exe = findProcessing(flags.processing);
if (!exe) {
  console.error("Processing not found (--processing <path> or PROCESSING_PATH).");
  process.exit(2);
}
const install = path.dirname(exe);
const appDir = path.join(install, "app");
const jdkBin = path.join(appDir, "resources/jdk/bin");
const java = path.join(jdkBin, process.platform === "win32" ? "java.exe" : "java");
const javac = path.join(jdkBin, process.platform === "win32" ? "javac.exe" : "javac");
for (const p of [java, javac]) if (!fs.existsSync(p)) throw new Error(`JDK tool not found: ${p}`);

// core + JOGL/gluegen (PShader & co. reference JOGL types in their signatures).
const jars = fs.readdirSync(appDir).filter((f) => /^(core|jogl-all|gluegen-rt)-[\d.]+(-[0-9a-f]+)?\.jar$/.test(f)).map((f) => path.join(appDir, f));
const core = jars.find((j) => path.basename(j).startsWith("core-"));
if (!core) throw new Error(`core jar not found in ${appDir}`);
const version = path.basename(core).match(/^core-([\d.]+)/)![1];

const work = fs.mkdtempSync(path.join(os.tmpdir(), "pts-manifest-"));
const cp = [...jars, work].join(path.delimiter);
execFileSync(javac, ["-cp", jars.join(path.delimiter), "-d", work, path.join(import.meta.dirname, "ManifestGen.java")], { stdio: "inherit" });
const json = execFileSync(java, ["-cp", cp, "ManifestGen"], { encoding: "utf8", maxBuffer: 1 << 26 });
fs.rmSync(work, { recursive: true, force: true });

const manifest = JSON.parse(json) as { classes: { name: string; methods: { name: string }[]; fields: unknown[] }[] };
const result = { processing: version, generatedBy: "tools/manifest/generate.ts", ...manifest };
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, compactJson(result) + "\n");

for (const c of manifest.classes) {
  const names = new Set(c.methods.map((m) => m.name));
  console.log(`${c.name.padEnd(36)} methods ${String(names.size).padStart(4)} names / ${String(c.methods.length).padStart(4)} overloads, fields ${c.fields.length}`);
}
console.log(`\nwrote ${path.relative(ROOT, OUT)} (Processing ${version})`);

/** Pretty-print the outer levels and keep each field/constructor/method on one line (readable diffs, smaller file). */
function compactJson(value: unknown, depth = 0): string {
  const pad = "  ".repeat(depth);
  if (depth >= 4 || value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) {
    if (value.length === 0 || value.every((v) => typeof v !== "object")) return JSON.stringify(value);
    return "[\n" + value.map((v) => pad + "  " + compactJson(v, depth + 1)).join(",\n") + "\n" + pad + "]";
  }
  const entries = Object.entries(value as Record<string, unknown>);
  return "{\n" + entries.map(([k, v]) => `${pad}  ${JSON.stringify(k)}: ${compactJson(v, depth + 1)}`).join(",\n") + "\n" + pad + "}";
}
