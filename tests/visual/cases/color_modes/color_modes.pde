// colorMode(HSB) grid, color() values, alpha blending and lerpColor.
void setup() {
  size(320, 240);
  noStroke();
}

void draw() {
  background(255);
  colorMode(HSB, 360, 100, 100);
  for (int i = 0; i < 12; i++) {
    for (int j = 0; j < 4; j++) {
      fill(i * 30, 100 - j * 20, 100);
      rect(10 + i * 25, 10 + j * 25, 24, 24);
    }
  }
  colorMode(RGB, 255);
  color a = color(255, 0, 0);
  color b = color(0, 0, 255);
  for (int i = 0; i <= 10; i++) {
    fill(lerpColor(a, b, i / 10.0));
    rect(10 + i * 28, 130, 27, 30);
  }
  fill(0, 200, 0, 128);
  rect(40, 175, 120, 50);
  fill(200, 0, 200, 128);
  rect(100, 190, 120, 40);
  fill(128);
  rect(250, 180, 50, 50);
}
