// Mouse events replayed by tools/vt (vt.json "input"): handler order, mouseX/pmouseX, mouseButton, counts.
void setup() {
  size(320, 240);
}

void draw() {
  background(255);
  fill(0);
  ellipse(mouseX, mouseY, 10, 10);
  println("draw", frameCount, mouseX, mouseY, pmouseX, pmouseY, mousePressed, mouseButton);
}

void mouseMoved() {
  println("moved", mouseX, mouseY, pmouseX, pmouseY);
}

void mouseDragged() {
  println("dragged", mouseX, mouseY, pmouseX, pmouseY, mouseButton);
}

void mousePressed() {
  println("pressed", mouseX, mouseY, mouseButton, mousePressed);
}

void mouseReleased(MouseEvent e) {
  println("released", e.getX(), e.getY(), e.getButton(), e.getCount(), mouseButton, mousePressed);
}

void mouseClicked(MouseEvent e) {
  println("clicked", e.getX(), e.getY(), e.getButton(), e.getCount(), mouseButton);
}

void mouseWheel(MouseEvent e) {
  println("wheel", e.getCount(), mouseX, mouseY);
}
