// blendColor() for every mode (println, except SOFT_LIGHT: drawn only), PImage.blend() and copy(),
// and set()/get() keeping the exact pixels of translucent images.
int[] modes = { REPLACE, BLEND, ADD, SUBTRACT, LIGHTEST, DARKEST, DIFFERENCE, EXCLUSION, MULTIPLY, SCREEN, OVERLAY, HARD_LIGHT, DODGE, BURN };
int[] V = { 0, 1, 64, 126, 127, 128, 129, 200, 255 };

void setup() {
  size(320, 240);
  for (int m : modes) {
    for (int sa : new int[] { 255, 100 }) {
      String s = "mode " + m + " a" + sa + ":";
      for (int v : V) for (int u : V) {
        int c1 = color(v, 255 - v, (v * 7) % 256, 200);
        int c2 = color(u, (u * 3) % 256, 255 - u, sa);
        s += " " + hex(blendColor(c1, c2, m));
      }
      println(s);
    }
  }
  // images: same size blend, then a scaled one (drawn)
  PImage dst = createImage(64, 64, ARGB), src = createImage(64, 64, ARGB);
  dst.loadPixels(); src.loadPixels();
  for (int y = 0; y < 64; y++) for (int x = 0; x < 64; x++) {
    dst.pixels[y * 64 + x] = color(x * 4, y * 4, 128, 255);
    src.pixels[y * 64 + x] = color(255 - y * 4, x * 4, (x + y) * 2, 64 + x * 3);
  }
  dst.updatePixels(); src.updatePixels();
  background(255);
  noStroke();
  int[] shown = { BLEND, ADD, SUBTRACT, LIGHTEST, DARKEST, DIFFERENCE, EXCLUSION, MULTIPLY, SCREEN, OVERLAY, HARD_LIGHT, SOFT_LIGHT, DODGE, BURN };
  for (int i = 0; i < shown.length; i++) {
    PImage d = dst.copy();
    d.blend(src, 0, 0, 64, 64, 0, 0, 64, 64, shown[i]);
    image(d, (i % 7) * 45, (i / 7) * 45, 40, 40);
    if (shown[i] != SOFT_LIGHT) {
      d.loadPixels();
      println("img", shown[i], hex(d.pixels[0]), hex(d.pixels[2080]), hex(d.pixels[4095]));
    }
  }
  PImage scaled = dst.copy();
  scaled.blend(src, 0, 0, 32, 32, 0, 0, 64, 64, MULTIPLY);
  image(scaled, 10, 100, 96, 96);
  // copy() replaces pixels (no blending), set() of an image too, get() keeps translucent pixels
  PImage t = createImage(4, 1, ARGB);
  t.loadPixels();
  t.pixels[0] = 0x00FFFFFF; t.pixels[1] = 0x40102030; t.pixels[2] = 0x80FF8040; t.pixels[3] = 0xFF000000;
  t.updatePixels();
  PImage u = createImage(4, 1, ARGB);
  u.loadPixels(); for (int i = 0; i < 4; i++) u.pixels[i] = 0xFF336699; u.updatePixels();
  u.copy(t, 0, 0, 4, 1, 0, 0, 4, 1);
  u.loadPixels();
  println("copy", hex(u.pixels[0]), hex(u.pixels[1]), hex(u.pixels[2]), hex(u.pixels[3]));
  PImage w = createImage(6, 1, ARGB);
  w.set(1, 0, t);
  w.loadPixels();
  println("set", hex(w.pixels[0]), hex(w.pixels[1]), hex(w.pixels[2]), hex(w.pixels[4]), hex(w.get(3, 0)));
  PImage rgb = createImage(2, 1, RGB);
  rgb.loadPixels(); rgb.pixels[0] = 0x80FF8040; rgb.updatePixels();
  println("rgb get", hex(rgb.get(0, 0)), hex(rgb.pixels[0]), hex(t.get(1, 0)));
  // blend on the main canvas
  fill(0, 120, 255);
  rect(150, 110, 150, 100);
  blend(dst, 0, 0, 64, 64, 160, 120, 128, 80, SCREEN);
}
