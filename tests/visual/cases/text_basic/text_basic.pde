// text() with textSize / textAlign. Font rasterization differs between Java and browsers,
// so this case uses a loose tolerance.
void setup() {
  size(320, 240);
}

void draw() {
  background(255);
  fill(0);
  textSize(24);
  text("Hello, Processing", 20, 40);
  textSize(16);
  textAlign(CENTER);
  text("centered", width / 2, 90);
  textAlign(RIGHT);
  text("right", width - 20, 130);
  textAlign(LEFT);
  fill(200, 0, 0);
  textSize(32);
  text("123", 20, 200);
}
