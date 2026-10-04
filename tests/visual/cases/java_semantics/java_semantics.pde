// Java semantics that a naive JS translation gets wrong. Compared through println() output.
void setup() {
  size(320, 240);
  int a = 7;
  int b = 2;
  println(a / b);              // 3 (integer division)
  println(-7 / 2);             // -3 (truncation toward zero)
  println(-7 % 3);             // -1
  println((int) 3.99);         // 3 (cast)
  println((int) -3.99);        // -3
  println(int(-2.5));          // -2
  println(1.0);                // 1.0 (Java float formatting)
  println(10 / 4.0);           // 2.5
  println(0.1f + 0.2f);        // float precision
  char c = 'a';
  println(c + 1);              // 98 (char arithmetic)
  println((char) (c + 1));     // b
  println("x" + c + 1);        // xa1
  int big = 2147483647;
  println(big + 1);            // -2147483648 (overflow)
  long l = 2147483648L;
  println(l * 2);              // 4294967296
  println(5 / 2 * 2.0);        // 4.0
  String s = "abc";
  println(s.length());
  println(s.charAt(1));
  println(s.equals("ab" + "c"));
  int[] arr = new int[3];
  println(arr[0] + " " + arr.length);
  float f = 1 / 3;
  println(f);                  // 0.0
  println(max(3, 7) + min(2.5, 1));
  println(nf(3.14159, 1, 2));
  println(nf(42, 5));
  println(str(true) + str(12));
  boolean flag = false;
  println(!flag && (a > b));
  noLoop();
}

void draw() {
  background(255);
}
