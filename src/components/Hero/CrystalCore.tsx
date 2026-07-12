import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { Group, MathUtils, MirroredRepeatWrapping, SRGBColorSpace, LinearFilter, LinearMipmapLinearFilter } from "three";

type CrystalCoreProps = {
  spinProgressRef?: { current: number };
  cinematicProgressRef?: { current: number };
  isCinematic?: boolean;
  motionMode?: "hero" | "site" | "transition";
};

type HoleEntryState = {
  spinPhase: number;
  lockPhase: number;
  detachPhase: number;
  spinSpeed: number;
  targetTilt: number;
};

const BASE_TILT = MathUtils.degToRad(34);
const LOCK_TILT = MathUtils.degToRad(0);
const DETACH_START = 0.84;
const DETACH_END = 0.986;
const SPIN_END = 0.986;
const LOCK_START = 0.986;
const LOCK_END = 0.997;
const MIN_SPIN_SPEED = 0.4;
const MAX_SPIN_SPEED = 10.0;
const MAX_DETACH_Z = 1.9;
const MAX_DETACH_SCALE = 1.65;
const HERO_SPIN_SPEED = 0.52;

function getForwardHalfTurn(angle: number) {
  return Math.ceil(angle / Math.PI) * Math.PI;
}

function getHoleEntryState(progress: number): HoleEntryState {
  const spinPhase = MathUtils.clamp(progress / SPIN_END, 0, 1);
  const lockPhase = MathUtils.clamp((progress - LOCK_START) / (LOCK_END - LOCK_START), 0, 1);
  const detachPhase = MathUtils.clamp((progress - DETACH_START) / (DETACH_END - DETACH_START), 0, 1);

  const acceleratedSpinPhase = Math.pow(spinPhase, 0.7);
  const proportionalSpeed = MathUtils.lerp(MIN_SPIN_SPEED, MAX_SPIN_SPEED, acceleratedSpinPhase);
  const spinSpeed = MathUtils.lerp(proportionalSpeed, 0, MathUtils.smoothstep(lockPhase, 0, 1));

  return {
    spinPhase,
    lockPhase,
    detachPhase,
    spinSpeed,
    targetTilt: MathUtils.lerp(BASE_TILT, LOCK_TILT, lockPhase),
  };
}

export default function CrystalCore({ spinProgressRef, cinematicProgressRef, isCinematic = false, motionMode = "site" }: CrystalCoreProps) {
  const groupRef = useRef<Group>(null);
  const lockYawRef = useRef<number | null>(null);

  const { gl } = useThree();
  const topoTexture = useTexture("/topo.png");

  // High-fidelity anisotropic and linear filtering to ensure smooth, clear, non-pixelated lines
  topoTexture.wrapS = MirroredRepeatWrapping;
  topoTexture.wrapT = MirroredRepeatWrapping;
  topoTexture.repeat.set(2, 2);
  topoTexture.minFilter = LinearMipmapLinearFilter;
  topoTexture.magFilter = LinearFilter;
  topoTexture.anisotropy = Math.min(gl.capabilities.getMaxAnisotropy(), 16);
  topoTexture.colorSpace = SRGBColorSpace;

  const smoothProgressRef = useRef(spinProgressRef?.current ?? 0);

  useFrame((frameState, delta) => {
    const rawProgress = MathUtils.clamp(spinProgressRef?.current ?? 0, 0, 1);
    smoothProgressRef.current += (rawProgress - smoothProgressRef.current) * Math.min(1, delta * 5.8);
    const transitionProgress = smoothProgressRef.current;
    const cinematicProgress = cinematicProgressRef?.current ?? 0;
    const holeState = getHoleEntryState(transitionProgress);
    const isHeroMode = motionMode === "hero";
    const isSiteMode = motionMode === "site";
    const isTransitionMode = motionMode === "transition";
    const impactPhase = MathUtils.clamp(transitionProgress / 0.24, 0, 1);
    const bouncePhase = MathUtils.clamp((transitionProgress - 0.24) / 0.24, 0, 1);



    if (groupRef.current) {
      if (isTransitionMode && transitionProgress >= LOCK_START) {
        if (lockYawRef.current === null) {
          lockYawRef.current = getForwardHalfTurn(groupRef.current.rotation.y);
        }
      } else {
        lockYawRef.current = null;
      }

      if (isHeroMode) {
        if (isCinematic) {
          const spinSpeed = 9.5 + Math.pow(cinematicProgress, 1.4) * 10.5;
          groupRef.current.rotation.y += delta * spinSpeed;
        } else {
          const spinSpeed = HERO_SPIN_SPEED + transitionProgress * 3.98;
          groupRef.current.rotation.y += delta * spinSpeed;
        }
      } else if (isSiteMode) {
        // Direct scroll-locked yaw, pitch, and roll with time-wobble and lag interpolation (inertia)
        const targetPitch = transitionProgress * Math.PI * 1.25 + Math.sin(frameState.clock.getElapsedTime() * 0.28) * 0.16;
        const targetYaw = frameState.clock.getElapsedTime() * 0.14 + transitionProgress * Math.PI * 2.2;
        const targetRoll = -transitionProgress * Math.PI * 0.85 + Math.cos(frameState.clock.getElapsedTime() * 0.22) * 0.12;

        groupRef.current.rotation.x += (targetPitch - groupRef.current.rotation.x) * 0.08;
        groupRef.current.rotation.y += (targetYaw - groupRef.current.rotation.y) * 0.08;
        groupRef.current.rotation.z += (targetRoll - groupRef.current.rotation.z) * 0.08;
      } else if (isTransitionMode) {
        const spinGate = MathUtils.smoothstep(bouncePhase, 0.22, 1) * MathUtils.smoothstep(holeState.spinPhase, 0.15, 1);
        const spinSpeed = MathUtils.lerp(0.14, holeState.spinSpeed, spinGate);
        const targetX = MathUtils.lerp(BASE_TILT * 0.28, holeState.targetTilt, MathUtils.smoothstep(holeState.spinPhase, 0.18, 1));
        const targetZ = MathUtils.lerp(0.26, 0, Math.min(1, impactPhase + bouncePhase));

        groupRef.current.rotation.y += delta * spinSpeed;
        groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.14;
        groupRef.current.rotation.z += (targetZ - groupRef.current.rotation.z) * 0.14;
      } else {
        groupRef.current.rotation.y += delta * holeState.spinSpeed;
      }

      if (isTransitionMode && lockYawRef.current !== null) {
        groupRef.current.rotation.y += (lockYawRef.current - groupRef.current.rotation.y) * 0.08;
      }

      const targetTilt = isHeroMode
        ? isCinematic
          ? 0
          : MathUtils.lerp(MathUtils.degToRad(-24), 0, transitionProgress)
        : isSiteMode
          ? groupRef.current.rotation.x
          : holeState.targetTilt;
      const detachPhase = isHeroMode || isSiteMode ? 0 : MathUtils.smoothstep(holeState.detachPhase, 0, 1);
      const targetZ = MathUtils.lerp(0, MAX_DETACH_Z, detachPhase);
      const targetScale = MathUtils.lerp(1, MAX_DETACH_SCALE, detachPhase);

      if (!isSiteMode) {
        groupRef.current.rotation.x += (targetTilt - groupRef.current.rotation.x) * 0.14;
        if (!isTransitionMode) {
          groupRef.current.rotation.z += (0 - groupRef.current.rotation.z) * 0.14;
        }
      }

      groupRef.current.position.x += (0 - groupRef.current.position.x) * 0.2;
      groupRef.current.position.y += (0 - groupRef.current.position.y) * 0.2;
      if (!isSiteMode) {
        groupRef.current.position.z += (targetZ - groupRef.current.position.z) * 0.16;
        const nextScale = groupRef.current.scale.x + (targetScale - groupRef.current.scale.x) * 0.16;
        groupRef.current.scale.setScalar(nextScale);
      }

      if (isTransitionMode && holeState.lockPhase > 0.995) {
        groupRef.current.rotation.y = lockYawRef.current ?? groupRef.current.rotation.y;
        groupRef.current.rotation.x = LOCK_TILT;
        groupRef.current.rotation.z = 0;
        groupRef.current.position.x = 0;
        groupRef.current.position.y = 0;
        groupRef.current.position.z = MAX_DETACH_Z;
        groupRef.current.scale.setScalar(MAX_DETACH_SCALE);
      }
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <torusGeometry args={[1.2, 0.62, 120, 520]} />
        <meshStandardMaterial
          color="#5c5c76" // Lighter, high-contrast slate-obsidian to catch all lights with 50% more brightness
          map={topoTexture}
          bumpMap={topoTexture}
          bumpScale={0.006} // Soft raised contour lines
          roughness={0.44} // Sleek, premium satin polish
          metalness={0.22} // catches light reflections beautifully
          emissiveMap={topoTexture}
          emissive="#ffffff" // Bright white glowing contour lines
          emissiveIntensity={3.6} // Boosted intensity for 50% more visibility
        />
      </mesh>
    </group>
  );
}
