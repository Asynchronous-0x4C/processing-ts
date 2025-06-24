export declare class PConstants {
    readonly X: number;
    readonly Y: number;
    readonly Z: number;
    readonly JAVA2D = "processing.awt.PGraphicsJava2D";
    readonly P2D = "processing.opengl.PGraphics2D";
    readonly P3D = "processing.opengl.PGraphics3D";
    /**
     * @deprecated Use PConstants.P3D instead
     */
    readonly OPENGL = "processing.opengl.PGraphics3D";
    readonly FX2D = "processing.javafx.PGraphicsFX2D";
    readonly PDF = "processing.pdf.PGraphicsPDF";
    readonly SVG = "processing.svg.PGraphicsSVG";
    readonly DXF = "processing.dxf.RawDXF";
    readonly OTHER = 0;
    readonly WINDOWS = 1;
    readonly MACOS = 2;
    readonly LINUX = 3;
    /** @deprecated Marketers gonna market, use `MACOS` */
    readonly MACOSX = 2;
    readonly platformNames: string[];
    readonly EPSILON = 0.0001;
    readonly MAX_FLOAT: number;
    readonly MIN_FLOAT: number;
    readonly MAX_INT: number;
    readonly MIN_INT: number;
    readonly VERTEX = 0;
    readonly BEZIER_VERTEX = 1;
    readonly QUADRATIC_VERTEX = 2;
    readonly CURVE_VERTEX = 3;
    readonly BREAK = 4;
    /**@deprecated*/
    readonly QUAD_BEZIER_VERTEX = 2;
    readonly PI: number;
    readonly HALF_PI: number;
    readonly THIRD_PI: number;
    readonly QUARTER_PI: number;
    readonly TWO_PI: number;
    readonly TAU: number;
    readonly DEG_TO_RAD: number;
    readonly RAD_TO_DEG: number;
    readonly WHITESPACE = " \t\n\r\f\u00A0";
    readonly RGB = 1;
    readonly ARGB = 2;
    readonly HSB = 3;
    readonly ALPHA = 4;
    readonly TIFF = 0;
    readonly TARGA = 1;
    readonly JPEG = 2;
    readonly GIF = 3;
    readonly BLUR = 11;
    readonly GRAY = 12;
    readonly INVERT = 13;
    readonly OPAQUE = 14;
    readonly POSTERIZE = 15;
    readonly THRESHOLD = 16;
    readonly ERODE = 17;
    readonly DILATE = 18;
    readonly REPLACE = 0;
    readonly BLEND: number;
    readonly ADD: number;
    readonly SUBTRACT: number;
    readonly LIGHTEST: number;
    readonly DARKEST: number;
    readonly DIFFERENCE: number;
    readonly EXCLUSION: number;
    readonly MULTIPLY: number;
    readonly SCREEN: number;
    readonly OVERLAY: number;
    readonly HARD_LIGHT: number;
    readonly SOFT_LIGHT: number;
    readonly DODGE: number;
    readonly BURN: number;
    readonly CHATTER = 0;
    readonly COMPLAINT = 1;
    readonly PROBLEM = 2;
    readonly PROJECTION = 0;
    readonly MODELVIEW = 1;
    readonly CUSTOM = 0;
    readonly ORTHOGRAPHIC = 2;
    readonly PERSPECTIVE = 3;
    readonly GROUP = 0;
    readonly POINT = 2;
    readonly POINTS = 3;
    readonly LINE = 4;
    readonly LINES = 5;
    readonly LINE_STRIP = 50;
    readonly LINE_LOOP = 51;
    readonly TRIANGLE = 8;
    readonly TRIANGLES = 9;
    readonly TRIANGLE_STRIP = 10;
    readonly TRIANGLE_FAN = 11;
    readonly QUAD = 16;
    readonly QUADS = 17;
    readonly QUAD_STRIP = 18;
    readonly POLYGON = 20;
    readonly PATH = 21;
    readonly RECT = 30;
    readonly ELLIPSE = 31;
    readonly ARC = 32;
    readonly SPHERE = 40;
    readonly BOX = 41;
    readonly OPEN = 1;
    readonly CLOSE = 2;
    /** Draw mode convention to use (x, y) to (width, height) */
    readonly CORNER = 0;
    /** Draw mode convention to use (x1, y1) to (x2, y2) coordinates */
    readonly CORNERS = 1;
    /** Draw mode from the center, and using the radius */
    readonly RADIUS = 2;
    /**
     * Draw from the center, using second pair of values as the diameter.
     * Formerly called CENTER_DIAMETER in alpha releases.
     */
    readonly CENTER = 3;
    /**
     * Synonym for the CENTER constant. Draw from the center,
     * using second pair of values as the diameter.
     */
    readonly DIAMETER = 3;
    readonly CHORD = 2;
    readonly PIE = 3;
    /** Default vertical alignment for text placement */
    readonly BASELINE = 0;
    /** Align text to the top */
    readonly TOP = 101;
    /** Align text from the bottom, using the baseline. */
    readonly BOTTOM = 102;
    /** texture coordinates in 0..1 range */
    readonly NORMAL = 1;
    /** texture coordinates based on image width/height */
    readonly IMAGE = 2;
    /** textures are clamped to their edges */
    readonly CLAMP = 0;
    readonly REPEAT = 1;
    /**
     * textMode(MODEL) is the default, meaning that characters
     * will be affected by transformations like any other shapes.
     * <p/>
     * Changed value in 0093 to not interfere with LEFT, CENTER, and RIGHT.
     */
    readonly MODEL = 4;
    readonly SHAPE = 5;
    readonly SQUARE: number;
    readonly ROUND: number;
    readonly PROJECT: number;
    readonly MITER: number;
    readonly BEVEL: number;
    readonly AMBIENT = 0;
    readonly DIRECTIONAL = 1;
    readonly SPOT = 3;
    readonly BACKSPACE = 8;
    readonly TAB = 9;
    readonly ENTER = 10;
    readonly RETURN = 13;
    readonly ESC = 27;
    readonly DELETE = 127;
    readonly CODED = 65535;
    readonly UP = 38;
    readonly DOWN = 40;
    readonly LEFT = 37;
    readonly RIGHT = 39;
    readonly ALT = 18;
    readonly CONTROL = 17;
    readonly SHIFT = 16;
    /** Screen orientation constant for portrait (the hamburger way). */
    readonly PORTRAIT = 1;
    /** Screen orientation constant for landscape (the hot dog way). */
    readonly LANDSCAPE = 2;
    /** Use with fullScreen() to indicate all available displays. */
    readonly SPAN = 0;
    readonly ARROW = "default";
    readonly CROSS = "crosshair";
    readonly HAND = "grab";
    readonly MOVE = "move";
    readonly TEXT = "text";
    readonly WAIT = "progress";
    /**@deprecated*/
    readonly ENABLE_NATIVE_FONTS = 1;
    /**@deprecated*/
    readonly DISABLE_NATIVE_FONTS = -1;
    readonly DISABLE_DEPTH_TEST = 2;
    readonly ENABLE_DEPTH_TEST = -2;
    readonly ENABLE_DEPTH_SORT = 3;
    readonly DISABLE_DEPTH_SORT = -3;
    readonly DISABLE_OPENGL_ERRORS = 4;
    readonly ENABLE_OPENGL_ERRORS = -4;
    readonly DISABLE_DEPTH_MASK = 5;
    readonly ENABLE_DEPTH_MASK = -5;
    readonly DISABLE_OPTIMIZED_STROKE = 6;
    readonly ENABLE_OPTIMIZED_STROKE = -6;
    readonly ENABLE_STROKE_PERSPECTIVE = 7;
    readonly DISABLE_STROKE_PERSPECTIVE = -7;
    readonly DISABLE_TEXTURE_MIPMAPS = 8;
    readonly ENABLE_TEXTURE_MIPMAPS = -8;
    readonly ENABLE_STROKE_PURE = 9;
    readonly DISABLE_STROKE_PURE = -9;
    readonly ENABLE_BUFFER_READING = 10;
    readonly DISABLE_BUFFER_READING = -10;
    readonly DISABLE_KEY_REPEAT = 11;
    readonly ENABLE_KEY_REPEAT = -11;
    readonly DISABLE_ASYNC_SAVEFRAME = 12;
    readonly ENABLE_ASYNC_SAVEFRAME = -12;
    readonly HINT_COUNT = 13;
}
