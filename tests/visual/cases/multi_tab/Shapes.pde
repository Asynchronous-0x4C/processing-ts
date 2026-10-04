interface Drawable {
  void display();
}

abstract class Shape implements Drawable {
  float x, y;
  color c = color(255, 120, 0);

  Shape(float x, float y) {
    this.x = x;
    this.y = y;
  }
}

class Box extends Shape {
  float s;

  Box(float x, float y, float s) {
    super(x, y);
    this.s = s;
  }

  Box(float x, float y, float s, color c) {
    this(x, y, s);
    this.c = c;
  }

  void display() {
    fill(c);
    rect(x, y, s, s);
  }
}

class Ball extends Shape {
  float d;

  Ball(float x, float y) {
    this(x, y, 40);
  }

  Ball(float x, float y, float d) {
    super(x, y);
    this.d = d;
  }

  void display() {
    fill(c);
    ellipse(x, y, d, d);
  }
}
