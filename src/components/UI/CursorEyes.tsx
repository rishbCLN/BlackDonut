import { useRef } from "react";

const SIZE_MAP = {
  sm: { socketWidth: 34, socketHeight: 22, pupilSize: 8, gap: 8, travelX: 4.5, travelY: 3.2 },
  md: { socketWidth: 44, socketHeight: 28, pupilSize: 10, gap: 10, travelX: 6, travelY: 4.4 },
  lg: { socketWidth: 58, socketHeight: 36, pupilSize: 13, gap: 12, travelX: 7.8, travelY: 5.4 },
} as const;

const TINT_MAP = {
  violet: {
    shell: "radial-gradient(circle at 50% 30%, rgba(255,255,255,0.98) 0%, rgba(251,244,255,0.94) 52%, rgba(215,198,255,0.84) 100%)",
    glow: "0 0 22px rgba(183,124,255,0.16)",
    irisGlow: "rgba(183,124,255,0.18)",
  },
  cyan: {
    shell: "radial-gradient(circle at 50% 30%, rgba(255,255,255,0.98) 0%, rgba(243,255,255,0.94) 52%, rgba(204,246,255,0.84) 100%)",
    glow: "0 0 22px rgba(126,242,255,0.18)",
    irisGlow: "rgba(126,242,255,0.18)",
  },
  rose: {
    shell: "radial-gradient(circle at 50% 30%, rgba(255,255,255,0.98) 0%, rgba(255,246,252,0.94) 52%, rgba(255,208,234,0.82) 100%)",
    glow: "0 0 22px rgba(255,118,207,0.18)",
    irisGlow: "rgba(255,118,207,0.18)",
  },
} as const;

type CursorEyesSize = keyof typeof SIZE_MAP;
type CursorEyesTint = keyof typeof TINT_MAP;

interface CursorEyesProps {
  className?: string;
  size?: CursorEyesSize;
  tint?: CursorEyesTint;
}

export default function CursorEyes({ className = "", size = "md", tint = "violet" }: CursorEyesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const config = SIZE_MAP[size];
  const palette = TINT_MAP[tint];

  return (
    <div
      ref={containerRef}
      className={`inline-flex items-center justify-center ${className}`}
      style={{ gap: `${config.gap}px` }}
      aria-hidden="true"
    >
      {[0, 1].map((index) => (
        <span
          key={index}
          className="cursor-eye-socket relative flex items-center justify-center overflow-hidden rounded-full border border-white/[0.14]"
          style={{
            width: `${config.socketWidth}px`,
            height: `${config.socketHeight}px`,
            background: palette.shell,
            boxShadow: palette.glow,
            animationDelay: `${index * 0.28}s`,
          }}
        >
          <span className="pointer-events-none absolute inset-[10%] rounded-full bg-[radial-gradient(circle_at_50%_25%,rgba(255,255,255,0.9),rgba(255,255,255,0.5)_52%,transparent_100%)] opacity-85" />

          <span
            className="absolute flex items-center justify-center rounded-full bg-[#08040f]"
            style={{
              width: `${config.pupilSize}px`,
              height: `${config.pupilSize}px`,
              boxShadow: `0 0 10px ${palette.irisGlow}`,
            }}
          >
            <span className="absolute left-[26%] top-[20%] h-[24%] w-[24%] rounded-full bg-white/70" />
          </span>
        </span>
      ))}
    </div>
  );
}