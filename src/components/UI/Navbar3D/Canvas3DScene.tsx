import { Canvas } from "@react-three/fiber";
import { Bloom, ChromaticAberration, EffectComposer } from "@react-three/postprocessing";
import { useEffect, useMemo, useState } from "react";
import { Vector2 } from "three";
import BD3DLogo from "./BD3DLogo";
import DynamicLighting from "./DynamicLighting";
import MorphingBlobField from "./MorphingBlobField";
import ParticleSystem from "./ParticleSystem";

interface Canvas3DSceneProps {
  className?: string;
}

export default function Canvas3DScene({ className = "" }: Canvas3DSceneProps) {
  const [width, setWidth] = useState<number>(() => window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const quality = useMemo(() => {
    if (width >= 1440) {
      return { particles: 600, blobDetail: 5, chromatic: true };
    }

    return { particles: 400, blobDetail: 4, chromatic: false };
  }, [width]);

  const chromaticOffset = useMemo(
    () => (quality.chromatic ? new Vector2(0.0006, 0.00035) : new Vector2(0, 0)),
    [quality.chromatic],
  );

  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden="true">
      <Canvas
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 6.2], fov: 38 }}
      >
        <DynamicLighting />
        <group position={[0, 0.0, 0]}>
          <ParticleSystem count={quality.particles} />
          <MorphingBlobField detail={quality.blobDetail} />
          <BD3DLogo />
        </group>

        <EffectComposer multisampling={0}>
          <Bloom intensity={0.9} luminanceThreshold={0.05} luminanceSmoothing={0.65} />
          <ChromaticAberration offset={chromaticOffset} radialModulation={false} modulationOffset={0} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
