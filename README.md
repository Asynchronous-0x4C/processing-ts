# Processing.ts
> Run native Processing code in your browser using JavaScript / TypeScript

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Processingのコードを、変換なしでそのままWeb上で実行できるTypeScriptライブラリです。

- 🟢 Processingコード（`.pde`）をそのまま実行
- 📝 Processing4.4までの構文をサポート
- 🎨 Webでインタラクティブアートを公開・共有
- ✅ npmから利用可能

## Installation

```shell
npm i @async0x4c/processing-ts
```

## Live demo

[▶ Live Demo](https://asynchronous-0x4c.github.io/processing-ts-docs/demo/)

## Quick start(Vanilla JS)

### 1.ライブラリのダウンロード
[library.js](./library.js)をダウンロード

### 2.スケッチの入ったフォルダを用意
```
.
└── MySketch/
    ├── data/
    │   └── picture.png
    ├── main.pde
    └── system.pde
```

### 3.`sketch.properties`を作成
```
.
└── MySketch/
    ├── data/
    │   └── picture.png
    ├── main.pde
    ├── system.pde
    └── sketch.properties
```
#### sketch.propertiesのサンプル
```ini
main = main.pde  # メイン(PDEで一番左になるタブ)のファイル名
sketches = main.pde system.pde  # スケッチで利用する全てのファイル
resources = ./data/picture.png  # 静的に読み込む全てのリソース(任意)
```

### 4.`Canvas`を渡して実行
```
.
├── index.html
├── main.js
├── library.js
└── MySketch/
    └── ...
```

#### HTML
```html
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Processing-ts</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pixi.js/8.12.0/pixi.min.js" integrity="sha512-gO6ZqUJAWdxRHBTOVBmjev2Or6vRUSDO2LWlqrU8jNDh+ymsV1wn36g5u8A3VZ0eauEUJH2lN4EFCWH5PriRrA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script type="module" src="./main.js"></script>
  </head>
  <body>
    <canvas id="app">
    </canvas>
    <script type="module" src="main.ts"></script>
    <style>
      body{
        margin: 0;
        overflow: hidden;
      }
    </style>
  </body>
</html>
```
#### main.js
```javascript
import { SketchManager } from "./library.js";

const manager = new SketchManager(); //スケッチの変換/実行を管理するクラス
manager.mountPApplet(document.getElementById("app")); //Canvasを渡す
const sketch = await manager.loadSketch("./MySketch/"); //スケッチを読み込み
await manager.runSketch(sketch); //スケッチを実行
```

## Quick start(npm)

### 1.インストール
```shell
npm i @async0x4c/processing-ts
```

### 2.スケッチの入ったフォルダを用意
```
.
└── MySketch/
    ├── data/
    │   └── picture.png
    ├── main.pde
    └── system.pde
```

### 3.`sketch.properties`を作成
```
.
└── MySketch/
    ├── data/
    │   └── picture.png
    ├── main.pde
    ├── system.pde
    └── sketch.properties
```
#### sketch.propertiesのサンプル
```ini
main = main.pde  # メイン(PDEで一番左になるタブ)のファイル名
sketches = main.pde system.pde  # スケッチで利用する全てのファイル
resources = ./data/picture.png  # 静的に読み込む全てのリソース(任意)
```

### 4.`Canvas`を渡して実行
```
.
├── index.html
├── main.js
├── index.js
└── MySketch/
    └── ...
```

#### HTML
```html
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Processing-ts</title>
  </head>
  <body>
    <canvas id="app">
    </canvas>
    <script type="module" src="main.ts"></script>
    <style>
      body{
        margin: 0;
        overflow: hidden;
      }
    </style>
  </body>
</html>
```
#### main.js
```javascript
import { SketchManager } from "./index.js";

const manager = new SketchManager(); //スケッチの変換/実行を管理するクラス
manager.mountPApplet(document.getElementById("app")); //Canvasを渡す
const sketch = await manager.loadSketch("./MySketch/"); //スケッチを読み込み
await manager.runSketch(sketch); //スケッチを実行
```

## どんなときに使える？

- 📋 Processing作品をWebサイトに貼りたいとき
- ♾️ JavaScriptとProcessingを組み合わせたいとき
- 📖 教材をブラウザで動かしたいとき
- ⭐ インタラクティブなポートフォリオを作りたいとき

## FAQ

### Q. p5.jsとの違いは何?
A.`p5.js`はJavaScriptでProcessingのスケッチを書く必要がありますが、本ライブラリは元の**Processingコードをブラウザ上で実行**します。

### Q. Processing.jsで良くない?
Processing.jsではProcessing.tsに比べ多くの関数がサポートされているものの、対象とするProcessingのバージョンが古いため、動作が異なる関数が存在します。<br>
Processing.tsでは、最新のProcessingの機能に基づいて実装や変換を行うため、Processing.jsに比べより確実にスケッチをブラウザ上で実行することができます。

## 今後について
今後の開発においてはWebAssemblyを用いた変換速度の改善や周辺ライブラリのサポート、Processing.tsと連携して高度な機能を実現するProcessing用のライブラリなど様々なものを計画しているので、コミュニティを盛り上げてもらえると嬉しいです。

## 開発・コントリビューション
バグ報告・提案・コントリビュート大歓迎です！