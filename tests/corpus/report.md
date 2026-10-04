# 互換性コーパス（Processing 同梱 examples）

`npm run vt -- corpus` の出力（2026-10-04）。Processing 4.5.2 の同梱 examples をヘッドレス Chromium で変換し、setup + draw 5 回を実行した結果。
「ok」はエラーなく完走したことだけを意味し、見た目の一致は確認していない。

## 集計

| 区分 | 本数 | ok | 変換エラー | setup エラー | draw エラー | タイムアウト | ok 率 |
|---|---:|---:|---:|---:|---:|---:|---:|
| **全体** | 254 | 124 | 1 | 81 | 47 | 1 | 49% |
| Basics | 109 | 79 | 0 | 14 | 16 | 0 | 72% |
| Demos | 31 | 5 | 1 | 19 | 6 | 0 | 16% |
| Topics | 114 | 40 | 0 | 48 | 25 | 1 | 35% |
| JAVA2D | 166 | 118 | 0 | 31 | 16 | 1 | 71% |
| P2D | 28 | 4 | 1 | 23 | 0 | 0 | 14% |
| P3D | 60 | 2 | 0 | 27 | 31 | 0 | 3% |

## 多いエラー（正規化して集計）

| 件数 | エラー | 例 |
|---:|---|---|
| 15 | `java.lang.RuntimeException: $p.createShape is not a function` | GetTessGroups, MultipleWindows, Wiggling |
| 13 | `java.lang.RuntimeException: $p.loadShader is not a function` | LowLevelGLVboInterleaved, LowLevelGLVboSeparate, MeshTweening |
| 10 | `java.lang.RuntimeException: $p.lights is not a function` | MoveEye, Orthographic, Perspective |
| 7 | `java.lang.RuntimeException: $p.loadPixels is not a function` | Graphing2DEquation, Noise2D, Noise3D |
| 7 | `java.lang.RuntimeException: $p.rotateY is not a function` | CubicGridImmediate, Esfera, StaticParticlesImmediate |
| 6 | `java.lang.RuntimeException: $p.loadShape is not a function` | DisableStyle, GetChild, LoadDisplayOBJ |
| 4 | `java.lang.RuntimeException: $p.sphereDetail is not a function` | Spot, Planets, DomeProjection |
| 4 | `java.lang.RuntimeException: $p.rotateX is not a function` | RotateXY, RotatingArcs, RGBCube |
| 3 | `java.lang.RuntimeException: $p.tint is not a function` | Transparency, DynamicParticlesImmediate, Blending |
| 3 | `java.lang.RuntimeException: $p.pointLight is not a function` | Mixture, MixtureGrid, SpaceJunk |
| 2 | `java.lang.RuntimeException: $PFont.list is not a function` | Letters, Words |
| 2 | `java.lang.RuntimeException: $p.rotateZ is not a function` | DepthSort, Zoom |
| 2 | `java.lang.RuntimeException: $p.textureMode is not a function` | Trefoil, TextureCube |
| 2 | `java.lang.RuntimeException: $p.loadXML is not a function` | LoadSaveXML, XMLYahooWeather |
| 2 | `java.lang.RuntimeException: $p.get is not a function` | Spore1, Spore2 |
| 2 | `java.lang.RuntimeException: $PVector.fromAngle is not a function` | WigglePShape, Morph |
| 2 | `java.lang.RuntimeException: $PVector.sub is not a function` | Koch, AccelerationWithVectors |
| 2 | `java.lang.RuntimeException: $PVector.dist is not a function` | Reflection1, Flocking |
| 2 | `java.lang.RuntimeException: $p.textureWrap is not a function` | Deform, InfiniteTiles |
| 1 | `java.lang.RuntimeException: gradient.set is not a function` | WaveGradient |
| 1 | `java.lang.RuntimeException: $p.strokeCap is not a function` | Variables |
| 1 | `java.lang.RuntimeException: $p.bezier is not a function` | Bezier |
| 1 | `java.lang.RuntimeException: img.mask is not a function` | Alphamask |
| 1 | `java.lang.RuntimeException: $p.requestImage is not a function` | RequestImage |
| 1 | `java.lang.RuntimeException: $p.directionalLight is not a function` | Directional |
| 1 | `java.lang.RuntimeException: $p.lightSpecular is not a function` | Reflection |
| 1 | `java.lang.RuntimeException: $p.bezierVertex is not a function` | CompositeObjects |
| 1 | `java.lang.RuntimeException: $p.orientation is not a function` | Particles |
| 1 | `java.lang.RuntimeException: uitang.cross is not a function` | Patch |
| 1 | `java.lang.RuntimeException: $p.parseInt is not a function` | Ribbons |
| 1 | `java.lang.UnsupportedOperationException: processing.core.PMatrix3D is not available in processing-ts` | TessUpdate |
| 1 | `Yellowtail.pde:N:N: error: The import java.awt.Polygon cannot be resolved (the class is not available in processing-ts)` | Yellowtail |
| 1 | `java.lang.RuntimeException: $p.windowTitle is not a function` | MultipleWindows |
| 1 | `java.lang.RuntimeException: pg.smooth is not a function` | OffscreenTest |
| 1 | `java.lang.RuntimeException: $p.windowResizable is not a function` | ResizeTest |
| 1 | `java.lang.UnsupportedOperationException: processing.opengl.PGraphicsOpenGL is not available in processing-ts` | SpecsTest |
| 1 | `java.lang.UnsupportedOperationException: processing.data.IntDict is not available in processing-ts` | CountingStrings |
| 1 | `java.lang.RuntimeException: $p.splitTokens is not a function` | HashMapClass |
| 1 | `java.lang.UnsupportedOperationException: processing.data.IntList is not available in processing-ts` | IntListLottery |
| 1 | `java.lang.RuntimeException: $p.loadTable is not a function` | LoadSaveTable |

## グループ別

| グループ | 本数 | ok | 変換エラー | setup エラー | draw エラー | タイムアウト | ok 率 |
|---|---:|---:|---:|---:|---:|---:|---:|
| Basics/Arrays | 3 | 3 | 0 | 0 | 0 | 0 | 100% |
| Basics/Camera | 3 | 0 | 0 | 0 | 3 | 0 | 0% |
| Basics/Color | 8 | 7 | 0 | 1 | 0 | 0 | 88% |
| Basics/Control | 5 | 5 | 0 | 0 | 0 | 0 | 100% |
| Basics/Data | 6 | 5 | 0 | 1 | 0 | 0 | 83% |
| Basics/Form | 8 | 6 | 0 | 1 | 1 | 0 | 75% |
| Basics/Image | 7 | 4 | 0 | 2 | 1 | 0 | 57% |
| Basics/Input | 12 | 12 | 0 | 0 | 0 | 0 | 100% |
| Basics/Lights | 6 | 0 | 0 | 1 | 5 | 0 | 0% |
| Basics/Math | 20 | 17 | 0 | 0 | 3 | 0 | 85% |
| Basics/Objects | 4 | 3 | 0 | 0 | 1 | 0 | 75% |
| Basics/Shape | 6 | 0 | 0 | 6 | 0 | 0 | 0% |
| Basics/Structure | 10 | 10 | 0 | 0 | 0 | 0 | 100% |
| Basics/Transform | 6 | 4 | 0 | 0 | 2 | 0 | 67% |
| Basics/Typography | 3 | 1 | 0 | 2 | 0 | 0 | 33% |
| Basics/Web | 2 | 2 | 0 | 0 | 0 | 0 | 100% |
| Demos/Graphics | 15 | 0 | 1 | 12 | 2 | 0 | 0% |
| Demos/Performance | 10 | 3 | 0 | 3 | 4 | 0 | 30% |
| Demos/Tests | 6 | 2 | 0 | 4 | 0 | 0 | 33% |
| Topics/Advanced Data | 10 | 2 | 0 | 8 | 0 | 0 | 20% |
| Topics/Animation | 2 | 1 | 0 | 0 | 0 | 1 | 50% |
| Topics/Cellular Automata | 4 | 2 | 0 | 2 | 0 | 0 | 50% |
| Topics/Create Shapes | 10 | 0 | 0 | 10 | 0 | 0 | 0% |
| Topics/Curves | 1 | 0 | 0 | 1 | 0 | 0 | 0% |
| Topics/Drawing | 3 | 3 | 0 | 0 | 0 | 0 | 100% |
| Topics/File IO | 8 | 4 | 0 | 3 | 1 | 0 | 50% |
| Topics/Fractals and L-Systems | 6 | 4 | 0 | 1 | 1 | 0 | 67% |
| Topics/GUI | 4 | 4 | 0 | 0 | 0 | 0 | 100% |
| Topics/Geometry | 7 | 0 | 0 | 0 | 7 | 0 | 0% |
| Topics/Image Processing | 12 | 4 | 0 | 2 | 6 | 0 | 33% |
| Topics/Interaction | 7 | 6 | 0 | 1 | 0 | 0 | 86% |
| Topics/Motion | 10 | 6 | 0 | 4 | 0 | 0 | 60% |
| Topics/Shaders | 15 | 0 | 0 | 15 | 0 | 0 | 0% |
| Topics/Simulate | 7 | 2 | 0 | 0 | 5 | 0 | 29% |
| Topics/Textures | 5 | 0 | 0 | 1 | 4 | 0 | 0% |
| Topics/Vectors | 3 | 2 | 0 | 0 | 1 | 0 | 67% |

## 全スケッチ

| スケッチ | レンダラ | 結果 | 変換 ms | 最初のエラー |
|---|---|---|---:|---|
| Basics/Arrays/Array | JAVA2D | ok | 15 |  |
| Basics/Arrays/Array2D | JAVA2D | ok | 13 |  |
| Basics/Arrays/ArrayObjects | JAVA2D | ok | 16 |  |
| Basics/Camera/MoveEye | P3D | draw | 10 | java.lang.RuntimeException: $p.lights is not a function |
| Basics/Camera/Orthographic | P3D | draw | 12 | java.lang.RuntimeException: $p.lights is not a function |
| Basics/Camera/Perspective | P3D | draw | 12 | java.lang.RuntimeException: $p.lights is not a function |
| Basics/Color/Brightness | JAVA2D | ok | 12 |  |
| Basics/Color/ColorVariables | JAVA2D | ok | 11 |  |
| Basics/Color/Hue | JAVA2D | ok | 11 |  |
| Basics/Color/LinearGradient | JAVA2D | ok | 14 |  |
| Basics/Color/RadialGradient | JAVA2D | ok | 13 |  |
| Basics/Color/Relativity | JAVA2D | ok | 14 |  |
| Basics/Color/Saturation | JAVA2D | ok | 12 |  |
| Basics/Color/WaveGradient | JAVA2D | setup | 15 | java.lang.RuntimeException: gradient.set is not a function |
| Basics/Control/Conditionals1 | JAVA2D | ok | 11 |  |
| Basics/Control/Conditionals2 | JAVA2D | ok | 12 |  |
| Basics/Control/EmbeddedIteration | JAVA2D | ok | 11 |  |
| Basics/Control/Iteration | JAVA2D | ok | 12 |  |
| Basics/Control/LogicalOperators | JAVA2D | ok | 12 |  |
| Basics/Data/CharactersStrings | JAVA2D | ok | 12 |  |
| Basics/Data/DatatypeConversion | JAVA2D | ok | 13 |  |
| Basics/Data/IntegersFloats | JAVA2D | ok | 11 |  |
| Basics/Data/TrueFalse | JAVA2D | ok | 11 |  |
| Basics/Data/VariableScope | JAVA2D | ok | 13 |  |
| Basics/Data/Variables | JAVA2D | setup | 12 | java.lang.RuntimeException: $p.strokeCap is not a function |
| Basics/Form/Bezier | JAVA2D | draw | 13 | java.lang.RuntimeException: $p.bezier is not a function |
| Basics/Form/PieChart | JAVA2D | ok | 13 |  |
| Basics/Form/PointsLines | JAVA2D | ok | 11 |  |
| Basics/Form/Primitives3D | P3D | setup | 11 | java.lang.RuntimeException: $p.lights is not a function |
| Basics/Form/RegularPolygon | JAVA2D | ok | 16 |  |
| Basics/Form/ShapePrimitives | JAVA2D | ok | 10 |  |
| Basics/Form/Star | JAVA2D | ok | 15 |  |
| Basics/Form/TriangleStrip | JAVA2D | ok | 13 |  |
| Basics/Image/Alphamask | JAVA2D | setup | 11 | java.lang.RuntimeException: img.mask is not a function |
| Basics/Image/BackgroundImage | JAVA2D | ok | 11 |  |
| Basics/Image/CreateImage | JAVA2D | ok | 12 |  |
| Basics/Image/LoadDisplayImage | JAVA2D | ok | 11 |  |
| Basics/Image/Pointillism | JAVA2D | ok | 14 |  |
| Basics/Image/RequestImage | JAVA2D | setup | 15 | java.lang.RuntimeException: $p.requestImage is not a function |
| Basics/Image/Transparency | JAVA2D | draw | 13 | java.lang.RuntimeException: $p.tint is not a function |
| Basics/Input/Clock | JAVA2D | ok | 16 |  |
| Basics/Input/Constrain | JAVA2D | ok | 12 |  |
| Basics/Input/Easing | JAVA2D | ok | 12 |  |
| Basics/Input/Keyboard | JAVA2D | ok | 13 |  |
| Basics/Input/KeyboardFunctions | JAVA2D | ok | 15 |  |
| Basics/Input/Milliseconds | JAVA2D | ok | 12 |  |
| Basics/Input/Mouse1D | JAVA2D | ok | 12 |  |
| Basics/Input/Mouse2D | JAVA2D | ok | 11 |  |
| Basics/Input/MouseFunctions | JAVA2D | ok | 13 |  |
| Basics/Input/MousePress | JAVA2D | ok | 10 |  |
| Basics/Input/MouseSignals | JAVA2D | ok | 16 |  |
| Basics/Input/StoringInput | JAVA2D | ok | 13 |  |
| Basics/Lights/Directional | P3D | draw | 12 | java.lang.RuntimeException: $p.directionalLight is not a function |
| Basics/Lights/Mixture | P3D | draw | 11 | java.lang.RuntimeException: $p.pointLight is not a function |
| Basics/Lights/MixtureGrid | P3D | draw | 14 | java.lang.RuntimeException: $p.pointLight is not a function |
| Basics/Lights/OnOff | P3D | draw | 12 | java.lang.RuntimeException: $p.lights is not a function |
| Basics/Lights/Reflection | P3D | draw | 12 | java.lang.RuntimeException: $p.lightSpecular is not a function |
| Basics/Lights/Spot | P3D | setup | 11 | java.lang.RuntimeException: $p.sphereDetail is not a function |
| Basics/Math/AdditiveWave | JAVA2D | ok | 16 |  |
| Basics/Math/Arctangent | JAVA2D | ok | 14 |  |
| Basics/Math/Distance1D | JAVA2D | ok | 14 |  |
| Basics/Math/Distance2D | JAVA2D | ok | 12 |  |
| Basics/Math/DoubleRandom | JAVA2D | ok | 12 |  |
| Basics/Math/Graphing2DEquation | JAVA2D | draw | 14 | java.lang.RuntimeException: $p.loadPixels is not a function |
| Basics/Math/IncrementDecrement | JAVA2D | ok | 12 |  |
| Basics/Math/Interpolate | JAVA2D | ok | 10 |  |
| Basics/Math/Map | JAVA2D | ok | 10 |  |
| Basics/Math/Noise1D | JAVA2D | ok | 12 |  |
| Basics/Math/Noise2D | JAVA2D | draw | 12 | java.lang.RuntimeException: $p.loadPixels is not a function |
| Basics/Math/Noise3D | JAVA2D | draw | 12 | java.lang.RuntimeException: $p.loadPixels is not a function |
| Basics/Math/NoiseWave | JAVA2D | ok | 11 |  |
| Basics/Math/OperatorPrecedence | JAVA2D | ok | 13 |  |
| Basics/Math/PolarToCartesian | JAVA2D | ok | 12 |  |
| Basics/Math/Random | JAVA2D | ok | 11 |  |
| Basics/Math/RandomGaussian | JAVA2D | ok | 11 |  |
| Basics/Math/Sine | JAVA2D | ok | 12 |  |
| Basics/Math/SineCosine | JAVA2D | ok | 13 |  |
| Basics/Math/SineWave | JAVA2D | ok | 16 |  |
| Basics/Objects/CompositeObjects | JAVA2D | draw | 18 | java.lang.RuntimeException: $p.bezierVertex is not a function |
| Basics/Objects/Inheritance | JAVA2D | ok | 16 |  |
| Basics/Objects/MultipleConstructors | JAVA2D | ok | 14 |  |
| Basics/Objects/Objects | JAVA2D | ok | 16 |  |
| Basics/Shape/DisableStyle | JAVA2D | setup | 12 | java.lang.RuntimeException: $p.loadShape is not a function |
| Basics/Shape/GetChild | JAVA2D | setup | 12 | java.lang.RuntimeException: $p.loadShape is not a function |
| Basics/Shape/LoadDisplayOBJ | P3D | setup | 11 | java.lang.RuntimeException: $p.loadShape is not a function |
| Basics/Shape/LoadDisplaySVG | JAVA2D | setup | 10 | java.lang.RuntimeException: $p.loadShape is not a function |
| Basics/Shape/ScaleShape | JAVA2D | setup | 11 | java.lang.RuntimeException: $p.loadShape is not a function |
| Basics/Shape/ShapeVertices | JAVA2D | setup | 14 | java.lang.RuntimeException: $p.loadShape is not a function |
| Basics/Structure/Coordinates | JAVA2D | ok | 10 |  |
| Basics/Structure/CreateGraphics | JAVA2D | ok | 12 |  |
| Basics/Structure/Functions | JAVA2D | ok | 12 |  |
| Basics/Structure/Loop | JAVA2D | ok | 11 |  |
| Basics/Structure/NoLoop | JAVA2D | ok | 11 |  |
| Basics/Structure/Recursion | JAVA2D | ok | 12 |  |
| Basics/Structure/Redraw | JAVA2D | ok | 12 |  |
| Basics/Structure/SetupDraw | JAVA2D | ok | 11 |  |
| Basics/Structure/StatementsComments | JAVA2D | ok | 9 |  |
| Basics/Structure/WidthHeight | JAVA2D | ok | 13 |  |
| Basics/Transform/Arm | JAVA2D | ok | 13 |  |
| Basics/Transform/Rotate | JAVA2D | ok | 12 |  |
| Basics/Transform/RotatePushPop | P3D | draw | 13 | java.lang.RuntimeException: $p.lights is not a function |
| Basics/Transform/RotateXY | P3D | draw | 12 | java.lang.RuntimeException: $p.rotateX is not a function |
| Basics/Transform/Scale | JAVA2D | ok | 11 |  |
| Basics/Transform/Translate | JAVA2D | ok | 12 |  |
| Basics/Typography/Letters | JAVA2D | setup | 13 | java.lang.RuntimeException: $PFont.list is not a function |
| Basics/Typography/TextRotation | JAVA2D | ok | 13 |  |
| Basics/Typography/Words | JAVA2D | setup | 13 | java.lang.RuntimeException: $PFont.list is not a function |
| Basics/Web/EmbeddedLinks | JAVA2D | ok | 12 |  |
| Basics/Web/LoadingImages | JAVA2D | ok | 13 |  |
| Demos/Graphics/DepthSort | P3D | draw | 13 | java.lang.RuntimeException: $p.rotateZ is not a function |
| Demos/Graphics/GetTessGroups | P3D | setup | 13 | java.lang.RuntimeException: $p.createShape is not a function |
| Demos/Graphics/LowLevelGLVboInterleaved | P3D | setup | 18 | java.lang.RuntimeException: $p.loadShader is not a function |
| Demos/Graphics/LowLevelGLVboSeparate | P3D | setup | 20 | java.lang.RuntimeException: $p.loadShader is not a function |
| Demos/Graphics/MeshTweening | P3D | setup | 16 | java.lang.RuntimeException: $p.loadShader is not a function |
| Demos/Graphics/MultipleWindows | P2D | setup | 20 | java.lang.RuntimeException: $p.createShape is not a function |
| Demos/Graphics/Particles | P2D | setup | 21 | java.lang.RuntimeException: $p.orientation is not a function |
| Demos/Graphics/Patch | P3D | setup | 22 | java.lang.RuntimeException: uitang.cross is not a function |
| Demos/Graphics/Planets | P3D | setup | 26 | java.lang.RuntimeException: $p.sphereDetail is not a function |
| Demos/Graphics/Ribbons | P3D | setup | 43 | java.lang.RuntimeException: $p.parseInt is not a function |
| Demos/Graphics/RotatingArcs | P3D | draw | 20 | java.lang.RuntimeException: $p.rotateX is not a function |
| Demos/Graphics/TessUpdate | P3D | setup | 18 | java.lang.UnsupportedOperationException: processing.core.PMatrix3D is not available in processing-ts |
| Demos/Graphics/Trefoil | P3D | setup | 21 | java.lang.RuntimeException: $p.textureMode is not a function |
| Demos/Graphics/Wiggling | P3D | setup | 20 | java.lang.RuntimeException: $p.createShape is not a function |
| Demos/Graphics/Yellowtail | P2D | transpile | 24 | Yellowtail.pde:16:1: error: The import java.awt.Polygon cannot be resolved (the class is not availab |
| Demos/Performance/CubicGridImmediate | P3D | draw | 15 | java.lang.RuntimeException: $p.rotateY is not a function |
| Demos/Performance/CubicGridRetained | P3D | setup | 16 | java.lang.RuntimeException: $p.createShape is not a function |
| Demos/Performance/DynamicParticlesImmediate | P3D | draw | 19 | java.lang.RuntimeException: $p.tint is not a function |
| Demos/Performance/DynamicParticlesRetained | P3D | setup | 19 | java.lang.RuntimeException: $p.createShape is not a function |
| Demos/Performance/Esfera | P3D | draw | 18 | java.lang.RuntimeException: $p.rotateY is not a function |
| Demos/Performance/LineRendering | P2D | ok | 12 |  |
| Demos/Performance/QuadRendering | P2D | ok | 25 |  |
| Demos/Performance/StaticParticlesImmediate | P3D | draw | 31 | java.lang.RuntimeException: $p.rotateY is not a function |
| Demos/Performance/StaticParticlesRetained | P3D | setup | 25 | java.lang.RuntimeException: $p.createShape is not a function |
| Demos/Performance/TextRendering | P2D | ok | 15 |  |
| Demos/Tests/MultipleWindows | P3D | setup | 40 | java.lang.RuntimeException: $p.windowTitle is not a function |
| Demos/Tests/NoBackgroundTest | P2D | ok | 14 |  |
| Demos/Tests/OffscreenTest | P3D | setup | 14 | java.lang.RuntimeException: pg.smooth is not a function |
| Demos/Tests/RedrawTest | P3D | ok | 12 |  |
| Demos/Tests/ResizeTest | P3D | setup | 11 | java.lang.RuntimeException: $p.windowResizable is not a function |
| Demos/Tests/SpecsTest | P3D | setup | 12 | java.lang.UnsupportedOperationException: processing.opengl.PGraphicsOpenGL is not available in proce |
| Topics/Advanced Data/ArrayListClass | JAVA2D | ok | 18 |  |
| Topics/Advanced Data/CountingStrings | JAVA2D | setup | 16 | java.lang.UnsupportedOperationException: processing.data.IntDict is not available in processing-ts |
| Topics/Advanced Data/HashMapClass | JAVA2D | setup | 21 | java.lang.RuntimeException: $p.splitTokens is not a function |
| Topics/Advanced Data/IntListLottery | JAVA2D | setup | 18 | java.lang.UnsupportedOperationException: processing.data.IntList is not available in processing-ts |
| Topics/Advanced Data/LoadSaveJSON | JAVA2D | ok | 20 |  |
| Topics/Advanced Data/LoadSaveTable | JAVA2D | setup | 19 | java.lang.RuntimeException: $p.loadTable is not a function |
| Topics/Advanced Data/LoadSaveXML | JAVA2D | setup | 20 | java.lang.RuntimeException: $p.loadXML is not a function |
| Topics/Advanced Data/Regex | JAVA2D | setup | 14 | java.lang.ArrayIndexOutOfBoundsException: Index 0 out of bounds for length undefined |
| Topics/Advanced Data/Threads | JAVA2D | setup | 18 | java.lang.RuntimeException: $p.thread is not a function |
| Topics/Advanced Data/XMLYahooWeather | JAVA2D | setup | 14 | java.lang.RuntimeException: $p.loadXML is not a function |
| Topics/Animation/AnimatedSprite | JAVA2D | ok | 18 |  |
| Topics/Animation/Sequential | JAVA2D | timeout | 0 | timed out after 20000ms |
| Topics/Cellular Automata/GameOfLife | JAVA2D | ok | 19 |  |
| Topics/Cellular Automata/Spore1 | JAVA2D | setup | 25 | java.lang.RuntimeException: $p.get is not a function |
| Topics/Cellular Automata/Spore2 | JAVA2D | setup | 28 | java.lang.RuntimeException: $p.get is not a function |
| Topics/Cellular Automata/Wolfram | JAVA2D | ok | 22 |  |
| Topics/Create Shapes/BeginEndContour | P2D | setup | 16 | java.lang.RuntimeException: $p.createShape is not a function |
| Topics/Create Shapes/GroupPShape | P2D | setup | 18 | java.lang.RuntimeException: $p.createShape is not a function |
| Topics/Create Shapes/ParticleSystemPShape | P2D | setup | 26 | java.lang.RuntimeException: $p.createShape is not a function |
| Topics/Create Shapes/PathPShape | P2D | setup | 14 | java.lang.RuntimeException: $p.createShape is not a function |
| Topics/Create Shapes/PolygonPShape | P2D | setup | 13 | java.lang.RuntimeException: $p.createShape is not a function |
| Topics/Create Shapes/PolygonPShapeOOP | P2D | setup | 16 | java.lang.RuntimeException: $p.createShape is not a function |
| Topics/Create Shapes/PolygonPShapeOOP2 | P2D | setup | 18 | java.lang.RuntimeException: $p.createShape is not a function |
| Topics/Create Shapes/PolygonPShapeOOP3 | P2D | setup | 21 | java.lang.RuntimeException: $p.createShape is not a function |
| Topics/Create Shapes/PrimitivePShape | P2D | setup | 13 | java.lang.RuntimeException: $p.createShape is not a function |
| Topics/Create Shapes/WigglePShape | P2D | setup | 20 | java.lang.RuntimeException: $PVector.fromAngle is not a function |
| Topics/Curves/ArcLengthParametrization | P2D | setup | 28 | java.lang.RuntimeException: a.get is not a function |
| Topics/Drawing/ContinuousLines | JAVA2D | ok | 12 |  |
| Topics/Drawing/Pattern | JAVA2D | ok | 13 |  |
| Topics/Drawing/Pulses | JAVA2D | ok | 14 |  |
| Topics/File IO/DirectoryList | JAVA2D | setup | 20 | java.lang.RuntimeException: $p.sketchPath is not a function |
| Topics/File IO/LoadFile1 | JAVA2D | ok | 15 |  |
| Topics/File IO/LoadFile2 | JAVA2D | setup | 21 | java.lang.RuntimeException: $p.loadFont is not a function |
| Topics/File IO/SaveFile1 | JAVA2D | ok | 16 |  |
| Topics/File IO/SaveFile2 | JAVA2D | setup | 14 | java.lang.RuntimeException: $p.createWriter is not a function |
| Topics/File IO/SaveFrames | JAVA2D | ok | 15 |  |
| Topics/File IO/SaveOneImage | JAVA2D | ok | 11 |  |
| Topics/File IO/TileImages | JAVA2D | draw | 15 | java.lang.RuntimeException: $p.save is not a function |
| Topics/Fractals and L-Systems/Koch | JAVA2D | draw | 22 | java.lang.RuntimeException: $PVector.sub is not a function |
| Topics/Fractals and L-Systems/Mandelbrot | JAVA2D | setup | 16 | java.lang.RuntimeException: $p.loadPixels is not a function |
| Topics/Fractals and L-Systems/PenroseSnowflake | JAVA2D | ok | 22 |  |
| Topics/Fractals and L-Systems/PenroseTile | JAVA2D | ok | 23 |  |
| Topics/Fractals and L-Systems/Pentigree | JAVA2D | ok | 25 |  |
| Topics/Fractals and L-Systems/Tree | JAVA2D | ok | 16 |  |
| Topics/GUI/Button | JAVA2D | ok | 19 |  |
| Topics/GUI/Handles | JAVA2D | ok | 21 |  |
| Topics/GUI/Rollover | JAVA2D | ok | 17 |  |
| Topics/GUI/Scrollbar | JAVA2D | ok | 22 |  |
| Topics/Geometry/Icosahedra | P3D | draw | 29 | java.lang.RuntimeException: $p.lights is not a function |
| Topics/Geometry/NoiseSphere | P3D | draw | 20 | java.lang.RuntimeException: $p.rotateY is not a function |
| Topics/Geometry/RGBCube | P3D | draw | 19 | java.lang.RuntimeException: $p.rotateX is not a function |
| Topics/Geometry/ShapeTransform | P3D | draw | 20 | java.lang.RuntimeException: $p.lights is not a function |
| Topics/Geometry/SpaceJunk | P3D | draw | 21 | java.lang.RuntimeException: $p.pointLight is not a function |
| Topics/Geometry/Toroid | P3D | draw | 21 | java.lang.RuntimeException: $p.lights is not a function |
| Topics/Geometry/Vertices | P3D | draw | 17 | java.lang.RuntimeException: $p.lights is not a function |
| Topics/Image Processing/Blending | P3D | draw | 17 | java.lang.RuntimeException: $p.tint is not a function |
| Topics/Image Processing/Blur | JAVA2D | ok | 17 |  |
| Topics/Image Processing/BrightnessPixels | JAVA2D | setup | 15 | java.lang.RuntimeException: $p.loadPixels is not a function |
| Topics/Image Processing/Convolution | JAVA2D | draw | 22 | java.lang.RuntimeException: $p.loadPixels is not a function |
| Topics/Image Processing/EdgeDetection | JAVA2D | draw | 17 | java.lang.RuntimeException: img.copy is not a function |
| Topics/Image Processing/Explode | P3D | ok | 17 |  |
| Topics/Image Processing/Extrusion | P3D | draw | 17 | java.lang.RuntimeException: $p.rotateY is not a function |
| Topics/Image Processing/Histogram | JAVA2D | ok | 15 |  |
| Topics/Image Processing/LinearImage | JAVA2D | setup | 15 | java.lang.RuntimeException: $p.loadPixels is not a function |
| Topics/Image Processing/PixelArray | JAVA2D | draw | 15 | java.lang.ArithmeticException: / by zero |
| Topics/Image Processing/Sharpen | JAVA2D | ok | 17 |  |
| Topics/Image Processing/Zoom | P3D | draw | 17 | java.lang.RuntimeException: $p.rotateZ is not a function |
| Topics/Interaction/Follow1 | JAVA2D | ok | 14 |  |
| Topics/Interaction/Follow2 | JAVA2D | ok | 15 |  |
| Topics/Interaction/Follow3 | JAVA2D | ok | 15 |  |
| Topics/Interaction/Reach1 | JAVA2D | ok | 14 |  |
| Topics/Interaction/Reach2 | JAVA2D | ok | 17 |  |
| Topics/Interaction/Reach3 | JAVA2D | ok | 19 |  |
| Topics/Interaction/Tickle | JAVA2D | setup | 14 | java.lang.RuntimeException: $p.textAscent is not a function |
| Topics/Motion/Bounce | JAVA2D | ok | 14 |  |
| Topics/Motion/BouncyBubbles | JAVA2D | ok | 20 |  |
| Topics/Motion/Brownian | JAVA2D | ok | 16 |  |
| Topics/Motion/CircleCollision | JAVA2D | setup | 24 | java.lang.RuntimeException: $PVector.random2D is not a function |
| Topics/Motion/CubesWithinCube | P3D | setup | 25 | java.lang.RuntimeException: $PVector.random3D is not a function |
| Topics/Motion/Linear | JAVA2D | ok | 13 |  |
| Topics/Motion/Morph | JAVA2D | setup | 21 | java.lang.RuntimeException: $PVector.fromAngle is not a function |
| Topics/Motion/MovingOnCurves | JAVA2D | ok | 14 |  |
| Topics/Motion/Reflection1 | JAVA2D | setup | 20 | java.lang.RuntimeException: $PVector.dist is not a function |
| Topics/Motion/Reflection2 | JAVA2D | ok | 23 |  |
| Topics/Shaders/BlurFilter | P2D | setup | 12 | java.lang.RuntimeException: $p.loadShader is not a function |
| Topics/Shaders/Conway | P3D | setup | 16 | java.lang.RuntimeException: pg.noSmooth is not a function |
| Topics/Shaders/CustomBlend | P2D | setup | 19 | java.lang.RuntimeException: $p.loadShader is not a function |
| Topics/Shaders/Deform | P2D | setup | 14 | java.lang.RuntimeException: $p.textureWrap is not a function |
| Topics/Shaders/DomeProjection | P3D | setup | 23 | java.lang.RuntimeException: $p.sphereDetail is not a function |
| Topics/Shaders/EdgeDetect | P2D | setup | 13 | java.lang.RuntimeException: $p.loadShader is not a function |
| Topics/Shaders/EdgeFilter | P3D | setup | 15 | java.lang.RuntimeException: $p.loadShader is not a function |
| Topics/Shaders/GlossyFishEye | P3D | setup | 19 | java.lang.RuntimeException: $p.loadShader is not a function |
| Topics/Shaders/ImageMask | P2D | setup | 14 | java.lang.RuntimeException: maskImage.noSmooth is not a function |
| Topics/Shaders/InfiniteTiles | P2D | setup | 15 | java.lang.RuntimeException: $p.textureWrap is not a function |
| Topics/Shaders/Landscape | P2D | setup | 14 | java.lang.RuntimeException: $p.loadShader is not a function |
| Topics/Shaders/Monjori | P2D | setup | 12 | java.lang.RuntimeException: $p.loadShader is not a function |
| Topics/Shaders/Nebula | P2D | setup | 13 | java.lang.RuntimeException: $p.loadShader is not a function |
| Topics/Shaders/SepBlur | P2D | setup | 17 | java.lang.RuntimeException: $p.loadShader is not a function |
| Topics/Shaders/ToonShading | P3D | setup | 15 | java.lang.RuntimeException: $p.loadShader is not a function |
| Topics/Simulate/Flocking | JAVA2D | draw | 25 | java.lang.RuntimeException: $PVector.dist is not a function |
| Topics/Simulate/ForcesWithVectors | JAVA2D | draw | 21 | java.lang.RuntimeException: $PVector.div is not a function |
| Topics/Simulate/GravitationalAttraction3D | P3D | draw | 21 | java.lang.RuntimeException: $p.sphereDetail is not a function |
| Topics/Simulate/MultipleParticleSystems | JAVA2D | ok | 22 |  |
| Topics/Simulate/SimpleParticleSystem | JAVA2D | ok | 20 |  |
| Topics/Simulate/SmokeParticleSystem | JAVA2D | draw | 22 | java.lang.RuntimeException: v.heading is not a function |
| Topics/Simulate/SoftBody | JAVA2D | draw | 18 | java.lang.RuntimeException: $p.curveTightness is not a function |
| Topics/Textures/TextureCube | P3D | setup | 19 | java.lang.RuntimeException: $p.textureMode is not a function |
| Topics/Textures/TextureCylinder | P3D | draw | 16 | java.lang.RuntimeException: $p.rotateX is not a function |
| Topics/Textures/TextureQuad | P3D | draw | 13 | java.lang.RuntimeException: $p.rotateY is not a function |
| Topics/Textures/TextureSphere | P3D | draw | 22 | java.lang.RuntimeException: $p.camera is not a function |
| Topics/Textures/TextureTriangle | P3D | draw | 13 | java.lang.RuntimeException: $p.rotateY is not a function |
| Topics/Vectors/AccelerationWithVectors | JAVA2D | draw | 16 | java.lang.RuntimeException: $PVector.sub is not a function |
| Topics/Vectors/BouncingBall | JAVA2D | ok | 15 |  |
| Topics/Vectors/VectorMath | JAVA2D | ok | 14 |  |
