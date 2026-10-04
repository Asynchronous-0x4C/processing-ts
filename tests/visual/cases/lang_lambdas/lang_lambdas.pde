// Lambdas, method references, functional interfaces and anonymous classes.
import java.util.*;
import java.util.function.*;

interface Op {
  int apply(int a, int b);
}

int combine(int a, int b, Op op) {
  return op.apply(a, b);
}

int twice(IntUnaryOperator f, int x) {
  return f.applyAsInt(f.applyAsInt(x));
}

int base = 100;

void setup() {
  size(320, 240);
  Op add = (a, b) -> a + b;
  Op mul = (int a, int b) -> { return a * b; };
  println(combine(3, 4, add), combine(3, 4, mul), combine(3, 4, (a, b) -> a - b + base));
  int offset = 7;
  Function<Integer, Integer> plus = x -> x + offset;
  BiFunction<String, Integer, String> rep = (s, n) -> s.repeat(n);
  Supplier<String> hi = () -> "hi";
  Predicate<String> empty = String::isEmpty;
  Function<String, Integer> len = String::length;
  UnaryOperator<String> up = String::toUpperCase;
  println(plus.apply(5), rep.apply("ab", 3), hi.get(), empty.test(""), len.apply("four"), up.apply("x"));
  println(twice(x -> x * 3, 2), twice(Math::abs, -5));
  Runnable r = () -> println("run!");
  r.run();
  Runnable anon = new Runnable() {
    int calls = 0;
    public void run() {
      calls++;
      println("anon run " + calls + " " + base);
    }
  };
  anon.run();
  anon.run();
  ArrayList<String> names = new ArrayList<String>(Arrays.asList("Cy", "Al", "Bo"));
  names.sort(Comparator.naturalOrder());
  println(names);
  names.sort((a, b) -> b.compareTo(a));
  println(names);
  StringBuilder sb = new StringBuilder();
  names.forEach(n -> sb.append(n.toLowerCase()));
  println(sb);
  Comparator<String> byLast = new Comparator<String>() {
    public int compare(String a, String b) {
      return a.charAt(a.length() - 1) - b.charAt(b.length() - 1);
    }
  };
  Collections.sort(names, byLast);
  println(names);
  BinaryOperator<Integer> maxOp = Math::max;
  println(maxOp.apply(3, 8));
  Consumer<String> show = this::shout;
  show.accept("hey");
  noLoop();
}

void shout(String s) {
  println(s.toUpperCase() + "!");
}
