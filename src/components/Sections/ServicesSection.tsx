import { motion } from "framer-motion";
import CursorEyes from "../UI/CursorEyes";

const SERVICES = [
  {
    number: "01",
    title: "Experience Systems",
    body: "Marketing sites and launch surfaces with fluid motion, strong rhythm, and enough restraint to feel premium instead of noisy.",
    tags: ["Brand sites", "3D motion", "Performance"],
    stat: "40+",
    statLabel: "launches shipped",
    accent: "#7ef2ff",
  },
  {
    number: "02",
    title: "Identity In Motion",
    body: "Visual systems that carry the same signal across decks, product UI, social cuts, and the main site without losing coherence.",
    tags: ["Strategy", "Type systems", "Motion language"],
    stat: "25+",
    statLabel: "brands shaped",
    accent: "#b77cff",
  },
  {
    number: "03",
    title: "Digital Products",
    body: "Interfaces, apps, and internal tools engineered with the same craft as the public-facing brand so nothing feels bolted on later.",
    tags: ["Product UX", "React", "Full-stack"],
    stat: "12+",
    statLabel: "products launched",
    accent: "#ff76cf",
  },
] as const;

const NOTES = [
  { label: "Response", value: "< 24h" },
  { label: "Current load", value: "03 active builds" },
  { label: "Stack", value: "React, Three.js, motion" },
] as const;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 28, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.68, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function ServicesSection() {
  return (
    <section id="services" className="relative overflow-hidden bg-transparent text-white">
      <div className="violet-speckles pointer-events-none absolute inset-0 opacity-70" />
      <div className="section-spectrum-backdrop pointer-events-none absolute inset-[-14%] opacity-95" />
      <div className="soft-wave-ribbon pointer-events-none absolute left-[-14%] top-[18%] h-[19rem] w-[32rem] -rotate-[18deg] opacity-70 md:h-[22rem] md:w-[44rem]" style={{ background: "linear-gradient(120deg, rgba(126,242,255,0.05) 0%, rgba(183,124,255,0.24) 50%, rgba(255,118,207,0.08) 100%)" }} />
      <div className="soft-wave-ribbon pointer-events-none absolute bottom-[10%] right-[-12%] h-[18rem] w-[34rem] rotate-[18deg] opacity-60 md:h-[24rem] md:w-[48rem]" style={{ background: "linear-gradient(120deg, rgba(255,118,207,0.06) 0%, rgba(183,124,255,0.22) 46%, rgba(126,242,255,0.04) 100%)" }} />
      <div className="flow-contour pointer-events-none absolute inset-x-[4%] bottom-[12%] top-[10%] opacity-[0.12]" />
      <div className="section-grid-overlay pointer-events-none absolute inset-0 opacity-[0.12]" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-between px-6 py-24 md:px-10 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.12fr)_minmax(18rem,0.88fr)] lg:items-end">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.48 }}
              className="font-mono text-[0.56rem] uppercase tracking-[0.42em] text-[#c8b8ff]/62"
            >
              Services // soft retrowave output
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.82, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 max-w-4xl font-speed text-[clamp(3.2rem,8vw,6.6rem)] font-black italic uppercase leading-[0.9] tracking-[-0.05em] text-white/95"
              style={{ textShadow: "0 0 34px rgba(183,124,255,0.2)" }}
            >
              What we shape
              <br />
              after the <span className="hero-gradient-word">signal</span> lands.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.68, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 max-w-2xl text-[0.94rem] leading-[1.9] tracking-[0.08em] text-white/58 md:text-[1rem]"
            >
              We design brand worlds, premium websites, and digital products that feel alive without tipping into gimmick. Motion stays soft, typography stays intentional, and the interface always serves the story.
            </motion.p>
          </div>

          <motion.aside
            initial={{ opacity: 0, y: 20, filter: "blur(12px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.72, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="section-glass-card section-signal-panel rounded-[1.85rem] p-6"
          >
            <div className="flex items-center gap-4">
              <CursorEyes size="sm" tint="violet" />
              <div>
                <div className="font-mono text-[0.54rem] uppercase tracking-[0.36em] text-[#cbbaff]/70">Alive interfaces</div>
                <p className="mt-2 text-[0.78rem] leading-[1.75] text-white/52">
                  Cursor-aware details, softer motion curves, and readable interaction points so the site feels attentive instead of decorative.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {NOTES.map((note) => (
                <div key={note.label} className="rounded-[1.25rem] border border-white/[0.08] bg-white/[0.03] px-4 py-4">
                  <div className="font-mono text-[0.46rem] uppercase tracking-[0.3em] text-white/28">{note.label}</div>
                  <div className="mt-2 text-[0.78rem] uppercase tracking-[0.16em] text-white/76">{note.value}</div>
                </div>
              ))}
            </div>
          </motion.aside>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.12 }}
          className="mt-14 grid gap-4 lg:grid-cols-3"
        >
          {SERVICES.map((service) => (
            <motion.article
              key={service.number}
              variants={item}
              className="section-glass-card group overflow-hidden rounded-[1.85rem] p-6 md:p-7"
            >
              <div className="pointer-events-none absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent transition-transform duration-700 group-hover:translate-x-[100%]" />

              <div className="relative flex h-full flex-col justify-between gap-8">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <span className="font-mono text-[0.52rem] uppercase tracking-[0.38em] text-white/36">{service.number}</span>
                    <span className="text-[clamp(2rem,3vw,3rem)] font-black uppercase leading-none" style={{ color: service.accent }}>
                      {service.stat}
                    </span>
                  </div>

                  <h3 className="mt-6 text-[clamp(1.35rem,2.2vw,1.9rem)] font-black uppercase leading-[1.02] tracking-[-0.03em] text-white/94">
                    {service.title}
                  </h3>
                  <p className="mt-4 text-[0.82rem] leading-[1.9] text-white/52">{service.body}</p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-2">
                    {service.tags.map((tag) => (
                      <span key={tag} className="section-pill text-white/48">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 border-t border-white/[0.06] pt-4 font-mono text-[0.5rem] uppercase tracking-[0.3em] text-white/28">
                    {service.statLabel}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
