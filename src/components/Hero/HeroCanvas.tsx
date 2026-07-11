import { useEffect, useMemo, useState } from "react";
import { Stars } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Bloom, ChromaticAberration, EffectComposer } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Vector2 } from "three";
import CrystalCore from "./CrystalCore";
import ParticleField from "./ParticleField";

type HeroCanvasProps = {
  spinProgressRef?: { current: number };
};

function CameraCenterLock() {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 0, 6);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return null;
}

export default function HeroCanvas({ spinProgressRef }: HeroCanvasProps) {
  const [lowPower, setLowPower] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowCoreCount = (navigator.hardwareConcurrency ?? 8) <= 6;
    const smallViewport = window.innerWidth < 900;

    setLowPower(prefersReducedMotion || lowCoreCount || smallViewport);
  }, []);

  const chromaticOffset = useMemo(
    () => new Vector2(lowPower ? 0.00012 : 0.00025, lowPower ? 0.00012 : 0.00025),
    [lowPower]
  );

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 60 }}
      gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
      dpr={lowPower ? [1, 1] : [1, 1.35]}
      className="absolute inset-0 h-full w-full"
    >
      <CameraCenterLock />
      <color attach="background" args={["#030303"]} />
      <ambientLight intensity={0.28} />
      <pointLight position={[5, 5, 5]} intensity={8} color="#A6E2FF" />
      <pointLight position={[-5, -3, -5]} intensity={6} color="#A8A1FF" />
      <pointLight position={[0, -5, 3]} intensity={4} color="#E3B8C9" />

      <Stars
        radius={80}
        depth={45}
        count={lowPower ? 650 : 1200}
        factor={lowPower ? 2 : 2.5}
        saturation={0}
        fade
        speed={0.25}
      />
      <ParticleField count={lowPower ? 520 : 900} targetFps={lowPower ? 24 : 30} />
      <CrystalCore spinProgressRef={spinProgressRef} />

      {!lowPower && (
        <EffectComposer>
          <Bloom luminanceThreshold={0.45} luminanceSmoothing={0.8} intensity={0.72} />
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL}
            offset={chromaticOffset}
            radialModulation={false}
            modulationOffset={0}
          />
        </EffectComposer>
      )}
    </Canvas>
  );
}
