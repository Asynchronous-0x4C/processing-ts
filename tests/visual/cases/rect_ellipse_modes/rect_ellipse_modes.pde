// rectMode and ellipseMode variants on the same coordinates.
void setup() {
  size(320, 240);
}

void draw() {
  background(255);
  stroke(0);
  fill(255, 0, 0, 100);
  rectMode(CORNER);  rect(40, 40, 60, 40);
  fill(0, 255, 0, 100);
  rectMode(CORNERS); rect(40, 40, 60, 40);
  fill(0, 0, 255, 100);
  rectMode(CENTER);  rect(40, 40, 60, 40);
  fill(255, 0, 255, 100);
  rectMode(RADIUS);  rect(160, 60, 30, 20);

  fill(255, 0, 0, 100);
  ellipseMode(CENTER);  ellipse(100, 170, 60, 40);
  fill(0, 255, 0, 100);
  ellipseMode(CORNER);  ellipse(100, 170, 60, 40);
  fill(0, 0, 255, 100);
  ellipseMode(RADIUS);  ellipse(250, 170, 30, 20);
  fill(255, 255, 0, 100);
  ellipseMode(CORNERS); ellipse(220, 100, 300, 130);
}
