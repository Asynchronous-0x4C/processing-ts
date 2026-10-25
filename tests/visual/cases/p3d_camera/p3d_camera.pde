// P3D camera, projection and modelview: print*(), screenX/Y/Z, modelX/Y/Z, ortho/perspective/frustum/camera.
void setup() {
  size(320, 240, P3D);
  printCamera();
  printProjection();
  printMatrix();
  println(screenX(10, 20, 30), screenY(10, 20, 30), screenZ(10, 20, 30));
  translate(50, 60, -70);
  rotateX(0.3);
  rotateY(0.4);
  println(modelX(1, 2, 3), modelY(1, 2, 3), modelZ(1, 2, 3));
  println(screenX(1, 2, 3), screenY(1, 2, 3), screenZ(1, 2, 3));
  println(screenX(1, 2), screenY(1, 2));
  printMatrix();
  ortho();
  printProjection();
  ortho(-100, 50, -30, 60);
  printProjection();
  ortho(-100, 50, -30, 60, 5, 500);
  printProjection();
  perspective();
  printProjection();
  perspective(1.2, 2, 3, 400);
  printProjection();
  frustum(-10, 10, -10, 10, 10, 1000);
  printProjection();
  camera(10, 20, 30, 0, 0, 0, 0, 1, 0);
  printCamera();
  printMatrix();
  PMatrix3D m = (PMatrix3D) getMatrix();
  println(m.m00, m.m01, m.m03, m.m23);
  camera();
  perspective();
  resetMatrix();
  printMatrix();
  translate(160, 120);
  scale(2, 3, 4);
  rotate(0.5, 1, 1, 0);
  println(screenX(5, 6, 7), screenY(5, 6, 7), screenZ(5, 6, 7));
  noLoop();
}

void draw() {
  background(100);
}
