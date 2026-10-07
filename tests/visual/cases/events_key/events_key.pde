// Key events replayed by tools/vt (vt.json "input"): key/keyCode in each handler, keyTyped, keyPressed.
void setup() {
  size(320, 240);
}

void draw() {
  background(keyPressed ? 0 : 255);
  println("draw", frameCount, int(key), keyCode, keyPressed);
}

void keyPressed() {
  println("pressed", int(key), keyCode, keyPressed, key == CODED);
}

void keyPressed(KeyEvent e) {
  println("pressed(e)", int(e.getKey()), e.getKeyCode());
  keyPressed();
}

void keyTyped() {
  println("typed", int(key), keyCode);
}

void keyReleased() {
  println("released", int(key), keyCode, keyPressed);
}
