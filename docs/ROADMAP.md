# 実装ロードマップ

2026-10-04 作成。方針の根拠は [EVALUATION.md](EVALUATION.md)、現状の問題は [STATUS.md](STATUS.md)（T*/R* は STATUS.md の問題 ID）。

## 進め方

- 上から順に、**未完了の最初のタスク**に取り組む。タスクを終えたらチェックを付け、STATUS.md の該当行を更新する。
- 各タスクの「完了条件」はコマンドで確認できる形にしてある。Claude は自分で実行して確認する（視覚の確認は `tests/visual/out/<case>/composite.png` を Read で開く）。
- 描画・言語仕様の作業は **テスト先行**（ケース追加 → 参照生成 → XFAIL を確認 → 実装 → XPASS → `expect` 削除）。
- 規模の目安: S = 1 セッション以内、M = 1〜3 セッション、L = それ以上（サブタスクに分けて進める）。
- フェーズ間の依存: P0 → P1（コンパイラ）と P2-1（描画の抽象化）→ P2 の残りと P3 は並行可能 → P4 以降。
- 優先度（ユーザー方針）: 変換・実行の速さ ＞ P2D/P3D・PShader ＞ その他の API ＞ ライブラリ。

### 全タスク共通の完了条件

1. `npm run typecheck` が通る。
2. `npm run test:visual` が終了コード 0（FAIL・NO-REF なし）。新しく通るようになったケースは `expect` を外してある。
3. 追加/変更した振る舞いを確かめるテスト（視覚ケース・stdout ケース・単体テスト）がある。
4. STATUS.md / ROADMAP.md / 必要なら ARCHITECTURE.md が更新されている。

---

## P0: 基盤整備とすぐ効く改善

- [ ] **P0-1 構文解析の SLL 化**（S, T1）
  `Control.ts` で `PredictionMode.SLL` + `BailErrorStrategy` で解析し、失敗したら LL（既定のエラー戦略）で再解析する。
  完了条件: 視覚テストに回帰なし。docs/research/2026-10-measurements の 5k 行入力で、ウォーム解析が 100ms 未満（P0-4 の bench で計測）。
- [x] **P0-2 デバッグ出力の除去**（S, T16, R8）
  `PImage.updatePixels` の `console.log(btoa(...))`、`Transpiler.visitLastFormalParameter` / `ReferenceSolver.isMemberMethod` の console.log、`Control.ts` の計測ログ（オプション化）。
  完了条件: `npm run vt -- shot public/samples/Image/create_image` がエラーなしで完走。
- [x] **P0-3 リポジトリの整理**（S）
  未使用依存（`p5`, `@types/p5`）と自己参照 `"processing-ts": "file:"` の削除。旧実装（`runtime/renderer/`, `runtime/worker/`, `runner/AsyncRunner.ts`, `runtime/intex.ts`, `index.ts` のコメントアウト）の削除。`vite.config.ts` のサンプル一覧生成をパス区切りに依存しない実装にし、無関係な watcher パスを削除。
  完了条件: `npm run build` を一時ディレクトリへ出力して成功（`vite build --outDir <tmp>`。コミット済みの dist は変えない）、デモ（`npm run dev`）のサンプル一覧が従来どおり。
- [ ] **P0-4 性能・サイズ計測 CLI**（M）
  `tools/bench/`: (a) 変換時間（同梱サンプル + 合成 5k 行、コールド/ウォーム。ブラウザは vt のハーネスを流用）、(b) バンドルサイズ（エントリごとの min/gzip）を計測し、`docs/research` の基準値と予算（EVALUATION.md §8）と比較して表で出す。`npm run bench` / `npm run size`。
  完了条件: 両コマンドが表を出力し、予算超過時に終了コード 1。
- [ ] **P0-5 互換性コーパス・ランナー**（M）
  `npm run vt -- corpus [--filter Basics]`: Processing 同梱 examples（254 本。リポジトリにはコピーせずローカルのパスを参照）を変換 → 数フレーム実行し、「変換失敗 / 実行時エラー / 完走」を集計。決定的なスケッチは参照画像（キャッシュは gitignore）とも比較。結果を `tests/corpus/report.md` に出す（レポートはコミットして進捗を追う）。
  完了条件: 全 254 本の集計が出る。現状の数値を STATUS.md に記録。
- [ ] **P0-6 単体テスト基盤**（S）
  Vitest を導入（`npm test`）。最初はトランスパイラの小さなテスト数件。
- [ ] **P0-7 ライセンスの判断**
  - [x] (a) GPL の `Processing.g4`/`JavaParser.g4` 由来の生成パーサ → 推奨構成の採用により P1 で Lezer（MIT）+ 自作拡張に置き換える。置き換えまでは現状のまま。ANTLR 版は開発時専用のオラクルとしてのみ残す。
  - [ ] (b) 既定フォント `ProcessingSansPro-Regular.ttf` を同梱するか（P2-6 までに **ユーザー確認が必要**）。
  - [x] (c) Processing core / p5.js（LGPL）のコードはコピー・移植しない（CLAUDE.md の作業ルール 6）。
- [ ] **P0-8 CI**（S、任意）
  GitHub Actions で `npm ci` → `npx playwright-core install chromium` → `npm run typecheck` → `npm run test:visual`（参照はコミット済みなので Processing は不要）。

## P1: 新コンパイラ（速さと Java 意味論）

`src/compiler/` に新規作成し、完成まで旧トランスパイラと併存させる。DOM に依存しないこと（Node で単体テストできること）。

- [ ] **P1-1 Lezer による Processing 文法のスパイク**（M）— **判断ゲート**
  @lezer/java（MIT）をフォークし、トップレベルのメソッド/フィールド/文、`#RRGGBB`、`color` 型、`int(` `float(` 等の変換関数、default メソッド、テキストブロックを追加（`src/compiler/grammar/processing.grammar`、@lezer/generator でビルド）。
  検証: 公式文法の ANTLR パーサ（開発時専用オラクル）と、同梱 examples 254 本 + テストケース + 構文エラーを含む入力群で受理/拒否を比較するスクリプト。
  完了条件: 受理/拒否の一致率 99% 以上、199 行のコールド解析 15ms 以下（Node）。満たせない場合は **手書き再帰下降パーサに切り替える**ことを ROADMAP に記録して P1-1b として実施。
- [ ] **P1-2 AST と CST→AST 変換**（M）
  型付き AST（ノードごとにタブ・行・列）。複数タブはタブ単位で解析して位置を保持（T15）。
- [ ] **P1-3 Processing API マニフェスト**（M）
  `tools/manifest/`: Processing 同梱 JDK（`C:/Program Files/Processing/app/resources/jdk`）で core jar をリフレクションし、PApplet/PGraphics/PImage/PVector/PShape/PShader/PFont/PMatrix*/IntList…/Table/XML/JSON* の public メソッド・フィールド・定数を JSON 化（`src/compiler/api/processing-core.json`、コミットする）。
  完了条件: PApplet のメソッド 316 名・716 オーバーロードが含まれる。ランタイムの実装状況との差分を出すスクリプト（カバレッジ表を STATUS.md に自動反映できる形）。
- [ ] **P1-4 シンボル表と型検査**（L）
  スケッチクラス/内部クラス/static ネスト/インタフェース/enum/ジェネリクス（消去）/配列、数値昇格、文字列連結、オーバーロード解決（完全一致 → 拡大 → ボクシング → 可変長）。未定義・型不一致などの意味エラーを複数件、位置つきで返す。
- [ ] **P1-5 コード生成**（L）
  EVALUATION.md §3 の表（整数演算、飽和キャスト、複合代入、char、float の表示、型付き配列、String、typed catch、予約語回避、オーバーロードの名前修飾）。Source Map v3。ランタイムヘルパは `src/runtime/lang/`。
- [ ] **P1-6 モードとプリプロセッサ相当の処理**（M）
  静的/アクティブ/Java クラスの判定（T11）、小数リテラルの float 扱い、`#hex`、`settings()` への移動、静的モードの `noLoop()`。
- [ ] **P1-7 Java 標準ライブラリの互換層**（M）
  ArrayList, HashMap, HashSet, LinkedList, Collections, Arrays, StringBuilder, Integer/Float/Double/Boolean の parse/valueOf, Math, Iterator, Map.Entry, Character, String のメソッド。
- [ ] **P1-8 stdout 適合テストの拡充と高速ランナー**（M）
  `lang` タグのケースを追加（文字列、配列、クラスと継承、例外、switch、ジェネリクス、ラムダ、static、内部クラス、整数/浮動小数の境界値）。描画不要のケースは Node で実行する `npm run test:lang`（参照の stdout は vt の `ref` で生成したものを共用）。
- [ ] **P1-9 切り替え**（M）
  `SketchManager` を新コンパイラに切り替え、旧 `transpiler/`・antlr4 依存・生成パーサを配布物から削除（オラクルとしては devDependency に残す）。
  完了条件: java_semantics / multi_tab / static_mode が PASS。コーパスの変換成功率 95% 以上。199 行のコールド変換 20ms 以下（ブラウザ）。5k 行ウォーム 50ms 以下。

## P2: ランタイムの再構築と Canvas2D（JAVA2D）

- [ ] **P2-1 描画の抽象化**（M）— P3 の前提
  Processing の PGraphics のメソッド集合（P1-3 のマニフェスト）に沿った抽象クラスと、レンダラ非依存の状態（スタイルスタック、行列スタック、色モード）。`PGraphicsCanvas2D` を最初の実装にする。
- [ ] **P2-2 色**（S, R2）ARGB の int、`colorMode`（RGB/HSB と最大値）、`fill(int)` の灰色/ARGB 判定、`hue/saturation/brightness`、`lerpColor`、`hex()`。
- [ ] **P2-3 図形と既定値**（M, R1, R3, R4, R5, R15）既定の背景 204・白塗り・黒線 1px、各モード、arc の OPEN/CHORD/PIE、strokeCap/Join、beginShape の全種別、beginContour、bezier/curve 系と detail/tightness、`square`、size() 無しのスケッチ。
- [ ] **P2-4 変換**（S）PMatrix2D、applyMatrix、shearX/Y、printMatrix、push/pop のスタイルと行列。
- [ ] **P2-5 画像**（L, R8〜R10）Int32Array の pixels と CPU/キャンバス間の遅延同期、get/set/copy/blend/mask/filter/tint/resize、メインキャンバスの loadPixels/updatePixels、createGraphics（OffscreenCanvas）、save/saveFrame。
- [ ] **P2-6 テキスト**（M, R6）createFont/loadFont(.vlw)/textFont/textSize/textAlign（縦方向も）/textLeading/textWidth/textAscent/textDescent/矩形内の折り返し、既定フォント（P0-7 の判断に従う）。
- [ ] **P2-7 乱数とノイズ**（S, R14）`java.util.Random` 互換、randomGaussian、Processing の noise と noiseDetail/noiseSeed。完了条件: random_seed が PASS（stdout の値まで一致）。
- [ ] **P2-8 ループとイベント**（M, R12, R13, R16）requestAnimationFrame ベースで frameRate を守る、frameCount の意味、redraw()、mouseDragged/mouseClicked/keyTyped の発火条件、key/keyCode/CODED、mouseWheel の MouseEvent、focused、cursor/noCursor。イベントの再現テストは vt ハーネスに「入力スクリプト」（フレーム番号ごとのマウス/キー操作）を追加して行う。
- [ ] **P2-9 VFS と fetch 事前読み込み（PWA 対応）**（M）`data/` の解決、マニフェスト/リテラル抽出による事前読み込み、画像の事前デコード、IndexedDB への保存、selectInput/selectOutput、未読み込みパスのエラーメッセージ。同期 XHR を削除。
  完了条件: Service Worker でキャッシュしたページをオフラインにしても data/ を使うケースが動く（vt ハーネスに `--offline` モードを追加して確認）。
- [ ] **P2-10 PixiJS の削除と予算確認**（S）完了条件: `npm run size` でランタイム（2D、パーサなし）が 50 KiB gz 以下。2d タグのケースがすべて PASS。コーパスの 2D 決定的スケッチの視覚一致率 90% 以上。

## P3: WebGL2（P2D / P3D / PShader）

- [ ] **P3-1 GL の基盤**（M）コンテキスト、バッファ、シェーダープログラムのキャッシュ、FBO、テクスチャ管理。PMatrix3D、camera/perspective/ortho/frustum、modelview/projection スタック、`screenX/modelX` 等。
- [ ] **P3-2 テッセレーション**（L）libtess による塗り（穴・巻き方向）、LINE シェーダー（`direction`）による線、POINT シェーダー（`offset`）による点、フレーム単位のバッチ。
- [ ] **P3-3 既定シェーダーとライト**（L）COLOR/LIGHT/TEXTURE/TEXLIGHT、最大 8 灯（ambient/directional/point/spot、falloff、specular）、マテリアル、normal、texture/textureMode/textureWrap。
- [ ] **P3-4 3D 図形**（M）box、sphere、sphereDetail、3D の beginShape（法線・UV）。完了条件: p3d_box が PASS。
- [ ] **P3-5 PShader**（L）loadShader、shader()/resetShader()、`set()` の全オーバーロード、種別判定、GLSL → GLSL ES 3.00 変換、`filter(PShader)`、`ppixels`。.glsl の行番号付きエラー。完了条件: pshader_filter が PASS。同梱 examples のシェーダー 18 本が実行時エラーなし。
- [ ] **P3-6 PShape（保持型）**（M）createShape/GROUP/子要素、GPU バッファ保持、loadShape（OBJ/SVG）。
- [ ] **P3-7 その他**（M）createGraphics(P2D/P3D)、hint()、GL での blendMode、smooth（MSAA）、グリフアトラスによる text。
- [ ] **P3-8 遅延読み込み**（S）P2D/P3D を使うときだけ `processing-ts/webgl` を動的 import。
  完了条件（フェーズ全体）: 3d / shader タグのケースが PASS（SwiftShader、許容差あり）。コーパスの P2D/P3D/シェーダー examples の実行時エラーなし 90% 以上、視覚一致 70% 以上。性能ベンチ（`tests/perf/`、1 万頂点/フレーム）が SwiftShader で計測でき、GPU（`--gpu`）で 60fps。

## P4: 配布と性能

- [ ] **P4-1 AOT**: CLI `processing-ts build <sketchDir>`（JS + data マニフェスト + 任意で Service Worker 雛形）と Vite プラグイン（`import sketch from "./MySketch/?pde"`）。
- [ ] **P4-2 サブパス export とコード分割**（compiler / runtime / webgl / vite）。`library.js`（単一ファイル版）の生成方法を新構成に合わせて更新。
- [ ] **P4-3 変換結果のキャッシュ**（エディタ向け、ソースのハッシュ → IndexedDB）。
- [ ] **P4-4 Worker 実行モード**（OffscreenCanvas、停止ボタンで terminate、入力の転送）。
- [ ] **P4-5 サイズ予算と性能の回帰チェックを CI に追加**。

## P5: API の完全化

IntList/FloatList/StringList、IntDict/FloatDict/StringDict（＋ Double/Long 系）、Table/TableRow、XML、parseJSON*/parseXML、createReader/createWriter/BufferedReader/PrintWriter、loadBytes/saveBytes、配列関数（append/concat/expand/reverse/shorten/sort/splice/subset/arrayCopy）、splitTokens、binary/unbinary/unhex、print/printArray、thread、delay、requestImage、launch、selectFolder、window* 系。マニフェストとの差分表で残りをゼロに近づける。

## P6: エディタと開発体験

CodeMirror 6 + Lezer Processing 文法のデモエディタ（ハイライト、折りたたみ、逐次エラー表示、実行時エラーの .pde 位置表示）、Worker 実行モードの停止ボタン、ドキュメントサイト、README の更新（対応範囲を正確に）。

## P7: ライブラリ

`import processing.sound.*;` 等をランタイムのモジュールに対応付ける仕組み → Sound / Minim（Web Audio）、Video（getUserMedia / video 要素）、PeasyCam、Serial（Web Serial）、ControlP5（要検討）。

---

## テストツールの拡張計画（Claude が自律的に検証するための道具）

| 時期 | ツール | 内容 |
|---|---|---|
| 済 | `tools/vt run/ref/shot/list` | Processing の参照画像・stdout と比較（[TESTING.md](TESTING.md)） |
| P0-4 | `npm run bench` / `npm run size` | 変換時間・バンドルサイズの計測と予算チェック |
| P0-5 | `npm run vt -- corpus` | 同梱 examples 254 本の互換性集計 |
| P0-6 | `npm test`（Vitest） | コンパイラの単体テスト |
| P1-8 | `npm run test:lang` | 描画しない stdout 適合テストを Node で高速実行 |
| P2-8 | vt の入力スクリプト | フレームごとのマウス/キー操作を Processing 側（`java.awt.Robot` ではなくイベント関数の直接呼び出しを注入）と processing-ts 側の両方で再生して比較 |
| P2-9 | vt `--offline` | Service Worker + オフラインでの data/ 読み込み確認 |
| P3 | `tests/perf/` + vt `bench` | フレーム時間の計測（SwiftShader / GPU） |
