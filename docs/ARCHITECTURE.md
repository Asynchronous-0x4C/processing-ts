# 現行アーキテクチャ（2026-10 時点）

このドキュメントは **現在のコードがどう動いているか** を記述する。将来の設計は [EVALUATION.md](EVALUATION.md) と [ROADMAP.md](ROADMAP.md) を参照。

## 全体像

```
.pde（複数タブ）
   │  SketchManager.loadSketch() / loadSketchString()   … fetch で .pde を取得（タブごと）
   ▼
SketchManager.transpileSketch()  → compileSketch()  src/compiler/index.ts（下の「新コンパイラ」）
   │  構文解析（Lezer）→ 型付き AST → 前処理（モード・settings()）→ 型検査 → コード生成 + Source Map
   │  エラーは "Tab.pde:行:列: error: ..." の形で error listener へ（複数件）
   ▼
JS（関数本体）
   │  DefaultRunner.init(): new Function("$rt", "__renderer__", code)($rt, renderer)
   │    $rt = { lang（src/runtime/lang の Java 言語ランタイム）, PApplet, classes（java.* と processing.* のクラス）}
   ▼
スケッチクラス（PApplet のサブクラス）のインスタンス
   │  DefaultRunner: settings() → __init_surface__() → setup() → setTimeout ループで draw()、イベントはフレーム後に処理
   │  print/println は lang.setOutput 経由で log listener へ（1 行ずつ）。捕捉されない例外は Java 形式で error listener へ送り、スケッチを止める
   ▼
PApplet → g: PGraphicsJava2D（PGraphics の Canvas 2D 実装。キャンバスに即時描画）
```

旧トランスパイラ（`src/lib/transpiler/`、ANTLR4）は P1-9 で実行パスから外した。構文の判定基準（`npm run test:grammar`）と速度比較（`npm run bench` の parse）のためにリポジトリに残している（antlr4 は devDependency）。

## ディレクトリ

| パス | 内容 |
|---|---|
| `src/lib/index.ts` | ライブラリのエントリ。`SketchManager` だけを export |
| `src/lib/SketchManager.ts` | 公開 API。読み込み・変換・実行・停止・イベント登録・アスペクト比維持 |
| `src/lib/transpiler/` | 旧トランスパイラ（使用していない。文法と速度の比較対象） |
| `src/lib/transpiler/SketchParser.ts` | 構文解析（SLL → 失敗時 LL の 2 段階）とエラーリスナー。ランタイムに依存しないので Node でテスト可能 |
| `src/lib/transpiler/antlr/Processing.g4` | Processing 公式プリプロセッサの文法（Java 1.7/8 ベース + `color` 型、`#RRGGBB`、`int()` 等の変換関数、静的/アクティブ/Java モード） |
| `src/lib/transpiler/antlr/parser/` | ANTLR4 で生成された TS（**手で編集しない**。ProcessingParser.ts は約 12,000 行） |
| `src/compiler/` | **コンパイラ**（ROADMAP P1）。DOM 非依存で Node / Worker でも動く。詳細は下の「新コンパイラ」 |
| `src/compiler/grammar/` | 新コンパイラ用の Lezer 文法（@lezer/java のフォーク、MIT）。`processing.grammar` を編集して `npm run gen:grammar` で `parser.ts` を再生成する（生成物はコミット） |
| `src/runtime/lang/` | 新コンパイラが生成するコード用の Java 言語ランタイム（数値・文字列・例外・配列・ボクシング・java.util の一部）。DOM 非依存。詳細は下の「言語ランタイム」 |
| `src/lib/runtime/PApplet.ts` | Processing API の本体。描画系は `this.g`（PGraphicsJava2D）へ委譲（`DELEGATED` の一覧をプロトタイプに設定） |
| `src/lib/runtime/PGraphics.ts` | レンダラ非依存の抽象クラス（`PImage` を継承）: スタイル/行列スタック、色の計算、図形のパス化、beginShape、image/text のレイアウト |
| `src/lib/runtime/PGraphicsJava2D.ts` | JAVA2D レンダラ（Canvas 2D）。`PGraphics` のフックを実装 |
| `src/lib/runtime/PMatrix2D.ts` | 2D アフィン行列（Processing と同じく右から掛ける） |
| `src/lib/runtime/PImage.ts` | `pixels`（ARGB の Int32Array）とキャンバス（OffscreenCanvas があればそれ）。loadPixels/updatePixels は getImageData/putImageData |
| `src/lib/runtime/PFont.ts` | CSS のフォントファミリ。同梱の Processing Sans Pro を FontFace で遅延読み込み |
| `src/lib/runtime/PConstants.ts` | Processing の定数（値は本家と同じ） |
| `src/lib/runtime/runner/DefaultRunner.ts` | フレームループとイベントキュー（`Runner` 抽象クラスもここ） |
| `src/lib/runtime/util/` | ArrayList（Array 継承）、HashMap（Map ラッパ）、PVector、関数型インタフェース、noise、配列関数 |
| `src/lib/runtime/io/` | スケッチのファイル（`SketchFiles`: 事前 fetch・画像の事前デコード・保存）と TIFF/TGA のエンコーダ |
| `src/main.ts`, `src/highlight.ts`, `src/style.css`, `index.html` | デモ用ライブエディタ（textarea + 正規表現ハイライタ） |
| `public/samples/` | デモのサンプル（Processing 公式 examples の一部。`src/scripts/samples.json` は dev サーバ起動時に自動生成） |
| `tools/vt/` | 視覚/出力回帰テスト CLI（[TESTING.md](TESTING.md)） |
| `tools/lang/` | 新コンパイラの stdout 適合テスト（`npm run test:lang`）。描画しないスタブの PApplet で Node 上で実行する |
| `tests/visual/` | 視覚テストのケースと参照画像 |
| `dist/`, `library.js` | **コミットされたビルド成果物**（npm 配布用 / CDN 版 Pixi を使う単一ファイル版） |

## 新コンパイラ（`src/compiler/`）

旧トランスパイラを置き換えたコンパイラ（P1）。構文解析 → AST → 前処理 → 型検査 → コード生成。`SketchManager.transpileSketch()` が使い、Node のテスト（`npm run test:lang`）でも同じものを実行している。

```
タブごとの { name, text }
   │  compileSketch()  src/compiler/index.ts（= analyzeSketch() + generate()）
   │  parseSketch()  parse.ts
   ├─ SketchSource（source.ts）: タブごとに通し番号の範囲を割り当てる
   ├─ タブごとに Lezer で解析（grammar/parser.ts）
   ├─ syntaxErrors()（syntax-errors.ts）: 構文エラーを複数件、メッセージ付きで
   └─ buildFile()（cst-to-ast.ts）: CST → 型付き AST（ast.ts）
   │  checkSketch()  check.ts（構文エラーが無いときだけ）
   ├─ buildSketch()（sketch.ts）: Processing の前処理。スケッチクラス（extends PApplet）の ClassDecl を合成
   ├─ Library（library.ts）: api/library.gen.ts のクラスとシグネチャ（必要になったクラスだけ展開）
   └─ Checker: クラスの登録 → ヘッダ解決 → メンバー登録 → 本体の検査（flow.ts / definite.ts）
   │  generate()  codegen.ts（エラーが無いときだけ）
   ├─ Gen: 型付き AST → JS。静的型で JS の形が変わるライブラリ呼び出しは intrinsics.ts
   └─ SourceMapBuilder（sourcemap.ts）: 文ごとの対応表
   ▼
{ code（new Function("$rt", "__renderer__", code) の本体）, map（Source Map v3）, diagnostics }
```

| ファイル | 内容 |
|---|---|
| `ast.ts` | AST のノード型（`kind` で判別するプレーンなオブジェクト）、`forEachChild` / `walk`、デバッグ表示 `printAst` |
| `source.ts` | 位置の管理。各ノードは `start`/`end` だけを持ち、値はタブごとに割り当てた範囲（`base + タブ内オフセット`）の通し番号。`SketchSource.locate(pos)` でタブ・行・列（1 始まり）に戻す。ノードをタブをまたいで移しても位置を失わない |
| `cst-to-ast.ts` | CST → AST。括弧は木の構造に吸収して捨てる。`color` 型は `PrimitiveType int`（`color: true`）、`#RRGGBB` は ARGB の `IntLiteral` にする。Lezer 文法が Java より緩い所（ブロック内の `import`、ローカル変数の `static` 等の修飾子、文にならない式、配列生成の形、リテラルの範囲、コンストラクタ名）をここでエラーにする |
| `syntax-errors.ts` | 構文エラーのメッセージ。字句の走査で未終端の文字列/コメントと括弧の対応を調べ、閉じられていない `{` は字下げから推定する。それより前の Lezer のエラーノードは「改行の前で式が終わっている → `Missing ';'`」「`for` の見出し → `Missing ';' in the 'for' header`」などの規則でメッセージにする。1 行に 1 件まで |
| `literals.ts` | リテラルの解釈（整数の範囲と 16/8/2 進の 32/64 ビット折り返し、浮動小数の接尾辞、エスケープ、`#RRGGBB`、テキストブロック） |
| `diagnostics.ts` | 診断の型（`code`・`message`・位置）と整形（`Tab.pde:行:列: error: ...`） |
| `sketch.ts` | Processing の前処理に当たる部分（本物の `Processing cli --build` の出力と照合）。トップレベルにメソッドがあればアクティブモード（変数→フィールド、メソッド・クラス→メンバー）、無ければ静的モード（全文を `public void setup()` に入れ末尾に `noLoop()`）。トップレベルが型宣言だけで `public static void main` があれば Java モード（書いたとおりのクラスを使う）。インタフェース以外の全クラスのアクセス修飾子の無いメソッドを `public` にする。`setup()` の本体に直接書かれた `size()`/`fullScreen()`/`pixelDensity()`/`noSmooth()`/`smooth()` を生成した `settings()` に移す（規則は ROADMAP P1-6）。混在モードはエラー |
| `types.ts` | 型（プリミティブ / クラス + 型引数 / 配列 / 型変数 / ワイルドカード / null / エラー）とシンボル（`ClassSymbol`・フィールド・メソッド・ローカル変数）、置換・消去・`asSuper` |
| `typesystem.ts` | 型の関係: 部分型（型引数の包含）、代入・メソッド呼び出し（strict/loose）・キャストの各変換、数値昇格、ボクシング |
| `library.ts` / `api/library.gen.ts` | ライブラリのクラス（Processing core と JDK の一部 216 クラス）。JVM のジェネリックシグネチャ形式の文字列から、使われたクラスだけをメンバーまで展開する。モデル外の型を使うメソッドは除外し、名前だけ残して「processing-ts では使えない」と報告する |
| `check.ts` | 型検査器。名前解決（ローカル → 囲むクラスとその親 → static import、型はさらに import と既定の import）、式の型付け（Processing では接尾辞なしの小数は float）、定数畳み込み（`constants.ts`）、オーバーロード解決（strict → loose → 可変長、最も特定的なもの）、ジェネリックメソッドの型引数の推論（単一化）、ラムダ・メソッド参照、検査例外、上書きの規則、static 文脈、抽象メソッドの実装漏れ。結果を AST に書き込む（`ty`・`constant`・`sym`・`method`・`implicitThis` など） |
| `flow.ts` / `definite.ts` | 到達可能性（`Unreachable code`・戻り値の欠落）と未初期化変数（JLS 16 章、条件の真偽ごとの状態を追う） |
| `api/processing-core.json` | 本物の core jar（4.5.2）をリフレクションして得た public API の一覧（35 クラス）。カバレッジ計測（`npm run coverage`）用。`npm run gen:manifest` で `library.gen.ts` と一緒に再生成する |
| `codegen.ts` | コード生成。静的型を使って Java の意味を保つ: int の演算は `\|0` と `Math.imul`、float は演算ごとに `Math.fround`（Processing で `0.1` を 10 回足すと `1.0000001`）、long は number と専用ヘルパ、キャストは飽和、複合代入は暗黙の縮小、char は数値、文字列連結と表示は Java の書式（`Float.toString` など）。ボクシングは Character/Float/Double だけ実体を作り（`JChar`/`JFloat`/`JDouble`）、Integer/Long/Boolean は JS の値のまま。オーバーロードしたユーザーメソッドは名前修飾（`move$F`）、コンストラクタは `$init...` メソッド。配列の添字は既定で境界チェック（`$ck`） |
| `intrinsics.ts` | 静的型で JS の形が変わるライブラリ呼び出し: print/println（float は `1.0`）、String のメソッド（文字列は JS の string）、ボックスのメソッド、Math と PApplet の数学関数（float の結果）、`StringBuilder.append(char)` と `append(int)` の区別、`List.remove(int)` → `removeAt` など。それ以外はランタイムのオブジェクトをそのまま呼ぶ |
| `sourcemap.ts` | Source Map v3 の組み立て（VLQ）。`sources` はタブ名、`sourcesContent` はタブの内容 |

AST 構築時に Lezer 文法の解析結果を Java（Processing）の意味に合わせて組み直している所:

- 二項演算の連鎖は一度平坦化して Java の優先順位で組み直す。文法では `==`/`!=` と `<`/`>`、`instanceof` が同じ優先順位なので `f == a < b` や `a + b instanceof C` がずれるため。
- `(N) - 1`（N は大文字始まりの名前）は文法上は `-1` のキャストになるが、Java では参照型へのキャストの後に単項 +/- は来ないので減算に戻す。逆に `(color) -1` は文法上は減算になるが、Processing では int へのキャストなのでキャストに戻す。
- テキストブロックは Java の規則（共通の字下げの除去）ではなく、Processing 4.5.2 の実際の値（開始行の次の行からの生の内容に先頭の改行を付けたもの）にする。

### 生成コードの形

```js
// int count = 0; ArrayList<Ball> balls = ...;
// void draw() { for (Ball b : balls) b.move(0.5); count += 2.5; println("count=" + count); }
// class Ball { float x; Ball(float x) {...} void move(float d) { x += d; } void move(int d) { x += d * 2; } }
"use strict";
const $L = $rt.lang, $S = $L.S, $M = Math, $f = Math.fround, $imul = Math.imul;  // ヘルパは関数自身のスコープに束縛
const { JObject: $JObject, d2i: $d2i, println: $println } = $L;                  // （ユーザーの Math クラス等に隠されない）
const $ArrayList = $rt.classes["java.util.ArrayList"];
{
  let count = 0;             // スケッチのフィールドはブロックスコープの変数、メソッドは関数
  let balls = null;
  function draw() {
    for ($t1 = balls.iterator(); $t1.hasNext();) {
      let b = $t1.next();
      b.move$F(0.5);         // オーバーロードはコンパイル時に解決して名前修飾
    }
    count = $d2i($f($f(count) + 2.5));   // int += float: float で計算して int に縮小
    $println("count=" + count);
    var $t1;
  }
  class Ball extends $JObject {
    constructor($o) { super(); this.x = 0; }               // フィールドの既定値
    $init(x) { super.$init(); this.x = x; return this; }   // Java のコンストラクタ
    move$F(d) { this.x = $f(this.x + d); }
    move$I(d) { this.x = $f(this.x + $f($imul(d, 2))); }
  }
  Ball.$javaName = "Sketch$Ball";
  class $Sketch extends $rt.PApplet {         // ランタイムが呼ぶメソッドだけを上書き
    draw(...a) { return draw(...a); }
  }
  const $p = new $Sketch(__renderer__);
  count = 0;                                  // フィールドの初期化子（宣言順）
  balls = new $ArrayList();
  return $p;
}
```

## 言語ランタイム（`src/runtime/lang/`）

生成コードは `$rt.lang`（`lang`）のヘルパと `$rt.classes`（`javaClasses` + Processing のクラス）だけを使う。`$rt.classes` に無いクラスは `$L.missingClass` に置き換わり、使った時点で UnsupportedOperationException になる。ライブラリのクラスはスケッチのクラスから継承できる（`index.ts` が `$init` を付ける）ので、ランタイムのクラスの内部メンバーは `$` で始める（継承した側の名前と衝突させない）。DOM 非依存で、`npm run test:lang` では描画しないスタブの PApplet と組み合わせて Node で動かしている。

| ファイル | 内容 |
|---|---|
| `numbers.ts` | int/long の演算（`idiv` は 0 除算で ArithmeticException、long は number で 2^53 まで正確）、飽和キャスト（`d2i`/`d2l`）、`Float.toString`/`Double.toString`（JDK 17 の桁の選び方を再現）、`Long.toString` |
| `boxes.ts` | ボックス `JFloat`/`JDouble`/`JChar`。`valueOf()` が中身の数値を返すので、数値を期待するランタイム側のコードにそのまま渡せる。`Character.valueOf` の 0〜127 は Java と同じくキャッシュ |
| `strings.ts` | String のメソッド（Java の `split`・`replaceAll` の正規表現、`compareTo`、`hashCode`）、`String.valueOf`、`String.format`、数値の parse |
| `exceptions.ts` | Throwable の階層（`NullPointerException` 等）。JS の `TypeError` などは `toJava()` で Java の例外に読み替えて `catch` に渡す |
| `objects.ts` | `JObject`（equals/hashCode/toString/getClass）、インタフェース（`Iface`: 既定メソッドとラムダの原型）、`isInstance`/`cast`、enum |
| `arrays.ts` | 型付き配列の生成（`int[]` → Int32Array など、多次元）、境界チェック `ck`、`clone` |
| `print.ts` | 出力先（`setOutput`）と print/println/printArray の書式 |
| `misc.ts` | 実行時の型でしか決まらない操作（`jequals`/`jhash`/`jcompare`）、Processing の変換関数（`int()`・`nf()`・`hex()` 等）、System |
| `jlang.ts` / `functional.ts` | Integer/Float/Character… の static メソッドと StringBuilder、Comparator と java.util.function |
| `collections.ts` | java.util のインタフェースの登録（`instanceof List` など）、AbstractCollection/AbstractList、ArrayList/LinkedList/ArrayDeque/Vector/Stack/PriorityQueue/CopyOnWriteArrayList、ビュー（subList・unmodifiableList・Arrays.asList）。反復子は Java と同じ時点で ConcurrentModificationException |
| `maps.ts` | AbstractMap（Map の既定メソッドとビュー）、HashMap（Java の表の大きさと列挙順を再現）/LinkedHashMap/TreeMap、HashSet/LinkedHashSet/TreeSet |
| `util.ts` | Collections、Arrays、Objects、Random（Javadoc の線形合同法）、StringJoiner、StringTokenizer、List/Set/Map の static ファクトリ |

制約: `src/compiler/`・`src/runtime/` と `tools/` は Node の型除去でそのまま実行されるため、`enum`・`namespace`・コンストラクタ引数のプロパティ宣言など JS に変換が必要な TS 構文を使わない。型チェックは DOM を含まない `src/compiler/tsconfig.json` と `src/runtime/tsconfig.json` で行う（`npm run typecheck`）。

## 旧トランスパイラ（`src/lib/transpiler/`、使用していない）

ANTLR4 の Processing 文法（`antlr/Processing.g4`、生成物 `antlr/parser/`）→ MemberAnalyzer → ReferenceSolver → Converter で、型を見ずに文字列変換していた。整数除算・キャスト・char・オーバーロード・静的モードなどが Java と違っていた（STATUS.md の旧 T 番号）。現在は `npm run test:grammar`（新しい Lezer 文法との受理/拒否の比較）と `npm run bench` の parse の比較対象としてだけ使う。

## ランタイムの詳細

### 実行ループ（`DefaultRunner`）

- `init()`: `new Function("$rt", "__renderer__", code)` でスケッチを生成 → `settings()` → `setup()` → `loop()`。`$rt.classes` は `javaClasses`（src/runtime/lang）と Processing のクラス（`processing.core.PVector` など）、`addDependency()` で足したクラス。
- フレームは requestAnimationFrame のループで、`frameRate()` の間隔ごとに `step()` を呼ぶ（表示より高いフレームレートでは 1 回のコールバックで最大 4 フレームまで追いつく）。`frameRate` 変数はフレーム時間の指数移動平均の逆数。
- `step()`: 1 フレーム分（draw + イベント処理）を実行する。`SketchSettings.manual_step: true` のときはループを自動開始せず、`SketchManager.step(n)` で進める（視覚テスト用）。
- `frameCount` は setup 中 0、最初の draw() で 1（Processing と同じ）。
- イベント: DOM イベントを Processing の `MouseEvent`/`KeyEvent`（action・修飾キー・ボタン・回数つき）にしてキューに積み、**draw の後・フレームの終わりの前**に `PApplet.__handle_event__()` で処理する（Processing の dequeueEvents と同じ位置なので、ハンドラ内の描画は draw の行列のまま同じフレームに乗る）。規則は本物で確認したもの（ケース events_mouse/events_key/events_escape）:
  - マウス: ボタンを押したままの移動は DRAG（ボタンは左 → 中 → 右の順）、押してから動かずに離すと RELEASE の後に CLICK。`mouseButton` はホイールや移動も含むすべてのイベントで更新され、離した後も残る。`pmouseX/Y` はハンドラ内では直前のイベントの位置、draw() 内では前回の draw() 時の位置（最初のマウスイベントでは両方とも現在位置）。座標は整数。ホイールの `getCount()` はノッチ数（Chromium の 100px = 1、端数は蓄積）。
  - キー: `key` は文字コード（矢印などは CODED、Enter は 10、Ctrl+英字は制御文字 1〜26 = Windows の AWT）、`keyCode` は Java の VK コード（記号キーは DOM の値から変換）。文字の出るキーは PRESS の後に TYPE を積み、keyTyped() 中の `keyCode` は 0。`keyPressed` は押されているキーが 1 つでも残っていれば true。Esc は keyPressed() で `key` を変えない限り `exit()`。
  - コンパイラは `mousePressed()` と `mousePressed(MouseEvent)` のようなオーバーロードを別名の関数にし、`$Sketch` の `_mousePressed` にはイベントを受け取る方を割り当てる（Processing の既定の実装が引数なし版を呼ぶのと同じ結果）。
  - `focused`・focusGained/focusLost は window の focus/blur、`cursor()`/`noCursor()` は canvas の CSS カーソル。
- 出力: 生成コードの print/println は `lang` の出力先（`Runner.write_output`）に文字列で届き、改行ごとに log listener へ 1 行ずつ渡す（改行の無い残りは `SketchManager.flushOutput()`）。
- 例外: setup/draw から抜けた例外は `lang.toJava()` で Java の例外に読み替えて "java.lang.NullPointerException: ..." の形で error listener へ送り、Processing と同じくスケッチを止める。

### 描画（`PGraphics` + `PGraphicsJava2D`）

- size の流れ: settings() の size()/fullScreen()/pixelDensity()/noSmooth() は要求を記録するだけ。runner が settings() の後に `__init_surface__()` を呼び、キャンバスを確保する（size() が無ければ 100x100、密度は `displayDensity()` = HiDPI で 2、既定の背景 204）。それ以降の size() は同じ大きさなら何もせず、違えば `IllegalStateException`（Processing と同じ）。
- `PGraphics` は図形をフラットなパス（`enumPath`: MOVE/LINE/QUAD/CUBIC/ELLIPSE/CLOSE）にしてレンダラの `drawPath(path, fill, stroke)` に渡す。レンダラが実装するフックは drawPath/drawPoint/backgroundImpl/backgroundImage/drawImage/drawTextLine/textWidthImpl/textAscentImpl/textDescentImpl/applyMatrixToRenderer/applyBlendMode。
- `PGraphicsJava2D` は即時描画（キャンバスが内容を保持するので background を呼ばなければ残る）。行列は `setTransform`（密度を掛ける）、blendMode は `globalCompositeOperation`、tint は乗算したコピーをキャッシュ。メイン画面の background は alpha を無視する。
- **ストローク正規化**: Java2D の既定（STROKE_NORMALIZE）を再現し、線の端点をデバイス座標で `floor(x)+0.5` に寄せる（制御点は隣の端点と一緒に動かし、楕円は 3 次ベジェに分割）。塗りは正規化しない。本物で確認した規則（`normalizedStrokePath`）。
- `createGraphics()` は密度 1 の `PGraphicsJava2D`（透明で始まる）。
- 色は ARGB の int。色の int は Processing と同じ ARGB（`#RRGGBB` は `0xFFRRGGBB`）。fill(x) などの 1 引数は、アルファのビットが無く範囲内なら灰色、それ以外は ARGB。メインの画面は灰色（204）で始まる。
- P2D/P3D、シェーダー、ライト、カメラは未実装（`size(w,h,P3D)` の第 3 引数は無視）。

### ファイル（`SketchFiles`）

- Processing のファイル関数は同期なので、使うファイルを **setup() の前にまとめて fetch** する（`DefaultRunner.init`）: コンパイラが見つけた定数のファイル名（`CompileResult.files`。loadImage/loadStrings/loadBytes/loadJSON*/loadTable/loadXML/loadFont/loadShape/loadShader/createInput/createReader の String 引数）、ホストの一覧（`SketchData.files`・sketch.properties の `resources`）、ホストがメモリで渡したファイル（`SketchManager.addFile()`）。画像は `createImageBitmap`（色変換と premultiply なし）でデコードまで済ませ、loadImage はそこから同期で PImage を作る（JPEG は RGB、他は半透明の画素があれば ARGB）。
- 名前の解決は Processing と同じ: URL はそのまま、それ以外は `<base_uri>data/<name>` → `<base_uri><name>`。見つからなければ `The file "x" is missing or inaccessible, …` を標準エラー（`lang.printError`）に出して null。開発サーバの index.html へのフォールバック（text/html）は見つからない扱い。
- すべて fetch なので Service Worker でキャッシュでき、オフラインでも動く（`vt run --offline`）。
- 保存（saveStrings/saveBytes/saveJSON*/save/saveFrame）はスケッチフォルダ相対の名前でメモリに置き（同じ実行中に読み戻せる。画像は保存時の画素を控える）、`SketchManager.addEventListener("save", ...)` に `{path, data, mime}` を渡す。PNG/JPEG はキャンバスでエンコード（非同期）、TIFF/TGA は `io/imageEncode.ts`。requestImage は実行時に fetch する（読み込み中は width 0、失敗で -1）。

## ビルドと配布

- `npm run build` = `vite build`（ライブラリモード, `src/lib/index.ts`）+ `tsc`（型定義のみ `dist/types`）。
- `vite-plugin-externalize-deps` で依存（@lezer/common・@lezer/lr）を外部化。ライブラリ（gzip 155 KiB、`npm run size`）は新コンパイラ（約 119 KiB。うちライブラリモデル 36 KiB、Lezer 30 KiB）とランタイム（2D + 言語ランタイムで約 36 KiB）を含む。EVALUATION.md の目標構成ではコンパイラを別のサブパスにする。
- 既定フォントは `src/lib/runtime/fonts/` を独自プラグイン（`copy-fonts`）が `dist/fonts/` にライセンス文ごとコピーし、`PFont.ts` が実行時に `new URL("./fonts/…", import.meta.url)` で読む（URL を文字列リテラルで書くと Vite のライブラリモードが base64 で埋め込み、gzip で +170 KiB になるので、わざと連結にしている）。
- 独自プラグイン（`single-file-library`）が `dist/index.js` を esbuild で依存ごと 1 ファイルにまとめて `dist/library.js` を生成する（バンドラなしで `import` できる形。既定フォントは同じく `fonts/` から読む）。ルートの `library.js` はそのコピーで README からダウンロードさせている（コミット済みのものは P2-1 以前の Pixi 版。次のリリースで置き換える）。
- dev サーバ（`npm run dev`, port 8080, base `/processing-ts/`）起動時に `public/samples/*/*/sketch.properties` から `src/scripts/samples.json` を生成（カテゴリ/名前順）。ライブラリのビルドでは `public/` を出力に含めない（`copyPublicDir: false`）。
