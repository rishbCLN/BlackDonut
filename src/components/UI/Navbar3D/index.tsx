import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { NAV_ITEMS } from "./constants";
import useMouseTracking from "./hooks/useMouseTracking";
import useScrollTracking from "./hooks/useScrollTracking";
import { navbarActions, useNavbarStore } from "./hooks/useNavbarStore";
import Canvas3DScene from "./Canvas3DScene";
import NavLink from "./NavLink";

function shouldRender3D() {
  const isMobile = window.innerWidth < 768;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isLowPower = (navigator.hardwareConcurrency ?? 8) <= 4;
  return !isMobile && !prefersReduced && !isLowPower;
}

export default function Navbar3D() {
  useMouseTracking();
  useScrollTracking();

  const scrollProgress = useNavbarStore((s) => s.scrollProgress);
  const scrollVelocity = useNavbarStore((s) => s.scrollVelocity);
  const activeNavIndex = useNavbarStore((s) => s.activeNavIndex);

  const [enable3D, setEnable3D] = useState(false);

  useEffect(() => {
    const update = () => {
      const next = shouldRender3D();
      setEnable3D(next);
      navbarActions.setReducedMotion(!next);
    };

    update();

    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  const mode = useMemo(() => {
    if (scrollProgress < 0.65) return 1;
    if (scrollProgress < 0.85) return 2;
    return 3;
  }, [scrollProgress]);

  const targetHeight = useMemo(() => {
    if (mode === 1) return 80;
    if (mode === 2) return 60;
    return 48;
  }, [mode]);

  const panelClasses = useMemo(() => {
    if (mode === 1) {
      return "border-white/[0.04] bg-white/[0.015] backdrop-blur-md";
    }

    if (mode === 2) {
      return "border-white/[0.06] bg-black/55 backdrop-blur-xl";
    }

    return "border-white/[0.07] bg-black/72 backdrop-blur-2xl";
  }, [mode]);

  const bloomOpacity = useMemo(() => {
    const v = Math.min(1, scrollVelocity / 90);
    return 0.08 + v * 0.12;
  }, [scrollVelocity]);

  const isMode3 = mode === 3;
  const isCtaActive = activeNavIndex === 3;

  return (
    <motion.header
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 60, damping: 20, delay: 1.4 }}
      className="fixed left-0 right-0 top-0 z-[60]"
    >
      <motion.div
        animate={{ height: targetHeight }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <div
          className={`relative h-full overflow-hidden rounded-b-2xl border-b ${panelClasses} transition-colors duration-500`}
          style={{ transformStyle: "preserve-3d" }}
        >
          {enable3D ? <Canvas3DScene /> : null}

          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute left-1/2 top-0 h-[160%] w-[130%] -translate-x-1/2 -translate-y-[35%] bg-[radial-gradient(circle_at_center,var(--color-cyan),transparent_60%)]"
              style={{ opacity: bloomOpacity }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_60%)]" />
          </div>

          <div className="relative mx-auto flex h-full max-w-6xl items-center justify-between px-6">
            <div className="font-sans text-[0.78rem] font-bold tracking-[0.22em] text-white/60">BD</div>

            <nav className={isMode3 ? "hidden items-center gap-7 md:flex text-white/70" : "hidden items-center gap-7 md:flex"}>
              {NAV_ITEMS.map((label, index) => (
                <NavLink key={label} label={label} index={index} />
              ))}
            </nav>

            <motion.a
              href="#contact"
              className="relative overflow-hidden rounded-full border border-white/[0.12] bg-white/[0.05] px-5 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-white/60 backdrop-blur-md transition-colors duration-300 hover:bg-white/[0.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/30"
              onPointerEnter={() => navbarActions.setHoveredNavIndex(3)}
              onPointerLeave={() => navbarActions.setHoveredNavIndex(-1)}
              whileHover={{ scale: 1.03, y: -2, rotateX: -5 }}
              whileTap={{ scale: 0.98 }}
              style={{ perspective: 700 }}
            >
              <span className="relative z-10">Let's Talk</span>

              <span
                className={
                  isCtaActive
                    ? "pointer-events-none absolute inset-0 rounded-full"
                    : "pointer-events-none absolute inset-0 rounded-full"
                }
                style={{
                  boxShadow: isCtaActive
                    ? "0 0 20px rgba(0,255,255,0.30), 0 0 40px rgba(0,255,255,0.15)"
                    : undefined,
                }}
                aria-hidden="true"
              />

              <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 right-full -mr-1"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <span
                  className={
                    isCtaActive
                      ? "block h-4 w-4 -translate-y-1/2 animate-orbit-accent-fast"
                      : "block h-4 w-4 -translate-y-1/2 animate-orbit-accent"
                  }
                  style={{ transformOrigin: "50% 50%" }}
                >
                  <span className="block h-0.5 w-0.5 translate-x-[10px] rounded-full bg-brand-cyan/80" />
                </span>
              </motion.span>
            </motion.a>
          </div>
        </div>

        <div className="pointer-events-none absolute left-0 right-0 top-full h-10 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.015),transparent)]" />
      </motion.div>
    </motion.header>
  );
}
