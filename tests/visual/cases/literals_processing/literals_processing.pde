// Literal values as Processing 4.5.2 reads them. Compared through println() output.
// Text blocks are NOT Java text blocks here: the value starts with a newline and keeps the raw lines.
void setup() {
  size(320, 240);
  String a = """
      x
    y
    """;
  println("[" + a.replace("\n", "|") + "] " + a.length());
  String b = """
    t\ttab "q" A\101
    end""";
  println("[" + b.replace("\n", "|") + "] " + b.length());
  var n = 3;
  var list = new ArrayList<String>();
  list.add("v");
  println(n + list.size());
  color c = #FF8800;
  println(hex(c) + " " + (c >> 24) + " " + hex(#80102030));
  println(0xFFFFFFFF);          // -1
  println(0x80000000);          // -2147483648
  println(0b1010 + 010);        // 10 + 8
  println(1_000_000);
  println(-2147483648);
  println(0x7fffffffL + 1);     // long arithmetic
  println('A' + "" + '\101' + '\t' + "|");
  background(255);
}
