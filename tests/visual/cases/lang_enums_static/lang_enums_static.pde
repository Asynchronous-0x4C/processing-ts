// Enums (fields, constructors, methods, switch, values/valueOf/ordinal), static members of the sketch
// and of nested classes, static and instance initializers.
enum Planet {
  MERCURY(3.303e+23f, 2.4397e6f), EARTH(5.976e+24f, 6.37814e6f), JUPITER(1.9e+27f, 7.1492e7f);
  final float mass, radius;
  Planet(float mass, float radius) { this.mass = mass; this.radius = radius; }
  float gravity() { return 6.67300E-11f * mass / (radius * radius); }
}

enum Dir { UP, DOWN, LEFT, RIGHT;
  Dir opposite() {
    switch (this) {
      case UP: return DOWN;
      case DOWN: return UP;
      case LEFT: return RIGHT;
      default: return LEFT;
    }
  }
}

static int instances = 0;
static final int LIMIT = 3;

static class Registry {
  static int counter;
  static { counter = 100; }
  static int nextId() { return ++counter; }
}

class Item {
  int id;
  { instances++; }
  Item() { id = Registry.nextId(); }
}

static int square(int x) { return x * x; }

void setup() {
  size(320, 240);
  for (Planet p : Planet.values()) println(p, p.ordinal(), p.name(), p.gravity());
  Dir d = Dir.valueOf("LEFT");
  println(d, d.opposite(), Dir.UP.compareTo(Dir.RIGHT), d == Dir.LEFT, Dir.values().length);
  switch (d) {
    case LEFT: println("go left"); break;
    case RIGHT: println("go right"); break;
    default: println("vertical");
  }
  java.util.HashMap<Dir, Integer> moves = new java.util.HashMap<Dir, Integer>();
  moves.put(Dir.UP, 1);
  moves.put(Dir.UP, moves.get(Dir.UP) + 1);
  println(moves.get(Dir.UP), moves.containsKey(Dir.DOWN));
  for (int i = 0; i < LIMIT; i++) new Item();
  Item last = new Item();
  println(instances, last.id, Registry.counter, square(LIMIT));
  try {
    Dir.valueOf("NOWHERE");
  } catch (IllegalArgumentException e) {
    println(e.getMessage());
  }
  noLoop();
}
