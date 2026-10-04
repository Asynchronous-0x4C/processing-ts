// Static mode: no setup()/draw(), just statements.
size(320, 240);
background(255, 240, 200);
noStroke();
for (int i = 0; i < 8; i++) {
  fill(i * 30, 100, 255 - i * 30);
  ellipse(30 + i * 37, 120, 30, 30 + i * 15);
}
