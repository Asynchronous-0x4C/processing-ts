// Generates benchmark inputs into ./inputs. Run: node gen-inputs.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PROJECT = 'C:/Users/okmst/Documents/Projects/processing-ts';
const IN = path.join(HERE, 'inputs');
fs.mkdirSync(IN, { recursive: true });

const sample = fs.readFileSync(path.join(PROJECT, 'public/samples/Games/simple_shooter_game/SimpleShooterGame.pde'), 'utf8');
fs.writeFileSync(path.join(IN, 'sample.pde'), sample);
fs.writeFileSync(path.join(IN, 'sample-wrapped.java'), 'class Sketch {\n' + sample + '\n}\n');

// --- synthetic plain Java (Java 8 feature level so every parser, incl. the project grammar, should accept it)
const tA = (i) => `
class Particle${i} {
  private float x, y;
  private float vx = 0.5f, vy = -1.25f;
  protected int[] history = new int[16];
  static final long SEED${i} = 0x7FFF${(i % 16).toString(16)}L;
  private String name;

  Particle${i}(float x, float y, String name) {
    this.x = x;
    this.y = y;
    this.name = name == null ? "p${i}" : name;
  }

  public float getX() { return x; }
  public float getY() { return y; }
  public void setX(float v) { x = v; }

  void step(int frames) {
    for (int f = 0; f < frames; f++) {
      x += vx * 0.016f;
      y += vy * 0.016f;
      if (x < 0 || x > 640) {
        vx = -vx;
      } else if (y < 0) {
        vy = Math.abs(vy);
      } else {
        vy += 9.81f * 0.016f;
      }
      history[f % history.length] = (int) (x * 31 + y) ^ (f << 2);
    }
    int k = 0;
    while (k < history.length && history[k] != 0) {
      k++;
    }
    do {
      k--;
    } while (k > 0 && history[k] % 2 == 0);
  }

  int classify(int code) {
    int result;
    switch (code) {
      case 0:
        result = 1;
        break;
      case 1:
      case 2:
        result = code * 10;
        break;
      default:
        result = code > 100 ? -1 : code % 7;
    }
    return result;
  }

  double energy() {
    double e = 0.0;
    for (int i = 0; i < history.length; ++i) {
      e += Math.sqrt(history[i] * 1.0) / (i + 1);
    }
    return e * 0.5 + (vx * vx + vy * vy) / 2.0;
  }

  @Override
  public String toString() {
    return "Particle${i}[" + name + ", x=" + x + ", y=" + y + ", c='" + 'z' + "']";
  }
}
`;

const tB = (i) => `
interface Shape${i}<T extends Number> {
  double area();
  T id();
  String describe(); // (no Java 8 default method: @lezer/java 1.1.4 rejects them)
}

class Rect${i} implements Shape${i}<Integer>, Comparable<Rect${i}> {
  private final double w, h;
  private final java.util.List<String> tags = new java.util.ArrayList<>();
  private final java.util.Map<String, Integer> counts = new java.util.HashMap<String, Integer>();

  Rect${i}(double w, double h) { this.w = w; this.h = h; }

  @Override public double area() { return w * h; }
  @Override public Integer id() { return ${i}; }
  @Override public int compareTo(Rect${i} o) { return Double.compare(area(), o.area()); }
  @Override public String describe() { return getClass().getSimpleName() + ":" + area(); }

  void tag(String... names) {
    for (String n : names) {
      tags.add(n.trim().toLowerCase());
      counts.put(n, counts.getOrDefault(n, 0) + 1);
    }
  }

  java.util.List<String> sortedTags() {
    java.util.List<String> copy = new java.util.ArrayList<>(tags);
    java.util.Collections.sort(copy, (a, b) -> b.length() - a.length());
    copy.removeIf(s -> s.isEmpty());
    copy.forEach(System.out::println);
    return copy;
  }

  Runnable task() {
    return new Runnable() {
      @Override
      public void run() {
        int total = 0;
        for (java.util.Map.Entry<String, Integer> e : counts.entrySet()) {
          total += e.getValue();
        }
        System.out.println("total=" + total);
      }
    };
  }

  static <E extends Comparable<E>> E maxOf(java.util.List<? extends E> items) {
    E best = null;
    for (E it : items) {
      if (best == null || it.compareTo(best) > 0) best = it;
    }
    return best;
  }
}
`;

const tC = (i) => `
enum Mode${i} {
  IDLE(0), RUNNING(1), PAUSED(2);
  private final int code;
  Mode${i}(int code) { this.code = code; }
  int code() { return code; }
  Mode${i} next() { return values()[(ordinal() + 1) % values().length]; }
}

abstract class Node${i} {
  protected Node${i} parent;
  abstract int depth();

  static class Leaf extends Node${i} {
    final int value;
    Leaf(int value) { this.value = value; }
    int depth() { return parent == null ? 0 : 1 + parent.depth(); }
  }

  static int safeDivide(int a, int b) {
    try {
      if (b == 0) throw new IllegalArgumentException("b == 0 in ${i}");
      return a / b;
    } catch (IllegalArgumentException | ArithmeticException ex) {
      return Integer.MIN_VALUE;
    } finally {
      counter++;
    }
  }

  static int counter = 0;

  static String scan(Object o, int[][] grid) {
    StringBuilder sb = new StringBuilder();
    if (o instanceof String) {
      sb.append(((String) o).length());
    }
    outer:
    for (int r = 0; r < grid.length; r++) {
      for (int c = 0; c < grid[r].length; c++) {
        if (grid[r][c] < 0) continue outer;
        if (grid[r][c] > 1000) break outer;
        sb.append(grid[r][c] & 0xFF).append(',');
      }
    }
    long mask = (1L << 40) | (counter >>> 3);
    sb.append(mask % 97).append(~counter).append(!sb.toString().isEmpty());
    return sb.toString();
  }

  static void resources() throws java.io.IOException {
    try (java.io.StringReader r = new java.io.StringReader("abc${i}")) {
      int ch;
      while ((ch = r.read()) != -1) {
        counter += ch;
      }
    }
  }
}
`;

let out = 'import java.util.*;\nimport java.io.IOException;\n';
let i = 0;
while (out.split('\n').length < 5000) {
  out += [tA, tB, tC][i % 3](i);
  i++;
}
fs.writeFileSync(path.join(IN, 'synthetic.java'), out);
console.log('synthetic.java lines:', out.split('\n').length, 'bytes:', Buffer.byteLength(out), 'templates:', i);
console.log('sample.pde lines:', sample.split('\n').length, 'bytes:', Buffer.byteLength(sample));
