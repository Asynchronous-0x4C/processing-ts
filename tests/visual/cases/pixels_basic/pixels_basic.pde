// pixels[] read/write on the main canvas and on a PImage from createImage().
PImage img;

void setup() {
  size(320, 240);
  img = createImage(64, 64, RGB);
  img.loadPixels();
  for (int y = 0; y < img.height; y++) {
    for (int x = 0; x < img.width; x++) {
      img.pixels[y * img.width + x] = color(x * 4, y * 4, 128);
    }
  }
  img.updatePixels();
}

void draw() {
  background(0);
  noStroke();
  fill(255);
  rect(200, 20, 100, 100);
  loadPixels();
  for (int y = 150; y < 230; y++) {
    for (int x = 20; x < 300; x++) {
      pixels[y * width + x] = color((x * 255) / width, 80, (y - 150) * 3);
    }
  }
  updatePixels();
  image(img, 20, 20);
  image(img, 100, 20, 32, 96);
}
