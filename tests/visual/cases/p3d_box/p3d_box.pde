// P3D: lights, box, sphere, perspective transforms.
void setup() {
  size(320, 240, P3D);
}

void draw() {
  background(30);
  lights();
  noStroke();
  pushMatrix();
  translate(110, 120, 0);
  rotateX(0.5);
  rotateY(0.7);
  fill(200, 120, 40);
  box(70);
  popMatrix();
  pushMatrix();
  translate(230, 120, 0);
  fill(80, 160, 255);
  sphereDetail(24);
  sphere(50);
  popMatrix();
}
