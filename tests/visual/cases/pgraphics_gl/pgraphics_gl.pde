// Offscreen surfaces in a P2D window: createGraphics(P2D) with translucent drawing, createGraphics(P3D)
// with a lit box, createGraphics() (JAVA2D), each drawn with image() (also scaled), and get() of pixels.
PGraphics flat, solid, plain;

void setup() {
  size(320, 240, P2D);
  flat = createGraphics(140, 100, P2D);
  flat.beginDraw();
  flat.background(255, 255, 255, 0);
  flat.noStroke();
  flat.fill(255, 0, 0, 160);
  flat.ellipse(50, 50, 80, 80);
  flat.fill(0, 0, 255, 160);
  flat.rect(60, 20, 70, 60);
  flat.stroke(0);
  flat.strokeWeight(3);
  flat.line(10, 90, 130, 10);
  flat.endDraw();
  solid = createGraphics(140, 100, P3D);
  solid.beginDraw();
  solid.background(30, 60, 90);
  solid.lights();
  solid.noStroke();
  solid.fill(255, 200, 0);
  solid.translate(70, 50, 0);
  solid.rotateY(0.5);
  solid.rotateX(0.4);
  solid.box(50);
  solid.endDraw();
  plain = createGraphics(60, 40);
  plain.beginDraw();
  plain.background(255, 0, 255);
  plain.fill(0, 255, 0);
  plain.ellipse(30, 20, 30, 30);
  plain.endDraw();
  println(hex(flat.get(50, 50)), hex(flat.get(5, 5)), hex(solid.get(70, 50)), hex(plain.get(30, 20)));
}

void draw() {
  background(200, 220, 200);
  fill(0);
  noStroke();
  rect(0, 110, 320, 20);
  image(flat, 10, 10);
  image(flat, 10, 130);
  image(solid, 170, 10);
  image(solid, 170, 130, 70, 50);
  image(plain, 250, 180);
}
