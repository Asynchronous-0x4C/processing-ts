// Numeric semantics: int overflow, integer division, casts, compound assignment narrowing, shifts,
// float precision (Processing's decimal literals are floats), long, char arithmetic, Math.
void setup() {
  size(320, 240);
  int big = Integer.MAX_VALUE;
  println(big + 1, Integer.MIN_VALUE - 1, big * 2, -Integer.MIN_VALUE, Math.abs(Integer.MIN_VALUE));
  println(7 / 2, -7 / 2, 7 % 3, -7 % 3, 7 % -3, 7.0 / 2, 1 / 2 * 4);
  println((int) 3.99, (int) -3.99, (int) 1e10, (int) Float.NaN, (long) 1e10, (byte) 300, (short) -40000, (char) 66);
  byte b = 100;
  b += 100;
  short sh = 1;
  sh *= 40000;
  char ch = 'a';
  ch += 2;
  ch++;
  int i = 10;
  i *= 2.5;
  i -= 0.9;
  i /= 3;
  println(b, sh, ch, (int) ch, i);
  println(1 << 33, 1 << 31, -16 >> 2, -16 >>> 28, 5 & 3, 5 | 3, 5 ^ 3, ~5);
  long L = 1L << 40;
  println(L, L + 1, 3000000000L * 3, (1L << 50) / 3, 10L / 3, -10L % 3, Long.MAX_VALUE);
  float acc = 0;
  for (int k = 0; k < 10; k++) acc += 0.1;
  double dacc = 0;
  for (int k = 0; k < 10; k++) dacc += 0.1d;
  println(acc, dacc, 0.1 + 0.2, 0.1d + 0.2d, 1.0 / 3, 1.0d / 3, 2.0 / 3 * 3);
  float f = 16777216;
  f += 1;
  println(f, (float) 0.1d, 100.0 / 3, 1e7, 1.0e-5, 123456789.0);
  println(Math.round(2.5), Math.round(-2.5), Math.round(2.4f), Math.floor(-1.5), Math.ceil(-1.5), Math.sqrt(2), Math.pow(2, 10));
  println(round(2.5), floor(-1.5), ceil(1.2), abs(-3), abs(-2.5), sqrt(2), pow(2, 0.5), sq(3), max(1, 5, 3), min(2.5, 1.5));
  println(sin(0), cos(0), sin(PI / 2), atan2(1, 1), degrees(PI), radians(180), exp(1), log(10));
  println('a' + 1, (char) ('a' + 1), 'a' < 'b', (int) 'A', "" + 'x' + 'y', 'x' + 'y');
  int x = 5;
  int y = x++ + ++x;
  int z = x-- - --x;
  println(x, y, z);
  println(Integer.parseInt("-123"), Integer.parseInt("ff", 16), Float.parseFloat("2.5"), Double.parseDouble("1e3"), Integer.valueOf(7) + 1);
  println(Integer.toBinaryString(10), Integer.toHexString(-1), Integer.toString(255, 16), Integer.compare(3, 5), Float.compare(2.5, 1));
  println(Integer.MAX_VALUE, Integer.MIN_VALUE, Float.MAX_VALUE, Float.MIN_VALUE, Double.MAX_VALUE, Long.MIN_VALUE);
  println(0.0 == -0.0, Float.isNaN(0.0 / 0), 1 / 0.0, -1 / 0.0, Double.isInfinite(1 / 0.0d));
  double d = 2;
  float g = 3;
  println(d / g, g / 2, (float) d / 4, 5 / 2f, 5 / 2d);
  noLoop();
}
