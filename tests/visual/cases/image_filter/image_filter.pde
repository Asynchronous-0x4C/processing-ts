// filter(): every kind on a palette (println of the pixels), BLUR impulse responses and edges, small
// images, and filters on the main canvas.
int[] cols = { 0xFF000000, 0xFFFFFFFF, 0xFF808080, 0xFF7F7F7F, 0xFFFF0000, 0xFF00FF00, 0xFF0000FF, 0xFF123456,
               0x80FF8040, 0x00FFFFFF, 0xFF7F8081, 0xFFC86432, 0x40102030, 0xFF7F0000, 0xFF800000, 0xFF000080 };

PImage palette(int fmt) {
  PImage im = createImage(cols.length, 1, fmt);
  im.loadPixels();
  for (int i = 0; i < cols.length; i++) im.pixels[i] = cols[i];
  im.updatePixels();
  return im;
}

void show(String name, PImage im) {
  im.loadPixels();
  String s = name + " " + im.format + ":";
  for (int i = 0; i < im.pixels.length; i++) s += " " + hex(im.pixels[i]);
  println(s);
}

void setup() {
  size(320, 240);
  for (int fmt : new int[] { RGB, ARGB }) {
    PImage im;
    im = palette(fmt); im.filter(GRAY); show("GRAY", im);
    im = palette(fmt); im.filter(INVERT); show("INVERT", im);
    im = palette(fmt); im.filter(OPAQUE); show("OPAQUE", im);
    im = palette(fmt); im.filter(THRESHOLD); show("THRESHOLD", im);
    im = palette(fmt); im.filter(THRESHOLD, 0.3); show("THRESHOLD.3", im);
    im = palette(fmt); im.filter(THRESHOLD, 0.502); show("THRESHOLD.502", im);
    im = palette(fmt); im.filter(POSTERIZE, 2); show("POSTERIZE2", im);
    im = palette(fmt); im.filter(POSTERIZE, 7); show("POSTERIZE7", im);
  }
  // BLUR: impulse responses (rows of the result) for several radii
  for (float r : new float[] { 0.5, 1, 1.5, 3 }) {
    PImage im = createImage(25, 25, RGB);
    im.loadPixels();
    for (int i = 0; i < im.pixels.length; i++) im.pixels[i] = 0xFF000000;
    im.pixels[12 * 25 + 12] = 0xFFFFFFFF;
    im.pixels[0] = 0xFFC8C8C8;
    im.updatePixels();
    im.filter(BLUR, r);
    im.loadPixels();
    String s = "BLUR" + r + ":";
    for (int x = 0; x < 25; x++) s += " " + (im.pixels[12 * 25 + x] & 255);
    s += " |";
    for (int x = 0; x < 6; x++) s += " " + (im.pixels[x] & 255) + "/" + (im.pixels[x * 25] & 255);
    println(s);
  }
  PImage ab = createImage(9, 9, ARGB);
  ab.loadPixels();
  ab.pixels[40] = 0xFFFF0000;
  ab.pixels[20] = 0x8000FF00;
  ab.updatePixels();
  ab.filter(BLUR, 1);
  show("BLUR ARGB", ab);
  // small images
  for (int[] sz : new int[][] { {1, 1}, {5, 1}, {3, 5}, {4, 4}, {12, 5}, {5, 12}, {16, 9} }) {
    PImage im = createImage(sz[0], sz[1], RGB);
    im.loadPixels();
    for (int i = 0; i < im.pixels.length; i++) im.pixels[i] = color((i * 53) % 256);
    im.updatePixels();
    im.filter(BLUR, 1);
    show("BLUR " + sz[0] + "x" + sz[1], im);
  }
  // ERODE / DILATE
  PImage src = createImage(7, 5, RGB);
  src.loadPixels();
  for (int i = 0; i < src.pixels.length; i++) src.pixels[i] = color((i * 37) % 256, (i * 91) % 256, (i * 53) % 256);
  src.updatePixels();
  PImage e = src.copy(); e.filter(ERODE); show("ERODE", e);
  PImage d = src.copy(); d.filter(DILATE); show("DILATE", d);

  // on the main canvas
  background(255);
  noStroke();
  for (int i = 0; i < 8; i++) {
    fill(i * 32, 255 - i * 32, 128);
    ellipse(30 + i * 36, 60, 40, 40);
  }
  fill(0);
  rect(20, 110, 280, 20);
  filter(BLUR, 2);
  fill(200, 50, 50);
  rect(20, 150, 130, 70);
  fill(50, 50, 200);
  rect(170, 150, 130, 70);
  filter(POSTERIZE, 3);
  PImage g = get(0, 0, 160, 120);
  g.filter(GRAY);
  g.filter(INVERT);
  image(g, 160, 120);
}
