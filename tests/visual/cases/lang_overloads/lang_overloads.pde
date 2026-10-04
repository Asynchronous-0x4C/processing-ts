// Overload resolution (exact, widening, boxing, varargs, most specific) and constructor overloads.
String f(int x) { return "int"; }
String f(long x) { return "long"; }
String f(float x) { return "float"; }
String f(double x) { return "double"; }
String f(Object x) { return "Object"; }
String f(String x) { return "String"; }
String f(int... xs) { return "varargs" + xs.length; }

String g(long x) { return "g-long"; }
String g(Integer x) { return "g-Integer"; }

String h(Object o) { return "h-Object"; }
String h(int[] a) { return "h-int[]"; }

String k(double a, double b) { return "k-dd"; }
String k(float a, int b) { return "k-fi"; }

int sum(int... xs) {
  int s = 0;
  for (int x : xs) s += x;
  return s;
}

String join(String sep, Object... parts) {
  StringBuilder sb = new StringBuilder();
  for (int i = 0; i < parts.length; i++) {
    if (i > 0) sb.append(sep);
    sb.append(parts[i]);
  }
  return sb.toString();
}

class V {
  float x, y;
  String how;
  V() { this(0, 0); how = "default"; }
  V(float x, float y) { this.x = x; this.y = y; how = "floats"; }
  V(int n) { this(n, n); how = "int"; }
  V(V other) { this(other.x, other.y); how = "copy"; }
}

void setup() {
  size(320, 240);
  byte b = 1;
  char c = 'c';
  short s = 2;
  println(f(1), f(b), f(c), f(s), f(1L), f(1.5), f(1.5d), f("x"), f(new int[0]), f(), f(1, 2), f(true));
  println(g(5), g(Integer.valueOf(5)), h(new int[] { 1 }), h("s"), h(null));
  println(k(1, 2), k(1.5, 2), k(1, 2.5));
  println(sum(), sum(1), sum(1, 2, 3), sum(new int[] { 4, 5 }));
  println(join(", ", "a", 1, 2.5, 'c', true), join("-"), join("/", (Object[]) new String[] { "x", "y" }));
  V v1 = new V();
  V v2 = new V(3);
  V v3 = new V(1.5, 2);
  V v4 = new V(v3);
  println(v1.how, v2.how + " " + v2.x, v3.how + " " + v3.y, v4.how + " " + v4.x);
  println(max(1, 2), max(1.5, 2), max(1, 2.5), abs(-3), abs(-3.5));
  noLoop();
}
