// P2D + PShader used as a post-processing filter (desktop GLSL with Processing's uniforms).
PShader invert;

void setup() {
  size(320, 240, P2D);
  invert = loadShader("invert.glsl");
}

void draw() {
  background(255);
  noStroke();
  fill(255, 0, 0);
  rect(20, 20, 120, 90);
  fill(0, 128, 255);
  ellipse(220, 150, 120, 120);
  filter(invert);
}
