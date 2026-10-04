// How Processing prints values: println/print overloads, arrays, floats and doubles in Java's format,
// varargs, objects, collections, str() and hex/binary conversions.
import java.util.*;

class Named { String toString() { return "named!"; } }

void setup() {
  size(320, 240);
  println(new int[] { 1, 2, 3 });
  println(new float[] { 1, 2.5 });
  println(new String[] { "a", "b" });
  printArray(new String[] { "x", "y" });
  printArray(new char[] { 'p', 'q' });
  println(1, 2.5, "a", 'c', true, 3L, 2.5d);
  print("no newline ");
  print(1.0);
  print(' ');
  print(7);
  println();
  println('x');
  println((int) 'x');
  println(new Named());
  String s = null;
  println(s);
  println(1e7f, 1e6f, 0.001f, 0.0001f, 100f / 3, -0.0f, 1.0f / 0, 0f / 0);
  println(1e7d, 0.001d, 1.0d / 3, 100.0d, 1e21d, 1e-5d, 123456789.0d);
  println(Long.MAX_VALUE, Integer.MAX_VALUE + 1, 3000000000L * 3);
  ArrayList<Integer> list = new ArrayList<Integer>();
  list.add(1);
  list.add(2);
  println(list);
  HashMap<String, String> m = new HashMap<String, String>();
  m.put("k", "v");
  m.put("a", "b");
  println(m);
  println(str(1.5) + str(3) + str('c') + str(true));
  println(0.1f + 0.2f, 0.1 + 0.2, (float) 0.1, 16777217f, 1.1f * 1.1f);
  println(hex(255), hex(-1), binary(5), hex(#FF0000), hex(255, 2), binary(5, 4), unhex("FF"), unbinary("101"));
  println(Float.MAX_VALUE, Float.MIN_VALUE, Double.MAX_VALUE, Double.MIN_VALUE, Math.PI, PI, TWO_PI, HALF_PI);
  println(char(65), int('A'), byte(200), int(2.9), int(-2.9), float("3.5"), int("12"), int("x"), float("y"), boolean(1), boolean("true"));
  println((byte) 200, (short) 70000, (char) 65, (long) 1e19, (int) 1e10, (int) Float.NaN);
  System.out.println("system out " + 1.5);
  System.out.println(2.5);
  System.out.print("sys print");
  System.out.println();
  noLoop();
}
