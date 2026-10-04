# 現状と既知の問題（2026-10-04 時点）

対象は commit 587ba38 + 視覚テスト CLI の追加（`SketchManager.step()` / `manual_step` のみランタイムに追加）。
数値の根拠は [research/2026-10-measurements/RESULTS.md](research/2026-10-measurements/RESULTS.md) と `npm run test:visual` の結果。

## サマリ

| 領域 | 状態 |
|---|---|
| 構文解析 | 実行パスは ANTLR4 + Processing 公式文法（Java 8 時代の古いコピー）。SLL 予測 + LL フォールバック（P0-1）。コールド時のコストが残る（T2）。新コンパイラ（`src/compiler/`、未接続）は Lezer 文法 + 型付き AST まで完成（P1-1/P1-2）: 同梱 examples 254 本を診断なしで AST 化、構文エラーはタブ・行・列つきで複数件 |
| 意味解析（型） | 実行パスは**なし**（型情報を使わずに文字列変換しているため Java の意味論がずれる）。新コンパイラ（未接続）は型検査まで完成（P1-4）: 本物の Processing の `cli --build` と 2,330/2,333 件一致、見逃し 0（`npm run test:check`） |
| コード生成 | 新コンパイラ（未接続）のコード生成と言語ランタイム（`src/runtime/lang/`）が完成（P1-5）: `lang` タグの 17 ケース中 16 件で println 出力が本物の Processing と完全一致（`npm run test:lang`、残り 1 件は Node のスタブに `random()` が無いため）。同梱 examples とリポジトリのスケッチ 309 本中 308 本が構文エラーの無い JS に変換され（1 本は `java.awt` を使うため拒否）、210 本は Node のスタブ上で 3 フレーム実行できる（残りはスタブに PVector・PImage などが無いため） |
| 静的モード | **未対応**（setup/draw の無いスケッチは変換時に例外） |
| 2D 描画 | 基本図形・変換・色・createGraphics は概ね動く。細部（既定値、モード、stroke の端/結合、テキスト）にずれ |
| P2D / P3D / PShader | **未実装** |
| 画像 / pixels | PImage の読み込みと表示は可。メインキャンバスの `loadPixels()/pixels[]` は未実装。`updatePixels()` に致命的なデバッグ出力 |
| ファイル IO | **同期 XHR**（Service Worker やオフラインと相性が悪い）。`data/` フォルダを自動で探さない |
| 同梱サンプル | 21 本すべてがエラーなく実行 |
| 互換性コーパス | Processing 同梱 examples 254 本中 **95 本（37%）** がエラーなく完走（JAVA2D 54% / P2D 14% / P3D 3%）。内訳と多いエラーは [tests/corpus/report.md](../tests/corpus/report.md) |
| 視覚テスト | 32 ケース: 5 PASS / 27 XFAIL（[TESTING.md](TESTING.md)）。XFAIL のうち 17 件は新コンパイラでは通る言語仕様のケース |
| 単体テスト | Vitest（`npm test`、`tests/unit/`）。CI と lint はなし。型検査は `npm run test:check`、生成コードの実行結果は `npm run test:lang`（どちらも本物の Processing と比較） |

## 実装済み API（ランタイム）

- **PApplet（約 105）**: settings setup draw size fullScreen / background colorMode fill noFill stroke noStroke strokeWeight / rectMode ellipseMode imageMode / point line rect quad ellipse circle arc triangle beginShape vertex endShape / text textAlign textSize textWidth textFont createFont / image loadImage createImage createGraphics / translate rotate scale push pop pushMatrix popMatrix pushStyle popStyle resetMatrix / color red green blue alpha lerpColor / abs ceil floor min max sqrt pow exp sin cos tan asin acos atan atan2 radians degrees constrain map norm dist lerp random noise / int float str split join trim match matchAll nf nfc nfp nfs / year month day hour minute second millis / println / loadStrings saveStrings loadJSONObject saveJSONObject loadJSONArray saveJSONArray / loop noLoop exit getSurface
- **変数**: width height mouseX mouseY pmouseX pmouseY mousePressed mouseButton key keyCode keyPressed frameCount frameRate
- **クラス**: PVector（add sub mult div mag magSq normalize limit setMag set copy）、ArrayList（Array 継承）、HashMap、JSONObject、JSONArray、PImage（loadPixels updatePixels get）、PGraphics、PFont、PSurface（setCursor setTitle 等）、Runnable/Consumer/Supplier/Function
- カテゴリ別の実装状況と未実装の一覧は [api-coverage.md](api-coverage.md)（`npm run coverage` で自動生成。リファレンスの関数 102/253 = 40%）。

## 既知のバグ（トランスパイラ）

| # | 問題 | 場所 | 検出テスト |
|---|---|---|---|
| T2 | コールド時の変換コスト: ブラウザの新規ページで 20〜50 行のスケッチでも変換全体 30〜40ms（うち構文解析 13〜23ms）、199 行で約 180ms。ANTLR の予測キャッシュ構築と JIT のウォームアップ、変換時の `new PApplet()` が主因。P1 の新コンパイラで解消する | ANTLR ランタイム | report.md の transpile ms (parse) |
| T3 | キャストを捨てる（`(int)3.99` → `3.99`） | `ReferenceSolver.ts` visitExpression（`typeType()!=null`） | java_semantics |
| T4 | 整数除算・int のオーバーフロー・`long` を再現しない（`7/2` → 3.5） | 型情報が無い | java_semantics |
| T5 | `char` を文字列として扱う（`'a'+1` → `"a1"`） | 同上 | java_semantics |
| T6 | `long` リテラルの `L` 接尾辞がそのまま出力され SyntaxError | ReferenceSolver（リテラル） | java_semantics |
| T7 | オーバーロード分岐の条件と引数束縛を `map()` の結果のまま埋め込むため `,&&` `,const` になり SyntaxError | `Converter.ts:73`, `Converter.ts:93` | multi_tab |
| T8 | オーバーロードしたメソッドの本体で引数名が束縛されない（`(...args)` のみ）、int と float を区別できない | `Converter.ts` getSafeMethod | multi_tab |
| T9 | コンストラクタでフィールド初期化を `super()` より前に出力。`this(...)` の委譲がそのまま出力される | `ReferenceSolver.ts`（constructor の base）, Converter | multi_tab |
| T10 | 継承マージで `name in array`（添字判定）を使っており重複判定が機能しない | `MemberAnalyzer.ts:156,161,174,177` | — |
| T11 | 静的モード未対応（`class_data.get(main)` が undefined で例外） | `MemberAnalyzer.ts`（`visitActiveProcessingSketch` しか無い） | static_mode |
| T12 | `#RRGGBB` → `0xRRGGBB`（Processing は `0xFFRRGGBB`）。アルファ 0 になる | `ReferenceSolver.ts:182`, `Transpiler.ts:70` | hex_colors |
| T13 | 識別子解決のため変換時に `new PApplet(null)` を生成（Pixi の Application/Graphics/BitmapFont を作る）→ トランスパイラが DOM と描画ライブラリに依存し、Node / Worker で動かない | `Control.ts:19` | — |
| T14 | 非同期化は `size/fullScreen` 等の `AsyncFunction` を正規表現で `await` するだけ。ユーザー関数経由の呼び出しは考慮されない | `Converter.ts` | — |
| T15 | エラーは最後の 1 件のみ。全タブを `\n` で連結して解析するため行番号がタブと対応しない。意味エラー（未定義変数・型不一致）は検出しない。新コンパイラでは構文エラー（タブ単位の位置・複数件）は解決済み（P1-2）。意味エラーは P1-4、切り替えは P1-9 | `Control.ts`, `SketchManager.transpileSketch` | — |
| T17 | 文法がスイッチ式・パターン instanceof を受理しない（本家 4.5.2 の受理範囲は要確認。`var` は 4.5.2 で使えることを確認済み） | `Processing.g4` | — |
| T18 | 新コンパイラの Lezer 文法は、開始の `"""` と同じ行に内容があるテキストブロック（`"""abc"""`）を拒否する。Processing 4.5.2 は受理して `"abc"` を返す（確認済み） | `src/compiler/grammar/processing.grammar`（textBlockStart） | — |
| T19 | テキストブロックと `var` を変換できない（SyntaxError）。なお Processing 4.5.2 のテキストブロックは Java と違い、先頭の改行と各行の字下げをそのまま残す（新コンパイラの `literals.ts` は対応済み） | 旧トランスパイラ | literals_processing |

## 既知のバグ（ランタイム / 描画）

| # | 問題 | 場所 | 検出テスト |
|---|---|---|---|
| R1 | 既定の背景（204）が適用されず透明のまま。既定の stroke も描かれない | `PGraphics.init()` | default_style |
| R2 | `color()` の int が ABGR 配置で、`red()`/`blue()` が逆。Processing の ARGB と互換が無い | `PApplet.color/red/green/blue`, `PGraphics.convert_color` | hex_colors |
| R3 | rectMode/ellipseMode の RADIUS・CORNERS・CORNER の計算が誤り | `PGraphics.rect/ellipse` | rect_ellipse_modes |
| R4 | strokeCap/strokeJoin 未実装。既定が cap/join とも round（Processing は ROUND / MITER） | `PGraphicsContext.ts:33` | stroke_styles |
| R5 | `POINTS` が大きすぎる、`TRIANGLE_FAN` が誤り | `PGraphics.endShape` | shape_vertex |
| R6 | テキストを BitmapFont から生成したテクスチャで描くためぼやける。既定フォント・ベースライン・textAlign の縦方向・textLeading 等が非対応 | `PGraphics.text` | text_basic |
| R7 | `text()`/`image()` のたびに `app.render()` を呼ぶ（1 フレームに何度もレンダリング）。毎フレーム Graphics を作り直して再テッセレーション | `PGraphics.ts:270,299,444` | （性能） |
| R8 | `PImage.updatePixels()` は BMP にエンコード → `createImageBitmap`（非同期）で反映するため遅く、反映が次フレーム以降になる | `PImage.updatePixels` | pixels_basic |
| R9 | `loadImage()` は PImage を同期で返すが中身は非同期にデコードされる（直後の `img.width` が 0） | `PApplet.loadImage`, `PImage.load_from_blob` | — |
| R10 | `pixels[]` は Proxy 付きの通常の Array（遅い）。メインキャンバスの `loadPixels/updatePixels/get/set` 未実装 | `PImage.ts` | pixels_basic |
| R11 | `int()` が `Math.floor`（Java は 0 方向への切り捨て: `int(-2.5)` = -2） | `PApplet.ts:523` | java_semantics |
| R12 | `frameCount` が最初の draw() で 0（Processing は 1） | `DefaultRunner.step()` | — |
| R13 | ループが `setTimeout`。非フォーカス時は 1fps に落とす | `DefaultRunner.frame()` | — |
| R14 | `random()` が `Math.random`、`randomSeed/noiseSeed/noiseDetail/randomGaussian` が無い。`noise()` は改良 Perlin で Processing のアルゴリズムと別物 | `PApplet.ts` | random_seed |
| R15 | `size()` を呼ばないスケッチは描画系が初期化されない（Processing は 100x100 で動く） | `PApplet.size`, `PGraphics.init` | — |
| R16 | キー入力が DOM の `keyCode`/`key` をそのまま使う（`key == CODED` や `UP`/`DOWN` 判定が Processing と異なる）。`keyTyped` の発火条件が違う | `DefaultRunner` | — |
| R17 | 未実装の主な API: bezier/curve 系、strokeCap/Join、blendMode（空実装）、tint、filter、mask、copy/blend、get/set、PShape/loadShape、P2D/P3D 全般、PShader、IntList 等のリスト/辞書、Table、XML、saveFrame、cursor()、delay、thread など | — | bezier_curve, p3d_box, pshader_filter, pixels_basic |

## 既知の問題（新コンパイラ `src/compiler/`、未接続）

型検査の基準は本物の Processing（`npm run test:check`）、生成コードの実行結果の基準も本物の Processing の出力（`npm run test:lang`）。以下は分かっている差。

| # | 問題 | 場所 |
|---|---|---|
| C1 | ジェネリックメソッドの型引数を実引数・代入先から推論するのは単純な単一化だけ。実引数の位置にある `Collections.emptyList()` などは Object になり、`List<String>` の引数に渡すと誤ってエラーになる | `check.ts`（instantiate / unify） |
| C2 | final 変数への 2 回目の代入（definite unassignment）と blank final フィールドの初期化漏れを検出しない | `definite.ts` |
| C3 | キャプチャ変換をしない（ワイルドカードは境界として読む）。`List<? super T>` への書き込みなど一部で Java より緩い | `typesystem.ts` |
| C4 | 構文解析が遅め: 5k 行のウォームで Lezer の解析だけで約 23ms（コード生成まで含めて 54ms）。P1-9 の目標（変換全体 50ms）に向けて文法の曖昧さを減らす必要がある | `grammar/processing.grammar` |
| C5 | `java.awt` など JDK のモデル外のクラスは使えない（`unsupported` で報告。同梱 examples では Yellowtail の `java.awt.Polygon` のみ） | `tools/manifest/ManifestGen.java`（LIBRARY_ROOTS） |
| C6 | long は JS の number（double）で表すため、絶対値が 2^53 を超える値の演算と表示が不正確（`9007199254740993L` → `9007199254740992`）。`Long.MAX_VALUE`/`MIN_VALUE` の表示と飽和キャストは正しい | `runtime/lang/numbers.ts`, `codegen.ts` |
| C7 | `Float.toString` の JDK 17 の再現が 4e25〜7.5e25 付近の一部の値で異なる（Java 17 で出力した 399,211 個の float のうち 73 個） | `runtime/lang/numbers.ts` |
| C8 | Integer/Long/Short/Byte のボックスは JS の number のまま: `Integer a = 1000, b = 1000; a == b` が true（Java はキャッシュ範囲外なので false）、整数の `getClass()` は常に `java.lang.Integer`、null の Integer をアンボクシングしても NullPointerException にならない（Character/Float/Double は `JChar`/`JFloat`/`JDouble` なので Java どおり） | `codegen.ts`（box/unbox） |
| C9 | Java モード: スケッチのクラスのコンストラクタは使えない（`unsupported` で報告）。スケッチ以外のトップレベルのクラスはスケッチの static メンバーとして扱うので、スケッチの static メンバーを単純名で参照できてしまう（Java ではエラー） | `sketch.ts` |

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
