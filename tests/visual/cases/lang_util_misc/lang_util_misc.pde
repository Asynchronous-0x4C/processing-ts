// java.util helpers: Random (seeded sequences), Collections, Arrays, Objects, StringJoiner,
// StringTokenizer, String.join.
import java.util.*;

void setup() {
  size(320, 240);
  Random r = new Random(42);
  println(r.nextInt(), r.nextInt(100), r.nextFloat(), r.nextDouble(), r.nextBoolean(), r.nextLong() > 0); // a long beyond 2^53 is not exact (STATUS C6)
  println(r.nextGaussian(), r.nextGaussian(), r.nextInt(1 << 20), r.nextInt(Integer.MAX_VALUE), r.nextInt(7));
  Random r2 = new Random(42);
  int[] counts = new int[6];
  for (int i = 0; i < 600; i++) counts[r2.nextInt(6)]++;
  println(counts);
  r2.setSeed(-7);
  println(r2.nextInt(10), r2.nextFloat(), r2.nextLong() < 0);
  ArrayList<Integer> deck = new ArrayList<Integer>();
  for (int i = 0; i < 10; i++) deck.add(i);
  Collections.shuffle(deck, new Random(3));
  println(deck);

  println(Objects.equals(null, null), Objects.equals("a", "a"), Objects.equals(1, 1.0), Objects.hash(1, "a", 2.5), Objects.hashCode(null));
  println(Objects.toString(null), Objects.toString(null, "dflt"), Objects.isNull(null), Objects.nonNull(3), Objects.requireNonNullElse(null, "else"));
  try {
    Objects.requireNonNull(null, "must not be null");
  } catch (NullPointerException e) {
    println(e.getMessage());
  }
  StringJoiner sj = new StringJoiner(", ", "[", "]");
  sj.add("a").add("b");
  StringJoiner empty = new StringJoiner("-");
  empty.setEmptyValue("none");
  println(sj, sj.length(), empty, new StringJoiner("/", "<", ">"));
  StringTokenizer tok = new StringTokenizer("the quick,brown  fox", " ,");
  println(tok.countTokens());
  while (tok.hasMoreTokens()) print(tok.nextToken() + "|");
  println();
  println(String.join("/", Arrays.asList("x", "y", "z")), String.join("+", "1", "2"));

  ArrayList<String> names = new ArrayList<String>(Arrays.asList("delta", "alpha", "charlie", "bravo"));
  Collections.sort(names);
  println(names, Collections.binarySearch(names, "charlie"), Collections.binarySearch(names, "beta"));
  Collections.reverse(names);
  Collections.swap(names, 0, 3);
  println(names, Collections.max(names), Collections.min(names, Comparator.comparing(String::length)));
  Collections.rotate(names, 1);
  println(names, Collections.frequency(names, "alpha"), Collections.nCopies(3, "ab"), Collections.singletonList(7));
  List<String> un = Collections.unmodifiableList(names);
  try {
    un.add("x");
  } catch (UnsupportedOperationException e) {
    println("UOE", un.size());
  }
  Collections.sort(names, Collections.reverseOrder());
  println(names);
  Collections.fill(names, "z");
  println(names);

  int[] a = {5, 3, 9, 1, 7};
  int[] b = Arrays.copyOf(a, 7);
  Arrays.sort(a);
  println(Arrays.toString(a), Arrays.toString(b), Arrays.binarySearch(a, 7), Arrays.binarySearch(a, 4));
  Integer[] boxed = {5, 3, 9, 1};
  Arrays.sort(boxed, Collections.reverseOrder());
  println(Arrays.toString(boxed));
  String[] ss = {"b", "c", "a"};
  Arrays.sort(ss);
  println(Arrays.toString(ss), Arrays.asList(ss), Arrays.equals(a, new int[] {1, 3, 5, 7, 9}), Arrays.hashCode(new int[] {1, 2}));
  println(Arrays.deepToString(new int[][] {{1, 2}, {3}}), Arrays.toString(Arrays.copyOfRange(a, 1, 3)));
  float[] fs = new float[3];
  Arrays.fill(fs, 0.5);
  char[] cs = "hello".toCharArray();
  Arrays.sort(cs);
  println(Arrays.toString(fs), new String(cs), Arrays.toString(cs));
  noLoop();
}
