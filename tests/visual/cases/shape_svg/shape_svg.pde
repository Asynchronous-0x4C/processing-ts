// loadShape() of an SVG (paths with curves and arcs, rect/circle/polygon, groups, transforms, styles)
// drawn with shape() in each shapeMode, plus getChild()/disableStyle().
PShape doc;

void setup() {
  size(320, 240);
  doc = loadShape("drawing.svg");
  println(doc.width, doc.height, doc.getChildCount());
  PShape star = doc.getChild("star");
  println(star != null, star.getVertexCount());
}

void draw() {
  background(255);
  shape(doc, 0, 0);
  shapeMode(CENTER);
  shape(doc, 240, 170, 100, 80);
  shapeMode(CORNERS);
  shape(doc, 170, 10, 310, 100);
  shapeMode(CORNER);
  PShape star = doc.getChild("star");
  star.disableStyle();
  fill(0, 120, 255);
  stroke(0);
  strokeWeight(1);
  shape(star, 20, 140);
  star.enableStyle();
}
