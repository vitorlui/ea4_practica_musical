/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        correct: "#22c55e",
        incorrect: "#ef4444",
        missing: "#eab308",
        solution: "#3b82f6",
      },
    },
  },
  plugins: [],
};

