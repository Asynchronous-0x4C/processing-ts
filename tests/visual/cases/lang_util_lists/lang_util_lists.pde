// java.util lists and queues: LinkedList, ArrayDeque, Stack, Vector, PriorityQueue (internal heap
// order is visible when printed), CopyOnWriteArrayList, ListIterator, ConcurrentModificationException,
// fixed-size and immutable lists, and the collection interfaces.
import java.util.*;
import java.util.concurrent.*;

void setup() {
  size(320, 240);
  LinkedList<Integer> ll = new LinkedList<Integer>();
  ll.add(3);
  ll.addFirst(1);
  ll.addLast(5);
  ll.add(1, 2);
  ll.push(0);
  ll.offer(6);
  println(ll, ll.getFirst(), ll.getLast(), ll.peek(), ll.peekLast(), ll.size(), ll.indexOf(5));
  println(ll.poll(), ll.pop(), ll.removeFirst(), ll.removeLast(), ll.pollLast(), ll);
  ll.addAll(Arrays.asList(7, 8, 9));
  ll.remove(Integer.valueOf(8));
  ll.remove(0);
  println(ll, ll.isEmpty(), ll.poll(), ll.peek(), ll.contains(9));

  ArrayDeque<String> dq = new ArrayDeque<String>();
  dq.push("a");
  dq.push("b");
  dq.offerLast("c");
  dq.offerFirst("d");
  dq.addLast("e");
  println(dq, dq.peekFirst(), dq.peekLast(), dq.pop(), dq.pollLast(), dq);
  Iterator<String> di = dq.descendingIterator();
  while (di.hasNext()) print(di.next() + " ");
  println();
  Deque<Integer> squares = new ArrayDeque<Integer>();
  for (int i = 0; i < 4; i++) squares.push(i * i);
  Queue<Integer> q = new LinkedList<Integer>(squares);
  println(squares, squares.contains(4), q.remove(), q.element(), q);

  Stack<Character> st = new Stack<Character>();
  for (char c : "hello".toCharArray()) st.push(c);
  println(st, st.peek(), st.pop(), st.search('h'), st.search('z'), st.empty(), st.size(), st.get(0));
  Vector<Float> v = new Vector<Float>();
  v.add(1.5);
  v.addElement(2.5);
  v.insertElementAt(0.5, 0);
  println(v, v.elementAt(1), v.firstElement(), v.lastElement());

  PriorityQueue<Integer> pq = new PriorityQueue<Integer>();
  int[] vals = {5, 1, 8, 3, 9, 2, 7};
  for (int x : vals) pq.add(x);
  println(pq, pq.peek(), pq.size());
  String out = "";
  while (!pq.isEmpty()) out += pq.poll() + " ";
  println(out);
  PriorityQueue<String> pqs = new PriorityQueue<String>(10, Collections.reverseOrder());
  pqs.addAll(Arrays.asList("pear", "apple", "fig", "kiwi"));
  println(pqs, pqs.poll(), pqs);
  PriorityQueue<Integer> pq2 = new PriorityQueue<Integer>(Arrays.asList(9, 4, 7, 1, 8, 2));
  println(pq2);
  pq2.remove(4);
  println(pq2, pq2.contains(7));

  ArrayList<Integer> al = new ArrayList<Integer>(Arrays.asList(4, 8, 15, 16, 23, 42));
  ListIterator<Integer> li = al.listIterator();
  while (li.hasNext()) {
    int x = li.next();
    if (x % 2 == 1) li.remove();
    else li.set(x / 2);
  }
  println(al, li.hasPrevious(), li.previous(), li.previousIndex(), li.nextIndex());
  li.add(99);
  println(al);
  Iterator<Integer> it = al.iterator();
  while (it.hasNext()) if (it.next() > 10) it.remove();
  println(al);
  try {
    for (Integer x : al) if (x == 2) al.remove(x);
  } catch (ConcurrentModificationException e) {
    println("CME", e.getMessage());
  }
  println(al);
  CopyOnWriteArrayList<String> cow = new CopyOnWriteArrayList<String>(new String[] {"x", "y"});
  for (String s : cow) cow.add(s + s);
  println(cow);

  List<Integer> asList = al;
  Collection<Integer> coll = al;
  Object o = al;
  println(asList instanceof List, coll instanceof RandomAccess, ll instanceof Deque, dq instanceof Queue, o instanceof Collection, o instanceof Set, o instanceof Iterable);
  List<String> fixed = Arrays.asList("b", "a", "c");
  Collections.sort(fixed);
  fixed.set(0, "A");
  println(fixed);
  try {
    fixed.add("d");
  } catch (UnsupportedOperationException e) {
    println("UOE fixed");
  }
  List<Integer> imm = List.of(3, 1, 2);
  println(imm, imm.get(1), imm.contains(2), imm.indexOf(2));
  try {
    imm.set(0, 5);
  } catch (UnsupportedOperationException e) {
    println("UOE immutable");
  }
  ArrayList<Integer> big = new ArrayList<Integer>(Arrays.asList(1, 2, 3, 4, 5, 6));
  List<Integer> sub = big.subList(1, 4);
  sub.set(0, 20);
  println(sub, big, sub.size());
  LinkedList<Integer> copy = new LinkedList<Integer>(big);
  println(big.equals(copy), copy.equals(big), big.hashCode() == copy.hashCode(), copy.hashCode());
  big.replaceAll(x -> x * 10);
  big.removeIf(x -> x > 100);
  println(big, big.toArray().length);
  noLoop();
}
