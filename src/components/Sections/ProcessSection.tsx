import { motion } from "framer-motion";
import CursorEyes from "../UI/CursorEyes";

const STEPS = [
  {
    number: "01",
    phase: "DISCOVER",
    title: "We Learn Your World",
    body: "Deep dives into your brand, audience, and goals. We ask the uncomfortable questions first so the final file never has to. Research, audits, competitor analysis \u2014 and a lot of listening.",
    duration: "1\u20132 weeks",
  },
  {
    number: "02",
    phase: "DESIGN",
    title: "Vision Before Pixels",
    body: "Wireframes, prototypes, motion references. We concept fast and refine even faster. You see progress in days, not months. Every decision is justified against the brief.",
    duration: "2\u20134 weeks",
  },
  {
    number: "03",
    phase: "BUILD",
    title: "Code as Craft",
    body: "We engineer with intent. Every component, every shader, every transition \u2014 designed to perform at scale and age gracefully. No shortcuts that bite you six months later.",
    duration: "4\u20138 weeks",
  },
  {
    number: "04",
    phase: "LAUNCH",
    title: "Ship with Confidence",
    body: "QA across real devices. Performance budgets hit. Analytics wired. We don\u2019t hand off a URL and disappear \u2014 we establish a relationship and stay accountable post-launch.",
    duration: "1 week",
  },
];

export default function ProcessSection() {
  return (
    <section id="process" className="relative overflow-hidden bg-transparent text-white">
      <div className="violet-speckles pointer-events-none absolute inset-0 opacity-64" />
      <div className="section-spectrum-backdrop pointer-events-none absolute inset-[-14%] opacity-92" />
      <div className="soft-wave-ribbon pointer-events-none absolute left-[-10%] bottom-[12%] h-[18rem] w-[38rem] rotate-[12deg] opacity-55 md:h-[24rem] md:w-[54rem]" style={{ background: "linear-gradient(120deg, rgba(126,242,255,0.04) 0%, rgba(183,124,255,0.22) 48%, rgba(255,118,207,0.06) 100%)" }} />
      <div className="flow-contour pointer-events-none absolute inset-x-[6%] bottom-[12%] top-[12%] opacity-[0.1]" />
      <div className="section-grid-overlay pointer-events-none absolute inset-0 opacity-[0.08]" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-between px-6 py-24 md:px-10 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.08fr)_22rem] lg:items-end">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.45 }}
              className="font-mono text-[0.56rem] uppercase tracking-[0.42em] text-[#c8b8ff]/62"
            >
              Process // no dead air
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.82, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 font-speed text-[clamp(3rem,7.8vw,6.2rem)] font-black italic uppercase leading-[0.9] tracking-[-0.05em] text-white/95"
            >
              A process that
              <br />
              keeps its <span className="hero-gradient-word">pulse.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.66, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 max-w-2xl text-[0.94rem] leading-[1.9] tracking-[0.08em] text-white/56"
            >
              The work moves in deliberate phases, but it never feels like a slow handoff chain. Strategy, design, and engineering keep feeding each other until launch.
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
                <div className="font-mono text-[0.5rem] uppercase tracking-[0.34em] text-[#bfefff]/74">Eyes on momentum</div>
                <p className="mt-2 text-[0.78rem] leading-[1.75] text-white/52">
                  Clear checkpoints, fast feedback loops, and enough overlap between disciplines that nothing stalls waiting for the next team.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="relative mt-14 grid gap-4 lg:grid-cols-2">
          <div className="pointer-events-none absolute left-1/2 top-8 hidden h-[calc(100%-4rem)] w-px -translate-x-1/2 bg-gradient-to-b from-[#7ef2ff]/18 via-[#b77cff]/24 to-transparent lg:block" />

          {STEPS.map((step, index) => (
            <motion.article
              key={step.number}
              initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{ duration: 0.72, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="section-glass-card relative overflow-hidden rounded-[1.8rem] p-6 md:p-7"
            >
              <div className="pointer-events-none absolute right-5 top-5 font-mono text-[0.44rem] uppercase tracking-[0.32em] text-white/14">{step.number}</div>

              <div className="flex items-start justify-between gap-4">
                <span className="section-pill text-[#c8b8ff]/74">{step.phase}</span>
                <span className="font-mono text-[0.48rem] uppercase tracking-[0.26em] text-white/24">{step.duration}</span>
              </div>

              <h3 className="mt-6 text-[clamp(1.45rem,2.6vw,2.3rem)] font-black uppercase leading-[0.98] tracking-[-0.03em] text-white/94">
                {step.title}
              </h3>
              <p className="mt-4 text-[0.82rem] leading-[1.88] text-white/52">{step.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
 
