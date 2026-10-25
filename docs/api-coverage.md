# API カバレッジ（自動生成）

`node tools/manifest/coverage.ts` で生成。Processing のリファレンス（[docs/research/processing-api-inventory-2026-10.txt](research/processing-api-inventory-2026-10.txt)）の関数・変数・クラスのうち、ランタイム（`src/lib/runtime`）に**同名の実装があるもの**を数えている。
**挙動が Processing と一致するかは別問題**（[STATUS.md](STATUS.md) と視覚テストを参照）。言語構文（Control / Data の型・演算子・構文キーワード）はコンパイラの担当なので除外。

関数の合計: **217/253（86%）**

| カテゴリ | 関数 | 変数 | クラス |
|---|---:|---:|---:|
| color | 16/16 | - | - |
| constants | - | 5/5 | - |
| data | 19/23 | - | 2/11 |
| environment | 15/18 | 7/9 | - |
| image | 17/18 | 1/1 | 1/1 |
| input | 20/30 | 9/9 | 0/1 |
| lights_camera | 27/27 | - | - |
| math | 28/32 | - | 1/1 |
| output | 7/19 | - | 0/1 |
| rendering | 6/8 | - | 2/2 |
| shape | 38/38 | - | 1/1 |
| transform | 13/13 | - | - |
| typography | 11/11 | - | 1/1 |

## 未実装の一覧

- **data**: FloatDict, FloatList, IntDict, IntList, StringDict, StringList, Table, TableRow, XML, binary(), hex(), unbinary(), unhex()
- **environment**: delay(), displayHeight, displayWidth, windowMoved(), windowResize()
- **image**: mask()
- **input**: BufferedReader, createInput(), createReader(), launch(), loadTable(), loadXML(), parseJSONArray(), parseJSONObject(), parseXML(), selectFolder(), selectInput()
- **math**: log(), mag(), round(), sq()
- **output**: beginRaw(), beginRecord(), createOutput(), createWriter(), endRaw(), endRecord(), PrintWriter, saveStream(), saveTable(), saveXML(), selectOutput(), print(), printArray()
- **rendering**: clip(), noClip()

## 参考: core の public API の規模（`src/compiler/api/processing-core.json`）

Processing 4.5.2 の PApplet は public メソッド 351 名 / 715 オーバーロード（内部用の handleDraw や main などを含む）。
