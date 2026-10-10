/** @type {import('tailwindcss').Config} */
module.exports = {
  blocklist: ["overline"],
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        ink: "#0A0E0C",
        surface: { 1: "#111A16", 2: "#1A2621" },
        mint: { DEFAULT: "#00E599", pale: "#A3FFD6", glow: "rgba(0,229,153,0.4)" },
        mist: "#8A9E94",
        line: "#1F2E27",
        alert: "#FF5B5B",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
        ring: "hsl(var(--ring))",
      },
      fontFamily: {
        sans: ['"DM Sans"', "sans-serif"],
        heading: ['"Outfit"', "sans-serif"],
        display: ['"Fraunces"', "serif"],
        mono: ['"Space Mono"', "monospace"],
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.6" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out 1.2s infinite",
        "pulse-ring": "pulse-ring 2.4s ease-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
