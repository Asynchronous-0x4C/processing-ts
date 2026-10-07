// color() in every form and color mode: rounding, out-of-range values, ints vs floats, HSB, and
// the channel getters (println), plus fill()/background() with the same values (drawn).
void setup() {
  size(320, 240);
  float[] fs = { -10, 0, 0.4, 0.5, 0.6, 1.49, 1.5, 127.5, 128.49, 254.5, 255, 255.4, 300 };
  String s = "gray f:";
  for (float f : fs) s += " " + hex(color(f));
  println(s);
  s = "rgb f:";
  for (float f : fs) s += " " + hex(color(f, 255 - f, f / 2));
  println(s);
  s = "alpha f:";
  for (float f : fs) s += " " + hex(color(10, 20, 30, f));
  println(s);
  int[] is = { -10, 0, 1, 127, 255, 256, 300, 0x123456, 0x80123456, 0xFF000000 };
  s = "gray i:";
  for (int i : is) s += " " + hex(color(i));
  println(s);
  s = "gray i a:";
  for (int i : is) s += " " + hex(color(i, 128));
  println(s);
  println(hex(color(300.0)), hex(color(300)), hex(color(255, 300, -5)), hex(color(#FF8000, 64)));
  colorMode(RGB, 1.0);
  println("RGB 1.0:", hex(color(0.5)), hex(color(0.5, 0.25, 1)), hex(color(1, 0, 0, 0.5)), hex(color(0.999)), hex(color(0.002)));
  colorMode(RGB, 100, 200, 300, 10);
  println("RGB 100/200/300/10:", hex(color(50, 100, 150)), hex(color(33, 67, 101, 5)), hex(color(100)), hex(color(7.5)));
  colorMode(HSB, 360, 100, 100);
  s = "HSB:";
  for (int h = 0; h <= 360; h += 45) s += " " + hex(color(h, 80, 90));
  println(s, hex(color(200, 0, 50)), hex(color(10, 100, 100)), hex(color(359.9, 50, 50)), hex(color(-30, 50, 50)));
  colorMode(HSB, 1.0);
  println("HSB 1.0:", hex(color(0.5, 0.5, 0.5)), hex(color(0.1, 1, 1, 0.5)), hex(color(1.0, 1, 1)));
  colorMode(HSB, 255);
  int c = color(100, 150, 200);
  println("getters HSB:", hue(c), saturation(c), brightness(c), red(c), green(c), blue(c), alpha(c));
  colorMode(RGB, 255);
  c = color(10, 200, 77, 128);
  println("getters RGB:", hue(c), saturation(c), brightness(c), red(c), green(c), blue(c), alpha(c));
  colorMode(RGB, 1.0);
  println("getters RGB 1.0:", red(c), green(c), blue(c), alpha(c), hue(c), saturation(c), brightness(c));
  colorMode(RGB, 255);
  println("lerpColor:", hex(lerpColor(#FF0000, #0000FF, 0.5)), hex(lerpColor(color(0, 0, 0, 0), color(255), 0.25)), hex(lerpColor(#102030, #405060, 1.5)), hex(lerpColor(#102030, #405060, -1)));
  colorMode(HSB, 360, 100, 100);
  println("lerpColor HSB:", hex(lerpColor(color(350, 100, 100), color(10, 100, 100), 0.5)), hex(lerpColor(color(0, 100, 100), color(240, 100, 100), 0.5)));
  colorMode(RGB, 255);
  // drawn with the same values
  background(color(40, 60, 80, 100));
  noStroke();
  for (int i = 0; i < fs.length; i++) {
    fill(fs[i], 255 - fs[i], 128);
    rect(10 + i * 23, 10, 20, 40);
    fill(0, 0, 255, fs[i]);
    rect(10 + i * 23, 60, 20, 40);
  }
  colorMode(HSB, 360, 100, 100);
  for (int h = 0; h < 12; h++) {
    fill(h * 30, 70, 90);
    rect(10 + h * 25, 120, 22, 40);
  }
  stroke(300.0, 20, 50);
  strokeWeight(6);
  line(20, 190, 300, 190);
}
