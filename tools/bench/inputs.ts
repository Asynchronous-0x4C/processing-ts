// Benchmark inputs: bundled demo samples, visual test cases, and a generated large sketch.
import fs from "node:fs";
import path from "node:path";
import { readSketch, type SketchSource } from "../vt/sketch.ts";

export type BenchInput = { name: string; lines: number; sketch: SketchSource };

function sketchDirs(root: string, depth: number): string[] {
  if (!fs.existsSync(root)) return [];
  let dirs = [root];
  for (let i = 0; i < depth; i++) {
    dirs = dirs.flatMap((d) =>
      fs.readdirSync(d, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => path.join(d, e.name)),
    );
  }
  return dirs.filter((d) => fs.readdirSync(d).some((f) => f.endsWith(".pde"))).sort();
}

function toInput(name: string, sketch: SketchSource): BenchInput {
  const lines = sketch.files.reduce((n, f) => n + f.content.split("\n").length, 0);
  return { name, lines, sketch };
}

export function collectInputs(root: string, which: string[]): BenchInput[] {
  const inputs: BenchInput[] = [];
  if (which.includes("samples")) {
    for (const d of sketchDirs(path.join(root, "public/samples"), 2)) inputs.push(toInput(`samples/${path.basename(d)}`, readSketch(d)));
  }
  if (which.includes("cases")) {
    for (const d of sketchDirs(path.join(root, "tests/visual/cases"), 1)) inputs.push(toInput(`cases/${path.basename(d)}`, readSketch(d)));
  }
  if (which.includes("synthetic")) {
    inputs.push(toInput("synthetic-5k", { dir: root, main: "synthetic.pde", files: [{ name: "synthetic.pde", content: syntheticSketch(5000) }] }));
  }
  return inputs;
}

/**
 * A deterministic active-mode sketch of roughly `targetLines` lines: setup/draw, global fields and
 * functions, and many classes with typical sketch code (fields, constructors, loops, branches,
 * arrays, ArrayList, switch, casts, string building).
 */
export function syntheticSketch(targetLines: number): string {
  const head = `// generated benchmark sketch
ArrayList<Agent0> agents = new ArrayList<Agent0>();
int counter = 0;
float t = 0.0;
color bg = #202830;

void setup() {
  size(640, 360);
  for (int i = 0; i < 100; i++) {
    agents.add(new Agent0(random(width), random(height)));
  }
}

void draw() {
  background(bg);
  t += 0.01;
  for (Agent0 a : agents) {
    a.update(t);
    a.display();
  }
  counter = (counter + 1) % 1000;
}
`;
  const cls = (i: number) => `
class Agent${i} {
  float x, y, vx, vy;
  int[] trail = new int[8];
  String label = "agent${i}";

  Agent${i}(float x, float y) {
    this.x = x;
    this.y = y;
    vx = random(-1, 1);
    vy = random(-1, 1);
  }

  void update(float t) {
    x += vx * cos(t * ${(i % 7) + 1});
    y += vy * sin(t * ${(i % 5) + 1});
    if (x < 0 || x > width) {
      vx = -vx;
    } else if (y < 0 || y > height) {
      vy = -vy;
    }
    for (int k = trail.length - 1; k > 0; k--) {
      trail[k] = trail[k - 1];
    }
    trail[0] = (int) (x + y) % 255;
    switch (counter % 3) {
      case 0: label = "a" + ${i}; break;
      case 1: label = "b" + (int) x; break;
      default: label = nf(y, 1, 2);
    }
  }

  void display() {
    noStroke();
    fill(trail[0], ${(i * 37) % 255}, 200, 180);
    ellipse(x, y, 8, 8);
    if (dist(x, y, mouseX, mouseY) < 20) {
      fill(255);
      text(label, x + 6, y - 6);
    }
  }
}
`;
  let out = head;
  let i = 0;
  while (out.split("\n").length < targetLines) out += cls(i++);
  return out;
}
