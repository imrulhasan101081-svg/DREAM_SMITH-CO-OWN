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
          DEFAULT: "#030A16",
          deep: "#000308",
          surface: "#071222",
          card: "#040B17",
        },
        ivory: {
          DEFAULT: "#FAF8F3",
          dim: "#EBE3D3",
          muted: "#DDD3C0",
        },
        gold: {
          DEFAULT: "#E0B338",
          bright: "#FFE082",
          muted: "rgba(224, 179, 56, 0.28)",
          deep: "#A0781A",
        },
        ink: {
          DEFAULT: "#000000",
          muted: "#1A1D18",
          subtle: "#42453F",
        },
        sage: {
          DEFAULT: "#2E4C33",
          dim: "#DDE8DD",
          dark: "#1B3020",
        },
        line: {
          DEFAULT: "rgba(224, 179, 56, 0.42)",
          light: "rgba(0, 0, 0, 0.18)",
          dark: "rgba(255, 255, 255, 0.18)",
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['var(--font-serif)', 'sans-serif'],
        display: ['var(--font-serif)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      backgroundImage: {
        'gold-shimmer': 'linear-gradient(135deg, #FFE082 0%, #E0B338 50%, #A0781A 100%)',
        'glass-gradient': 'linear-gradient(180deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.04) 100%)',
      },
    },
  },
  plugins: [],
};
export default config;
