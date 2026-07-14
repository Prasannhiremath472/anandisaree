/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Deep purple sampled from the Anandi Sarees logo (#54208C)
        royal: {
          DEFAULT: "#54208C",
          600: "#54208C",
          700: "#401A6B",
        },
        gold: {
          DEFAULT: "#F7BA67",
          400: "#F2A53F",
          500: "#E58C22",
        },
        surface: {
          DEFAULT: "#F7F5F2",
          dark: "#161414",
        },
      },
      fontFamily: {
        heading: ["'Poppins'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
