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
          DEFAULT: "#061224",
          deep: "#02050B",
          surface: "#0B192E",
          card: "#06101F",
        },
        ivory: {
          DEFAULT: "#F9F7F1",
          dim: "#EFE9DA",
          muted: "#E2DAC8",
        },
        gold: {
          DEFAULT: "#D4AF37",
          bright: "#F5D27B",
          muted: "rgba(212, 175, 55, 0.20)",
          deep: "#8F6E27",
        },
        ink: {
          DEFAULT: "#070906",
          muted: "#2E312B",
          subtle: "#5A5D55",
        },
        sage: {
          DEFAULT: "#3D5A42",
          dim: "#E4ECE4",
          dark: "#233827",
        },
        line: {
          DEFAULT: "rgba(212, 175, 55, 0.32)",
          light: "rgba(7, 9, 6, 0.12)",
          dark: "rgba(255, 255, 255, 0.12)",
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['var(--font-serif)', 'sans-serif'],
        display: ['var(--font-serif)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      backgroundImage: {
        'gold-shimmer': 'linear-gradient(135deg, #F5D27B 0%, #D4AF37 50%, #8F6E27 100%)',
        'glass-gradient': 'linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.03) 100%)',
      },
    },
  },
  plugins: [],
};
export default config;
