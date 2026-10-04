// Sketch classes built on java.util: subclasses of library collections (constructor arguments,
// overridden methods, double-brace initialization, an LRU cache with removeEldestEntry), and classes
// implementing Iterable, Iterator, Comparable and Comparator used by the library.
import java.util.*;

class Bag extends ArrayList<String> {
  String label;
  Bag(String label, Collection<String> items) {
    super(items);
    this.label = label;
  }
  void addTwice(String s) {
    add(s);
    add(s);
  }
  public String toString() {
    return label + super.toString();
  }
}

class Counter extends HashMap<String, Integer> {
  void count(String k) {
    put(k, getOrDefault(k, 0) + 1);
  }
}

class Lru extends LinkedHashMap<Integer, String> {
  int max;
  Lru(int max) {
    super(16, 0.75, true);
    this.max = max;
  }
  protected boolean removeEldestEntry(Map.Entry<Integer, String> e) {
    return size() > max;
  }
}

class Range implements Iterable<Integer> {
  int lo, hi;
  Range(int lo, int hi) {
    this.lo = lo;
    this.hi = hi;
  }
  public Iterator<Integer> iterator() {
    return new Iterator<Integer>() {
      int i = lo;
      public boolean hasNext() {
        return i < hi;
      }
      public Integer next() {
        return i++;
      }
    };
  }
}

class Card implements Comparable<Card> {
  int rank;
  String suit;
  Card(int rank, String suit) {
    this.rank = rank;
    this.suit = suit;
  }
  public int compareTo(Card o) {
    return rank != o.rank ? rank - o.rank : suit.compareTo(o.suit);
  }
  public boolean equals(Object o) {
    return o instanceof Card && ((Card) o).rank == rank && ((Card) o).suit.equals(suit);
  }
  public int hashCode() {
    return rank * 31 + suit.hashCode();
  }
  public String toString() {
    return rank + suit;
  }
}

class BySuit implements Comparator<Card> {
  public int compare(Card a, Card b) {
    return a.suit.compareTo(b.suit);
  }
}

void setup() {
  size(320, 240);
  Bag b = new Bag("bag", Arrays.asList("a", "b"));
  b.addTwice("x");
  println(b, b.size(), b.indexOf("x"), b instanceof List, b.contains("b"));
  Counter c = new Counter();
  for (String w : "to be or not to be".split(" ")) c.count(w);
  println(c, c.get("be"), c.size());
  ArrayList<Integer> init = new ArrayList<Integer>(List.of(3, 1, 2)) {
    {
      add(4);
    }
  };
  println(init, init.size());
  Lru cache = new Lru(3);
  for (int i = 1; i <= 4; i++) cache.put(i, "v" + i);
  cache.get(2);
  cache.put(5, "v5");
  println(cache, cache.keySet());

  int sum = 0;
  for (int x : new Range(1, 5)) sum += x;
  Iterator<Integer> it = new Range(7, 9).iterator();
  println(sum, it.next(), it.hasNext(), it.next(), it.hasNext());
  try {
    it.remove();
  } catch (UnsupportedOperationException e) {
    println("UOE", e.getMessage());
  }
  ArrayList<Integer> fromRange = new ArrayList<Integer>();
  new Range(0, 3).forEach(x -> fromRange.add(x * x));
  println(fromRange);

  ArrayList<Card> hand = new ArrayList<Card>();
  String[] suits = {"s", "h", "d"};
  for (int i = 0; i < 6; i++) hand.add(new Card(i % 4 + 2, suits[i % 3]));
  Collections.sort(hand);
  println(hand, Collections.max(hand), Collections.min(hand, new BySuit()));
  hand.sort(new BySuit().thenComparing(Comparator.reverseOrder()));
  println(hand);
  TreeSet<Card> deck = new TreeSet<Card>(hand);
  deck.add(new Card(2, "s"));
  HashSet<Card> seen = new HashSet<Card>(hand);
  println(deck, deck.first(), deck.size(), seen.contains(new Card(3, "h")), seen.size());
  TreeMap<Card, Integer> scores = new TreeMap<Card, Integer>(new BySuit());
  for (Card k : hand) scores.merge(k, 1, Integer::sum);
  println(scores);
  noLoop();
}
