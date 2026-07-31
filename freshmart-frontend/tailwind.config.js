/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#fdfbf7",
        "paper-dark": "#f5f1e8",
        ink: "#1b261b",
        "market-green": "#2d6a4f",
        "market-green-dark": "#1b4332",
        gold: "#f4d35e",
        "gold-dark": "#c9a227",
        basil: "#95d5b2",
        tomato: "#e63946",
      },
      fontFamily: {
        body: ["Inter", "sans-serif"],
        display: ["Fraunces", "serif"],
      },
      boxShadow: {
        crate:
          "0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.08)",
      },
    },
  },
  plugins: [],
}
