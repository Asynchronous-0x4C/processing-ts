import { mat4, vec3 } from 'gl-matrix';
const m = mat4.create(); mat4.perspective(m, 1, 1, 0.1, 100); mat4.translate(m, m, vec3.fromValues(1, 2, 3)); mat4.rotateZ(m, m, 0.5); mat4.multiply(m, m, mat4.invert(mat4.create(), m));
console.log(m, vec3.normalize(vec3.create(), [1, 2, 3]));
