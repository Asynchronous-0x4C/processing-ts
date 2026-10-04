// #RRGGBB and 0xAARRGGBB literals, and red()/green()/blue() extraction.
void setup() {
  size(320, 240);
  noStroke();
}

void draw() {
  background(#202830);
  fill(#FF8800);
  rect(20, 20, 80, 80);
  fill(#00C0FF);
  rect(120, 20, 80, 80);
  fill(0x80FFFFFF);
  rect(60, 60, 120, 80);
  color c = #3366CC;
  fill(red(c), green(c), blue(c));
  rect(220, 20, 80, 80);
  fill(c);
  rect(220, 120, 80, 80);
  println(red(c), green(c), blue(c), alpha(c));
  println(hex(c));
  noLoop();
}
