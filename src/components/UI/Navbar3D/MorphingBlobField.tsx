import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { AdditiveBlending, DoubleSide, Mesh, ShaderMaterial, Vector2, Vector3 } from "three";
import { ACCENT_RGB } from "./constants";
import { navbarStore } from "./hooks/useNavbarStore";
import { blobFragmentShader, blobVertexShader } from "./shaders/blobShader";

type BlobUniforms = {
  uTime: { value: number };
  uScrollProgress: { value: number };
  uScrollVelocity: { value: number };
  uBlobEnergy: { value: number };
  uActiveNav: { value: number };
  uHoveredNav: { value: number };
  uAccent: { value: Vector3 };
  uMouse: { value: Vector2 };
};

interface MorphingBlobFieldProps {
  detail?: number;
}

export default function MorphingBlobField({ detail = 5 }: MorphingBlobFieldProps) {
  const meshRef = useRef<Mesh>(null);

  const uniforms = useMemo<BlobUniforms>(() => {
    const s = navbarStore.getState();
    const rgb = ACCENT_RGB[s.activeNavIndex % ACCENT_RGB.length] ?? ACCENT_RGB[0];

    return {
      uTime: { value: 0 },
      uScrollProgress: { value: s.scrollProgress },
      uScrollVelocity: { value: s.scrollVelocity },
      uBlobEnergy: { value: 0.7 },
      uActiveNav: { value: s.activeNavIndex },
      uHoveredNav: { value: s.hoveredNavIndex },
      uAccent: { value: new Vector3(rgb[0], rgb[1], rgb[2]) },
      uMouse: { value: new Vector2(s.mouseX, s.mouseY) },
    };
  }, []);

  const material = useMemo(() => {
    const m = new ShaderMaterial({
      vertexShader: blobVertexShader,
      fragmentShader: blobFragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      side: DoubleSide,
      blending: AdditiveBlending,
    });

    return m;
  }, [uniforms]);

  useFrame(({ clock }) => {
    const s = navbarStore.getState();
    const time = clock.getElapsedTime();

    uniforms.uTime.value = time;
    uniforms.uScrollProgress.value = s.scrollProgress;
    uniforms.uScrollVelocity.value = s.scrollVelocity;
    uniforms.uBlobEnergy.value = Math.sin(time * 0.5) * 0.3 + 0.7;
    uniforms.uActiveNav.value = s.activeNavIndex;
    uniforms.uHoveredNav.value = s.hoveredNavIndex;
    uniforms.uMouse.value.set(s.mouseX, s.mouseY);

    const rgb = ACCENT_RGB[s.activeNavIndex % ACCENT_RGB.length] ?? ACCENT_RGB[0];
    uniforms.uAccent.value.set(rgb[0], rgb[1], rgb[2]);

    const mesh = meshRef.current;
    if (!mesh) return;

    const spin = 0.18 + smoothstep(0.5, 0.7, s.scrollProgress) * (0.35 - 0.18);
    const hoverBoost = s.hoveredNavIndex >= 0 ? 0.08 : 0.0;

    mesh.rotation.y = time * (spin + hoverBoost);
    mesh.rotation.x = Math.sin(time * 0.7) * 0.12 + (s.mouseY - 0.5) * 0.28;

    const velocity = Math.min(1, s.scrollVelocity / 90);
    const targetScale = 0.82 + s.scrollProgress * 0.25 + velocity * 0.06;
    mesh.scale.setScalar(targetScale);
  });

  return (
    <mesh ref={meshRef} material={material} position={[0.15, 0.0, 0.0]}>
      <icosahedronGeometry args={[1.35, detail]} />
    </mesh>
  );
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.max(0, Math.min(1, (x - edge0) / Math.max(1e-6, edge1 - edge0)));
  return t * t * (3 - 2 * t);
}
