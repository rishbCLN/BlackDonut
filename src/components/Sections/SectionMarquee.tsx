interface SectionMarqueeProps {
  label?: string;
}

const DEFAULT_ITEMS = [
  "BLACKDONUT",
  "✦",
  "DIGITAL EXPERIENCES",
  "✦",
  "BENGALURU, INDIA",
  "✦",
  "EST. 2020",
  "✦",
  "WE BUILD THE WEB",
  "✦",
];

export default function SectionMarquee({ label }: SectionMarqueeProps) {
  const raw = label
    ? Array.from({ length: 10 }, (_, i) => (i % 2 === 0 ? label : "—"))
    : DEFAULT_ITEMS;

  // Duplicate for seamless loop
  const items = [...raw, ...raw];

  return (
    <div className="relative overflow-hidden border-y border-white/[0.05] bg-[#070709] py-3.5">
      <div className="animate-marquee flex gap-10 whitespace-nowrap">
        {items.map((item, i) => (
          <span
            key={i}
            className={`font-mono text-[0.56rem] uppercase tracking-[0.42em] ${
              item === "✦" || item === "—"
                ? "text-brand-cyan/50"
                : "text-white/22"
            }`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
