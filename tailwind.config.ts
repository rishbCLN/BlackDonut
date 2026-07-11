import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        brand: {
          cyan: "#00FFFF",
          violet: "#8B5CF6",
          magenta: "#FF2D78",
          dark: "#030303",
          surface: "#0D0D0D",
          muted: "#1A1A1A",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      keyframes: {
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 0px transparent" },
          "50%": { boxShadow: "0 0 18px rgb(0 255 255 / 0.15)" },
        },
        orbitAccent: {
          "0%": { transform: "rotate(0deg)", opacity: "0.3" },
          "50%": { opacity: "0.8" },
          "100%": { transform: "rotate(360deg)", opacity: "0.3" },
        },
      },
      animation: {
        "glow-pulse": "glowPulse 3.5s ease-in-out infinite",
        "orbit-accent": "orbitAccent 2s linear infinite",
        "orbit-accent-fast": "orbitAccent 1.33s linear infinite",
        marquee: "marquee-scroll 32s linear infinite",
      },
      fontFamily: {
        sans: ["Space Grotesk", "ui-sans-serif", "system-ui"],
        speed: ["Barlow Condensed", "Space Grotesk", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [animate],
};

export default config;
