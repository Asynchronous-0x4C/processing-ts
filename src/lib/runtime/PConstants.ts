export class PConstants{
  readonly X:number=0;
  readonly Y:number=1;
  readonly Z:number=2;

  readonly JAVA2D="processing.awt.PGraphicsJava2D";
  readonly P2D="processing.opengl.PGraphics2D";
  readonly P3D="processing.opengl.PGraphics3D";

  /**
   * @deprecated Use PConstants.P3D instead
   */
  readonly OPENGL=this.P3D;

  readonly FX2D="processing.javafx.PGraphicsFX2D";

  readonly PDF="processing.pdf.PGraphicsPDF";
  readonly SVG="processing.svg.PGraphicsSVG";
  readonly DXF="processing.dxf.RawDXF";
  
  readonly OTHER  =0;
  readonly WINDOWS=1;
  readonly MACOS  =2;
  readonly LINUX  =3;

  /** @deprecated Marketers gonna market, use `MACOS` */
  readonly MACOSX =2;

  readonly platformNames = [
    "other", "windows", "macos", "linux"
  ];


  readonly EPSILON = 0.0001;

  readonly MAX_FLOAT = Number.MAX_VALUE;
  readonly MIN_FLOAT = -Number.MAX_VALUE;
  readonly MAX_INT = Number.MAX_SAFE_INTEGER;
  readonly MIN_INT = Number.MIN_SAFE_INTEGER;

  readonly VERTEX = 0;
  readonly BEZIER_VERTEX = 1;
  readonly QUADRATIC_VERTEX = 2;
  readonly CURVE_VERTEX = 3;
  readonly BREAK = 4;

  /**@deprecated*/
  readonly QUAD_BEZIER_VERTEX = 2;

  readonly PI = Math.PI;
  readonly HALF_PI = Math.PI / 2.0;
  readonly THIRD_PI = Math.PI / 3.0;
  readonly QUARTER_PI = Math.PI / 4.0;
  readonly TWO_PI = 2.0 * Math.PI;
  readonly TAU = 2.0 * Math.PI;

  readonly DEG_TO_RAD = this.PI/180.0;
  readonly RAD_TO_DEG = 180.0/this.PI;

  readonly WHITESPACE = " \t\n\r\f\u00A0";

  readonly RGB   = 1;  // image & color
  readonly ARGB  = 2;  // image
  readonly HSB   = 3;  // color
  readonly ALPHA = 4;  // image

  readonly TIFF  = 0;
  readonly TARGA = 1;
  readonly JPEG  = 2;
  readonly GIF   = 3;

  readonly BLUR      = 11;
  readonly GRAY      = 12;
  readonly INVERT    = 13;
  readonly OPAQUE    = 14;
  readonly POSTERIZE = 15;
  readonly THRESHOLD = 16;
  readonly ERODE     = 17;
  readonly DILATE    = 18;

  readonly REPLACE    = 0;
  readonly BLEND      = 1 << 0;
  readonly ADD        = 1 << 1;
  readonly SUBTRACT   = 1 << 2;
  readonly LIGHTEST   = 1 << 3;
  readonly DARKEST    = 1 << 4;
  readonly DIFFERENCE = 1 << 5;
  readonly EXCLUSION  = 1 << 6;
  readonly MULTIPLY   = 1 << 7;
  readonly SCREEN     = 1 << 8;
  readonly OVERLAY    = 1 << 9;
  readonly HARD_LIGHT = 1 << 10;
  readonly SOFT_LIGHT = 1 << 11;
  readonly DODGE      = 1 << 12;
  readonly BURN       = 1 << 13;

  readonly CHATTER   = 0;
  readonly COMPLAINT = 1;
  readonly PROBLEM   = 2;

  readonly PROJECTION = 0;
  readonly MODELVIEW  = 1;

  readonly CUSTOM       = 0; // user-specified fanciness
  readonly ORTHOGRAPHIC = 2; // 2D isometric projection
  readonly PERSPECTIVE  = 3; // perspective matrix

  readonly GROUP           = 0;   // createShape()

  readonly POINT           = 2;   // primitive
  readonly POINTS          = 3;   // vertices

  readonly LINE            = 4;   // primitive
  readonly LINES           = 5;   // beginShape(), createShape()
  readonly LINE_STRIP      = 50;  // beginShape()
  readonly LINE_LOOP       = 51;

  readonly TRIANGLE        = 8;   // primitive
  readonly TRIANGLES       = 9;   // vertices
  readonly TRIANGLE_STRIP  = 10;  // vertices
  readonly TRIANGLE_FAN    = 11;  // vertices

  readonly QUAD            = 16;  // primitive
  readonly QUADS           = 17;  // vertices
  readonly QUAD_STRIP      = 18;  // vertices

  readonly POLYGON         = 20;  // in the end, probably cannot
  readonly PATH            = 21;  // separate these two

  readonly RECT            = 30;  // primitive
  readonly ELLIPSE         = 31;  // primitive
  readonly ARC             = 32;  // primitive

  readonly SPHERE          = 40;  // primitive
  readonly BOX             = 41;  // primitive

  readonly OPEN = 1;
  readonly CLOSE = 2;

  /** Draw mode convention to use (x, y) to (width, height) */
  readonly CORNER   = 0;
  /** Draw mode convention to use (x1, y1) to (x2, y2) coordinates */
  readonly CORNERS  = 1;
  /** Draw mode from the center, and using the radius */
  readonly RADIUS   = 2;
  /**
   * Draw from the center, using second pair of values as the diameter.
   * Formerly called CENTER_DIAMETER in alpha releases.
   */
  readonly CENTER   = 3;
  /**
   * Synonym for the CENTER constant. Draw from the center,
   * using second pair of values as the diameter.
   */
  readonly DIAMETER = 3;


  // arc drawing modes

  //static final int OPEN = 1;  // shared
  readonly CHORD  = 2;
  readonly PIE    = 3;


  // vertically alignment modes for text

  /** Default vertical alignment for text placement */
  readonly BASELINE = 0;
  /** Align text to the top */
  readonly TOP = 101;
  /** Align text from the bottom, using the baseline. */
  readonly BOTTOM = 102;


  // uv texture orientation modes

  /** texture coordinates in 0..1 range */
  readonly NORMAL     = 1;
  /** texture coordinates based on image width/height */
  readonly IMAGE      = 2;


  // texture wrapping modes

  /** textures are clamped to their edges */
  readonly CLAMP = 0;
  readonly REPEAT = 1;


  // text placement modes

  /**
   * textMode(MODEL) is the default, meaning that characters
   * will be affected by transformations like any other shapes.
   * <p/>
   * Changed value in 0093 to not interfere with LEFT, CENTER, and RIGHT.
   */
  readonly MODEL = 4;
  readonly SHAPE = 5;


  // text alignment modes
  // are inherited from LEFT, CENTER, RIGHT

  // stroke modes

  readonly SQUARE   = 1 << 0;  // called 'butt' in the svg spec
  readonly ROUND    = 1 << 1;
  readonly PROJECT  = 1 << 2;  // called 'square' in the svg spec
  readonly MITER    = 1 << 3;
  readonly BEVEL    = 1 << 5;


  // lighting

  readonly AMBIENT = 0;
  readonly DIRECTIONAL  = 1;
  //static final int POINT  = 2;  // shared with shape feature
  readonly SPOT = 3;


  // key constants

  // only including the most-used of these guys
  // if people need more esoteric keys, they can learn about
  // the esoteric java KeyEvent api and of virtual keys

  // both key and keyCode will equal these values
  // for 0125, these were changed to 'char' values, because they
  // can be upgraded to ints automatically by Java, but having them
  // as ints prevented split(blah, TAB) from working
  readonly BACKSPACE = 8;
  readonly TAB       = 9;
  readonly ENTER     = 10;
  readonly RETURN    = 13;
  readonly ESC       = 27;
  readonly DELETE    = 127;

  // i.e. if ((key == CODED) && (keyCode == UP))
  readonly CODED     = 0xffff;

  // key will be CODED and keyCode will be this value
  readonly UP        = 38;
  readonly DOWN      = 40;
  readonly LEFT      = 37;
  readonly RIGHT     = 39;

  // key will be CODED and keyCode will be this value
  readonly ALT       = 18;
  readonly CONTROL   = 17;
  readonly SHIFT     = 16;


  // orientations (only used on Android, ignored on desktop)

  /** Screen orientation constant for portrait (the hamburger way). */
  readonly PORTRAIT = 1;
  /** Screen orientation constant for landscape (the hot dog way). */
  readonly LANDSCAPE = 2;

  /** Use with fullScreen() to indicate all available displays. */
  readonly SPAN = 0;

  // cursor types

  readonly ARROW = "default";
  readonly CROSS = "crosshair";
  readonly HAND  = "grab";
  readonly MOVE  = "move";
  readonly TEXT  = "text";
  readonly WAIT  = "progress";


  // hints - hint values are positive for the alternate version,
  // negative of the same value returns to the normal/default state

  /**@deprecated*/
  readonly ENABLE_NATIVE_FONTS        =  1;
  /**@deprecated*/
  readonly DISABLE_NATIVE_FONTS       = -1;

  readonly DISABLE_DEPTH_TEST         =  2;
  readonly ENABLE_DEPTH_TEST          = -2;

  readonly ENABLE_DEPTH_SORT          =  3;
  readonly DISABLE_DEPTH_SORT         = -3;

  readonly DISABLE_OPENGL_ERRORS      =  4;
  readonly ENABLE_OPENGL_ERRORS       = -4;

  readonly DISABLE_DEPTH_MASK         =  5;
  readonly ENABLE_DEPTH_MASK          = -5;

  readonly DISABLE_OPTIMIZED_STROKE   =  6;
  readonly ENABLE_OPTIMIZED_STROKE    = -6;

  readonly ENABLE_STROKE_PERSPECTIVE  =  7;
  readonly DISABLE_STROKE_PERSPECTIVE = -7;

  readonly DISABLE_TEXTURE_MIPMAPS    =  8;
  readonly ENABLE_TEXTURE_MIPMAPS     = -8;

  readonly ENABLE_STROKE_PURE         =  9;
  readonly DISABLE_STROKE_PURE        = -9;

  readonly ENABLE_BUFFER_READING      =  10;
  readonly DISABLE_BUFFER_READING     = -10;

  readonly DISABLE_KEY_REPEAT         =  11;
  readonly ENABLE_KEY_REPEAT          = -11;

  readonly DISABLE_ASYNC_SAVEFRAME    =  12;
  readonly ENABLE_ASYNC_SAVEFRAME     = -12;

  readonly HINT_COUNT                 =  13;
}