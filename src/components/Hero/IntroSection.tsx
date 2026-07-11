import { motion, useMotionTemplate, useMotionValue, useMotionValueEvent, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, type CSSProperties } from "react";
import CursorEyes from "../UI/CursorEyes";

const WHEEL_SENSITIVITY = 0.00072;
const KEYBOARD_STEP = 0.05;
const TOUCH_SENSITIVITY = 0.0018;
const COMPLETE_AT = 0.992;
const CRACKS: ReadonlyArray<{
  top: string;
  left?: string;
  right?: string;
  width: string;
  rotate: string;
}> = [
  { top: "22%", left: "18%", width: "28%", rotate: "-36deg" },
  { top: "34%", right: "18%", width: "24%", rotate: "34deg" },
  { top: "48%", left: "14%", width: "36%", rotate: "-8deg" },
  { top: "56%", right: "14%", width: "30%", rotate: "12deg" },
  { top: "70%", left: "28%", width: "22%", rotate: "44deg" },
  { top: "70%", right: "28%", width: "22%", rotate: "-44deg" },
];
const SHARDS = [0, 48, 94, 140, 196, 242, 288, 334] as const;
const SPECTRUM_STREAMS = [
  { angle: "-114deg", width: "clamp(8rem,18vw,14rem)", height: "1.05rem", shift: "clamp(8rem,16vw,13rem)", delay: "0s", duration: "4.6s", color: "rgba(103,236,255,0.94)", trail: "rgba(145,255,196,0.72)" },
  { angle: "-84deg", width: "clamp(10rem,22vw,17rem)", height: "1.2rem", shift: "clamp(10rem,20vw,15rem)", delay: "0.5s", duration: "5.2s", color: "rgba(145,255,196,0.94)", trail: "rgba(255,213,100,0.7)" },
  { angle: "-54deg", width: "clamp(11rem,24vw,18rem)", height: "1.35rem", shift: "clamp(12rem,24vw,18rem)", delay: "0.22s", duration: "5s", color: "rgba(255,213,100,0.94)", trail: "rgba(255,126,96,0.72)" },
  { angle: "-24deg", width: "clamp(9rem,20vw,15rem)", height: "1.1rem", shift: "clamp(10rem,21vw,16rem)", delay: "0.74s", duration: "4.8s", color: "rgba(255,126,96,0.92)", trail: "rgba(255,97,166,0.74)" },
  { angle: "6deg", width: "clamp(8rem,18vw,14rem)", height: "0.95rem", shift: "clamp(8rem,17vw,13rem)", delay: "1.06s", duration: "5.4s", color: "rgba(255,97,166,0.9)", trail: "rgba(137,134,255,0.72)" },
  { angle: "34deg", width: "clamp(7rem,16vw,12rem)", height: "0.9rem", shift: "clamp(7rem,15vw,11rem)", delay: "1.34s", duration: "4.9s", color: "rgba(137,134,255,0.9)", trail: "rgba(103,236,255,0.72)" },
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

  return Math.sign(raw) * Math.min(36, Math.abs(raw));
}

interface IntroSectionProps {
  initialProgress?: number;
  onComplete?: () => void;
  onProgressChange?: (progress: number) => void;
}

export default function IntroSection({ initialProgress = 0, onComplete, onProgressChange }: IntroSectionProps) {
  const completedRef = useRef(false);
  const touchStartY = useRef<number | null>(null);
  const touchStartProgress = useRef(0);
  const previousProgress = useRef(initialProgress);
  const progress = useMotionValue(initialProgress);
  const smoothProgress = useSpring(progress, {
    stiffness: 120,
    damping: 24,
    mass: 0.65,
  });

  const completeIntro = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    onComplete?.();
  };

  useMotionValueEvent(smoothProgress, "change", (value) => {
    const previous = previousProgress.current;
    previousProgress.current = value;
    onProgressChange?.(value);

    if (value >= COMPLETE_AT && previous < COMPLETE_AT) {
      completeIntro();
    }
  });

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (completedRef.current) return;

      const wheelDelta = normalizeWheelDelta(event);
      if (wheelDelta === 0) {
        return;
      }

      event.preventDefault();

      if (progress.get() >= 1 && wheelDelta > 0) {
        completeIntro();
        return;
      }

      const next = clamp(progress.get() + wheelDelta * WHEEL_SENSITIVITY, 0, 1);
      progress.set(next);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (completedRef.current) return;

      const forwardKeys = ["ArrowDown", "PageDown", " ", "Enter"];
      const backwardKeys = ["ArrowUp", "PageUp"];

      if (forwardKeys.includes(event.key)) {
        event.preventDefault();

        if (progress.get() >= 1) {
          completeIntro();
          return;
        }

        progress.set(clamp(progress.get() + KEYBOARD_STEP, 0, 1));
        return;
      }

      if (backwardKeys.includes(event.key)) {
        event.preventDefault();
        progress.set(clamp(progress.get() - KEYBOARD_STEP, 0, 1));
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (completedRef.current || event.touches.length === 0) return;

      touchStartY.current = event.touches[0].clientY;
      touchStartProgress.current = progress.get();
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (completedRef.current || touchStartY.current === null || event.touches.length === 0) return;

      const delta = touchStartY.current - event.touches[0].clientY;

      if (Math.abs(delta) < 2) {
        return;
      }

      if (progress.get() >= 1 && delta > 18) {
        event.preventDefault();
        completeIntro();
        return;
      }

      event.preventDefault();
      progress.set(clamp(touchStartProgress.current + delta * TOUCH_SENSITIVITY, 0, 1));
    };

    const handleTouchEnd = () => {
      touchStartY.current = null;
      touchStartProgress.current = progress.get();
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
  }, [progress]);

  const backdropScale = useTransform(smoothProgress, [0, 1], [1, 1.18]);
  const backdropRotate = useTransform(smoothProgress, [0, 1], ["0deg", "8deg"]);
  const glowScale = useTransform(smoothProgress, [0, 0.82, 1], [0.94, 1.12, 1.56]);
  const glowOpacity = useTransform(smoothProgress, [0, 0.78, 1], [0.42, 0.72, 0]);
  const contentOpacity = useTransform(smoothProgress, [0, 0.08, 0.9, 1], [0.76, 1, 1, 0]);
  const contentY = useTransform(smoothProgress, [0, 1], ["3%", "-14%"]);
  const contentScale = useTransform(smoothProgress, [0, 0.82, 1], [0.98, 1.02, 1.18]);
  const contentBlur = useTransform(smoothProgress, [0, 0.88, 1], ["blur(0px)", "blur(0px)", "blur(14px)"]);
  const ribbonLeftX = useTransform(smoothProgress, [0, 1], ["-2%", "12%"]);
  const ribbonRightX = useTransform(smoothProgress, [0, 1], ["4%", "-10%"]);
  const ribbonOpacity = useTransform(smoothProgress, [0, 0.82, 1], [0.42, 0.7, 0]);
  const contourOpacity = useTransform(smoothProgress, [0, 0.68, 1], [0.14, 0.28, 0.08]);
  const meterScale = useTransform(smoothProgress, [0, 1], [0, 1]);
  const promptOpacity = useTransform(smoothProgress, [0, 0.12, 0.3], [0, 1, 0.34]);
  const donutScale = useTransform(smoothProgress, [0, 0.68, 1], [0.88, 1.04, 1.24]);
  const donutRotate = useTransform(smoothProgress, [0, 0.74, 1], ["-8deg", "8deg", "24deg"]);
  const donutY = useTransform(smoothProgress, [0, 1], ["3%", "-10%"]);
  const donutOpacity = useTransform(smoothProgress, [0, 0.9, 1], [0.28, 1, 0]);
  const crackOpacity = useTransform(smoothProgress, [0.18, 0.54, 0.9, 1], [0, 0.18, 0.95, 0]);
  const crackScale = useTransform(smoothProgress, [0.18, 0.9], [0.45, 1.22]);
  const crackRotate = useTransform(smoothProgress, [0.34, 1], ["0deg", "18deg"]);
  const blastScale = useTransform(smoothProgress, [0.7, 0.92, 1], [0.26, 1.4, 8.4]);
  const blastOpacity = useTransform(smoothProgress, [0.7, 0.82, 1], [0, 0.72, 1]);
  const blastRingOpacity = useTransform(smoothProgress, [0.7, 0.92, 1], [0, 0.58, 0]);
  const shardScale = useTransform(smoothProgress, [0.78, 1], [0.18, 1.55]);
  const shardOpacity = useTransform(smoothProgress, [0.78, 0.92, 1], [0, 0.86, 0]);
  const revealRadius = useTransform(smoothProgress, [0, 0.58, 0.88, 1], ["0.01rem", "0.01rem", "16rem", "180vmax"]);
  const waterHaloOpacity = useTransform(smoothProgress, [0.52, 0.82, 1], [0, 0.86, 0]);
  const waterHaloScale = useTransform(smoothProgress, [0.58, 1], [0.84, 1.12]);
  const waterRippleScale = useTransform(smoothProgress, [0.6, 0.9, 1], [0.76, 1, 1.14]);
  const waterHaloBlur = useTransform(smoothProgress, [0.54, 1], ["blur(6px)", "blur(16px)"]);
  const streamOpacity = useTransform(smoothProgress, [0, 0.08, 0.68, 0.86], [0.88, 1, 0.58, 0]);
  const streamScale = useTransform(smoothProgress, [0, 0.62, 1], [0.76, 1.02, 1.18]);
  const streamSourceScale = useTransform(smoothProgress, [0, 0.72, 1], [0.72, 1.06, 1.32]);
  const streamSourceOpacity = useTransform(smoothProgress, [0, 0.1, 0.7, 0.88], [0.44, 0.92, 0.62, 0]);
  const streamFanRotate = useTransform(smoothProgress, [0, 1], ["-8deg", "12deg"]);
  const streamFanY = useTransform(smoothProgress, [0, 1], ["4%", "-8%"]);
  const waterHaloSize = useMotionTemplate`calc(${revealRadius} * 2.18)`;
  const waterRippleSize = useMotionTemplate`calc(${revealRadius} * 2.72)`;
  const introMask = useMotionTemplate`radial-gradient(circle at 50% 58%, transparent 0rem, transparent ${revealRadius}, rgba(0, 0, 0, 1) calc(${revealRadius} + 2.4rem), rgba(0, 0, 0, 1) 100%)`;

  return (
    <motion.section
      className="relative h-screen w-full overflow-hidden bg-[#05030b] text-white"
      style={{ WebkitMaskImage: introMask, maskImage: introMask, WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat" }}
    >
      <motion.div className="hero-spectrum-backdrop pointer-events-none absolute inset-[-14%]" style={{ scale: backdropScale, rotate: backdropRotate }} />
      <div className="violet-speckles pointer-events-none absolute inset-0 opacity-48" />

      <motion.div
        className="hero-grid-plane pointer-events-none absolute inset-x-[-8%] bottom-[-22%] top-[46%]"
        style={{ opacity: contourOpacity }}
      />

      <motion.div
        className="hero-light-column pointer-events-none absolute left-[-18%] top-[8%] h-[22rem] w-[34rem] -rotate-[22deg] md:h-[26rem] md:w-[48rem]"
        style={{ x: ribbonLeftX, opacity: ribbonOpacity }}
      />

      <motion.div
        className="hero-light-column hero-light-column--warm pointer-events-none absolute bottom-[8%] right-[-18%] h-[22rem] w-[34rem] rotate-[20deg] md:h-[26rem] md:w-[46rem]"
        style={{ x: ribbonRightX, opacity: ribbonOpacity }}
      />

      <motion.div className="hero-stage-glow pointer-events-none absolute left-1/2 top-[68%] h-[18rem] w-[54rem] max-w-[94vw] -translate-x-1/2 -translate-y-1/2" style={{ scale: glowScale, opacity: glowOpacity }} />

      <motion.div className="flow-contour pointer-events-none absolute inset-x-[10%] bottom-[12%] top-[18%]" style={{ opacity: contourOpacity }} />

      <motion.div className="pointer-events-none absolute inset-0 z-[3]" style={{ opacity: streamOpacity }}>
        <motion.div
          className="intro-spectrum-source absolute left-1/2 top-[58%] h-[clamp(4rem,8vw,6.2rem)] w-[clamp(4rem,8vw,6.2rem)] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ scale: streamSourceScale, opacity: streamSourceOpacity }}
        />

        <motion.div
          className="absolute left-1/2 top-[58%] h-[clamp(20rem,38vw,30rem)] w-[clamp(20rem,38vw,30rem)] -translate-x-1/2 -translate-y-1/2"
          style={{ scale: streamScale, rotate: streamFanRotate, y: streamFanY }}
        >
          {SPECTRUM_STREAMS.map((stream) => (
            <span
              key={`${stream.angle}-${stream.delay}`}
              className="pointer-events-none absolute left-1/2 top-1/2 block -translate-x-1/2 -translate-y-1/2"
              style={{ rotate: stream.angle }}
            >
              <span
                className="intro-spectrum-stream"
                style={{
                  width: stream.width,
                  height: stream.height,
                  ["--stream-shift" as string]: stream.shift,
                  ["--stream-delay" as string]: stream.delay,
                  ["--stream-duration" as string]: stream.duration,
                  ["--stream-color" as string]: stream.color,
                  ["--stream-trail" as string]: stream.trail,
                } as CSSProperties}
              />
            </span>
          ))}
        </motion.div>
      </motion.div>

      <motion.div className="pointer-events-none absolute inset-0 z-[4]" style={{ opacity: waterHaloOpacity }}>
        <motion.div
          className="intro-water-shell absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ width: waterHaloSize, height: waterHaloSize, scale: waterHaloScale, filter: waterHaloBlur }}
        />

        <motion.div
          className="intro-water-ripple absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ width: waterRippleSize, height: waterRippleSize, scale: waterRippleScale }}
        />
      </motion.div>

      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 26%, rgba(255,255,255,0.04) 0%, rgba(104,232,255,0.05) 16%, rgba(255,102,168,0.04) 32%, rgba(5,3,10,0) 62%), linear-gradient(180deg, rgba(6,4,12,0.08) 0%, rgba(3,2,8,0.92) 82%)",
        }}
      />

      <motion.div className="pointer-events-none absolute inset-0" style={{ opacity: blastOpacity }}>
        <motion.div
          className="absolute left-1/2 top-[55%] h-[18rem] w-[18rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.94)_0%,rgba(167,238,255,0.56)_16%,rgba(255,203,95,0.28)_30%,rgba(255,102,168,0.2)_42%,transparent_72%)] blur-[1px]"
          style={{ scale: blastScale, opacity: blastRingOpacity }}
        />

        {SHARDS.map((angle) => (
          <motion.span
            key={angle}
            className="absolute left-1/2 top-[55%] h-px w-28 origin-left bg-[linear-gradient(90deg,rgba(255,255,255,0.88),rgba(104,232,255,0.44),transparent)]"
            style={{ rotate: `${angle}deg`, scaleX: shardScale, opacity: shardOpacity }}
          />
        ))}
      </motion.div>

      <motion.div
        className="relative z-10 flex h-full w-full items-center justify-center px-6"
        style={{ opacity: contentOpacity, y: contentY, scale: contentScale, filter: contentBlur }}
      >
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.48, delay: 0.14 }}
              className="inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 font-mono text-[0.54rem] uppercase tracking-[0.4em] text-white/56 backdrop-blur-xl md:text-[0.58rem]"
            >
              <span className="hero-kicker-dot" />
              Black Donut // enter the spectrum
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 22, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="mt-7 font-speed text-[clamp(3.6rem,10vw,7.6rem)] font-black italic uppercase leading-[0.88] tracking-[-0.055em] text-white"
              style={{ textShadow: "0 0 40px rgba(255,255,255,0.05), 0 0 90px rgba(105,232,255,0.08)" }}
            >
              Black
              <br />
              <span className="hero-gradient-word">Donut</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.68, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto mt-5 max-w-xl text-[0.92rem] leading-[1.85] tracking-[0.12em] text-white/54 md:text-[0.98rem]"
            >
              Dark rainbow radiance. Flow forward to wake the core.
            </motion.p>
          </div>

          <motion.div className="relative mt-10 flex items-center justify-center py-10" style={{ y: donutY }}>
            <motion.div
              className="intro-flow-orbit pointer-events-none absolute h-[clamp(18rem,34vw,26rem)] w-[clamp(18rem,34vw,26rem)]"
              style={{ scale: crackScale, opacity: crackOpacity, rotate: crackRotate }}
            />

            <motion.div
              className="intro-core-shell pointer-events-none absolute h-[clamp(16rem,30vw,22rem)] w-[clamp(16rem,30vw,22rem)]"
              style={{ scale: donutScale, rotate: donutRotate, opacity: donutOpacity }}
            />

            <motion.div
              className="intro-core-hole pointer-events-none absolute h-[clamp(5rem,10vw,7.4rem)] w-[clamp(5rem,10vw,7.4rem)]"
              style={{ scale: donutScale, rotate: donutRotate }}
            />

            <motion.div
              className="intro-core-ring pointer-events-none absolute h-[clamp(19rem,36vw,28rem)] w-[clamp(19rem,36vw,28rem)]"
              style={{ scale: donutScale, opacity: crackOpacity }}
            />

            {CRACKS.map((crack, index) => (
              <motion.span
                key={`${crack.top}-${index}`}
                className="pointer-events-none absolute h-px origin-left rounded-full bg-[linear-gradient(90deg,rgba(102,235,255,0.92),rgba(255,201,94,0.62),rgba(255,97,155,0.08))] shadow-[0_0_16px_rgba(105,232,255,0.12)]"
                style={{
                  top: crack.top,
                  left: crack.left,
                  right: crack.right,
                  width: crack.width,
                  rotate: crack.rotate,
                  opacity: crackOpacity,
                  scaleX: crackScale,
                  transformOrigin: "left center",
                }}
              />
            ))}

            <motion.span
              className="pointer-events-none absolute h-[30%] w-px rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0.8),rgba(102,235,255,0.18),transparent)]"
              style={{ opacity: crackOpacity, scaleY: crackScale, rotate: crackRotate }}
            />

            <div className="glass-neon-panel relative flex h-[clamp(6rem,11vw,7.5rem)] w-[clamp(6rem,11vw,7.5rem)] items-center justify-center rounded-full border border-white/[0.08] bg-[rgba(10,7,22,0.78)] backdrop-blur-[14px]">
              <div className="pointer-events-none absolute inset-[16%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_72%)]" />
              <CursorEyes size="md" tint="violet" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.46, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 flex flex-col items-center gap-5"
          >
            <button
              type="button"
              onClick={() => {
                progress.set(1);
                completeIntro();
              }}
              className="intro-minimal-button rounded-full px-8 py-3 font-mono text-[0.58rem] uppercase tracking-[0.38em] text-white/88 transition-transform duration-300 hover:-translate-y-0.5"
            >
              Open Hero
            </button>

            <div className="h-px w-48 overflow-hidden rounded-full bg-white/10 md:w-56">
              <motion.div
                className="h-full origin-left bg-[linear-gradient(90deg,rgba(102,235,255,0.88),rgba(139,255,195,0.82),rgba(255,203,95,0.84),rgba(255,99,157,0.84),rgba(120,129,255,0.86))]"
                style={{ scaleX: meterScale }}
              />
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="pointer-events-none absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 font-mono text-[0.56rem] uppercase tracking-[0.42em] text-white/28 md:bottom-8"
        style={{ opacity: promptOpacity }}
      >
        <span className="h-px w-10 bg-white/10" />
        <span>Scroll to wake the core</span>
        <span className="h-px w-10 bg-white/10" />
      </motion.div>
    </motion.section>
  );
}