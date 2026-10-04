// randomSeed()/noiseSeed() make Processing's output reproducible; the web runtime must use
// the same generators (java.util.Random + Processing's noise) to match.
void setup() {
  size(320, 240);
  randomSeed(42);
  noiseSeed(7);
  noStroke();
}

void draw() {
  background(255);
  for (int i = 0; i < 40; i++) {
    fill(random(255), random(255), random(255));
    ellipse(random(width), random(height), 20, 20);
  }
  for (int x = 0; x < width; x += 4) {
    float y = 200 + noise(x * 0.02) * 40;
    fill(0);
    rect(x, y, 3, 3);
  }
  println(random(1));
  println(noise(0.5, 0.25));
  noLoop();
}
