// bezier(), curve(), bezierVertex(), quadraticVertex(), curveVertex().
void setup() {
  size(320, 240);
}

void draw() {
  background(255);
  noFill();
  stroke(0);
  strokeWeight(2);
  bezier(20, 80, 60, 10, 120, 150, 150, 60);
  curve(150, 200, 180, 80, 290, 70, 300, 200);
  fill(255, 200, 120);
  beginShape();
  vertex(20, 150);
  bezierVertex(60, 110, 100, 230, 140, 160);
  quadraticVertex(160, 120, 180, 170);
  endShape(CLOSE);
  noFill();
  beginShape();
  curveVertex(200, 220);
  curveVertex(200, 220);
  curveVertex(240, 140);
  curveVertex(280, 200);
  curveVertex(310, 130);
  curveVertex(310, 130);
  endShape();
}
