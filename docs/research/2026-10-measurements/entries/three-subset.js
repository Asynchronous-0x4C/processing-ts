import { WebGLRenderer, Scene, PerspectiveCamera, Mesh, BufferGeometry, ShaderMaterial, BufferAttribute } from 'three';
const r = new WebGLRenderer();
const scene = new Scene();
const cam = new PerspectiveCamera(60, 1, 0.1, 100);
const geo = new BufferGeometry();
geo.setAttribute('position', new BufferAttribute(new Float32Array([0,0,0, 1,0,0, 0,1,0]), 3));
const mat = new ShaderMaterial({ vertexShader: 'void main(){gl_Position=vec4(position,1.);}', fragmentShader: 'void main(){gl_FragColor=vec4(1.);}' });
scene.add(new Mesh(geo, mat));
r.render(scene, cam);
