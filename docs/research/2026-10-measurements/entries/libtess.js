import libtess from 'libtess';
const t = new libtess.GluTesselator();
t.gluTessCallback(libtess.gluEnum.GLU_TESS_VERTEX_DATA, (d, out) => out.push(d[0], d[1]));
const out = [];
t.gluTessBeginPolygon(out); t.gluTessBeginContour();
for (const v of [[0,0,0],[100,0,0],[100,100,0]]) t.gluTessVertex(v, v);
t.gluTessEndContour(); t.gluTessEndPolygon();
console.log(out);
