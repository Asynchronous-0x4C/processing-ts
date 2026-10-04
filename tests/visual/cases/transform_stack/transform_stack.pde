// translate / rotate / scale with nested pushMatrix / popMatrix and push / pop.
void setup() {
  size(320, 240);
  noStroke();
}

void draw() {
  background(40);
  for (int i = 0; i < 6; i++) {
    pushMatrix();
    translate(50 + i * 45, 60);
    rotate(i * PI / 12);
    fill(255, 60 + i * 30, 80);
    rect(-15, -15, 30, 30);
    popMatrix();
  }
  push();
  translate(160, 170);
  scale(1.5, 0.75);
  fill(80, 200, 255);
  ellipse(0, 0, 80, 80);
  pushMatrix();
  rotate(QUARTER_PI);
  fill(255);
  rect(-10, -40, 20, 80);
  popMatrix();
  pop();
  fill(255, 255, 0);
  rect(10, 200, 20, 20);
}
