import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        /* ── Paper surfaces ── */
        paper: {
          DEFAULT: "#F5F0E8",
          warm: "#EDE7D9",
          line: "#D8D0C0",
          highlight: "#FDF8F0",
        },
        /* ── Ink tones ── */
        ink: {
          DEFAULT: "#2C2416",
          light: "#6B5D4D",
          faint: "#A89880",
        },
        /* ── Semantic accent inks ── */
        accent: {
          DEFAULT: "#1A5276",
          light: "#2980B9",
          dark: "#0E3A56",
        },
        expense: {
          DEFAULT: "#A93226",
          dark: "#8B2820",
        },
        income: {
          DEFAULT: "#1E8449",
          dark: "#196F3D",
        },
        /* ── Legacy surface/label aliases (used in existing components) ── */
        surface: {
          DEFAULT: "#F5F0E8",
          secondary: "#EDE7D9",
          tertiary: "#D8D0C0",
        },
        label: {
          primary: "#2C2416",
          secondary: "#6B5D4D",
          tertiary: "#A89880",
        },
      },
      fontFamily: {
        sans: ["Inter Variable", "SF Pro Text", "-apple-system", "sans-serif"],
        mono: ["Inter Variable", "SF Pro Text", "-apple-system", "sans-serif"],
        display: ["Inter Variable", "SF Pro Text", "-apple-system", "sans-serif"],
      },
      fontSize: {
        hero: ["2.75rem", { lineHeight: "1.1", fontWeight: "700", letterSpacing: "-0.02em" }],
        title: ["1.25rem", { lineHeight: "1.3", fontWeight: "600", letterSpacing: "-0.01em" }],
        body: ["1rem", { lineHeight: "1.6", fontWeight: "400" }],
        caption: ["0.8125rem", { lineHeight: "1.5", fontWeight: "400", letterSpacing: "0.01em" }],
      },
      borderRadius: {
        sketchy: "2px 4px 3px 5px",
      },
      boxShadow: {
        sketch: "2px 3px 0px rgba(44,36,22,0.10)",
        "sketch-sm": "1px 2px 0px rgba(44,36,22,0.08)",
        "sketch-lg": "3px 4px 0px rgba(44,36,22,0.12)",
        "sketch-inset": "inset 1px 1px 0px rgba(44,36,22,0.06)",
      },
      backgroundImage: {
        "paper-grain": `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
        "ruled-lines": `repeating-linear-gradient(
          transparent,
          transparent 31px,
          #D8D0C066 31px,
          #D8D0C066 32px
        )`,
      },
      keyframes: {
        "sketch-in": {
          "0%": { opacity: "0", transform: "translateY(8px) rotate(-0.5deg)" },
          "100%": { opacity: "1", transform: "translateY(0) rotate(0deg)" },
        },
        "pencil-draw": {
          "0%": { strokeDashoffset: "100%" },
          "100%": { strokeDashoffset: "0%" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "sketch-in": "sketch-in 0.4s ease-out forwards",
        "pencil-draw": "pencil-draw 0.8s ease-out forwards",
        "fade-up": "fade-up 0.35s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
