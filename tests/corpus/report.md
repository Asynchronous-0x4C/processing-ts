# 互換性コーパス（Processing 同梱 examples）

`npm run vt -- corpus` の出力（2026-10-06）。Processing 4.5.2 の同梱 examples をヘッドレス Chromium で変換し、setup + draw 5 回を実行した結果。
「ok」はエラーなく完走したことだけを意味し、見た目の一致は確認していない。

## 集計

| 区分 | 本数 | ok | 変換エラー | setup エラー | draw エラー | タイムアウト | ok 率 |
|---|---:|---:|---:|---:|---:|---:|---:|
| **全体** | 254 | 156 | 1 | 61 | 35 | 1 | 61% |
| Basics | 109 | 90 | 0 | 9 | 10 | 0 | 83% |
| Demos | 31 | 6 | 1 | 17 | 7 | 0 | 19% |
| Topics | 114 | 60 | 0 | 35 | 18 | 1 | 53% |
| JAVA2D | 166 | 147 | 0 | 15 | 3 | 1 | 89% |
| P2D | 28 | 5 | 1 | 22 | 0 | 0 | 18% |
| P3D | 60 | 4 | 0 | 24 | 32 | 0 | 7% |

## 多いエラー（正規化して集計）

| 件数 | エラー | 例 |
|---:|---|---|
| 16 | `java.lang.RuntimeException: $p.createShape is not a function` | GetTessGroups, MultipleWindows, Wiggling |
| 15 | `java.lang.RuntimeException: $p.loadShader is not a function` | LowLevelGLVboInterleaved, LowLevelGLVboSeparate, MeshTweening |
| 12 | `java.lang.RuntimeException: $p.lights is not a function` | MoveEye, Orthographic, Perspective |
| 7 | `java.lang.RuntimeException: $p.rotateY is not a function` | CubicGridImmediate, Esfera, StaticParticlesImmediate |
| 6 | `java.lang.RuntimeException: $p.loadShape is not a function` | DisableStyle, GetChild, LoadDisplayOBJ |
| 4 | `java.lang.RuntimeException: $p.sphereDetail is not a function` | Spot, Planets, DomeProjection |
| 4 | `java.lang.RuntimeException: $p.rotateX is not a function` | RotateXY, RotatingArcs, RGBCube |
| 3 | `java.lang.RuntimeException: $p.pointLight is not a function` | Mixture, MixtureGrid, SpaceJunk |
| 2 | `java.lang.RuntimeException: $p.rotateZ is not a function` | DepthSort, Zoom |
| 2 | `java.lang.RuntimeException: $p.textureMode is not a function` | Trefoil, TextureCube |
| 2 | `java.lang.RuntimeException: $p.loadXML is not a function` | LoadSaveXML, XMLYahooWeather |
| 2 | `java.lang.RuntimeException: $p.textureWrap is not a function` | Deform, InfiniteTiles |
| 1 | `java.lang.RuntimeException: $p.requestImage is not a function` | RequestImage |
| 1 | `java.lang.RuntimeException: $p.directionalLight is not a function` | Directional |
| 1 | `java.lang.RuntimeException: $p.lightSpecular is not a function` | Reflection |
| 1 | `java.lang.RuntimeException: $p.orientation is not a function` | Particles |
| 1 | `java.lang.RuntimeException: $p.parseInt is not a function` | Ribbons |
| 1 | `java.lang.UnsupportedOperationException: processing.core.PMatrix3D is not available in processing-ts` | TessUpdate |
| 1 | `Yellowtail.pde:N:N: error: The import java.awt.Polygon cannot be resolved (the class is not available in processing-ts)` | Yellowtail |
| 1 | `java.lang.RuntimeException: $p.texture is not a function` | DynamicParticlesImmediate |
| 1 | `java.lang.RuntimeException: $p.windowTitle is not a function` | MultipleWindows |
| 1 | `java.lang.RuntimeException: $p.windowResizable is not a function` | ResizeTest |
| 1 | `java.lang.UnsupportedOperationException: processing.opengl.PGraphicsOpenGL is not available in processing-ts` | SpecsTest |
| 1 | `java.lang.UnsupportedOperationException: processing.data.IntDict is not available in processing-ts` | CountingStrings |
| 1 | `java.lang.UnsupportedOperationException: processing.data.IntList is not available in processing-ts` | IntListLottery |
| 1 | `java.lang.RuntimeException: $p.loadTable is not a function` | LoadSaveTable |
| 1 | `java.lang.ArrayIndexOutOfBoundsException: Index N out of bounds for length undefined` | Regex |
| 1 | `java.lang.RuntimeException: $p.thread is not a function` | Threads |
| 1 | `timed out after 20000ms` | Sequential |
| 1 | `java.lang.RuntimeException: $p.sketchPath is not a function` | DirectoryList |
| 1 | `java.lang.RuntimeException: $p.createWriter is not a function` | SaveFile2 |
| 1 | `java.lang.RuntimeException: $p.save is not a function` | TileImages |
| 1 | `java.lang.NullPointerException` | EdgeDetection |
| 1 | `java.lang.ArithmeticException: / by zero` | PixelArray |
| 1 | `java.lang.RuntimeException: $p.camera is not a function` | TextureSphere |

## グループ別

| グループ | 本数 | ok | 変換エラー | setup エラー | draw エラー | タイムアウト | ok 率 |
|---|---:|---:|---:|---:|---:|---:|---:|
| Basics/Arrays | 3 | 3 | 0 | 0 | 0 | 0 | 100% |
| Basics/Camera | 3 | 0 | 0 | 0 | 3 | 0 | 0% |
| Basics/Color | 8 | 8 | 0 | 0 | 0 | 0 | 100% |
| Basics/Control | 5 | 5 | 0 | 0 | 0 | 0 | 100% |
| Basics/Data | 6 | 6 | 0 | 0 | 0 | 0 | 100% |
| Basics/Form | 8 | 7 | 0 | 1 | 0 | 0 | 88% |
| Basics/Image | 7 | 6 | 0 | 1 | 0 | 0 | 86% |
| Basics/Input | 12 | 12 | 0 | 0 | 0 | 0 | 100% |
| Basics/Lights | 6 | 0 | 0 | 1 | 5 | 0 | 0% |
| Basics/Math | 20 | 20 | 0 | 0 | 0 | 0 | 100% |
| Basics/Objects | 4 | 4 | 0 | 0 | 0 | 0 | 100% |
| Basics/Shape | 6 | 0 | 0 | 6 | 0 | 0 | 0% |
| Basics/Structure | 10 | 10 | 0 | 0 | 0 | 0 | 100% |
| Basics/Transform | 6 | 4 | 0 | 0 | 2 | 0 | 67% |
| Basics/Typography | 3 | 3 | 0 | 0 | 0 | 0 | 100% |
| Basics/Web | 2 | 2 | 0 | 0 | 0 | 0 | 100% |
| Demos/Graphics | 15 | 0 | 1 | 11 | 3 | 0 | 0% |
| Demos/Performance | 10 | 3 | 0 | 3 | 4 | 0 | 30% |
| Demos/Tests | 6 | 3 | 0 | 3 | 0 | 0 | 50% |
| Topics/Advanced Data | 10 | 3 | 0 | 7 | 0 | 0 | 30% |
| Topics/Animation | 2 | 1 | 0 | 0 | 0 | 1 | 50% |
| Topics/Cellular Automata | 4 | 4 | 0 | 0 | 0 | 0 | 100% |
| Topics/Create Shapes | 10 | 0 | 0 | 10 | 0 | 0 | 0% |
| Topics/Curves | 1 | 1 | 0 | 0 | 0 | 0 | 100% |
| Topics/Drawing | 3 | 3 | 0 | 0 | 0 | 0 | 100% |
| Topics/File IO | 8 | 5 | 0 | 2 | 1 | 0 | 63% |
| Topics/Fractals and L-Systems | 6 | 6 | 0 | 0 | 0 | 0 | 100% |
| Topics/GUI | 4 | 4 | 0 | 0 | 0 | 0 | 100% |
| Topics/Geometry | 7 | 0 | 0 | 0 | 7 | 0 | 0% |
| Topics/Image Processing | 12 | 8 | 0 | 0 | 4 | 0 | 67% |
| Topics/Interaction | 7 | 7 | 0 | 0 | 0 | 0 | 100% |
| Topics/Motion | 10 | 9 | 0 | 0 | 1 | 0 | 90% |
| Topics/Shaders | 15 | 0 | 0 | 15 | 0 | 0 | 0% |
| Topics/Simulate | 7 | 6 | 0 | 0 | 1 | 0 | 86% |
| Topics/Textures | 5 | 0 | 0 | 1 | 4 | 0 | 0% |
| Topics/Vectors | 3 | 3 | 0 | 0 | 0 | 0 | 100% |

## 全スケッチ

| スケッチ | レンダラ | 結果 | 変換 ms | 最初のエラー |
|---|---|---|---:|---|
| Basics/Arrays/Array | JAVA2D | ok | 16 |  |
| Basics/Arrays/Array2D | JAVA2D | ok | 14 |  |
| Basics/Arrays/ArrayObjects | JAVA2D | ok | 17 |  |
| Basics/Camera/MoveEye | P3D | draw | 11 | java.lang.RuntimeException: $p.lights is not a function |
| Basics/Camera/Orthographic | P3D | draw | 14 | java.lang.RuntimeException: $p.lights is not a function |
| Basics/Camera/Perspective | P3D | draw | 14 | java.lang.RuntimeException: $p.lights is not a function |
| Basics/Color/Brightness | JAVA2D | ok | 12 |  |
| Basics/Color/ColorVariables | JAVA2D | ok | 12 |  |
| Basics/Color/Hue | JAVA2D | ok | 12 |  |
| Basics/Color/LinearGradient | JAVA2D | ok | 15 |  |
| Basics/Color/RadialGradient | JAVA2D | ok | 13 |  |
| Basics/Color/Relativity | JAVA2D | ok | 15 |  |
| Basics/Color/Saturation | JAVA2D | ok | 12 |  |
| Basics/Color/WaveGradient | JAVA2D | ok | 17 |  |
| Basics/Control/Conditionals1 | JAVA2D | ok | 11 |  |
| Basics/Control/Conditionals2 | JAVA2D | ok | 13 |  |
| Basics/Control/EmbeddedIteration | JAVA2D | ok | 12 |  |
| Basics/Control/Iteration | JAVA2D | ok | 13 |  |
| Basics/Control/LogicalOperators | JAVA2D | ok | 13 |  |
| Basics/Data/CharactersStrings | JAVA2D | ok | 14 |  |
| Basics/Data/DatatypeConversion | JAVA2D | ok | 12 |  |
| Basics/Data/IntegersFloats | JAVA2D | ok | 12 |  |
| Basics/Data/TrueFalse | JAVA2D | ok | 13 |  |
| Basics/Data/VariableScope | JAVA2D | ok | 14 |  |
| Basics/Data/Variables | JAVA2D | ok | 14 |  |
| Basics/Form/Bezier | JAVA2D | ok | 12 |  |
| Basics/Form/PieChart | JAVA2D | ok | 14 |  |
| Basics/Form/PointsLines | JAVA2D | ok | 12 |  |
| Basics/Form/Primitives3D | P3D | setup | 12 | java.lang.RuntimeException: $p.lights is not a function |
| Basics/Form/RegularPolygon | JAVA2D | ok | 14 |  |
| Basics/Form/ShapePrimitives | JAVA2D | ok | 11 |  |
| Basics/Form/Star | JAVA2D | ok | 15 |  |
| Basics/Form/TriangleStrip | JAVA2D | ok | 14 |  |
| Basics/Image/Alphamask | JAVA2D | ok | 13 |  |
| Basics/Image/BackgroundImage | JAVA2D | ok | 12 |  |
| Basics/Image/CreateImage | JAVA2D | ok | 13 |  |
| Basics/Image/LoadDisplayImage | JAVA2D | ok | 12 |  |
| Basics/Image/Pointillism | JAVA2D | ok | 13 |  |
| Basics/Image/RequestImage | JAVA2D | setup | 19 | java.lang.RuntimeException: $p.requestImage is not a function |
| Basics/Image/Transparency | JAVA2D | ok | 12 |  |
| Basics/Input/Clock | JAVA2D | ok | 16 |  |
| Basics/Input/Constrain | JAVA2D | ok | 14 |  |
| Basics/Input/Easing | JAVA2D | ok | 12 |  |
| Basics/Input/Keyboard | JAVA2D | ok | 13 |  |
| Basics/Input/KeyboardFunctions | JAVA2D | ok | 16 |  |
| Basics/Input/Milliseconds | JAVA2D | ok | 12 |  |
| Basics/Input/Mouse1D | JAVA2D | ok | 12 |  |
| Basics/Input/Mouse2D | JAVA2D | ok | 12 |  |
| Basics/Input/MouseFunctions | JAVA2D | ok | 14 |  |
| Basics/Input/MousePress | JAVA2D | ok | 11 |  |
| Basics/Input/MouseSignals | JAVA2D | ok | 15 |  |
| Basics/Input/StoringInput | JAVA2D | ok | 14 |  |
| Basics/Lights/Directional | P3D | draw | 13 | java.lang.RuntimeException: $p.directionalLight is not a function |
| Basics/Lights/Mixture | P3D | draw | 13 | java.lang.RuntimeException: $p.pointLight is not a function |
| Basics/Lights/MixtureGrid | P3D | draw | 14 | java.lang.RuntimeException: $p.pointLight is not a function |
| Basics/Lights/OnOff | P3D | draw | 13 | java.lang.RuntimeException: $p.lights is not a function |
| Basics/Lights/Reflection | P3D | draw | 12 | java.lang.RuntimeException: $p.lightSpecular is not a function |
| Basics/Lights/Spot | P3D | setup | 13 | java.lang.RuntimeException: $p.sphereDetail is not a function |
| Basics/Math/AdditiveWave | JAVA2D | ok | 16 |  |
| Basics/Math/Arctangent | JAVA2D | ok | 14 |  |
| Basics/Math/Distance1D | JAVA2D | ok | 15 |  |
| Basics/Math/Distance2D | JAVA2D | ok | 13 |  |
| Basics/Math/DoubleRandom | JAVA2D | ok | 13 |  |
| Basics/Math/Graphing2DEquation | JAVA2D | ok | 14 |  |
| Basics/Math/IncrementDecrement | JAVA2D | ok | 14 |  |
| Basics/Math/Interpolate | JAVA2D | ok | 12 |  |
| Basics/Math/Map | JAVA2D | ok | 12 |  |
| Basics/Math/Noise1D | JAVA2D | ok | 13 |  |
| Basics/Math/Noise2D | JAVA2D | ok | 15 |  |
| Basics/Math/Noise3D | JAVA2D | ok | 15 |  |
| Basics/Math/NoiseWave | JAVA2D | ok | 14 |  |
| Basics/Math/OperatorPrecedence | JAVA2D | ok | 26 |  |
| Basics/Math/PolarToCartesian | JAVA2D | ok | 18 |  |
| Basics/Math/Random | JAVA2D | ok | 18 |  |
| Basics/Math/RandomGaussian | JAVA2D | ok | 14 |  |
| Basics/Math/Sine | JAVA2D | ok | 14 |  |
| Basics/Math/SineCosine | JAVA2D | ok | 15 |  |
| Basics/Math/SineWave | JAVA2D | ok | 16 |  |
| Basics/Objects/CompositeObjects | JAVA2D | ok | 20 |  |
| Basics/Objects/Inheritance | JAVA2D | ok | 17 |  |
| Basics/Objects/MultipleConstructors | JAVA2D | ok | 15 |  |
| Basics/Objects/Objects | JAVA2D | ok | 19 |  |
| Basics/Shape/DisableStyle | JAVA2D | setup | 13 | java.lang.RuntimeException: $p.loadShape is not a function |
| Basics/Shape/GetChild | JAVA2D | setup | 15 | java.lang.RuntimeException: $p.loadShape is not a function |
| Basics/Shape/LoadDisplayOBJ | P3D | setup | 14 | java.lang.RuntimeException: $p.loadShape is not a function |
| Basics/Shape/LoadDisplaySVG | JAVA2D | setup | 11 | java.lang.RuntimeException: $p.loadShape is not a function |
| Basics/Shape/ScaleShape | JAVA2D | setup | 13 | java.lang.RuntimeException: $p.loadShape is not a function |
| Basics/Shape/ShapeVertices | JAVA2D | setup | 17 | java.lang.RuntimeException: $p.loadShape is not a function |
| Basics/Structure/Coordinates | JAVA2D | ok | 14 |  |
| Basics/Structure/CreateGraphics | JAVA2D | ok | 15 |  |
| Basics/Structure/Functions | JAVA2D | ok | 14 |  |
| Basics/Structure/Loop | JAVA2D | ok | 14 |  |
| Basics/Structure/NoLoop | JAVA2D | ok | 12 |  |
| Basics/Structure/Recursion | JAVA2D | ok | 12 |  |
| Basics/Structure/Redraw | JAVA2D | ok | 12 |  |
| Basics/Structure/SetupDraw | JAVA2D | ok | 11 |  |
| Basics/Structure/StatementsComments | JAVA2D | ok | 10 |  |
| Basics/Structure/WidthHeight | JAVA2D | ok | 12 |  |
| Basics/Transform/Arm | JAVA2D | ok | 14 |  |
| Basics/Transform/Rotate | JAVA2D | ok | 13 |  |
| Basics/Transform/RotatePushPop | P3D | draw | 14 | java.lang.RuntimeException: $p.lights is not a function |
| Basics/Transform/RotateXY | P3D | draw | 16 | java.lang.RuntimeException: $p.rotateX is not a function |
| Basics/Transform/Scale | JAVA2D | ok | 14 |  |
| Basics/Transform/Translate | JAVA2D | ok | 15 |  |
| Basics/Typography/Letters | JAVA2D | ok | 14 |  |
| Basics/Typography/TextRotation | JAVA2D | ok | 15 |  |
| Basics/Typography/Words | JAVA2D | ok | 14 |  |
| Basics/Web/EmbeddedLinks | JAVA2D | ok | 14 |  |
| Basics/Web/LoadingImages | JAVA2D | ok | 12 |  |
| Demos/Graphics/DepthSort | P3D | draw | 14 | java.lang.RuntimeException: $p.rotateZ is not a function |
| Demos/Graphics/GetTessGroups | P3D | setup | 14 | java.lang.RuntimeException: $p.createShape is not a function |
| Demos/Graphics/LowLevelGLVboInterleaved | P3D | setup | 19 | java.lang.RuntimeException: $p.loadShader is not a function |
| Demos/Graphics/LowLevelGLVboSeparate | P3D | setup | 19 | java.lang.RuntimeException: $p.loadShader is not a function |
| Demos/Graphics/MeshTweening | P3D | setup | 16 | java.lang.RuntimeException: $p.loadShader is not a function |
| Demos/Graphics/MultipleWindows | P2D | setup | 18 | java.lang.RuntimeException: $p.createShape is not a function |
| Demos/Graphics/Particles | P2D | setup | 20 | java.lang.RuntimeException: $p.orientation is not a function |
| Demos/Graphics/Patch | P3D | draw | 22 | java.lang.RuntimeException: $p.lights is not a function |
| Demos/Graphics/Planets | P3D | setup | 26 | java.lang.RuntimeException: $p.sphereDetail is not a function |
| Demos/Graphics/Ribbons | P3D | setup | 44 | java.lang.RuntimeException: $p.parseInt is not a function |
| Demos/Graphics/RotatingArcs | P3D | draw | 20 | java.lang.RuntimeException: $p.rotateX is not a function |
| Demos/Graphics/TessUpdate | P3D | setup | 18 | java.lang.UnsupportedOperationException: processing.core.PMatrix3D is not available in processing-ts |
| Demos/Graphics/Trefoil | P3D | setup | 21 | java.lang.RuntimeException: $p.textureMode is not a function |
| Demos/Graphics/Wiggling | P3D | setup | 19 | java.lang.RuntimeException: $p.createShape is not a function |
| Demos/Graphics/Yellowtail | P2D | transpile | 25 | Yellowtail.pde:16:1: error: The import java.awt.Polygon cannot be resolved (the class is not availab |
| Demos/Performance/CubicGridImmediate | P3D | draw | 16 | java.lang.RuntimeException: $p.rotateY is not a function |
| Demos/Performance/CubicGridRetained | P3D | setup | 17 | java.lang.RuntimeException: $p.createShape is not a function |
| Demos/Performance/DynamicParticlesImmediate | P3D | draw | 19 | java.lang.RuntimeException: $p.texture is not a function |
| Demos/Performance/DynamicParticlesRetained | P3D | setup | 19 | java.lang.RuntimeException: $p.createShape is not a function |
| Demos/Performance/Esfera | P3D | draw | 18 | java.lang.RuntimeException: $p.rotateY is not a function |
| Demos/Performance/LineRendering | P2D | ok | 13 |  |
| Demos/Performance/QuadRendering | P2D | ok | 13 |  |
| Demos/Performance/StaticParticlesImmediate | P3D | draw | 25 | java.lang.RuntimeException: $p.rotateY is not a function |
| Demos/Performance/StaticParticlesRetained | P3D | setup | 22 | java.lang.RuntimeException: $p.createShape is not a function |
| Demos/Performance/TextRendering | P2D | ok | 16 |  |
| Demos/Tests/MultipleWindows | P3D | setup | 29 | java.lang.RuntimeException: $p.windowTitle is not a function |
| Demos/Tests/NoBackgroundTest | P2D | ok | 12 |  |
| Demos/Tests/OffscreenTest | P3D | ok | 14 |  |
| Demos/Tests/RedrawTest | P3D | ok | 13 |  |
| Demos/Tests/ResizeTest | P3D | setup | 12 | java.lang.RuntimeException: $p.windowResizable is not a function |
| Demos/Tests/SpecsTest | P3D | setup | 13 | java.lang.UnsupportedOperationException: processing.opengl.PGraphicsOpenGL is not available in proce |
| Topics/Advanced Data/ArrayListClass | JAVA2D | ok | 20 |  |
| Topics/Advanced Data/CountingStrings | JAVA2D | setup | 18 | java.lang.UnsupportedOperationException: processing.data.IntDict is not available in processing-ts |
| Topics/Advanced Data/HashMapClass | JAVA2D | ok | 22 |  |
| Topics/Advanced Data/IntListLottery | JAVA2D | setup | 21 | java.lang.UnsupportedOperationException: processing.data.IntList is not available in processing-ts |
| Topics/Advanced Data/LoadSaveJSON | JAVA2D | ok | 23 |  |
| Topics/Advanced Data/LoadSaveTable | JAVA2D | setup | 24 | java.lang.RuntimeException: $p.loadTable is not a function |
| Topics/Advanced Data/LoadSaveXML | JAVA2D | setup | 23 | java.lang.RuntimeException: $p.loadXML is not a function |
| Topics/Advanced Data/Regex | JAVA2D | setup | 19 | java.lang.ArrayIndexOutOfBoundsException: Index 0 out of bounds for length undefined |
| Topics/Advanced Data/Threads | JAVA2D | setup | 22 | java.lang.RuntimeException: $p.thread is not a function |
| Topics/Advanced Data/XMLYahooWeather | JAVA2D | setup | 21 | java.lang.RuntimeException: $p.loadXML is not a function |
| Topics/Animation/AnimatedSprite | JAVA2D | ok | 26 |  |
| Topics/Animation/Sequential | JAVA2D | timeout | 0 | timed out after 20000ms |
| Topics/Cellular Automata/GameOfLife | JAVA2D | ok | 20 |  |
| Topics/Cellular Automata/Spore1 | JAVA2D | ok | 28 |  |
| Topics/Cellular Automata/Spore2 | JAVA2D | ok | 37 |  |
| Topics/Cellular Automata/Wolfram | JAVA2D | ok | 22 |  |
| Topics/Create Shapes/BeginEndContour | P2D | setup | 16 | java.lang.RuntimeException: $p.createShape is not a function |
| Topics/Create Shapes/GroupPShape | P2D | setup | 19 | java.lang.RuntimeException: $p.createShape is not a function |
| Topics/Create Shapes/ParticleSystemPShape | P2D | setup | 24 | java.lang.RuntimeException: $p.createShape is not a function |
| Topics/Create Shapes/PathPShape | P2D | setup | 15 | java.lang.RuntimeException: $p.createShape is not a function |
| Topics/Create Shapes/PolygonPShape | P2D | setup | 15 | java.lang.RuntimeException: $p.createShape is not a function |
| Topics/Create Shapes/PolygonPShapeOOP | P2D | setup | 18 | java.lang.RuntimeException: $p.createShape is not a function |
| Topics/Create Shapes/PolygonPShapeOOP2 | P2D | setup | 21 | java.lang.RuntimeException: $p.createShape is not a function |
| Topics/Create Shapes/PolygonPShapeOOP3 | P2D | setup | 23 | java.lang.RuntimeException: $p.createShape is not a function |
| Topics/Create Shapes/PrimitivePShape | P2D | setup | 13 | java.lang.RuntimeException: $p.createShape is not a function |
| Topics/Create Shapes/WigglePShape | P2D | setup | 19 | java.lang.RuntimeException: $p.createShape is not a function |
| Topics/Curves/ArcLengthParametrization | P2D | ok | 29 |  |
| Topics/Drawing/ContinuousLines | JAVA2D | ok | 12 |  |
| Topics/Drawing/Pattern | JAVA2D | ok | 14 |  |
| Topics/Drawing/Pulses | JAVA2D | ok | 16 |  |
| Topics/File IO/DirectoryList | JAVA2D | setup | 21 | java.lang.RuntimeException: $p.sketchPath is not a function |
| Topics/File IO/LoadFile1 | JAVA2D | ok | 16 |  |
| Topics/File IO/LoadFile2 | JAVA2D | ok | 21 |  |
| Topics/File IO/SaveFile1 | JAVA2D | ok | 19 |  |
| Topics/File IO/SaveFile2 | JAVA2D | setup | 15 | java.lang.RuntimeException: $p.createWriter is not a function |
| Topics/File IO/SaveFrames | JAVA2D | ok | 18 |  |
| Topics/File IO/SaveOneImage | JAVA2D | ok | 13 |  |
| Topics/File IO/TileImages | JAVA2D | draw | 16 | java.lang.RuntimeException: $p.save is not a function |
| Topics/Fractals and L-Systems/Koch | JAVA2D | ok | 23 |  |
| Topics/Fractals and L-Systems/Mandelbrot | JAVA2D | ok | 19 |  |
| Topics/Fractals and L-Systems/PenroseSnowflake | JAVA2D | ok | 22 |  |
| Topics/Fractals and L-Systems/PenroseTile | JAVA2D | ok | 24 |  |
| Topics/Fractals and L-Systems/Pentigree | JAVA2D | ok | 22 |  |
| Topics/Fractals and L-Systems/Tree | JAVA2D | ok | 16 |  |
| Topics/GUI/Button | JAVA2D | ok | 18 |  |
| Topics/GUI/Handles | JAVA2D | ok | 22 |  |
| Topics/GUI/Rollover | JAVA2D | ok | 18 |  |
| Topics/GUI/Scrollbar | JAVA2D | ok | 21 |  |
| Topics/Geometry/Icosahedra | P3D | draw | 28 | java.lang.RuntimeException: $p.lights is not a function |
| Topics/Geometry/NoiseSphere | P3D | draw | 20 | java.lang.RuntimeException: $p.rotateY is not a function |
| Topics/Geometry/RGBCube | P3D | draw | 18 | java.lang.RuntimeException: $p.rotateX is not a function |
| Topics/Geometry/ShapeTransform | P3D | draw | 20 | java.lang.RuntimeException: $p.lights is not a function |
| Topics/Geometry/SpaceJunk | P3D | draw | 23 | java.lang.RuntimeException: $p.pointLight is not a function |
| Topics/Geometry/Toroid | P3D | draw | 25 | java.lang.RuntimeException: $p.lights is not a function |
| Topics/Geometry/Vertices | P3D | draw | 20 | java.lang.RuntimeException: $p.lights is not a function |
| Topics/Image Processing/Blending | P3D | ok | 24 |  |
| Topics/Image Processing/Blur | JAVA2D | ok | 22 |  |
| Topics/Image Processing/BrightnessPixels | JAVA2D | ok | 19 |  |
| Topics/Image Processing/Convolution | JAVA2D | ok | 25 |  |
| Topics/Image Processing/EdgeDetection | JAVA2D | draw | 20 | java.lang.NullPointerException |
| Topics/Image Processing/Explode | P3D | ok | 18 |  |
| Topics/Image Processing/Extrusion | P3D | draw | 20 | java.lang.RuntimeException: $p.rotateY is not a function |
| Topics/Image Processing/Histogram | JAVA2D | ok | 17 |  |
| Topics/Image Processing/LinearImage | JAVA2D | ok | 18 |  |
| Topics/Image Processing/PixelArray | JAVA2D | draw | 17 | java.lang.ArithmeticException: / by zero |
| Topics/Image Processing/Sharpen | JAVA2D | ok | 20 |  |
| Topics/Image Processing/Zoom | P3D | draw | 21 | java.lang.RuntimeException: $p.rotateZ is not a function |
| Topics/Interaction/Follow1 | JAVA2D | ok | 16 |  |
| Topics/Interaction/Follow2 | JAVA2D | ok | 18 |  |
| Topics/Interaction/Follow3 | JAVA2D | ok | 22 |  |
| Topics/Interaction/Reach1 | JAVA2D | ok | 18 |  |
| Topics/Interaction/Reach2 | JAVA2D | ok | 20 |  |
| Topics/Interaction/Reach3 | JAVA2D | ok | 21 |  |
| Topics/Interaction/Tickle | JAVA2D | ok | 18 |  |
| Topics/Motion/Bounce | JAVA2D | ok | 17 |  |
| Topics/Motion/BouncyBubbles | JAVA2D | ok | 22 |  |
| Topics/Motion/Brownian | JAVA2D | ok | 19 |  |
| Topics/Motion/CircleCollision | JAVA2D | ok | 25 |  |
| Topics/Motion/CubesWithinCube | P3D | draw | 27 | java.lang.RuntimeException: $p.lights is not a function |
| Topics/Motion/Linear | JAVA2D | ok | 14 |  |
| Topics/Motion/Morph | JAVA2D | ok | 21 |  |
| Topics/Motion/MovingOnCurves | JAVA2D | ok | 17 |  |
| Topics/Motion/Reflection1 | JAVA2D | ok | 22 |  |
| Topics/Motion/Reflection2 | JAVA2D | ok | 25 |  |
| Topics/Shaders/BlurFilter | P2D | setup | 13 | java.lang.RuntimeException: $p.loadShader is not a function |
| Topics/Shaders/Conway | P3D | setup | 17 | java.lang.RuntimeException: $p.loadShader is not a function |
| Topics/Shaders/CustomBlend | P2D | setup | 22 | java.lang.RuntimeException: $p.loadShader is not a function |
| Topics/Shaders/Deform | P2D | setup | 16 | java.lang.RuntimeException: $p.textureWrap is not a function |
| Topics/Shaders/DomeProjection | P3D | setup | 27 | java.lang.RuntimeException: $p.sphereDetail is not a function |
| Topics/Shaders/EdgeDetect | P2D | setup | 15 | java.lang.RuntimeException: $p.loadShader is not a function |
| Topics/Shaders/EdgeFilter | P3D | setup | 17 | java.lang.RuntimeException: $p.loadShader is not a function |
| Topics/Shaders/GlossyFishEye | P3D | setup | 21 | java.lang.RuntimeException: $p.loadShader is not a function |
| Topics/Shaders/ImageMask | P2D | setup | 17 | java.lang.RuntimeException: $p.loadShader is not a function |
| Topics/Shaders/InfiniteTiles | P2D | setup | 16 | java.lang.RuntimeException: $p.textureWrap is not a function |
| Topics/Shaders/Landscape | P2D | setup | 17 | java.lang.RuntimeException: $p.loadShader is not a function |
| Topics/Shaders/Monjori | P2D | setup | 15 | java.lang.RuntimeException: $p.loadShader is not a function |
| Topics/Shaders/Nebula | P2D | setup | 14 | java.lang.RuntimeException: $p.loadShader is not a function |
| Topics/Shaders/SepBlur | P2D | setup | 19 | java.lang.RuntimeException: $p.loadShader is not a function |
| Topics/Shaders/ToonShading | P3D | setup | 16 | java.lang.RuntimeException: $p.loadShader is not a function |
| Topics/Simulate/Flocking | JAVA2D | ok | 26 |  |
| Topics/Simulate/ForcesWithVectors | JAVA2D | ok | 22 |  |
| Topics/Simulate/GravitationalAttraction3D | P3D | draw | 22 | java.lang.RuntimeException: $p.sphereDetail is not a function |
| Topics/Simulate/MultipleParticleSystems | JAVA2D | ok | 25 |  |
| Topics/Simulate/SimpleParticleSystem | JAVA2D | ok | 20 |  |
| Topics/Simulate/SmokeParticleSystem | JAVA2D | ok | 26 |  |
| Topics/Simulate/SoftBody | JAVA2D | ok | 20 |  |
| Topics/Textures/TextureCube | P3D | setup | 19 | java.lang.RuntimeException: $p.textureMode is not a function |
| Topics/Textures/TextureCylinder | P3D | draw | 19 | java.lang.RuntimeException: $p.rotateX is not a function |
| Topics/Textures/TextureQuad | P3D | draw | 17 | java.lang.RuntimeException: $p.rotateY is not a function |
| Topics/Textures/TextureSphere | P3D | draw | 22 | java.lang.RuntimeException: $p.camera is not a function |
| Topics/Textures/TextureTriangle | P3D | draw | 15 | java.lang.RuntimeException: $p.rotateY is not a function |
| Topics/Vectors/AccelerationWithVectors | JAVA2D | ok | 17 |  |
| Topics/Vectors/BouncingBall | JAVA2D | ok | 17 |  |
| Topics/Vectors/VectorMath | JAVA2D | ok | 16 |  |
