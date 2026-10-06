import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./index.html",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border, 240 3.7% 15.9%))",
        input: "hsl(var(--input, 240 3.7% 15.9%))",
        ring: "hsl(var(--ring, 263.4 70% 50.4%))",
        background: "hsl(var(--background, 240 10% 3.9%))",
        foreground: "hsl(var(--foreground, 0 0% 98%))",
        primary: {
          DEFAULT: "hsl(var(--primary, 263.4 70% 50.4%))",
          foreground: "hsl(var(--primary-foreground, 210 20% 98%))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary, 240 3.7% 15.9%))",
          foreground: "hsl(var(--secondary-foreground, 0 0% 98%))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted, 240 3.7% 15.9%))",
          foreground: "hsl(var(--muted-foreground, 240 5% 64.9%))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent, 240 3.7% 15.9%))",
          foreground: "hsl(var(--accent-foreground, 0 0% 98%))",
        },
        card: {
          DEFAULT: "hsl(var(--card, 240 10% 3.9%))",
          foreground: "hsl(var(--card-foreground, 0 0% 98%))",
        },
        brand: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
        }
      },
      borderRadius: {
        lg: "var(--radius, 0.75rem)",
        md: "calc(var(--radius, 0.75rem) - 2px)",
        sm: "calc(var(--radius, 0.75rem) - 4px)",
      },
      animation: {
        "shimmer": "shimmer 2s linear infinite",
        "meteor": "meteor 5s linear infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        shimmer: {
          from: { backgroundPosition: "0 0" },
          to: { backgroundPosition: "-200% 0" },
        },
        meteor: {
          "0%": { transform: "rotate(215deg) translateX(0)", opacity: "1" },
          "70%": { opacity: "1" },
          "100%": { transform: "rotate(215deg) translateX(-500px)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
