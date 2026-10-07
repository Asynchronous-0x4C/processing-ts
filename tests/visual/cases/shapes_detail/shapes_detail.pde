// Details of the JAVA2D renderer: point() for thin and thick strokes with each cap, rounded rects,
// arc() modes and angles, beginContour(), curveTightness().
void setup() {
  size(400, 320);
  background(255);
  // points: weights x caps
  float[] ws = { 0.5, 1, 1.5, 2, 4, 9 };
  int[] caps = { ROUND, SQUARE, PROJECT };
  stroke(0);
  for (int c = 0; c < 3; c++) {
    strokeCap(caps[c]);
    for (int i = 0; i < ws.length; i++) {
      strokeWeight(ws[i]);
      point(20 + i * 22, 20 + c * 22);
      point(20.5 + i * 22, 30.5 + c * 22);
    }
  }
  strokeCap(ROUND);
  // rounded rects
  strokeWeight(1);
  fill(200, 220, 255);
  rect(160, 10, 60, 40, 8);
  rect(230, 10, 60, 40, 2, 10, 20, 0);
  rect(300, 10, 60, 40, 40);
  strokeWeight(4);
  rect(160, 60, 60, 30, 12);
  noFill();
  rect(230, 60, 60, 30, 6, 0, 6, 0);
  // arcs
  strokeWeight(2);
  fill(255, 200, 150);
  arc(40, 120, 60, 60, 0, PI + QUARTER_PI, OPEN);
  arc(110, 120, 60, 60, 0, PI + QUARTER_PI, CHORD);
  arc(180, 120, 60, 60, 0, PI + QUARTER_PI, PIE);
  arc(250, 120, 60, 60, -HALF_PI, HALF_PI);
  arc(320, 120, 60, 40, QUARTER_PI, TWO_PI + HALF_PI, PIE);
  noFill();
  arc(40, 190, 60, 60, PI, TWO_PI);
  arc(110, 190, 60, 60, HALF_PI, PI + HALF_PI, CHORD);
  arc(180, 190, 60, 30, 0.3, 5.5, PIE);
  arc(250, 190, 60, 60, 2, 1);
  // contour
  fill(150, 220, 150);
  strokeWeight(1);
  beginShape();
  vertex(290, 160);
  vertex(380, 160);
  vertex(380, 230);
  vertex(290, 230);
  beginContour();
  vertex(310, 180);
  vertex(310, 210);
  vertex(360, 210);
  vertex(360, 180);
  endContour();
  endShape(CLOSE);
  // curveTightness
  noFill();
  strokeWeight(1.5);
  float[] ts = { -1, 0, 0.5, 1 };
  for (int i = 0; i < ts.length; i++) {
    curveTightness(ts[i]);
    stroke(i * 60, 0, 255 - i * 60);
    beginShape();
    curveVertex(20, 300);
    curveVertex(20, 300);
    curveVertex(80, 250);
    curveVertex(140, 290);
    curveVertex(200, 240);
    curveVertex(260, 300);
    curveVertex(260, 300);
    endShape();
  }
}
