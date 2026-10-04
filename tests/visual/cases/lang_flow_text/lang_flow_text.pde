// Control flow corners (labeled break/continue, switch fall-through and default in the middle,
// do-while, ternary chains, short-circuit side effects, the conditional operator's numeric type) and
// text corners (surrogate pairs, escapes, char arithmetic, String methods on Unicode, StringBuilder).
void setup() {
  size(320, 240);
  String found = "none";
  outer:
  for (int i = 0; i < 5; i++) {
    for (int j = 0; j < 5; j++) {
      if (j > i) continue outer;
      if (i * j == 6) {
        found = i + "," + j;
        break outer;
      }
    }
  }
  println(found);
  int total = 0;
  rows:
  for (int i = 1; i <= 4; i++) {
    int k = 0;
    while (true) {
      k++;
      if (k > i) continue rows;
      if (i == 3) break rows;
      total += k;
    }
  }
  println(total);
  block: {
    if (total > 0) break block;
    println("not printed");
  }
  StringBuilder trace = new StringBuilder();
  for (int n = 0; n < 6; n++) {
    switch (n % 4) {
      case 0:
        trace.append("zero ");
      case 1:
        trace.append("one ");
        break;
      default:
        trace.append("many ");
      case 2:
        trace.append("two ");
    }
    trace.append("| ");
  }
  println(trace);
  String day = "tue";
  switch (day) {
    case "mon":
    case "tue":
      println("early week");
      break;
    case "fri":
      println("friday");
  }
  int x = 0;
  do {
    x += 3;
  } while (x < 10);
  int calls = 0;
  boolean b1 = x > 100 && (calls++ > 0);
  boolean b2 = x > 0 || (calls++ > 0);
  boolean b3 = x > 0 | (calls++ > 0);
  println(x, b1, b2, b3, calls, x > 10 ? "big" : x > 5 ? "medium" : "small");
  char grade = x > 10 ? 'A' : 'B';
  long big = true ? 1 : 2L;
  println(grade, big, false ? 1 : 'x', true ? 'y' : 0, false ? 1.5 : 2);

  String emoji = "a😀b";
  println(emoji.length(), emoji.codePointAt(1), emoji.charAt(1) == '\uD83D', emoji.indexOf("b"), emoji.substring(1, 3).length());
  String jp = "日本語テキスト";
  println(jp.length(), jp.charAt(2), jp.substring(3), jp.indexOf('テ'), jp.toUpperCase().equals(jp), (int) jp.charAt(0));
  println("tab\there", "quote\"s", "back\\slash", "unié", 'a' + 'b', (char) ('a' + 1), "" + 'a' + 'b');
  char c = 'z';
  c++;
  c -= 2;
  println(c, (int) c, Character.isLetter(c), Character.toUpperCase(c), Character.getNumericValue('7'), Character.isWhitespace(' '));
  StringBuilder sb = new StringBuilder("hello");
  sb.insert(0, '[').append(']').reverse();
  sb.setCharAt(0, '<');
  sb.deleteCharAt(sb.length() - 1);
  println(sb, sb.length(), sb.indexOf("ll"), sb.charAt(1));
  String csv = "a,,b,c,,";
  println(csv.split(",").length, csv.split(",", -1).length, "  pad  ".trim() + "|", "x".repeat(3));
  noLoop();
}
