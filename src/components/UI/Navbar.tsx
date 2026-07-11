import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { label: "Services", meta: "Capabilities" },
  { label: "Impact", meta: "Proof & metrics" },
  { label: "Work", meta: "Selected builds" },
  { label: "Process", meta: "How we move" },
  { label: "Voices", meta: "Client notes" },
  { label: "Investment", meta: "Pricing" },
  { label: "Contact", meta: "Start a project" },
] as const;

const menuPanelVariants = {
  hidden: { opacity: 0, y: -10, scale: 0.985 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.34, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.985,
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
  },
};

interface NavbarProps {
  activeIndex: number;
  onNavigate: (index: number) => void;
}

export default function Navbar({ activeIndex, onNavigate }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const activeItem = NAV_ITEMS[activeIndex] ?? NAV_ITEMS[0];

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [activeIndex]);

  const handleNavigate = (index: number) => {
    setOpen(false);
    onNavigate(index);
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-[70] px-4 pt-4 md:px-8 md:pt-6"
      >
        <div className="mx-auto max-w-6xl">
          <div className="glass-neon-panel relative overflow-hidden rounded-[1.55rem] border border-white/[0.08] bg-[rgba(11,7,25,0.66)] backdrop-blur-[22px]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_-30%,rgba(126,242,255,0.18),transparent_32%),radial-gradient(circle_at_82%_-40%,rgba(187,124,255,0.28),transparent_38%),linear-gradient(135deg,rgba(255,255,255,0.07),rgba(255,255,255,0.01)_42%,rgba(155,109,255,0.08)_100%)]" />
            <div className="pointer-events-none absolute inset-[1px] rounded-[calc(1.55rem-1px)] bg-[linear-gradient(180deg,rgba(18,12,38,0.82),rgba(7,5,18,0.86))]" />

            <div className="relative flex h-[4.45rem] items-center justify-between gap-4 px-4 sm:px-5 md:h-[4.85rem] md:px-7">
              <button
                type="button"
                onClick={() => handleNavigate(0)}
                className="group flex min-w-0 items-center gap-3 text-left"
              >
                <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.04] text-[0.78rem] font-semibold uppercase tracking-[0.22em] text-white/88 shadow-[0_0_24px_rgba(126,242,255,0.12)]">
                  <span className="absolute inset-[7px] rounded-full bg-[radial-gradient(circle,rgba(126,242,255,0.34),transparent_72%)]" />
                  <span className="relative">BD</span>
                </span>

                <span className="min-w-0">
                  <span className="block truncate font-speed text-[1rem] font-black italic uppercase tracking-[-0.03em] text-white/92 md:text-[1.1rem]">
                    Black Donut
                  </span>
                  <span className="block truncate font-mono text-[0.47rem] uppercase tracking-[0.34em] text-white/36 md:text-[0.5rem]">
                    Soft retrowave digital studio
                  </span>
                </span>
              </button>

              <nav className="hidden items-center gap-1.5 lg:flex">
                {NAV_ITEMS.map((item, index) => {
                  const isActive = index === activeIndex;

                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => handleNavigate(index)}
                      aria-current={isActive ? "page" : undefined}
                      className={`neon-nav-pill relative overflow-hidden rounded-full px-4 py-2.5 text-[0.62rem] font-medium uppercase tracking-[0.28em] transition-all duration-300 ${
                        isActive
                          ? "border-white/[0.14] text-white shadow-[0_0_24px_rgba(183,124,255,0.2)]"
                          : "border-transparent text-white/56 hover:text-white/86"
                      }`}
                    >
                      <span
                        className={`pointer-events-none absolute inset-0 rounded-full transition-opacity duration-300 ${
                          isActive ? "opacity-100" : "opacity-0"
                        } bg-[linear-gradient(135deg,rgba(126,242,255,0.16),rgba(183,124,255,0.22),rgba(255,118,207,0.12))]`}
                      />
                      <span className="relative">{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="flex items-center gap-2 md:gap-3">
                <div className="hidden min-[920px]:flex flex-col items-end font-mono text-[0.46rem] uppercase tracking-[0.32em] text-white/28">
                  <span>{activeItem.meta}</span>
                  <span className="text-[#c1adff]/62">
                    {String(activeIndex + 1).padStart(2, "0")} / {String(NAV_ITEMS.length).padStart(2, "0")}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleNavigate(6)}
                  className="hidden rounded-full border border-[#b77cff]/28 bg-[linear-gradient(135deg,rgba(126,242,255,0.08),rgba(183,124,255,0.16),rgba(255,118,207,0.08))] px-5 py-2.5 font-mono text-[0.58rem] uppercase tracking-[0.32em] text-white/84 shadow-[0_0_28px_rgba(183,124,255,0.14)] transition-all duration-300 hover:border-[#cda9ff]/42 hover:text-white sm:inline-flex"
                >
                  Start a Project
                </button>

                <button
                  type="button"
                  onClick={() => setOpen((value) => !value)}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] text-white/74 transition-colors duration-300 hover:text-white lg:hidden"
                  aria-label={open ? "Close navigation" : "Open navigation"}
                  aria-expanded={open}
                >
                  <span className="relative flex h-3.5 w-5 flex-col items-stretch justify-between">
                    <motion.span
                      className="block h-px w-full bg-current"
                      animate={open ? { rotate: 38, y: 6 } : { rotate: 0, y: 0 }}
                      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                    />
                    <motion.span
                      className="block h-px w-full bg-current"
                      animate={open ? { opacity: 0 } : { opacity: 1 }}
                      transition={{ duration: 0.18 }}
                    />
                    <motion.span
                      className="block h-px w-full bg-current"
                      animate={open ? { rotate: -38, y: -6 } : { rotate: 0, y: 0 }}
                      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            variants={menuPanelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-x-4 top-[5.8rem] z-[69] lg:hidden md:top-[6.45rem] md:px-4"
          >
            <div className="glass-neon-panel relative mx-auto max-w-3xl overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-[rgba(12,8,26,0.78)] p-3 backdrop-blur-[22px]">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(126,242,255,0.12),transparent_32%),radial-gradient(circle_at_85%_0%,rgba(183,124,255,0.18),transparent_38%)]" />

              <div className="relative space-y-2">
                {NAV_ITEMS.map((item, index) => {
                  const isActive = index === activeIndex;

                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => handleNavigate(index)}
                      className={`flex w-full items-center justify-between rounded-[1.15rem] border px-4 py-4 text-left transition-all duration-300 ${
                        isActive
                          ? "border-[#b77cff]/30 bg-[linear-gradient(135deg,rgba(126,242,255,0.08),rgba(183,124,255,0.18),rgba(255,118,207,0.08))] shadow-[0_0_24px_rgba(183,124,255,0.12)]"
                          : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]"
                      }`}
                    >
                      <span>
                        <span className="block font-speed text-[1.25rem] font-bold italic uppercase tracking-[-0.03em] text-white/92">
                          {item.label}
                        </span>
                        <span className="mt-1 block font-mono text-[0.5rem] uppercase tracking-[0.32em] text-white/34">
                          {item.meta}
                        </span>
                      </span>

                      <span className="font-mono text-[0.5rem] uppercase tracking-[0.34em] text-[#c8b8ff]/54">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
