// Generic classes and methods together with inner classes: type parameters of the enclosing class,
// bounded type parameters, generic methods with explicit and inferred arguments, interfaces with
// default and static methods, inner classes reaching outer fields, static nested classes, anonymous
// classes capturing locals, and exception chaining.
import java.util.*;

interface Shape {
  float area();
  default String describe() {
    return name() + " with area " + nf(area(), 0, 2);
  }
  default String name() {
    return "shape";
  }
  static Shape unit() {
    return new Square(1);
  }
}

static class Square implements Shape {
  float s;
  Square(float s) {
    this.s = s;
  }
  public float area() {
    return s * s;
  }
  public String name() {
    return "square";
  }
}

class Circle implements Shape {
  float r;
  Circle(float r) {
    this.r = r;
  }
  public float area() {
    return PI * r * r;
  }
}

class Pair<A, B> {
  A first;
  B second;
  Pair(A first, B second) {
    this.first = first;
    this.second = second;
  }
  <C> Pair<A, C> withSecond(C c) {
    return new Pair<A, C>(first, c);
  }
  Pair<B, A> swap() {
    return new Pair<B, A>(second, first);
  }
  public String toString() {
    return "(" + first + ", " + second + ")";
  }
}

class Tree<T extends Comparable<T>> {
  class Node {
    T value;
    Node left, right;
    Node(T value) {
      this.value = value;
      size++;
    }
  }
  Node root;
  int size;
  void add(T v) {
    root = insert(root, v);
  }
  Node insert(Node n, T v) {
    if (n == null) return new Node(v);
    if (v.compareTo(n.value) < 0) n.left = insert(n.left, v);
    else n.right = insert(n.right, v);
    return n;
  }
  void inOrder(Node n, List<T> out) {
    if (n == null) return;
    inOrder(n.left, out);
    out.add(n.value);
    inOrder(n.right, out);
  }
  List<T> toList() {
    List<T> out = new ArrayList<T>();
    inOrder(root, out);
    return out;
  }
}

static class Stats {
  static int calls;
  static <T extends Number> double mean(List<T> xs) {
    calls++;
    double s = 0;
    for (T x : xs) s += x.doubleValue();
    return xs.isEmpty() ? 0 : s / xs.size();
  }
}

<T> T firstOr(List<T> xs, T fallback) {
  return xs.isEmpty() ? fallback : xs.get(0);
}

<T extends Comparable<T>> T maxOf(T a, T b) {
  return a.compareTo(b) >= 0 ? a : b;
}

int counter = 0;

void setup() {
  size(320, 240);
  List<Shape> shapes = new ArrayList<Shape>();
  shapes.add(new Square(2));
  shapes.add(new Circle(1));
  shapes.add(Shape.unit());
  for (Shape s : shapes) println(s.describe());

  Pair<String, Integer> p = new Pair<String, Integer>("x", 1);
  Pair<String, Float> q = p.withSecond(2.5);
  println(p, q, p.swap(), q.swap().first + 1, p.<Boolean>withSecond(true));

  Tree<String> t = new Tree<String>();
  for (String w : "the quick brown fox jumps over the lazy dog".split(" ")) t.add(w);
  println(t.toList(), t.size);
  Tree<Integer> ti = new Tree<Integer>();
  for (int v : new int[] {5, 3, 8, 1}) ti.add(v);
  println(ti.toList(), ti.root.left.value + ti.root.right.value);

  println(Stats.mean(Arrays.asList(1, 2, 3, 4)), Stats.mean(Arrays.asList(0.5, 1.5)), Stats.mean(new ArrayList<Long>()), Stats.calls);
  println(firstOr(new ArrayList<String>(), "none"), firstOr(Arrays.asList(7, 8), -1), maxOf("pear", "apple"), maxOf(3, 9));

  final int base = 10;
  Comparator<String> byDistance = new Comparator<String>() {
    public int compare(String a, String b) {
      counter++;
      return Math.abs(a.length() - base) - Math.abs(b.length() - base);
    }
  };
  List<String> words = new ArrayList<String>(Arrays.asList("encyclopedia", "cat", "elephant", "hippopotamus"));
  Collections.sort(words, byDistance);
  println(words, counter > 0);
  Runnable r = new Runnable() {
    int runs = 0;
    public void run() {
      runs++;
      counter += base;
      println("run", runs, counter > base);
    }
  };
  r.run();
  r.run();

  try {
    try {
      Object o = "text";
      Integer i = (Integer) o;
      println(i);
    } catch (ClassCastException e) {
      throw new RuntimeException("wrapped", e);
    }
  } catch (RuntimeException e) {
    println(e.getMessage(), e.getCause() instanceof ClassCastException, e.getCause().getClass().getName());
  }
  IllegalStateException ise = new IllegalStateException("outer", new IllegalArgumentException("inner"));
  println(ise, ise.getCause().getMessage());
  noLoop();
}
