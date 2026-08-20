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
          deep: "#040914",
          surface: "#0e2038",
          card: "#091527",
        },
        ivory: {
          DEFAULT: "#F9F7F1",
          dim: "#EFE9DA",
          muted: "#E2DAC8",
        },
        gold: {
          DEFAULT: "#C5A869",
          bright: "#E2C889",
          muted: "rgba(197, 168, 105, 0.15)",
          deep: "#9E8043",
        },
        ink: {
          DEFAULT: "#12140F",
          muted: "#4A4D46",
          subtle: "#7A7D75",
        },
        sage: {
          DEFAULT: "#4A6B50",
          dim: "#E9EFE9",
          dark: "#2D4432",
        },
        line: {
          DEFAULT: "rgba(197, 168, 105, 0.22)",
          light: "rgba(11, 27, 50, 0.08)",
          dark: "rgba(255, 255, 255, 0.07)",
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      backgroundImage: {
        'gold-shimmer': 'linear-gradient(135deg, #C5A869 0%, #F5E7C8 50%, #9E8043 100%)',
        'glass-gradient': 'linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)',
      },
    },
  },
  plugins: [],
};
export default config;
