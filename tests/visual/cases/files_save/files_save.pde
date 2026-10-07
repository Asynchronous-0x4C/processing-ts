// Files the sketch writes (relative to the sketch folder) can be read back in the same run.
void setup() {
  size(320, 240);
  background(30, 60, 90);
  noStroke();
  fill(255, 200, 0);
  rect(20, 20, 100, 60);
  saveStrings("out/lines.txt", new String[] { "a", "b é", "" });
  String[] back = loadStrings("out/lines.txt");
  println(back.length, back[0], back[1], "[" + back[2] + "]");
  saveBytes("b.dat", new byte[] { 1, -2, 127 });
  byte[] bb = loadBytes("b.dat");
  println(bb.length, bb[0], bb[1], bb[2]);
  save("shot.png");
  PImage s = loadImage("shot.png");
  println(s.width, s.height, hex(s.get(30, 30)), hex(s.get(5, 5)));
  save("shot.tif");
  PImage t = loadImage("shot.tif");
  println(t.width, t.height, hex(t.get(30, 30)));
  PImage small = get(0, 0, 50, 40);
  small.save("small.tga");
  PImage u = loadImage("small.tga");
  println(u.width, u.height, hex(u.get(25, 25)), hex(u.get(5, 5)));
  saveFrame("frame-###.png");
  println(loadImage("frame-000.png") != null);
  image(u, 200, 100);
}
