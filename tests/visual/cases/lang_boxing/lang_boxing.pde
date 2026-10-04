// Boxed values: printing in collections, equals/hashCode/compareTo, instanceof, unboxing arithmetic,
// Number methods, boxing of constants, casts and null unboxing.
import java.util.*;

void setup() {
  size(320, 240);
  ArrayList<Float> fl = new ArrayList<Float>();
  fl.add(1.0);
  fl.add(2.5);
  fl.add(-0.0);
  fl.add(Float.NaN);
  println(fl, fl.contains(2.5), fl.indexOf(-0.0), fl.indexOf(0.0), fl.contains(Float.NaN));
  float sum = 0;
  for (float f : fl) if (!Float.isNaN(f)) sum += f;
  for (Float f : fl) print(f + 1, "");
  println();
  println(sum, fl.get(0) * 2, fl.get(1) > 2, -fl.get(1), fl.get(1) == 2.5);
  ArrayList<Double> dl = new ArrayList<Double>();
  dl.add(3.0d);
  dl.add(0.1d + 0.2d);
  println(dl, dl.get(1) + 1);
  HashMap<String, Float> m = new HashMap<String, Float>();
  m.put("a", 1.0);
  m.put("b", 0.5);
  m.put("a", m.get("a") + 1);
  println(m, m.get("a"), m.get("zz"));
  HashMap<Float, String> fk = new HashMap<Float, String>();
  fk.put(1.0, "one");
  fk.put(2.0, "two");
  println(fk.get(1.0), fk.get(3.0), fk.containsKey(2.0));
  Object o1 = 5.0, o2 = 5, o3 = 'c', o4 = 5.0d, o5 = true, o6 = 5L;
  println(o1, o2, o3, o4, o5, o6);
  println(o1 instanceof Float, o1 instanceof Integer, o2 instanceof Integer, o2 instanceof Float, o3 instanceof Character, o4 instanceof Double, o1 instanceof Number, o3 instanceof Number);
  println(o1.equals(5.0), o1.equals(5), o2.equals(5), o4.equals(5.0d), o1.hashCode(), o4.hashCode(), o3.hashCode());
  Float a = 1.5, b = 1.5;
  Integer i1 = 100, i2 = 100;
  println(a.equals(b), a == b, a == 1.5, i1 == i2, a.compareTo(2.0), a.intValue(), a.doubleValue(), a.toString() + "!", a.isNaN(), a.isInfinite());
  Number n = 2.7;
  println(n.intValue(), n.floatValue(), n.longValue(), n);
  Float c = 2.0;
  c += 1;
  c++;
  println(c);
  Character ch = 'x';
  Integer in = 65;
  Character fromInt = 66;
  println(ch, ch + 1, (char) (ch + 1), in, fromInt, ch.charValue(), Character.valueOf('z'));
  Float[] fa = {1.0, 2.5};
  printArray(fa);
  println(fa);
  Collections.sort(fl);
  println(fl, Collections.max(dl), Float.valueOf("3"), Double.valueOf(2), Float.compare(-0.0, 0.0));
  println(String.format("%.2f %s %d %5.1f", 1.0 / 3, 2.5, 42, fl.get(1)));
  try {
    Object x = 3;
    Float bad = (Float) x;
    println(bad);
  } catch (ClassCastException e) {
    println("CCE");
  }
  Float nul = null;
  try {
    float z = nul;
    println(z);
  } catch (NullPointerException e) {
    println("NPE");
  }
  println("" + nul + c + ch + in);
  boolean t = fl.size() > 2;
  Object o7 = t ? 1 : 2.0;
  float f1 = t ? fl.get(1) : 0.5;
  Float f2 = t ? null : a;
  println(o7, f1, f2, t ? 'q' : 0, t ? ch : 'r');
  Integer ii = 3;
  Float ff = 2.5;
  Object o8 = t ? ii : ff;
  println(t ? ii : ff, o8, t ? ii : 7, t ? fromInt : 0);
  Box<Float> bx = new Box<Float>(0.25);
  bx.v += 1;
  Box<Character> bc = new Box<Character>('k');
  println(bx.v, bx.get() * 2, bx, bc.v, bc);
  println(half(3), total(1.0, 2.0, 0.5), total(), describe(1), describe(1.0), describe('1'), describe("1"));
  Comparator<Float> desc = (p, q) -> Float.compare(q, p);
  fl.sort(desc);
  println(fl);
  switch (in) {
    case 65: println("in=65"); break;
    default: println("other");
  }
  switch (ch) {
    case 'x': println("ch=x"); break;
    default: println("other");
  }
  Character[] ca = {'b', 'a'};
  printArray(ca);
  Character k1 = 'a', k2 = 'a', k3 = 'é', k4 = 'é';
  Object o9 = 'c';
  println(k1 == k2, k3 == k4, k3.equals(k4), "a".equals(k1), k1.equals('a'), o9 instanceof String, o9.equals("c"));
  ArrayList<Character> cl = new ArrayList<Character>(Arrays.asList(ca));
  cl.add('z');
  Collections.sort(cl);
  println(cl, cl.contains('a'), cl.indexOf('z'), cl.get(0) + 1, cl.get(0) < 'b');
  HashMap<Character, Integer> counts = new HashMap<Character, Integer>();
  for (char x : "hello".toCharArray()) counts.put(x, counts.containsKey(x) ? counts.get(x) + 1 : 1);
  println(counts, counts.get('l'));
  noLoop();
}

class Box<T> {
  T v;
  Box(T v) { this.v = v; }
  T get() { return v; }
  String toString() { return "Box(" + v + ")"; }
}

Float half(int x) {
  return x / 2.0;
}

float total(Float... xs) {
  float s = 0;
  for (Float x : xs) s += x;
  return s;
}

String describe(Object o) {
  return o.getClass().getName() + ":" + o;
}
