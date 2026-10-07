// noise() with noiseSeed(): the values must match Processing exactly (compared through println).
void setup() {
  size(320, 240);
  noiseSeed(7);
  background(255);
  noStroke();
  fill(0);
  for (int x = 0; x < width; x++) {
    float n = noise(x * 0.01, 3.5);
    rect(x, 240 - n * 200, 1, n * 200);
  }
  // 1D, including negative and large inputs
  float[] xs = { 0, 0.1, 0.5, 0.99, 1, 1.5, 2.25, 10.7, -0.3, -5.5, 100.125, 4095.5, 70000.3 };
  for (float x : xs) println(x, noise(x));
  // 2D and 3D
  for (int i = 0; i < 8; i++) {
    println(noise(i * 0.37, i * 0.11), noise(i * 0.37, i * 0.11, i * 0.53));
  }
  // noiseDetail: octaves and falloff
  noiseDetail(1);
  println(noise(0.3), noise(1.7, 2.2), noise(3.3, 4.4, 5.5));
  noiseDetail(8, 0.65);
  println(noise(0.3), noise(1.7, 2.2), noise(3.3, 4.4, 5.5));
  noiseDetail(2, 0.25);
  println(noise(0.3), noise(1.7, 2.2), noise(3.3, 4.4, 5.5));
  noiseDetail(0, 0);  // ignored
  println(noise(0.3));
  noiseDetail(4, 0.5);
  // reseeding restarts the table
  noiseSeed(12345);
  println(noise(0.3), noise(12.5, 7.25, 0.125));
  noiseSeed(7);
  println(noise(0.3), noise(12.5, 7.25, 0.125));
  // the noise generator is separate from random()
  randomSeed(1);
  println(random(1), noise(0.3), random(1));
}
