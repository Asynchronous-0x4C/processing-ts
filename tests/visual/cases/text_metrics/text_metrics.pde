// textAscent/textDescent of the default font (whole pixels at the size the font was created at, scaled),
// and how text() prints numbers and chars. textWidth is not printed: Java2D's hinted advances differ
// from the browser's by about 0.3% (STATUS R6).
size(400, 300);
background(255);
fill(0);
float[] sizes = { 12, 20, 32, 9.5 };
for (float s : sizes) {
  textSize(s);
  println("size " + s + ": ascent " + textAscent() + " descent " + textDescent() + " width('') " + textWidth("")
    + " leading " + (textAscent() + textDescent()) * 1.275);
}
textSize(20);
text(1.5, 10, 30);
text(0.1f + 0.2f, 10, 55);
text(100.0, 10, 80);
text(1e10f, 10, 105);
text(-0.00012f, 10, 130);
text(42, 10, 155);
text('Q', 10, 180);
text(3.14159265, 10, 205);
text(true ? "yes" : "no", 10, 230);
textSize(14);
text("line one\nline two", 200, 30);
textLeading(30);
text("lead one\nlead two", 200, 100);
textAlign(RIGHT, BOTTOM);
text(12.25, 390, 290);
