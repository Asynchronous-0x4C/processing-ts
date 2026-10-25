// PShape (createShape(), shape(), loadShape() of SVG/OBJ) and PMatrix3D: loaded on demand (DefaultRunner
// imports this module when the sketch uses them), as most 2D sketches do not.
export { PShape, drawShape } from "../PShape";
export { loadSVG, loadOBJ } from "../io/shapeLoaders";
export { PMatrix3D } from "../PMatrix3D";
