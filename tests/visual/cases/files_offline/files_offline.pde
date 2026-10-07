// Run offline (vt.json "offline"): the files come from a Service Worker's cache, fetched before setup().
PImage img;

void setup() {
  size(320, 240);
  img = loadImage("opaque.png");
  String[] lines = loadStrings("lines.txt");
  println(lines.length, lines[0]);
  int n = 1;
  PImage tile = loadImage("tile" + n + ".png");
  println(tile.width, hex(tile.get(0, 0)));
}

void draw() {
  background(255);
  image(img, 20, 20, 160, 120);
  println(img.width, img.height);
  noLoop();
}
