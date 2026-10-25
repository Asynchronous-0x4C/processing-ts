import type * as GLModule from "./opengl/index";
import { exceptions } from "../../runtime/lang/index.ts";

export type OpenGLModule=typeof GLModule;

let gl:OpenGLModule|null=null;

/** Make the OpenGL renderers available (the runner imports them before running a sketch that uses them). */
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
