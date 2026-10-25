# テスト

| 種類 | コマンド | 対象 |
|---|---|---|
| 単体テスト | `npm test`（Vitest, `tests/unit/*.test.ts`） | Node で動く純粋なロジック（新コンパイラ `src/compiler/` のリテラル・AST・構文エラー、旧構文解析 `SketchParser`、PVector など、tools/vt の補助関数）。ランタイム（`new PApplet()`）は DOM/Canvas に依存するため対象外（視覚テストで確認） |
| 視覚 / 出力回帰テスト | `npm run test:visual` | 本物の Processing との画像・println 比較（以下） |
| 型チェック | `npm run typecheck` | src/lib・src/compiler・src/runtime・tools・tests |
| 文法の適合性 | `npm run test:grammar` | 新しい Lezer 文法、および新コンパイラのフロントエンド（構文解析 + AST 構築、`parseSketch`）と公式文法（ANTLR）の受理/拒否の一致を、同梱 examples・リポジトリのスケッチ・構文エラー変種（`;` `)` `}` を 1 つ消したもの）で比較。変種では構文エラーメッセージの質（消した記号を名指しするか、位置が合っているか）も集計する（結果: `tests/grammar/out/report.md`） |
| 型検査の適合性 | `npm run test:check` | 新コンパイラの型検査（`analyzeSketch`）の受理/拒否・最初のエラーの行・メッセージを、本物の Processing の `cli --build`（前処理 + ECJ）と比較。入力は同梱 examples・リポジトリのスケッチと、AST を使って機械的に作る意味エラーの変種（`tools/check/mutations.ts`）。Processing の結果は `node_modules/.cache/processing-ts-check` にキャッシュ（初回は約 40 分、以後は数秒）。誤検出・見逃しがあると終了コード 1（結果: `tests/check/out/report.md`） |
| 言語仕様の適合性 | `npm run test:lang` | 新コンパイラ（`compileSketch`）が生成したコードを Node で実行し、`lang` タグのケースの `println` 出力を本物の Processing の参照 stdout と行単位で比較（後述「stdout 適合テスト」）。約 1 秒 |
| 性能 / サイズ | `npm run bench` / `npm run size` | 変換時間・バンドルサイズ（後述「性能・サイズ計測」） |
| 事前変換・配布の E2E | `npm run test:aot` | `processing-ts build` の出力・Vite プラグイン・ビルドしたパッケージを入れたアプリ・Worker 実行を、本物の Processing の参照と比較（後述「事前変換・配布の E2E」） |
| CI | `.github/workflows/ci.yml` | push / pull request ごとに上のうち Processing の要らないもの（型・単体・lang・視覚 3 種・test:aot・size・bench）。Windows のランナー（後述「CI」） |

# 視覚 / 出力回帰テスト

本物の Processing（Java）の出力を正解として、processing-ts の出力（ヘッドレス Chromium）と自動比較する。
画像だけでなく `println()` の出力も比較するので、Java の言語仕様（整数除算・キャスト・char 演算・float の文字列化など）の検証にも使える。
**すべてコマンドラインで完結し、結果は PNG とテキストで出る**ので、Claude が自律的に実行・確認できる。

## 前提

| 必要なもの | 用途 | 備考 |
|---|---|---|
| Node.js >= 22.18 | `tools/vt/*.ts` を型除去でそのまま実行 | `node tools/vt/cli.ts ...` |
| `npm install` 済み | playwright-core / pixelmatch / pngjs / vite | |
| Playwright の Chromium | processing-ts の実行 | playwright-core 1.63 は chromium-1243。無ければ `npx playwright-core install chromium` |
| Processing 4.x（任意） | 参照画像の生成（`ref`） | 既定パス `C:/Program Files/Processing/Processing.exe`、または `--processing <path>` / 環境変数 `PROCESSING_PATH`。参照はコミット済みなので `run` だけなら不要 |

## コマンド

```sh
npm run test:visual                 # 全ケースを実行して参照と比較（= node tools/vt/cli.ts run）
npm run test:visual -- shapes hex   # 名前（前方一致）で絞り込み
npm run test:visual -- --tag 2d     # タグで絞り込み
npm run test:visual:ref             # 参照画像を Processing で作り直す（= node tools/vt/cli.ts ref）
npm run test:visual:ref -- --missing  # 参照が無い / ソースが変わったケースだけ作り直す
npm run vt -- shot public/samples/Transform/arm --frames 30 --ref   # 任意のスケッチを撮影（--ref で Processing と比較）
npm run vt -- list                  # ケース一覧（参照の有無・期待結果・既知の問題）
node tools/vt/zoom.ts <case> <x> <y> <w> <h> [倍率]   # 参照と processing-ts の同じ領域を拡大して並べる（tests/visual/out/<case>/zoom.png）
```

`run` のその他のオプション: `--exec worker|aot`（後述「実行のしかた」）、`--offline`（後述）、`--update`（先に参照を再生成）、`--frames n`（フレーム数を上書き）、`--headed`（ブラウザを表示）、`--gpu`（SwiftShader ではなく GPU を使う）、`--json`（結果を JSON で標準出力）、`--out <dir>`。

所要時間の目安（このリポジトリの開発機）: `run` 全 20 ケースで約 10 秒、`ref` 全ケースで約 50 秒（JAVA2D 約 2 秒/件、P2D/P3D 約 5 秒/件）。

## 出力の見方

`tests/visual/out/`（gitignore 済み）:

- `report.md` … 一覧表と、PASS 以外のケースの詳細（エラー、stdout の最初の差分、合成画像へのリンク）
- `report.json` … 機械可読な結果
- `<case>/composite.png` … **左: Processing（青の帯）／中: processing-ts（緑の帯）／右: 差分（赤の帯）**。まずこれを見る
- `<case>/actual.png`, `<case>/diff.png`, `<case>/transpiled.js`（変換後の JS）

差分画像は pixelmatch の出力で、赤が不一致ピクセル、黄色がアンチエイリアスとみなして無視したピクセル。

判定結果:

| 結果 | 意味 | 終了コード |
|---|---|---|
| PASS | 画像の不一致率が `maxDiffRatio` 以下、かつ stdout が一致 | 0 |
| FAIL | 期待は合格なのに不一致（回帰） | **1** |
| XFAIL | `expect: "fail"`（既知の未対応）で不一致 | 0 |
| XPASS | `expect: "fail"` なのに一致した → 直ったので `vt.json` から `expect`/`knownIssue` を消す | 0（メッセージを表示） |
| NO-REF | 参照画像が無い → `npm run test:visual:ref -- <case>` | **1** |

参照が古い（ケースのソースが参照生成時から変わった）場合は理由欄に `reference is stale` と出る。

## ケースの追加

```
tests/visual/cases/<name>/
  <name>.pde        メインタブ（フォルダ名と同名。Processing の規約）
  Other.pde         追加タブ（任意。メインの後にアルファベット順で連結）
  data/             loadImage("x.png") などが読むファイル（任意。.pde 以外のファイルは参照生成時にそのままコピーされる）
  vt.json           設定（任意）
tests/visual/refs/<name>.png / .stdout.txt / .meta.json   ← `ref` が生成。コミットする
```

`vt.json`:

```jsonc
{
  "frames": 1,            // キャプチャ前に draw() を呼ぶ回数（静的モードは無視）。既定 1
  "threshold": 0.1,       // pixelmatch のピクセル単位の色しきい値（0〜1）
  "maxDiffRatio": 0.01,   // 許容する不一致ピクセルの割合
  "expect": "fail",       // 既知の未対応。直ったら削除
  "knownIssue": "…",      // 失敗の理由（expect とセットで書き、直ったら一緒に消す）
  "stdout": true,         // println 出力を比較するか（既定 true）
  "offline": true,        // processing-ts をオフラインで実行（後述。任意）
  "mode": "static",       // Processing のモード判定を上書き（通常は自動判定）
  "input": [             // マウス/キー操作（任意。下の「入力スクリプト」）
    { "frame": 2, "type": "click", "x": 100, "y": 50, "button": "left" }
  ],
  "tags": ["2d"],         // 2d / 3d / shader / text / color / image / lang / events など
  "note": "…"
}
```

ケース作成のルール:

- **決定的にする**: `random()` は `randomSeed()` 付きで（現状は一致しない＝それ自体がテスト対象）、`millis()`/`second()`/マウス入力に依存しない。
- **サイズは幅 320 以上**（Windows ではウィンドウの最小幅のため、P2D/P3D の小さいウィンドウが勝手に広げられる。例: 200x150 → 232x150）。
- 1 ケース 1 テーマ。失敗したとき原因が絞れる大きさにする。
- テキストはフォントのラスタライズ差が大きいので `threshold`/`maxDiffRatio` を緩めるか、図形のケースと分ける。
- 新しい機能を実装するときは **先にケースを追加して XFAIL を確認 → 実装 → XPASS になったら `expect` を消す**。

## 仕組み

### 参照（Processing 側）: `tools/vt/processing.ts`, `tools/vt/sketch.ts`

1. ケースを一時フォルダにコピーし、メインタブに次を注入する（行番号がずれないよう末尾追記と size 行への挿入のみ）。
   - `size(...)` の直後に `pixelDensity(1);`（Processing 4.5 は HiDPI 画面で既定 2 になるため。プリプロセッサが settings() に移動してくれる）。size が無ければ `settings()` を追加。
   - アクティブモード: `handleDraw()` をオーバーライドし、`frames` 回の draw() 後に `save()` → `exit()`。
     （`sketchPixelDensity()` は final でオーバーライドできない。`noLoop()` のスケッチは 1 回目の draw 後に保存）
   - P2D/P3D（OpenGL）のフレームは **フレームの中で** 読む: `registerMethod("draw", …)` で登録したメソッド（draw() の直後、フレームの終わりの前に呼ばれる）で `loadPixels()` し、`pixels[]` から画像を作って保存する。Processing 4.5.2 は handleDraw() の後に OpenGL の画面を読むと不安定（filter(PShader) を使ったフレームの後は真っ白、半透明のテクスチャでは真っ黒など。ウィンドウには正しく出ている）なため。draw() の無いスケッチは setup() の直後のフレームを保存する。
   - 静的モード: 末尾に `save(); exit();` を追記。
   - スケッチの `System.out` を一時ファイルへ UTF-8 で出す（フィールド初期化子 / 静的モードは先頭の文）。Windows のコンソールは MS932 なので、そのままでは日本語が化け、`é` などは `?` になる。
2. `Processing.exe cli --sketch=<dir> --output=<dir> --force --run` を実行（画面に一瞬ウィンドウが出る）。
3. そのファイル（無ければコンソール）からマーカー `__VT_DONE__` より前をスケッチの出力として保存（Processing 自身の警告行は除外）。

### 実行（processing-ts 側）: `tools/vt/browser.ts`, `tools/vt/harness/`

1. Vite の dev サーバをプログラムから起動（`configFile: false`, root = リポジトリ）。`src/lib` を TS のまま読み込むので **ビルド不要**。
2. Playwright で Chromium を起動（既定は SwiftShader = ソフトウェア GL。マシン間で出力が揃う）。DPR 1。
3. ケースごとに新しいページで `tools/vt/harness/index.html` を開き、`window.__vt__.run()` に .pde の内容を渡す。
   ハーネスは `SketchManager({ manual_step: true })` で setup → `step()` を `frames` 回 → `canvas.toDataURL()`。
   スケッチフォルダを `/@fs/<絶対パス>/` として `base_uri` にし、`data/` のファイル一覧を `SketchData.files` で渡す（ホストと同じ使い方）。
4. `println` は `SketchManager.addEventListener("log")` で収集。

### 実行のしかた: `--exec main|worker|aot`

同じケース・同じ参照で、processing-ts の 3 つの実行経路を確かめる（既定は main）。

| `--exec` | 経路 | 撮り方 |
|---|---|---|
| `main` | `SketchManager` がページで変換し、メインスレッドで実行 | `canvas.toDataURL()` |
| `worker` | `SketchManager({ thread: "worker" })`: キャンバスを OffscreenCanvas にして Web Worker で実行（入力スクリプトのマウス/キーもページから転送される） | ページからは読めないので `SketchPlayer.capture()`（Worker の `convertToBlob`） |
| `aot` | Node で `sketchModule()`（`processing-ts build` / Vite プラグインと同じモジュール）にし、ページは blob URL から import して `SketchPlayer`（コンパイラなし）で実行 | `canvas.toDataURL()` |

オフライン実行の Service Worker はオリジン全体をスコープにして登録する（dev サーバが `Service-Worker-Allowed: /` を返す）。Worker のスクリプト（`/src/lib/runtime/worker/entry.ts`）もキャッシュから読ませるため。

### 入力スクリプト: `tools/vt/input.ts`

`vt.json` の `input` に書いた操作を、両方の実行でフレームの間に再生する（`frame: n` は n 回目の draw() の後。0 は setup() の直後。どちらも次の draw() の後でハンドラが呼ばれる）。

| type | 引数 | 内容 |
|---|---|---|
| `move` | x, y | マウスの移動（ボタンを押していればドラッグ） |
| `down` / `up` / `click` | x, y, button（left/middle/right） | 押す / 離す / 押して離す（同じ位置なら clicked も出る） |
| `wheel` | x, y, delta | ホイール（ノッチ数。正が下向き）。Chromium は同じフレームのホイールを合成するので 1 フレーム 1 回にする |
| `key` / `keydown` / `keyup` | key（DOM のキー名: `"a"`, `"Enter"`, `"ArrowLeft"`, `"Control"` など） | 押して離す / 押す / 離す |

- Processing 側: `handleDraw()` の後で `surface.getNative()`（AWT のキャンバス）に `java.awt.event.MouseEvent`/`KeyEvent`/`MouseWheelEvent` を dispatch する。Windows が実際に作るのと同じ並び（pressed → typed → released、動かさずに離したときの clicked、押したままの移動は dragged）にしているので、PSurfaceAWT の AWT → Processing の変換はそのまま通る。OS が AWT イベントを作る部分（Ctrl+A の文字が 1 になるなど）は input.ts の仮定。
- processing-ts 側: Playwright の `page.mouse`/`page.keyboard`（本物の DOM イベント）。ハーネスは `start()` → `step()` × frames → `finish()` に分かれている。

### オフライン実行: `--offline` / `vt.json` の `"offline": true`

ハーネスのページに Service Worker（`tools/vt/harness/sw.js`: ネットワーク優先、失敗したらキャッシュ）を登録して再読み込みし、一度オンラインで実行してキャッシュを満たしてから、オフラインにして再読み込み・再実行する。比べるのは 2 回目（オフライン）の結果。スケッチのファイル（`SketchFiles`）が fetch だけで読まれていることの確認（P2-9）。

### 比較: `tools/vt/image.ts`

pixelmatch（`includeAA: false` でアンチエイリアス差を無視）で不一致ピクセル数を数え、合成画像を作る。

## 現在のケースと状態

`npm run vt -- list` で最新状態を確認すること。2026-10-25 時点: 76 ケースすべて PASS（XFAIL なし）。タグ: 2d・p2d・3d（P3D と OpenGL 全般）・shader・shape・image・text・color・lang・events・api など。`lang` タグの 24 件は `npm run test:lang`（Node）でも 23 件 PASS（`random_seed` は Node のスタブに random() が無いので XFAIL）。
既知の不一致は `vt.json` の `knownIssue` と [STATUS.md](STATUS.md) の R 番号に対応させる。

## 互換性コーパス（Processing 同梱 examples）

```sh
npm run vt -- corpus                         # 254 本すべて（約 5 分）。tests/corpus/report.md を更新（コミットして進捗を追う）
npm run vt -- corpus --filter Basics/Shape   # 絞り込み（結果は tests/corpus/out/ にだけ書く）
npm run vt -- corpus --ref                   # 決定的なスケッチを本物の Processing のフレームと画像比較（初回は参照生成で +10 分程度）
```

- 例は `<Processing>/app/resources/modes/java/examples` から読む（リポジトリにはコピーしない）。`--examples <dir>` で指定も可。
- 各スケッチを変換し、setup + draw を `--frames`（既定 5）回実行して「ok / 変換エラー / setup エラー / draw エラー / タイムアウト」に分類する。
- `--ref` を付けると、完走したスケッチのうち決定的なもの（種なしの random()/noise()、時刻、frameRate、ネットワークを使わない。`corpus.ts` の `isDeterministic`）を本物の Processing の同じフレームと比べる（視覚テストと同じ基準: 不一致ピクセル JAVA2D 1%・P2D/P3D 2% 以下。参照は `node_modules/.cache/processing-ts-corpus/` にソースのハッシュでキャッシュ）。不一致のものは `tests/corpus/out/visual/<名前>.png` に合成画像（左: Processing / 中: processing-ts / 右: 差分）を書く。
- report.md の「多いエラー」は実行時エラーを正規化して集計したもので、未実装 API の優先順位付けに使える。

## stdout 適合テスト（新コンパイラ、tools/lang）

```sh
npm run test:lang                    # lang タグの全ケース（= node tools/lang/cli.ts）
npm run test:lang -- lang_boxing     # 名前の前方一致で絞り込み（タグを問わない）
npm run test:lang -- --show-code     # 生成した JS も表示（tests/lang/out/<case>.js にも書き出す）
node tools/lang/cli.ts --corpus      # 同梱 examples + リポジトリのスケッチ全部を変換（約 30 秒）→ tests/lang/out/corpus.md
```

- 視覚テストのケース（`tests/visual/cases/`）のうち `vt.json` の `tags` に `lang` を含むものを、新コンパイラで変換して Node で実行する（`tools/lang/runner.ts`）。参照は視覚テストと共用の `tests/visual/refs/<case>.stdout.txt`（`npm run test:visual:ref -- <case>` で本物の Processing から作る）。
- 描画はしない。PApplet はスタブ（描画関数はすべて何もしない。`width`/`height`/`frameCount` などの変数と `size`/`noLoop` だけ持つ）なので、`random()` や `red()` など結果を返す Processing の関数を使うケースは比較できない。そういうケースは `vt.json` に `"langExpect": "fail"` と `"langKnownIssue"` を書く（XFAIL。直ったら XPASS と表示されるので消す）。
- 新しい言語仕様のケースは `lang_` で始まる名前にする。視覚テスト（ブラウザ）と `npm run test:lang`（Node）の両方で同じ参照と比べる。
- `--corpus` は「変換できるか（コンパイラの例外・不正な JS が無いか）」を見る。スタブ上の実行時例外（PVector などが無い）は一覧に出すだけで失敗にしない。拒否されたスケッチは `npm run test:check` で Processing と照合する。

## 事前変換・配布の E2E（tools/aot）

```sh
npm run test:aot                       # 全部（約 3 分）
npm run test:aot -- cli offline        # モードを選ぶ
npm run test:aot -- package --keep     # 一時フォルダを残す
```

決定的な数ケース（hex_colors・files_load・text_metrics・shape_svg・p3d_box・p3d_shape_obj・static_mode など）を、利用者と同じ形で動かして参照画像・参照 stdout と比べる。ページは本物のフレームループで動くので、キャンバスの大きさが決まってから 1.5 秒待って撮る（どのフレームでも同じ絵になるケースだけを使う）。合成画像は `tests/aot/out/<モード>/<ケース>/composite.png`。

| モード | 内容 |
|---|---|
| `cli` | `buildSketch()`（= `processing-ts build`）の出力フォルダを静的サーバで配信して `index.html` を開く（standalone のランタイム・data/・スケッチの隣のファイル） |
| `offline` | 同じ出力の `--sw` 版を一度開き、オフラインにして再読み込み（すべて Service Worker のキャッシュから） |
| `cli-worker` | `--worker` 版（事前変換した関数を Worker で実行）。キャンバスはスクリーンショットで撮る |
| `vite` / `dev` | ケースを `?pde` で import するアプリを Vite でビルドして配信 / Vite の dev サーバで開く（プラグインは `src/aot/vite.ts`） |
| `worker` | dev サーバで `thread: "worker"`: draw() の無限ループ中もページが応答すること、`stopSketch()` で止まること、次の実行で新しいキャンバスに描くこと、`cursor()`/`surface.setTitle()` がページに届くこと |
| `package` / `package-dev` | `vite build` したパッケージ（dist/）を `tests/aot/out/package-app/node_modules/@async0x4c/processing-ts` に置いたアプリから、パッケージ名で `SketchManager`（メインスレッド・Worker）・`/runtime` と `/vite` プラグインの `?pde` を使い、Vite でビルド / dev サーバで開く。既定フォントと worker.js が利用者のバンドラにアセットとしてコピーされること、dev サーバの事前バンドルでも動くことの確認 |

## CI（.github/workflows/ci.yml）

push と pull request で、`npm ci` → `npx playwright-core install chromium` → typecheck → `npm test` → `test:lang` → `test:visual`（main・`--exec worker`・`--exec aot`）→ `test:aot` → `size` → `bench -- --slack 2`。参照はコミット済みなので Processing は要らない。Chromium のテキストのラスタライズは OS で違うので、参照を作った開発機と同じ Windows のランナーで動かす。失敗したときは `tests/visual/out`・`tests/aot/out`・`tests/bench/out` を成果物として残す。時間の予算は共有ランナー向けに 2 倍の余裕（`--slack`）。サイズは厳密。

## 性能・サイズ計測（tools/bench）

```sh
npm run bench                      # parse（Node）+ compile（Node）+ transpile（ブラウザ）。= node tools/bench/cli.ts parse compile transpile
npm run size                       # バンドルサイズ（esbuild で minify した ESM の min / gzip / brotli）
node tools/bench/cli.ts parse --filter synthetic --runs 50
node tools/bench/cli.ts all --update-budget   # 意図した変更でサイズ/時間が変わったら予算を更新してコミット
```

- 入力: `public/samples` の全スケッチ、`tests/visual/cases` の全ケース、生成した約 5,000 行のスケッチ（`synthetic-5k`、`tools/bench/inputs.ts`）。
- parse: `src/lib/transpiler/SketchParser.ts` を esbuild で Node 用にバンドルし、入力ごとに新しいプロセスで「最初の 1 回（cold）」と「その後の中央値（warm）」を測る。
- compile: 新コンパイラ全体（`compileSketch`: Lezer 解析 + 構文エラー + AST + 型検査 + コード生成）を同じ方法で測る。cold にはライブラリモデルの読み込みを含む。
- transpile: ヘッドレス Chromium の新しいページで `SketchManager.transpileSketch`（新コンパイラ）を繰り返し、1 回目（cold）と 2 回目以降の中央値（warm）を出す。cached は変換キャッシュ（`CompileCache`）の効果: 新しいページで変換して IndexedDB に入れ、同じオリジンの別の新しいページで `transpileSketchCached()` が IndexedDB から取り出すまでの時間。
- parse: 旧トランスパイラの ANTLR パーサ（比較用。ライブラリには含まれない）。
- サイズはコード分割（esbuild の splitting）で測り、エントリから静的 import でたどれる部分（最初に読み込まれる量）と、動的 import でだけ読み込まれる部分（「+ on demand」: P2D/P3D・PShader・PShape と、Worker 実行の WorkerRunner）を別の行に出す。「runtime」は `src/lib/runtime.ts`（SketchPlayer）。Worker のスクリプト（`worker/entry.ts`）も別の行。
- 予算: `tools/bench/budget.json`。超えると終了コード 1（回帰検出用）。サイズは +5%、時間は +50%（最低 5ms）の余裕で `--update-budget` が書き換える。`--slack <倍率>` は時間の予算だけを倍にする（CI 用）。
- 結果: `tests/bench/out/<command>.md` と `.json`（gitignore 済み）。

2026-10-04 時点の主な値（P1-9 の後）: ブラウザでの変換は `simple_shooter_game`（199 行）が cold 22ms・warm 3ms、`synthetic-5k` が cold 84ms・warm 40ms（旧トランスパイラは 199 行の cold が約 170ms）。Node の compile は `synthetic-5k` の warm 54〜64ms（うち Lezer の解析 約 20ms）。バンドル（P2-10 の後）: ライブラリ 155 KiB gz（PixiJS は P2-1 で削除）、ランタイム単体（2D + 言語ランタイム、コンパイラなし）36 KiB gz、うち新コンパイラ 119 KiB gz（フロントエンド 40.6 KiB、Lezer パーサ単体 30.5 KiB、ライブラリモデル 36 KiB）、言語ランタイム 19 KiB gz。

## フレーム時間（tests/perf、vt bench）

```sh
npm run vt -- bench              # tests/perf/<名前>/ のスケッチを 30 フレーム実行し、最初の 5 フレームを除いた平均・中央値（SwiftShader）
npm run vt -- bench --gpu        # 実際の GPU で
npm run vt -- bench lines --frames 60
```

- 測っているのはフレームの JavaScript 側の時間（draw() + テッセレーション + WebGL の呼び出し）。WebGL は非同期なので GPU の処理時間は含まない。
- ケース: `triangles10k`（即時モードの 1 万頂点、ライトあり）、`lines10k`（P2D の線 1 万本、半透明）、`boxes2k`（box() 2,000 個 = 4.8 万頂点、pushMatrix/popMatrix）、`retained20k`（PShape の GROUP に四角形 2 万個 = 8 万頂点、shape() で描く保持モード）。
- 2026-10-25 の値（開発機の GPU、中央値）: triangles10k 1.4ms、lines10k 13ms、boxes2k 0.9ms、retained20k 0.4ms。任意のスケッチは `npm run vt -- shot <dir> --frames n` でもフレーム時間（平均・中央値）が出る。

## 今後追加すべきテスト（ROADMAP 参照）

- トランスパイラの単体テスト（Vitest）: AST/型推論/コード生成のスナップショット
- Processing 同梱 examples（`C:/Program Files/Processing/app/resources/modes/java/examples`、254 本）を流す互換性コーパス（ROADMAP P0-5）
- 初回描画までの時間の計測（tools/bench に追加）。フレーム時間は `vt bench`（上）
