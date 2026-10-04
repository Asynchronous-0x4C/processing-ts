# テスト

| 種類 | コマンド | 対象 |
|---|---|---|
| 単体テスト | `npm test`（Vitest, `tests/unit/*.test.ts`） | Node で動く純粋なロジック（構文解析 `SketchParser`、PVector など、tools/vt の補助関数）。トランスパイラ全体は現状 `new PApplet()`（Pixi/DOM）に依存するため対象外（P1 の新コンパイラで Node 対応） |
| 視覚 / 出力回帰テスト | `npm run test:visual` | 本物の Processing との画像・println 比較（以下） |
| 型チェック | `npm run typecheck` | src/lib・tools・tests |
| 性能 / サイズ | `npm run bench` / `npm run size` | 変換時間・バンドルサイズ（後述「性能・サイズ計測」） |

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
```

`run` のその他のオプション: `--update`（先に参照を再生成）、`--frames n`（フレーム数を上書き）、`--headed`（ブラウザを表示）、`--gpu`（SwiftShader ではなく GPU を使う）、`--json`（結果を JSON で標準出力）、`--out <dir>`。

所要時間の目安（このリポジトリの開発機）: `run` 全 19 ケースで約 9 秒、`ref` 全ケースで約 50 秒（JAVA2D 約 2 秒/件、P2D/P3D 約 5 秒/件）。

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
  data/             loadImage("x.png") などが読むファイル（任意）
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
  "mode": "static",       // Processing のモード判定を上書き（通常は自動判定）
  "tags": ["2d"],         // 2d / 3d / shader / text / color / image / lang など
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
   - 静的モード: 末尾に `save(); exit();` を追記。
2. `Processing.exe cli --sketch=<dir> --output=<dir> --force --run` を実行（画面に一瞬ウィンドウが出る）。
3. stdout からマーカー `__VT_DONE__` より前をスケッチの出力として保存（Processing 自身の警告行は除外）。

### 実行（processing-ts 側）: `tools/vt/browser.ts`, `tools/vt/harness/`

1. Vite の dev サーバをプログラムから起動（`configFile: false`, root = リポジトリ）。`src/lib` を TS のまま読み込むので **ビルド不要**。
2. Playwright で Chromium を起動（既定は SwiftShader = ソフトウェア GL。マシン間で出力が揃う）。DPR 1。
3. ケースごとに新しいページで `tools/vt/harness/index.html` を開き、`window.__vt__.run()` に .pde の内容を渡す。
   ハーネスは `SketchManager({ manual_step: true })` で setup → `step()` を `frames` 回 → `canvas.toDataURL()`。
   `data/` は `/@fs/<絶対パス>/data/` として配信し、`loadImage("a.png")` が `data/a.png` を読むようにしている。
4. `println` は `SketchManager.addEventListener("log")` で収集。

### 比較: `tools/vt/image.ts`

pixelmatch（`includeAA: false` でアンチエイリアス差を無視）で不一致ピクセル数を数え、合成画像を作る。

## 現在のケースと状態

`npm run vt -- list` で最新状態を確認すること。2026-10-04 時点: 19 ケース中 5 PASS / 14 XFAIL。
各 XFAIL の原因は `vt.json` の `knownIssue` と [STATUS.md](STATUS.md) にある。

## 性能・サイズ計測（tools/bench）

```sh
npm run bench                      # parse（Node）+ transpile（ブラウザ）。= node tools/bench/cli.ts parse transpile
npm run size                       # バンドルサイズ（esbuild で minify した ESM の min / gzip / brotli）
node tools/bench/cli.ts parse --filter synthetic --runs 50
node tools/bench/cli.ts all --update-budget   # 意図した変更でサイズ/時間が変わったら予算を更新してコミット
```

- 入力: `public/samples` の全スケッチ、`tests/visual/cases` の全ケース、生成した約 5,000 行のスケッチ（`synthetic-5k`、`tools/bench/inputs.ts`）。
- parse: `src/lib/transpiler/SketchParser.ts` を esbuild で Node 用にバンドルし、入力ごとに新しいプロセスで「最初の 1 回（cold）」と「その後の中央値（warm）」を測る。
- transpile: ヘッドレス Chromium の新しいページで `SketchManager.transpileSketch` を繰り返し、1 回目（cold）と 2 回目以降の中央値（warm）、およびそのうちの構文解析時間を出す。
- 予算: `tools/bench/budget.json`。超えると終了コード 1（回帰検出用）。サイズは +5%、時間は +50%（最低 5ms）の余裕で `--update-budget` が書き換える。
- 結果: `tests/bench/out/<command>.md` と `.json`（gitignore 済み）。

2026-10-04 時点の主な値: `synthetic-5k` の warm 解析 15ms（SLL 化前は約 8 秒）、`simple_shooter_game`（199 行）のブラウザでの cold 変換 約 150ms（うち解析 135ms）、ライブラリ本体 87 KiB gz（pixi 込み 228 KiB gz）。

## 今後追加すべきテスト（ROADMAP 参照）

- トランスパイラの単体テスト（Vitest）: AST/型推論/コード生成のスナップショット
- Processing 同梱 examples（`C:/Program Files/Processing/app/resources/modes/java/examples`、254 本）を流す互換性コーパス（ROADMAP P0-5）
- 初回描画までの時間・フレーム時間の計測（tools/bench に追加）
