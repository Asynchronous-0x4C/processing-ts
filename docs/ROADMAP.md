# 実装ロードマップ

2026-10-04 作成。方針の根拠は [EVALUATION.md](EVALUATION.md)、現状の問題は [STATUS.md](STATUS.md)（T*/R* は STATUS.md の問題 ID）。

## 現在地（2026-10-04 時点。セッションの終わりに更新する）

- ブランチ: `feat/next-gen-foundation`（main には未マージ）。
- 完了: P0-1〜P0-7、P1-1（Lezer 文法、判断ゲート通過）、P1-2（型付き AST）、P1-3（API マニフェスト）、P1-4（型検査）、P1-5（コード生成と言語ランタイム）、P1-6（モードと前処理）、P1-7（java.util の互換層）、P1-8（stdout 適合テスト: `lang_*` 18 件）、P1-9（新コンパイラへの切り替え）。P0-8（CI）は任意で未着手。
- **次にやること: P2（ランタイムの再構築と Canvas2D）。P2-1 から**。P1（コンパイラ）は完了し、`SketchManager` は新コンパイラで変換する（P1-9）。
  - いまのランタイムは旧来の PApplet + PixiJS（`src/lib/runtime/`）に、言語ランタイム（`src/runtime/lang/`）を組み合わせたもの。生成コードとの約束は ARCHITECTURE.md の「全体像」「生成コードの形」と `codegen.ts` 冒頭（`$rt = { lang, PApplet, classes }`、上書きするメソッド名 `_mousePressed` など、`frameRate()` は `_frameRate`）。P2 で PApplet を作り直すときもこの約束を守るか、`codegen.ts`/`intrinsics.ts` と同時に変える。
  - 視覚テストの XFAIL 9 件と互換性コーパスの失敗（`tests/corpus/report.md` の「多いエラー」）が、そのまま P2 の作業一覧になっている（createShape・loadShader・lights・loadPixels・PFont.list・PVector の static メソッドなど。noSmooth などの settings 系は P1-9 で受け付けるようにした）。
  - 速度の宿題（STATUS.md C4）: 199 行のコールド変換 22ms（目標 20ms）。
- 基準値: 視覚テスト 29 PASS / 9 XFAIL、stdout 適合 22 PASS / 1 XFAIL（`npm run test:lang`）、互換性コーパス 124/254（`npm run vt -- corpus`。変換できないのは `java.awt` の 1 本）、API カバレッジ（関数）102/253、文法一致 1,190/1,190（フロントエンドも 1,190/1,190）、型検査の一致 2,381/2,384（`npm run test:check`）、サイズと時間の予算は `tools/bench/budget.json`（ライブラリ 150 KiB gz（pixi 別）、うちコンパイラ 119 KiB・言語ランタイム 19 KiB）。

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

- [x] **P0-1 構文解析の SLL 化**（S, T1）
  `Control.ts` で `PredictionMode.SLL` + `BailErrorStrategy` で解析し、失敗したら LL（既定のエラー戦略）で再解析する。
  完了条件: 視覚テストに回帰なし。5k 行入力で、ウォーム解析が 100ms 未満（P0-4 の bench で計測）。→ 結果: 15ms（`node tools/bench/cli.ts parse --filter synthetic`）
- [x] **P0-2 デバッグ出力の除去**（S, T16, R8）
  `PImage.updatePixels` の `console.log(btoa(...))`、`Transpiler.visitLastFormalParameter` / `ReferenceSolver.isMemberMethod` の console.log、`Control.ts` の計測ログ（オプション化）。
  完了条件: `npm run vt -- shot public/samples/Image/create_image` がエラーなしで完走。
- [x] **P0-3 リポジトリの整理**（S）
  未使用依存（`p5`, `@types/p5`）と自己参照 `"processing-ts": "file:"` の削除。旧実装（`runtime/renderer/`, `runtime/worker/`, `runner/AsyncRunner.ts`, `runtime/intex.ts`, `index.ts` のコメントアウト）の削除。`vite.config.ts` のサンプル一覧生成をパス区切りに依存しない実装にし、無関係な watcher パスを削除。
  完了条件: `npm run build` を一時ディレクトリへ出力して成功（`vite build --outDir <tmp>`。コミット済みの dist は変えない）、デモ（`npm run dev`）のサンプル一覧が従来どおり。
- [x] **P0-4 性能・サイズ計測 CLI**（M）
  `tools/bench/`: (a) 変換時間（同梱サンプル + 合成 5k 行、コールド/ウォーム。ブラウザは vt のハーネスを流用）、(b) バンドルサイズ（エントリごとの min/gzip）を計測し、`docs/research` の基準値と予算（EVALUATION.md §8）と比較して表で出す。`npm run bench` / `npm run size`。
  完了条件: 両コマンドが表を出力し、予算超過時に終了コード 1。
- [x] **P0-5 互換性コーパス・ランナー**（M）
  `npm run vt -- corpus [--filter Basics]`: Processing 同梱 examples（254 本。リポジトリにはコピーせずローカルのパスを参照）を変換 → 数フレーム実行し、「変換失敗 / 実行時エラー / 完走」を集計。決定的なスケッチは参照画像（キャッシュは gitignore）とも比較。結果を `tests/corpus/report.md` に出す（レポートはコミットして進捗を追う）。
  完了条件: 全 254 本の集計が出る。現状の数値を STATUS.md に記録。→ 結果: 95/254（37%）。参照画像との比較（`--ref`）は未実装（決定的なスケッチの見分けと合わせて後で追加）。
- [x] **P0-6 単体テスト基盤**（S）
  Vitest を導入（`npm test`）。最初はトランスパイラの小さなテスト数件。
- [x] **P0-7 ライセンスの判断**
  - [x] (a) GPL の `Processing.g4`/`JavaParser.g4` 由来の生成パーサ → 推奨構成の採用により P1 で Lezer（MIT）+ 自作拡張に置き換える。置き換えまでは現状のまま。ANTLR 版は開発時専用のオラクルとしてのみ残す。
  - [x] (b) 既定フォント `ProcessingSansPro-Regular.ttf` → **同梱する**（2026-10-04 ユーザー決定）。SIL OFL 1.1（Adobe の Source Sans を Processing が改名したもの。Reserved Font Name は "Source"）。core 4.5.2 から無改変でコピーし、`src/lib/runtime/fonts/` にライセンス文と一緒に置いた。表記は [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md)。
  - [x] (c) Processing core / p5.js（LGPL）のコードはコピー・移植しない（CLAUDE.md の作業ルール 6）。
- [ ] **P0-8 CI**（S、任意）
  GitHub Actions で `npm ci` → `npx playwright-core install chromium` → `npm run typecheck` → `npm run test:visual`（参照はコミット済みなので Processing は不要）。

## P1: 新コンパイラ（速さと Java 意味論）

`src/compiler/` に新規作成し、完成まで旧トランスパイラと併存させる。DOM に依存しないこと（Node で単体テストできること）。

- [x] **P1-1 Lezer による Processing 文法のスパイク**（M）— **判断ゲート → Lezer で続行**
  @lezer/java（MIT）をフォークし、トップレベルのメソッド/フィールド/文、`#RRGGBB`、`color` 型、`int(` `float(` 等の変換関数、default メソッド、テキストブロックを追加（`src/compiler/grammar/processing.grammar`、@lezer/generator でビルド）。
  検証: 公式文法の ANTLR パーサ（開発時専用オラクル）と、同梱 examples 254 本 + テストケース + 構文エラーを含む入力群で受理/拒否を比較するスクリプト。
  完了条件: 受理/拒否の一致率 99% 以上、199 行のコールド解析 15ms 以下（Node）。満たせない場合は **手書き再帰下降パーサに切り替える**ことを ROADMAP に記録して P1-1b として実施。
  → 結果（2026-10-04）: `npm run test:grammar` で **1,186/1,186 件一致**（有効な入力 307: 同梱 examples 254 + リポジトリのスケッチ + Processing 固有構文のスニペット + 5k 行の合成スケッチ、構文エラーを入れた変種 879）。199 行のコールド解析 7.4ms / ウォーム 1.0ms、gzip 30.5 KiB（ANTLR 版は 69.0 KiB）。混在モード（静的な文とメソッド宣言の混在）は文法ではなくコンパイラで拒否する（compare.ts の `lezerVerdict` と同じ規則を P1-6 で実装する）。
- [x] **P1-2 AST と CST→AST 変換**（M）
  型付き AST（ノードごとにタブ・行・列）。複数タブはタブ単位で解析して位置を保持（T15）。
  → 結果（2026-10-04）: `src/compiler/{ast,source,cst-to-ast,syntax-errors,literals,diagnostics,parse}.ts`。位置はタブごとに範囲を割り当てた通し番号（`start`/`end`）で持ち、`SketchSource.locate()` でタブ・行・列に戻す。`npm run test:grammar` でフロントエンド（解析 + AST 構築）の受理/拒否も ANTLR と **1,190/1,190 件一致**、内部エラー 0。同梱 examples 254 本（58,563 ノード）が診断なしで AST 化でき、全ノードの範囲が親の範囲内。構文エラーは複数件・タブ名と行列つき: `;` `)` `}` を消した変種 882 件すべてで最初のメッセージが消した記号を名指しし、`;`/`)` は 594/594 件で 1 行以内、`}` は 286/288 件で閉じられていない `{` の行を指す。Lezer 文法と Java の解釈の差（`==` と `<` の優先順位、`instanceof`、`(N) - 1`、`(color) -1`）は AST 構築時に組み直す。テキストブロックは本物の Processing で調べた値（Java とは異なる）にした（`literals_processing` ケースを追加、T18/T19）。速度（Node、warm）: 199 行 1.7ms、5k 行 32ms（うち Lezer 23ms）。`npm run bench` に `compile` を追加。
- [x] **P1-3 Processing API マニフェスト**（M）
  `tools/manifest/`: Processing 同梱 JDK（`C:/Program Files/Processing/app/resources/jdk`）で core jar をリフレクションし、PApplet/PGraphics/PImage/PVector/PShape/PShader/PFont/PMatrix*/IntList…/Table/XML/JSON* の public メソッド・フィールド・定数を JSON 化（`src/compiler/api/processing-core.json`、コミットする）。
  完了条件: PApplet のメソッド 316 名・716 オーバーロードが含まれる。ランタイムの実装状況との差分を出すスクリプト（カバレッジ表を STATUS.md に自動反映できる形）。
  → 結果: `npm run gen:manifest`（`tools/manifest/`）で 35 クラスを出力。PApplet は 351 名 / 715 オーバーロード（数え方の違いで調査時の 316/716 とずれるが、宣言された public メソッドはすべて含む）。`npm run coverage` が [docs/api-coverage.md](api-coverage.md) を生成（現状: リファレンスの関数 102/253 = 40%）。ブラウザ内コンパイラに載せる際は、このJSON（250 KB）から必要な情報だけを抜いた小さな形式を生成すること（P1-4）。
- [x] **P1-4 シンボル表と型検査**（L）
  スケッチクラス/内部クラス/static ネスト/インタフェース/enum/ジェネリクス（消去）/配列、数値昇格、文字列連結、オーバーロード解決（完全一致 → 拡大 → ボクシング → 可変長）。未定義・型不一致などの意味エラーを複数件、位置つきで返す。
  → 結果（2026-10-04）: `src/compiler/{sketch,types,typesystem,library,check,constants,flow,definite}.ts`。`analyzeSketch()` で解析から型検査まで。
  - 判定基準として **本物の Processing の `cli --build`（前処理 + ECJ）** と比較する `npm run test:check` を追加（`tools/check/`）。入力は同梱 examples・リポジトリのスケッチ 297 本と、AST を使って作る意味エラーの変種 1,926 本（未定義の変数/関数、引数の追加、文字列の引数、float→int の宣言、到達不能コード、変数の重複、内部クラスの static メソッド、型の取り違え、return の削除）。Processing の結果はキャッシュ（初回は約 40 分）。
  - 結果: **2,220/2,223 件一致、見逃し 0 件**。誤検出 3 件はすべて `java.awt.Polygon`（processing-ts では使えないクラス。`unsupported` として報告）。両方が拒否した 1,759 件のうち、Processing の最初のエラーの行を我々も報告 1,743 件、メッセージ完全一致 1,756 件（「適用できない候補」の選び方まで ECJ に合わせた）。
  - Processing（Java とは別）の挙動を `--build` で確認して反映: 既定の import、接尾辞なしの小数は float、全クラスのアクセス修飾子なしのメソッドは public、静的モードは `setup()` に包んで `noLoop()`、内部クラスに static メンバーや enum を置けない（Java 16 未満の扱い）、ローカル enum は不可。
  - API モデル: `npm run gen:manifest` が `src/compiler/api/library.gen.ts` も生成（Processing core + JDK の一部 216 クラス、ジェネリクスと throws 付きの JVM シグネチャ、宣言順。モデル外の型を使うメンバーと PApplet 以外の protected は除外し、名前だけ残して「使えない」と報告）。gzip 36 KiB。
  - 速度（Node、warm、解析込み）: 199 行 2.5ms、5k 行 44ms（型検査は約 10ms、残りは Lezer の解析と AST 構築）。コンパイラ全体の gzip は 103 KiB（うちライブラリモデル 36 KiB）。
  - 未対応（STATUS.md の C 番号）: 実引数位置のジェネリックメソッドの推論、final への再代入（definite unassignment）、キャプチャ変換。
- [x] **P1-5 コード生成**（L）
  EVALUATION.md §3 の表（整数演算、飽和キャスト、複合代入、char、float の表示、型付き配列、String、typed catch、予約語回避、オーバーロードの名前修飾）。Source Map v3。ランタイムヘルパは `src/runtime/lang/`。
  → 結果（2026-10-04）: `src/compiler/{codegen,intrinsics,sourcemap}.ts` と `src/runtime/lang/`（gzip 11.9 KiB）。`compileSketch()` で解析からコード生成まで。
  - 検証: 言語仕様のケース 12 件（`lang_arrays`/`classes`/`collections`/`control`/`enums_static`/`exceptions`/`lambdas`/`numbers`/`overloads`/`print`/`strings`/`boxing`）と既存の `java_semantics`・`multi_tab`・`static_mode`・`literals_processing` の println 出力が本物の Processing と完全一致（`npm run test:lang`）。同梱 examples とリポジトリのスケッチ 309 本中 308 本が構文エラーの無い JS になる（1 本は `java.awt`）。
  - float は演算ごとに `Math.fround`（EVALUATION.md §3 を更新）。表示は JDK 17 の `Float.toString`/`Double.toString` を再現（Java 17 で出力した値と照合）。HashMap は Java と同じ順で列挙する。ボクシングは Character/Float/Double だけ `JChar`/`JFloat`/`JDouble` にした（`ArrayList<Float>` の表示、`instanceof`、HashMap のキー）。
  - 型検査の修正: `Character` と `char`、`Integer` と `Float` の条件演算子を数値の条件式として型付け（JLS 15.25）。
  - 速度（Node、warm）: 199 行 3.0ms、5k 行 54ms（コード生成は約 9ms）。コンパイラ全体の gzip は 117.6 KiB。
  - 未対応（STATUS.md C6〜C8）: 2^53 を超える long、JDK 17 の Float.toString の一部、整数ボックスの同一性。
- [x] **P1-6 モードとプリプロセッサ相当の処理**（M）
  静的/アクティブ/Java クラスの判定（T11）、小数リテラルの float 扱い、`#hex`、`settings()` への移動、静的モードの `noLoop()`。
  → 一部済み（P1-2/P1-4）: モード判定・静的モードの `setup()` + `noLoop()`・混在モードのエラー・メソッドへの `public` 付与（`sketch.ts`）、小数リテラルの float（`check.ts`）、`#hex`（`cst-to-ast.ts`）。
  → 結果（2026-10-04）: `settings()` への移動と Java モードを `sketch.ts` に追加。規則はすべて `Processing cli --build` の出力（約 40 個の小さなスケッチ）から決めた:
  - 移動するのは、`setup` という名前のメソッド（どのクラスでも。静的モードは全文が setup の中）の本体に直接書かれた `size`/`fullScreen`/`pixelDensity`/`noSmooth`/`smooth` の文（`this.` 付きも）。`if` の中や他のメソッドの中は移動しない。
  - `size()` の幅か高さに名前（変数・定数・`displayWidth`・メソッド呼び出し・`int()`）を含むものは移動しない（実行時に `size() cannot be used here` になる。ランタイムの課題）。リテラルと演算子だけなら移動する（`300+100`、`(int) 300.5`、`-1`）。3 番目以降の引数は問わない。
  - `settings()` には種類ごとに最後の呼び出しを固定の順（size/fullScreen → pixelDensity → noSmooth → smooth）で置く。`fullScreen()` は順序によらず `size()` に勝つ。ユーザーが `settings()` も書いていると `Duplicate method settings()` になる（Processing と同じ）。
  - Java モード: トップレベルが型宣言だけで、そのどれかが `public static void main` を宣言しているとき（`main` が無ければクラスだけのスケッチも静的モード）。書いたとおりの Java として扱い、スケッチ名のクラスがスケッチ本体、他の型はトップレベルのクラス（`getClass().getName()` は `Helper`）。Processing のリテラル・`color`・メソッドの `public` 化は Java モードでも行われる。`size()` などは消されるが `settings()` は生成されない（Processing の挙動をそのまま再現）。
  - 単体テスト（`compiler-sketch.test.ts` の移動規則 11 件、Java モード、`compiler-check.test.ts` の重複エラー、`compiler-codegen.test.ts` の実行）。
- [x] **P1-7 Java 標準ライブラリの互換層**（M）
  ArrayList, HashMap, HashSet, LinkedList, Collections, Arrays, StringBuilder, Integer/Float/Double/Boolean の parse/valueOf, Math, Iterator, Map.Entry, Character, String のメソッド。
  → 結果（2026-10-04）: `src/runtime/lang/{collections,maps,util}.ts`。ケース `lang_util_lists`/`lang_util_maps`/`lang_util_misc`/`lang_util_extend` が本物の Processing と完全一致。
  - リスト: ArrayList/LinkedList/ArrayDeque/Vector/Stack/PriorityQueue/CopyOnWriteArrayList。Java と同じ時点で ConcurrentModificationException（`hasNext` は `cursor != size`）、ListIterator、`subList`・`Collections.unmodifiableList` はビュー、`Arrays.asList` は配列に書き戻す固定長、`List.of` は不変。PriorityQueue は Java と同じ二分ヒープの配置（`println` で内部順が見える）。
  - マップと集合: HashMap は表の大きさまで再現（コピーと `putAll` の事前拡張で列挙順が変わるのも一致）、LinkedHashMap（挿入順・アクセス順、`removeEldestEntry` の上書き）、TreeMap/TreeSet（ナビゲーション）、Map の既定メソッド（compute/merge/replaceAll…）、ビュー経由の削除と `setValue`。
  - Random は Javadoc の線形合同法そのもの（種を与えた列・`nextGaussian`・`Collections.shuffle(list, rnd)` が Java と一致。P2-7 の `random()` に使える）。Objects・StringJoiner・StringTokenizer・Collections/Arrays の主要メソッド。
  - java.util のインタフェース（List/Set/Map/Deque…）を登録して `instanceof` が動く。スケッチのクラスがライブラリのクラスを継承できる（`class Bag extends ArrayList<String>`、コンストラクタ引数は `$init` で受け渡し）。ランタイム内部のメンバー名は `$` 付き（継承したクラスの名前と衝突しない）。
  - あわせて直したもの: ジェネリックメソッドの推論を上下限つきにした（`Collections.sort(list, Collections.reverseOrder())` が通る）、`println(a, b, ...)` は全引数を評価してから文字列にする（Java の可変長引数と同じ。文字列連結は ECJ と同じく左から順に変換）、継承した SAM（`BinaryOperator`）のラムダの戻り値型。
  - 未対応（STATUS.md C10・C11）: TreeMap/TreeSet のナビゲーションのビュー（コピーを返す）、`Set.of`/`Map.of` の順序、ストリーム、Scanner/Date/Calendar/BitSet/Optional など。
- [x] **P1-8 stdout 適合テストの拡充と高速ランナー**（M）
  `lang` タグのケースを追加（文字列、配列、クラスと継承、例外、switch、ジェネリクス、ラムダ、static、内部クラス、整数/浮動小数の境界値）。描画不要のケースは Node で実行する `npm run test:lang`（参照の stdout は vt の `ref` で生成したものを共用）。
  → 結果（2026-10-04）: `npm run test:lang`（`tools/lang/`、全ケース約 1 秒、`--corpus` で全スケッチの変換確認）と `lang_*` 18 件（P1-5 の 11 件、boxing、java.util の 4 件、`lang_generics_inner`（ジェネリクスと内部クラス、インタフェースの既定/static メソッド、例外の連鎖）、`lang_flow_text`（ラベル付き break/continue、switch のフォールスルー、条件演算子の型、サロゲートペア、日本語、StringBuilder））。`lang` タグの 23 件中 22 件が本物の Processing と完全一致（`random_seed` は P2-7 の後）。
  - 見つけて直したもの: ジェネリッククラスの内部クラスのメンバーが外側の型引数で置換されていなかった（`Tree<Integer>.Node` の `value` が T のまま）、例外クラスの `getClass().getName()` にパッケージが無かった、vt の参照生成で `list.size()` の後ろにも `pixelDensity(1)` を挿入していた、Windows の Processing の標準出力（MS932）で日本語が化け、`é` などが `?` になっていた（参照生成時は System.out を UTF-8 のファイルに向ける）。
  - `printStackTrace` の出力（標準エラー）は比較していない。
- [x] **P1-9 切り替え**（M）
  `SketchManager` を新コンパイラに切り替え、旧 `transpiler/`・antlr4 依存・生成パーサを配布物から削除（オラクルとしては devDependency に残す）。
  完了条件: java_semantics / multi_tab / static_mode が PASS。コーパスの変換成功率 95% 以上。199 行のコールド変換 20ms 以下（ブラウザ）。5k 行ウォーム 50ms 以下。
  → 結果（2026-10-04）: `SketchManager.transpileSketch()` はタブごとに `compileSketch()` を呼び、診断を `Tab.pde:行:列: error: ...` で error listener に渡す。`DefaultRunner` は `$rt = { lang, PApplet, classes }` で生成コードを実行し、print/println を 1 行ずつ log listener へ、捕捉されない例外を Java 形式（`java.lang.NullPointerException: ...`）で error listener へ送ってスケッチを止める（Processing と同じ）。旧トランスパイラと antlr4 は配布物から外した（antlr4 は devDependency。文法と速度の比較対象として残す）。デモのエディタもタブごとに渡す。
  - 完了条件: java_semantics / multi_tab / static_mode は PASS。同梱 examples の変換成功 253/254（99.6%）。5k 行ウォーム 40ms（≤ 50ms）。199 行のコールド変換は 22ms で目標 20ms をわずかに超える（旧トランスパイラは約 170ms。STATUS.md C4）。
  - 切り替えで直したランタイムの不一致: メイン画面の既定の背景 204（R1）、色の int を ARGB に（R2。`fill(int)` の灰色/ARGB 判定も）、`key` を文字コードに（R16 の大部分）、`random()`/`randomSeed()`/`randomGaussian()` を java.util.Random で Processing と同じ列に（R14 の random 部分）、`smooth()`/`noSmooth()`/`pixelDensity()`/`hint()` などを受け付ける（前処理で settings() に移るため）。
  - 結果: 視覚テスト 5 PASS → 29 PASS（言語仕様の 22 件と hex_colors・default_style。random_seed は noise の違いで XFAIL のまま）、互換性コーパス 95 → 124 本（37% → 49%、JAVA2D 71%）。

## P2: ランタイムの再構築と Canvas2D（JAVA2D）

- [ ] **P2-1 描画の抽象化**（M）— P3 の前提
  Processing の PGraphics のメソッド集合（P1-3 のマニフェスト）に沿った抽象クラスと、レンダラ非依存の状態（スタイルスタック、行列スタック、色モード）。`PGraphicsCanvas2D` を最初の実装にする。
- [ ] **P2-2 色**（S, R2）ARGB の int、`colorMode`（RGB/HSB と最大値）、`fill(int)` の灰色/ARGB 判定、`hue/saturation/brightness`、`lerpColor`、`hex()`。
  → 一部済み（P1-9）: ARGB の int、`fill(int)` の灰色/ARGB 判定、`red/green/blue/alpha`、`lerpColor`、`hex()`（コンパイラ）。残り: `color()` の colorMode 対応（HSB・最大値）、`hue/saturation/brightness`。
- [ ] **P2-3 図形と既定値**（M, R1, R3, R4, R5, R15）既定の背景 204・白塗り・黒線 1px、各モード、arc の OPEN/CHORD/PIE、strokeCap/Join、beginShape の全種別、beginContour、bezier/curve 系と detail/tightness、`square`、size() 無しのスケッチ。
- [ ] **P2-4 変換**（S）PMatrix2D、applyMatrix、shearX/Y、printMatrix、push/pop のスタイルと行列。
- [ ] **P2-5 画像**（L, R8〜R10）Int32Array の pixels と CPU/キャンバス間の遅延同期、get/set/copy/blend/mask/filter/tint/resize、メインキャンバスの loadPixels/updatePixels、createGraphics（OffscreenCanvas）、save/saveFrame。
- [ ] **P2-6 テキスト**（M, R6）createFont/loadFont(.vlw)/textFont/textSize/textAlign（縦方向も）/textLeading/textWidth/textAscent/textDescent/矩形内の折り返し、既定フォントは同梱の `src/lib/runtime/fonts/ProcessingSansPro-Regular.ttf`（288 KB の TTF）。text() が使われたときだけ FontFace で遅延読み込みし、ライブラリのビルドではライセンス文と一緒に dist へ出力する（`package.json` の `files` と THIRD_PARTY_NOTICES.md も確認）。WOFF2 化やサブセット化は OFL 上の Modified Version になるが、名前（Processing Sans Pro）に予約名 "Source" を含まないので可。その場合も OFL とコピーライト表記を残す。
- [ ] **P2-7 乱数とノイズ**（S, R14）`java.util.Random` 互換、randomGaussian、Processing の noise と noiseDetail/noiseSeed。完了条件: random_seed が PASS（stdout の値まで一致）。
  → 一部済み（P1-9）: random/randomSeed/randomGaussian は java.util.Random（`src/runtime/lang/util.ts`）で Processing と同じ値（random_seed の円 40 個が一致）。残り: noise。Processing の noise は LGPL の実装なので移植せず、出力から挙動を確かめて実装する（方針の判断が必要ならユーザーに確認）。
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
| 済 (P0-4) | `npm run bench` / `npm run size` | 変換時間・バンドルサイズの計測と予算チェック |
| 済 (P0-5) | `npm run vt -- corpus` | 同梱 examples 254 本の互換性集計 |
| 済 (P0-6) | `npm test`（Vitest） | コンパイラの単体テスト |
| 済 (P1-4) | `npm run test:check` | 型検査の受理/拒否・エラー行・メッセージを本物の Processing（`cli --build`）と比較（意味エラーの変種を含む） |
| 済 (P1-5) | `npm run test:lang` | 描画しない stdout 適合テストを Node で高速実行（`--corpus` で全スケッチの変換確認） |
| P2-8 | vt の入力スクリプト | フレームごとのマウス/キー操作を Processing 側（`java.awt.Robot` ではなくイベント関数の直接呼び出しを注入）と processing-ts 側の両方で再生して比較 |
| P2-9 | vt `--offline` | Service Worker + オフラインでの data/ 読み込み確認 |
| P3 | `tests/perf/` + vt `bench` | フレーム時間の計測（SwiftShader / GPU） |
