// No background() in draw(): semi-transparent shapes accumulate over 10 frames.
float x = 20;

void setup() {
  size(320, 240);
  background(0);
  noStroke();
}

void draw() {
  fill(255, 200, 0, 60);
  ellipse(x, 120, 80, 80);
  x += 28;
}
