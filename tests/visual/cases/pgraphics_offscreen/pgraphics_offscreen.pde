// createGraphics() off-screen buffer drawn with image().
PGraphics pg;

void setup() {
  size(320, 240);
  pg = createGraphics(160, 120);
}

void draw() {
  background(255);
  pg.beginDraw();
  pg.background(40, 40, 80);
  pg.noStroke();
  pg.fill(255, 200, 0);
  pg.ellipse(80, 60, 90, 90);
  pg.endDraw();
  image(pg, 20, 20);
  image(pg, 180, 100, 120, 90);
  fill(255, 0, 0);
  rect(10, 180, 40, 40);
}
