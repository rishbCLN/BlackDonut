export const blobVertexShader = `
precision highp float;

uniform float uTime;
uniform float uScrollProgress;
uniform float uScrollVelocity;
uniform float uBlobEnergy;
uniform float uActiveNav;
uniform float uHoveredNav;
uniform vec3 uAccent;
uniform vec2 uMouse;

varying vec3 vNormal;
varying vec3 vWorldPos;
varying float vFresnel;

float hash31(vec3 p) {
  p = fract(p * 0.1031);
  p += dot(p, p.yzx + 33.33);
  return fract((p.x + p.y) * p.z);
}

float noise3(vec3 p) {

  vec3 poleDir(float index) {
    // Four stable poles across the upper hemisphere (scene-space intent).
    // The exact vectors are tuned for the current navbar layout.
    if (index < 0.5) return normalize(vec3(-0.9, 0.55, 0.15));
    if (index < 1.5) return normalize(vec3(-0.35, 0.75, 0.10));
    if (index < 2.5) return normalize(vec3(0.35, 0.75, 0.10));
    return normalize(vec3(0.9, 0.55, 0.15));
  }
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);

  float n000 = hash31(i + vec3(0.0, 0.0, 0.0));
  float n100 = hash31(i + vec3(1.0, 0.0, 0.0));
  float n010 = hash31(i + vec3(0.0, 1.0, 0.0));
  float n110 = hash31(i + vec3(1.0, 1.0, 0.0));
  float n001 = hash31(i + vec3(0.0, 0.0, 1.0));
  float n101 = hash31(i + vec3(1.0, 0.0, 1.0));
  float n011 = hash31(i + vec3(0.0, 1.0, 1.0));
  float n111 = hash31(i + vec3(1.0, 1.0, 1.0));

  float nx00 = mix(n000, n100, f.x);
  float nx10 = mix(n010, n110, f.x);
  float nx01 = mix(n001, n101, f.x);
  float nx11 = mix(n011, n111, f.x);

  float nxy0 = mix(nx00, nx10, f.y);
  float nxy1 = mix(nx01, nx11, f.y);

  return mix(nxy0, nxy1, f.z);
}

void main() {
  vNormal = normalize(normalMatrix * normal);

  vec3 p = position;
  float speed = 0.35 + uScrollProgress * 0.6;

  // Multi-octave noise (2 octaves), normalized-ish.
  float n1 = noise3(p * 1.35 + vec3(uTime * speed));
  float n2 = noise3(p * 2.25 - vec3(uTime * speed * 0.7));
  float n = (n1 * 0.65 + n2 * 0.45) - 0.55;

  vec2 m = (uMouse - 0.5) * 2.0;
  float mouseBias = (m.x * 0.25 + m.y * 0.18);

  float v = clamp(uScrollVelocity, 0.0, 120.0);
  float baseAmp = 0.15;
  float velBoost = v * 0.01;
  float amp = (baseAmp + velBoost) * uBlobEnergy;

  float disp = (n + mouseBias);

  vec3 displaced = p + normal * disp * amp;

  // Morph toward active nav pole, with a subtle hover override.
  float active = uActiveNav;
  float hovered = uHoveredNav;
  float useIndex = hovered >= 0.0 ? hovered : active;
  vec3 pole = poleDir(useIndex);
  float poleWeight = smoothstep(0.15, 0.95, dot(normalize(p), pole));
  float polePulse = 0.95 + min(sin(uTime * 1.5) * 0.08, 0.08);
  float poleAmount = poleWeight * polePulse * (0.08 + 0.06 * uBlobEnergy);
  displaced += pole * poleAmount;

  vec4 world = modelMatrix * vec4(displaced, 1.0);
  vWorldPos = world.xyz;

  vec3 viewDir = normalize(cameraPosition - world.xyz);
  vFresnel = pow(1.0 - max(0.0, dot(normalize(vNormal), viewDir)), 4.0);

  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

export const blobFragmentShader = `
precision highp float;

uniform float uTime;
uniform float uScrollProgress;
uniform vec3 uAccent;

varying vec3 vNormal;
varying vec3 vWorldPos;
varying float vFresnel;

vec3 palette(float t) {
  vec3 cyan = vec3(0.0, 1.0, 1.0);
  vec3 violet = vec3(0.545, 0.361, 0.965);
  vec3 darkTone = vec3(0.05, 0.03, 0.09);

  float a = smoothstep(0.0, 0.30, t);
  float b = smoothstep(0.30, 0.60, t);
  float c = smoothstep(0.60, 1.00, t);

  vec3 p1 = mix(cyan, violet, b);
  return mix(p1, darkTone, c);
}

void main() {
  float shimmer = 0.5 + 0.5 * sin(uTime * 0.8 + vWorldPos.y * 0.6);
  vec3 base = mix(palette(uScrollProgress), uAccent, 0.35);

  float body = 0.16 + shimmer * 0.05;
  float edge = vFresnel;

  // Center darkens slightly with depth for a more volumetric feel.
  float depth = clamp((vWorldPos.z + 1.2) * 0.35, 0.0, 1.0);
  float centerDarken = mix(1.0, 0.72, depth);

  vec3 color = base * centerDarken * (body + edge * 1.25);
  float alpha = (0.16 + edge * 0.30) * (1.0 - smoothstep(0.85, 1.0, uScrollProgress));

  gl_FragColor = vec4(color, alpha);
}
`;
