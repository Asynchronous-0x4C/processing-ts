# 技術選定の検討（構文解析・コード生成・実行・描画）

2026-10-04 作成。数値は実測（[research/2026-10-measurements/RESULTS.md](research/2026-10-measurements/RESULTS.md)、Node v25 / esbuild でのバンドル、ブラウザはヘッドレス Chromium）と調査（[research/processing-2026-10.md](research/processing-2026-10.md)）に基づく。「見積もり」と書いたものは未実装のため推定値。

## 0. 結論

> **決定（2026-10-04）**: 下記の「推奨構成」を採用する（ユーザー承認済み）。以降の実装は ROADMAP.md に沿って進める。

### 前提（ユーザーの方針）

- 優先度: **変換と実行の速さ（バンドルサイズ含む）** と **P2D/P3D・PShader**。
- PWA: Service Worker 経由で読めれば十分 → **同期 XHR をやめ fetch ベースにする**。
- 配布: **ブラウザ内変換（エディタ用）と事前変換（AOT、埋め込み用）の両方**を提供する。
- 既存コードの大幅な作り直しは可。

### 推奨構成

| 領域 | 推奨 | 主な理由 |
|---|---|---|
| 構文解析（当面） | 現行 ANTLR を **SLL 予測モード + LL フォールバック**に変更 | 1 行の変更で同一の構文木のまま 16〜270 倍速（5,000 行: 8.0 秒 → 29ms） |
| 構文解析（新コンパイラ） | **@lezer/java をフォークした Processing 文法**（Lezer）。不成立なら手書き再帰下降 | 32 KiB gz・コールド 8ms・木の走査が最速・エラー回復と差分解析あり・CodeMirror 6 と共用可。現行文法の GPL 問題も解消 |
| 意味解析 | **自作の型検査器**（Processing core API のシグネチャは本物の core jar から生成） | 整数除算・キャスト・char・オーバーロード・float 表示を正しく出すには静的型が必須。代替ライブラリは無い |
| コード生成 | 自作のエミッタ（ES2020 + ソースマップ）。オーバーロードはコンパイル時に解決 | 実行時の引数判定をなくして速く・正しくする |
| 実行時 I/O | **fetch による事前読み込み + メモリ上の仮想ファイルシステム（VFS）** | load* を同期 API のまま保てる。Service Worker でキャッシュ可能。画像も setup 前にデコード済みにできる |
| JAVA2D（既定） | **Canvas 2D API**（ブラウザ標準、0 KiB） | 即時モードで Processing と同じ描画モデル。線端・結合・パス・テキスト・合成がほぼ 1 対 1 で対応 |
| P2D / P3D / PShader | **自作 WebGL2 レンダラ**（Processing の OpenGL レンダラと同じ属性名・uniform 名・シェーダー種別） | Processing 用 GLSL をそのまま動かせる唯一の方法。サイズ見積もり +20〜30 KiB gz（動的 import） |
| テッセレーション | **libtess**（6.3 KiB gz） | Processing の P2D/P3D と同系統（GLU tessellator）で、自己交差・穴・巻き方向規則まで一致させやすい |
| 行列 | 自作 PMatrix2D/3D | Processing の API クラスとして必要。gl-matrix（6.9 KiB gz）は不要 |
| PixiJS | **廃止** | 141〜161 KiB gz。保持モードのシーングラフを即時モードとして使うためのコストが大きく、3D と Processing 互換シェーダーが無い |
| エディタ（デモ） | CodeMirror 6 + Lezer の Processing 文法（デモ側の依存。ライブラリには含めない） | 構文解析器を共用でき、ハイライト・折りたたみ・エラー表示がそのまま得られる |
| WASM | 変換の高速化には **使わない** | 解析は JS で 1ms 級になるので、wasm のダウンロード・初期化・境界コストの方が大きい |

### 目標とする構成（パッケージ内のサブパス export）

```
processing-ts/compiler   .pde → JS（解析・型検査・生成・ソースマップ）。DOM 非依存で Node / Worker / ブラウザで動く
processing-ts/runtime    PApplet API・Canvas2D レンダラ（JAVA2D）・VFS・数学/乱数/ノイズ・データクラス
processing-ts/webgl      P2D/P3D レンダラ + PShader（size(..., P2D|P3D) のときだけ動的 import）
processing-ts/vite       Vite プラグイン（AOT）。CLI: `processing-ts build <sketchDir>`
SketchManager            既存の公開 API は互換レイヤとして維持（compiler + runtime を束ねる）
```

### バンドルサイズの見込み（gzip）

| 構成 | 現在（実測） | 推奨構成（見積もり） |
|---|---:|---:|
| 2D スケッチを埋め込む（AOT、パーサ不要） | 約 244 KiB（ライブラリ 103 + pixi 141） | **40〜50 KiB** |
| 3D / シェーダーを使うスケッチ（AOT） | 3D 非対応 | 60〜80 KiB |
| ブラウザ内で変換して実行（エディタ） | 約 244 KiB | 100〜120 KiB |

## 1. 対象とする Processing

- 最新の安定版は **4.5.7（2026-09-24）**。ローカルは 4.5.2。4.4〜4.5 系の変更はビルド基盤と UI が中心で、描画 API の追加はほぼ無い（4.5.6 で実験的な WebGPU バックエンドが入ったが既定では無効）。
- 4.4.8 以降、公式プリプロセッサの文法は「Java 17 に更新された grammars-v4 の Java 文法」+ Processing 拡張。**本リポジトリの `Processing.g4`/`JavaParser.g4` は古い Java 8 時代のコピー**。
- ただし本家のコンパイラは **ECJ を `-source 11` で実行**しているので、実際に動くのは Java 11 相当の構文: `var`、ラムダ、メソッド参照、ジェネリクス、try-with-resources、マルチキャッチ、文字列 switch、enum、default メソッド、static ネストクラス。スイッチ式・record・パターン instanceof・sealed は構文解析は通るがコンパイルエラーになる。テキストブロックはインデントを残したままの通常文字列に変換される。
- プリプロセッサが行う変換（トランスパイラも同じことをする必要がある）:
  - **小数リテラルすべてに `f` を付ける**（`double d = 1.0/3` も float 演算になる）
  - `color` → `int`、`#FF8800` → `0xFFFF8800`、`int(x)` → `PApplet.parseInt(x)`
  - アクセス修飾子の無いメソッドに `public` を付ける
  - `size()`/`smooth()`/`pixelDensity()` を生成した `settings()` に移す
  - 静的モードは `setup()` で包んで `noLoop()`。モードは静的 / アクティブ / Java クラスの 3 種
- API の規模（processing.org のリファレンス）: **関数 273**、クラス 24、変数/定数 24、キーワード/演算子 70。実際の `PApplet` の public メソッドは 316 名（716 オーバーロード）。
- 公式の Java スケッチを Web に書き出す手段は無い。Processing Foundation は Rust + WebGPU の libprocessing（wasm 版あり）を進めているが、.pde をブラウザで動かす製品は無い。Processing.js は 2018 年にアーカイブ済み（対象は Processing 1.x 相当）。**同じ目的の現役プロジェクトは見当たらない**。
- 同梱 examples は 254 本（P3D 63、P2D 31、シェーダー 18）。`C:/Program Files/Processing/app/resources/modes/java/examples`。互換性テストの母集団に使える。

## 2. 構文解析

### 実測（Node v25。199 行 = 同梱サンプル SimpleShooterGame.pde、5k 行 = 生成した Java 8 コード）

| パーサ | gzip | 199 行 コールド | 199 行 ウォーム | class で包んだ 199 行 ウォーム | 5k 行 ウォーム | 5k 行 木の全走査 | Processing 構文 |
|---|---:|---:|---:|---:|---:|---:|---|
| ANTLR（現行: LL） | 69 KiB | 207ms | 16.5ms | **277ms** | **7,956ms** | 5.0ms | ◎（公式文法） |
| ANTLR（SLL） | 69 KiB | 186ms | 1.0ms | 1.1ms | 29ms | 3.3ms | ◎ |
| tree-sitter + java | 152 KiB（wasm 2 本含む） | 6.1ms（初期化 12ms 別） | 0.9ms | 0.7ms | 18ms | 8.3ms | ✕ `#hex`、`int(` |
| @lezer/java | 32 KiB | 8.0ms | 1.2ms | 1.2ms | 27ms | **0.9ms** | ✕ `#hex`、`int(`、トップレベルのメソッド、default メソッド |
| java-parser（Chevrotain） | 64 KiB | 27ms（import に 300〜450ms） | 2.7ms | 2.9ms | 84ms | 12ms | △ `#hex` 不可。エラー回復なし |

ブラウザ（ヘッドレス Chromium、ページごとにコールド）での現行トランスパイル全体: 20〜50 行で 35〜90ms、199 行で 190〜250ms。SLL に切り替える試験では 40ms / 176ms 程度だった（コールド時は ANTLR の予測キャッシュ構築と JIT ウォームアップが支配的）。

### 評価

- **ANTLR（現行）**: 遅さの主因は ANTLR 自体ではなく「エントリ規則 `processingSketch` の選択肢が入力末尾まで区別できない」ことと既定の LL 予測モード。**SLL では 3 入力とも同一の構文木**になった。SLL で解析し、構文エラー時だけ LL で再解析する定石で即座に改善できる（ROADMAP P0）。残る課題はコールド時の 40〜180ms、69 KiB、文法が古い（Java 8 時代）こと、そして **ライセンス**（後述）。
- **tree-sitter**: コールドの解析は最速だが、ダウンロードが最大（152 KiB gz）で wasm の非同期初期化が要る。JS から木を走査すると 1 ノードごとに wasm 境界を越えるため、トランスパイラのように全ノードを見る用途では Lezer より遅い。Processing 文法は存在しない（`vaishnn/tree-sitter-processing` は LICENSE だけ）ので文法のフォークと wasm ビルド環境が必要。エラーは ERROR ノードのみで「何が期待されたか」は出ない。最新 Java の受理範囲は最も広いが、本家が Java 11 でコンパイルするので利点にならない。**主パーサには不採用**。
- **Lezer**: 小さく、速く、木の走査が最速。差分（インクリメンタル）解析とエラー回復を持ち、CodeMirror 6 の言語サポートとしてそのまま使える。足りないのはトップレベルのメソッド/フィールド、`#hex`、`int(` 等、default メソッドで、いずれも文法フォーク（lezer-generator）で追加できる規模。Lezer の木はトークン位置とノード種別だけを持つので、型検査用の AST はこちらで組み立てる（線形時間の 1 パス）。**推奨**。
- **java-parser**: import だけで 300ms 以上かかり、最初のエラーで止まる（部分木なし）。エディタでの逐次チェックに向かない。**不採用**。
- **手書きの再帰下降パーサ（TypeScript）**: 見積もり 15〜25 KiB gz、テーブル不要でコールドも速い。Processing 初心者向けの分かりやすいエラーメッセージ（「セミコロンが足りない」など）を最も作り込みやすい。工数とキャスト/ジェネリクスの曖昧さ処理の手間が欠点。Lezer フォークが受理範囲の点で成立しなかった場合の **代替案**。
- どの案でも、**公式文法の ANTLR パーサを開発時専用の「オラクル」として残し**、同梱 examples 254 本とテストケースで受理/拒否が一致するかを CI で比較する（配布物には含めない）。

### ライセンス上の注意（要判断）

`src/lib/transpiler/antlr/JavaParser.g4` の先頭には「Part of the Processing project … GNU General Public License version 2」と書かれている（grammars-v4 由来部分は BSD）。processing4 では PDE/モード側が GPL-2.0、core が LGPL-2.1 とされている。**GPL の文法から生成したパーサを MIT ライブラリに同梱して配布することには懸念がある**（法的助言ではない）。Lezer 版（@lezer/java は MIT）＋自作の Processing 拡張に置き換えればこの懸念は無くなる。上記の「開発時専用オラクル」は配布しないので問題になりにくい。

## 3. 意味解析とコード生成

使えるライブラリは無く、自作が前提。現行の「型を見ずに文字列変換」では Java の意味論が再現できない（STATUS.md T3〜T9）。

### 設計

1. **Processing API マニフェスト**: 本物の `core-4.5.2.jar` をリフレクションで走査し、PApplet/PGraphics/PImage/PVector/PShape/… の public メソッドとフィールドのシグネチャを JSON 化する（Processing 同梱の JDK `app/resources/jdk` で実行できる）。型検査・オーバーロード解決・未実装 API の一覧化・カバレッジ計測に使う。現行のように変換時に `new PApplet()` を作る必要がなくなり、コンパイラが DOM 非依存になる。
2. **シンボル表と型検査**: スケッチ = PApplet のサブクラス、ユーザークラス = 内部クラス（外側のフィールドに暗黙アクセス）、static ネストクラス、インタフェース、enum、ジェネリクスは消去後の型で扱う。数値昇格（int/long/float/double/char）、文字列連結、ボクシング（最小限）、配列型。
3. **オーバーロード解決をコンパイル時に行う**: Java の段階（完全一致 → 拡大変換 → ボクシング → 可変長）を簡略化して実装し、名前修飾した関数（例: `describe$I`, `describe$F`）を呼ぶ。実行時の引数判定（現行 Converter）は廃止。
4. **コード生成の主な規則**

| Java / Processing | 生成する JS | 備考 |
|---|---|---|
| int の `/` `%` | `(a/b)\|0`、`a%b` | 0 除算は ArithmeticException 相当を投げる（デバッグ時） |
| int の `+ - *` | `(a+b)\|0`、`Math.imul(a,b)` | 32bit の桁あふれを再現 |
| `(int)x`（float→int） | ヘルパ（NaN→0、範囲外は飽和、0 方向切り捨て） | Processing.js の `0\|x` は飽和しない |
| `x += 0.7`（x は int） | `x = (x + 0.7)\|0` | 複合代入の暗黙キャスト |
| char | 数値（UTF-16）。文字列連結・println では文字に変換 | `'a'+1` = 98、`"x"+c` = "xa" |
| float | 演算は double のまま。**表示（println/str/文字列連結）は float32 の最短表現** | `0.1f+0.2f` → "0.3"、`1.0` → "1.0" |
| long | number（2^53 まで正確）。64bit の桁あふれはオプション（BigInt） | 実際のスケッチで問題になることは稀 |
| `int[]`/`float[]`/`char[]`/`byte[]` | `Int32Array`/`Float32Array`/`Uint16Array`/`Int8Array` | 代入時の型変換が自動で Java と一致し、速い |
| オブジェクト配列 | `Array`（null で初期化） | |
| String のメソッド | 静的型に応じて直接展開（`equals`→`===`、`replace`→全置換、`charAt`→`charCodeAt`） | String.prototype は汚さない |
| typed catch | `catch(e){ if(e instanceof X){…} else throw e }` | |
| 配列の範囲外 | デバッグビルドのみ境界チェック（ArrayIndexOutOfBoundsException 相当） | Processing 利用者はエラーで気付くことに慣れている |
| JS の予約語と衝突する識別子 | 自動でリネーム | |
| Java 標準ライブラリ | よく使う部分だけ用意（ArrayList, HashMap, HashSet, LinkedList, Collections, Arrays, StringBuilder, Integer/Float.parse*, Math, Iterator, Map.Entry 等） | |

5. **出力**: ES2020 のモジュール 1 本 + Source Map v3（タブ名と行に対応付け）。実行時エラーを `.pde` の位置で報告できる。グローバル（スケッチのフィールド/関数）を関数スコープの変数として持つ現行方式は、内部クラスからのアクセスが速く単純なので維持する。
6. **エラー**: 構文エラー・意味エラーを複数件、タブ名と行・列つきで返す（エディタでの逐次表示に使う）。

## 4. 実行モデルと I/O（PWA 対応）

| 方式 | 評価 |
|---|---|
| 同期 XHR（現行） | メインスレッドでは非推奨。Service Worker・オフライン配信と相性が悪い。**廃止** |
| **fetch で事前読み込み → メモリ上の VFS**（推奨） | setup 前に `data/` のファイルを並列に fetch し、画像は `createImageBitmap` でデコードまで済ませる。load* は VFS から同期で返せるので Processing の同期 API と意味が一致し、`img.width` も即座に正しい。fetch なので Service Worker のキャッシュが効く |
| 非同期化変換（呼び出しグラフ全体に async/await を伝播） | 実行時に決まるパスへの対応としては有効だが、async 関数は遅く、仮想呼び出しで全体が async に染まりやすい。**当面は採用しない**（`requestImage()` 等の非同期 API は別途提供） |
| Worker + SharedArrayBuffer + Atomics.wait による同期 fetch | COOP/COEP ヘッダが必要で GitHub Pages 等では使えない。将来の Worker 実行モードの選択肢 |

事前読み込みする対象の決め方:

1. AOT ビルド: `data/` フォルダを列挙してマニフェストを生成（全自動）。
2. ブラウザ内変換: コンパイラが load* 系に渡された文字列リテラルを抽出 + `sketch.properties` の `resources` + エディタでアップロードされたファイル。
3. 実行時に未読み込みのパスが要求されたら、分かりやすいエラー（どのファイルを `resources` に足せばよいか）を出す。

保存系（`saveStrings`/`saveJSON*`/`saveFrame`/`save`）は VFS + IndexedDB に保存し、必要ならダウンロードさせる。`selectInput()` 等はファイルピッカーで実装（コールバック型なので非同期でも意味が合う）。

## 5. 描画

### 候補（gzip サイズは実測）

| 候補 | gzip | 長所 | 短所 | 判定 |
|---|---:|---|---|---|
| PixiJS v8（現行） | 141〜161 KiB（使用部分）/ 260 KiB（全体） | WebGL/WebGPU、バッチ処理 | 保持モード前提。毎フレーム Graphics を作り直し、`text()`/`image()` のたびに render。3D なし。シェーダー規約が独自。分割しても初期ロードの 99.7% が残る | 廃止 |
| p5.js 2.3.4 | 279 KiB（min 版）/ 413 KiB（バンドル） | API がほぼ同名で広い。WEBGL・シェーダー・フレームバッファあり | 最大。意味がずれる（WEBGL の原点、色、テキスト等）。シェーダーの名前規約が異なる（`aPosition` `uModelViewMatrix` `tex0`）ので Processing の GLSL が動かない。LGPL | 不採用 |
| three.js | 130 KiB（サブセット） | 3D 機能が豊富 | シーングラフ前提で即時モードと合わない。シェーダー規約が異なる | 不採用 |
| regl / twgl.js | 41 / 19〜24 KiB | WebGL の定型処理を減らせる | 自作の薄い層（見積もり 10〜15 KiB）で足りる | 任意 |
| gl-matrix（mat4+vec3） | 6.9 KiB | 高速 | PMatrix3D を API として自作する必要があり重複 | 不要 |
| earcut / libtess | 3.1 / 6.3 KiB | 多角形の三角形分割 | earcut は自己交差・巻き方向規則に弱い | **libtess** を採用 |
| **Canvas 2D API** | 0 | 即時モード。Java2D と同種のスキャンライン AA ラスタライザ。線端・結合・マイター・パス・変換・クリップ・テキスト・画像・合成モードがほぼ対応 | SUBTRACT 合成なし、`noSmooth()` で図形の AA を切れない | **JAVA2D に採用** |
| **自作 WebGL2** | 見積もり +20〜30 KiB（libtess 込み） | Processing の OpenGL レンダラと同じ属性/uniform 名・シェーダー種別・既定シェーダーを再現でき、PShader がそのまま動く | 工数が最大 | **P2D/P3D に採用** |

### JAVA2D → Canvas 2D の対応

| Processing | Canvas 2D |
|---|---|
| strokeCap ROUND/SQUARE/PROJECT | lineCap round / butt / square |
| strokeJoin MITER/BEVEL/ROUND | lineJoin miter / bevel / round（miterLimit 10） |
| beginShape/vertex/bezierVertex/quadraticVertex/curveVertex, beginContour | Path2D（curveVertex は Catmull-Rom → ベジエに変換）。穴は evenodd/nonzero |
| arc の OPEN/CHORD/PIE | ellipse() + 塗りと線を別パスで |
| blendMode | BLEND=source-over、ADD=lighter、MULTIPLY、SCREEN、DARKEST=darken、LIGHTEST=lighten、DIFFERENCE、EXCLUSION、REPLACE=copy。SUBTRACT はピクセル処理で代替 |
| tint | オフスクリーンキャンバスで乗算して描画（結果をキャッシュ） |
| loadPixels/pixels[]/updatePixels | getImageData/putImageData を Uint32Array で読み書き（RGBA ↔ ARGB 変換） |
| filter(GRAY/INVERT/THRESHOLD/POSTERIZE/BLUR/ERODE/DILATE/OPAQUE) | CPU で実装（仕様から実装） |
| text/textFont/createFont | fillText + CSS フォント + FontFace。既定フォントは core 同梱の `ProcessingSansPro-Regular.ttf`（同梱して配布できるかはライセンス要確認） |
| loadFont(.vlw) | VLW 形式（グリフのビットマップ）を解析して描画（Processing と同じグリフになる） |
| createGraphics(JAVA2D) | OffscreenCanvas |

### P2D/P3D → 自作 WebGL2（Processing の OpenGL レンダラの設計に合わせる）

- 塗りは CPU でテッセレーション（libtess）し、1 フレームの頂点を大きな VBO にまとめて描画（バッチ）。
- 線は四角形に展開して `direction` 属性を持つ LINE シェーダーで太さを付ける。点は `offset` 属性を持つ POINT シェーダー。Processing の線/点用カスタムシェーダーもそのまま動く。
- 既定シェーダー: COLOR / LIGHT / TEXTURE / TEXLIGHT（最大 8 灯、ambient/directional/point/spot、マテリアル）。
- uniform / attribute 名は Processing と同じ: `transformMatrix` `modelviewMatrix` `projectionMatrix` `normalMatrix` `texMatrix` `texOffset` `texture`(`texMap`) `viewport` `resolution` `ppixels` `lightCount` `lightPosition[8]` … / `position`(`vertex`) `color` `normal` `texCoord` `ambient` `specular` `emissive` `shininess` `direction` `offset`。
- シェーダー種別の判定も同じ（`#define PROCESSING_*_SHADER`、`offset`/`direction` 属性の有無、既定は POLY）。フラグメントシェーダーだけ渡されたら種別に応じた既定の頂点シェーダーを補う。
- **GLSL の変換**（`#version` が無いとき。同梱 examples の GLSL 28 本はすべて `#version` 無し）: `#version 300 es` と精度指定を付与 → `attribute`/`varying` を `in`/`out` に、`texture2D()` → `texture()`、uniform `texture` → `texMap`、`gl_FragColor` → `out vec4 _fragColor`（Processing 自身が GLSL 1.30 以上で行う変換と同じ）。ES で禁止される int→float の暗黙変換は代表的なパターン（数値リテラル）を自動修正し、残りはコンパイルエラーを .glsl の行番号付きで表示。`sampler2DRect` は非対応。`ppixels` はピンポン用のフレームバッファで実装。
- `filter(PShader)` は現在のフレームをテクスチャにして全画面の四角形を REPLACE で描画。
- テキストは OffscreenCanvas の 2D でグリフアトラスを作ってテクスチャで描く。
- `size()` の第 3 引数（P2D/P3D）はコンパイル時に分かるので、そのときだけ `processing-ts/webgl` を動的 import する。
- 将来 WebGPU 版を作る場合も同じ API 層の下に足せる（Processing 本家も 4.5.6 で WebGPU を実験導入）。

### その他の部品

| 機能 | 推奨 | gzip |
|---|---|---:|
| 画像のデコード | createImageBitmap（ブラウザ標準）。TGA は自作デコーダ | 0 |
| PShape: SVG | 自作の小さなパーサ（パスデータ + 基本図形 + スタイル）。DOMParser は Worker で使えないため | 見積もり 5 KiB |
| PShape: OBJ | 自作パーサ | 見積もり 2 KiB |
| XML クラス | メインスレッドは DOMParser。Worker 実行時のみ fast-xml-parser を遅延読み込み | 0 / 21 KiB |
| Table（CSV/TSV） | 自作（Processing 独自の挙動に合わせる。papaparse は不要） | 見積もり 3 KiB |
| フォントの輪郭（textMode(SHAPE)、PFont.getShape） | opentype.js を使われたときだけ遅延読み込み | 67 KiB |
| random / noise | `java.util.Random`（48bit 線形合同法、仕様は公開されている）と Processing の noise を再実装し、`randomSeed`/`noiseSeed` で Processing と同じ値を出す | 見積もり 1 KiB |
| エディタ（デモ） | CodeMirror 6 + Lezer Processing 文法 | 114 KiB（デモのみ） |

## 6. 実行スレッド

- 既定はメインスレッド（DOM・入力・フォントがそのまま使える）。
- 後のフェーズで **Worker 実行モード**（OffscreenCanvas）を追加: 無限ループを `terminate()` で止められる（エディタの停止ボタン）、UI が固まらない。入力イベントは postMessage で転送。カーソルやタイトルなど DOM 操作は委譲。

## 7. 機能カバレッジの見込み

リファレンスの関数 273 に対して、現行ランタイムに同名の実装があるのは **102**（イベント関数や `int()` 等の変換関数を含めると約 115）。ただし実装済みでも挙動がずれているものが多い（STATUS.md）。

| カテゴリ（関数数） | 現在（概数） | 推奨構成での見込み | 制約・注記 |
|---|---:|---:|---|
| Structure（14） | 9 | 14 | `thread()` は協調的に実行（真の並列ではない）。`setLocation/setResizable` はほぼ no-op |
| Environment（18 + 変数 9） | 3 + 4 | 全部 | `delay()` はメインスレッドでは制限付き（Worker モードで完全）。`windowMove` 等は no-op |
| Data（変換・文字列・配列 29 + クラス 16） | 約 10 | 全部 | 純粋な計算なので制約なし |
| Shape（36） | 約 16 | 全部 | 3D 図形は WebGL |
| Input（40） | 約 20 | 36〜38 | `selectFolder` は Chromium のみ。`launch()` は window.open 相当 |
| Output（20） | 約 4 | 16〜18 | `beginRecord/beginRaw`（PDF/DXF）は追加ライブラリ（PDF は jsPDF 等）が必要 |
| Transform（13） | 6 | 13 | |
| Lights/Camera（27） | 0 | 27 | WebGL |
| Color（16） | 約 11 | 16 | |
| Image（20） | 約 4 | 20 | |
| Rendering（10） | 1 | 10 | blendMode はレンダラごとの対応範囲が Processing と同じになる |
| Typography（12） | 約 6 | 12 | 字形は完全一致しない（フォントのラスタライザが異なる）。.vlw はほぼ一致 |
| Math（関数 32） | 約 25 | 32 | random/noise はシード付きで値まで一致 |
| **合計（273）** | **約 115（42%）** | **約 260（95%）** | 不可能/制限: `launch` `delay`（メイン） `thread` `selectFolder` PDF/DXF 記録 ウィンドウ操作 |

言語機能: Java 11 相当の構文は全対応を目標。対象外はリフレクション、スレッドの同期（`synchronized` は無視）、真の 64bit long 演算（オプション）、Java 標準ライブラリのうち上表以外。

ライブラリ（使用頻度順）: Minim / Sound（Web Audio）、Video（getUserMedia / video 要素）、PeasyCam は実現性が高い。Serial（Web Serial、Chromium のみ・非同期）、ControlP5、toxiclibs、PDF は中程度。oscP5（UDP 不可）、Net の Server は困難。優先度はユーザー方針により後回し。

## 8. 速度の目標

| 指標 | 現在（実測） | 目標 |
|---|---:|---:|
| 199 行の変換（ブラウザ、コールド） | 190〜250ms | 20ms 以下 |
| 5,000 行の変換（ウォーム） | 約 8 秒 | 50ms 以下 |
| 2D 埋め込みのダウンロード（gz） | 約 244 KiB | 50 KiB 以下 |
| 1 フレームの描画オーバーヘッド | text()/image() のたびに render | 1 フレーム 1 回（WebGL）/ 即時（Canvas2D） |

これらは ROADMAP の性能計測 CLI で継続的に測る。
