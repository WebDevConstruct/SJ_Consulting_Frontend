/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0A0A0B",
          soft: "#141416",
          surface: "#1B1B1E",
          line: "#2A2A2E",
        },
        paper: {
          DEFAULT: "#FFFFFF",
          soft: "#F6F5F1",
          surface: "#EFEDE6",
          line: "#E1DED4",
        },
        gold: {
          50: "#FBF6E7",
          100: "#F3E4B0",
          200: "#E9CD7B",
          300: "#D9B75C",
          400: "#C9A227",
          500: "#B08D1F",
          600: "#8B6F14",
          700: "#6B5610",
        },
        ivory: "#F5F3EE",
      },
      fontFamily: {
        display: ["Georgia", "Cambria", "'Times New Roman'", "serif"],
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "'Segoe UI'",
          "Roboto",
          "'Helvetica Neue'",
          "Arial",
          "sans-serif",
        ],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      backgroundImage: {
        "gold-metal":
          "linear-gradient(120deg, #8B6F14 0%, #E9CD7B 22%, #C9A227 45%, #FBF6E7 55%, #C9A227 68%, #8B6F14 100%)",
        "gold-metal-soft":
          "linear-gradient(135deg, #C9A227 0%, #E9CD7B 50%, #B08D1F 100%)",
        "ledger-dark":
          "repeating-linear-gradient(to bottom, transparent, transparent 27px, rgba(201,162,39,0.08) 28px)",
        "ledger-light":
          "repeating-linear-gradient(to bottom, transparent, transparent 27px, rgba(11,11,12,0.05) 28px)",
      },
      boxShadow: {
        gold: "0 0 0 1px rgba(201,162,39,0.35)",
      },
      maxWidth: {
        content: "1240px",
      },
      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "bounce-slow": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(6px)" },
        },
      },
      animation: {
        floaty: "floaty 6s ease-in-out infinite",
        "bounce-slow": "bounce-slow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
