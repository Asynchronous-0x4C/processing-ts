# Processing → Browser: Research Report (as of 2026-10-04)

Research for a project that transpiles Processing (`.pde`) sketches to JavaScript. Every claim has a source. **[verified-local]** means I checked it against the installed Processing 4.5.2 (`C:\Program Files\Processing`) by running its own preprocessor/compiler or reading its jars. **[verified-src]** means I read it in upstream source. **[unverified]** means I could not confirm it.

Scratch artifacts (all in `scratchpad/research/`): `inv_processing.txt` (full reference inventory), `libcounts.tsv`, `rel/*.md` (release notes), `src/*` (downloaded sources), `tests*/` + `out*/` (preprocessor experiments), `PreTest.java` (harness that calls `PdePreprocessor`).

---

## 1. Processing versions, 4.4.x/4.5.x changes, and accepted language level

### 1.1 Latest version
- **Latest stable is Processing 4.5.7 (revision 1435), released 2026-09-24.** processing.org/download offers "Download Processing 4.5.7". Sources: https://github.com/processing/processing4/releases , https://processing.org/download
- The local install is **4.5.2 (revision 1313, 2026-01-29)**, five patch releases behind. Source: `app\Processing.cfg` (`-Dprocessing.version=4.5.2`, `-Dprocessing.revision=1313`) [verified-local].
- Release timeline (from the GitHub releases API; "β" = marked prerelease):
  4.4.0β 2025-03-14 · 4.4.1 03-21 · 4.4.2β/4.4.3β Apr · 4.4.4 05-16 · 4.4.5β 07-11 · 4.4.6 08-14 · 4.4.7 09-04 · 4.4.8 10-07 · 4.4.9β/4.4.10 10-14 · 4.5.0β 2025-12-18 · 4.5.1 2026-01-19 · 4.5.2 01-29 · 4.5.3β 03-02 (its release was described as failed) · 4.5.4 06-23 · 4.5.5 06-24 · 4.5.6 07-20 · 4.5.7 09-24.
- The bundled JDK is **Temurin 17.0.8.1** (`app\resources\jdk\release`) [verified-local]. Exported apps declare `jvm_version 17` / `minVersion 17` (string constants in `JavaBuild.class`) [verified-local].

### 1.2 What changed in 4.4.x / 4.5.x (release notes in `rel/`)
Infrastructure and IDE:
- **4.4.0:** build moved from Ant to Gradle; the UI started moving from Swing to Jetpack Compose (Kotlin); new installers (MSI, DMG, Snap, portable); 32-bit builds dropped; new `pde://` URL scheme ("Open in Processing" links). https://github.com/processing/processing4/releases/tag/processing-1300-4.4.0 , https://github.com/processing/processing4/wiki/Changes-in-4.4
- **4.4.1:** fixed decoding of larger base64 sketches (passed through `pde://` links).
- **4.4.6:** support for the new **official VS Code extension** (#1115). Install locations are now written to Java Preferences so tools can find Processing.
- **4.4.7:** exception locations are highlighted correctly again (#1153). `SketchException` moved out of `app`.
- **4.4.8:** `java/lsp` directory deleted; a **`sketch format` CLI command** added (#1228); the **preprocessor became Gradle-native (#1232)**, and per the PR author this "also updates the java base language of the parser" (see 1.3). Also a pixelDensity default warning (#1226), and the pdf/dxf/serial libraries moved to Gradle.
- **4.5.0/4.5.1:** new Welcome and Preferences screens (Compose + Material 3). The svg library moved to Gradle.
- **4.5.2:** CLI supports custom main-file names (#1329); **JOGL upgraded to 2.6 from Maven** (#1391).
- **4.5.3–4.5.4:** `PMatrix.print()` added (#1355); a Gradle plugin for Processing libraries; core libraries (svg, net, pdf, dxf, serial, io) published to Maven Central; SVG compact-arc parsing fix (#1282); `text()` start-index fix (#1257); SQL field types (#1478).
- **4.5.6:** Gradle 9; **"Merge WebGPU backend" (#1514, by tychedelia)**. It adds `processing.webgpu.PGraphicsWebGPU` and `PConstants.WEBGPU`, built on the Rust `libprocessing` submodule via Java Panama (needs Java 24). It is off by default (`-PenableWebGPU=true`). Also "Some tokens used as variable names incorrectly reported as errors" (#1543). https://github.com/processing/processing4/pull/1514
- **4.5.7:** permissions and CI fixes; "only pass --disable-awt for WebGPU renderer" (#1570).
- **On `main` after 4.5.7 (not yet released):** commit 2026-09-25 "Rename PShader to PShaderOpenGL and extract PShader interface (#1556)". `processing.core.PShader` is now an interface and `processing.opengl.PShaderOpenGL` is the GL implementation. [verified-src: tag 4.5.7 still has `processing/opengl/PShader.java`; `main` has `core/src/processing/core/PShader.java`]

New core APIs in 4.4/4.5: essentially only `PMatrix.print()`. No new drawing API. Renderer work went into JOGL 2.6 and the opt-in WebGPU backend. **Nothing web-export-related shipped in the PDE.**

CLI (4.4+; `processing.app.ProcessingKt`, Clikt) [verified-src: `app/src/processing/app/Processing.kt` @4.5.2]:
- `processing [sketches…]` opens the IDE. `-v/--version` prints the version.
- `processing lsp` starts the language server (`processing.mode.java.lsp.PdeLanguageServer`).
- `processing cli …` runs the legacy Commander. Flags found in `Commander.class`: `--sketch=`, `--output=`, `--force`, `--run`, `--present`, `--build`, `--export`, `--variant=`, `--no-java`, `--platform`, `--help` [verified-local].
- `processing sketch format` formats a sketch. There are also `contributions` and `sketchbook` subcommands.

### 1.3 Preprocessor grammar: what Java syntax 4.5.2 accepts
**Short answer:** it is still an ANTLR4 grammar `Processing.g4` (antlr4-runtime 4.13.2) that imports `JavaParser.g4`/`JavaLexer.g4`. However, since the Gradle-native preprocessor (merged 2025-09-09, first shipped in 4.4.8), the imported grammar is the **grammars-v4 Java grammar "upgraded to Java 17" (Michał Lorek, 2022)**. It is no longer Java 8. The comment at the top of `Processing.g4`, "Based on Java 1.7 grammar", is stale.
- Grammar files used by the build: `java/preprocessor/src/main/antlr/JavaParser.g4`, `JavaLexer.g4`, `processing/mode/java/preproc/Processing.g4` (added in commit 00e4243, 2025-09-08). https://github.com/processing/processing4/tree/main/java/preprocessor/src/main/antlr
- **Trap:** the old copies at `java/src/processing/mode/java/preproc/*.g4` (the path in your brief) are the Java-8/11-era grammar (14 KB, no records) and are **stale**. 4.5.2 and `main` use the same `JavaParser.g4` (no diff).
- The lexer vocabulary in the 4.5.2 jar includes `var yield record sealed permits non-sealed module open requires exports opens to uses provides with transitive`, plus `TEXT_BLOCK`, `MULTI_STRING_LIT`, `HexColorLiteral`, `'color'`. There are 138 parser rules, including `recordDeclaration`, `compactConstructorDeclaration`, `switchExpression`, `switchLabeledRule`, `guardedPattern`, `pattern`, `lambdaLVTIParameter`, `moduleDeclaration`, `multilineStringLiteral` [verified-local: `DumpTokens.java` against `preprocessor-4.5.2.jar`].
- Processing-specific rules: `processingSketch` = `staticProcessingSketch | javaProcessingSketch | activeProcessingSketch`, `warnMixedModes`, `functionWithPrimitiveTypeName` (`int(…)`, `float(…)`, `char(…)`, `byte(…)`, `boolean(…)`, `color(…)`), `colorPrimitiveType`, `hexColorLiteral` (`#RRGGBB`), and `warnTypeAsVariableName`.

**But the compiler is Java 11.** `Compiler.java` runs ECJ with `-source 11 -target 11` ("TODO: 17 if using new language features"). `PreprocService` (the error checker) sets JDT compliance to 11 ("Requires new JDT"). The bundled ECJ is `org.eclipse.jdt.core 3.16.0.v20181130`, which supports Java 11 at most. Sources: https://github.com/processing/processing4/blob/main/java/src/processing/mode/java/Compiler.java (line 67), `PreprocService.java` (line 943) [verified-src + verified-local via `javap`].

**Empirical results** from feeding test sketches through the real 4.5.2 `PdePreprocessor` and then ECJ `-source 11`, the same pipeline the PDE uses [verified-local]:

| Feature | Preprocessor | ECJ (-source 11) | Net result in Processing 4.5.2 |
|---|---|---|---|
| `var` locals; `var` in lambda params | OK | OK | ✅ works |
| lambdas, method refs, generics, diamond, generic methods | OK | OK | ✅ |
| enhanced for, try-with-resources, multi-catch, string `switch`, labeled break/continue, `0b`/`_` literals | OK | OK | ✅ |
| enums with methods, interface `default` methods, anonymous classes, `static` nested classes | OK | OK | ✅ |
| **text blocks `"""…"""`** | rewritten to a plain `"…"` literal | OK | ⚠️ works, but **not Java semantics**: no incidental-indent stripping, and the leading newline is kept (`exitMultilineStringLiteral` only escapes `\n` and `"`) |
| switch expressions / `yield` / `case A, B ->` | OK | **syntax error** | ❌ |
| records | OK | **error** | ❌ |
| pattern `instanceof` (`o instanceof String s`) | OK | **syntax error** | ❌ |
| `sealed`/`permits` | OK | **syntax error** | ❌ |
| `case Integer i when i > 3` (Java 21) | **syntax error** (grammar only has Java-17-preview `&&` guards) | — | ❌ |
| `static` non-constant field in a sketch class | OK | **error** ("cannot be declared static in a non-static inner type") | ❌ (classes become inner classes) |

Other preprocessor rewrites to mirror (observed in `out*/`):
- Decimal literals always get `f` (`1.5` becomes `1.5f`, `1e10` becomes `1e10f`). **This applies even to doubles:** `double d = 1.0/3;` becomes `1.0f/3`.
- `color` becomes `int`. `#FF8800` becomes `0xFFFF8800`. `int(x)` becomes `PApplet.parseInt(x)` (likewise parseFloat/parseChar/parseBoolean/parseByte).
- Methods without an access modifier get `public`, including methods inside user classes.
- `size()/fullScreen()/smooth()/pixelDensity()` calls are moved into a generated `settings()` (the original is replaced by a comment).
- Static-mode sketches are wrapped in `setup()` with `noLoop()` appended.
- The output is a `public class <Sketch> extends PApplet` with default imports `processing.core/data/event/opengl.*`, `java.util.HashMap`, `ArrayList`, `java.io.File`, `BufferedReader`, `PrintWriter`, `InputStream`, `OutputStream`, `IOException`.
- A file that is a full Java class is detected as `JAVA` mode and passed through.
- Detected `size(w,h,RENDERER)` is reported via `PreprocessorResult.getSketchRenderer()`.

---

## 2. Core API inventory (processing.org reference, 4.x)

Source: the processing-website repo, `content/references/translations/en/processing/*.json` (671 files; sparse-cloned 2026-10-04). https://github.com/processing/processing-website/tree/main/content/references/translations/en/processing . Each JSON has `category`, `subcategory` and `type`. I merged categories case-insensitively (the data mixes "Data"/"data" and "Rendering"/"rendering"). The full machine-generated list is in `inv_processing.txt`.

**Totals:** 391 top-level reference entries: 273 functions, 24 classes, 24 variables/constants, 70 keywords/operators. Class pages add another 280 entries (272 methods + 8 fields).

| Category | Entries | fn / class / var / kw-op |
|---|---|---|
| Structure | 42 | 14 / 0 / 0 / 28 |
| Environment | 27 | 18 / 0 / 9 / 0 |
| Data | 53 | 29 / 16 / 0 / 8 |
| Control | 19 | 0 / 0 / 0 / 19 |
| Shape | 39 | 38 / 1 / 0 / 0 |
| Input | 40 | 30 / 1 / 9 / 0 |
| Output | 20 | 19 / 1 / 0 / 0 |
| Transform | 13 | 13 / 0 / 0 / 0 |
| Lights & Camera | 27 | 27 / 0 / 0 / 0 |
| Color | 16 | 16 / 0 / 0 / 0 |
| Image | 20 | 18 / 1 / 1 / 0 |
| Rendering | 10 | 8 / 2 / 0 / 0 |
| Typography | 12 | 11 / 1 / 0 / 0 |
| Math | 48 | 32 / 1 / 0 / 15 |
| Constants | 5 | 0 / 0 / 5 / 0 |

### Per-category names
- **Structure (42):** `, ; . () [] {} /* */ /** */ // =` · `catch class extends false final implements import new null private public return static super this true try void` · `draw() exit() loop() noLoop() pop() popStyle() push() pushStyle() redraw() setLocation() setResizable() setTitle() setup() thread()`
- **Environment (27):** `cursor() delay() displayDensity() frameRate() fullScreen() noCursor() noSmooth() pixelDensity() settings() size() smooth() windowMove() windowMoved() windowRatio() windowResizable() windowResize() windowResized() windowTitle()` · vars `displayHeight displayWidth focused frameCount frameRate height pixelHeight pixelWidth width`
- **Data (53):**
  - Primitive (8): `boolean byte char color double float int long`
  - Composite (16): `Array ArrayList HashMap Object String FloatDict FloatList IntDict IntList JSONArray JSONObject StringDict StringList Table TableRow XML`
  - Conversion (10): `boolean() byte() char() float() int() str() binary() hex() unbinary() unhex()`
  - String functions (10): `join() match() matchAll() nf() nfc() nfp() nfs() split() splitTokens() trim()`
  - Array functions (9): `append() arrayCopy() concat() expand() reverse() shorten() sort() splice() subset()`
- **Control (19):** `if else switch case default break continue ?: for while` · `! && ||` · `== != < <= > >=`
- **Shape (39):**
  - `createShape() loadShape() PShape`
  - 2D (9): `arc() circle() ellipse() line() point() quad() rect() square() triangle()`
  - 3D (3): `box() sphere() sphereDetail()`
  - Attributes (5): `ellipseMode() rectMode() strokeCap() strokeJoin() strokeWeight()`
  - Curves (9): `bezier() bezierDetail() bezierPoint() bezierTangent() curve() curveDetail() curvePoint() curveTangent() curveTightness()`
  - Display (2): `shape() shapeMode()`
  - Vertex (8): `beginContour() beginShape() bezierVertex() curveVertex() endContour() endShape() quadraticVertex() vertex()`
- **Input (40):**
  - Files (15): `BufferedReader createInput() createReader() launch() loadBytes() loadJSONArray() loadJSONObject() loadStrings() loadTable() loadXML() parseJSONArray() parseJSONObject() parseXML() selectFolder() selectInput()`
  - Keyboard (6): `key keyCode keyPressed keyPressed() keyReleased() keyTyped()`
  - Mouse (12): `mouseButton mouseClicked() mouseDragged() mouseMoved() mousePressed mousePressed() mouseReleased() mouseWheel() mouseX mouseY pmouseX pmouseY`
  - Time (7): `day() hour() millis() minute() month() second() year()`
- **Output (20):**
  - Text area (3): `print() printArray() println()`
  - Image (2): `save() saveFrame()`
  - Files (15): `beginRaw() beginRecord() createOutput() createWriter() endRaw() endRecord() PrintWriter saveBytes() saveJSONArray() saveJSONObject() saveStream() saveStrings() saveTable() saveXML() selectOutput()`
- **Transform (13):** `applyMatrix() popMatrix() printMatrix() pushMatrix() resetMatrix() rotate() rotateX() rotateY() rotateZ() scale() shearX() shearY() translate()`
- **Lights & Camera (27):**
  - Lights (9): `ambientLight() directionalLight() lightFalloff() lights() lightSpecular() noLights() normal() pointLight() spotLight()`
  - Camera (8): `beginCamera() camera() endCamera() frustum() ortho() perspective() printCamera() printProjection()`
  - Coordinates (6): `modelX() modelY() modelZ() screenX() screenY() screenZ()`
  - Material (4): `ambient() emissive() shininess() specular()`
- **Color (16):**
  - Setting (7): `background() clear() colorMode() fill() noFill() noStroke() stroke()`
  - Creating & reading (9): `alpha() blue() brightness() color() green() hue() lerpColor() red() saturation()`
- **Image (20):**
  - `createImage() PImage`
  - Display (6): `image() imageMode() loadImage() noTint() requestImage() tint()`
  - Textures (3): `texture() textureMode() textureWrap()`
  - Pixels (9): `blend() copy() filter() get() loadPixels() mask() pixels[] set() updatePixels()`
- **Rendering (10):** `blendMode() clip() createGraphics() hint() noClip() PGraphics` · Shaders (4): `loadShader() PShader resetShader() shader()`
- **Typography (12):** `PFont` · `createFont() loadFont() text() textFont()` · `textAlign() textLeading() textMode() textSize() textWidth()` · `textAscent() textDescent()`
- **Math (48):**
  - `PVector`
  - Operators (11): `+ ++ += - -- -= * *= / /= %`
  - Bitwise (4): `& | << >>`
  - Calculation (17): `abs() ceil() constrain() dist() exp() floor() lerp() log() mag() map() max() min() norm() pow() round() sq() sqrt()`
  - Trig (9): `acos() asin() atan() atan2() cos() degrees() radians() sin() tan()`
  - Random (6): `noise() noiseDetail() noiseSeed() random() randomGaussian() randomSeed()`
- **Constants (5):** `HALF_PI PI QUARTER_PI TAU TWO_PI`. The interface `PConstants` actually has **174** `static final` constants [verified-local, javap]. These include renderer names `JAVA2D P2D P3D FX2D PDF SVG DXF`, color modes, blend modes, shape kinds, alignment, key codes, cursor types, and the `hint()` flags.

### Documented class members (280)
- `PVector` (26): add angleBetween array copy cross dist div dot fromAngle heading lerp limit mag magSq mult normalize random2D random3D rotate set setHeading setMag sub x y z
- `PShape` (25): addChild beginContour beginShape disableStyle enableStyle endContour endShape getChild getChildCount getVertex getVertexCount height isVisible resetMatrix rotate rotateX/Y/Z scale setFill setStroke setVertex setVisible translate width
- `PImage` (14): blend blendColor copy filter get height loadPixels mask pixels[] resize save set updatePixels width
- `PGraphics` (2): beginDraw endDraw · `PShader` (1): set · `PFont` (1): list
- `IntList` (20), `FloatList` (19), `StringList` (15), `IntDict` (19), `FloatDict` (20), `StringDict` (14), `Table` (24), `TableRow` (8), `XML` (27), `JSONObject` (13), `JSONArray` (20)
- `String` (7): charAt equals indexOf length substring toLowerCase toUpperCase
- `PrintWriter` (4), `BufferedReader` (1)

### Actual public surface of the main classes (javap on core-4.5.2.jar; unique public method names / overloads) [verified-local]
| Class | Methods (unique / overloads) | Public fields |
|---|---|---|
| PApplet | 316 / 716 | 58 |
| PGraphics | 166 / 271 | 95 |
| PGraphicsOpenGL | 102 / 139 | 55 |
| PImage | 32 / 45 | 13 |
| PShape | 116 / 178 | 17 |
| PFont | 27 / 29 | 1 |
| PVector | 31 / 63 | 3 |
| PMatrix2D | 23 / 42 | 6 |
| PMatrix3D | 26 / 50 | 16 |
| opengl.PShader | 12 / 38 | 3 |
| IntList | 51 / 60 | – |
| FloatList | 51 / 59 | – |
| StringList | 45 / 53 | – |
| IntDict | 50 / 56 | – |
| FloatDict | 49 / 54 | – |
| StringDict | 37 / 40 | – |
| Table | 94 / 154 | 6 |
| TableRow | 17 / 28 | – |
| XML | 48 / 62 | – |
| JSONObject | 40 / 48 | 1 |
| JSONArray | 56 / 72 | – |

Undocumented but public: `DoubleList, LongList, DoubleDict, LongDict` (~50 methods each), `processing.event.MouseEvent/KeyEvent/TouchEvent`, `PShapeSVG`, `PShapeOBJ`, `PStyle`, `PSurface`.

PApplet methods that are public but not in the reference, and that real sketches or the preprocessor use:
- `parseInt/parseFloat/parseChar/parseBoolean/parseByte` (emitted by the preprocessor), `str`
- `registerMethod/unregisterMethod` (library hooks)
- `sketchPath/dataPath/dataFile/savePath/sketchFile`, `listFiles/listPaths`, `createPath`
- `getMatrix/setMatrix`, `noTexture`, `attrib/attribColor/attribNormal/attribPosition`, `beginPGL/endPGL`
- `isLooping`, `exec/shell/launch`, `urlEncode/urlDecode`, `arraycopy`, `getSurface`, `focusGained/focusLost`, `mouseEntered/mouseExited`, `pause/resume`
- `windowRatio` fields `rmouseX rmouseY rwidth rheight`

Also note: core ships a default font `font/ProcessingSansPro-Regular.ttf`, and the default GLSL shaders live in `processing/opengl/shaders/*.glsl`.

Bundled examples (`app\resources\modes\java\examples`) [verified-local]:
- 254 sketches: Basics 109, Demos 31, Topics 114. 315 `.pde` files.
- 63 sketches use P3D, 31 use P2D, 18 call `loadShader`.
- 28 GLSL files, **none** with `#version`. 13 `#define PROCESSING_*_SHADER` lines: TEXTURE×7, COLOR×4, LIGHT×2.
- These make a good conformance corpus.

---

## 3. Renderers and shaders (web-port relevant)

### 3.1 JAVA2D (default) vs P2D/P3D
**JAVA2D** (`processing.awt.PGraphicsJava2D`, AWT Graphics2D):
- Default `smooth(3)` (bicubic image sampling). `smooth(2)` is bilinear. Since 3.0, `smooth`/`noSmooth` can only be set once.
- Strokes use `java.awt.BasicStroke`. `hint(ENABLE_STROKE_PURE)` is available.
- `blendMode()`: BLEND uses the default composite. **Every other mode is computed per pixel in software** through a `CompositeContext` that calls `PImage.blendColor()`, so JAVA2D supports the full set. [verified-src `PGraphicsJava2D.blendModeImpl` @4.5.2]
- No 3D, no `PShader`, no `textMode(SHAPE)`. Fonts are AWT native fonts (`createFont`) or `.vlw` bitmap fonts (`loadFont`).
- `pixels[]` is ARGB `int[]` backed by a BufferedImage.

**P2D/P3D** (`processing.opengl.PGraphics2D/3D` via **JOGL 2.6**, NEWT window):
- Default GL profile `PJOGL.profile = 2` gives `GLProfile.getGL2ES2()`, with fallback to max programmable. Profiles 3 and 4 select GL2GL3 and GL4ES3. [verified-src `PJOGL.java` line 67, `PSurfaceJOGL.initGL`]
- Geometry is tessellated on the CPU. Fills use COLOR/LIGHT/TEXTURE/TEXLIGHT shaders, chosen by whether lights and textures are active.
- **Strokes are separate quads drawn with a LINE shader** (attribute `direction` = xyz direction + w thickness). **Points use a POINT shader** (attribute `offset`).
- MSAA `smooth(2)` is the default. Up to **8 lights** (`PGL.MAX_LIGHTS = 8`).
- Text is drawn from a font texture atlas (`FontTexture`).
- `loadPixels()` reads back from GL (Y-flip). Offscreen `PGraphics` are FBOs.
- Hints: `DISABLE_OPTIMIZED_STROKE`, `ENABLE_DEPTH_SORT`, `DISABLE_DEPTH_TEST`, `DISABLE_TEXTURE_MIPMAPS`, `ENABLE_ASYNC_SAVEFRAME`, …
- `blendMode` uses GL blend functions. **DIFFERENCE, OVERLAY, HARD_LIGHT, SOFT_LIGHT, DODGE and BURN are unsupported** (warning). SUBTRACT, LIGHTEST and DARKEST depend on driver support for the blend equation. [verified-src `PGraphicsOpenGL.blendModeImpl`]
- Reference: "PShader … compatible with P2D and P3D, but not with the default renderer."

**Web mapping:**
- JAVA2D maps to Canvas2D:
  - `globalCompositeOperation` covers lighter (ADD), darken, lighten, difference, exclusion, multiply, screen, overlay, hard-light, soft-light, color-dodge, color-burn, and copy (≈REPLACE). **It has no SUBTRACT** (needs a pixel fallback).
  - Canvas cannot disable shape antialiasing (`noSmooth()` only affects image smoothing).
  - Canvas ImageData is non-premultiplied RGBA bytes, but the backing store is premultiplied, so low-alpha pixels lose precision. Processing uses ARGB ints.
- P2D/P3D map to WebGL2. Matching Processing exactly means porting its tessellator plus the line and point shaders.

### 3.2 PShader conventions (from `PShader.java` @ tag processing-1313-4.5.2 [verified-src] and the jar's string constants [verified-local])
- **Attributes Processing binds:** `position` (legacy alias `vertex`), `color`, `texCoord`, `normal`, `ambient`, `specular`, `emissive`, `shininess`, `direction` (lines), `offset` (points).
- **Uniforms Processing sets when present:**
  - `transformMatrix` (alias `transform`, = projection×modelview)
  - `modelviewMatrix` (alias `modelview`)
  - `projectionMatrix` (alias `projection`)
  - `normalMatrix` (mat3)
  - `texMatrix` (mat4: scales/offsets texCoord for NPOT/max-u/v and flip)
  - `texOffset` (vec2 = 1/texture size)
  - `texture` (alias `texMap`; sampler2D)
  - `viewport` (vec4), `resolution` (vec2 viewport w,h)
  - **`ppixels`** (previous frame/front buffer texture)
  - `lightCount`, `lightPosition[8]` (vec4), `lightNormal[8]`, `lightAmbient[8]`, `lightDiffuse[8]`, `lightSpecular[8]`, `lightFalloff[8]` (vec3: const, linear, quadratic), `lightSpot[8]` (vec2: cos angle, exponent)
  - `perspective` (int), `scale` (vec3) for line/point shaders
- **Types:** `POINT=0, LINE=1, POLY=2, COLOR=3, LIGHT=4, TEXTURE=5, TEXLIGHT=6` (protected).
- **Type detection** (`getShaderType`, first match per line):
  - `#define PROCESSING_COLOR_SHADER`, `…_LIGHT_SHADER`, `…_TEXTURE_SHADER`, `…_TEXLIGHT_SHADER`
  - `…_POLYGON_SHADER`, `…_TRIANGLES_SHADER`, `…_QUADS_SHADER` all give POLY
  - `…_POINT_SHADER` gives POINT; `…_LINE_SHADER` gives LINE
  - Attribute sniffing: `attribute vec2 offset` / `in vec2 offset;` gives POINT; `attribute vec4 direction` / `in vec4 direction` gives LINE
  - **Default: POLY**, which is accepted for any fill geometry (`checkPolyType` returns true for POLY)
  - A typed shader used for the wrong geometry falls back to the default shader with a warning. Mismatched vertex and fragment types are an error.
- **`loadShader(frag)` only:** picks the default vertex shader for the detected type. POLY or none falls back to `TexVert.glsl`, so fragment shaders receive `vertColor` and `vertTexCoord`.
- **`filter(PShader)`:** must be a poly shader. Copies the current frame to `filterTexture` and draws a full-screen quad with `blendMode(REPLACE)`, no lights, no stroke, `textureMode(NORMAL)`, and depth mask and test off. [verified-src `PGraphicsOpenGL.filter(PShader)`]
- **GLSL version handling (`PGL.preprocessVertex/FragmentSource`):**
  - If the source contains `#version` (outside a `//` comment) it is passed through untouched.
  - Otherwise Processing prepends `#version <context GLSL version>` (with `" es"` on GLES ≥ 3).
  - If that version is ≥ 130 it rewrites, by regex: `attribute` becomes `in`; `varying` becomes `out` (vertex) or `in` (fragment); the identifier **`texture` becomes `texMap`**; `texture2D|texture2DRect|texture3D|textureCube(` becomes `texture(`; `gl_FragColor` becomes `_fragColor`; and it adds `out vec4 _fragColor;` (`mediump` on ES).
  - So the supported dialect is **"GLSL 1.10/1.20-style without #version", auto-upgraded**, plus any explicit `#version` the driver accepts (e.g. 150/330).
- Default shaders use `#ifdef GL_ES precision mediump float; precision mediump int; #endif`.

### 3.3 Translating Processing shaders to WebGL2 / GLSL ES 3.00
1. Prepend `#version 300 es`. Add `precision highp float; precision highp int;` (`highp` is mandatory in practice for fragment shaders). `GL_ES` is defined in WebGL, so existing `#ifdef GL_ES` blocks will activate.
2. Apply the same keyword rewrites as Processing: `attribute→in`, `varying→out/in`, `gl_FragColor→` a declared `out vec4`, `texture2D/textureCube→texture`. Rename the `texture` uniform (it collides with the builtin `texture()` in GLSL 3.x) to `texMap`, and look up both names as Processing does.
3. User shaders with `#version 110/120/150/330`: rewrite the version line. Add precision. Remove `sampler2DRect/texture2DRect` (not in ES; Processing uses them only internally). `gl_FragData[]` becomes explicit `out`s.
4. Strictness: GLSL ES has **no implicit int→float conversion** (`float x = 1;` fails), while desktop GLSL ≥1.20 accepts it. Literals may need patching (with a warning).
5. Matrix semantics: supply `transformMatrix` = projection·modelview with Processing's conventions (Y-down screen space via the projection; texture flip via `texMatrix`). `normalMatrix` is mat3.
6. `ppixels` needs a ping-pong framebuffer (WebGL defaults to `preserveDrawingBuffer:false`). `resolution` is the viewport size in pixels (density-scaled).
7. Custom LINE/POINT shaders only work if the port reproduces Processing's stroke and point tessellation (`direction`/`offset` attributes, `viewport`, `perspective`, `scale`).
8. Boolean and int uniforms (`set(name, boolean)`) map to `uniform1i`. `set(name, PImage)` binds texture units after `ppixels` and `texture`.
9. p5.js naming differs entirely (`aPosition aTexCoord aNormal aVertexColor uModelViewMatrix uProjectionMatrix uNormalMatrix uModelMatrix uViewMatrix uSampler`; filter shaders `tex0 canvasSize texelSize vTexCoord`) [verified: grep of p5 2.3.4 build]. Processing shaders cannot run on p5 without renaming.

---

## 4. Existing web solutions

### Processing.js
- **Archived December 2018.** "the last version is, and will forever be, v1.6.6." Repo `pushed_at` 2018-12-04, `archived=true`. https://github.com/processing-js/processing-js ; history: https://blog.humphd.org/processing-js-2008/
- **API level:** Processing 1.x with a few 2.0 additions. A source grep of v1.6.6 found `XMLElement`, `loadXML/parseXML`, `PShape` (SVG), `PVector`, `ArrayList/HashMap` shims. It found **no** `IntDict/FloatList/StringList/JSONObject/loadTable/blendMode/PShader/loadShader/createShape/mouseWheel/thread`. [verified-src: `src/processing-1.6.6.js`, grep counts] The p5QuickStart page frames it against Processing 1.0. https://gotoloop.github.io/processing-js.github.io/articles/p5QuickStart.html
- **Architecture:** a regex and "light AST" rewriter, then `eval`. Calls from inside classes are prefixed with `$this_N`. [verified-src, parser comment near line 7933]
- **OpenProcessing** still offers a legacy Processing.js mode (deprecation notice 2019-08-16: "limited error reporting… no line numbers… no support for recent Processing functions"; it recommends porting to p5.js). https://intercom.help/openprocessing/en/articles/3250763-processingjs-deprecation-notice . Which Processing.js build OpenProcessing serves: [unverified].

### p5.js
- **Current: v2.3.4 (2026-09-25); npm `latest` = 2.3.4**, `r1` = 1.11.13 (1.x is still patched), `beta` = 2.3.1-rc.2.
- 2.x milestones: 2.0.0 (2025-04-17), 2.1.0 (2025-11-10), 2.2.0 (2026-01-14), 2.3.0 (2026-05-28). https://github.com/processing/p5.js/releases
- **WEBGL/shaders:**
  - WebGL2 by default since 1.7.0 (2023-07-10, #6035), with WebGL1 fallback. Accepts both GLSL ES 1.00 and `#version 300 es` shaders.
  - 2.0 added `shader()/strokeShader()/imageShader()`, `baseMaterialShader().modify()` hooks, `linesMode(SIMPLE)`, async `setup` (no `preload`), and **p5.strands** (shaders authored in JS).
  - 2.1 added strands branching and loops, and strands `noise()`.
  - 2.2 shipped an **experimental WebGPU renderer as an add-on** (`p5.webgpu.js`, `await createCanvas(w,h,WEBGPU)`).
  - 2.3 added `buildMaterialShader/buildFilterShader`, filter shaders in 2D sketches, and **compute shaders via strands on WebGPU**.
  - Release notes: https://github.com/processing/p5.js/releases/tag/v2.2.0 , …/v2.3.0 , …/v2.0.0

### Other `.pde`-in-browser / converters
| Project | Approach | Status |
|---|---|---|
| terabyte128/pde2js | JavaParser AST, then p5.js | last push 2021-03; 9★ |
| dkessner/processing-p5-convert | npm `java-parser`, then p5.js; live demo | last push 2021-09; 19★ |
| OTH-AW-Meiller/p5forge | own tokenizer/parser/semantics/generator, then p5.js with a runtime shim | active (created 2026-06, pushed 2026-07-31); 3★ |
| "processing-ts" | — | no public repo by that name found [unverified/none] |
| CheerpJ (Leaning Technologies) | runs JVM bytecode in Wasm (AWT/Swing); could run compiled sketches | Java 8/11, 17 preview; v4.3 Apr 2026; commercial, free for FOSS/personal |
| TeaVM | AOT Java bytecode → JS/Wasm | mentioned on the forum as possible but complex |

Sources: https://github.com/terabyte128/pde2js , https://github.com/dkessner/processing-p5-convert , https://github.com/OTH-AW-Meiller/p5forge , https://cheerpj.com/ , https://labs.leaningtech.com/blog/cheerpj-4.0 , https://infoworld.com/article/3999644/cheerpj-webassembly-jvm-previews-java-17-support.html

### Processing Foundation web plans (2025–2026)
- **No official Java-sketch → browser export exists or is announced for the PDE.**
- Official direction:
  - **libprocessing** (https://github.com/processing/libprocessing, created 2025-11-21): "experimental… Rust… built on Bevy… uses WebGPU… designed to (eventually) support desktop, mobile, and web". The README has a "Building for web" section: the `processing_wasm` crate "provides WebAssembly bindings that expose a JavaScript API mirroring the C FFI" (wasm-pack). Python bindings are `mewnala`. Talk: LGM 2026, https://app.media.ccc.de/v/lgm-2026-110668-expanding-processing-s-future-with-a-rust-rendering-engine
  - processing4 4.5.6 merged a WebGPU renderer that uses libprocessing.
- Forum thread "Processing in the browser: one day?" (Dec 2025–Feb 2026): the community lead says the PDE had >1M downloads last year and is not going away. A user cites a Foundation post "exploring #WebGPU and #WebAssembly to bring Processing to the browser". Maintainer @moon (2026-02-17): "we are not super into the WASM just yet, but we are on our way!" https://discourse.processing.org/t/processing-in-the-browser-one-day/47665
- Related official repos:
  - `processing/processing-p5.js-mode` (2025-07): p5.js sketches in the PDE.
  - `processing/processing-vscode-extension` (2025-05; TextMate grammar `syntaxes/processing.tmGrammar.json`, uses the PDE install/LSP).
  - `processing/p5.js-editor-op` ("Technical research on p5.js Editor using OpenProcessing API", 2026).
  - p5.js-web-editor is active (pushed 2026-10-03).

---

## 5. Grammars (tree-sitter / Lezer)
- **No maintained tree-sitter grammar for Processing was found.**
  - GitHub search turned up `vaishnn/tree-sitter-processing` (created 2025-10-18, contains only a LICENSE, 1 commit) and unrelated "processing" repos.
  - nvim-treesitter has no Processing parser [unverified, but nothing found].
  - In practice editors use tree-sitter-java or TextMate grammars for `.pde`.
- **No Lezer/CodeMirror 6 Processing grammar was found** (GitHub repo and code searches).
- What exists:
  - The official VS Code extension's TextMate grammar: https://github.com/processing/processing-vscode-extension/tree/main/syntaxes ("TODO: Generate grammar based on the installed Processing version").
  - Older community extensions: AvinZarlez/processing-vscode, Luke-zhang-04/processing-vscode.
  - The ANTLR4 grammar itself (§1.3), which is the authoritative syntax.

---

## 6. Libraries: popularity proxy and web feasibility
Processing does not publish download counts. As a proxy I counted **GitHub code-search hits for `"import <pkg>" extension:pde`** (legacy search API `total_count`, approximate, 2026-10-04; `libcounts.tsv`):

| Rank | Library (package) | .pde files | Web feasibility |
|---|---|---|---|
| 1 | Minim (`ddf.minim`) | ~14,048 | **High:** Web Audio (AudioBufferSourceNode, AnalyserNode for FFT, getUserMedia for input). Large API |
| 2 | Serial (`processing.serial`, core) | ~12,768 | **Medium:** Web Serial (Chromium only, secure context, user-gesture `requestPort`, async reads need buffering to emulate `available()/read()/serialEvent`) |
| 3 | ControlP5 (`controlP5`) | ~12,320 | **Medium:** drawn with the Processing API plus events; needs a transpile of the Java library or a DOM/JS reimplementation |
| 4 | toxiclibs (`toxi`) | ~8,288 | Medium: pure Java math; transpile or shim (toxiclibs.js is old) |
| 5 | Video (`processing.video`, GStreamer) | ~6,208 | **High:** Capture = getUserMedia + `<video>`; Movie = HTMLVideoElement; pixels via drawImage (CORS; codec support differs) |
| 6 | oscP5 / netP5 | ~6,184 / ~5,184 | **Low:** no UDP in browsers; needs a WebSocket↔OSC bridge |
| 7 | PDF (`processing.pdf`, core) | ~4,872 | Medium: record drawing calls to jsPDF/PDFKit (2D) |
| 8 | Sound (`processing.sound`, JSyn) | ~3,800 | **High:** Web Audio (oscillators, noise, filters, Env, FFT/Amplitude, AudioIn, SoundFile). p5.sound/Tone.js is precedent |
| 9 | PeasyCam (`peasy`) | ~3,160 | **High:** small; reimplement (camera math + mouse) |
| 10 | Net (`processing.net`) | ~1,624 | Partial: Client via WebSocket (needs WS server or bridge); Server impossible in the browser |

Also seen: OpenCV (`gab.opencv`) ~1,584 (OpenCV.js/Wasm possible but heavy); G4P ~1,480; geomerative ~1,380 (opentype.js); io (Pi GPIO/I2C/SPI) ~1,308 (not possible); HE_Mesh (`wblut`) ~1,206; Box2D for Processing ~682 (planck.js/box2d-wasm); themidibus ~614 (Web MIDI: yes); gifAnimation ~566; VideoExport (`com.hamoid`) ~557 (MediaRecorder/WebCodecs); Syphon ~494 / Spout ~102 (no); OpenKinect ~460 / KinectPV2 ~334 (no); SVG export (`processing.svg`) ~425 (easy: canvas2svg-style recorder; note that SVG *loading* is core `loadShape`); beads ~415 (Web Audio); http.requests ~266 (fetch, CORS); DXF ~217 (easy text export); websockets ~168 (native WebSocket client).

Library versions:
- processing-sound v2.4.0 (2024-03-22). Its reference lists 25 classes, including SinOsc, SoundFile, AudioIn, FFT, Amplitude, BeatDetector, PitchDetector, Reverb, Delay, filters.
- processing-video "Release 12 (2.2.2)" (2023-01-16). Classes: Capture, Movie.
- ControlP5 v2.2.6 (2016). Minim v2.2.2 (2015). oscP5 v2.0.4 (2015).

---

## 7. Java semantics that break naive Java→JS transpilers
Values below are **real outputs** from compiling a test sketch through Processing 4.5.2's preprocessor + ECJ and running it on the JVM [verified-local, `tests3/s02.pde`]: `7/2=3`, `float b=7/2 → 3.0`, `7/2.0=3.5`, `char ch='a'; ch+=2 → 'c'`, `ch+1 → 100`, `long 9007199254740993` (exact), `(byte)200=-56`, `Integer.MAX_VALUE+1=-2147483648`, `"ab"==new String("ab") → false`, `-7/2=-3`, `-7%3=-1`, `(int)3.99=3`, `(int)-3.99=-3`, `1<<33=2`, `1L<<33=8589934592`, `5>>>1=2`, `-5>>>28=15`.

| # | Pitfall | Java/Processing semantics | Naive JS result | Processing.js handling |
|---|---|---|---|---|
| 1 | Integer division | `int/int` truncates toward zero; `/0` throws ArithmeticException | float result | **Not handled**: docs say you must cast, `int g = (int)(mouseX / i)` (p5QuickStart) |
| 2 | Compound assignment narrowing | `int x; x += 0.7;` truncates every time (common `x += speed` bug-as-feature) | accumulates the fraction | not handled [unverified] |
| 3 | int overflow / wrap | 32-bit wrap (`MAX+1 = MIN`); hash and LCG code relies on it | grows past 2^31 | not handled [unverified] |
| 4 | Casts | `(int)` truncates **and saturates** (`(int)1e10 = 2147483647`, `(int)NaN = 0`); `(byte)`, `(char)` wrap | `|0` wraps rather than saturating | `(int)x` regex-rewritten to `__int_cast(x)` = `0|val` (wrong for out-of-range) [verified-src] |
| 5 | float vs double | Processing literals are float32; the preprocessor appends `f` even in `double` expressions | all double; `Math.fround` needed for parity | `3.0f` becomes `3.0` (suffix stripped) [verified-src] |
| 6 | Float printing | `println(3.0)` prints `3.0`; float `toString` is the shortest float32 round-trip (`0.1f` prints `0.1`) | prints `3`, `0.10000000149011612` | [unverified] |
| 7 | char | 16-bit numeric type; `c+1` is int, `c+=1` stays char; `String+char` concatenates the character; `key=='a'`; `switch(key){case 'a':}` | 1-char strings vs numbers get mixed up | **`Char` wrapper object** with `valueOf()` returning the code (docs: "No char datatype… use explicit int()/str()") [verified-src] |
| 8 | long | 64-bit; bit ops on long; `>2^53` exact | precision loss; 32-bit bitwise ops | none (plain Number) [unverified] |
| 9 | Shifts / `>>>` | int shift count masked to 5 bits; `-1>>>0 = -1` in Java (int) | `-1>>>0 = 4294967295` | n/a |
| 10 | String `==` and methods | `==` is reference equality; `replace` replaces **all** occurrences; `split(regex)` drops trailing empties; `equals/compareTo/hashCode/format` | `==` compares values; `replace` replaces the first only | shims `__equals`, `__replace`, `__replaceAll`, `__split`, `__matches`, `__startsWith`, `__hashCode`, `__toCharArray`… [verified-src] |
| 11 | Overloading | resolved statically by parameter types; core API is heavily overloaded (`fill(int)` gray vs `fill(color)` heuristic, `random(hi)`/`random(lo,hi)`, `ArrayList.remove(int)` vs `remove(Object)`) | last definition wins | **dispatch by argument count only** (`$overloads[arguments.length]`); docs require "dummy" overrides in subclasses [verified-src + docs] |
| 12 | Field/method name collision | Java allows `float speed; void speed()` | collides on the same object | documented limitation ("avoid… variable foo… and function foo()") |
| 13 | Inner classes | every sketch class is an **inner class** of the PApplet subclass, so unqualified `width`, `mouseX`, `random()`, and sketch globals resolve to the sketch; `static class` cannot touch them; non-constant `static` fields in sketch classes are a compile error at -source 11 | needs scope analysis | `$this_N` scope chain, static members as `ClassName.x` [verified-src] |
| 14 | Default init | fields default to 0/false/null/'\0'; arrays zero-filled; multi-dim `new int[3][4]` | `undefined`, then NaN | n/a (use typed arrays: `Int32Array`; `Float32Array` also gives float32 rounding) |
| 15 | Array covariance and checks | `Object[] o = new String[2]` legal; ArrayStoreException; AIOOBE on bad index | silent `undefined` | none |
| 16 | Exceptions | checked exceptions; typed `catch` dispatch; NPE/AIOOBE/NumberFormatException raised at runtime | single untyped catch | catch parameter types dropped (`transformParams`); multiple catch blocks can't be distinguished [verified-src; exact failure mode unverified] |
| 17 | switch | on int/char/String/enum; enum `case RED:` unqualified | JS `===` works for strings; chars/enums need lowering | n/a |
| 18 | Ternary/numeric promotion | `true ? 1 : 2.0` is `1.0` (double); `int*float` is float | type-dependent printing | n/a |
| 19 | Boxing | `Integer == Integer` identity above 127; generics erasure; `HashMap` keyed by objects uses `hashCode/equals` | Map uses identity/SameValueZero | `HashMap`/`ArrayList` JS classes |
| 20 | Blocking APIs / threads | `delay()`, synchronous `loadStrings/loadImage`, `thread("fn")`, `synchronized` | the browser can't block | async I/O; requires `/* @pjs preload="…" */` |
| 21 | Reserved words / identifiers | Java identifiers that are JS keywords or globals (`function`, `arguments`, `eval`, `let`, `yield`, `delete`, `in`, `typeof`, `name`, `length` on functions) | syntax/runtime errors | partial renaming [unverified] |
| 22 | Color ints | `color` is `int` ARGB; `#RRGGBB` is `0xFFRRGGBB` (negative int); `fill(c)` treats values outside 0..range or with alpha bits as colors | sign/unsigned confusion | "unpredictable colors" for out-of-range values (docs) |

---

## Sources (primary)
- Local install: `C:\Program Files\Processing\app\Processing.cfg`; `app\resources\modes\java\mode\{preprocessor,java,core,app}-4.5.2.jar`; `app\resources\jdk\release`; bundled examples.
- processing4 releases: https://github.com/processing/processing4/releases (4.4.0–4.5.7); Changes in 4.4: https://github.com/processing/processing4/wiki/Changes-in-4.4
- Grammar: https://github.com/processing/processing4/tree/main/java/preprocessor/src/main/antlr ; PR #1232 https://github.com/processing/processing4/pull/1232 ; commit 00e4243
- Compiler level: https://github.com/processing/processing4/blob/main/java/src/processing/mode/java/Compiler.java ; https://github.com/processing/processing4/blob/main/java/src/processing/mode/java/PreprocService.java
- Text blocks: https://github.com/processing/processing4/blob/processing-1313-4.5.2/java/src/processing/mode/java/preproc/PdeParseTreeListener.java
- Shaders/renderers @4.5.2: https://github.com/processing/processing4/blob/processing-1313-4.5.2/core/src/processing/opengl/PShader.java , …/PGL.java , …/PJOGL.java , …/PSurfaceJOGL.java , …/PGraphicsOpenGL.java , …/core/src/processing/awt/PGraphicsJava2D.java
- WebGPU: https://github.com/processing/processing4/pull/1514 ; PShader interface #1556 ; https://github.com/processing/libprocessing
- Reference data: https://github.com/processing/processing-website/tree/main/content/references/translations/en
- Processing.js: https://github.com/processing-js/processing-js ; https://raw.githubusercontent.com/processing-js/processing-js/v1.6.6/processing.js ; https://gotoloop.github.io/processing-js.github.io/articles/p5QuickStart.html ; https://blog.humphd.org/processing-js-2008/
- OpenProcessing: https://intercom.help/openprocessing/en/articles/3250763-processingjs-deprecation-notice
- p5.js: https://github.com/processing/p5.js/releases ; npm `p5` dist-tags; https://cdn.jsdelivr.net/npm/p5@2.3.4/lib/p5.js
- Forum: https://discourse.processing.org/t/processing-in-the-browser-one-day/47665
- Converters: https://github.com/terabyte128/pde2js , https://github.com/dkessner/processing-p5-convert , https://github.com/OTH-AW-Meiller/p5forge
- CheerpJ: https://cheerpj.com/ , https://labs.leaningtech.com/blog/cheerpj-4.0
- VS Code extension: https://github.com/processing/processing-vscode-extension
- Libraries: https://github.com/processing/processing-sound , https://github.com/processing/processing-video , https://github.com/sojamo/controlp5 , https://github.com/ddf/Minim , https://github.com/jdf/peasycam , https://github.com/sojamo/oscp5
