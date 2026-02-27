import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Mahis brand palette — refined, dark luxury
        "mahis-black": "#0A0A0A",
        "mahis-white": "#F5F2ED",
        "mahis-cream": "#E8E0D0",
        "mahis-gold": "#C9A96E",
        "mahis-gold-light": "#E8C98A",
        "mahis-grey": "#2A2A2A",
        "mahis-grey-mid": "#555555",
        "mahis-grey-light": "#999999",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      fontSize: {
        "fluid-xs": "clamp(0.75rem, 1vw, 0.875rem)",
        "fluid-sm": "clamp(0.875rem, 1.5vw, 1rem)",
        "fluid-base": "clamp(1rem, 2vw, 1.125rem)",
        "fluid-lg": "clamp(1.125rem, 2.5vw, 1.5rem)",
        "fluid-xl": "clamp(1.5rem, 3vw, 2rem)",
        "fluid-2xl": "clamp(2rem, 5vw, 3.5rem)",
        "fluid-3xl": "clamp(3rem, 8vw, 6rem)",
        "fluid-4xl": "clamp(4rem, 12vw, 10rem)",
      },
      spacing: {
        "section": "clamp(4rem, 10vw, 10rem)",
      },
      transitionTimingFunction: {
        "mahis": "cubic-bezier(0.76, 0, 0.24, 1)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 30s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
