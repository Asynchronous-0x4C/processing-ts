// 2,000 lit boxes per frame in immediate mode with pushMatrix()/popMatrix() (48,000 vertices).
void setup() {
  size(640, 360, P3D);
  noStroke();
}

void draw() {
  background(30);
  lights();
  translate(width / 2, height / 2, -200);
  rotateY(frameCount * 0.01);
  for (int i = 0; i < 2000; i++) {
    pushMatrix();
    translate((i % 20) * 20 - 200, (i / 20 % 10) * 20 - 100, (i / 200) * 20 - 100);
    fill(i % 255, 100, 255 - i % 255);
    box(12);
    popMatrix();
  }
}
