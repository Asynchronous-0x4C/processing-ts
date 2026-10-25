// P3D loadShape() of an OBJ with an MTL material file (colors per material, normals), lit.
PShape model;

void setup() {
  size(320, 240, P3D);
  model = loadShape("cube.obj");
  println(model.getChildCount());
}

void draw() {
  background(20);
  lights();
  translate(width / 2, height / 2, 0);
  rotateX(-0.5);
  rotateY(0.6);
  scale(50);
  shape(model);
}
