// P3D lights: point, spot and directional lights with falloff and specular, materials (specular,
// shininess, emissive, ambient), sphereDetail, and a lit plane made of a beginShape(QUADS) grid.
void setup() {
  size(320, 240, P3D);
}

void draw() {
  background(0);
  noStroke();
  ambientLight(40, 40, 40);
  lightSpecular(255, 255, 255);
  pointLight(255, 200, 150, 60, 40, 120);
  spotLight(100, 255, 100, 240, 0, 200, 0, 0.3, -1, PI / 5, 4);
  lightFalloff(1, 0.001, 0);
  directionalLight(80, 80, 200, 1, 0, -0.5);

  sphereDetail(30);
  pushMatrix();
  translate(70, 120, 0);
  fill(200);
  specular(255);
  shininess(20);
  sphere(45);
  popMatrix();

  pushMatrix();
  translate(170, 120, 0);
  fill(255, 100, 100);
  specular(0);
  emissive(40, 0, 0);
  sphere(40);
  popMatrix();

  emissive(0);
  pushMatrix();
  translate(260, 120, 0);
  rotateY(0.6);
  rotateX(0.4);
  fill(120, 180, 255);
  ambient(255, 255, 0);
  box(60);
  popMatrix();

  fill(220);
  ambient(220);
  beginShape(QUADS);
  normal(0, -1, 0);
  for (int x = 0; x < 320; x += 20) {
    for (int z = -200; z < 100; z += 20) {
      vertex(x, 200, z);
      vertex(x + 20, 200, z);
      vertex(x + 20, 200, z + 20);
      vertex(x, 200, z + 20);
    }
  }
  endShape();
}
