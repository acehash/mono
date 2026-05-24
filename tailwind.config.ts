import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        cream: "#FFF8F0",
        warm: {
          50: "#FFF8F0",
          100: "#FFF0E0",
          200: "#FFE0C0",
        },
        expense: {
          light: "#FF9B85",
          DEFAULT: "#FF6B4A",
          dark: "#CC5540",
        },
        income: {
          light: "#7DD3A8",
          DEFAULT: "#4ADE80",
          dark: "#22B55A",
        },
      },
      fontFamily: {
        hand: ["Caveat", "cursive"],
      },
      borderRadius: {
        handdrawn: "255px 15px 225px 15px / 15px 225px 15px 255px",
      },
    },
  },
  plugins: [],
};
export default config;
