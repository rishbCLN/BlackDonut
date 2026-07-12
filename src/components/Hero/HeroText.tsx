import { motion } from "framer-motion";
import CursorEyes from "../UI/CursorEyes";

const TITLE_ROWS = [
  { prefix: "Give the brand", accent: null, suffix: "" },
  { prefix: "a", accent: "pulse", suffix: "you can see." },
] as const;

const CAPABILITIES = ["Heat-map color", "3D motion", "Launch systems", "Cursor-aware detail"] as const;

const SIGNAL_NOTES = [
  {
    label: "Design systems",
    body: "Type, pacing, and composition tuned to land like a headline instead of a brochure.",
  },
  {
    label: "Motion surfaces",
    body: "Scroll-choreographed scenes with layered reveals, spatial depth, and cleaner light control.",
  },
  {
    label: "Launch pressure",
    body: "Built in React, Three.js, and motion tooling that can survive a real launch window.",
  },
] as const;

const shellVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.14 },
  },
};

const lineVariants = {
  hidden: { opacity: 0, y: 54, filter: "blur(18px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

const bodyVariants = {
  hidden: { opacity: 0, y: 24, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, delay: 0.28, ease: [0.22, 1, 0.36, 1] },
  },
};

const chipRowVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.62, delay: 0.48, staggerChildren: 0.05, ease: [0.22, 1, 0.36, 1] },
  },
};

const chipVariants = {
  hidden: { opacity: 0, y: 10, filter: "blur(5px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

const ctaVariants = {
  hidden: { opacity: 0, y: 18, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.62, delay: 0.64, ease: [0.22, 1, 0.36, 1] },
  },
};

const cardVariants = {
  hidden: { opacity: 0, x: 28, y: 20, filter: "blur(14px)" },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, delay: 0.32, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function HeroText() {
  return (
    <div className="relative mx-auto flex h-full w-full max-w-[96rem] flex-col justify-between px-6 pb-20 pt-6 md:px-10 md:pb-[5.5rem] md:pt-7 lg:px-14 lg:pb-[6.25rem]">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.08 }}
        className="flex items-center justify-between gap-4"
      >
        <div className="inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 backdrop-blur-xl">
          <span className="hero-kicker-dot" />
          <span className="font-mono text-[0.54rem] uppercase tracking-[0.38em] text-white/58 md:text-[0.58rem]">
            Black Donut // radiant web systems
          </span>
        </div>

        <div className="hidden items-center gap-3 rounded-full border border-white/[0.08] bg-black/25 px-4 py-2 backdrop-blur-xl md:inline-flex">
          <span className="h-2 w-2 rounded-full bg-[#8affb8] shadow-[0_0_12px_rgba(138,255,184,0.9)]" />
          <span className="font-mono text-[0.52rem] uppercase tracking-[0.34em] text-white/46">Scroll-reactive live build</span>
        </div>
      </motion.div>

      <div className="grid flex-1 items-start gap-6 pt-4 md:grid-cols-[minmax(0,1.04fr)_minmax(16rem,20rem)] md:gap-7 md:pt-5 lg:grid-cols-[minmax(0,1.08fr)_minmax(19rem,24rem)] lg:gap-12 lg:pt-6">
        <motion.div variants={shellVariants} initial="hidden" animate="visible" className="max-w-5xl">
          <div className="hero-copy-haze pointer-events-none absolute left-[-10%] top-[14%] hidden h-[34rem] w-[44rem] lg:block" />

          <div className="relative z-10">
            {TITLE_ROWS.map((row) => (
              <div key={`${row.prefix}-${row.accent ?? "none"}-${row.suffix}`} className="overflow-hidden">
                <motion.h1
                  variants={lineVariants}
                  className="font-speed text-[clamp(2.9rem,7.4vw,6.9rem)] font-black italic uppercase leading-[1.05] tracking-[-0.02em] text-white"
                  style={{ textShadow: "0 0 44px rgba(255,255,255,0.06), 0 0 90px rgba(67,210,255,0.08)" }}
                >
                  {row.prefix}
                  {row.accent ? <span className="hero-gradient-word ml-[0.24em] inline-block">{row.accent}</span> : null}
                  {row.suffix ? <span className="ml-[0.24em] inline-block">{row.suffix}</span> : null}
                </motion.h1>
              </div>
            ))}

            <motion.p
              variants={bodyVariants}
              className="mt-6 max-w-xl text-[0.92rem] leading-[1.82] tracking-[0.08em] text-white/64 md:text-[0.98rem] lg:mt-7"
            >
              We build launch sites, visual systems, and motion-heavy digital surfaces that feel cinematic, expensive, and impossible to scroll past.
            </motion.p>

            <motion.div variants={chipRowVariants} className="mt-7 flex flex-wrap gap-3 lg:mt-8">
              {CAPABILITIES.map((capability) => (
                <motion.span
                  key={capability}
                  variants={chipVariants}
                  className="hero-chip inline-flex items-center rounded-full border border-white/[0.1] px-4 py-2 font-mono text-[0.52rem] uppercase tracking-[0.3em] text-white/62"
                >
                  {capability}
                </motion.span>
              ))}
            </motion.div>

            <motion.div variants={ctaVariants} className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center lg:mt-9">
              <motion.a
                href="mailto:hello@blackdonut.io"
                whileHover={{ y: -2, scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                className="hero-primary-cta inline-flex items-center rounded-full px-7 py-3 font-mono text-[0.6rem] uppercase tracking-[0.34em] text-[#050510]"
              >
                Start a Project
              </motion.a>

              <div className="flex items-center gap-3 text-white/40">
                <span className="h-px w-10 bg-white/12" />
                <a href="mailto:hello@blackdonut.io" className="font-mono text-[0.56rem] uppercase tracking-[0.3em] text-white/40 transition-colors duration-300 hover:text-white/72">
                  hello@blackdonut.io
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.aside variants={cardVariants} initial="hidden" animate="visible" className="hero-floating-card relative overflow-hidden rounded-[2rem] p-5 md:p-5 lg:p-7">
          <div className="hero-card-sheen pointer-events-none absolute inset-0" />

          <div className="relative z-10 flex h-full flex-col gap-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-mono text-[0.52rem] uppercase tracking-[0.34em] text-white/38">Signal stack</div>
                <h2 className="mt-3 max-w-[15rem] text-[1.16rem] font-semibold uppercase leading-[1.02] tracking-[-0.03em] text-white/92 lg:max-w-[16rem] lg:text-[1.38rem]">
                  Midnight chrome. Rainbow heat. Clear signal.
                </h2>
              </div>

              <CursorEyes size="sm" tint="cyan" className="shrink-0" />
            </div>

            <div className="space-y-3">
              {SIGNAL_NOTES.map((note, index) => (
                <div key={note.label} className="rounded-[1.4rem] border border-white/[0.08] bg-white/[0.035] px-4 py-4 backdrop-blur-xl">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[0.48rem] uppercase tracking-[0.3em] text-white/26">0{index + 1}</span>
                    <span className="font-mono text-[0.5rem] uppercase tracking-[0.3em] text-white/44">{note.label}</span>
                  </div>
                  <p className="mt-3 text-[0.76rem] leading-[1.8] text-white/56">{note.body}</p>
                </div>
              ))}
            </div>

            <div className="rounded-[1.5rem] border border-white/[0.08] bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] px-5 py-5">
              <div className="font-mono text-[0.48rem] uppercase tracking-[0.32em] text-white/28">Current tone</div>
              <p className="mt-3 text-[0.84rem] leading-[1.85] text-white/64">
                Enough glow to feel electric. Enough discipline to still look premium.
              </p>
            </div>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}
