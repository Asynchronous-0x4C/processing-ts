# 互換性コーパス（Processing 同梱 examples）

`npm run vt -- corpus` の出力（2026-10-04）。Processing 4.5.2 の同梱 examples をヘッドレス Chromium で変換し、setup + draw 5 回を実行した結果。
「ok」はエラーなく完走したことだけを意味し、見た目の一致は確認していない。

## 集計

| 区分 | 本数 | ok | 変換エラー | setup エラー | draw エラー | タイムアウト | ok 率 |
|---|---:|---:|---:|---:|---:|---:|---:|
| **全体** | 254 | 95 | 18 | 97 | 43 | 1 | 37% |
| Basics | 109 | 59 | 15 | 17 | 18 | 0 | 54% |
| Demos | 31 | 5 | 1 | 24 | 1 | 0 | 16% |
| Topics | 114 | 31 | 2 | 56 | 24 | 1 | 27% |
| JAVA2D | 166 | 89 | 16 | 41 | 19 | 1 | 54% |
| P2D | 28 | 4 | 0 | 24 | 0 | 0 | 14% |
| P3D | 60 | 2 | 2 | 32 | 24 | 0 | 3% |

## 多いエラー（正規化して集計）

| 件数 | エラー | 例 |
|---:|---|---|
| 18 | `TypeError: Cannot read properties of undefined (reading '…')` | ColorVariables, Conditionals1, Conditionals2 |
| 12 | `createShape is not defined` | GetTessGroups, DynamicParticlesRetained, StaticParticlesRetained |
| 10 | `SyntaxError: Invalid or unexpected token` | DepthSort, LowLevelGLVboInterleaved, LowLevelGLVboSeparate |
| 10 | `loadShader is not defined` | MeshTweening, BlurFilter, CustomBlend |
| 8 | `lights is not defined` | MoveEye, Orthographic, Perspective |
| 6 | `loadPixels is not defined` | Graphing2DEquation, Noise2D, Noise3D |
| 6 | `loadShape is not defined` | DisableStyle, GetChild, LoadDisplayOBJ |
| 5 | `noSmooth is not defined` | MousePress, MouseSignals, CubicGridImmediate |
| 4 | `Must call super constructor in derived class before accessing '…' or returning from derived constructor` | Inheritance, PenroseSnowflake, PenroseTile |
| 4 | `SyntaxError: Unexpected token '…'` | MultipleConstructors, Planets, Yellowtail |
| 4 | `rotateX is not defined` | RotateXY, RotatingArcs, RGBCube |
| 3 | `pointLight is not defined` | Mixture, MixtureGrid, SpaceJunk |
| 3 | `rotateY is not defined` | Extrusion, TextureQuad, TextureTriangle |
| 2 | `Invalid color length: N` | Array, PixelArray |
| 2 | `tint is not defined` | Transparency, Blending |
| 2 | `sphereDetail is not defined` | Spot, GravitationalAttraction3D |
| 2 | `randomGaussian is not defined` | RandomGaussian, SmokeParticleSystem |
| 2 | `printArray is not defined` | Letters, Words |
| 2 | `SyntaxError: await is only valid in async functions and the top level bodies of modules` | MultipleWindows, MultipleWindows |
| 2 | `textureMode is not defined` | Trefoil, TextureCube |
| 2 | `hint is not defined` | DynamicParticlesImmediate, StaticParticlesImmediate |
| 2 | `noiseDetail is not defined` | Esfera, NoiseSphere |
| 2 | `loadXML is not defined` | LoadSaveXML, XMLYahooWeather |
| 2 | `get is not defined` | Spore1, Spore2 |
| 2 | `PVector.fromAngle is not a function` | WigglePShape, Morph |
| 2 | `PVector.sub is not a function` | Koch, AccelerationWithVectors |
| 2 | `sq is not defined` | Button, Rollover |
| 2 | `textureWrap is not defined` | Deform, InfiniteTiles |
| 1 | `gradient.set is not a function` | WaveGradient |
| 1 | `Cannot access '…' before initialization` | VariableScope |
| 1 | `bezier is not defined` | Bezier |
| 1 | `img.mask is not a function` | Alphamask |
| 1 | `requestImage is not defined` | RequestImage |
| 1 | `directionalLight is not defined` | Directional |
| 1 | `lightSpecular is not defined` | Reflection |
| 1 | `bezierVertex is not defined` | CompositeObjects |
| 1 | `orientation is not defined` | Particles |
| 1 | `uitang.cross is not a function` | Patch |
| 1 | `ReferenceError: PMatrix3D is not defined` | TessUpdate |
| 1 | `pg.smooth is not a function` | OffscreenTest |

## グループ別

| グループ | 本数 | ok | 変換エラー | setup エラー | draw エラー | タイムアウト | ok 率 |
|---|---:|---:|---:|---:|---:|---:|---:|
| Basics/Arrays | 3 | 2 | 0 | 1 | 0 | 0 | 67% |
| Basics/Camera | 3 | 0 | 0 | 0 | 3 | 0 | 0% |
| Basics/Color | 8 | 6 | 1 | 1 | 0 | 0 | 75% |
| Basics/Control | 5 | 0 | 5 | 0 | 0 | 0 | 0% |
| Basics/Data | 6 | 2 | 3 | 0 | 1 | 0 | 33% |
| Basics/Form | 8 | 4 | 3 | 0 | 1 | 0 | 50% |
| Basics/Image | 7 | 4 | 0 | 2 | 1 | 0 | 57% |
| Basics/Input | 12 | 10 | 0 | 2 | 0 | 0 | 83% |
| Basics/Lights | 6 | 0 | 0 | 1 | 5 | 0 | 0% |
| Basics/Math | 20 | 15 | 1 | 0 | 4 | 0 | 75% |
| Basics/Objects | 4 | 1 | 0 | 2 | 1 | 0 | 25% |
| Basics/Shape | 6 | 0 | 0 | 6 | 0 | 0 | 0% |
| Basics/Structure | 10 | 8 | 2 | 0 | 0 | 0 | 80% |
| Basics/Transform | 6 | 4 | 0 | 0 | 2 | 0 | 67% |
| Basics/Typography | 3 | 1 | 0 | 2 | 0 | 0 | 33% |
| Basics/Web | 2 | 2 | 0 | 0 | 0 | 0 | 100% |
| Demos/Graphics | 15 | 0 | 0 | 14 | 1 | 0 | 0% |
| Demos/Performance | 10 | 3 | 0 | 7 | 0 | 0 | 30% |
| Demos/Tests | 6 | 2 | 1 | 3 | 0 | 0 | 33% |
| Topics/Advanced Data | 10 | 2 | 0 | 8 | 0 | 0 | 20% |
| Topics/Animation | 2 | 1 | 0 | 0 | 0 | 1 | 50% |
| Topics/Cellular Automata | 4 | 1 | 0 | 3 | 0 | 0 | 25% |
| Topics/Create Shapes | 10 | 0 | 0 | 10 | 0 | 0 | 0% |
| Topics/Curves | 1 | 0 | 0 | 1 | 0 | 0 | 0% |
| Topics/Drawing | 3 | 3 | 0 | 0 | 0 | 0 | 100% |
| Topics/File IO | 8 | 4 | 0 | 3 | 1 | 0 | 50% |
| Topics/Fractals and L-Systems | 6 | 0 | 1 | 4 | 1 | 0 | 0% |
| Topics/GUI | 4 | 2 | 0 | 0 | 2 | 0 | 50% |
| Topics/Geometry | 7 | 0 | 0 | 2 | 5 | 0 | 0% |
| Topics/Image Processing | 12 | 3 | 1 | 2 | 6 | 0 | 25% |
| Topics/Interaction | 7 | 6 | 0 | 1 | 0 | 0 | 86% |
| Topics/Motion | 10 | 6 | 0 | 4 | 0 | 0 | 60% |
| Topics/Shaders | 15 | 0 | 0 | 15 | 0 | 0 | 0% |
| Topics/Simulate | 7 | 1 | 0 | 2 | 4 | 0 | 14% |
| Topics/Textures | 5 | 0 | 0 | 1 | 4 | 0 | 0% |
| Topics/Vectors | 3 | 2 | 0 | 0 | 1 | 0 | 67% |

## 全スケッチ

| スケッチ | レンダラ | 結果 | 変換 ms | 最初のエラー |
|---|---|---|---:|---|
| Basics/Arrays/Array | JAVA2D | setup | 44 | Invalid color length: 0 |
| Basics/Arrays/Array2D | JAVA2D | ok | 51 |  |
| Basics/Arrays/ArrayObjects | JAVA2D | ok | 54 |  |
| Basics/Camera/MoveEye | P3D | draw | 31 | lights is not defined |
| Basics/Camera/Orthographic | P3D | draw | 42 | lights is not defined |
| Basics/Camera/Perspective | P3D | draw | 41 | lights is not defined |
| Basics/Color/Brightness | JAVA2D | ok | 41 |  |
| Basics/Color/ColorVariables | JAVA2D | transpile | 0 | TypeError: Cannot read properties of undefined (reading 'field') |
| Basics/Color/Hue | JAVA2D | ok | 43 |  |
| Basics/Color/LinearGradient | JAVA2D | ok | 47 |  |
| Basics/Color/RadialGradient | JAVA2D | ok | 40 |  |
| Basics/Color/Relativity | JAVA2D | ok | 44 |  |
| Basics/Color/Saturation | JAVA2D | ok | 43 |  |
| Basics/Color/WaveGradient | JAVA2D | setup | 46 | gradient.set is not a function |
| Basics/Control/Conditionals1 | JAVA2D | transpile | 0 | TypeError: Cannot read properties of undefined (reading 'field') |
| Basics/Control/Conditionals2 | JAVA2D | transpile | 0 | TypeError: Cannot read properties of undefined (reading 'field') |
| Basics/Control/EmbeddedIteration | JAVA2D | transpile | 0 | TypeError: Cannot read properties of undefined (reading 'field') |
| Basics/Control/Iteration | JAVA2D | transpile | 0 | TypeError: Cannot read properties of undefined (reading 'field') |
| Basics/Control/LogicalOperators | JAVA2D | transpile | 0 | TypeError: Cannot read properties of undefined (reading 'field') |
| Basics/Data/CharactersStrings | JAVA2D | ok | 48 |  |
| Basics/Data/DatatypeConversion | JAVA2D | transpile | 0 | TypeError: Cannot read properties of undefined (reading 'field') |
| Basics/Data/IntegersFloats | JAVA2D | ok | 40 |  |
| Basics/Data/TrueFalse | JAVA2D | transpile | 0 | TypeError: Cannot read properties of undefined (reading 'field') |
| Basics/Data/VariableScope | JAVA2D | draw | 39 | Cannot access 'a' before initialization |
| Basics/Data/Variables | JAVA2D | transpile | 0 | TypeError: Cannot read properties of undefined (reading 'field') |
| Basics/Form/Bezier | JAVA2D | draw | 36 | bezier is not defined |
| Basics/Form/PieChart | JAVA2D | ok | 43 |  |
| Basics/Form/PointsLines | JAVA2D | transpile | 0 | TypeError: Cannot read properties of undefined (reading 'field') |
| Basics/Form/Primitives3D | P3D | transpile | 0 | TypeError: Cannot read properties of undefined (reading 'field') |
| Basics/Form/RegularPolygon | JAVA2D | ok | 42 |  |
| Basics/Form/ShapePrimitives | JAVA2D | transpile | 0 | TypeError: Cannot read properties of undefined (reading 'field') |
| Basics/Form/Star | JAVA2D | ok | 43 |  |
| Basics/Form/TriangleStrip | JAVA2D | ok | 43 |  |
| Basics/Image/Alphamask | JAVA2D | setup | 36 | img.mask is not a function |
| Basics/Image/BackgroundImage | JAVA2D | ok | 42 |  |
| Basics/Image/CreateImage | JAVA2D | ok | 45 |  |
| Basics/Image/LoadDisplayImage | JAVA2D | ok | 37 |  |
| Basics/Image/Pointillism | JAVA2D | ok | 37 |  |
| Basics/Image/RequestImage | JAVA2D | setup | 58 | requestImage is not defined |
| Basics/Image/Transparency | JAVA2D | draw | 42 | tint is not defined |
| Basics/Input/Clock | JAVA2D | ok | 44 |  |
| Basics/Input/Constrain | JAVA2D | ok | 44 |  |
| Basics/Input/Easing | JAVA2D | ok | 36 |  |
| Basics/Input/Keyboard | JAVA2D | ok | 43 |  |
| Basics/Input/KeyboardFunctions | JAVA2D | ok | 58 |  |
| Basics/Input/Milliseconds | JAVA2D | ok | 40 |  |
| Basics/Input/Mouse1D | JAVA2D | ok | 35 |  |
| Basics/Input/Mouse2D | JAVA2D | ok | 36 |  |
| Basics/Input/MouseFunctions | JAVA2D | ok | 45 |  |
| Basics/Input/MousePress | JAVA2D | setup | 37 | noSmooth is not defined |
| Basics/Input/MouseSignals | JAVA2D | setup | 50 | noSmooth is not defined |
| Basics/Input/StoringInput | JAVA2D | ok | 46 |  |
| Basics/Lights/Directional | P3D | draw | 36 | directionalLight is not defined |
| Basics/Lights/Mixture | P3D | draw | 33 | pointLight is not defined |
| Basics/Lights/MixtureGrid | P3D | draw | 36 | pointLight is not defined |
| Basics/Lights/OnOff | P3D | draw | 38 | lights is not defined |
| Basics/Lights/Reflection | P3D | draw | 34 | lightSpecular is not defined |
| Basics/Lights/Spot | P3D | setup | 32 | sphereDetail is not defined |
| Basics/Math/AdditiveWave | JAVA2D | ok | 55 |  |
| Basics/Math/Arctangent | JAVA2D | ok | 39 |  |
| Basics/Math/Distance1D | JAVA2D | ok | 46 |  |
| Basics/Math/Distance2D | JAVA2D | ok | 36 |  |
| Basics/Math/DoubleRandom | JAVA2D | ok | 39 |  |
| Basics/Math/Graphing2DEquation | JAVA2D | draw | 42 | loadPixels is not defined |
| Basics/Math/IncrementDecrement | JAVA2D | ok | 44 |  |
| Basics/Math/Interpolate | JAVA2D | ok | 33 |  |
| Basics/Math/Map | JAVA2D | ok | 33 |  |
| Basics/Math/Noise1D | JAVA2D | ok | 38 |  |
| Basics/Math/Noise2D | JAVA2D | draw | 43 | loadPixels is not defined |
| Basics/Math/Noise3D | JAVA2D | draw | 44 | loadPixels is not defined |
| Basics/Math/NoiseWave | JAVA2D | ok | 38 |  |
| Basics/Math/OperatorPrecedence | JAVA2D | transpile | 0 | TypeError: Cannot read properties of undefined (reading 'field') |
| Basics/Math/PolarToCartesian | JAVA2D | ok | 36 |  |
| Basics/Math/Random | JAVA2D | ok | 34 |  |
| Basics/Math/RandomGaussian | JAVA2D | draw | 34 | randomGaussian is not defined |
| Basics/Math/Sine | JAVA2D | ok | 38 |  |
| Basics/Math/SineCosine | JAVA2D | ok | 39 |  |
| Basics/Math/SineWave | JAVA2D | ok | 45 |  |
| Basics/Objects/CompositeObjects | JAVA2D | draw | 49 | bezierVertex is not defined |
| Basics/Objects/Inheritance | JAVA2D | setup | 42 | Must call super constructor in derived class before accessing 'this' or returning from derived const |
| Basics/Objects/MultipleConstructors | JAVA2D | setup | 39 | SyntaxError: Unexpected token '&&' |
| Basics/Objects/Objects | JAVA2D | ok | 51 |  |
| Basics/Shape/DisableStyle | JAVA2D | setup | 37 | loadShape is not defined |
| Basics/Shape/GetChild | JAVA2D | setup | 42 | loadShape is not defined |
| Basics/Shape/LoadDisplayOBJ | P3D | setup | 38 | loadShape is not defined |
| Basics/Shape/LoadDisplaySVG | JAVA2D | setup | 34 | loadShape is not defined |
| Basics/Shape/ScaleShape | JAVA2D | setup | 38 | loadShape is not defined |
| Basics/Shape/ShapeVertices | JAVA2D | setup | 44 | loadShape is not defined |
| Basics/Structure/Coordinates | JAVA2D | transpile | 0 | TypeError: Cannot read properties of undefined (reading 'field') |
| Basics/Structure/CreateGraphics | JAVA2D | ok | 38 |  |
| Basics/Structure/Functions | JAVA2D | ok | 37 |  |
| Basics/Structure/Loop | JAVA2D | ok | 40 |  |
| Basics/Structure/NoLoop | JAVA2D | ok | 40 |  |
| Basics/Structure/Recursion | JAVA2D | ok | 41 |  |
| Basics/Structure/Redraw | JAVA2D | ok | 41 |  |
| Basics/Structure/SetupDraw | JAVA2D | ok | 41 |  |
| Basics/Structure/StatementsComments | JAVA2D | transpile | 0 | TypeError: Cannot read properties of undefined (reading 'field') |
| Basics/Structure/WidthHeight | JAVA2D | ok | 37 |  |
| Basics/Transform/Arm | JAVA2D | ok | 37 |  |
| Basics/Transform/Rotate | JAVA2D | ok | 42 |  |
| Basics/Transform/RotatePushPop | P3D | draw | 42 | lights is not defined |
| Basics/Transform/RotateXY | P3D | draw | 43 | rotateX is not defined |
| Basics/Transform/Scale | JAVA2D | ok | 36 |  |
| Basics/Transform/Translate | JAVA2D | ok | 43 |  |
| Basics/Typography/Letters | JAVA2D | setup | 49 | printArray is not defined |
| Basics/Typography/TextRotation | JAVA2D | ok | 41 |  |
| Basics/Typography/Words | JAVA2D | setup | 42 | printArray is not defined |
| Basics/Web/EmbeddedLinks | JAVA2D | ok | 48 |  |
| Basics/Web/LoadingImages | JAVA2D | ok | 47 |  |
| Demos/Graphics/DepthSort | P3D | setup | 47 | SyntaxError: Invalid or unexpected token |
| Demos/Graphics/GetTessGroups | P3D | setup | 49 | createShape is not defined |
| Demos/Graphics/LowLevelGLVboInterleaved | P3D | setup | 51 | SyntaxError: Invalid or unexpected token |
| Demos/Graphics/LowLevelGLVboSeparate | P3D | setup | 52 | SyntaxError: Invalid or unexpected token |
| Demos/Graphics/MeshTweening | P3D | setup | 45 | loadShader is not defined |
| Demos/Graphics/MultipleWindows | P2D | setup | 53 | SyntaxError: await is only valid in async functions and the top level bodies of modules |
| Demos/Graphics/Particles | P2D | setup | 69 | orientation is not defined |
| Demos/Graphics/Patch | P3D | setup | 66 | uitang.cross is not a function |
| Demos/Graphics/Planets | P3D | setup | 66 | SyntaxError: Unexpected token '[' |
| Demos/Graphics/Ribbons | P3D | setup | 94 | SyntaxError: Invalid or unexpected token |
| Demos/Graphics/RotatingArcs | P3D | draw | 63 | rotateX is not defined |
| Demos/Graphics/TessUpdate | P3D | setup | 50 | ReferenceError: PMatrix3D is not defined |
| Demos/Graphics/Trefoil | P3D | setup | 56 | textureMode is not defined |
| Demos/Graphics/Wiggling | P3D | setup | 54 | SyntaxError: Invalid or unexpected token |
| Demos/Graphics/Yellowtail | P2D | setup | 75 | SyntaxError: Unexpected token '&&' |
| Demos/Performance/CubicGridImmediate | P3D | setup | 52 | noSmooth is not defined |
| Demos/Performance/CubicGridRetained | P3D | setup | 53 | noSmooth is not defined |
| Demos/Performance/DynamicParticlesImmediate | P3D | setup | 61 | hint is not defined |
| Demos/Performance/DynamicParticlesRetained | P3D | setup | 60 | createShape is not defined |
| Demos/Performance/Esfera | P3D | setup | 52 | noiseDetail is not defined |
| Demos/Performance/LineRendering | P2D | ok | 41 |  |
| Demos/Performance/QuadRendering | P2D | ok | 63 |  |
| Demos/Performance/StaticParticlesImmediate | P3D | setup | 82 | hint is not defined |
| Demos/Performance/StaticParticlesRetained | P3D | setup | 65 | createShape is not defined |
| Demos/Performance/TextRendering | P2D | ok | 47 |  |
| Demos/Tests/MultipleWindows | P3D | setup | 78 | SyntaxError: await is only valid in async functions and the top level bodies of modules |
| Demos/Tests/NoBackgroundTest | P2D | ok | 35 |  |
| Demos/Tests/OffscreenTest | P3D | setup | 39 | pg.smooth is not a function |
| Demos/Tests/RedrawTest | P3D | ok | 32 |  |
| Demos/Tests/ResizeTest | P3D | setup | 33 | windowResizable is not defined |
| Demos/Tests/SpecsTest | P3D | transpile | 0 | TypeError: Cannot read properties of undefined (reading 'field') |
| Topics/Advanced Data/ArrayListClass | JAVA2D | ok | 97 |  |
| Topics/Advanced Data/CountingStrings | JAVA2D | setup | 54 | IntDict is not defined |
| Topics/Advanced Data/HashMapClass | JAVA2D | setup | 62 | splitTokens is not defined |
| Topics/Advanced Data/IntListLottery | JAVA2D | setup | 54 | IntList is not defined |
| Topics/Advanced Data/LoadSaveJSON | JAVA2D | ok | 57 |  |
| Topics/Advanced Data/LoadSaveTable | JAVA2D | setup | 54 | loadTable is not defined |
| Topics/Advanced Data/LoadSaveXML | JAVA2D | setup | 57 | loadXML is not defined |
| Topics/Advanced Data/Regex | JAVA2D | setup | 46 | Cannot read properties of undefined (reading '1') |
| Topics/Advanced Data/Threads | JAVA2D | setup | 54 | thread is not defined |
| Topics/Advanced Data/XMLYahooWeather | JAVA2D | setup | 41 | loadXML is not defined |
| Topics/Animation/AnimatedSprite | JAVA2D | ok | 53 |  |
| Topics/Animation/Sequential | JAVA2D | timeout | 0 | timed out after 20000ms |
| Topics/Cellular Automata/GameOfLife | JAVA2D | setup | 62 | noSmooth is not defined |
| Topics/Cellular Automata/Spore1 | JAVA2D | setup | 58 | get is not defined |
| Topics/Cellular Automata/Spore2 | JAVA2D | setup | 60 | get is not defined |
| Topics/Cellular Automata/Wolfram | JAVA2D | ok | 55 |  |
| Topics/Create Shapes/BeginEndContour | P2D | setup | 39 | createShape is not defined |
| Topics/Create Shapes/GroupPShape | P2D | setup | 44 | createShape is not defined |
| Topics/Create Shapes/ParticleSystemPShape | P2D | setup | 73 | createShape is not defined |
| Topics/Create Shapes/PathPShape | P2D | setup | 42 | createShape is not defined |
| Topics/Create Shapes/PolygonPShape | P2D | setup | 40 | createShape is not defined |
| Topics/Create Shapes/PolygonPShapeOOP | P2D | setup | 45 | createShape is not defined |
| Topics/Create Shapes/PolygonPShapeOOP2 | P2D | setup | 84 | createShape is not defined |
| Topics/Create Shapes/PolygonPShapeOOP3 | P2D | setup | 98 | createShape is not defined |
| Topics/Create Shapes/PrimitivePShape | P2D | setup | 35 | createShape is not defined |
| Topics/Create Shapes/WigglePShape | P2D | setup | 53 | PVector.fromAngle is not a function |
| Topics/Curves/ArcLengthParametrization | P2D | setup | 61 | smooth is not defined |
| Topics/Drawing/ContinuousLines | JAVA2D | ok | 35 |  |
| Topics/Drawing/Pattern | JAVA2D | ok | 36 |  |
| Topics/Drawing/Pulses | JAVA2D | ok | 44 |  |
| Topics/File IO/DirectoryList | JAVA2D | setup | 69 | sketchPath is not defined |
| Topics/File IO/LoadFile1 | JAVA2D | ok | 46 |  |
| Topics/File IO/LoadFile2 | JAVA2D | setup | 57 | loadFont is not defined |
| Topics/File IO/SaveFile1 | JAVA2D | ok | 51 |  |
| Topics/File IO/SaveFile2 | JAVA2D | setup | 43 | createWriter is not defined |
| Topics/File IO/SaveFrames | JAVA2D | ok | 50 |  |
| Topics/File IO/SaveOneImage | JAVA2D | ok | 31 |  |
| Topics/File IO/TileImages | JAVA2D | draw | 45 | save is not defined |
| Topics/Fractals and L-Systems/Koch | JAVA2D | draw | 93 | PVector.sub is not a function |
| Topics/Fractals and L-Systems/Mandelbrot | JAVA2D | transpile | 0 | TypeError: Cannot read properties of undefined (reading 'field') |
| Topics/Fractals and L-Systems/PenroseSnowflake | JAVA2D | setup | 64 | Must call super constructor in derived class before accessing 'this' or returning from derived const |
| Topics/Fractals and L-Systems/PenroseTile | JAVA2D | setup | 62 | Must call super constructor in derived class before accessing 'this' or returning from derived const |
| Topics/Fractals and L-Systems/Pentigree | JAVA2D | setup | 60 | Must call super constructor in derived class before accessing 'this' or returning from derived const |
| Topics/Fractals and L-Systems/Tree | JAVA2D | setup | 56 | SyntaxError: Invalid or unexpected token |
| Topics/GUI/Button | JAVA2D | draw | 57 | sq is not defined |
| Topics/GUI/Handles | JAVA2D | ok | 63 |  |
| Topics/GUI/Rollover | JAVA2D | draw | 49 | sq is not defined |
| Topics/GUI/Scrollbar | JAVA2D | ok | 55 |  |
| Topics/Geometry/Icosahedra | P3D | setup | 65 | SyntaxError: Unexpected token '&&' |
| Topics/Geometry/NoiseSphere | P3D | setup | 49 | noiseDetail is not defined |
| Topics/Geometry/RGBCube | P3D | draw | 46 | rotateX is not defined |
| Topics/Geometry/ShapeTransform | P3D | draw | 63 | lights is not defined |
| Topics/Geometry/SpaceJunk | P3D | draw | 58 | pointLight is not defined |
| Topics/Geometry/Toroid | P3D | draw | 64 | lights is not defined |
| Topics/Geometry/Vertices | P3D | draw | 49 | lights is not defined |
| Topics/Image Processing/Blending | P3D | draw | 46 | tint is not defined |
| Topics/Image Processing/Blur | JAVA2D | ok | 53 |  |
| Topics/Image Processing/BrightnessPixels | JAVA2D | setup | 44 | loadPixels is not defined |
| Topics/Image Processing/Convolution | JAVA2D | draw | 63 | loadPixels is not defined |
| Topics/Image Processing/EdgeDetection | JAVA2D | draw | 51 | img.copy is not a function |
| Topics/Image Processing/Explode | P3D | ok | 46 |  |
| Topics/Image Processing/Extrusion | P3D | draw | 54 | rotateY is not defined |
| Topics/Image Processing/Histogram | JAVA2D | transpile | 0 | TypeError: Cannot read properties of undefined (reading 'field') |
| Topics/Image Processing/LinearImage | JAVA2D | setup | 51 | loadPixels is not defined |
| Topics/Image Processing/PixelArray | JAVA2D | draw | 49 | Invalid color length: 0 |
| Topics/Image Processing/Sharpen | JAVA2D | ok | 53 |  |
| Topics/Image Processing/Zoom | P3D | draw | 59 | rotateZ is not defined |
| Topics/Interaction/Follow1 | JAVA2D | ok | 39 |  |
| Topics/Interaction/Follow2 | JAVA2D | ok | 41 |  |
| Topics/Interaction/Follow3 | JAVA2D | ok | 47 |  |
| Topics/Interaction/Reach1 | JAVA2D | ok | 39 |  |
| Topics/Interaction/Reach2 | JAVA2D | ok | 51 |  |
| Topics/Interaction/Reach3 | JAVA2D | ok | 63 |  |
| Topics/Interaction/Tickle | JAVA2D | setup | 47 | textAscent is not defined |
| Topics/Motion/Bounce | JAVA2D | ok | 46 |  |
| Topics/Motion/BouncyBubbles | JAVA2D | ok | 68 |  |
| Topics/Motion/Brownian | JAVA2D | ok | 46 |  |
| Topics/Motion/CircleCollision | JAVA2D | setup | 62 | TypeError: PVector.random2D is not a function |
| Topics/Motion/CubesWithinCube | P3D | setup | 62 | PVector.random3D is not a function |
| Topics/Motion/Linear | JAVA2D | ok | 42 |  |
| Topics/Motion/Morph | JAVA2D | setup | 62 | PVector.fromAngle is not a function |
| Topics/Motion/MovingOnCurves | JAVA2D | ok | 46 |  |
| Topics/Motion/Reflection1 | JAVA2D | setup | 58 | PVector.dist is not a function |
| Topics/Motion/Reflection2 | JAVA2D | ok | 62 |  |
| Topics/Shaders/BlurFilter | P2D | setup | 39 | loadShader is not defined |
| Topics/Shaders/Conway | P3D | setup | 40 | pg.noSmooth is not a function |
| Topics/Shaders/CustomBlend | P2D | setup | 42 | loadShader is not defined |
| Topics/Shaders/Deform | P2D | setup | 39 | textureWrap is not defined |
| Topics/Shaders/DomeProjection | P3D | setup | 58 | SyntaxError: Invalid or unexpected token |
| Topics/Shaders/EdgeDetect | P2D | setup | 49 | loadShader is not defined |
| Topics/Shaders/EdgeFilter | P3D | setup | 47 | loadShader is not defined |
| Topics/Shaders/GlossyFishEye | P3D | setup | 56 | loadShader is not defined |
| Topics/Shaders/ImageMask | P2D | setup | 45 | maskImage.noSmooth is not a function |
| Topics/Shaders/InfiniteTiles | P2D | setup | 41 | textureWrap is not defined |
| Topics/Shaders/Landscape | P2D | setup | 46 | loadShader is not defined |
| Topics/Shaders/Monjori | P2D | setup | 42 | loadShader is not defined |
| Topics/Shaders/Nebula | P2D | setup | 39 | loadShader is not defined |
| Topics/Shaders/SepBlur | P2D | setup | 47 | SyntaxError: Invalid or unexpected token |
| Topics/Shaders/ToonShading | P3D | setup | 47 | loadShader is not defined |
| Topics/Simulate/Flocking | JAVA2D | setup | 160 | SyntaxError: Invalid or unexpected token |
| Topics/Simulate/ForcesWithVectors | JAVA2D | draw | 60 | PVector.div is not a function |
| Topics/Simulate/GravitationalAttraction3D | P3D | draw | 55 | sphereDetail is not defined |
| Topics/Simulate/MultipleParticleSystems | JAVA2D | setup | 133 | SyntaxError: Invalid or unexpected token |
| Topics/Simulate/SimpleParticleSystem | JAVA2D | ok | 87 |  |
| Topics/Simulate/SmokeParticleSystem | JAVA2D | draw | 73 | randomGaussian is not defined |
| Topics/Simulate/SoftBody | JAVA2D | draw | 57 | curveTightness is not defined |
| Topics/Textures/TextureCube | P3D | setup | 46 | textureMode is not defined |
| Topics/Textures/TextureCylinder | P3D | draw | 51 | rotateX is not defined |
| Topics/Textures/TextureQuad | P3D | draw | 46 | rotateY is not defined |
| Topics/Textures/TextureSphere | P3D | draw | 68 | camera is not defined |
| Topics/Textures/TextureTriangle | P3D | draw | 41 | rotateY is not defined |
| Topics/Vectors/AccelerationWithVectors | JAVA2D | draw | 43 | PVector.sub is not a function |
| Topics/Vectors/BouncingBall | JAVA2D | ok | 47 |  |
| Topics/Vectors/VectorMath | JAVA2D | ok | 38 |  |
