import { animate, motion, useMotionValue, useMotionValueEvent, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import InlineDonutCanvas from "./InlineDonutCanvas";
import HeroText from "./HeroText";

const WHEEL_SENSITIVITY = 0.0028;
const KEYBOARD_STEP = 0.032;
const TOUCH_SENSITIVITY = 0.0065;
const HERO_TICKER = [
  "Brand launches",
  "Festival energy",
  "Rainbow radiance",
  "Three.js depth",
  "Motion-led storytelling",
  "Launch-ready frontend",
] as const;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function normalizeWheelDelta(event: WheelEvent) {
  const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
  const raw = event.deltaY * unit;

  if (Math.abs(raw) < 0.2) {
    return 0;
  }

  return Math.sign(raw) * Math.min(32, Math.abs(raw));
}

interface HeroSectionProps {
  initialProgress?: number;
  onComplete?: () => void;
  onReverseComplete?: () => void;
  inputEnabled?: boolean;
  externalProgress?: number;
}

function isInteractiveTarget(target: EventTarget | null) {
  return target instanceof Element && Boolean(target.closest("a, button, input, textarea, select, option, label, summary, [role='button'], [role='link']"));
}

export default function HeroSection({ initialProgress = 0, onComplete, onReverseComplete, inputEnabled = true, externalProgress }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const completedRef = useRef(false);
  const spinProgressRef = useRef(initialProgress);
  const touchStartYRef = useRef<number | null>(null);
  const touchStartProgressRef = useRef(0);
  const progress = useMotionValue(initialProgress);
  const smoothProgress = useSpring(progress, {
    stiffness: 140,
    damping: 26,
    mass: 0.4,
  });

  const shouldCompleteOnSpringActive = useRef(false);
  const [isCinematic, setIsCinematic] = useState(false);
  const isCinematicRef = useRef(false);
  const cinematicZoom = useMotionValue(0);
  const cinematicProgressRef = useRef(0);

  useMotionValueEvent(cinematicZoom, "change", (val) => {
    cinematicProgressRef.current = val;
  });

  const completeHero = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    onComplete?.();
  };

  const triggerCinematicTransition = () => {
    setIsCinematic(true);
    isCinematicRef.current = true;
    
    animate(cinematicZoom, 1, {
      duration: 1.4,
      ease: [0.76, 0, 0.24, 1], // Cinematic cubic-bezier easing curve
      onComplete: () => {
        completeHero();
      }
    });
  };

  useMotionValueEvent(smoothProgress, "change", (value) => {
    spinProgressRef.current = value;
    if (value >= 0.985 && shouldCompleteOnSpringActive.current && !completedRef.current && !isCinematicRef.current) {
      triggerCinematicTransition();
    }
  });

  useEffect(() => {
    if (typeof externalProgress !== "number") {
      return;
    }

    progress.set(clamp(externalProgress, 0, 1));
  }, [externalProgress, progress]);

  useEffect(() => {
    if (!inputEnabled) {
      return undefined;
    }

    const handleWheel = (event: WheelEvent) => {
      if (completedRef.current || isCinematicRef.current) return;

      const wheelDelta = normalizeWheelDelta(event);
      if (wheelDelta === 0) {
        return;
      }

      event.preventDefault();

      const next = clamp(progress.get() + wheelDelta * WHEEL_SENSITIVITY, 0, 1);
      if (next >= 0.99 && wheelDelta > 0) {
        shouldCompleteOnSpringActive.current = true;
      } else if (next < 0.99) {
        shouldCompleteOnSpringActive.current = false;
      }
      progress.set(next);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (completedRef.current || isCinematicRef.current) return;

      const forwardKeys = ["ArrowDown", "PageDown", " "];
      const backwardKeys = ["ArrowUp", "PageUp"];

      if (forwardKeys.includes(event.key)) {
        event.preventDefault();

        const next = clamp(progress.get() + KEYBOARD_STEP, 0, 1);
        if (next >= 0.99) {
          shouldCompleteOnSpringActive.current = true;
        }
        progress.set(next);
        return;
      }

      if (backwardKeys.includes(event.key)) {
        event.preventDefault();

        const next = clamp(progress.get() - KEYBOARD_STEP, 0, 1);
        shouldCompleteOnSpringActive.current = false;
        progress.set(next);
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (completedRef.current || isCinematicRef.current || event.touches.length === 0 || isInteractiveTarget(event.target)) return;

      touchStartYRef.current = event.touches[0].clientY;
      touchStartProgressRef.current = progress.get();
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (completedRef.current || isCinematicRef.current || touchStartYRef.current === null || event.touches.length === 0) return;

      const delta = touchStartYRef.current - event.touches[0].clientY;

      if (Math.abs(delta) < 2) {
        return;
      }

      event.preventDefault();
      const next = clamp(touchStartProgressRef.current + delta * TOUCH_SENSITIVITY, 0, 1);
      if (next >= 0.99 && delta > 0) {
        shouldCompleteOnSpringActive.current = true;
      } else if (next < 0.99) {
        shouldCompleteOnSpringActive.current = false;
      }
      progress.set(next);
    };

    const handleTouchEnd = () => {
      touchStartYRef.current = null;
      touchStartProgressRef.current = progress.get();
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [inputEnabled, onComplete, onReverseComplete, progress]);

  const backdropScale = useTransform(smoothProgress, [0, 1], [1, 1.2]);
  const backdropRotate = useTransform(smoothProgress, [0, 1], ["0deg", "-7deg"]);
  const beamLeftX = useTransform(smoothProgress, [0, 1], ["0%", "18%"]);
  const beamRightX = useTransform(smoothProgress, [0, 1], ["0%", "-22%"]);
  const beamOpacity = useTransform(smoothProgress, [0, 0.82, 1], [0.38, 0.68, 0]);
  const glowScale = useTransform(smoothProgress, [0, 0.86, 1], [0.96, 1.16, 1.8]);
  const glowOpacity = useTransform(smoothProgress, [0, 0.78, 0.965, 1], [0.42, 0.72, 0.88, 0]);
  const orbitScale = useTransform(smoothProgress, [0, 1], [0.94, 1.36]);
  const orbitOpacity = useTransform(smoothProgress, [0, 0.86, 1], [0.16, 0.38, 0]);
  const contourOpacity = useTransform(smoothProgress, [0, 0.8, 1], [0.12, 0.28, 0.08]);
  const gridOpacity = useTransform(smoothProgress, [0, 0.86, 1], [0.2, 0.34, 0.08]);
  const gridY = useTransform(smoothProgress, [0, 1], ["0%", "8%"]);
  const textOpacity = useTransform(smoothProgress, [0, 0.84, 0.92], [1, 1, 0]);
  const textY = useTransform(smoothProgress, [0, 0.92], ["0%", "-10%"]);
  const textX = useTransform(smoothProgress, [0, 0.92], ["0%", "-3.5%"]);
  const vignetteOpacity = useTransform(smoothProgress, [0, 0.54, 1], [0.22, 0.42, 0.9]);
  const tickerOpacity = useTransform(smoothProgress, [0, 0.1, 0.82, 0.92], [0, 1, 1, 0]);
  const endFadeOpacity = useTransform(smoothProgress, [0.86, 1], [0, 0.32]);
  const progressFill = useTransform(smoothProgress, [0, 1], [0, 1]);
  const donutOpacity = useTransform(cinematicZoom, [0, 0.72, 0.94, 1], [1, 1, 0.12, 0]);
  const cinematicFlash = useTransform(cinematicZoom, [0, 0.72, 0.94, 1], [0, 0, 0.95, 1]);

  return (
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden bg-[#05030b] text-white">
      <motion.div className="hero-spectrum-backdrop pointer-events-none absolute inset-[-14%] z-0" style={{ scale: backdropScale, rotate: backdropRotate }} />

      <div className="violet-speckles pointer-events-none absolute inset-0 z-0 opacity-50" />

      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(circle at 16% 24%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 22%), radial-gradient(circle at 76% 18%, rgba(103,237,255,0.12) 0%, rgba(103,237,255,0) 24%), linear-gradient(180deg, rgba(7,4,14,0.08) 0%, rgba(4,3,10,0.88) 100%)",
        }}
      />

      <motion.div className="hero-grid-plane pointer-events-none absolute inset-x-[-6%] bottom-[-20%] top-[42%] z-[1]" style={{ opacity: gridOpacity, y: gridY }} />

      <motion.div
        className="hero-light-column pointer-events-none absolute left-[-16%] top-[4%] z-[1] h-[26rem] w-[34rem] -rotate-[15deg] md:h-[34rem] md:w-[54rem]"
        style={{ x: beamLeftX, opacity: beamOpacity }}
      />

      <motion.div
        className="hero-light-column hero-light-column--warm pointer-events-none absolute bottom-[-4%] right-[-20%] z-[1] h-[24rem] w-[32rem] rotate-[24deg] md:h-[30rem] md:w-[48rem]"
        style={{ x: beamRightX, opacity: beamOpacity }}
      />

      <motion.div className="hero-stage-glow pointer-events-none absolute left-1/2 top-[66%] z-[1] h-[22rem] w-[64rem] max-w-[98vw] -translate-x-1/2 -translate-y-1/2" style={{ scale: glowScale, opacity: glowOpacity }} />

      <motion.div className="hero-spectrum-ring pointer-events-none absolute left-1/2 top-[50%] z-[1] h-[clamp(16rem,46vw,32rem)] w-[clamp(16rem,46vw,32rem)] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ scale: orbitScale, opacity: orbitOpacity }} />

      <motion.div className="flow-contour pointer-events-none absolute inset-x-[6%] bottom-[12%] top-[12%] z-[1]" style={{ opacity: contourOpacity }} />

      <motion.div 
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{ opacity: donutOpacity }}
      >
        <InlineDonutCanvas 
          spinProgressRef={spinProgressRef} 
          cinematicProgressRef={cinematicProgressRef}
          isCinematic={isCinematic}
          motionMode="hero" 
        />
      </motion.div>

      <motion.div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          opacity: vignetteOpacity,
          background:
            "radial-gradient(circle at 60% 42%, rgba(255,255,255,0.03) 0%, rgba(24,12,44,0.18) 18%, rgba(7,4,14,0.84) 72%), linear-gradient(180deg, rgba(8,6,16,0.1) 0%, rgba(3,2,9,0.9) 100%)",
        }}
      />

      <motion.div 
        className="relative z-[3] flex h-full w-full items-center" 
        style={{ x: textX, y: textY }}
        animate={isCinematic ? { opacity: 0, y: -48 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.54, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div style={{ opacity: textOpacity }} className="w-full">
          <HeroText />
        </motion.div>
      </motion.div>

      <motion.div 
        className="pointer-events-none absolute bottom-7 left-1/2 z-[4] flex w-[min(92vw,72rem)] -translate-x-1/2 flex-col gap-4" 
        animate={isCinematic ? { opacity: 0, y: 36 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div style={{ opacity: tickerOpacity }} className="flex w-full flex-col gap-4">
          <div className="hero-ticker-shell overflow-hidden rounded-full border border-white/[0.08] bg-black/20 px-4 py-3 backdrop-blur-xl">
            <div className="animate-marquee flex min-w-max items-center gap-8 pr-8">
              {[...HERO_TICKER, ...HERO_TICKER].map((item, index) => (
                <span key={`${item}-${index}`} className="flex items-center gap-3 font-mono text-[0.52rem] uppercase tracking-[0.34em] text-white/44">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/28" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="mx-auto flex w-full max-w-[20rem] flex-col items-center gap-3">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-white/12" />
              <span className="font-mono text-[0.56rem] uppercase tracking-[0.38em] text-white/34">Glide deeper to enter</span>
              <span className="h-px w-8 bg-white/12" />
            </div>

            <div className="h-px w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full origin-left bg-[linear-gradient(90deg,rgba(96,223,255,0.92),rgba(131,255,187,0.84),rgba(255,178,61,0.88),rgba(255,88,140,0.9),rgba(126,150,255,0.88))]"
                style={{ scaleX: progressFill }}
              />
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div className="pointer-events-none absolute inset-0 z-[5] bg-[linear-gradient(180deg,rgba(3,2,9,0)_0%,rgba(3,2,9,0.34)_100%)]" style={{ opacity: endFadeOpacity }} />

      <motion.div 
        className="pointer-events-none absolute inset-0 z-[10] bg-[#0b0613]"
        style={{ opacity: cinematicFlash }}
      />
    </section>
  );
}
