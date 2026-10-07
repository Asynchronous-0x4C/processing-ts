// PMatrix2D methods with float results (println of every element), screenX/screenY, getMatrix().
void show(String name, PMatrix2D m) {
  float[] a = m.get(null);
  String s = name + ":";
  for (float f : a) s += " " + f;
  println(s);
}

void setup() {
  size(320, 240);
  PMatrix2D m = new PMatrix2D();
  m.translate(10.3, -4.7);
  show("translate", m);
  m.rotate(0.7);
  show("rotate", m);
  m.scale(1.3, 0.6);
  show("scale", m);
  m.shearX(0.2);
  show("shearX", m);
  m.shearY(-0.35);
  show("shearY", m);
  m.rotateZ(0.1);
  show("rotateZ", m);
  PMatrix2D n = new PMatrix2D(1.5, 0.25, 3, -0.5, 2, 7);
  PMatrix2D p = m.get();
  p.apply(n);
  show("apply", p);
  p = m.get();
  p.preApply(n);
  show("preApply", p);
  p.apply(0.1, 0.2, 0.3, 0.4, 0.5, 0.6);
  show("apply6", p);
  println("det", m.determinant(), n.determinant());
  PMatrix2D inv = m.get();
  println("invert", inv.invert());
  show("inverted", inv);
  PMatrix2D sing = new PMatrix2D(1, 2, 3, 2, 4, 6);
  println("singular", sing.invert());
  println("multX", m.multX(3.5, -2), "multY", m.multY(3.5, -2));
  PVector v = m.mult(new PVector(3.5, -2), null);
  println("mult PVector", v);
  PVector t = new PVector();
  m.mult(new PVector(1, 1, 5), t);
  println("mult target", t);
  float[] out = m.mult(new float[] { 2, 3 }, null);
  println("mult float[]", out[0], out[1]);
  m.transpose();
  show("transpose", m);
  m.reset();
  show("reset", m);
  m.set(1, 2, 3, 4, 5, 6);
  show("set", m);
  m.set(n);
  show("set(m)", m);
  m.set(new float[] { 6, 5, 4, 3, 2, 1 });
  show("set(float[])", m);
  try {
    m.rotateX(1);
  } catch (Exception e) {
    println(e);
  }
  // the renderer's matrix
  translate(100, 50);
  rotate(QUARTER_PI);
  scale(2);
  println("screen", screenX(10, 5), screenY(10, 5));
  PMatrix2D g = (PMatrix2D) getMatrix();
  show("getMatrix", g);
  resetMatrix();
  applyMatrix(n);
  show("applyMatrix", (PMatrix2D) getMatrix());
  printMatrix();
}
