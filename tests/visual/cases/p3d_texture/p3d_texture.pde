// P3D textures: texture() with textureMode IMAGE and NORMAL, textureWrap(REPEAT), tint, image() in 3D,
// a texture made with createImage/pixels (nearest-looking checkerboard) and with createGraphics(P2D).
PImage checker;
PGraphics pg;

void setup() {
  size(320, 240, P3D);
  checker = createImage(8, 8, RGB);
  checker.loadPixels();
  for (int y = 0; y < 8; y++) {
    for (int x = 0; x < 8; x++) {
      checker.pixels[y * 8 + x] = (x + y) % 2 == 0 ? color(255, 60, 0) : color(255);
    }
  }
  checker.updatePixels();
  pg = createGraphics(64, 64, P2D);
  pg.beginDraw();
  pg.background(0, 80, 160);
  pg.noStroke();
  pg.fill(255, 220, 0);
  pg.ellipse(32, 32, 50, 50);
  pg.endDraw();
}

void draw() {
  background(40);
  noStroke();
  beginShape();
  texture(checker);
  vertex(20, 20, 0, 0);
  vertex(120, 20, 8, 0);
  vertex(120, 100, 8, 8);
  vertex(20, 100, 0, 8);
  endShape();

  textureMode(NORMAL);
  textureWrap(REPEAT);
  tint(150, 255, 150);
  beginShape(QUADS);
  texture(checker);
  vertex(140, 20, 0, 0);
  vertex(300, 20, 3, 0);
  vertex(300, 100, 3, 2);
  vertex(140, 100, 0, 2);
  endShape();
  noTint();
  textureWrap(CLAMP);

  pushMatrix();
  translate(80, 170, 0);
  rotateY(0.7);
  image(pg, -40, -40, 80, 80);
  popMatrix();

  pushMatrix();
  translate(230, 170, -20);
  rotateX(0.5);
  beginShape();
  texture(pg);
  vertex(-50, -40, 0, 0);
  vertex(50, -40, 1, 0);
  vertex(50, 40, 1, 1);
  vertex(-50, 40, 0, 1);
  endShape(CLOSE);
  popMatrix();
}
