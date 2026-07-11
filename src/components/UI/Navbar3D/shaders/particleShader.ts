export const particleVertexShader = `
precision highp float;

attribute float aSeed;
attribute float aAge;
attribute float aLife;
attribute float aSize;
attribute vec3 aColor;

uniform float uTime;
uniform float uScrollProgress;
uniform float uScrollVelocity;
uniform vec2 uMouse;

varying float vAlpha;
varying vec3 vColor;

void main() {
  vec3 p = position;

  float t = uTime * (0.35 + 0.45 * aSeed);
  float sway = sin(t + aSeed * 8.0) * 0.32;
  float lift = cos(t * 0.9 + aSeed * 6.0) * 0.25;

  vec2 m = (uMouse - 0.5) * 2.0;
  p.x += m.x * 0.8;
  p.y += m.y * 0.55;

  p.y += sway;
  p.x += lift * 0.25;

  float velocity = clamp(uScrollVelocity / 90.0, 0.0, 1.0);
  float lifeT = clamp(aAge / max(aLife, 0.001), 0.0, 1.0);
  float fadeIn = smoothstep(0.0, 0.15, lifeT);
  float fadeOut = 1.0 - smoothstep(0.72, 1.0, lifeT);
  float lifeAlpha = fadeIn * fadeOut;

  float modeFade = 1.0 - smoothstep(0.85, 1.0, uScrollProgress);
  vAlpha = lifeAlpha * modeFade * (0.16 + 0.40 * (1.0 - uScrollProgress)) * (0.60 + 0.40 * velocity);

  vec3 magenta = vec3(1.0, 0.176, 0.471);
  float mid = smoothstep(0.15, 0.55, lifeT);
  vColor = mix(aColor, magenta, mid);

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;

  float pulse = 0.8 + 0.2 * sin(aAge * 3.0);
  float size = aSize * pulse * mix(1.0, 1.35, 1.0 - uScrollProgress);
  gl_PointSize = size * (220.0 / -mv.z);
}
`;

export const particleFragmentShader = `
precision highp float;

varying float vAlpha;
varying vec3 vColor;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = dot(uv, uv);

  float a = exp(-d * 16.0);
  a *= vAlpha;

  gl_FragColor = vec4(vColor, a);
}
`;
