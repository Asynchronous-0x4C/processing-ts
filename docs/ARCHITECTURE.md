# 現行アーキテクチャ（2026-10 時点 / commit 587ba38 ベース）

このドキュメントは **現在のコードがどう動いているか** を記述する。将来の設計は [EVALUATION.md](EVALUATION.md) と [ROADMAP.md](ROADMAP.md) を参照。

## 全体像

```
.pde（複数タブ）
   │  SketchManager.loadSketch() / loadSketchString()   … fetch で .pde を取得（タブは "\n" で連結）
   ▼
transpile()  src/lib/transpiler/Control.ts
   ├─ ANTLR4 で字句解析・構文解析（Processing.g4 → 生成済み ProcessingParser.ts）
   ├─ MemberAnalyzer   : クラス/フィールド/メソッド/コンストラクタを収集し、継承をマージ
   ├─ ReferenceSolver  : メソッド本体を JS 文字列へ変換し、識別子を this. / __applet__. に解決
   └─ Converter        : クラス定義・オーバーロード分岐・グローバル関数を組み立てて JS 文字列を返す
   ▼
JS 文字列（関数本体）
   │  new Function("__renderer__", "PApplet", "PVector", "ArrayList", ..., code)(...)
   ▼
スケッチクラス（PApplet のサブクラス）のインスタンス
   │  DefaultRunner: settings() → setup() → setTimeout ループで draw()、イベントはフレーム後に処理
   ▼
PApplet → PGraphics（PixiJS v8 の Graphics 1 個に即時描画を積み、app.render()）
```

## ディレクトリ

| パス | 内容 |
|---|---|
| `src/lib/index.ts` | ライブラリのエントリ。`SketchManager` だけを export |
| `src/lib/SketchManager.ts` | 公開 API。読み込み・変換・実行・停止・イベント登録・アスペクト比維持 |
| `src/lib/transpiler/` | トランスパイラ（下記） |
| `src/lib/transpiler/SketchParser.ts` | 構文解析（SLL → 失敗時 LL の 2 段階）とエラーリスナー。ランタイムに依存しないので Node でテスト可能 |
| `src/lib/transpiler/antlr/Processing.g4` | Processing 公式プリプロセッサの文法（Java 1.7/8 ベース + `color` 型、`#RRGGBB`、`int()` 等の変換関数、静的/アクティブ/Java モード） |
| `src/lib/transpiler/antlr/parser/` | ANTLR4 で生成された TS（**手で編集しない**。ProcessingParser.ts は約 12,000 行） |
| `src/compiler/` | **新コンパイラ**（ROADMAP P1、開発中。まだ実行パスでは使っていない）。DOM 非依存で Node / Worker でも動く。詳細は下の「新コンパイラ」 |
| `src/compiler/grammar/` | 新コンパイラ用の Lezer 文法（@lezer/java のフォーク、MIT）。`processing.grammar` を編集して `npm run gen:grammar` で `parser.ts` を再生成する（生成物はコミット） |
| `src/lib/runtime/PApplet.ts` | Processing API の本体（約 100 関数）。描画系は `this.g`（PGraphics）へ委譲 |
| `src/lib/runtime/PGraphics.ts` | PixiJS による描画。`PImage` を継承 |
| `src/lib/runtime/PGraphicsContext.ts` | fill/stroke/text のスタイル状態、pushStyle/popStyle |
| `src/lib/runtime/PImage.ts` | Texture と `pixels[]`（Proxy 付き Array）。updatePixels は BMP にエンコードして createImageBitmap |
| `src/lib/runtime/PConstants.ts` | Processing の定数（値は本家と同じ） |
| `src/lib/runtime/runner/DefaultRunner.ts` | フレームループとイベントキュー（`Runner` 抽象クラスもここ） |
| `src/lib/runtime/util/` | ArrayList（Array 継承）、HashMap（Map ラッパ）、PVector、関数型インタフェース、IO |
| `src/lib/runtime/util/sketchio/` | 同期 XHR + localStorage + 事前読み込みバッファによるファイル IO |
| `src/main.ts`, `src/highlight.ts`, `src/style.css`, `index.html` | デモ用ライブエディタ（textarea + 正規表現ハイライタ） |
| `public/samples/` | デモのサンプル（Processing 公式 examples の一部。`src/scripts/samples.json` は dev サーバ起動時に自動生成） |
| `tools/vt/` | 視覚/出力回帰テスト CLI（[TESTING.md](TESTING.md)） |
| `tests/visual/` | 視覚テストのケースと参照画像 |
| `dist/`, `library.js` | **コミットされたビルド成果物**（npm 配布用 / CDN 版 Pixi を使う単一ファイル版） |

## 新コンパイラ（`src/compiler/`、開発中）

旧トランスパイラを置き換える予定のコンパイラ。現在はフロントエンド（構文解析 → AST）まで（P1-1〜P1-3）。型検査（P1-4）・コード生成（P1-5）・モード処理（P1-6）を足してから P1-9 で `SketchManager` を切り替える。

```
タブごとの { name, text }
   │  parseSketch()  src/compiler/parse.ts
   ├─ SketchSource（source.ts）: タブごとに通し番号の範囲を割り当てる
   ├─ タブごとに Lezer で解析（grammar/parser.ts）
   ├─ syntaxErrors()（syntax-errors.ts）: 構文エラーを複数件、メッセージ付きで
   └─ buildFile()（cst-to-ast.ts）: CST → 型付き AST（ast.ts）
   ▼
{ source, files: SketchFile[]（タブごとの AST）, diagnostics }
```

| ファイル | 内容 |
|---|---|
| `ast.ts` | AST のノード型（`kind` で判別するプレーンなオブジェクト）、`forEachChild` / `walk`、デバッグ表示 `printAst` |
| `source.ts` | 位置の管理。各ノードは `start`/`end` だけを持ち、値はタブごとに割り当てた範囲（`base + タブ内オフセット`）の通し番号。`SketchSource.locate(pos)` でタブ・行・列（1 始まり）に戻す。ノードをタブをまたいで移しても位置を失わない |
| `cst-to-ast.ts` | CST → AST。括弧は木の構造に吸収して捨てる。`color` 型は `PrimitiveType int`（`color: true`）、`#RRGGBB` は ARGB の `IntLiteral` にする。Lezer 文法が Java より緩い所（ブロック内の `import`、ローカル変数の `static` 等の修飾子、文にならない式、配列生成の形、リテラルの範囲、コンストラクタ名）をここでエラーにする |
| `syntax-errors.ts` | 構文エラーのメッセージ。字句の走査で未終端の文字列/コメントと括弧の対応を調べ、閉じられていない `{` は字下げから推定する。それより前の Lezer のエラーノードは「改行の前で式が終わっている → `Missing ';'`」「`for` の見出し → `Missing ';' in the 'for' header`」などの規則でメッセージにする。1 行に 1 件まで |
| `literals.ts` | リテラルの解釈（整数の範囲と 16/8/2 進の 32/64 ビット折り返し、浮動小数の接尾辞、エスケープ、`#RRGGBB`、テキストブロック） |
| `diagnostics.ts` | 診断の型（`code`・`message`・位置）と整形（`Tab.pde:行:列: error: ...`） |
| `api/processing-core.json` | 本物の core jar（4.5.2）をリフレクションして得た public API（35 クラスのフィールド・コンストラクタ・メソッドのシグネチャ）。`npm run gen:manifest` で再生成。型検査とカバレッジ計測に使う |

AST 構築時に Lezer 文法の解析結果を Java（Processing）の意味に合わせて組み直している所:

- 二項演算の連鎖は一度平坦化して Java の優先順位で組み直す。文法では `==`/`!=` と `<`/`>`、`instanceof` が同じ優先順位なので `f == a < b` や `a + b instanceof C` がずれるため。
- `(N) - 1`（N は大文字始まりの名前）は文法上は `-1` のキャストになるが、Java では参照型へのキャストの後に単項 +/- は来ないので減算に戻す。逆に `(color) -1` は文法上は減算になるが、Processing では int へのキャストなのでキャストに戻す。
- テキストブロックは Java の規則（共通の字下げの除去）ではなく、Processing 4.5.2 の実際の値（開始行の次の行からの生の内容に先頭の改行を付けたもの）にする。

制約: `src/compiler/` と `tools/` は Node の型除去でそのまま実行されるため、`enum`・`namespace`・コンストラクタ引数のプロパティ宣言など JS に変換が必要な TS 構文を使わない。型チェックは DOM を含まない `src/compiler/tsconfig.json` で行う（`npm run typecheck`）。

## トランスパイラの詳細

### パイプライン（`Control.ts` の `transpile()`）

1. `analyze_member()`: `ProcessingParser.processingSketch()` で構文木を作り、`MemberAnalyzer` で走査。
   - メインスケッチ名のクラスを作り、トップレベルの関数・フィールドをそのメンバーとして登録。
   - `class`/`interface` 宣言ごとに `ClassMember`（field/method/constructor/親クラス/インタフェース）を作る。
   - `mergeByHierarchy()` で親クラス・インタフェースのメンバーを子にコピー（`extended: true`）。
   - **静的モード（setup/draw のないスケッチ）は未対応**（`activeProcessingSketch` しか処理しない）。
2. `solve_reference()`: `ReferenceSolver` がメソッド本体を JS に変換。
   - メインスケッチのフィールドとユーザー定義のトップレベル関数は「グローバル」（`super` 擬似クラス）へ移動し、最終的に `let`/`function` として関数スコープに置かれる。
   - `PApplet` に同名メンバーがある関数（setup/draw、イベントハンドラなど）はスケッチクラスのメソッドとして残す。`mousePressed` 等は `_mousePressed` にリネーム（変数 `mousePressed` との衝突回避）。
   - 識別子の解決は **実際に `new PApplet(null)` したインスタンスへの `in` 判定**で行う（`applet_instance`）。API 関数は `__applet__.xxx(...)`、API 変数は `__applet__.width` などになる。
   - ローカル変数のスコープは `vatiable_list`（スペルミスのまま）で文単位に追跡。
   - キャストは捨てる（`(int)x` → `x`）。`#RRGGBB` → `0xRRGGBB`。配列生成は `Array(n).fill().map(...)`。匿名クラスはプロトタイプ継承の即時関数。ラムダは `FunctionalInterface.get(...)`。
3. `convert()`: `Converter` が JS ソースを組み立てる。
   - 同名メソッド/コンストラクタが複数あると `(...args)` で受けて `args.length` と `typeof`/`instanceof` で実行時に分岐。
   - `__applet__.xxx(` を正規表現で数え、`PApplet` 側が `AsyncFunction` のもの（現状 `size`/`fullScreen` など）に `await` を付ける。`settings/setup/draw` は async。
   - setup 本体の `size(...)` 呼び出し直後に、スケッチクラスのフィールド初期化を正規表現で挿入。
   - 末尾に `const __applet__=new <Main>(__renderer__); <グローバル>; return __applet__;`。

### 生成コードの形（例: tests/visual/cases/multi_tab の出力を抜粋）

```js
class multi_tab extends PApplet{
  constructor(){ super(arguments[0]); }
  async setup(){ await __applet__.size(320,240); shapes.add(new Box(40,40,60)); ... }
  async draw(){ __applet__.background(245); for(let s of shapes){ s.display(); } ... }
}
class Box extends Shape{
  constructor(...args){
    if(args.length==3&&(typeof args[0]==="number"||...),&&(...)){ ... }   // ← バグ: map() の結果を join していない
  }
  display(){ __applet__.fill(this.c); __applet__.rect(this.x,this.y,this.s,this.s); }
}
const __applet__=new multi_tab(__renderer__);
let shapes=new ArrayList();
function describe(...args){ ... }
return __applet__;
```

視覚テストの `run` は各ケースの変換結果を `tests/visual/out/<case>/transpiled.js` に保存する。

### 計測

`transpile()` は `performance.mark/measure` で各段の時間を `console.log` する（本番でも出力される）。
ヘッドレス Chromium での実測（新しいページ＝コールド状態、SwiftShader）: 20〜50 行のスケッチで約 35〜90ms、199 行の `simple_shooter_game` で約 190〜250ms。

## ランタイムの詳細

### 実行ループ（`DefaultRunner`）

- `init()`: `new Function(...)` でスケッチを生成 → `settings()` → `setup()` → `loop()`。
- フレームは `setTimeout(1000/frameRate)`（rAF ではない）。ウィンドウ非フォーカス時は 1fps。
- `step()`（今回追加）: 1 フレーム分（draw + イベント処理）を実行する。`SketchSettings.manual_step: true` のときはループを自動開始せず、`SketchManager.step(n)` で進める（視覚テスト用）。
- `frameCount` は setup 中 0、**最初の draw() でも 0**（Processing は 1）。draw 後にインクリメント。
- イベントは DOM イベントをキューに積み、draw の後でまとめて処理。`keyTyped` は keyPressed のたびに呼ばれる。

### 描画（`PGraphics` + PixiJS v8）

- `size()` で `Application.init({ preserveDrawingBuffer: true, clearBeforeRender: false, ... })`。
- 全描画を 1 つの `Graphics` に積み、`__end__()`（フレーム終了時）と **`text()`/`image()` のたびに** `app.render()` してから `Graphics.clear()`。前フレームの内容は描画バッファの保持で残す（Processing の「background を呼ばなければ残る」挙動の再現）。
- 変換行列は Pixi の `Graphics` の transform を直接使用。push/pop は `Graphics.save/restore`。
- テキストは `BitmapFont.install` したフォントで `BitmapText` → `generateTexture` → `graphics.texture()`。テクスチャは文字列ごとにキャッシュ（60 フレーム未使用で破棄）。
- `createGraphics()` は `RenderTexture`。`endDraw()` で描画して `loadPixels()`。
- 色は `[r,g,b,a]` に変換して Pixi の色オブジェクトへ。**`color()` の返す int は ABGR 配置**（Processing は ARGB）。
- P2D/P3D、シェーダー、ライト、カメラは未実装（`size(w,h,P3D)` の第 3 引数は無視）。

### ファイル IO（`IOBase` / `XHRIO`）

- `loadStrings/loadImage/loadJSON*` は **同期 XHR**（`base_path + path`）。localStorage → 事前読み込みバッファ → XHR の順に探す。
- `data/` フォルダは自動では探さない（サンプルはパスを書き換えて回避している）。
- `loadImage()` は同期で `PImage` を返すが、デコード（`createImageBitmap`）は非同期なので、直後の `img.width` は 0。
- `save*()` は localStorage に保存。

## ビルドと配布

- `npm run build` = `vite build`（ライブラリモード, `src/lib/index.ts`）+ `tsc`（型定義のみ `dist/types`）。
- `vite-plugin-externalize-deps` で依存（pixi.js 等）を外部化。ただし antlr4 は同梱。
- 独自プラグインが `dist/library.js` を生成（先頭の pixi import を `const X=PIXI.X` に置換し、CDN 版 Pixi のグローバルを使う形）。ルートの `library.js` はそのコピーで README からダウンロードさせている。
- dev サーバ（`npm run dev`, port 8080, base `/processing-ts/`）起動時に `public/samples/*/*/sketch.properties` から `src/scripts/samples.json` を生成（カテゴリ/名前順）。ライブラリのビルドでは `public/` を出力に含めない（`copyPublicDir: false`）。
