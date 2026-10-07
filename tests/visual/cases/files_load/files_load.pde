// Reading the sketch's files: data/ first, then the sketch folder; images are ready when loadImage()
// returns; names built at run time; missing files give null.
void setup() {
  size(320, 240);
  background(255);
  PImage opaque = loadImage("opaque.png");
  PImage photo = loadImage("photo.jpg");
  PImage alpha = loadImage("alpha.png");
  PImage rgba = loadImage("rgba_opaque.png");
  println(opaque.width, opaque.height, opaque.format, hex(opaque.get(10, 5)), hex(opaque.pixels[5 * 40 + 10]));
  println(photo.width, photo.height, photo.format);
  println(alpha.width, alpha.height, alpha.format, hex(alpha.get(16, 3)));
  println(rgba.width, rgba.height, rgba.format, hex(rgba.get(1, 1)));
  image(opaque, 10, 10);
  image(photo, 60, 10);
  image(alpha, 110, 10);
  image(rgba, 150, 10);
  image(opaque, 10, 60, 120, 90);
  // names built at run time (found through the listing of data/)
  for (int i = 0; i < 3; i++) {
    PImage f = loadImage("sub/frame" + i + ".png");
    image(f, 180 + i * 25, 60);
    println(i, hex(f.get(0, 0)));
  }
  String[] lines = loadStrings("lines.txt");
  println(lines.length);
  for (String l : lines) println("[" + l + "]");
  String[] bom = loadStrings("bom.txt");
  println(bom.length, "[" + bom[0] + "]", bom[0].length(), "[" + bom[1] + "]");
  println(loadStrings("root.txt")[0]);
  println(loadStrings("data/lines.txt")[0]);
  println(loadStrings("./lines.txt")[1]);
  byte[] b = loadBytes("bytes.bin");
  println(b.length, b[0], b[2], b[3], b[4], b[5]);
  JSONObject j = loadJSONObject("values.json");
  println(j.getString("name"), j.getInt("n"));
  println(loadImage("missing.png") == null, loadStrings("missing.txt") == null, loadBytes("missing.bin") == null);
}
