# API カバレッジ（自動生成）

`node tools/manifest/coverage.ts` で生成。Processing のリファレンス（[docs/research/processing-api-inventory-2026-10.txt](research/processing-api-inventory-2026-10.txt)）の関数・変数・クラスのうち、ランタイム（`src/lib/runtime`）に**同名の実装があるもの**を数えている。
**挙動が Processing と一致するかは別問題**（[STATUS.md](STATUS.md) と視覚テストを参照）。言語構文（Control / Data の型・演算子・構文キーワード）はコンパイラの担当なので除外。

関数の合計: **102/253（40%）**

| カテゴリ | 関数 | 変数 | クラス |
|---|---:|---:|---:|
| color | 12/16 | - | - |
| constants | - | 5/5 | - |
| data | 9/23 | - | 2/11 |
| environment | 5/18 | 4/9 | - |
| image | 4/18 | 0/1 | 1/1 |
| input | 17/30 | 9/9 | 0/1 |
| lights_camera | 0/27 | - | - |
| math | 24/32 | - | 1/1 |
| output | 4/19 | - | 0/1 |
| rendering | 1/8 | - | 1/2 |
| shape | 14/38 | - | 0/1 |
| transform | 6/13 | - | - |
| typography | 6/11 | - | 1/1 |

## 未実装の一覧

- **color**: brightness(), hue(), saturation(), clear()
- **data**: append(), arrayCopy(), concat(), expand(), reverse(), shorten(), sort(), splice(), subset(), FloatDict, FloatList, IntDict, IntList, StringDict, StringList, Table, TableRow, XML, binary(), hex(), unbinary(), unhex(), splitTokens()
- **environment**: cursor(), delay(), displayDensity(), displayHeight, displayWidth, focused, noCursor(), noSmooth(), pixelDensity(), pixelHeight, pixelWidth, smooth(), windowMove(), windowMoved(), windowRatio(), windowResizable(), windowResize(), windowTitle()
- **image**: noTint(), requestImage(), tint(), blend(), copy(), filter(), get(), loadPixels(), mask(), pixels, set(), updatePixels(), texture(), textureMode(), textureWrap()
- **input**: BufferedReader, createInput(), createReader(), launch(), loadBytes(), loadTable(), loadXML(), parseJSONArray(), parseJSONObject(), parseXML(), selectFolder(), selectInput(), mouseClicked(), mouseDragged()
- **lights_camera**: beginCamera(), camera(), endCamera(), frustum(), ortho(), perspective(), printCamera(), printProjection(), modelX(), modelY(), modelZ(), screenX(), screenY(), screenZ(), ambientLight(), directionalLight(), lightFalloff(), lights(), lightSpecular(), noLights(), normal(), pointLight(), spotLight(), ambient(), emissive(), shininess(), specular()
- **math**: log(), mag(), round(), sq(), noiseDetail(), noiseSeed(), randomGaussian(), randomSeed()
- **output**: beginRaw(), beginRecord(), createOutput(), createWriter(), endRaw(), endRecord(), PrintWriter, saveBytes(), saveStream(), saveTable(), saveXML(), selectOutput(), save(), saveFrame(), print(), printArray()
- **rendering**: hint(), blendMode(), clip(), noClip(), loadShader(), PShader, resetShader(), shader()
- **shape**: createShape(), loadShape(), PShape, square(), box(), sphere(), sphereDetail(), strokeCap(), strokeJoin(), bezier(), bezierDetail(), bezierPoint(), bezierTangent(), curve(), curveDetail(), curvePoint(), curveTangent(), curveTightness(), shape(), shapeMode(), beginContour(), bezierVertex(), curveVertex(), endContour(), quadraticVertex()
- **transform**: applyMatrix(), printMatrix(), rotateX(), rotateY(), rotateZ(), shearX(), shearY()
- **typography**: textLeading(), textMode(), loadFont(), textAscent(), textDescent()

## 参考: core の public API の規模（`src/compiler/api/processing-core.json`）

Processing 4.5.2 の PApplet は public メソッド 351 名 / 715 オーバーロード（内部用の handleDraw や main などを含む）。
