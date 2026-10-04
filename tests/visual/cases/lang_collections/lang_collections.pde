// java.util collections and generics: ArrayList, HashMap/HashSet iteration order (Java's hash order),
// Collections, iterators, generic classes and methods.
import java.util.*;

class Box<T> {
  T value;
  Box(T v) { value = v; }
  T get() { return value; }
  <R> Box<R> map(java.util.function.Function<T, R> f) { return new Box<R>(f.apply(value)); }
}

<T extends Comparable<T>> T largest(List<T> xs) {
  T best = xs.get(0);
  for (T x : xs) if (x.compareTo(best) > 0) best = x;
  return best;
}

void setup() {
  size(320, 240);
  ArrayList<Integer> nums = new ArrayList<Integer>();
  for (int i = 0; i < 6; i++) nums.add(i * 10);
  nums.remove(1);
  nums.remove(Integer.valueOf(40));
  nums.add(0, 99);
  nums.set(2, 7);
  println(nums, nums.size(), nums.get(1), nums.contains(50), nums.indexOf(7), nums.isEmpty());
  Iterator<Integer> it = nums.iterator();
  while (it.hasNext()) if (it.next() > 40) it.remove();
  println(nums);
  ArrayList<String> words = new ArrayList<String>(Arrays.asList("pear", "fig", "apple", "kiwi"));
  Collections.sort(words);
  println(words);
  Collections.sort(words, (a, b) -> a.length() - b.length());
  println(words);
  Collections.reverse(words);
  println(words, Collections.max(words), Collections.min(words));
  words.removeIf(w -> w.length() > 3);
  println(words);
  HashMap<String, Integer> counts = new HashMap<String, Integer>();
  for (String w : "the quick brown fox jumps over the lazy dog the end".split(" ")) {
    counts.put(w, counts.getOrDefault(w, 0) + 1);
  }
  println(counts);
  println(counts.get("the"), counts.get("missing"), counts.containsKey("fox"), counts.size());
  for (String k : counts.keySet()) if (counts.get(k) > 1) println("repeated:", k);
  int total = 0;
  for (Map.Entry<String, Integer> e : counts.entrySet()) total += e.getValue();
  println(total);
  HashMap<Integer, String> byNum = new HashMap<Integer, String>();
  for (int i = 20; i > 0; i -= 3) byNum.put(i, "n" + i);
  println(byNum, byNum.keySet(), byNum.values());
  HashSet<String> set = new HashSet<String>();
  for (String s : new String[] { "zeta", "alpha", "mu", "alpha", "beta" }) set.add(s);
  println(set, set.size(), set.contains("mu"));
  HashSet<Character> letters = new HashSet<Character>();
  for (char c : "hello world".toCharArray()) letters.add(c);
  println(letters);
  Box<String> box = new Box<String>("text");
  Box<Integer> len = box.map(s -> s.length());
  println(box.get(), len.get() + 1);
  println(largest(Arrays.asList(3, 9, 4)), largest(Arrays.asList("b", "c", "a")));
  ArrayList<float[]> pairs = new ArrayList<float[]>();
  pairs.add(new float[] { 1.5, 2 });
  println(pairs.get(0)[0] + pairs.get(0)[1]);
  noLoop();
}
