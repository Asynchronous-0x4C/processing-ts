// P2D matrices: the identity camera, the orthographic projection, PMatrix3D from getMatrix(), screenX/Y.
void setup() {
  size(320, 240, P2D);
  printCamera();
  printProjection();
  printMatrix();
  println(screenX(10, 20), screenY(10, 20));
  println(getMatrix().getClass().getName());
  translate(5, 6);
  rotate(0.5);
  scale(1.5, 0.75);
  shearX(0.2);
  printMatrix();
  println(screenX(10, 20), screenY(10, 20));
  pushMatrix();
  resetMatrix();
  printMatrix();
  popMatrix();
  printMatrix();
  noLoop();
}

void draw() {
  background(100);
}
