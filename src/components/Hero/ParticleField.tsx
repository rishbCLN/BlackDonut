import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { InstancedMesh, MathUtils, Object3D } from "three";

type ParticleFieldProps = {
  count?: number;
  targetFps?: number;
};

export default function ParticleField({ count = 900, targetFps = 30 }: ParticleFieldProps) {
  const COUNT = count;
  const meshRef = useRef<InstancedMesh>(null);
  const updateAccumulator = useRef(0);

  const particles = useMemo(
    () =>
      Array.from({ length: COUNT }, () => ({
        position: [
          MathUtils.randFloatSpread(80),
          MathUtils.randFloatSpread(60),
          MathUtils.randFloatSpread(80),
        ] as [number, number, number],
        speed: MathUtils.randFloat(0.08, 0.24),
        offset: MathUtils.randFloat(0, Math.PI * 2),
      })),
    []
  );

  const dummy = useMemo(() => new Object3D(), []);

  useFrame(({ clock }, delta) => {
    updateAccumulator.current += delta;

    // Updating instance matrices at ~30fps keeps motion fluid while lowering CPU cost.
    if (updateAccumulator.current < 1 / targetFps) {
      return;
    }
    updateAccumulator.current = 0;

    const mesh = meshRef.current;
    if (!mesh) {
      return;
    }

    const t = clock.getElapsedTime();

    for (let i = 0; i < COUNT; i += 1) {
      dummy.position.set(
        particles[i].position[0],
        particles[i].position[1] + Math.sin(t * particles[i].speed + particles[i].offset) * 0.3,
        particles[i].position[2]
      );
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
      <sphereGeometry args={[0.035, 3, 3]} />
      <meshBasicMaterial color="#8DA2FF" transparent opacity={0.32} />
    </instancedMesh>
  );
}
