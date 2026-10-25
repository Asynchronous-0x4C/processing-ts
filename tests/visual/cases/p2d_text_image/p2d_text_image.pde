// P2D text (default font, sizes, alignment, a rotated line) and images (tint, scaling, get/set, pixels).
PImage img;

void setup() {
  size(320, 240, P2D);
  img = createImage(40, 30, ARGB);
  img.loadPixels();
  for (int i = 0; i < img.pixels.length; i++) {
    int x = i % 40, y = i / 40;
    img.pixels[i] = color(x * 6, y * 8, 150, 255 - x * 3);
  }
  img.updatePixels();
}

void draw() {
  background(250);
  fill(0);
  textSize(12);
  text("Hello P2D 12px", 10, 20);
  textSize(24);
  fill(200, 0, 0);
  text("Big text", 10, 50);
  textAlign(CENTER);
  fill(0, 0, 200);
  text("centered", 160, 80);
  textAlign(LEFT);
  pushMatrix();
  translate(250, 120);
  rotate(0.4);
  fill(0, 120, 0);
  textSize(16);
  text("rotated", 0, 0);
  popMatrix();

  image(img, 10, 100);
  image(img, 60, 100, 80, 60);
  tint(255, 120);
  image(img, 150, 100);
  noTint();
  tint(255, 0, 0);
  image(img, 200, 160);
  noTint();
  set(10, 200, color(255, 0, 0));
  loadPixels();
  for (int x = 20; x < 120; x++) pixels[220 * width + x] = color(0, 0, 255);
  updatePixels();
  println(hex(get(10, 200)), hex(get(50, 220)), hex(get(20, 110)));
}
