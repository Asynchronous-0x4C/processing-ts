// processing-ts/webgl: the OpenGL renderers (P2D, P3D, PShader) and PShape, imported statically.
// The runtime loads them on demand by itself; import this module to put them in the same bundle instead
// (one file, no extra request when the sketch starts).
import * as gl from "./runtime/opengl/index";
import * as shapes from "./runtime/shapes/index";
import { registerOpenGL, registerShapes } from "./runtime/openglModule";

registerOpenGL(gl);
registerShapes(shapes);

export * from "./runtime/opengl/index";
export * from "./runtime/shapes/index";
