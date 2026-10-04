// Exceptions: messages of runtime exceptions, custom exceptions, finally ordering, multi-catch,
// rethrow, try-with-resources closing order.
class GameOverException extends Exception {
  int score;
  GameOverException(String msg, int score) {
    super(msg);
    this.score = score;
  }
}

class Resource implements AutoCloseable {
  String name;
  Resource(String n) { name = n; println("open " + n); }
  public void close() { println("close " + name); }
}

int depth(int n) throws GameOverException {
  if (n > 3) throw new GameOverException("too deep", n);
  return depth(n + 1);
}

String order() {
  StringBuilder sb = new StringBuilder();
  try {
    sb.append("try ");
    throw new IllegalStateException("bad");
  } catch (IllegalStateException e) {
    sb.append("catch:" + e.getMessage() + " ");
  } finally {
    sb.append("finally");
  }
  return sb.toString();
}

int finallyWins() {
  try {
    return 1;
  } finally {
    println("finally runs before return");
  }
}

void setup() {
  size(320, 240);
  try {
    int zero = 0;
    println(10 / zero);
  } catch (ArithmeticException e) {
    println(e.getMessage(), e);
  }
  try {
    int[] a = new int[2];
    a[5] = 1;
  } catch (ArrayIndexOutOfBoundsException e) {
    println(e.getMessage());
  }
  try {
    Integer.parseInt("abc");
  } catch (NumberFormatException e) {
    println(e.getMessage());
  }
  try {
    String s = null;
    s.length();
  } catch (NullPointerException e) {
    println("NPE caught");
  }
  try {
    depth(0);
  } catch (GameOverException e) {
    println(e.getMessage(), e.score, e instanceof Exception);
  }
  println(order());
  println(finallyWins());
  try {
    Object o = "x";
    Integer n = (Integer) o;
  } catch (ClassCastException | ArithmeticException e) {
    println("multi-catch", e instanceof ClassCastException);
  }
  try {
    try {
      throw new RuntimeException("inner");
    } finally {
      println("inner finally");
    }
  } catch (RuntimeException e) {
    println("outer caught " + e.getMessage());
  }
  try (Resource r1 = new Resource("A"); Resource r2 = new Resource("B")) {
    println("using " + r1.name + r2.name);
    throw new RuntimeException("boom");
  } catch (RuntimeException e) {
    println("after close: " + e.getMessage());
  }
  RuntimeException re = new RuntimeException("wrapped", new IllegalArgumentException("cause"));
  println(re.getMessage(), re.getCause().getMessage());
  println(new Exception().getMessage(), new RuntimeException("m").toString());
  noLoop();
}
