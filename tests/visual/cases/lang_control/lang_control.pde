// Control flow: switch (int, char, String) with fall-through, labeled break/continue, do-while,
// short-circuit evaluation, ternaries, for with several variables.
int calls = 0;

boolean touch(boolean v) {
  calls++;
  return v;
}

String kind(int n) {
  switch (n) {
    case 0: return "zero";
    case 1:
    case 2: return "small";
    default: return n < 0 ? "negative" : "big";
  }
}

void setup() {
  size(320, 240);
  println(kind(0), kind(2), kind(-5), kind(99));
  StringBuilder sb = new StringBuilder();
  for (int i = 0; i < 4; i++) {
    switch (i) {
      case 0: sb.append("a");
      case 1: sb.append("b"); break;
      case 2: sb.append("c");
      default: sb.append("d");
    }
  }
  println(sb);
  char grade = 'B';
  switch (grade) {
    case 'A': println("excellent"); break;
    case 'B': case 'C': println("good"); break;
    default: println("?");
  }
  String cmd = "stop";
  switch (cmd) {
    case "go": println("going"); break;
    case "stop": println("stopping"); break;
  }
  int found = -1;
  outer:
  for (int i = 0; i < 5; i++) {
    for (int j = 0; j < 5; j++) {
      if (i * j == 6) {
        found = i * 10 + j;
        break outer;
      }
    }
  }
  println(found);
  int skipped = 0;
  rows:
  for (int i = 0; i < 4; i++) {
    for (int j = 0; j < 4; j++) {
      if (j > i) continue rows;
      skipped++;
    }
  }
  println(skipped);
  int k = 10;
  do { k -= 3; } while (k > 0);
  println(k);
  calls = 0;
  boolean x = touch(false) && touch(true);
  boolean y = touch(true) || touch(false);
  boolean z = touch(false) & touch(true);
  boolean w = touch(true) | touch(false);
  println(x, y, z, w, calls, true ^ true, false ^ true);
  int n = 7;
  String size = n > 10 ? "large" : n > 5 ? "medium" : "small";
  println(size);
  for (int i = 0, j = 10; i < j; i += 3, j -= 2) print(i + ":" + j + " ");
  println();
  int count = 0;
  while (true) {
    if (++count >= 5) break;
  }
  println(count);
  int total = 0;
  for (int i = 0; i < 10; i++) {
    if (i % 2 == 0) continue;
    total += i;
  }
  println(total);
  noLoop();
}
