// 10,000 vertices per frame in immediate mode: lit, colored triangles (P3D).
void setup() {
  size(640, 360, P3D);
  noStroke();
}

void draw() {
  background(0);
  lights();
  translate(width / 2, height / 2, -100);
  rotateY(frameCount * 0.01);
  beginShape(TRIANGLES);
  for (int i = 0; i < 10000 / 3; i++) {
    float a = i * 0.05, r = 50 + (i % 200);
    fill(128 + 127 * sin(a), 128 + 127 * cos(a * 1.3), 200);
    vertex(r * cos(a), r * sin(a), (i % 50) * 4 - 100);
    vertex(r * cos(a + 0.05), r * sin(a + 0.05), (i % 50) * 4 - 90);
    vertex((r + 8) * cos(a), (r + 8) * sin(a), (i % 50) * 4 - 95);
  }
  endShape();
}
