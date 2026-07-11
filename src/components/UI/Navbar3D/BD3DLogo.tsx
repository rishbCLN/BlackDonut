import { Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Group, Mesh, MeshStandardMaterial } from "three";
import { ACCENT_RGB } from "./constants";
import { navbarStore } from "./hooks/useNavbarStore";

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.max(0, Math.min(1, (x - edge0) / Math.max(1e-6, edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

export default function BD3DLogo() {
  const groupRef = useRef<Group>(null);
  const bRef = useRef<Mesh>(null);
  const dRef = useRef<Mesh>(null);
  const { viewport } = useThree();

  const material = useMemo(() => {
    const m = new MeshStandardMaterial({
      color: "#0D0D0D",
      metalness: 0.8,
      roughness: 0.15,
      emissive: "#00FFFF",
      emissiveIntensity: 0.55,
      transparent: true,
      opacity: 1,
    });
    return m;
  }, []);

  useFrame(({ clock }) => {
    const s = navbarStore.getState();
    const rgb = ACCENT_RGB[s.activeNavIndex % ACCENT_RGB.length] ?? ACCENT_RGB[0];

    material.emissive.set(rgb[0], rgb[1], rgb[2]);
    material.emissiveIntensity = 0.5 + 0.3 * Math.sin(clock.getElapsedTime() * 2);

    const fade = 1.0 - smoothstep(0.65, 0.85, s.scrollProgress) * 0.75;
    const fade2 = 1.0 - smoothstep(0.85, 1.0, s.scrollProgress) * 0.85;
    material.opacity = fade * fade2;

    const group = groupRef.current;
    if (!group) return;

    // Anchor to upper-left in viewport space.
    const marginX = 0.55;
    const marginY = 0.55;
    group.position.set(-viewport.width / 2 + marginX, viewport.height / 2 - marginY, 0.2);

    const wobble = Math.sin(clock.getElapsedTime() * 0.5) * 0.08;
    group.rotation.y = s.scrollProgress * 0.8 + wobble;

    group.rotation.z = s.hoveredNavIndex >= 0 ? 0 : Math.sin(clock.getElapsedTime() * 1.1) * 0.03;

    const b = bRef.current;
    const d = dRef.current;
    if (b && d) {
      if (s.hoveredNavIndex >= 0) {
        b.rotation.z = Math.sin(clock.getElapsedTime() * 4.0 + 1.0) * 0.15;
        d.rotation.z = Math.sin(clock.getElapsedTime() * 4.0) * -0.15;
      } else {
        b.rotation.z = 0;
        d.rotation.z = 0;
      }
    }

    const pingPhase = Math.min(1, clock.getElapsedTime() / 0.8);
    const easedPing = 1 + Math.sin(pingPhase * Math.PI) * 0.08;
    group.scale.setScalar(easedPing);
  });

  return (
    <group ref={groupRef}>
      <Text
        ref={bRef}
        fontSize={0.7}
        position={[0, 0, 0]}
        letterSpacing={-0.04}
        anchorX="left"
        anchorY="middle"
      >
        B
        <primitive object={material} attach="material" />
      </Text>

      <Text
        ref={dRef}
        fontSize={0.7}
        position={[0.55, 0, 0]}
        letterSpacing={-0.04}
        anchorX="left"
        anchorY="middle"
      >
        D
        <primitive object={material} attach="material" />
      </Text>
    </group>
  );
}
