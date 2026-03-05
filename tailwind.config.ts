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
        // Mahis brand palette
        "mahis-black": "#0A0A0A",
        "mahis-white": "#F5F5F5",
        "mahis-yellow": "#FFE500",
        "mahis-muted": "#555555",
        "mahis-surface": "#141414",
        "mahis-border": "#1F1F1F",
      },
      fontFamily: {
        sans: ["Space Grotesk", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
        mono: ["Space Grotesk", "monospace"],
      },
      fontSize: {
        "fluid-xs": ["clamp(0.75rem, 1vw, 0.875rem)", { lineHeight: "1.5" }],
        "fluid-sm": ["clamp(0.875rem, 1.5vw, 1rem)", { lineHeight: "1.5" }],
        "fluid-base": ["clamp(1rem, 2vw, 1.125rem)", { lineHeight: "1.6" }],
        "fluid-lg": ["clamp(1.125rem, 2.5vw, 1.5rem)", { lineHeight: "1.4" }],
        "fluid-xl": ["clamp(1.5rem, 3vw, 2rem)", { lineHeight: "1.2" }],
        "fluid-2xl": ["clamp(2rem, 5vw, 3.5rem)", { lineHeight: "1.05" }],
        "fluid-3xl": ["clamp(3rem, 8vw, 6rem)", { lineHeight: "1" }],
        "fluid-hero": ["clamp(5rem, 12vw, 11rem)", { lineHeight: "0.9" }],
      },
      letterSpacing: {
        display: "-0.04em",
        "tight-display": "-0.05em",
        mono: "0.15em",
      },
      spacing: {
        section: "clamp(4rem, 10vw, 10rem)",
      },
      transitionTimingFunction: {
        mahis: "cubic-bezier(0.76, 0, 0.24, 1)",
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
