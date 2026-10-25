// Parts of the runtime that most sketches do not need, loaded on demand: the OpenGL renderers (P2D,
// P3D, PShader) and the shapes (PShape, SVG/OBJ, PMatrix3D). DefaultRunner looks at the compiled code
// (usesOpenGL()/usesShapes()) and imports them before running the sketch; the runtime reaches them here.
import type * as GLModule from "./opengl/index";
import type * as ShapesModule from "./shapes/index";
import { exceptions } from "../../runtime/lang/index.ts";

export type OpenGLModule=typeof GLModule;
export type ShapesModuleType=typeof ShapesModule;

let gl:OpenGLModule|null=null;
let shapes:ShapesModuleType|null=null;

/** Make the OpenGL renderers available. */
export function registerOpenGL(m:OpenGLModule){
  gl=m;
}

/** The OpenGL module, if loaded. */
export function openGL():OpenGLModule|null{
  return gl;
}

/** The OpenGL module; an error when the sketch needs it but it was not loaded. */
export function requireOpenGL():OpenGLModule{
  if(!gl)throw new exceptions.RuntimeException("The OpenGL renderers (P2D, P3D) are not loaded.");
  return gl;
}

/** Load the OpenGL module (once). */
export async function loadOpenGL():Promise<OpenGLModule>{
  if(!gl)gl=await import("./opengl/index");
  return gl;
}

/** The shapes module; an error when the sketch needs it but it was not loaded. */
export function requireShapes():ShapesModuleType{
  if(!shapes)throw new exceptions.RuntimeException("PShape is not loaded.");
  return shapes;
}

/** Load the shapes module (once). */
export async function loadShapes():Promise<ShapesModuleType>{
  if(!shapes)shapes=await import("./shapes/index");
  return shapes;
}

/**
 * Whether compiled code uses the OpenGL renderers or shaders: P2D/P3D (inlined as their class names),
 * processing.opengl classes, loadShader().
 */
export function usesOpenGL(code:string):boolean{
  return /processing\.opengl\.|\.loadShader\(/.test(code);
}

/** Whether compiled code uses PShape or PMatrix3D (OpenGL sketches always load them). */
export function usesShapes(code:string):boolean{
  return /processing\.core\.(PShape|PMatrix3D)|\.(createShape|loadShape|shape)\(/.test(code)||usesOpenGL(code);
}
