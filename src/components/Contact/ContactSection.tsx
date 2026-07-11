import { motion } from "framer-motion";

const CONTACT_DETAILS = [
  { label: "Email", value: "hello@blackdonut.io", href: "mailto:hello@blackdonut.io" },
  { label: "Phone", value: "+91 98765 43210", href: "tel:+919876543210" },
  { label: "Location", value: "Bengaluru, India", href: "#" },
];

const SOCIALS = ["Instagram", "X / Twitter", "LinkedIn", "GitHub"];

interface ContactSectionProps {
  className?: string;
  sectionId?: string;
}

export default function ContactSection({ className = "", sectionId }: ContactSectionProps) {
  return (
    <section id={sectionId} className={`relative w-full ${className}`}>
      <motion.div
        initial={{ opacity: 0.88, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="section-glass-card section-signal-panel relative mx-auto w-full overflow-hidden rounded-[2rem] p-7 md:p-14"
      >
        <div className="pointer-events-none absolute inset-[-12%] section-spectrum-backdrop opacity-70" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />
        <div className="pointer-events-none absolute left-1/2 top-[18%] h-40 w-[28rem] max-w-[88vw] -translate-x-1/2 section-spectrum-glow opacity-70" />

        <div className="relative grid grid-cols-1 gap-14 md:grid-cols-[1.2fr_1fr] md:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="font-mono text-[0.64rem] uppercase tracking-[0.26em] text-white/36">Core Exit / Contact</span>

            <h2 className="mt-5 text-[clamp(2rem,5.5vw,5.3rem)] font-black uppercase leading-[0.92] tracking-[-0.02em] text-white">
              Let&apos;s Build
              <br />
              <span className="hero-gradient-word">Your Next Story.</span>
            </h2>

            <p className="mt-7 max-w-xl text-[clamp(0.92rem,1.35vw,1.08rem)] leading-[1.8] text-white/48">
              You just passed through the core. Now we turn that energy into strategy, visuals, and code. Tell us what you are building, and we will shape the digital narrative around it.
            </p>

            <motion.a
              href="mailto:hello@blackdonut.io"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="hero-primary-cta mt-9 inline-block rounded-full px-8 py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-[#050510] transition-transform duration-300 hover:-translate-y-0.5"
            >
              Start A Project
            </motion.a>
          </motion.div>

          <div className="space-y-4">
            {CONTACT_DETAILS.map((item, index) => (
              <motion.a
                key={item.label}
                href={item.href}
                initial={{ opacity: 0, x: 22 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.12 * index, ease: [0.22, 1, 0.36, 1] }}
                className="group flex items-center justify-between rounded-2xl border border-white/[0.07] bg-white/[0.01] px-5 py-4 transition-colors duration-300 hover:border-white/[0.2] hover:bg-white/[0.03]"
              >
                <span className="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-white/34">{item.label}</span>
                <span className="text-sm tracking-wide text-white/78 transition-colors duration-300 group-hover:text-white">
                  {item.value}
                </span>
              </motion.a>
            ))}

            <motion.div
              initial={{ opacity: 0, x: 22 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-white/[0.07] bg-white/[0.01] px-5 py-5"
            >
              <span className="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-white/34">Social</span>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
                {SOCIALS.map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-white/42 transition-colors duration-300 hover:text-white/78"
                  >
                    {social}
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
