// Java2D stroke normalization: stroke end points snap to pixel centers (floor(x) + 0.5) in device
// space, curves and ellipses move with them; fills are not normalized.
void setup() {
  size(320, 240);
  background(255);
  noStroke(); fill(0);
  rect(10, 10, 20, 20);
  rect(40.25, 10, 20, 20);
  rect(70.5, 10, 20, 20);
  rect(100.75, 10, 20, 20);
  noFill(); stroke(0);
  rect(10, 50, 20, 20);
  rect(40.25, 50, 20, 20);
  rect(70.5, 50, 20, 20);
  rect(100.75, 50, 20, 20);
  strokeWeight(2);
  rect(10, 90, 20, 20);
  rect(40.5, 90, 20, 20);
  strokeWeight(3);
  rect(70, 90, 20, 20);
  rect(100.5, 90, 20, 20);
  strokeWeight(1);
  line(10, 130, 10, 150);
  line(20.5, 130, 20.5, 150);
  noStroke(); fill(0);
  ellipse(50, 140, 20, 20);
  stroke(0); noFill();
  ellipse(80, 140, 20, 20);
  translate(0.5, 0);
  rect(150, 10, 20, 20);
  scale(2);
  rect(100, 10, 20, 20);
}
