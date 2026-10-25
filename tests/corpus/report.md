# 互換性コーパス（Processing 同梱 examples）

`npm run vt -- corpus` の出力（2026-10-25）。Processing 4.5.2 の同梱 examples をヘッドレス Chromium で変換し、setup + draw 5 回を実行した結果。
見た目の一致（`--ref`）: 完走し、時刻や種なしの乱数に依存しないスケッチを、本物の Processing の同じフレームと比べた（視覚テストと同じ基準: 不一致ピクセル JAVA2D 1%・P2D/P3D 2% 以下）。

## 集計

| 区分 | 本数 | ok | 変換エラー | setup エラー | draw エラー | タイムアウト | ok 率 |
|---|---:|---:|---:|---:|---:|---:|---:|
| **全体** | 254 | 239 | 1 | 14 | 0 | 0 | 94% |
| Basics | 109 | 109 | 0 | 0 | 0 | 0 | 100% |
| Demos | 31 | 26 | 1 | 4 | 0 | 0 | 84% |
| Topics | 114 | 104 | 0 | 10 | 0 | 0 | 91% |
| JAVA2D | 166 | 157 | 0 | 9 | 0 | 0 | 95% |
| P2D | 28 | 26 | 1 | 1 | 0 | 0 | 93% |
| P3D | 60 | 56 | 0 | 4 | 0 | 0 | 93% |

## 見た目の一致（決定的なスケッチ）

比較 163 本中 **159 本一致（98%）**。基準は不一致ピクセルが JAVA2D で 1%、P2D/P3D で 2% 以下。

| レンダラ | 比較 | 一致 | 一致率 | 決定的でない | 参照なし |
|---|---:|---:|---:|---:|---:|
| JAVA2D | 120 | 120 | 100% | 36 | 1 |
| P2D/P3D | 43 | 39 | 91% | 39 | 0 |

| 不一致のスケッチ | レンダラ | 差分 |
|---|---|---:|
| Topics/Shaders/ImageMask | P2D | 100.00% |
| Topics/Shaders/BlurFilter | P2D | 97.43% |
| Basics/Form/Primitives3D | P3D | 5.44% |
| Demos/Tests/SpecsTest | P3D | 0.00% |

## 多いエラー（正規化して集計）

| 件数 | エラー | 例 |
|---:|---|---|
| 2 | `java.lang.UnsupportedOperationException: java.nio.ByteBuffer is not available in processing-ts` | LowLevelGLVboInterleaved, LowLevelGLVboSeparate |
| 2 | `java.lang.RuntimeException: (intermediate value).$init is not a function` | MultipleWindows, MultipleWindows |
| 2 | `java.lang.RuntimeException: $p.loadXML is not a function` | LoadSaveXML, XMLYahooWeather |
| 1 | `Yellowtail.pde:N:N: error: The import java.awt.Polygon cannot be resolved (the class is not available in processing-ts)` | Yellowtail |
| 1 | `java.lang.UnsupportedOperationException: processing.data.IntDict is not available in processing-ts` | CountingStrings |
| 1 | `java.lang.UnsupportedOperationException: processing.data.IntList is not available in processing-ts` | IntListLottery |
| 1 | `java.lang.RuntimeException: $p.loadTable is not a function` | LoadSaveTable |
| 1 | `java.lang.NullPointerException` | Regex |
| 1 | `java.lang.RuntimeException: $p.thread is not a function` | Threads |
| 1 | `java.lang.RuntimeException: $p.sketchPath is not a function` | DirectoryList |
| 1 | `java.lang.RuntimeException: $p.createWriter is not a function` | SaveFile2 |
| 1 | `java.lang.RuntimeException: $p.beginPGL is not a function` | DomeProjection |

## グループ別

| グループ | 本数 | ok | 変換エラー | setup エラー | draw エラー | タイムアウト | ok 率 |
|---|---:|---:|---:|---:|---:|---:|---:|
| Basics/Arrays | 3 | 3 | 0 | 0 | 0 | 0 | 100% |
| Basics/Camera | 3 | 3 | 0 | 0 | 0 | 0 | 100% |
| Basics/Color | 8 | 8 | 0 | 0 | 0 | 0 | 100% |
| Basics/Control | 5 | 5 | 0 | 0 | 0 | 0 | 100% |
| Basics/Data | 6 | 6 | 0 | 0 | 0 | 0 | 100% |
| Basics/Form | 8 | 8 | 0 | 0 | 0 | 0 | 100% |
| Basics/Image | 7 | 7 | 0 | 0 | 0 | 0 | 100% |
| Basics/Input | 12 | 12 | 0 | 0 | 0 | 0 | 100% |
| Basics/Lights | 6 | 6 | 0 | 0 | 0 | 0 | 100% |
| Basics/Math | 20 | 20 | 0 | 0 | 0 | 0 | 100% |
| Basics/Objects | 4 | 4 | 0 | 0 | 0 | 0 | 100% |
| Basics/Shape | 6 | 6 | 0 | 0 | 0 | 0 | 100% |
| Basics/Structure | 10 | 10 | 0 | 0 | 0 | 0 | 100% |
| Basics/Transform | 6 | 6 | 0 | 0 | 0 | 0 | 100% |
| Basics/Typography | 3 | 3 | 0 | 0 | 0 | 0 | 100% |
| Basics/Web | 2 | 2 | 0 | 0 | 0 | 0 | 100% |
| Demos/Graphics | 15 | 11 | 1 | 3 | 0 | 0 | 73% |
| Demos/Performance | 10 | 10 | 0 | 0 | 0 | 0 | 100% |
| Demos/Tests | 6 | 5 | 0 | 1 | 0 | 0 | 83% |
| Topics/Advanced Data | 10 | 3 | 0 | 7 | 0 | 0 | 30% |
| Topics/Animation | 2 | 2 | 0 | 0 | 0 | 0 | 100% |
| Topics/Cellular Automata | 4 | 4 | 0 | 0 | 0 | 0 | 100% |
| Topics/Create Shapes | 10 | 10 | 0 | 0 | 0 | 0 | 100% |
| Topics/Curves | 1 | 1 | 0 | 0 | 0 | 0 | 100% |
| Topics/Drawing | 3 | 3 | 0 | 0 | 0 | 0 | 100% |
| Topics/File IO | 8 | 6 | 0 | 2 | 0 | 0 | 75% |
| Topics/Fractals and L-Systems | 6 | 6 | 0 | 0 | 0 | 0 | 100% |
| Topics/GUI | 4 | 4 | 0 | 0 | 0 | 0 | 100% |
| Topics/Geometry | 7 | 7 | 0 | 0 | 0 | 0 | 100% |
| Topics/Image Processing | 12 | 12 | 0 | 0 | 0 | 0 | 100% |
| Topics/Interaction | 7 | 7 | 0 | 0 | 0 | 0 | 100% |
| Topics/Motion | 10 | 10 | 0 | 0 | 0 | 0 | 100% |
| Topics/Shaders | 15 | 14 | 0 | 1 | 0 | 0 | 93% |
| Topics/Simulate | 7 | 7 | 0 | 0 | 0 | 0 | 100% |
| Topics/Textures | 5 | 5 | 0 | 0 | 0 | 0 | 100% |
| Topics/Vectors | 3 | 3 | 0 | 0 | 0 | 0 | 100% |

## 全スケッチ

| スケッチ | レンダラ | 結果 | 見た目 | 変換 ms | 最初のエラー |
|---|---|---|---|---:|---|
| Basics/Arrays/Array | JAVA2D | ok | match 0.14% | 14 |  |
| Basics/Arrays/Array2D | JAVA2D | ok | match 0.00% | 13 |  |
| Basics/Arrays/ArrayObjects | JAVA2D | ok | nondeterministic | 16 |  |
| Basics/Camera/MoveEye | P3D | ok | match 0.00% | 10 |  |
| Basics/Camera/Orthographic | P3D | ok | match 0.00% | 13 |  |
| Basics/Camera/Perspective | P3D | ok | match 0.00% | 14 |  |
| Basics/Color/Brightness | JAVA2D | ok | match 0.00% | 13 |  |
| Basics/Color/ColorVariables | JAVA2D | ok | match 0.00% | 11 |  |
| Basics/Color/Hue | JAVA2D | ok | match 0.00% | 13 |  |
| Basics/Color/LinearGradient | JAVA2D | ok | match 0.19% | 14 |  |
| Basics/Color/RadialGradient | JAVA2D | ok | nondeterministic | 13 |  |
| Basics/Color/Relativity | JAVA2D | ok | match 0.00% | 13 |  |
| Basics/Color/Saturation | JAVA2D | ok | match 0.00% | 12 |  |
| Basics/Color/WaveGradient | JAVA2D | ok | noref | 15 |  |
| Basics/Control/Conditionals1 | JAVA2D | ok | match 0.00% | 12 |  |
| Basics/Control/Conditionals2 | JAVA2D | ok | match 0.08% | 12 |  |
| Basics/Control/EmbeddedIteration | JAVA2D | ok | match 0.16% | 12 |  |
| Basics/Control/Iteration | JAVA2D | ok | match 0.00% | 14 |  |
| Basics/Control/LogicalOperators | JAVA2D | ok | match 0.00% | 15 |  |
| Basics/Data/CharactersStrings | JAVA2D | ok | match 0.38% | 13 |  |
| Basics/Data/DatatypeConversion | JAVA2D | ok | match 0.63% | 12 |  |
| Basics/Data/IntegersFloats | JAVA2D | ok | match 0.00% | 12 |  |
| Basics/Data/TrueFalse | JAVA2D | ok | match 0.00% | 13 |  |
| Basics/Data/VariableScope | JAVA2D | ok | match 0.02% | 14 |  |
| Basics/Data/Variables | JAVA2D | ok | match 0.00% | 13 |  |
| Basics/Form/Bezier | JAVA2D | ok | match 0.57% | 12 |  |
| Basics/Form/PieChart | JAVA2D | ok | match 0.00% | 13 |  |
| Basics/Form/PointsLines | JAVA2D | ok | match 0.00% | 12 |  |
| Basics/Form/Primitives3D | P3D | ok | differ 5.44% | 11 |  |
| Basics/Form/RegularPolygon | JAVA2D | ok | match 0.03% | 15 |  |
| Basics/Form/ShapePrimitives | JAVA2D | ok | match 0.00% | 11 |  |
| Basics/Form/Star | JAVA2D | ok | match 0.12% | 15 |  |
| Basics/Form/TriangleStrip | JAVA2D | ok | match 0.11% | 14 |  |
| Basics/Image/Alphamask | JAVA2D | ok | match 0.00% | 13 |  |
| Basics/Image/BackgroundImage | JAVA2D | ok | match 0.22% | 15 |  |
| Basics/Image/CreateImage | JAVA2D | ok | match 0.00% | 14 |  |
| Basics/Image/LoadDisplayImage | JAVA2D | ok | match 0.00% | 12 |  |
| Basics/Image/Pointillism | JAVA2D | ok | nondeterministic | 12 |  |
| Basics/Image/RequestImage | JAVA2D | ok | match 0.00% | 15 |  |
| Basics/Image/Transparency | JAVA2D | ok | match 0.00% | 13 |  |
| Basics/Input/Clock | JAVA2D | ok | nondeterministic | 16 |  |
| Basics/Input/Constrain | JAVA2D | ok | match 0.00% | 13 |  |
| Basics/Input/Easing | JAVA2D | ok | match 0.00% | 12 |  |
| Basics/Input/Keyboard | JAVA2D | ok | nondeterministic | 13 |  |
| Basics/Input/KeyboardFunctions | JAVA2D | ok | match 0.00% | 15 |  |
| Basics/Input/Milliseconds | JAVA2D | ok | nondeterministic | 13 |  |
| Basics/Input/Mouse1D | JAVA2D | ok | match 0.00% | 12 |  |
| Basics/Input/Mouse2D | JAVA2D | ok | match 0.00% | 12 |  |
| Basics/Input/MouseFunctions | JAVA2D | ok | match 0.00% | 14 |  |
| Basics/Input/MousePress | JAVA2D | ok | match 0.00% | 12 |  |
| Basics/Input/MouseSignals | JAVA2D | ok | match 0.55% | 15 |  |
| Basics/Input/StoringInput | JAVA2D | ok | match 0.00% | 13 |  |
| Basics/Lights/Directional | P3D | ok | match 0.02% | 12 |  |
| Basics/Lights/Mixture | P3D | ok | match 0.00% | 13 |  |
| Basics/Lights/MixtureGrid | P3D | ok | match 1.40% | 14 |  |
| Basics/Lights/OnOff | P3D | ok | match 0.00% | 13 |  |
| Basics/Lights/Reflection | P3D | ok | match 0.00% | 12 |  |
| Basics/Lights/Spot | P3D | ok | match 0.00% | 11 |  |
| Basics/Math/AdditiveWave | JAVA2D | ok | nondeterministic | 15 |  |
| Basics/Math/Arctangent | JAVA2D | ok | match 0.00% | 14 |  |
| Basics/Math/Distance1D | JAVA2D | ok | match 0.00% | 15 |  |
| Basics/Math/Distance2D | JAVA2D | ok | match 0.00% | 12 |  |
| Basics/Math/DoubleRandom | JAVA2D | ok | nondeterministic | 12 |  |
| Basics/Math/Graphing2DEquation | JAVA2D | ok | match 0.00% | 13 |  |
| Basics/Math/IncrementDecrement | JAVA2D | ok | match 0.00% | 13 |  |
| Basics/Math/Interpolate | JAVA2D | ok | match 0.00% | 11 |  |
| Basics/Math/Map | JAVA2D | ok | match 0.00% | 11 |  |
| Basics/Math/Noise1D | JAVA2D | ok | nondeterministic | 12 |  |
| Basics/Math/Noise2D | JAVA2D | ok | nondeterministic | 12 |  |
| Basics/Math/Noise3D | JAVA2D | ok | nondeterministic | 14 |  |
| Basics/Math/NoiseWave | JAVA2D | ok | nondeterministic | 12 |  |
| Basics/Math/OperatorPrecedence | JAVA2D | ok | match 0.12% | 13 |  |
| Basics/Math/PolarToCartesian | JAVA2D | ok | match 0.00% | 12 |  |
| Basics/Math/Random | JAVA2D | ok | nondeterministic | 12 |  |
| Basics/Math/RandomGaussian | JAVA2D | ok | nondeterministic | 12 |  |
| Basics/Math/Sine | JAVA2D | ok | match 0.00% | 13 |  |
| Basics/Math/SineCosine | JAVA2D | ok | match 0.00% | 14 |  |
| Basics/Math/SineWave | JAVA2D | ok | match 0.00% | 14 |  |
| Basics/Objects/CompositeObjects | JAVA2D | ok | match 0.00% | 17 |  |
| Basics/Objects/Inheritance | JAVA2D | ok | match 0.00% | 16 |  |
| Basics/Objects/MultipleConstructors | JAVA2D | ok | match 0.12% | 13 |  |
| Basics/Objects/Objects | JAVA2D | ok | match 0.00% | 16 |  |
| Basics/Shape/DisableStyle | JAVA2D | ok | match 0.25% | 11 |  |
| Basics/Shape/GetChild | JAVA2D | ok | match 0.08% | 13 |  |
| Basics/Shape/LoadDisplayOBJ | P3D | ok | match 0.07% | 12 |  |
| Basics/Shape/LoadDisplaySVG | JAVA2D | ok | match 0.02% | 11 |  |
| Basics/Shape/ScaleShape | JAVA2D | ok | match 0.02% | 12 |  |
| Basics/Shape/ShapeVertices | JAVA2D | ok | match 0.50% | 14 |  |
| Basics/Structure/Coordinates | JAVA2D | ok | match 0.00% | 10 |  |
| Basics/Structure/CreateGraphics | JAVA2D | ok | match 0.00% | 13 |  |
| Basics/Structure/Functions | JAVA2D | ok | match 0.00% | 13 |  |
| Basics/Structure/Loop | JAVA2D | ok | match 0.00% | 11 |  |
| Basics/Structure/NoLoop | JAVA2D | ok | match 0.00% | 11 |  |
| Basics/Structure/Recursion | JAVA2D | ok | match 0.00% | 13 |  |
| Basics/Structure/Redraw | JAVA2D | ok | match 0.00% | 12 |  |
| Basics/Structure/SetupDraw | JAVA2D | ok | match 0.00% | 12 |  |
| Basics/Structure/StatementsComments | JAVA2D | ok | match 0.00% | 9 |  |
| Basics/Structure/WidthHeight | JAVA2D | ok | match 0.00% | 12 |  |
| Basics/Transform/Arm | JAVA2D | ok | match 0.00% | 13 |  |
| Basics/Transform/Rotate | JAVA2D | ok | nondeterministic | 12 |  |
| Basics/Transform/RotatePushPop | P3D | ok | match 0.06% | 13 |  |
| Basics/Transform/RotateXY | P3D | ok | match 0.00% | 13 |  |
| Basics/Transform/Scale | JAVA2D | ok | match 0.00% | 13 |  |
| Basics/Transform/Translate | JAVA2D | ok | match 0.00% | 12 |  |
| Basics/Typography/Letters | JAVA2D | ok | match 0.53% | 15 |  |
| Basics/Typography/TextRotation | JAVA2D | ok | match 0.14% | 14 |  |
| Basics/Typography/Words | JAVA2D | ok | match 0.05% | 13 |  |
| Basics/Web/EmbeddedLinks | JAVA2D | ok | nondeterministic | 13 |  |
| Basics/Web/LoadingImages | JAVA2D | ok | nondeterministic | 12 |  |
| Demos/Graphics/DepthSort | P3D | ok | nondeterministic | 14 |  |
| Demos/Graphics/GetTessGroups | P3D | ok | match 0.00% | 13 |  |
| Demos/Graphics/LowLevelGLVboInterleaved | P3D | setup |  | 21 | java.lang.UnsupportedOperationException: java.nio.ByteBuffer is not available in processing-ts |
| Demos/Graphics/LowLevelGLVboSeparate | P3D | setup |  | 18 | java.lang.UnsupportedOperationException: java.nio.ByteBuffer is not available in processing-ts |
| Demos/Graphics/MeshTweening | P3D | ok | nondeterministic | 15 |  |
| Demos/Graphics/MultipleWindows | P2D | setup |  | 18 | java.lang.RuntimeException: (intermediate value).$init is not a function |
| Demos/Graphics/Particles | P2D | ok | nondeterministic | 20 |  |
| Demos/Graphics/Patch | P3D | ok | nondeterministic | 21 |  |
| Demos/Graphics/Planets | P3D | ok | nondeterministic | 24 |  |
| Demos/Graphics/Ribbons | P3D | ok | nondeterministic | 42 |  |
| Demos/Graphics/RotatingArcs | P3D | ok | nondeterministic | 20 |  |
| Demos/Graphics/TessUpdate | P3D | ok | nondeterministic | 17 |  |
| Demos/Graphics/Trefoil | P3D | ok | nondeterministic | 22 |  |
| Demos/Graphics/Wiggling | P3D | ok | nondeterministic | 20 |  |
| Demos/Graphics/Yellowtail | P2D | transpile |  | 25 | Yellowtail.pde:16:1: error: The import java.awt.Polygon cannot be resolved (the class is not availab |
| Demos/Performance/CubicGridImmediate | P3D | ok | nondeterministic | 16 |  |
| Demos/Performance/CubicGridRetained | P3D | ok | nondeterministic | 18 |  |
| Demos/Performance/DynamicParticlesImmediate | P3D | ok | nondeterministic | 19 |  |
| Demos/Performance/DynamicParticlesRetained | P3D | ok | nondeterministic | 20 |  |
| Demos/Performance/Esfera | P3D | ok | nondeterministic | 17 |  |
| Demos/Performance/LineRendering | P2D | ok | nondeterministic | 13 |  |
| Demos/Performance/QuadRendering | P2D | ok | nondeterministic | 12 |  |
| Demos/Performance/StaticParticlesImmediate | P3D | ok | nondeterministic | 17 |  |
| Demos/Performance/StaticParticlesRetained | P3D | ok | nondeterministic | 16 |  |
| Demos/Performance/TextRendering | P2D | ok | nondeterministic | 12 |  |
| Demos/Tests/MultipleWindows | P3D | setup |  | 26 | java.lang.RuntimeException: (intermediate value).$init is not a function |
| Demos/Tests/NoBackgroundTest | P2D | ok | match 0.02% | 10 |  |
| Demos/Tests/OffscreenTest | P3D | ok | match 0.00% | 12 |  |
| Demos/Tests/RedrawTest | P3D | ok | match 0.01% | 11 |  |
| Demos/Tests/ResizeTest | P3D | ok | match 0.04% | 11 |  |
| Demos/Tests/SpecsTest | P3D | ok | differ 0.00% | 11 |  |
| Topics/Advanced Data/ArrayListClass | JAVA2D | ok | match 0.00% | 16 |  |
| Topics/Advanced Data/CountingStrings | JAVA2D | setup |  | 15 | java.lang.UnsupportedOperationException: processing.data.IntDict is not available in processing-ts |
| Topics/Advanced Data/HashMapClass | JAVA2D | ok | nondeterministic | 19 |  |
| Topics/Advanced Data/IntListLottery | JAVA2D | setup |  | 17 | java.lang.UnsupportedOperationException: processing.data.IntList is not available in processing-ts |
| Topics/Advanced Data/LoadSaveJSON | JAVA2D | ok | nondeterministic | 23 |  |
| Topics/Advanced Data/LoadSaveTable | JAVA2D | setup |  | 17 | java.lang.RuntimeException: $p.loadTable is not a function |
| Topics/Advanced Data/LoadSaveXML | JAVA2D | setup |  | 21 | java.lang.RuntimeException: $p.loadXML is not a function |
| Topics/Advanced Data/Regex | JAVA2D | setup |  | 16 | java.lang.NullPointerException |
| Topics/Advanced Data/Threads | JAVA2D | setup |  | 17 | java.lang.RuntimeException: $p.thread is not a function |
| Topics/Advanced Data/XMLYahooWeather | JAVA2D | setup |  | 13 | java.lang.RuntimeException: $p.loadXML is not a function |
| Topics/Animation/AnimatedSprite | JAVA2D | ok | match 0.00% | 16 |  |
| Topics/Animation/Sequential | JAVA2D | ok | match 0.00% | 15 |  |
| Topics/Cellular Automata/GameOfLife | JAVA2D | ok | nondeterministic | 20 |  |
| Topics/Cellular Automata/Spore1 | JAVA2D | ok | nondeterministic | 19 |  |
| Topics/Cellular Automata/Spore2 | JAVA2D | ok | nondeterministic | 24 |  |
| Topics/Cellular Automata/Wolfram | JAVA2D | ok | nondeterministic | 19 |  |
| Topics/Create Shapes/BeginEndContour | P2D | ok | match 0.00% | 13 |  |
| Topics/Create Shapes/GroupPShape | P2D | ok | nondeterministic | 15 |  |
| Topics/Create Shapes/ParticleSystemPShape | P2D | ok | nondeterministic | 20 |  |
| Topics/Create Shapes/PathPShape | P2D | ok | match 0.00% | 12 |  |
| Topics/Create Shapes/PolygonPShape | P2D | ok | match 0.00% | 13 |  |
| Topics/Create Shapes/PolygonPShapeOOP | P2D | ok | nondeterministic | 16 |  |
| Topics/Create Shapes/PolygonPShapeOOP2 | P2D | ok | nondeterministic | 18 |  |
| Topics/Create Shapes/PolygonPShapeOOP3 | P2D | ok | nondeterministic | 18 |  |
| Topics/Create Shapes/PrimitivePShape | P2D | ok | match 0.00% | 11 |  |
| Topics/Create Shapes/WigglePShape | P2D | ok | nondeterministic | 17 |  |
| Topics/Curves/ArcLengthParametrization | P2D | ok | nondeterministic | 25 |  |
| Topics/Drawing/ContinuousLines | JAVA2D | ok | match 0.00% | 11 |  |
| Topics/Drawing/Pattern | JAVA2D | ok | match 0.00% | 11 |  |
| Topics/Drawing/Pulses | JAVA2D | ok | match 0.00% | 13 |  |
| Topics/File IO/DirectoryList | JAVA2D | setup |  | 19 | java.lang.RuntimeException: $p.sketchPath is not a function |
| Topics/File IO/LoadFile1 | JAVA2D | ok | match 0.00% | 13 |  |
| Topics/File IO/LoadFile2 | JAVA2D | ok | match 0.13% | 18 |  |
| Topics/File IO/SaveFile1 | JAVA2D | ok | match 0.00% | 14 |  |
| Topics/File IO/SaveFile2 | JAVA2D | setup |  | 13 | java.lang.RuntimeException: $p.createWriter is not a function |
| Topics/File IO/SaveFrames | JAVA2D | ok | match 0.68% | 15 |  |
| Topics/File IO/SaveOneImage | JAVA2D | ok | match 0.00% | 11 |  |
| Topics/File IO/TileImages | JAVA2D | ok | match 0.00% | 13 |  |
| Topics/Fractals and L-Systems/Koch | JAVA2D | ok | nondeterministic | 19 |  |
| Topics/Fractals and L-Systems/Mandelbrot | JAVA2D | ok | match 0.00% | 15 |  |
| Topics/Fractals and L-Systems/PenroseSnowflake | JAVA2D | ok | match 0.00% | 20 |  |
| Topics/Fractals and L-Systems/PenroseTile | JAVA2D | ok | match 0.00% | 21 |  |
| Topics/Fractals and L-Systems/Pentigree | JAVA2D | ok | match 0.00% | 20 |  |
| Topics/Fractals and L-Systems/Tree | JAVA2D | ok | match 0.00% | 13 |  |
| Topics/GUI/Button | JAVA2D | ok | match 0.02% | 16 |  |
| Topics/GUI/Handles | JAVA2D | ok | match 0.00% | 20 |  |
| Topics/GUI/Rollover | JAVA2D | ok | match 0.02% | 17 |  |
| Topics/GUI/Scrollbar | JAVA2D | ok | match 0.00% | 20 |  |
| Topics/Geometry/Icosahedra | P3D | ok | match 0.08% | 28 |  |
| Topics/Geometry/NoiseSphere | P3D | ok | nondeterministic | 18 |  |
| Topics/Geometry/RGBCube | P3D | ok | match 0.00% | 16 |  |
| Topics/Geometry/ShapeTransform | P3D | ok | match 0.00% | 17 |  |
| Topics/Geometry/SpaceJunk | P3D | ok | nondeterministic | 19 |  |
| Topics/Geometry/Toroid | P3D | ok | match 0.00% | 19 |  |
| Topics/Geometry/Vertices | P3D | ok | match 0.65% | 15 |  |
| Topics/Image Processing/Blending | P3D | ok | match 0.34% | 15 |  |
| Topics/Image Processing/Blur | JAVA2D | ok | match 0.00% | 16 |  |
| Topics/Image Processing/BrightnessPixels | JAVA2D | ok | match 0.00% | 14 |  |
| Topics/Image Processing/Convolution | JAVA2D | ok | match 0.40% | 19 |  |
| Topics/Image Processing/EdgeDetection | JAVA2D | ok | match 0.00% | 15 |  |
| Topics/Image Processing/Explode | P3D | ok | match 0.14% | 15 |  |
| Topics/Image Processing/Extrusion | P3D | ok | match 1.44% | 15 |  |
| Topics/Image Processing/Histogram | JAVA2D | ok | match 0.00% | 14 |  |
| Topics/Image Processing/LinearImage | JAVA2D | ok | match 0.00% | 14 |  |
| Topics/Image Processing/PixelArray | JAVA2D | ok | match 0.00% | 15 |  |
| Topics/Image Processing/Sharpen | JAVA2D | ok | match 0.00% | 17 |  |
| Topics/Image Processing/Zoom | P3D | ok | match 0.80% | 17 |  |
| Topics/Interaction/Follow1 | JAVA2D | ok | match 0.00% | 14 |  |
| Topics/Interaction/Follow2 | JAVA2D | ok | match 0.00% | 14 |  |
| Topics/Interaction/Follow3 | JAVA2D | ok | match 0.00% | 16 |  |
| Topics/Interaction/Reach1 | JAVA2D | ok | match 0.00% | 13 |  |
| Topics/Interaction/Reach2 | JAVA2D | ok | match 0.00% | 16 |  |
| Topics/Interaction/Reach3 | JAVA2D | ok | match 0.00% | 17 |  |
| Topics/Interaction/Tickle | JAVA2D | ok | nondeterministic | 13 |  |
| Topics/Motion/Bounce | JAVA2D | ok | match 0.00% | 13 |  |
| Topics/Motion/BouncyBubbles | JAVA2D | ok | nondeterministic | 18 |  |
| Topics/Motion/Brownian | JAVA2D | ok | nondeterministic | 14 |  |
| Topics/Motion/CircleCollision | JAVA2D | ok | nondeterministic | 21 |  |
| Topics/Motion/CubesWithinCube | P3D | ok | nondeterministic | 22 |  |
| Topics/Motion/Linear | JAVA2D | ok | match 0.00% | 11 |  |
| Topics/Motion/Morph | JAVA2D | ok | match 0.00% | 18 |  |
| Topics/Motion/MovingOnCurves | JAVA2D | ok | match 0.00% | 13 |  |
| Topics/Motion/Reflection1 | JAVA2D | ok | nondeterministic | 18 |  |
| Topics/Motion/Reflection2 | JAVA2D | ok | nondeterministic | 21 |  |
| Topics/Shaders/BlurFilter | P2D | ok | differ 97.43% | 11 |  |
| Topics/Shaders/Conway | P3D | ok | nondeterministic | 15 |  |
| Topics/Shaders/CustomBlend | P2D | ok | nondeterministic | 19 |  |
| Topics/Shaders/Deform | P2D | ok | nondeterministic | 12 |  |
| Topics/Shaders/DomeProjection | P3D | setup |  | 20 | java.lang.RuntimeException: $p.beginPGL is not a function |
| Topics/Shaders/EdgeDetect | P2D | ok | match 0.00% | 12 |  |
| Topics/Shaders/EdgeFilter | P3D | ok | match 0.02% | 16 |  |
| Topics/Shaders/GlossyFishEye | P3D | ok | match 0.19% | 19 |  |
| Topics/Shaders/ImageMask | P2D | ok | differ 100.00% | 13 |  |
| Topics/Shaders/InfiniteTiles | P2D | ok | nondeterministic | 12 |  |
| Topics/Shaders/Landscape | P2D | ok | nondeterministic | 13 |  |
| Topics/Shaders/Monjori | P2D | ok | nondeterministic | 12 |  |
| Topics/Shaders/Nebula | P2D | ok | nondeterministic | 12 |  |
| Topics/Shaders/SepBlur | P2D | ok | match 0.00% | 16 |  |
| Topics/Shaders/ToonShading | P3D | ok | nondeterministic | 13 |  |
| Topics/Simulate/Flocking | JAVA2D | ok | nondeterministic | 22 |  |
| Topics/Simulate/ForcesWithVectors | JAVA2D | ok | nondeterministic | 18 |  |
| Topics/Simulate/GravitationalAttraction3D | P3D | ok | nondeterministic | 18 |  |
| Topics/Simulate/MultipleParticleSystems | JAVA2D | ok | nondeterministic | 20 |  |
| Topics/Simulate/SimpleParticleSystem | JAVA2D | ok | nondeterministic | 17 |  |
| Topics/Simulate/SmokeParticleSystem | JAVA2D | ok | nondeterministic | 20 |  |
| Topics/Simulate/SoftBody | JAVA2D | ok | nondeterministic | 16 |  |
| Topics/Textures/TextureCube | P3D | ok | match 0.13% | 20 |  |
| Topics/Textures/TextureCylinder | P3D | ok | match 0.00% | 17 |  |
| Topics/Textures/TextureQuad | P3D | ok | match 0.00% | 13 |  |
| Topics/Textures/TextureSphere | P3D | ok | match 0.07% | 21 |  |
| Topics/Textures/TextureTriangle | P3D | ok | match 0.00% | 12 |  |
| Topics/Vectors/AccelerationWithVectors | JAVA2D | ok | match 0.00% | 14 |  |
| Topics/Vectors/BouncingBall | JAVA2D | ok | match 0.00% | 13 |  |
| Topics/Vectors/VectorMath | JAVA2D | ok | match 0.00% | 13 |  |
