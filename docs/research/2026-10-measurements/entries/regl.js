import createREGL from 'regl';
const regl = createREGL();
const draw = regl({ frag: 'void main(){gl_FragColor=vec4(1);}', vert: 'attribute vec2 p;void main(){gl_Position=vec4(p,0,1);}', attributes: { p: [[0,0],[1,0],[0,1]] }, count: 3 });
regl.frame(() => draw());
