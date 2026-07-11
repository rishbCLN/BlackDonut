import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, DirectionalLight } from "three";
import { ACCENT_RGB } from "./constants";
import { navbarStore } from "./hooks/useNavbarStore";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function DynamicLighting() {
  const keyRef = useRef<DirectionalLight>(null);
  const rimRef = useRef<DirectionalLight>(null);
  const fillColor = useMemo(() => new Color("#8B5CF6"), []);
  const accent = useMemo(() => new Color(), []);
  const keyColor = useMemo(() => new Color("#00FFFF"), []);

  useFrame(({ clock }, delta) => {
    const s = navbarStore.getState();
    const key = keyRef.current;
    const rim = rimRef.current;

    const rgb = ACCENT_RGB[s.activeNavIndex % ACCENT_RGB.length] ?? ACCENT_RGB[0];
    accent.setRGB(rgb[0], rgb[1], rgb[2]);

    const velocity = Math.min(1, s.scrollVelocity / 90);
    const orbit = s.activeNavIndex * (Math.PI * 0.5) + clock.getElapsedTime() * 0.25;

    let dim = 1;
    if (s.scrollProgress > 0.6) dim *= 0.85;
    if (s.scrollProgress > 0.85) dim *= 0.8;

    if (key) {
      const lerpT = 1 - Math.exp(-delta / 0.4);
      keyColor.lerp(accent, lerpT);
      key.color.copy(keyColor);

      const intensity = clamp(0.7 + velocity * 0.5, 0.7, 1.2);
      key.intensity = intensity * dim;
      key.position.set(Math.cos(orbit) * 4.2, 2.1, Math.sin(orbit) * 4.2);
    }

    if (rim) {
      rim.intensity = (0.4 + 0.2 * Math.sin(clock.getElapsedTime() * 0.5)) * dim;
    }

  });

  return (
    <>
      <directionalLight ref={keyRef} intensity={0.9} position={[4.2, 2.1, 4.2]} />
      <directionalLight intensity={0.3} color={fillColor} position={[-4.4, 1.2, -3.2]} />
      <directionalLight ref={rimRef} intensity={0.5} color={"#FF2D78"} position={[0, 2.2, -5.8]} />
      <ambientLight intensity={0.2} />
    </>
  );
}
