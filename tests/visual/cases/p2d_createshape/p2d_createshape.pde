// P2D createShape(): primitives, a GEOMETRY shape with per-vertex fills, a GROUP, shape transformations
// (translate/rotate/scale applied to the shape), setFill/setStroke and getVertex/setVertex.
PShape r, e, poly, group, tri;

void setup() {
  size(320, 240, P2D);
  fill(255, 120, 0);
  stroke(0);
  r = createShape(RECT, 0, 0, 60, 40);
  e = createShape(ELLIPSE, 0, 0, 50, 30);
  e.setFill(color(0, 160, 255));
  poly = createShape();
  poly.beginShape();
  poly.fill(255, 0, 0);
  poly.vertex(0, 0);
  poly.fill(0, 255, 0);
  poly.vertex(60, 10);
  poly.fill(0, 0, 255);
  poly.vertex(40, 60);
  poly.vertex(5, 45);
  poly.endShape(CLOSE);
  tri = createShape(TRIANGLE, 0, 0, 30, 50, -30, 50);
  tri.setStroke(color(200, 0, 200));
  tri.setStrokeWeight(3);
  group = createShape(GROUP);
  group.addChild(r);
  group.addChild(e);
  println(poly.getVertexCount(), poly.getVertex(1), group.getChildCount());
  poly.setVertex(3, 0, 50);
  r.translate(10, 10);
  e.translate(100, 40);
  e.rotate(0.3);
  tri.translate(260, 30);
  tri.rotate(0.5);
}

void draw() {
  background(230);
  shape(group);
  shape(poly, 200, 120);
  shape(tri);
  pushMatrix();
  translate(40, 160);
  scale(0.8);
  shape(group);
  popMatrix();
  shape(r, 120, 150, 80, 60);
}
