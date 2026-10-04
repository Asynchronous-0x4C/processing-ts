// Classes: inheritance, abstract classes, interfaces with default methods, constructor chaining,
// initialization order, inner classes using sketch fields, static nested classes, equals/hashCode.
import java.util.HashSet;

int created = 0;
StringBuilder log = new StringBuilder();

interface Shape {
  float area();
  default String describe() { return getClass().getSimpleName() + " area " + area(); }
}

abstract class Base implements Shape {
  String name = "base";
  { log.append("[init " + name + "]"); }
  Base() { this("unnamed"); log.append("[Base()]"); }
  Base(String n) { name = n; created++; log.append("[Base(" + n + ")]"); }
  abstract float area();
  public String toString() { return name + ":" + area(); }
}

class Rect extends Base {
  float w = 2, h = 3;
  Rect() { super(); log.append("[Rect()]"); }
  Rect(float w, float h) { super("rect"); this.w = w; this.h = h; }
  float area() { return w * h; }
}

class Square extends Rect {
  Square(float s) { super(s, s); name = "square"; }
  String describe() { return "Square! " + super.describe(); }
}

class Circle implements Shape {
  float r;
  Circle(float r) { this.r = r; }
  float area() { return PI * r * r; }
}

static class Counter {
  static int total = 0;
  int id;
  Counter() { id = ++total; }
  static int next() { return total + 1; }
}

class Point {
  int x, y;
  Point(int x, int y) { this.x = x; this.y = y; }
  boolean equals(Object o) {
    if (!(o instanceof Point)) return false;
    Point p = (Point) o;
    return p.x == x && p.y == y;
  }
  int hashCode() { return 31 * x + y; }
  String toString() { return "(" + x + "," + y + ")"; }
}

class Outer {
  int v = 10;
  class Inner {
    int get() { return v * 2 + created; }
  }
  Inner make() { return new Inner(); }
}

void setup() {
  size(320, 240);
  Rect r1 = new Rect();
  println(log);
  log.setLength(0);
  Rect r2 = new Rect(4, 5);
  println(log, r2, r2.area());
  Shape[] shapes = { r1, r2, new Square(3), new Circle(1) };
  for (Shape s : shapes) println(s.describe());
  println(created, shapes[2] instanceof Rect, shapes[3] instanceof Base, shapes[0] instanceof Shape);
  Base b = (Base) shapes[2];
  println(b.name, ((Rect) b).w);
  new Counter();
  new Counter();
  Counter c3 = new Counter();
  println(Counter.total, c3.id, Counter.next());
  HashSet<Point> pts = new HashSet<Point>();
  pts.add(new Point(1, 2));
  pts.add(new Point(1, 2));
  pts.add(new Point(2, 1));
  println(pts.size(), pts.contains(new Point(2, 1)), new Point(1, 2).equals(new Point(1, 2)), new Point(3, 4));
  Outer o = new Outer();
  Outer.Inner in = o.make();
  o.v = 7;
  println(in.get());
  Object obj = "text";
  try {
    Rect bad = (Rect) (Object) new Circle(2);
    println(bad);
  } catch (ClassCastException e) {
    println("ClassCastException");
  }
  println(obj instanceof String, obj.equals("text"), obj.hashCode() == "text".hashCode());
  noLoop();
}
