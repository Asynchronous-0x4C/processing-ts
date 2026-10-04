// Basic 2D primitives with explicit fill/stroke.
void setup() {
  size(320, 240);
}

void draw() {
  background(230);
  stroke(0);
  strokeWeight(2);
  fill(255, 120, 0);
  rect(20, 20, 80, 50);
  fill(0, 160, 255);
  ellipse(160, 45, 80, 50);
  fill(120, 200, 80);
  triangle(230, 70, 270, 20, 310, 70);
  fill(200, 80, 200);
  quad(20, 100, 110, 110, 90, 170, 30, 150);
  noFill();
  arc(160, 140, 90, 70, 0, PI + HALF_PI);
  line(220, 100, 310, 170);
  strokeWeight(6);
  point(250, 200);
  point(280, 200);
  strokeWeight(1);
  fill(255);
  circle(60, 210, 30);
}
