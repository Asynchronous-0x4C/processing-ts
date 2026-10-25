/**
 * The OpenGL renderer's built-in shaders (GLSL ES 3.00), written for processing-ts. They use the
 * attribute, uniform and varying names Processing documents for its shaders (PShader tutorial), so a
 * sketch's own vertex or fragment shader can be paired with a built-in one:
 * attributes position/color/normal/texCoord/ambient/specular/emissive/shininess (polygons),
 * direction (lines), offset (points); uniforms transformMatrix, modelviewMatrix, projectionMatrix,
 * normalMatrix, texMatrix, texMap (Processing's `texture`), texOffset, viewport, perspective, the
 * light arrays; varyings vertColor, backVertColor, vertTexCoord.
 */

const HEADER="#version 300 es\nprecision highp float;\nprecision highp int;\n";

const LIGHTING=`
uniform mat4 modelviewMatrix;
uniform mat3 normalMatrix;
uniform int lightCount;
uniform vec4 lightPosition[8];
uniform vec3 lightNormal[8];
uniform vec3 lightAmbient[8];
uniform vec3 lightDiffuse[8];
uniform vec3 lightSpecular[8];
uniform vec3 lightFalloff[8];
uniform vec2 lightSpot[8];

in vec3 normal;
in vec4 ambient;
in vec4 specular;
in vec4 emissive;
in float shininess;

out vec4 backVertColor;

// Per-vertex lighting in eye space (the OpenGL fixed-function model): each light adds its ambient
// term, and its diffuse and Blinn-Phong specular terms, attenuated by distance (lightFalloff) and the
// spot cone. Both sides are lit: the back color uses the reversed normal.
void lighting(vec4 col, out vec4 front, out vec4 back) {
  vec3 ecVertex = vec3(modelviewMatrix * position);
  vec3 n = normalize(normalMatrix * normal);
  vec3 toEye = normalize(-ecVertex);
  vec3 tA = vec3(0.0), fD = vec3(0.0), fS = vec3(0.0), bD = vec3(0.0), bS = vec3(0.0);
  for (int i = 0; i < 8; i++) {
    if (i >= lightCount) break;
    vec3 dir;
    float att = 1.0;
    if (lightPosition[i].w == 0.0) {
      dir = -normalize(lightNormal[i]);
    } else {
      vec3 d = lightPosition[i].xyz - ecVertex;
      float dist = length(d);
      dir = d / max(dist, 1e-20);
      vec3 fo = lightFalloff[i];
      att = 1.0 / (fo.x + fo.y * dist + fo.z * dist * dist);
    }
    if (lightSpot[i].y > 0.0 || lightSpot[i].x > -1.0) {
      float c = dot(-dir, normalize(lightNormal[i]));
      att *= c > lightSpot[i].x ? pow(c, lightSpot[i].y) : 0.0;
    }
    tA += lightAmbient[i] * att;
    vec3 h = normalize(dir + toEye);
    float df = max(dot(dir, n), 0.0);
    fD += lightDiffuse[i] * df * att;
    if (df > 0.0) fS += lightSpecular[i] * pow(max(dot(h, n), 0.0), shininess) * att;
    float db = max(dot(dir, -n), 0.0);
    bD += lightDiffuse[i] * db * att;
    if (db > 0.0) bS += lightSpecular[i] * pow(max(dot(h, -n), 0.0), shininess) * att;
  }
  front = vec4(min(tA * ambient.rgb + fD * col.rgb + fS * specular.rgb + emissive.rgb, 1.0), col.a);
  back = vec4(min(tA * ambient.rgb + bD * col.rgb + bS * specular.rgb + emissive.rgb, 1.0), col.a);
}
`;

export const COLOR_VERT=`${HEADER}
uniform mat4 transformMatrix;
in vec4 position;
in vec4 color;
out vec4 vertColor;
void main() {
  gl_Position = transformMatrix * position;
  vertColor = color;
}
`;

export const COLOR_FRAG=`${HEADER}
in vec4 vertColor;
out vec4 fragColor;
void main() {
  fragColor = vertColor;
}
`;

export const TEXTURE_VERT=`${HEADER}
uniform mat4 transformMatrix;
uniform mat4 texMatrix;
in vec4 position;
in vec4 color;
in vec2 texCoord;
out vec4 vertColor;
out vec4 vertTexCoord;
void main() {
  gl_Position = transformMatrix * position;
  vertColor = color;
  vertTexCoord = texMatrix * vec4(texCoord, 1.0, 1.0);
}
`;

export const TEXTURE_FRAG=`${HEADER}
uniform sampler2D texMap;
in vec4 vertColor;
in vec4 vertTexCoord;
out vec4 fragColor;
void main() {
  fragColor = texture(texMap, vertTexCoord.st) * vertColor;
}
`;

export const LIGHT_VERT=`${HEADER}
uniform mat4 transformMatrix;
in vec4 position;
in vec4 color;
out vec4 vertColor;
${LIGHTING}
void main() {
  gl_Position = transformMatrix * position;
  lighting(color, vertColor, backVertColor);
}
`;

export const LIGHT_FRAG=`${HEADER}
in vec4 vertColor;
in vec4 backVertColor;
out vec4 fragColor;
void main() {
  fragColor = gl_FrontFacing ? vertColor : backVertColor;
}
`;

export const TEXLIGHT_VERT=`${HEADER}
uniform mat4 transformMatrix;
uniform mat4 texMatrix;
in vec4 position;
in vec4 color;
in vec2 texCoord;
out vec4 vertColor;
out vec4 vertTexCoord;
${LIGHTING}
void main() {
  gl_Position = transformMatrix * position;
  lighting(color, vertColor, backVertColor);
  vertTexCoord = texMatrix * vec4(texCoord, 1.0, 1.0);
}
`;

export const TEXLIGHT_FRAG=`${HEADER}
uniform sampler2D texMap;
in vec4 vertColor;
in vec4 backVertColor;
in vec4 vertTexCoord;
out vec4 fragColor;
void main() {
  fragColor = texture(texMap, vertTexCoord.st) * (gl_FrontFacing ? vertColor : backVertColor);
}
`;

/**
 * Lines: each segment is a quad whose four corners share the segment's ends; `direction` holds the
 * other end (xyz) and the signed half-width in pixels (w). The quad is widened across the segment's
 * direction on the screen, so the width stays in pixels (unless `perspective` is set), and pulled a
 * little toward the eye so that strokes win over the faces they outline.
 */
export const LINE_VERT=`${HEADER}
uniform mat4 modelviewMatrix;
uniform mat4 projectionMatrix;
uniform vec4 viewport;
uniform int perspective;
uniform vec3 scale;
uniform float strokeDepth;
in vec4 position;
in vec4 color;
in vec4 direction;
out vec4 vertColor;
void main() {
  vec4 p0 = modelviewMatrix * position;
  vec4 p1 = modelviewMatrix * vec4(direction.xyz, 1.0);
  p0.xyz *= scale;
  p1.xyz *= scale;
  vec4 c0 = projectionMatrix * p0;
  vec4 c1 = projectionMatrix * p1;
  vec2 s0 = c0.xy / c0.w * viewport.zw * 0.5;
  vec2 s1 = c1.xy / c1.w * viewport.zw * 0.5;
  vec2 d = s1 - s0;
  float len = length(d);
  vec2 n = len > 0.0 ? vec2(-d.y, d.x) / len : vec2(0.0, 1.0);
  vec2 off = n * direction.w;
  // With perspective, the width is in pixels at the distance of the default camera's z = 0 plane.
  float w = perspective == 0 || strokeDepth <= 0.0 ? c0.w : strokeDepth;
  gl_Position = vec4(c0.xy + off / (viewport.zw * 0.5) * w, c0.zw);
  vertColor = color;
}
`;

export const LINE_FRAG=COLOR_FRAG;

/** Points: each vertex is the point's center, moved by `offset` pixels on the screen. */
export const POINT_VERT=`${HEADER}
uniform mat4 projectionMatrix;
uniform mat4 modelviewMatrix;
uniform vec4 viewport;
uniform int perspective;
in vec4 position;
in vec4 color;
in vec2 offset;
out vec4 vertColor;
void main() {
  vec4 pos = modelviewMatrix * position;
  vec4 clip = projectionMatrix * pos;
  if (perspective == 0) {
    gl_Position = clip + vec4(offset / (viewport.zw * 0.5) * clip.w, 0.0, 0.0);
  } else {
    gl_Position = projectionMatrix * (pos + vec4(offset, 0.0, 0.0));
  }
  vertColor = color;
}
`;

export const POINT_FRAG=COLOR_FRAG;

/** Copies a texture to the screen (the frame's end, updatePixels(), set(image)). */
export const BLIT_VERT=`${HEADER}
in vec2 position;
out vec2 uv;
void main() {
  uv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

export const BLIT_FRAG=`${HEADER}
uniform sampler2D texMap;
uniform int flipY;
uniform int opaque;
in vec2 uv;
out vec4 fragColor;
void main() {
  vec4 c = texture(texMap, flipY == 1 ? vec2(uv.x, 1.0 - uv.y) : uv);
  fragColor = opaque == 1 ? vec4(c.rgb, 1.0) : c;
}
`;
