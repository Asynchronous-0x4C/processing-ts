// P2D blend modes: BLEND, ADD, SUBTRACT, LIGHTEST, DARKEST, EXCLUSION, MULTIPLY, SCREEN, REPLACE over a
// gradient background, with translucent fills.
int[] modes = { BLEND, ADD, SUBTRACT, LIGHTEST, DARKEST, EXCLUSION, MULTIPLY, SCREEN, REPLACE };

void setup() {
  size(320, 240, P2D);
}

void draw() {
  background(0);
  noStroke();
  for (int x = 0; x < width; x += 4) {
    fill(x * 255 / width, 120, 255 - x * 255 / width);
    rect(x, 0, 4, height);
  }
  for (int i = 0; i < modes.length; i++) {
    int cx = 30 + (i % 5) * 60, cy = 50 + (i / 5) * 110;
    blendMode(BLEND);
    fill(255);
    rect(cx - 25, cy + 30, 50, 10);
    blendMode(modes[i]);
    fill(255, 200, 0, 180);
    ellipse(cx, cy, 50, 50);
    fill(0, 100, 255, 200);
    rect(cx - 10, cy - 5, 40, 40);
  }
  blendMode(BLEND);
}
