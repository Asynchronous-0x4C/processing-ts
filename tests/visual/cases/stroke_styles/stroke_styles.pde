// strokeWeight / strokeCap / strokeJoin.
void setup() {
  size(320, 240);
}

void draw() {
  background(255);
  stroke(0);
  for (int i = 0; i < 6; i++) {
    strokeWeight(1 + i * 2);
    line(20, 20 + i * 15, 120, 20 + i * 15);
  }
  strokeWeight(12);
  strokeCap(ROUND);   line(160, 30, 280, 30);
  strokeCap(SQUARE);  line(160, 60, 280, 60);
  strokeCap(PROJECT); line(160, 90, 280, 90);

  noFill();
  strokeWeight(10);
  strokeJoin(MITER); beginShape(); vertex(30, 200); vertex(60, 140); vertex(90, 200); endShape();
  strokeJoin(BEVEL); beginShape(); vertex(130, 200); vertex(160, 140); vertex(190, 200); endShape();
  strokeJoin(ROUND); beginShape(); vertex(230, 200); vertex(260, 140); vertex(290, 200); endShape();
}
