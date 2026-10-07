// loadFont(".vlw"): text drawn from the font's glyph bitmaps at its size and scaled, metrics
// (data/ProcessingSansPro-20.vlw was made by Processing from the bundled Processing Sans Pro, SIL OFL 1.1).
PFont f;

void setup() {
  size(400, 300);
  f = loadFont("ProcessingSansPro-20.vlw");
  println(f.getName(), f.getSize(), f.ascent(), f.descent());
  background(255);
  fill(0);
  textFont(f);
  text("Hello, VLW fonts! 0123", 10, 30);
  println(textWidth("Hello, VLW fonts! 0123"), textWidth(" "), textWidth("i"), textWidth("é"), textAscent(), textDescent());
  textSize(32);
  fill(200, 40, 40);
  text("Scaled up: Wq", 10, 80);
  println(textWidth("Scaled up: Wq"), textAscent(), textDescent());
  textFont(f, 12);
  fill(20, 90, 200);
  text("small text at 12 px, kerning AV To", 10.5, 110.25);
  println(textWidth("small text at 12 px, kerning AV To"));
  textFont(f, 20);
  fill(0, 128);
  textAlign(CENTER);
  text("centered\nsecond line", 200, 150);
  textAlign(RIGHT, BOTTOM);
  text("right bottom", 390, 290);
  textAlign(LEFT, TOP);
  fill(0);
  text("box text wraps inside the rectangle when it is long", 10, 200, 180, 80);
  text("Supercalifragilisticexpialidocious word", 210, 190, 120, 80);
  noFill();
  stroke(0, 60);
  rect(10, 200, 180, 80);
  rect(210, 190, 120, 80);
}
