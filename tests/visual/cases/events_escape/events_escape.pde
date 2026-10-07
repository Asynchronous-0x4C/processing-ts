// Esc quits a Processing sketch unless keyPressed() sets key to something else.
void setup() {
  size(320, 240);
}

void draw() {
  background(200, 220, 255);
  println("draw", frameCount, int(key), keyCode);
}

void keyPressed() {
  println("pressed", int(key), keyCode, key == ESC);
  if (key == ESC) key = 0;
}

void keyReleased() {
  println("released", int(key), keyCode);
}
