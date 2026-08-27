import type { Config } from "tailwindcss";

/**
 * Dark tribunal palette. Stage 1 deliverable — these tokens are the one thing
 * worth arguing about before the rest of the app locks in.
 *
 *   ink    → the room itself: near-black blues, the walls and shadow
 *   brass  → the HR desk lamp / AI terminal glow (warm, authoritative)
 *   slate  → the cool ambient light over the candidate row
 *   verdict→ semantic states: pass / fail / pending
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          900: "#080a12", // page background, deepest shadow
          800: "#0d1020", // panel background
          700: "#141a2e", // raised panel / drawer
          600: "#1d2540", // borders, inset fills
          500: "#2a3454", // hover, muted strokes
        },
        brass: {
          500: "#f2b544", // desk lamp core, primary accent
          600: "#c98a25", // lamp falloff, pressed state
          700: "#8a5c17", // deep warm shadow
          100: "#ffe9b8", // hottest highlight, glow text
        },
        slate: {
          400: "#7f95c4", // cool candidate-row light
          300: "#a8bce0", // body text on dark
          200: "#d5e0f5", // headings
        },
        verdict: {
          pass: "#4ade80",
          fail: "#f87171",
          hold: "#facc15",
          seated: "#f2b544",
        },
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', '"Courier New"', "monospace"],
        term: ['"VT323"', '"Courier New"', "monospace"],
      },
      boxShadow: {
        lamp: "0 0 40px 6px rgba(242,181,68,0.18)",
        panel: "0 0 0 2px #0d1020, 0 0 0 4px #2a3454",
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: "1" },
          "48%": { opacity: "0.86" },
          "52%": { opacity: "0.97" },
        },
        slidein: {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
      },
      animation: {
        flicker: "flicker 4s ease-in-out infinite",
        slidein: "slidein 180ms ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
