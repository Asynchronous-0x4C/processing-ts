// A retained GROUP of 20,000 quads (80,000 vertices) drawn with shape() every frame.
PShape group;

void setup() {
  size(640, 360, P3D);
  noStroke();
  group = createShape(GROUP);
  for (int i = 0; i < 20000; i++) {
    PShape q = createShape();
    q.beginShape(QUADS);
    q.fill(i % 255, 120, 255 - i % 255);
    float x = (i % 200) * 4 - 400, y = (i / 200) * 4 - 200;
    q.vertex(x, y, 0);
    q.vertex(x + 3, y, 0);
    q.vertex(x + 3, y + 3, 0);
    q.vertex(x, y + 3, 0);
    q.endShape();
    group.addChild(q);
  }
}

void draw() {
  background(0);
  translate(width / 2, height / 2, -100);
  rotateY(frameCount * 0.01);
  shape(group);
}
