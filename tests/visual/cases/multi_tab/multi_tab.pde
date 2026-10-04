// Multiple tabs + user classes with inheritance, overloading and an interface.
ArrayList<Shape> shapes = new ArrayList<Shape>();

void setup() {
  size(320, 240);
  shapes.add(new Box(40, 40, 60));
  shapes.add(new Ball(160, 80, 70));
  shapes.add(new Box(220, 140, 50, color(0, 120, 255)));
  shapes.add(new Ball(90, 170));
}

void draw() {
  background(245);
  for (Shape s : shapes) {
    s.display();
  }
  println(shapes.size(), describe(3), describe(2.5));
  noLoop();
}

String describe(int n) {
  return "int:" + n;
}

String describe(float f) {
  return "float:" + f;
}
