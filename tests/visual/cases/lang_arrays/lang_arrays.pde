// Arrays: defaults, typed stores, multi-dimensional and jagged arrays, copies, sorting, printing.
import java.util.Arrays;

void setup() {
  size(320, 240);
  int[] a = new int[3];
  float[] f = new float[2];
  boolean[] z = new boolean[2];
  char[] c = new char[2];
  String[] s = new String[2];
  println(a[0], f[1], z[0], (int) c[0], s[1]);
  a[0] = 7;
  a[1] = (int) 3.9;
  a[2] = a[0] / a[1];
  println(a);
  printArray(new String[] { "x", "y" });
  f[0] = 1.0 / 3;
  f[1] = 16777217;
  println(f[0], f[1]);
  int[][] grid = new int[3][4];
  grid[1][2] = 5;
  println(grid.length, grid[0].length, grid[1][2], grid[2][3]);
  int[][] jag = new int[3][];
  println(jag[0] == null);
  jag[0] = new int[] { 1 };
  jag[1] = new int[] { 1, 2 };
  jag[2] = new int[] { 1, 2, 3 };
  int sum = 0;
  for (int[] row : jag) for (int v : row) sum += v;
  println(sum, jag[2].length);
  float[][] m = { { 1, 2 }, { 3.5, 4 } };
  println(m[1][0] + m[0][1]);
  int[] src = { 1, 2, 3, 4, 5 };
  int[] dst = new int[7];
  System.arraycopy(src, 1, dst, 2, 3);
  println(Arrays.toString(dst));
  int[] copy = src.clone();
  copy[0] = 99;
  println(src[0], copy[0], Arrays.toString(Arrays.copyOf(src, 3)), Arrays.toString(Arrays.copyOfRange(src, 1, 4)));
  int[] u = { 5, 3, 9, 1, 7 };
  Arrays.sort(u);
  println(Arrays.toString(u), Arrays.binarySearch(u, 7));
  String[] words = { "pear", "apple", "fig" };
  Arrays.sort(words);
  println(Arrays.toString(words));
  Integer[] boxed = { 3, 1, 2 };
  Arrays.sort(boxed, (x, y) -> y - x);
  println(Arrays.toString(boxed));
  int[] filled = new int[4];
  Arrays.fill(filled, 8);
  println(Arrays.toString(filled), Arrays.equals(filled, new int[] { 8, 8, 8, 8 }));
  byte[] bytes = new byte[2];
  bytes[0] = (byte) 200;
  bytes[1] += 130;
  short[] shorts = { (short) 70000 };
  char[] chars = { 'a', 98, (char) 99 };
  chars[0]++;
  println(bytes[0], bytes[1], shorts[0], chars[0], chars.length, new String(chars));
  long[] longs = { 1L << 40, 5 };
  double[] ds = { 0.1d, 1e300d * 10 };
  println(longs[0] + longs[1], ds[0], ds[1]);
  Object[] objs = { 1, "two", 3.0, 'c', null };
  println(objs.length, objs[1], objs[4]);
  try {
    println(a[3]);
  } catch (ArrayIndexOutOfBoundsException e) {
    println("caught:", e.getMessage());
  }
  try {
    int[] neg = new int[-1];
  } catch (NegativeArraySizeException e) {
    println("negative:", e.getMessage());
  }
  noLoop();
}
