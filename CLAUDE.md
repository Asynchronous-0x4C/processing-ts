# CLAUDE.md — processing-ts

Processing のスケッチ（`.pde`, Java 系の言語）を **そのまま** ブラウザで動かすための TypeScript ライブラリ。
.pde を JavaScript にトランスパイルし、Processing 互換のランタイムで実行する。
Processing.js（古い Processing が対象・構文解析エラー・シェーダー非対応）を置き換える「次世代の Web 版 Processing」が目標。

ドキュメントは日本語で書く（コード中の識別子・コメントは既存に合わせる）。

## まず読むもの

| ファイル | 内容 |
|---|---|
| [docs/STATUS.md](docs/STATUS.md) | 現状・実装済み API・**既知のバグ一覧（ID 付き）** |
| [docs/ROADMAP.md](docs/ROADMAP.md) | 実装ロードマップ。**冒頭の「現在地」に次のタスクがある**。作業はここのフェーズ/タスク ID に沿って進める |
| [docs/EVALUATION.md](docs/EVALUATION.md) | 構文解析・描画などのライブラリ選定の検討（サイズ・速度の実測あり） |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | 現行コードの構造と処理の流れ |
| [docs/TESTING.md](docs/TESTING.md) | 視覚/出力回帰テスト CLI の使い方と仕組み |

## コマンド

```sh
npm install
npm run dev                  # デモ（ライブエディタ）: http://localhost:8080/processing-ts/
npm run typecheck            # 型チェック（src/lib・src/compiler・tools・tests。何も書き出さない）。`npx tsc` を直接使うと dist/types が書き換わるので使わない
npm test                     # 単体テスト（Vitest, tests/unit/。Node で動くものだけ）
npm run test:visual          # 視覚/出力回帰テスト（全ケース、約 10 秒）。終了コード 0 = 回帰なし
npm run test:visual -- <名前の前方一致...> [--tag 2d]
npm run test:visual:ref -- <case>   # 本物の Processing で参照画像と stdout を作り直す（ケースを変えたとき）
npm run vt -- shot <sketchDir> --ref --frames 30   # 任意のスケッチを processing-ts と Processing の両方で撮って比較
npm run vt -- list           # テストケースと既知の問題の一覧
npm run vt -- corpus         # Processing 同梱 examples 254 本の互換性集計（約 5 分）→ tests/corpus/report.md
npm run test:grammar         # Lezer 文法と公式文法（ANTLR）の受理/拒否の一致を確認（文法を変えたら必ず実行）
npm run test:check           # 新コンパイラの型検査を本物の Processing（cli --build）と比較（型検査を変えたら実行。初回のみ約 40 分）
npm run gen:grammar          # src/compiler/grammar/processing.grammar → parser.ts を再生成
npm run gen:manifest         # 本物の core jar から API マニフェスト（src/compiler/api/processing-core.json）を再生成
npm run coverage             # リファレンスに対する実装済み API の一覧 → docs/api-coverage.md
npm run bench                # 変換時間（Node の旧構文解析 + 新コンパイラのフロントエンド + ブラウザでの変換全体）。予算超過で終了コード 1
npm run size                 # バンドルサイズ（min / gzip / brotli）。予算: tools/bench/budget.json
npm run build                # リリース時のみ（dist/ と library.js はコミットされた成果物）
```

結果は `tests/visual/out/` に出る。**`tests/visual/out/<case>/composite.png`（左: Processing / 中: processing-ts / 右: 差分）を Read ツールで開いて目で確認する**。変換後の JS は同じフォルダの `transpiled.js`。

## 環境

- Windows 11。シェルは PowerShell と Git Bash。Node >= 22.18（`tools/` の .ts は Node の型除去でそのまま実行）。
- 本物の Processing 4.5.2 が `C:/Program Files/Processing/Processing.exe` にある（CLI: `Processing.exe cli --sketch=<dir> --output=<dir> --force --run`）。参照生成時は画面に一瞬ウィンドウが出る。
  - 同梱 JDK 17: `C:/Program Files/Processing/app/resources/jdk/bin/java.exe`（`javac.exe` もある）。core jar のリフレクション等に使える。
  - 同梱 examples 254 本: `C:/Program Files/Processing/app/resources/modes/java/examples`（互換性テストの母集団。リポジトリにはコピーしない）。
- Playwright 用 Chromium（chromium-1243 = playwright-core 1.63）がユーザーキャッシュにある。
- 「Processing ではどう動くか」が分からないときは推測せず、小さなスケッチを書いて `npm run vt -- shot <dir> --ref` で本物の出力（画像と println）を確認する。

## 構成（要点）

- `src/lib/SketchManager.ts` … 公開 API（読み込み → 変換 → 実行）
- `src/compiler/` … 新コンパイラ（P1、開発中で未接続）。`parse.ts` の `parseSketch()` がタブごとに解析して型付き AST（`ast.ts`）と診断を返す。DOM 非依存（[ARCHITECTURE.md](docs/ARCHITECTURE.md) の「新コンパイラ」）
- `src/compiler/grammar/` … 新コンパイラ用の Lezer 文法（`processing.grammar` を編集 → `npm run gen:grammar`。`parser.ts` は生成物なので手で編集しない）
- `src/lib/transpiler/` … ANTLR4（`antlr/Processing.g4` から生成した `antlr/parser/*` は **手で編集しない**）→ MemberAnalyzer → ReferenceSolver → Converter
- `src/lib/runtime/` … PApplet（API）, PGraphics（PixiJS v8 で描画）, PImage, DefaultRunner（フレームループ）
- `src/main.ts` ほか … デモ用エディタ。`public/samples/` はデモのサンプル
- `tools/vt/` … 視覚テスト CLI。`tests/visual/cases/<name>/` がケース、`tests/visual/refs/` が Processing の参照（コミットする）
- `docs/research/` … 調査・計測の生データと再現スクリプト

## 作業ルール

1. **振る舞いの正解は本物の Processing（4.5.2）**。p5.js や Processing.js の挙動に合わせない。
2. 描画・言語仕様に関わる変更は **テスト先行**: `tests/visual/cases/` にケースを追加（決定的に、幅 320 以上）→ `npm run test:visual:ref -- <case>` → XFAIL を確認 → 実装 → XPASS になったら `vt.json` の `expect`/`knownIssue` を削除。
3. 変更後は `npm run typecheck`・`npm test`・`npm run test:visual` を通す。FAIL（回帰）を残さない。
4. 既知のバグを直したら [docs/STATUS.md](docs/STATUS.md) の該当行を消し、ROADMAP のタスクにチェックを付ける。新しく見つけた問題は STATUS.md に ID 付きで追記する。
5. `dist/` と `library.js` はリリース時以外に変更しない（コミットしない）。
6. ライセンス: 本プロジェクトは MIT。Processing core（processing4 の `core/`）と p5.js は **LGPL-2.1** なので、コードをそのまま移植・コピーしない。仕様・リファレンス・実際の出力から実装する（判断が必要なら作業前にユーザーに確認）。第三者のファイルを取り込むときは [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) に追記する（既定フォント Processing Sans Pro は SIL OFL 1.1 で同梱済み）。
7. `PApplet` の内部用メンバーは `__name__` 形式にする（スケッチ側の識別子との衝突を避けるため。既存の慣例）。
8. 依存ライブラリを追加するときは gzip 後のサイズを確認し、EVALUATION.md の方針（ランタイムを小さく保つ）に沿うか判断する。

## 落とし穴

- Processing 4.5 は HiDPI 画面で既定 `pixelDensity(2)`。参照生成では `pixelDensity(1)` を注入している。
- Windows では P2D/P3D の小さいウィンドウが OS に広げられる（200px 幅 → 232px）。テストは幅 320 以上で作る。
- 変換時に `new PApplet(null)` を作るため、旧トランスパイラ単体では Node で動かない（ブラウザが必要。新コンパイラ `src/compiler/` は Node で動く）。
- `src/compiler/` と `tools/` は Node の型除去でそのまま実行されるので、`enum`・`namespace`・コンストラクタ引数のプロパティ宣言など変換が必要な TS 構文を使わない。import には `.ts` 拡張子を付ける。
- Processing は Java と挙動が違うことがある（例: テキストブロックは字下げを除去しない）。Java の仕様から推測せず本物で確かめる。
- Git Bash の heredoc で `'` を含む長い内容を書くと失敗することがある。ファイル作成は Write ツールを使う。
