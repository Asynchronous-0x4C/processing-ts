# 現状と既知の問題（2026-10-25 時点）

スケッチの変換は新コンパイラ（`src/compiler/`、ROADMAP P1、P1-9 で切り替え）。ランタイムは PApplet + レンダラ非依存の PGraphics + Canvas 2D の JAVA2D レンダラ（P2-1。PixiJS は外した）と WebGL2 の P2D/P3D レンダラ（P3。必要なときだけ読み込む）に Java 言語ランタイム（`src/runtime/lang/`）を組み合わせている。
数値の根拠は [research/2026-10-measurements/RESULTS.md](research/2026-10-measurements/RESULTS.md) と `npm run test:visual` の結果。

## サマリ

| 領域 | 状態 |
|---|---|
| 構文解析 | Lezer の Processing 文法（`src/compiler/grammar/`）。公式文法（ANTLR）と受理/拒否が 1,190/1,190 件一致（`npm run test:grammar`）。構文エラーはタブ・行・列つきで複数件 |
| 意味解析（型） | 型検査器（`src/compiler/check.ts`）。本物の Processing の `cli --build` と 2,381/2,384 件一致、見逃し 0（`npm run test:check`。不一致 3 件はすべて `java.awt`） |
| コード生成 | 静的型を使って Java の意味を保つ（整数演算、float、char、キャスト、オーバーロード、ボクシング、例外、ラムダ…）。java.util の互換層あり。`lang` タグの 24 ケースすべてで println 出力が本物の Processing と完全一致（ブラウザの `npm run test:visual`。Node の `npm run test:lang` は random() を持たないスタブなので random_seed を除く 23 件） |
| モード | 静的・アクティブ・Java モード。`size()`/`smooth()`/`pixelDensity()` などの `settings()` への移動も Processing と同じ規則 |
| 変換速度 | ブラウザで 199 行のコールド変換 22ms、ウォーム 3ms。5k 行のウォーム 41ms（`npm run bench`） |
| 2D 描画 | Canvas 2D の JAVA2D レンダラ。図形・各モード・strokeCap/Join・beginShape の全種別と contour・bezier/curve・変換（shear/applyMatrix）・colorMode（RGB/HSB）・blendMode・tint・createGraphics。Java2D のストローク正規化も再現。2d タグの視覚ケースはすべて PASS |
| P2D / P3D | WebGL2 の自作レンダラ（`src/lib/runtime/opengl/`、ARCHITECTURE.md「OpenGL レンダラ」）。カメラ・投影・行列は本物と値まで一致、図形・線・点・テクスチャ・ライト・材質・box/sphere・blendMode・hint・createGraphics(P2D/P3D)・loadPixels/get/set。3d/p2d タグの視覚ケースはすべて PASS（許容差 2%） |
| PShader | loadShader/shader/resetShader/filter(PShader)/set()、Processing の uniform・属性名、GLSL 1.x → GLSL ES 3.00 の自動変換、ppixels、attrib*()。同梱のシェーダー examples 18 本中 15 本が動く（残りは PGL・java.nio を使う低レベル GL の例） |
| PShape | createShape（プリミティブ・GEOMETRY・GROUP・PATH）、shape()、shapeMode、変換、setFill/setStroke/getVertex/setVertex など、loadShape（SVG・OBJ+MTL）、getTessellation/beginTessellation。P2D/P3D では GPU に保持して描く（保持モード） |
| 画像 / pixels | `pixels` は ARGB の Int32Array（普通の PImage では pixels が正で、半透明の画素も書いた値のまま）。loadPixels/updatePixels/get/set/copy/mask/resize/save（png/jpg/tif/tga）、filter（全種類。BLUR の半径の上限など本物の癖も再現）、blend/blendColor（SOFT_LIGHT 以外は本物と全件一致）。loadImage は setup() 前に事前デコードした画像を同期で返す |
| ファイル IO | `SketchFiles`: スケッチが読むファイル（コンパイラが見つけた定数の名前とホストの一覧）を setup() の前に fetch。`data/` → スケッチフォルダの順。Service Worker でオフラインでも動く（`vt run --offline`）。保存はメモリ + ホストへの通知 |
| 互換性コーパス | Processing 同梱 examples 254 本中 **239 本（94%）** がエラーなく完走（JAVA2D 95% / P2D 93% / P3D 93%）。決定的なスケッチの見た目は JAVA2D 120/120、P2D/P3D 39/43 が本物と一致（`npm run vt -- corpus --ref`）。変換できないのは 1 本（`java.awt`）だけで、残りの失敗は P5 の未実装 API（IntList/IntDict/Table/XML/thread/createWriter/sketchPath）、低レベル GL（PGL・java.nio）、複数ウィンドウ。内訳は [tests/corpus/report.md](../tests/corpus/report.md) |
| 視覚テスト | 76 ケースすべて PASS（[TESTING.md](TESTING.md)）。フレーム時間は `npm run vt -- bench`（tests/perf） |
| 単体テスト | Vitest（`npm test`、`tests/unit/`）。CI と lint はなし。型検査は `npm run test:check`、生成コードの実行結果は `npm run test:lang`（どちらも本物の Processing と比較） |

## 実装済み API（ランタイム）

- **PApplet（約 105）**: settings setup draw size fullScreen / background colorMode fill noFill stroke noStroke strokeWeight / rectMode ellipseMode imageMode / point line rect quad ellipse circle arc triangle beginShape vertex endShape / text textAlign textSize textWidth textFont createFont / image loadImage createImage createGraphics / translate rotate scale push pop pushMatrix popMatrix pushStyle popStyle resetMatrix / color red green blue alpha lerpColor / abs ceil floor min max sqrt pow exp sin cos tan asin acos atan atan2 radians degrees constrain map norm dist lerp random noise / int float str split join trim match matchAll nf nfc nfp nfs / year month day hour minute second millis / println / loadStrings saveStrings loadJSONObject saveJSONObject loadJSONArray saveJSONArray / loop noLoop exit getSurface
- **追加（P1-9）**: randomSeed randomGaussian（java.util.Random で Processing と同じ列）、smooth noSmooth pixelDensity displayDensity hint（受け付けるだけ）、noiseSeed noiseDetail（noise() は Processing と同じ値。ケース noise_values）。print/println/str/nf/数学関数などはコンパイラが Java の書式で直接生成する
- **P2D/P3D（P3）**: size(w, h, P2D|P3D)、createGraphics(…, P2D|P3D)、rotateX/Y/Z・translate/scale の 3D 版・applyMatrix(16)、camera/beginCamera/endCamera/perspective/ortho/frustum/printCamera/printProjection、screenX/Y/Z・modelX/Y/Z、box/sphere/sphereDetail、vertex(x, y, z[, u, v])・normal・texture/textureMode/textureWrap、lights/noLights/ambientLight/directionalLight/pointLight/spotLight/lightFalloff/lightSpecular、ambient/specular/emissive/shininess、hint（深度テスト・深度マスク・線の遠近）、smooth(n)（MSAA）、blendMode（REPLACE/BLEND/ADD/SUBTRACT/LIGHTEST/DARKEST/EXCLUSION/MULTIPLY/SCREEN）、flush、PShader 一式、attrib/attribPosition/attribNormal/attribColor、createShape/shape/loadShape
- **変数**: width height mouseX mouseY pmouseX pmouseY mousePressed mouseButton key（文字コード） keyCode keyPressed frameCount frameRate
- **クラス**: PMatrix3D（全メソッド。float 演算で本物と値まで一致、ケース matrix3d_api）、PShape、PShader、PGraphicsOpenGL/PGraphics2D/PGraphics3D、PVector（Processing の全メソッド。static の add/sub/mult/div/dot/cross/dist/angleBetween/fromAngle/random2D/random3D/lerp を含む。成分は float で演算ごとに丸める。toString/equals/hashCode も Processing と同じ。ケース pvector_api）、PMatrix2D（全メソッド。float 演算で本物と値まで一致、ケース matrix_api）、JSONObject、JSONArray、PImage（loadPixels updatePixels get）、PGraphics、PFont、PSurface（setCursor setTitle 等）。java.lang/java.util は言語ランタイム（`src/runtime/lang/`、ARCHITECTURE.md）
- カテゴリ別の実装状況と未実装の一覧は [api-coverage.md](api-coverage.md)（`npm run coverage` で自動生成。リファレンスの関数 217/253 = 86%。コンパイラが直接生成する関数（hex・round・print など）は数えていない）。

## 解消済み（旧トランスパイラ）

旧トランスパイラ（`src/lib/transpiler/`）の問題 T2〜T19（コールド変換の遅さ、キャストの消失、整数除算、char、long リテラル、オーバーロード、コンストラクタ、静的モード、`#RRGGBB`、DOM 依存、エラーが 1 件だけでタブと行が合わない、テキストブロック）は、P1-9 で新コンパイラに切り替えて解消した。新コンパイラ側の残りは下の「既知の問題（コンパイラ）」。なお旧 T17（switch 式 `case X ->` とパターンの instanceof）は Processing 4.5.2 も構文エラーにすることを確認した（新コンパイラも拒否するので一致）。

## 既知のバグ（ランタイム / 描画）

| # | 問題 | 場所 | 検出テスト |
|---|---|---|---|
| R6 | テキストの寸法の残りの差: `textWidth()` は Java2D（ヒンティングされた送り幅）とブラウザで、12px 以上ではほぼ一致（5〜6 桁目）、9px など小さいサイズで最大 0.3% 違う。`textAscent()`/`textDescent()` は既定フォントと .vlw では一致するが、Java2D は TrueType のヒンティングをかけるので他のサイズ・フォントでは 1px ずれることがある（Processing Sans Pro を 40 で作ると本物は 29、こちらは 28）。また本物の `createFont("Processing Sans Pro", …)` は同梱フォントを見つけられず Dialog（Arial 相当）になるが、こちらは同梱フォントを使う。loadFont(.vlw) のファイルが無いときは本物は null を返すが、こちらは名前のフォントで代用する | `PGraphicsJava2D.fontMetrics` | text_metrics |
| R16 | イベントは vt の入力スクリプトで本物と照合済み（ケース events_mouse/events_key/events_escape）だが、Processing 側は AWT イベントを直接 dispatch しているので、OS が AWT イベントを作る部分（Ctrl+英字の文字、Delete/Esc の KEY_TYPED、ダブルクリックの判定時間など）は Windows の既定値を仮定している。mouseEntered/mouseExited・ウィンドウ外へのドラッグ・キーを押したままフォーカスを失った場合は未照合 | `DefaultRunner`, `event/KeyEvent.ts` | events_*, key-event.test.ts |
| R17 | 未実装の主な API: IntList 等のリスト/辞書、Table、XML、delay、thread、createWriter/createReader、sketchPath、selectInput など（P5） | — | — |
| R18 | Processing の PApplet は `pixelDensity` をフィールドとメソッドの両方に持つが、JS では同名にできないのでメソッドだけ（スケッチから `pixelDensity` をフィールドとして読むと関数になる）。`pixelWidth`/`pixelHeight` はフィールド | `PApplet.ts` | — |
| R19 | `blendColor`/`blend()` の SOFT_LIGHT は近似（本物の整数演算を特定できず、約 80% の画素で一致・差は最大 2）。他のモードは本物と全件一致（src の青成分を使う BURN/SOFT_LIGHT の癖も再現）。大きさの違う `blend()`/`copy()` の拡大縮小はキャンバスの補間で、本物（blit_resize）とは画素がずれる | `util/imageOps.ts`, `PImage.blend` | image_blend |
| R20 | 図形の縁のアンチエイリアス: 本物（Java2D の Marlin）は 1 ピクセルを 8 行に分けて行ごとに横の被覆を正確に測るが、ブラウザのキャンバスは実装依存（テストの Chromium は GPU の 4 倍 MSAA で被覆が 1/4 刻み）。point() だけは Marlin と同じ被覆を自前で計算して描く（全太さで誤差 1 以内）。線・塗りの縁は 1/4 刻みのまま。`willReadFrequently`（CPU 描画）にすると縁は近づくが描画が約 3 倍遅くなるので採らない | `PGraphicsJava2D` | shapes_detail |

## 既知の問題（P2D / P3D / PShader / PShape）

規則は本物の出力から決めた（ROADMAP P3）。本物は実機の GPU、テストは SwiftShader なので、縁のアンチエイリアスは画素単位では一致しない（3D の視覚ケースは 2% の許容差）。

| # | 問題 | 場所 | 検出テスト |
|---|---|---|---|
| R21 | P2D の線: 太さ 1 の水平・垂直な線の扱いと、太い線の端・継ぎ目は本物と照合済み（p2d_stroke_styles・p2d_shape_vertex）だが、丸い端・継ぎ目の多角形の分割数、miter の上限（10 と仮定）、太さ 1 未満の線、拡大した図形の線は未照合。P3D の線は端も継ぎ目も描かない（本物と同じに見えるが、細部は未照合）。hint(ENABLE_STROKE_PERSPECTIVE) の太さの規則は推定 | `opengl/tess.ts`, `PGraphicsOpenGL.stroke2DGroup` | p2d_stroke_styles, p3d_stroke_styles |
| R22 | テキスト（P2D/P3D）は行ごとに Canvas 2D で描いたテクスチャ。本物はフォントのグリフ画像（作成時の大きさ）を拡大縮小して描くので、大きな textSize や scale() で本物ほどぼやけない。textMode(SHAPE) は未対応 | `PGraphicsOpenGL.textTexture` | p2d_text_image |
| R23 | 低レベル GL（beginPGL/endPGL・PGL・java.nio のバッファ）は未対応（同梱の LowLevelGLVbo*・DomeProjection）。PShape.getTessellation() は塗りと線のコピーを返すだけで、三角形に分割した頂点は beginTessellation() の box/rect/triangle/quad だけ | — | corpus |
| R24 | 保持モードの PShape は木のどこかが変わると全体を CPU でテッセレーションし直す（本物は GPU のバッファを直接書き換える）。毎フレーム 10 万個の子を動かす TessUpdate は約 1 秒/フレーム | `PGraphicsOpenGL.__drawRetained__` | vt bench |
| R25 | ライトの式（OpenGL 固定機能に合わせた自作。specular は視点を目の位置とする Blinn-Phong、spot は cos の累乗）と既定の材質（specular の既定値 0x808080 は推定）は p3d_lights・p3d_box の 2% 以内で一致を確かめただけ。lights() を呼ばない面や画像は照明なし | `opengl/shaders.ts` | p3d_lights |
| R26 | GLSL の変換は経験則（int → float の暗黙変換はエラーの出た行の整数リテラルを小数にする、ES で予約語の名前を変える、定数でないグローバルの初期化子を main() へ移す）。GLSL ES 3.00 に無い機能（sampler2DRect、gl_FragData[1] 以降、デスクトップの拡張）は GL のコンパイルエラーになる（メッセージに GL のログと .glsl の行番号） | `opengl/PShader.ts` | corpus（Topics/Shaders） |
| R27 | 同梱の ImageMask・BlurFilter は最初のフレームが本物と違う（本物は setup() で描いた内容を最初の draw() のフレームに持ち越さないように見えるが、本物の画面の読み取りが不安定で確かめられていない。TESTING.md の参照の取り方） | — | corpus --ref |
| R28 | 複数ウィンドウ（PApplet のサブクラスを runSketch() で開く MultipleWindows）、windowTitle/windowResizable/windowMove は何もしない（ページがウィンドウを持つ）。orientation() も何もしない | `PApplet.ts` | corpus |
| R29 | noise() は Processing でも種を与えないと実行ごとに違う（MeshTweening など、比較できない）。性能: 即時モードの CPU 側は 1 万頂点で約 1.4ms、10 万頂点の box の格子（CubicGridImmediate）で約 29ms/フレーム（本物は GPU に任せる部分が多い） | — | vt bench |

## 既知の問題（コンパイラ `src/compiler/` と言語ランタイム）

型検査の基準は本物の Processing（`npm run test:check`）、生成コードの実行結果の基準も本物の Processing の出力（`npm run test:lang`）。以下は分かっている差。

| # | 問題 | 場所 |
|---|---|---|
| C1 | ジェネリックメソッドの型引数の推論は上下限つきの単一化まで。実引数の位置にあるジェネリック呼び出し（`Collections.emptyList()` など）は外側の引数の型から推論しないので Object になり、`List<String>` の引数に渡すと誤ってエラーになる | `check.ts`（instantiate / unify） |
| C2 | final 変数への 2 回目の代入（definite unassignment）と blank final フィールドの初期化漏れを検出しない | `definite.ts` |
| C3 | キャプチャ変換をしない（ワイルドカードは境界として読む）。`List<? super T>` への書き込みなど一部で Java より緩い | `typesystem.ts` |
| C4 | 変換速度: ブラウザで 199 行のコールド変換が 22ms（目標 20ms をわずかに超える。ライブラリモデルの初回展開と JIT のウォームアップ）。5k 行のウォームは 40ms（目標 50ms 以内）で、そのうち Lezer の解析が約 20ms | `grammar/processing.grammar`, `library.ts` |
| C5 | `java.awt` など JDK のモデル外のクラスは使えない（`unsupported` で報告。同梱 examples では Yellowtail の `java.awt.Polygon` のみ） | `tools/manifest/ManifestGen.java`（LIBRARY_ROOTS） |
| C6 | long は JS の number（double）で表すため、絶対値が 2^53 を超える値の演算と表示が不正確（`9007199254740993L` → `9007199254740992`）。`Long.MAX_VALUE`/`MIN_VALUE` の表示と飽和キャストは正しい | `runtime/lang/numbers.ts`, `codegen.ts` |
| C7 | `Float.toString` の JDK 17 の再現が 4e25〜7.5e25 付近の一部の値で異なる（Java 17 で出力したランダムな float 30 万個のうち 81 個、double 20 万個のうち 4 個（3e25 付近））。非正規化数の 2 の累乗の一部も異なる | `runtime/lang/numbers.ts` |
| C8 | Integer/Long/Short/Byte のボックスは JS の number のまま: `Integer a = 1000, b = 1000; a == b` が true（Java はキャッシュ範囲外なので false）、整数の `getClass()` は常に `java.lang.Integer`、null の Integer をアンボクシングしても NullPointerException にならない（Character/Float/Double は `JChar`/`JFloat`/`JDouble` なので Java どおり） | `codegen.ts`（box/unbox） |
| C9 | Java モード: スケッチのクラスのコンストラクタは使えない（`unsupported` で報告）。スケッチ以外のトップレベルのクラスはスケッチの static メンバーとして扱うので、スケッチの static メンバーを単純名で参照できてしまう（Java ではエラー） | `sketch.ts` |
| C10 | Processing 4.5.2 は Java 9 以降の文脈キーワード（`module` `open` `opens` `requires` `exports` `to` `uses` `provides` `with` `transitive` `yield` `record` `sealed` `permits` `var`）を変数名・フィールド名に使えない（構文エラー。ローカル変数の `int to` は前処理が InternalError で落ちる）。新コンパイラは受理する | `grammar/processing.grammar` または `cst-to-ast.ts` |
| C11 | java.util の差: TreeMap/TreeSet の `headMap`/`subSet`/`descendingMap` などはビューではなくコピー、`Set.of`/`Map.of` は挿入順（Java は実行ごとにランダム）、Hashtable と ConcurrentHashMap は HashMap と同じ順、ストリーム（`stream()`）は使えない。モデルにあってランタイムに無いクラス（Scanner・Date・Calendar・BitSet・Optional・java.io の大半）は使った時点で UnsupportedOperationException | `runtime/lang/{collections,maps,util}.ts` |
| C12 | Lezer 文法は、開始の `"""` と同じ行に内容があるテキストブロック（`"""abc"""`）を拒否する。Processing 4.5.2 は受理して `"abc"` を返す（確認済み。旧 T18） | `grammar/processing.grammar`（textBlockStart） |

## 既知の問題（IO / PWA）

ファイルは `SketchFiles`（`src/lib/runtime/io/`）: setup() の前に fetch（同期 XHR は廃止）し、画像はデコードまで済ませる。`data/` → スケッチフォルダの順に探し、見つからなければ Processing と同じメッセージを標準エラーに出して null（ケース files_load・files_save・files_offline。files_offline は Service Worker のキャッシュからオフラインで読む）。

- 実行時に組み立てた名前（`loadImage("frame" + i + ".png")`）は、ホストがファイルの一覧（`SketchData.files`、sketch.properties の `resources`、`SketchManager.addFile()`）を渡したときだけ読める。一覧に無く、定数でもない名前は見つからない扱い（Processing なら読める）。
- 保存（saveStrings・saveBytes・save・saveFrame・saveJSON*）はメモリ上のファイルとして同じ実行中に読み戻せ、ホストの "save" リスナーに渡る。ページを再読み込みすると消える（IndexedDB などへの永続化はしていない）。saveStrings の改行は `\n`（Windows の Processing は `\r\n`）。
- TIFF と TGA は自前のエンコーダで無圧縮（Processing の TGA は RLE）。ブラウザは TIFF/TGA を読めないので、スケッチ自身が保存したもの以外の .tif/.tga は loadImage できない。
- JPEG のデコーダはブラウザのもの（Java の ImageIO と画素値が ±1 程度ずれることがある）。PNG の gAMA/ICC は無視する（`colorSpaceConversion: "none"`）。
- selectInput/selectOutput/selectFolder、createReader/createWriter/createInput/createOutput は未実装（java.io の互換層とコールバックの名前呼び出しが必要。P5）。

## 既知の問題（ビルド / リポジトリ）

- `dist/` と `library.js` がコミットされている（ビルド成果物。現在コミットされているのは P2-1 以前の PixiJS 版で、README の手順（CDN の Pixi を読み込む）もそれに合わせたまま。次のリリースで両方を更新する）。`tsc` を実行すると `dist/types` が書き換わるので注意（型チェックは `npm run typecheck` を使う）。
- README の「Processing 4.4 までの構文をサポート」は実態より強い表現。

## バンドルサイズ（現状）

`npm run size`（esbuild でコード分割してバンドルし minify。2026-10-25、P3 の後）。「最初の読み込み」はエントリから静的 import でたどれる部分、「必要なときだけ」は動的 import の部分（P2D/P3D・PShader・PShape。生成コードが使うときだけ読み込む）。

| 成果物 | min | gzip |
|---|---:|---:|
| ライブラリ全体（`src/lib/index.ts`、@lezer を含む）: 最初の読み込み | 682 KiB | 168 KiB |
| ランタイム単体（2D の PApplet・レンダラ・言語ランタイム。コンパイラなし）: 最初の読み込み | 148 KiB | 48 KiB |
| 　+ 必要なときだけ（OpenGL レンダラ・PShader・PShape・PMatrix3D・libtess） | 118 KiB | 40 KiB |
| コンパイラ（`src/compiler/index.ts`） | 531 KiB | 120 KiB |
| 言語ランタイム（`src/runtime/lang`） | 64 KiB | 19 KiB |

既定フォント（TTF 288 KB）はバンドルに含めず、`dist/fonts/` から text() を使うときだけ読む。
