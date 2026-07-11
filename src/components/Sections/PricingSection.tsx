import { motion } from "framer-motion";
import CursorEyes from "../UI/CursorEyes";

const TIERS = [
  {
    name: "STARTER",
    subtitle: "For brands taking shape",
    price: "From $2,000",
    features: ["Brand identity system", "5-page marketing website", "Responsive for all devices", "2 revision rounds", "1-month post-launch support"],
    highlight: false,
    badge: null,
    accent: "#d9d5ef",
  },
  {
    name: "STUDIO",
    subtitle: "For ambitious scale-ups",
    price: "From $6,000",
    features: ["Full brand identity system", "Custom website (unlimited pages)", "Motion design & micro-interactions", "Product/app UI design", "4 revision rounds", "3-month post-launch support"],
    highlight: true,
    badge: "RECOMMENDED",
    accent: "#7ef2ff",
  },
  {
    name: "BESPOKE",
    subtitle: "For exactly what you need",
    price: "Custom",
    features: ["Everything in Studio", "Full-stack product engineering", "Dedicated project team", "Ongoing retainer available", "NDAs and IP assignment", "Direct line to founding team"],
    highlight: false,
    badge: null,
    accent: "#ff76cf",
  },
];

interface PricingSectionProps {
  onNavigate?: (index: number) => void;
}

export default function PricingSection({ onNavigate }: PricingSectionProps) {
  return (
    <section id="pricing" className="relative overflow-hidden bg-transparent text-white">
      <div className="violet-speckles pointer-events-none absolute inset-0 opacity-64" />
      <div className="section-spectrum-backdrop pointer-events-none absolute inset-[-16%] opacity-92" />
      <div className="soft-wave-ribbon pointer-events-none absolute right-[-14%] bottom-[12%] h-[20rem] w-[42rem] rotate-[20deg] opacity-55 md:h-[26rem] md:w-[54rem]" style={{ background: "linear-gradient(120deg, rgba(126,242,255,0.04) 0%, rgba(183,124,255,0.24) 46%, rgba(255,118,207,0.06) 100%)" }} />
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
              Investment // choose the depth
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.82, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 font-speed text-[clamp(3rem,7.8vw,6.2rem)] font-black italic uppercase leading-[0.9] tracking-[-0.05em] text-white/95"
            >
              Choose the path
              <br />
              that fits the <span className="hero-gradient-word">build.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.66, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 max-w-2xl text-[0.94rem] leading-[1.9] tracking-[0.08em] text-white/56"
            >
              No bloated packages, no fake complexity. These are starting points built around ambition, technical depth, and how much motion language you want the project to carry.
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
                <div className="font-mono text-[0.5rem] uppercase tracking-[0.34em] text-[#bfefff]/74">Eyes on fit</div>
                <p className="mt-2 text-[0.78rem] leading-[1.75] text-white/52">
                  We scope by what the brand actually needs, not by how many line items make a proposal look larger.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {TIERS.map((tier, index) => (
            <motion.article
              key={tier.name}
              initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{ duration: 0.72, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={`section-glass-card relative overflow-hidden rounded-[1.85rem] p-7 ${tier.highlight ? "border-white/[0.14]" : ""}`}
            >
              {tier.highlight ? <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(126,242,255,0.08),rgba(183,124,255,0.12),transparent_72%)]" /> : null}

              <div className="relative flex h-full flex-col">
                {tier.badge ? (
                  <span className="section-pill self-start text-[#bfefff]">{tier.badge}</span>
                ) : null}

                <div className="mt-4 font-mono text-[0.54rem] uppercase tracking-[0.4em] text-white/32">{tier.name}</div>
                <div className="mt-2 text-[0.78rem] text-white/42">{tier.subtitle}</div>

                <div className="mt-8 border-t border-white/[0.06] pt-6">
                  <div className="text-[clamp(1.8rem,3vw,2.8rem)] font-black uppercase leading-none tracking-[-0.04em] text-white/96">
                    {tier.price}
                  </div>
                </div>

                <ul className="mt-6 flex-1 space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-[0.78rem] leading-[1.7] text-white/54">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full" style={{ backgroundColor: tier.accent }} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => onNavigate?.(6)}
                  className={`mt-8 rounded-full border px-5 py-3 text-center font-mono text-[0.58rem] uppercase tracking-[0.3em] transition-colors duration-300 ${
                    tier.highlight
                      ? "border-[#7ef2ff]/28 bg-[linear-gradient(135deg,rgba(126,242,255,0.1),rgba(183,124,255,0.14),rgba(255,118,207,0.08))] text-white/88 hover:border-[#bfefff]/38"
                      : "border-white/[0.1] bg-white/[0.03] text-white/62 hover:text-white/88"
                  }`}
                >
                  {tier.name === "BESPOKE" ? "Let's talk" : "Get started"}
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
 
