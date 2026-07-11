import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Group, MathUtils } from "three";
import CrystalCore from "./CrystalCore";

type InlineDonutCanvasProps = {
  spinProgressRef?: { current: number };
  cinematicProgressRef?: { current: number };
  isCinematic?: boolean;
  motionMode?: "hero" | "site" | "transition";
};

function TransparentClearColor() {
  const { gl } = useThree();

  useEffect(() => {
    gl.setClearColor(0x000000, 0);
  }, [gl]);

  return null;
}

const SITE_CAMERA_Z = 5.34;
const SITE_SCALE_START = 0.9;
const SITE_SCALE_END = 1.06;
const SITE_Y_START = 0.14;
const SITE_Y_END = -1.72;
const SITE_X_END = 0.22;
const SITE_Z_END = -0.28;
const IMPACT_END = 0.28;
const BOUNCE_END = 0.66;
const ZOOM_START = 0.78;
const ZOOM_END = 0.985;
const CAMERA_Z_START = 5.2;
const CAMERA_Z_END = 3.25;
const DONUT_SCALE_START = 0.95;
const DONUT_SCALE_END = 12.6;

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function easeInOutSmoothstep(value: number) {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
}

function DonutRig({ spinProgressRef, cinematicProgressRef, isCinematic = false, motionMode = "site" }: InlineDonutCanvasProps) {
  const groupRef = useRef<Group>(null);
  const { camera, size } = useThree();

  useFrame((state, delta) => {
    const progress = clamp01(spinProgressRef?.current ?? 0);
    const cinematicProgress = cinematicProgressRef?.current ?? 0;
    const isSiteMode = motionMode === "site";
    const isTransitionMode = motionMode === "transition";
    const isHeroMode = motionMode === "hero";
    const desktopBias = size.width >= 1280 ? 1.6 : size.width >= 960 ? 1.15 : size.width >= 720 ? 0.55 : 0;
    const elapsed = state.clock.getElapsedTime();
    const sitePhase = easeInOutSmoothstep(progress);
    const impactPhase = easeInOutSmoothstep(progress / IMPACT_END);
    const bouncePhase = easeInOutSmoothstep((progress - IMPACT_END) / (BOUNCE_END - IMPACT_END));
    const zoomPhase = easeInOutSmoothstep((progress - ZOOM_START) / (ZOOM_END - ZOOM_START));

    let targetScale = DONUT_SCALE_START;
    let targetCameraZ = CAMERA_Z_START;
    let targetX = desktopBias;
    let targetY = -0.08;
    let targetRigZ = 0;
    let targetRoll = 0;

    if (isSiteMode) {
      targetScale = MathUtils.lerp(SITE_SCALE_START, SITE_SCALE_END, sitePhase);
      targetCameraZ = SITE_CAMERA_Z;
      targetX = MathUtils.lerp(desktopBias * 0.92, SITE_X_END, sitePhase) + Math.cos(elapsed * 0.44) * 0.035 * (1 - sitePhase * 0.35);
      targetY = MathUtils.lerp(SITE_Y_START, SITE_Y_END, sitePhase);
      targetRigZ = MathUtils.lerp(-0.04, SITE_Z_END, sitePhase);
      targetRoll = Math.sin(elapsed * 0.68 + progress * 5.6) * 0.18 + Math.cos(elapsed * 0.31 + progress * 3.1) * 0.05;
    } else if (isTransitionMode) {
      const landY = MathUtils.lerp(SITE_Y_END, -1.96, impactPhase);
      const bounceLiftY = MathUtils.lerp(-1.96, -0.12, bouncePhase);
      const frontZ = MathUtils.lerp(SITE_Z_END, 1.08, bouncePhase);
      const preZoomScale = MathUtils.lerp(1.28, 1.06, zoomPhase * 0.25);

      targetScale = MathUtils.lerp(preZoomScale, DONUT_SCALE_END, zoomPhase);
      targetCameraZ = MathUtils.lerp(SITE_CAMERA_Z, CAMERA_Z_END, zoomPhase);
      targetX = MathUtils.lerp(SITE_X_END, desktopBias * 0.04, bouncePhase) + Math.cos(elapsed * 0.46) * 0.02 * (1 - zoomPhase);
      targetY = MathUtils.lerp(bounceLiftY, 0.02, zoomPhase);
      targetRigZ = MathUtils.lerp(frontZ, 0.04, zoomPhase);
      targetRoll = MathUtils.lerp(0.16, 0, Math.min(1, bouncePhase + zoomPhase));

      if (progress < IMPACT_END) {
        targetScale = MathUtils.lerp(SITE_SCALE_END, 0.88, impactPhase);
        targetX = SITE_X_END;
        targetY = landY;
        targetRigZ = SITE_Z_END;
        targetRoll = 0.22;
      }
    } else if (isHeroMode) {
      if (isCinematic) {
        const zoomProgress = Math.pow(cinematicProgress, 1.4);
        
        // Cinematic zoom up to 35.0 to occupy the whole viewport
        targetScale = MathUtils.lerp(1.6, 35.0, zoomProgress);
        
        // Camera moves extremely close to zoom through the hole
        targetCameraZ = MathUtils.lerp(4.5, 0.7, zoomProgress);
        
        // Already centered during scroll, keep it at 0
        targetX = 0;
        targetY = 0;
        
        // Move donut forward along Z
        targetRigZ = MathUtils.lerp(0, 4.0, zoomProgress);
        
        // Add dynamic roll (flatten to 0 at the end of the zoom)
        targetRoll = MathUtils.lerp(-0.05, 0, zoomProgress);
      } else {
        const scrollT = progress;
        // In scrolling phase, scale changes moderately
        targetScale = MathUtils.lerp(DONUT_SCALE_START, 1.6, scrollT);
        targetCameraZ = MathUtils.lerp(CAMERA_Z_START, 4.5, scrollT);
        
        // Slide left from desktopBias to center (0) as the user scrolls
        targetX = MathUtils.lerp(desktopBias, 0, scrollT);
        targetY = MathUtils.lerp(-0.08, 0, scrollT);
        targetRigZ = 0;
        targetRoll = MathUtils.lerp(0, -0.05, scrollT);
      }
    } else {
      targetScale = DONUT_SCALE_START;
      targetCameraZ = CAMERA_Z_START;
      targetX = desktopBias;
      targetY = -0.08;
      targetRigZ = 0;
      targetRoll = 0;
    }

    if (groupRef.current) {
      const currentScale = groupRef.current.scale.x;
      const isHero = motionMode === "hero";
      const scaleSpeed = isCinematic ? 16 : isHero ? 12 : isTransitionMode ? 6.8 : 8.5;
      const nextScale = currentScale + (targetScale - currentScale) * Math.min(1, delta * scaleSpeed);

      groupRef.current.scale.setScalar(nextScale);
      groupRef.current.position.x += (targetX - groupRef.current.position.x) * Math.min(1, delta * (isCinematic ? 16 : isHero ? 12 : 4.6));
      groupRef.current.position.y += (targetY - groupRef.current.position.y) * Math.min(1, delta * (isCinematic ? 16 : isHero ? 12 : isTransitionMode ? 5.4 : 4.8));
      groupRef.current.position.z += (targetRigZ - groupRef.current.position.z) * Math.min(1, delta * (isCinematic ? 16 : isHero ? 12 : isTransitionMode ? 5 : 4.2));
      groupRef.current.rotation.z += (targetRoll - groupRef.current.rotation.z) * Math.min(1, delta * (isCinematic ? 16 : isHero ? 12 : isTransitionMode ? 3.2 : 2.5));
    }

    const cameraSpeed = isCinematic ? 16 : motionMode === "hero" ? 12 : 7;
    camera.position.z += (targetCameraZ - camera.position.z) * Math.min(1, delta * cameraSpeed);
    camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={groupRef}>
      <CrystalCore 
        spinProgressRef={spinProgressRef} 
        cinematicProgressRef={cinematicProgressRef}
        isCinematic={isCinematic}
        motionMode={motionMode} 
      />
    </group>
  );
}

export default function InlineDonutCanvas({ spinProgressRef, cinematicProgressRef, isCinematic, motionMode = "site" }: InlineDonutCanvasProps) {
  const [lowPower, setLowPower] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowCoreCount = (navigator.hardwareConcurrency ?? 8) <= 6;
    const compactViewport = window.innerWidth < 900;

    setLowPower(prefersReducedMotion || lowCoreCount || compactViewport);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 5.2], fov: 60 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance", stencil: false }}
      dpr={lowPower ? [1, 1] : [1, 1.25]}
      className="h-full w-full"
      style={{ width: "100%", height: "100%" }}
    >
      <TransparentClearColor />

      <ambientLight intensity={0.28} />
      <hemisphereLight args={["#cbf7ff", "#120817", 0.7]} />
      <pointLight position={[4.8, 5.2, 4.2]} intensity={8.8} color="#64ecff" />
      <pointLight position={[-4.8, -2.4, -4.4]} intensity={6.4} color="#7d7cff" />
      <pointLight position={[1.2, -4.8, 3.8]} intensity={5.8} color="#ff7dc7" />
      <pointLight position={[-0.8, 2.2, 5.6]} intensity={4.8} color="#ffb84d" />

      <DonutRig 
        spinProgressRef={spinProgressRef} 
        cinematicProgressRef={cinematicProgressRef} 
        isCinematic={isCinematic} 
        motionMode={motionMode} 
      />
    </Canvas>
  );
}
