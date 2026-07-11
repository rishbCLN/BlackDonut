import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { navbarActions } from "./hooks/useNavbarStore";
import { useNavbarStore } from "./hooks/useNavbarStore";

interface NavLinkProps {
  label: string;
  index: number;
}

export default function NavLink({ label, index }: NavLinkProps) {
  const isActive = useNavbarStore((s) => s.activeNavIndex === index);
  const isMode3 = useNavbarStore((s) => s.scrollProgress >= 0.85);

  const linkStyle: CSSProperties = isActive
    ? { perspective: 700, textShadow: "0 0 12px rgba(0,255,255,0.4)" }
    : { perspective: 700 };

  return (
    <motion.a
      href="#"
      className={
        isActive
          ? "group relative inline-flex items-center text-[0.68rem] font-medium uppercase tracking-[0.22em] text-white/90 outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-brand-cyan/25"
          : isMode3
            ? "group relative inline-flex items-center text-[0.68rem] font-medium uppercase tracking-[0.22em] text-white/70 outline-none transition-colors duration-300 hover:text-white/90 focus-visible:text-white/90 focus-visible:ring-2 focus-visible:ring-brand-cyan/25"
            : "group relative inline-flex items-center text-[0.68rem] font-medium uppercase tracking-[0.22em] text-white/40 outline-none transition-colors duration-300 hover:text-white/90 focus-visible:text-white/90 focus-visible:ring-2 focus-visible:ring-brand-cyan/25"
      }
      style={linkStyle}
      onPointerEnter={() => navbarActions.setHoveredNavIndex(index)}
      onPointerLeave={() => navbarActions.setHoveredNavIndex(-1)}
      onFocus={() => navbarActions.setHoveredNavIndex(index)}
      onBlur={() => navbarActions.setHoveredNavIndex(-1)}
      onClick={() => navbarActions.setActiveNavIndex(index)}
      animate={isActive ? { y: -2, rotateX: -5, scale: 1.08 } : { y: 0, rotateX: 0, scale: 1 }}
      whileHover={{ y: -2, rotateX: -5, scale: 1.08 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="relative inline-flex">
        {label.split("").map((char, charIndex) => (
          <motion.span
            key={`${label}-${charIndex}-${char}`}
            className="inline-block"
            whileHover={{ y: -3 }}
            transition={{ duration: 0.18, delay: charIndex * 0.04, ease: [0.22, 1, 0.36, 1] }}
          >
            {char}
          </motion.span>
        ))}
      </span>

      <motion.span
        aria-hidden="true"
        className="absolute -bottom-1 left-1/2 h-px w-10 -translate-x-1/2 origin-center bg-brand-cyan/70"
        initial={false}
        animate={isActive ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        whileHover={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      />

      <span className="sr-only">{label}</span>
    </motion.a>
  );
}
