import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import CursorEyes from "../UI/CursorEyes";

// ─── animated counter ─────────────────────────────────────────────────────────
function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref       = useRef<HTMLSpanElement>(null);
  const motionVal = useMotionValue(0);
  const spring    = useSpring(motionVal, { stiffness: 50, damping: 16, mass: 0.7 });
  const inView    = useInView(ref as RefObject<Element>, { once: true });

  useEffect(() => {
    if (inView) motionVal.set(value);
  }, [inView, motionVal, value]);

  useEffect(() => {
    return spring.on("change", (v) => {
      if (ref.current) ref.current.textContent = `${Math.round(v)}${suffix}`;
    });
  }, [spring, suffix]);

  return <span ref={ref}>{0}{suffix}</span>;
}

const STATS = [
  { value: 50, suffix: "+", label: "PROJECTS\nDELIVERED", sub: "Across 12 industries", color: "rgba(126,242,255,0.08)" },
  { value: 30, suffix: "+", label: "CLIENTS\nWORLDWIDE", sub: "Seed to Series B", color: "rgba(183,124,255,0.08)" },
  { value: 4, suffix: " YRS", label: "IN\nOPERATION", sub: "Est. 2020, Bengaluru", color: "rgba(255,118,207,0.06)" },
  { value: 98, suffix: "%", label: "CLIENT\nSATISFACTION", sub: "Based on project reviews", color: "rgba(183,124,255,0.06)" },
];

export default function StatsSection() {
  return (
    <section id="impact" className="relative overflow-hidden bg-transparent text-white">
      <div className="violet-speckles pointer-events-none absolute inset-0 opacity-68" />
      <div className="section-spectrum-backdrop pointer-events-none absolute inset-[-16%] opacity-92" />
      <div className="retrowave-halo pointer-events-none absolute left-1/2 top-[66%] h-[24rem] w-[56rem] max-w-[96vw] -translate-x-1/2 opacity-50" />
      <div className="soft-wave-ribbon pointer-events-none absolute left-[-10%] top-[18%] h-[18rem] w-[36rem] -rotate-[16deg] opacity-55 md:h-[24rem] md:w-[52rem]" style={{ background: "linear-gradient(120deg, rgba(126,242,255,0.04) 0%, rgba(183,124,255,0.24) 46%, rgba(255,118,207,0.08) 100%)" }} />
      <div className="flow-contour pointer-events-none absolute inset-x-[6%] bottom-[12%] top-[12%] opacity-[0.12]" />
      <div className="section-grid-overlay pointer-events-none absolute inset-0 opacity-[0.1]" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-between px-6 py-24 md:px-10 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.12fr)_22rem] lg:items-end">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.45 }}
              className="font-mono text-[0.56rem] uppercase tracking-[0.42em] text-[#c8b8ff]/62"
            >
              Impact // proof in motion
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.82, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 max-w-4xl font-speed text-[clamp(3rem,7.8vw,6.4rem)] font-black italic uppercase leading-[0.9] tracking-[-0.05em] text-white/95"
            >
              Proof that the
              <br />
              <span className="hero-gradient-word">signal</span> lands.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.66, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 max-w-2xl text-[0.94rem] leading-[1.9] tracking-[0.08em] text-white/56"
            >
              These numbers are not decorative. They come from shipped launches, longer retainers, and clients who come back because the work keeps paying off after the first impression.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18, filter: "blur(12px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.72, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="section-glass-card section-signal-panel rounded-[1.8rem] p-6"
          >
            <div className="flex items-center gap-4">
              <CursorEyes size="sm" tint="cyan" />
              <div>
                <div className="font-mono text-[0.5rem] uppercase tracking-[0.34em] text-[#bfefff]/74">Eyes on outcomes</div>
                <p className="mt-2 text-[0.78rem] leading-[1.75] text-white/52">
                  We measure the work by clarity, conversion, speed, and how much stronger the brand feels once the site is live.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {STATS.map((stat, index) => (
            <motion.article
              key={stat.label}
              initial={{ opacity: 0, y: 32, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="section-glass-card group relative overflow-hidden rounded-[1.8rem] p-6 md:p-7"
              style={{ backgroundColor: stat.color }}
            >
              <div className="pointer-events-none absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent transition-transform duration-700 group-hover:translate-x-[100%]" />
              <div className="absolute right-5 top-5 font-mono text-[0.44rem] uppercase tracking-[0.3em] text-white/16">{String(index + 1).padStart(2, "0")}</div>

              <div className="relative text-[clamp(2.5rem,5vw,4.4rem)] font-black leading-none tracking-[-0.04em] text-white/96">
                <Counter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="relative mt-4 whitespace-pre-line font-mono text-[0.5rem] uppercase leading-[1.9] tracking-[0.34em] text-white/34">
                {stat.label}
              </div>
              <div className="relative mt-3 text-[0.72rem] leading-[1.7] text-white/48">{stat.sub}</div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

