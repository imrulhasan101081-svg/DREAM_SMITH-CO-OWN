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
        navy: {
          DEFAULT: "#0B1B32",
          deep: "#071120",
        },
        ivory: {
          DEFAULT: "#F7F3EA",
          dim: "#EFE9DA",
        },
        gold: {
          DEFAULT: "#B08D4F",
          bright: "#D4AF6A",
        },
        ink: "#12140F",
        sage: {
          DEFAULT: "#5C7A5E",
          dim: "#E9EEE7",
        },
        line: {
          DEFAULT: "rgba(176,141,79,0.28)",
          light: "rgba(11,27,50,0.12)",
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        serif: ['var(--font-fraunces)', 'serif'],
        mono: ['var(--font-ibm-plex-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
};
export default config;
