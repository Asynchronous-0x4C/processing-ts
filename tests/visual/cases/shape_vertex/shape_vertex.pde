// beginShape() kinds: polygon (CLOSE), POINTS, LINES, TRIANGLES, TRIANGLE_STRIP, TRIANGLE_FAN, QUADS.
void setup() {
  size(320, 240);
}

void draw() {
  background(250);
  stroke(0);
  fill(255, 180, 0);
  beginShape();
  vertex(20, 20); vertex(90, 30); vertex(70, 90); vertex(30, 70);
  endShape(CLOSE);

  strokeWeight(4);
  beginShape(POINTS);
  vertex(120, 20); vertex(140, 40); vertex(160, 20); vertex(180, 40);
  endShape();
  strokeWeight(1);

  beginShape(LINES);
  vertex(210, 20); vertex(300, 30); vertex(210, 60); vertex(300, 80);
  endShape();

  fill(0, 150, 255);
  beginShape(TRIANGLES);
  vertex(20, 120); vertex(60, 110); vertex(40, 160);
  vertex(70, 120); vertex(100, 160); vertex(60, 170);
  endShape();

  fill(120, 220, 120);
  beginShape(TRIANGLE_STRIP);
  vertex(120, 170); vertex(130, 110); vertex(150, 170); vertex(160, 110); vertex(180, 170);
  endShape();

  fill(255, 100, 150);
  beginShape(TRIANGLE_FAN);
  vertex(250, 140); vertex(250, 100); vertex(290, 140); vertex(250, 180); vertex(210, 140);
  endShape();

  fill(180, 120, 255);
  beginShape(QUADS);
  vertex(20, 190); vertex(80, 190); vertex(80, 230); vertex(20, 230);
  vertex(100, 190); vertex(180, 195); vertex(170, 230); vertex(110, 225);
  endShape();
}
