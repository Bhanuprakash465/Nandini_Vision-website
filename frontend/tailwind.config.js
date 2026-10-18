/** @type {import('tailwindcss').Config} */
// Brand tokens live in app/globals.css (:root). Tailwind only maps them to utilities,
// so a palette change happens in exactly one place.
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Core brand: black, white, deep cobalt (#2C3480).
        black: "rgb(var(--black-rgb) / <alpha-value>)",
        white: "rgb(var(--white-rgb) / <alpha-value>)",
        cobalt: {
          DEFAULT: "rgb(var(--cobalt-rgb) / <alpha-value>)",
          // Same hue, lifted for legibility on black (cobalt itself is only 1.9:1 on black).
          light: "rgb(var(--cobalt-light-rgb) / <alpha-value>)",
          // Same hue, deepened for hover states on cobalt fills.
          deep: "rgb(var(--cobalt-deep-rgb) / <alpha-value>)",
        },
      },
      fontFamily: {
        display: ['"Bodoni Moda Variable"', "Didot", "Georgia", "serif"],
        body: ['"Instrument Sans Variable"', "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      letterSpacing: { editorial: "0.02em" },
    },
  },
  plugins: [],
};
