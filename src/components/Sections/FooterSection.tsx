import { motion } from "framer-motion";
import CursorEyes from "../UI/CursorEyes";

const CONTACT_LINKS = [
  { label: "Email",    value: "hello@blackdonut.io",   href: "mailto:hello@blackdonut.io" },
  { label: "Phone",    value: "+91 98765 43210",        href: "tel:+919876543210" },
  { label: "Location", value: "Bengaluru, India",        href: "#" },
];

const SOCIALS = [
  { label: "Instagram", href: "#" },
  { label: "X / Twitter", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "GitHub", href: "#" },
];

const NAV_LINKS = [
  { label: "Services", index: 0 },
  { label: "Work", index: 2 },
  { label: "Process", index: 3 },
  { label: "Pricing", index: 5 },
];

interface FooterSectionProps {
  onNavigate?: (index: number) => void;
}

export default function FooterSection({ onNavigate }: FooterSectionProps) {
  return (
    <footer id="contact" className="relative overflow-hidden bg-transparent text-white">
      <div className="violet-speckles pointer-events-none absolute inset-0 opacity-66" />
      <div className="section-spectrum-backdrop pointer-events-none absolute inset-[-16%] opacity-94" />
      <div className="retrowave-halo pointer-events-none absolute left-1/2 top-[60%] h-[26rem] w-[62rem] max-w-[98vw] -translate-x-1/2 opacity-56" />
      <div className="flow-contour pointer-events-none absolute inset-x-[6%] bottom-[12%] top-[12%] opacity-[0.1]" />
      <div className="section-grid-overlay pointer-events-none absolute inset-0 opacity-[0.08]" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-between px-6 py-24 md:px-10 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.04fr)_minmax(18rem,0.96fr)] lg:items-end">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.45 }}
              className="font-mono text-[0.56rem] uppercase tracking-[0.42em] text-[#c8b8ff]/62"
            >
              Contact // let the signal land
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.82, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 font-speed text-[clamp(2.9rem,7.8vw,6.1rem)] font-black italic uppercase leading-[0.9] tracking-[-0.05em] text-white/95"
            >
              You felt the world.
              <br />
              Now let's build <span className="hero-gradient-word">yours.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.66, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 max-w-2xl text-[0.94rem] leading-[1.9] tracking-[0.08em] text-white/56"
            >
              If you want a site, product, or identity system with the same soft-retrowave confidence, send the brief. We'll shape the signal from there.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <a
                href="mailto:hello@blackdonut.io"
                className="inline-flex items-center gap-3 rounded-full border border-[#7ef2ff]/28 bg-[linear-gradient(135deg,rgba(126,242,255,0.1),rgba(183,124,255,0.16),rgba(255,118,207,0.08))] px-8 py-4 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-white/90 transition-colors duration-300 hover:border-[#bfefff]/42"
              >
                Start a project
              </a>
              <button
                type="button"
                onClick={() => onNavigate?.(2)}
                className="inline-flex items-center gap-3 rounded-full border border-white/[0.1] bg-white/[0.03] px-8 py-4 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-white/58 transition-colors duration-300 hover:text-white/86"
              >
                See our work
              </button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18, filter: "blur(12px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.72, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="section-glass-card section-signal-panel rounded-[1.9rem] p-6"
          >
            <div className="flex items-center gap-4">
              <CursorEyes size="md" tint="violet" />
              <div>
                <div className="font-mono text-[0.5rem] uppercase tracking-[0.34em] text-[#cbbaff]/72">Eyes on the next brief</div>
                <p className="mt-2 text-[0.8rem] leading-[1.8] text-white/52">
                  Tell us what needs to launch, what needs to feel different, and where the current experience is falling flat.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-16 grid gap-4 lg:grid-cols-[1.1fr_0.8fr_0.8fr]">
          <div className="section-glass-card rounded-[1.7rem] p-6">
            <div className="font-mono text-[0.54rem] uppercase tracking-[0.36em] text-white/28">Get in touch</div>
            <div className="mt-5 space-y-3">
              {CONTACT_LINKS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-between rounded-[1.15rem] border border-white/[0.08] bg-white/[0.03] px-4 py-4 transition-colors duration-300 hover:border-white/[0.14]"
                >
                  <span className="font-mono text-[0.46rem] uppercase tracking-[0.28em] text-white/28">{item.label}</span>
                  <span className="text-[0.78rem] text-white/72">{item.value}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="section-glass-card rounded-[1.7rem] p-6">
            <div className="font-mono text-[0.54rem] uppercase tracking-[0.36em] text-white/28">Navigate</div>
            <ul className="mt-5 space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <button
                    type="button"
                    onClick={() => onNavigate?.(link.index)}
                    className="font-mono text-[0.58rem] uppercase tracking-[0.26em] text-white/44 transition-colors duration-300 hover:text-white/82"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="section-glass-card rounded-[1.7rem] p-6">
            <div className="font-mono text-[0.54rem] uppercase tracking-[0.36em] text-white/28">Follow</div>
            <ul className="mt-5 space-y-3">
              {SOCIALS.map((social) => (
                <li key={social.label}>
                  <a href={social.href} className="font-mono text-[0.58rem] uppercase tracking-[0.26em] text-white/44 transition-colors duration-300 hover:text-white/82">
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-5 md:flex-row">
          <span className="font-mono text-[0.48rem] uppercase tracking-[0.32em] text-white/20">© 2026 BlackDonut Studio. All rights reserved.</span>
          <span className="font-mono text-[0.48rem] uppercase tracking-[0.32em] text-white/18">Crafted with obsession in Bengaluru.</span>
        </div>
      </div>
    </footer>
  );
}
 
