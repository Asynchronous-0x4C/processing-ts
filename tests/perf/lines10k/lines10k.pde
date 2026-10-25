// 10,000 line segments per frame (P2D strokes are tessellated on the CPU).
void setup() {
  size(640, 360, P2D);
}

void draw() {
  background(255);
  for (int i = 0; i < 10000; i++) {
    float a = i * 0.01 + frameCount * 0.01;
    stroke(i % 255, 0, 255 - i % 255, 100);
    strokeWeight(1 + i % 3);
    line(320 + 150 * cos(a), 180 + 150 * sin(a * 1.1), 320 + 170 * cos(a * 0.9), 180 + 170 * sin(a));
  }
}
