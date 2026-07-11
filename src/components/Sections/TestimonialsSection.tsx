import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import CursorEyes from "../UI/CursorEyes";

const TESTIMONIALS = [
  {
    rating: "5 / 5",
    quote:
      "They turned a vague brief into the most coherent brand we\u2019ve ever had. The site makes us look like we have 50 people when we have 5.",
    name: "RAHUL S.",
    role: "CEO, Terraki",
    initials: "RS",
  },
  {
    rating: "5 / 5",
    quote:
      "The animations are the first thing every investor mentions in pitch meetings. It signals craft without us saying a single word.",
    name: "PRIYA K.",
    role: "Founder, Nova Fintech",
    initials: "PK",
  },
  {
    rating: "5 / 5",
    quote:
      "BlackDonut understood our product better than our previous two agencies combined \u2014 and shipped it in half the time. Zero hand-holding needed.",
    name: "AKASH M.",
    role: "CTO, Lume",
    initials: "AM",
  },
  {
    rating: "4.5 / 5",
    quote:
      "Working with BlackDonut is what building a startup website should feel like. Fast, opinionated, and impossibly well-made. Would do it again, and we did.",
    name: "ZARA L.",
    role: "Head of Brand, Petal",
    initials: "ZL",
  },
  {
    rating: "5 / 5",
    quote:
      "I\u2019ve never seen a team care this much about the details. They pushed back on two of our ideas and were right both times. That\u2019s the kind of partner you need.",
    name: "DEV P.",
    role: "Co-founder, Archway",
    initials: "DP",
  },
];

export default function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const total = TESTIMONIALS.length;
  const t = TESTIMONIALS[active];

  const prev = () => setActive((a) => (a - 1 + total) % total);
  const next = () => setActive((a) => (a + 1) % total);

  return (
    <section id="testimonials" className="relative overflow-hidden bg-transparent text-white">
      <div className="violet-speckles pointer-events-none absolute inset-0 opacity-68" />
      <div className="section-spectrum-backdrop pointer-events-none absolute inset-[-16%] opacity-92" />
      <div className="retrowave-halo pointer-events-none absolute left-1/2 top-[68%] h-[24rem] w-[56rem] max-w-[96vw] -translate-x-1/2 opacity-52" />
      <div className="flow-contour pointer-events-none absolute inset-x-[6%] bottom-[12%] top-[12%] opacity-[0.1]" />
      <div className="section-grid-overlay pointer-events-none absolute inset-0 opacity-[0.08]" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-between px-6 py-24 md:px-10 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.06fr)_22rem] lg:items-end">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.45 }}
              className="font-mono text-[0.56rem] uppercase tracking-[0.42em] text-[#c8b8ff]/62"
            >
              Testimonials // the afterglow
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.82, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 font-speed text-[clamp(3rem,7.8vw,6.2rem)] font-black italic uppercase leading-[0.9] tracking-[-0.05em] text-white/95"
            >
              What the
              <br />
              <span className="hero-gradient-word">afterglow</span> sounds like.
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18, filter: "blur(12px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.72, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="section-glass-card section-glass-card--translucent section-signal-panel rounded-[1.8rem] p-6"
          >
            <div className="flex items-center gap-4">
              <CursorEyes size="sm" tint="rose" />
              <div>
                <div className="font-mono text-[0.5rem] uppercase tracking-[0.34em] text-[#ffd0e8]/72">Eyes on the details</div>
                <p className="mt-2 text-[0.78rem] leading-[1.75] text-white/52">
                  The reactions are consistent: strong craft, clean pacing, and visuals that feel premium instead of inflated.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-stretch">
          <div className="section-glass-card section-glass-card--translucent overflow-hidden rounded-[1.9rem] p-8 md:p-10 lg:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 26, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -18, filter: "blur(6px)" }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <span key={index} className="h-1.5 w-1.5 rounded-full bg-[#7ef2ff]/75" />
                    ))}
                  </div>
                  <span className="font-mono text-[0.48rem] uppercase tracking-[0.3em] text-[#bfefff]/68">{t.rating}</span>
                </div>

                <p className="mt-8 text-[clamp(1.18rem,2.2vw,2rem)] leading-[1.7] text-white/84">
                  “{t.quote}”
                </p>

                <div className="mt-10 flex items-center gap-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.04] font-mono text-[0.54rem] uppercase tracking-[0.28em] text-white/58">
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-mono text-[0.54rem] uppercase tracking-[0.3em] text-white/66">{t.name}</div>
                    <div className="mt-1 text-[0.78rem] text-white/36">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex h-full flex-col gap-4">
            {TESTIMONIALS.map((testimonial, index) => (
              <button
                key={`${testimonial.name}-${index}`}
                type="button"
                onClick={() => setActive(index)}
                className={`section-glass-card section-glass-card--translucent rounded-[1.4rem] px-5 py-4 text-left transition-colors duration-300 ${
                  index === active ? "border-white/[0.16] bg-[linear-gradient(180deg,rgba(26,16,46,0.62),rgba(9,6,18,0.74))]" : "hover:border-white/[0.12]"
                }`}
              >
                <div className="font-mono text-[0.44rem] uppercase tracking-[0.32em] text-white/24">{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</div>
                <div className="mt-3 text-[0.88rem] uppercase tracking-[0.16em] text-white/82">{testimonial.name}</div>
                <div className="mt-1 text-[0.72rem] leading-[1.6] text-white/36">{testimonial.role}</div>
              </button>
            ))}

            <div className="section-glass-card section-glass-card--translucent mt-auto flex items-center justify-between rounded-[1.4rem] px-5 py-4">
              <div className="font-mono text-[0.48rem] uppercase tracking-[0.32em] text-white/28">{String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</div>
              <div className="flex gap-3">
                <button type="button" onClick={prev} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.1] text-white/48 transition-colors duration-300 hover:border-white/[0.24] hover:text-white/82">←</button>
                <button type="button" onClick={next} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.1] text-white/48 transition-colors duration-300 hover:border-white/[0.24] hover:text-white/82">→</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
 
