import { useEffect, useRef } from "react";

// --- FRAGMENT SHADER ---
// We add a `u_color` uniform to accept a color from our component.
const fragmentShaderSource = `#version 300 es
precision highp float;
out vec4 O;
uniform float time;
uniform vec2 resolution;
uniform vec3 u_color; // <-- The new color uniform

#define FC gl_FragCoord.xy
#define R resolution
#define T (time+660.)

float rnd(vec2 p){p=fract(p*vec2(12.9898,78.233));p+=dot(p,p+34.56);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);return mix(mix(rnd(i),rnd(i+vec2(1,0)),u.x),mix(rnd(i+vec2(0,1)),rnd(i+1.),u.x),u.y);}
float fbm(vec2 p){float t=.0,a=1.;for(int i=0;i<5;i++){t+=a*noise(p);p*=mat2(1,-1.2,.2,1.2)*2.;a*=.5;}return t;}

void main(){
  vec2 uv=(FC-.5*R)/R.y;
  vec3 col=vec3(1);
  uv.x+=.25;
  uv*=vec2(2,1);

  float n=fbm(uv*.28-vec2(T*.01,0));
  n=noise(uv*3.+n*2.);

  col.r-=fbm(uv+vec2(0,T*.015)+n);
  col.g-=fbm(uv*1.003+vec2(0,T*.015)+n+.003);
  col.b-=fbm(uv*1.006+vec2(0,T*.015)+n+.006);

  // KEY CHANGE: Instead of mixing with white (vec3(1)), we mix with our custom.
  // This tints the brightest parts of the noise with the color provided by the user.
  col=mix(col, u_color, dot(col,vec3(.21,.71,.07)));

  col=mix(vec3(.08),col,min(time*.1,1.));
  col=clamp(col,.08,1.);
  O=vec4(col,1);
}`;

// --- RENDERER CLASS ---
// Updated to handle the new color uniform.
class Renderer {
  private readonly vertexSrc = `#version 300 es
precision highp float;
in vec4 position;
void main(){gl_Position=position;}`;

  private readonly vertices = [-1, 1, -1, -1, 1, 1, 1, -1];

  private gl: WebGL2RenderingContext;
  private canvas: HTMLCanvasElement;
  private program: WebGLProgram | null = null;
  private vs: WebGLShader | null = null;
  private fs: WebGLShader | null = null;
  private buffer: WebGLBuffer | null = null;
  private vao: WebGLVertexArrayObject | null = null;
  private color: [number, number, number] = [0.5, 0.5, 0.5]; // Default to gray

  constructor(canvas: HTMLCanvasElement, gl: WebGL2RenderingContext, fragmentSource: string) {
    this.canvas = canvas;
    this.gl = gl;
    this.setup(fragmentSource);
    this.init();
  }

  updateColor(newColor: [number, number, number]) {
    this.color = newColor;
  }

  updateScale() {
    const dpr = Math.max(1, window.devicePixelRatio);
    const { innerWidth: width, innerHeight: height } = window;
    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  private compile(shader: WebGLShader, source: string) {
    const gl = this.gl;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      // Keep error visible in devtools, but don't throw (so the page doesn't hard-crash).
      // eslint-disable-next-line no-console
      console.error(`Shader compilation error: ${gl.getShaderInfoLog(shader)}`);
    }
  }

  reset() {
    const { gl, program, vs, fs, buffer, vao } = this;

    if (program) {
      if (vs) {
        gl.detachShader(program, vs);
        gl.deleteShader(vs);
      }
      if (fs) {
        gl.detachShader(program, fs);
        gl.deleteShader(fs);
      }
      gl.deleteProgram(program);
    }

    if (buffer) gl.deleteBuffer(buffer);
    if (vao) gl.deleteVertexArray(vao);

    this.program = null;
    this.vs = null;
    this.fs = null;
    this.buffer = null;
    this.vao = null;
  }

  private setup(fragmentSource: string) {
    const gl = this.gl;

    this.vs = gl.createShader(gl.VERTEX_SHADER);
    this.fs = gl.createShader(gl.FRAGMENT_SHADER);
    const program = gl.createProgram();
    if (!this.vs || !this.fs || !program) return;

    this.compile(this.vs, this.vertexSrc);
    this.compile(this.fs, fragmentSource);

    this.program = program;
    gl.attachShader(this.program, this.vs);
    gl.attachShader(this.program, this.fs);
    gl.linkProgram(this.program);

    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      // eslint-disable-next-line no-console
      console.error(`Program linking error: ${gl.getProgramInfoLog(this.program)}`);
    }
  }

  private init() {
    const { gl, program } = this;
    if (!program) return;

    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);

    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    Object.assign(program, {
      resolution: gl.getUniformLocation(program, "resolution"),
      time: gl.getUniformLocation(program, "time"),
      u_color: gl.getUniformLocation(program, "u_color"),
    });

    gl.bindVertexArray(null);
  }

  render(now = 0) {
    const { gl, program, canvas, vao } = this;
    if (!program || !gl.isProgram(program)) return;

    const resolutionLoc = (program as any).resolution as WebGLUniformLocation | null;
    const timeLoc = (program as any).time as WebGLUniformLocation | null;
    const colorLoc = (program as any).u_color as WebGLUniformLocation | null;
    if (!resolutionLoc || !timeLoc || !colorLoc) return;

    gl.disable(gl.DEPTH_TEST);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);
    gl.bindVertexArray(vao);

    gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
    gl.uniform1f(timeLoc, now * 1e-3);
    gl.uniform3fv(colorLoc, this.color);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    gl.bindVertexArray(null);
  }
}

// --- UTILITY FUNCTION ---
// Converts a hex color string like "#FF5733" to an array of floats [r, g, b].
const hexToRgb = (hex: string): [number, number, number] | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255,
      ]
    : null;
};

// --- REACT COMPONENT ---
interface SmokeBackgroundProps {
  smokeColor?: string; // e.g., "#8A2BE2"
}

export function SmokeBackground({ smokeColor = "#808080" }: SmokeBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<Renderer | null>(null);

  // Effect for initialization and cleanup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2");
    if (!gl) {
      // eslint-disable-next-line no-console
      console.warn("SmokeBackground: WebGL2 is not supported in this browser.");
      return;
    }

    const renderer = new Renderer(canvas, gl, fragmentShaderSource);
    rendererRef.current = renderer;

    const handleResize = () => renderer.updateScale();
    handleResize();
    window.addEventListener("resize", handleResize);

    let animationFrameId = 0;
    const loop = (now: number) => {
      renderer.render(now);
      animationFrameId = requestAnimationFrame(loop);
    };
    animationFrameId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.reset();
      rendererRef.current = null;
    };
  }, []);

  // Effect to update color when the prop changes
  useEffect(() => {
    const renderer = rendererRef.current;
    if (!renderer) return;

    const rgbColor = hexToRgb(smokeColor);
    if (rgbColor) {
      renderer.updateColor(rgbColor);
    }
  }, [smokeColor]);

  return <canvas ref={canvasRef} className="pointer-events-none block h-full w-full" />;
}
