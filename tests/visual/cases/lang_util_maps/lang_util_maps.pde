// java.util maps and sets: TreeMap/TreeSet (navigation, views, comparators), LinkedHashMap/Set
// (insertion order), HashMap copies (table sizing decides the printed order), default methods of Map,
// entry iteration with remove/setValue, ConcurrentModificationException.
import java.util.*;

void setup() {
  size(320, 240);
  String[] words = {"pear", "apple", "fig", "kiwi", "banana", "cherry"};
  TreeMap<String, Integer> tm = new TreeMap<String, Integer>();
  for (int i = 0; i < words.length; i++) tm.put(words[i], i);
  println(tm, tm.firstKey(), tm.lastKey(), tm.size());
  println(tm.floorKey("c"), tm.ceilingKey("c"), tm.higherKey("fig"), tm.lowerKey("fig"), tm.floorKey("a"));
  println(tm.headMap("fig"), tm.tailMap("fig"), tm.subMap("b", "k"), tm.headMap("fig", true));
  println(tm.firstEntry(), tm.lastEntry().getValue(), tm.pollFirstEntry(), tm, tm.descendingMap());
  for (Map.Entry<String, Integer> e : tm.entrySet()) print(e.getKey() + ":" + e.getValue() + " ");
  println();
  println(tm.keySet(), tm.values(), tm.containsKey("kiwi"), tm.containsValue(3), tm.remove("kiwi"), tm.get("kiwi"));
  TreeMap<Integer, String> byLen = new TreeMap<Integer, String>(Collections.reverseOrder());
  for (String w : words) byLen.put(w.length(), w);
  println(byLen, byLen.firstKey(), byLen.ceilingKey(5));

  TreeSet<Integer> ts = new TreeSet<Integer>(Arrays.asList(5, 1, 9, 3, 7, 3));
  println(ts, ts.first(), ts.last(), ts.floor(4), ts.ceiling(4), ts.higher(9), ts.lower(1));
  println(ts.headSet(5), ts.tailSet(5), ts.subSet(2, 8), ts.headSet(5, true));
  println(ts.pollFirst(), ts.pollLast(), ts, ts.descendingSet(), ts.contains(5), ts.size());
  TreeSet<String> byLength = new TreeSet<String>(new Comparator<String>() {
    public int compare(String a, String b) {
      return a.length() != b.length() ? a.length() - b.length() : a.compareTo(b);
    }
  });
  byLength.addAll(Arrays.asList(words));
  println(byLength, byLength.first());

  LinkedHashMap<String, Integer> lhm = new LinkedHashMap<String, Integer>();
  for (int i = 0; i < words.length; i++) lhm.put(words[i], words[i].length());
  lhm.put("apple", 0);
  lhm.remove("fig");
  lhm.put("fig", 9);
  println(lhm, lhm.keySet(), lhm.values());
  LinkedHashSet<Character> lhs = new LinkedHashSet<Character>();
  for (char c : "mississippi".toCharArray()) lhs.add(c);
  println(lhs, lhs.contains('s'), lhs.size());

  HashMap<String, Integer> hm = new HashMap<String, Integer>();
  for (int i = 0; i < 12; i++) hm.put("k" + i, i);
  HashMap<String, Integer> copy = new HashMap<String, Integer>(hm);
  HashSet<String> hs = new HashSet<String>(hm.keySet());
  println(hm);
  println(copy);
  println(hs);
  hm.compute("k1", (k, x) -> x == null ? 1 : x + 100);
  hm.computeIfPresent("k2", (k, x) -> null);
  hm.merge("k3", 5, Integer::sum);
  hm.replaceAll((k, x) -> x * 2);
  println(hm.get("k1"), hm.containsKey("k2"), hm.get("k3"), hm.getOrDefault("zz", -1), hm.size());
  try {
    for (String k : hm.keySet()) if (k.equals("k5")) hm.remove(k);
  } catch (ConcurrentModificationException e) {
    println("CME");
  }
  Iterator<Map.Entry<String, Integer>> mi = hm.entrySet().iterator();
  while (mi.hasNext()) {
    Map.Entry<String, Integer> e = mi.next();
    if (e.getValue() > 10) mi.remove();
    else e.setValue(-e.getValue());
  }
  println(hm);
  Map<String, Integer> sorted = new TreeMap<String, Integer>(hm);
  println(sorted, sorted instanceof SortedMap, sorted instanceof HashMap, hm.keySet().contains("k4"));
  // Copies size their table from the source's size, which changes the iteration order.
  HashMap<Integer, String> ints = new HashMap<Integer, String>();
  ints.put(16, "a");
  for (int i = 0; i <= 10; i++) ints.put(i, "v");
  HashMap<Integer, String> filled = new HashMap<Integer, String>();
  filled.putAll(ints);
  HashMap<Integer, String> grown = new HashMap<Integer, String>();
  grown.put(99, "x");
  grown.putAll(ints);
  println(ints.keySet());
  println(new HashMap<Integer, String>(ints).keySet(), filled.keySet(), grown.keySet());
  println(new HashSet<Integer>(ints.keySet()), new HashSet<Integer>(Arrays.asList(32, 0, 16, 1)), new HashMap<Integer, String>(64).isEmpty());
  Map<Integer, List<String>> groups = new TreeMap<Integer, List<String>>();
  for (String w : words) groups.computeIfAbsent(w.length(), k -> new ArrayList<String>()).add(w);
  println(groups);
  noLoop();
}
