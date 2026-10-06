// frameCount is 0 in setup() and 1 in the first draw(); it counts frames that were drawn.
void setup() {
  size(320, 240);
  println("setup: frameCount " + frameCount);
}

void draw() {
  println("draw: frameCount " + frameCount);
  background(frameCount * 60);
  fill(255, 0, 0);
  rect(frameCount * 50, 50, 40, 40);
}
