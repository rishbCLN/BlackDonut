import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, CanvasTexture, Group, MathUtils, RepeatWrapping, SRGBColorSpace } from "three";

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

function createHeatMapTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 256;

  const context = canvas.getContext("2d");
  if (!context) {
    return null;
  }

  const baseGradient = context.createLinearGradient(0, 0, canvas.width, 0);
  baseGradient.addColorStop(0, "#59eaff");
  baseGradient.addColorStop(0.14, "#6dffbd");
  baseGradient.addColorStop(0.31, "#f3ff82");
  baseGradient.addColorStop(0.46, "#ffbb48");
  baseGradient.addColorStop(0.62, "#ff6f63");
  baseGradient.addColorStop(0.78, "#ff5fcf");
  baseGradient.addColorStop(0.91, "#8f74ff");
  baseGradient.addColorStop(1, "#59eaff");

  context.fillStyle = baseGradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const verticalGradient = context.createLinearGradient(0, 0, 0, canvas.height);
  verticalGradient.addColorStop(0, "rgba(255,255,255,0.92)");
  verticalGradient.addColorStop(0.18, "rgba(255,255,255,0.18)");
  verticalGradient.addColorStop(0.5, "rgba(17,14,28,0.2)");
  verticalGradient.addColorStop(0.82, "rgba(255,255,255,0.18)");
  verticalGradient.addColorStop(1, "rgba(255,255,255,0.88)");

  context.globalCompositeOperation = "overlay";
  context.fillStyle = verticalGradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.globalCompositeOperation = "screen";
  for (let index = 0; index < 28; index += 1) {
    const position = (canvas.width / 28) * index;
    const width = index % 3 === 0 ? 34 : 18;
    const alpha = index % 4 === 0 ? 0.22 : 0.11;

    context.fillStyle = `rgba(255,255,255,${alpha})`;
    context.fillRect(position, 0, width, canvas.height);
  }

  context.globalCompositeOperation = "source-over";

  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(1.45, 1);
  texture.center.set(0.5, 0.5);
  texture.colorSpace = SRGBColorSpace;

  return texture;
}

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
  const heatTexture = useMemo(() => createHeatMapTexture(), []);

  useFrame((frameState, delta) => {
    const transitionProgress = MathUtils.clamp(spinProgressRef?.current ?? 0, 0, 1);
    const cinematicProgress = cinematicProgressRef?.current ?? 0;
    const holeState = getHoleEntryState(transitionProgress);
    const isHeroMode = motionMode === "hero";
    const isSiteMode = motionMode === "site";
    const isTransitionMode = motionMode === "transition";
    const impactPhase = MathUtils.clamp(transitionProgress / 0.24, 0, 1);
    const bouncePhase = MathUtils.clamp((transitionProgress - 0.24) / 0.24, 0, 1);

    if (heatTexture) {
      const textureDrift = isHeroMode
        ? 0.026
        : isSiteMode
          ? 0.034
          : isTransitionMode
            ? MathUtils.lerp(0.036, 0.18, holeState.spinPhase)
            : MathUtils.lerp(0.024, 0.12, holeState.spinPhase);

      heatTexture.offset.x = (heatTexture.offset.x + delta * textureDrift) % 1;
      heatTexture.rotation = isHeroMode
        ? Math.sin(frameState.clock.getElapsedTime() * 0.35) * 0.03
        : isSiteMode
          ? Math.sin(frameState.clock.getElapsedTime() * 0.56 + transitionProgress * 4.2) * 0.07
          : Math.sin(holeState.spinPhase * Math.PI) * 0.08;
    }

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
          // Accelerate to a high cinematic velocity (18.0 rad/s)
          const spinSpeed = 9.5 + Math.pow(cinematicProgress, 1.4) * 10.5;
          groupRef.current.rotation.y += delta * spinSpeed;
        } else {
          // Moderate spin speed during scroll (up to 4.5 rad/s)
          const spinSpeed = HERO_SPIN_SPEED + transitionProgress * 3.98;
          groupRef.current.rotation.y += delta * spinSpeed;
        }
      } else if (isSiteMode) {
        groupRef.current.rotation.y += delta * 0.42;
        groupRef.current.rotation.x += (Math.sin(frameState.clock.getElapsedTime() * 0.78 + transitionProgress * 7.4) * 0.88 - groupRef.current.rotation.x) * 0.08;
        groupRef.current.rotation.z += (Math.cos(frameState.clock.getElapsedTime() * 0.62 + transitionProgress * 5.2) * 0.94 - groupRef.current.rotation.z) * 0.08;
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
          ? 0 // Perfectly flat, hole facing us directly
          : MathUtils.lerp(MathUtils.degToRad(-24), 0, transitionProgress) // Leans backward and flattens as we scroll
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
        <meshPhysicalMaterial
          color="#eff8ff"
          map={heatTexture ?? undefined}
          emissiveMap={heatTexture ?? undefined}
          emissive="#ffffff"
          emissiveIntensity={0.9}
          roughness={0.14}
          metalness={0.38}
          clearcoat={1}
          clearcoatRoughness={0.08}
          reflectivity={1}
          iridescence={1}
          iridescenceIOR={1.4}
          iridescenceThicknessRange={[120, 620]}
        />
      </mesh>

      <mesh>
        <torusGeometry args={[1.224, 0.648, 96, 360]} />
        <meshBasicMaterial
          color="#ffffff"
          map={heatTexture ?? undefined}
          transparent
          opacity={0.28}
          blending={AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <mesh rotation={[0.18, 0, 0]}>
        <torusGeometry args={[1.208, 0.628, 42, 180]} />
        <meshBasicMaterial color="#f6ebff" wireframe transparent opacity={0.1} depthWrite={false} />
      </mesh>
    </group>
  );
}
