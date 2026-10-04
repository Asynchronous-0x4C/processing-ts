# 調査・計測データ

EVALUATION.md / STATUS.md の根拠となる生データ。日付入りのものは当時の状態を記録したもので、更新しない（新しく測ったら別ファイルにする）。

| ファイル | 内容 |
|---|---|
| [2026-10-measurements/RESULTS.md](2026-10-measurements/RESULTS.md) | パーサ・描画ライブラリ等のバンドルサイズと構文解析速度の実測（2026-10-04）。同フォルダのスクリプトで再現できる（別ディレクトリにコピーして `npm install` → RESULTS.md 冒頭の順に実行。`gen-inputs.mjs` が 5k 行の入力を生成） |
| [processing-2026-10.md](processing-2026-10.md) | 最新 Processing（4.5.x）の調査: リリース内容、プリプロセッサの文法と実際に通る Java 構文、API 一覧と規模、レンダラとシェーダーの仕様、既存の Web 向け手段、ライブラリの利用状況、Java 意味論の落とし穴 |
| [processing-api-inventory-2026-10.txt](processing-api-inventory-2026-10.txt) | リファレンスのカテゴリ別 API 一覧 |
| [reference-functions.txt](reference-functions.txt) | リファレンスの関数 273 件（カバレッジ計算用） |
| [papplet-methods-4.5.2.txt](papplet-methods-4.5.2.txt) | core 4.5.2 の PApplet の public メソッド名 |
| [library-usage-counts.tsv](library-usage-counts.tsv) | GitHub コード検索での `import` 件数（ライブラリ利用度の概算） |
