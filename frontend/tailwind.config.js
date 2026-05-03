/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        display: ["Outfit", "system-ui", "sans-serif"]
      },
      colors: {
        brand: {
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7"
        },
        accent: {
          400: "#c084fc",
          500: "#a855f7",
          600: "#9333ea"
        }
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0,0,0,0.12)"
      },
      backdropBlur: {
        xs: "2px"
      }
    }
  },
  plugins: []
};
