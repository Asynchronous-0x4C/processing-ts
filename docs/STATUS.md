# 現状と既知の問題（2026-10-04 時点）

スケッチの変換は新コンパイラ（`src/compiler/`、ROADMAP P1、P1-9 で切り替え）。ランタイムは旧来の PApplet + PixiJS（P2 で作り直す）に Java 言語ランタイム（`src/runtime/lang/`）を組み合わせている。
数値の根拠は [research/2026-10-measurements/RESULTS.md](research/2026-10-measurements/RESULTS.md) と `npm run test:visual` の結果。

## サマリ

| 領域 | 状態 |
|---|---|
| 構文解析 | Lezer の Processing 文法（`src/compiler/grammar/`）。公式文法（ANTLR）と受理/拒否が 1,190/1,190 件一致（`npm run test:grammar`）。構文エラーはタブ・行・列つきで複数件 |
| 意味解析（型） | 型検査器（`src/compiler/check.ts`）。本物の Processing の `cli --build` と 2,381/2,384 件一致、見逃し 0（`npm run test:check`。不一致 3 件はすべて `java.awt`） |
| コード生成 | 静的型を使って Java の意味を保つ（整数演算、float、char、キャスト、オーバーロード、ボクシング、例外、ラムダ…）。java.util の互換層あり。`lang` タグの 23 ケース中 22 件で println 出力が本物の Processing と完全一致（ブラウザの `npm run test:visual` と Node の `npm run test:lang` の両方。残り 1 件は noise() の違い） |
| モード | 静的・アクティブ・Java モード。`size()`/`smooth()`/`pixelDensity()` などの `settings()` への移動も Processing と同じ規則 |
| 変換速度 | ブラウザで 199 行のコールド変換 22ms、ウォーム 3ms。5k 行のウォーム 40ms（`npm run bench`） |
| 2D 描画 | 基本図形・変換・色（ARGB）・createGraphics は概ね動く。細部（モード、stroke の端/結合、テキスト）にずれ |
| P2D / P3D / PShader | **未実装** |
| 画像 / pixels | PImage の読み込みと表示は可。メインキャンバスの `loadPixels()/pixels[]` は未実装 |
| ファイル IO | **同期 XHR**（Service Worker やオフラインと相性が悪い）。`data/` フォルダを自動で探さない |
| 互換性コーパス | Processing 同梱 examples 254 本中 **124 本（49%）** がエラーなく完走（JAVA2D 71% / P2D 14% / P3D 3%。切り替え前は 95 本）。変換できないのは 1 本（`java.awt`）だけで、残りの失敗はランタイムの未実装 API。内訳と多いエラーは [tests/corpus/report.md](../tests/corpus/report.md) |
| 視覚テスト | 38 ケース: 29 PASS / 9 XFAIL（[TESTING.md](TESTING.md)）。XFAIL はすべてランタイム（描画）の未実装・不一致 |
| 単体テスト | Vitest（`npm test`、`tests/unit/`）。CI と lint はなし。型検査は `npm run test:check`、生成コードの実行結果は `npm run test:lang`（どちらも本物の Processing と比較） |

## 実装済み API（ランタイム）

- **PApplet（約 105）**: settings setup draw size fullScreen / background colorMode fill noFill stroke noStroke strokeWeight / rectMode ellipseMode imageMode / point line rect quad ellipse circle arc triangle beginShape vertex endShape / text textAlign textSize textWidth textFont createFont / image loadImage createImage createGraphics / translate rotate scale push pop pushMatrix popMatrix pushStyle popStyle resetMatrix / color red green blue alpha lerpColor / abs ceil floor min max sqrt pow exp sin cos tan asin acos atan atan2 radians degrees constrain map norm dist lerp random noise / int float str split join trim match matchAll nf nfc nfp nfs / year month day hour minute second millis / println / loadStrings saveStrings loadJSONObject saveJSONObject loadJSONArray saveJSONArray / loop noLoop exit getSurface
- **追加（P1-9）**: randomSeed randomGaussian（java.util.Random で Processing と同じ列）、smooth noSmooth pixelDensity displayDensity hint noiseSeed noiseDetail（受け付けるだけ）。print/println/str/nf/数学関数などはコンパイラが Java の書式で直接生成する
- **変数**: width height mouseX mouseY pmouseX pmouseY mousePressed mouseButton key（文字コード） keyCode keyPressed frameCount frameRate
- **クラス**: PVector（add sub mult div mag magSq normalize limit setMag set copy）、JSONObject、JSONArray、PImage（loadPixels updatePixels get）、PGraphics、PFont、PSurface（setCursor setTitle 等）。java.lang/java.util は言語ランタイム（`src/runtime/lang/`、ARCHITECTURE.md）
- カテゴリ別の実装状況と未実装の一覧は [api-coverage.md](api-coverage.md)（`npm run coverage` で自動生成。リファレンスの関数 102/253 = 40%）。

## 解消済み（旧トランスパイラ）

旧トランスパイラ（`src/lib/transpiler/`）の問題 T2〜T19（コールド変換の遅さ、キャストの消失、整数除算、char、long リテラル、オーバーロード、コンストラクタ、静的モード、`#RRGGBB`、DOM 依存、エラーが 1 件だけでタブと行が合わない、テキストブロック）は、P1-9 で新コンパイラに切り替えて解消した。新コンパイラ側の残りは下の「既知の問題（コンパイラ）」。なお旧 T17（switch 式 `case X ->` とパターンの instanceof）は Processing 4.5.2 も構文エラーにすることを確認した（新コンパイラも拒否するので一致）。

## 既知のバグ（ランタイム / 描画）

| # | 問題 | 場所 | 検出テスト |
|---|---|---|---|
| R3 | rectMode/ellipseMode の RADIUS・CORNERS・CORNER の計算が誤り | `PGraphics.rect/ellipse` | rect_ellipse_modes |
| R4 | strokeCap/strokeJoin 未実装。既定が cap/join とも round（Processing は ROUND / MITER） | `PGraphicsContext.ts:33` | stroke_styles |
| R5 | `POINTS` が大きすぎる、`TRIANGLE_FAN` が誤り | `PGraphics.endShape` | shape_vertex |
| R6 | テキストを BitmapFont から生成したテクスチャで描くためぼやける。既定フォント・ベースライン・textAlign の縦方向・textLeading 等が非対応 | `PGraphics.text` | text_basic |
| R7 | `text()`/`image()` のたびに `app.render()` を呼ぶ（1 フレームに何度もレンダリング）。毎フレーム Graphics を作り直して再テッセレーション | `PGraphics.ts:270,299,444` | （性能） |
| R8 | `PImage.updatePixels()` は BMP にエンコード → `createImageBitmap`（非同期）で反映するため遅く、反映が次フレーム以降になる | `PImage.updatePixels` | pixels_basic |
| R9 | `loadImage()` は PImage を同期で返すが中身は非同期にデコードされる（直後の `img.width` が 0） | `PApplet.loadImage`, `PImage.load_from_blob` | — |
| R10 | `pixels[]` は Proxy 付きの通常の Array（遅い）。メインキャンバスの `loadPixels/updatePixels/get/set` 未実装 | `PImage.ts` | pixels_basic |
| R12 | `frameCount` が最初の draw() で 0（Processing は 1） | `DefaultRunner.step()` | — |
| R13 | ループが `setTimeout`。非フォーカス時は 1fps に落とす | `DefaultRunner.frame()` | — |
| R14 | `noise()` は改良 Perlin で Processing のアルゴリズムと別物（`noiseSeed`/`noiseDetail` は受け付けるだけ）。`random()`/`randomSeed()`/`randomGaussian()` は Processing と同じ列 | `PApplet.ts` | random_seed |
| R15 | `size()` を呼ばないスケッチは描画系が初期化されない（Processing は 100x100 で動く） | `PApplet.size`, `PGraphics.init` | — |
| R16 | `keyTyped` が文字の無いキー（矢印など）でも呼ばれる。`key`/`keyCode` は Processing の値に変換済み（文字コード、CODED、ENTER=10、DELETE=127） | `DefaultRunner` | — |
| R17 | 未実装の主な API: bezier/curve 系、strokeCap/Join、blendMode（空実装）、tint、filter、mask、copy/blend、get/set、PShape/loadShape、P2D/P3D 全般、PShader、IntList 等のリスト/辞書、Table、XML、saveFrame、cursor()、delay、thread など | — | bezier_curve, p3d_box, pshader_filter, pixels_basic |

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
| C7 | `Float.toString` の JDK 17 の再現が 4e25〜7.5e25 付近の一部の値で異なる（Java 17 で出力した 399,211 個の float のうち 73 個） | `runtime/lang/numbers.ts` |
| C8 | Integer/Long/Short/Byte のボックスは JS の number のまま: `Integer a = 1000, b = 1000; a == b` が true（Java はキャッシュ範囲外なので false）、整数の `getClass()` は常に `java.lang.Integer`、null の Integer をアンボクシングしても NullPointerException にならない（Character/Float/Double は `JChar`/`JFloat`/`JDouble` なので Java どおり） | `codegen.ts`（box/unbox） |
| C9 | Java モード: スケッチのクラスのコンストラクタは使えない（`unsupported` で報告）。スケッチ以外のトップレベルのクラスはスケッチの static メンバーとして扱うので、スケッチの static メンバーを単純名で参照できてしまう（Java ではエラー） | `sketch.ts` |
| C10 | Processing 4.5.2 は Java 9 以降の文脈キーワード（`module` `open` `opens` `requires` `exports` `to` `uses` `provides` `with` `transitive` `yield` `record` `sealed` `permits` `var`）を変数名・フィールド名に使えない（構文エラー。ローカル変数の `int to` は前処理が InternalError で落ちる）。新コンパイラは受理する | `grammar/processing.grammar` または `cst-to-ast.ts` |
| C11 | java.util の差: TreeMap/TreeSet の `headMap`/`subSet`/`descendingMap` などはビューではなくコピー、`Set.of`/`Map.of` は挿入順（Java は実行ごとにランダム）、Hashtable と ConcurrentHashMap は HashMap と同じ順、ストリーム（`stream()`）は使えない。モデルにあってランタイムに無いクラス（Scanner・Date・Calendar・BitSet・Optional・java.io の大半）は使った時点で UnsupportedOperationException | `runtime/lang/{collections,maps,util}.ts` |
| C12 | Lezer 文法は、開始の `"""` と同じ行に内容があるテキストブロック（`"""abc"""`）を拒否する。Processing 4.5.2 は受理して `"abc"` を返す（確認済み。旧 T18） | `grammar/processing.grammar`（textBlockStart） |

## 既知の問題（IO / PWA）

- `loadStrings/loadImage/loadJSON*` は **同期 XHR**（`XHRIO.ts:6`, `IOBase.ts:26`）。メインスレッドの同期 XHR は非推奨で、Service Worker 経由のキャッシュ/オフライン配信と相性が悪い。
- `data/` フォルダを自動で探さない（`loadImage("a.png")` は `base + "a.png"` を取りに行く）。同梱サンプル `background_image` はパスを書き換えて回避している。
- `sketch.properties` の `resources =` に列挙したファイルだけを fetch で事前読み込みするが、パスの一致判定が厳密（`./data/a.png` と `a.png` が一致しない）。
- `SketchManager.loadSketch()` に `SketchFile` オブジェクトを渡すと、URL 組み立てで `"[object Object]" + name` になり壊れる。
- `save*()` は localStorage（容量 5MB 程度、バイナリを文字列化）。

## 既知の問題（ビルド / リポジトリ）

- `dist/` と `library.js` がコミットされている（ビルド成果物）。`tsc` を実行すると `dist/types` が書き換わるので注意（型チェックは `npm run typecheck` を使う）。
- README の「Processing 4.4 までの構文をサポート」は実態より強い表現。

## バンドルサイズ（現状）

| 成果物 | min | gzip |
|---|---:|---:|
| `dist/index.js`（pixi は外部） | 711 KiB | 103 KiB |
| 上記 + pixi.js を同梱した場合 | 897 KiB | 229 KiB |
| うち antlr4 ランタイム + 生成パーサ | 342 KiB | 69 KiB |
| pixi.js 8.9.1（使用しているクラスのみ） | 490 KiB | 141 KiB |
