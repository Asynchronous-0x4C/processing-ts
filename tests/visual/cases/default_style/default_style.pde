// No background(), fill() or stroke(): checks Processing defaults
// (gray 204 background, white fill, black 1px stroke).
void setup() {
  size(320, 240);
}

void draw() {
  rect(40, 40, 100, 80);
  ellipse(220, 80, 90, 90);
  line(40, 180, 280, 200);
}
