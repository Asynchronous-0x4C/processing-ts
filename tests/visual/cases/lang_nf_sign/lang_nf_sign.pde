// nf/nfs/nfp/nfc keep the sign of negative values that round to zero; nfs/nfp decide by the number's sign.
float[] xs = { -0.00012f, -0.0f, 0.0f, 0.0004f, -0.0004f, -2.5f, 2.5f, -0.5f };
for (float x : xs) {
  println("[" + nf(x, 0, 3) + "] [" + nf(x, 2, 2) + "] [" + nfs(x, 0, 3) + "] [" + nfp(x, 0, 3) + "] [" + nfc(x, 1) + "] [" + nf(x) + "]");
}
int[] ns = { -5, 0, 7, -1234567 };
for (int n : ns) {
  println("[" + nf(n, 3) + "] [" + nfs(n, 2) + "] [" + nfp(n, 0) + "] [" + nfc(n) + "]");
}
// nf(float) with one argument: integral values (in int range) print as an int, others as Float.toString.
println(nf(3.0f) + " " + nf(-7.0f) + " " + nf(1e10f) + " " + nf(2147483520.0f) + " " + nf(0.1f) + " " + nf(1.0f / 0));
int i = 0;
// The argument is evaluated once.
println(nfs(++i * -1.5f, 0, 1) + " " + nfp(++i, 2) + " " + i);
