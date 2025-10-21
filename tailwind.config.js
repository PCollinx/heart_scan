/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,html}", "./main.css"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Open Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
        dancing: ['"Dancing Script"', "cursive"],
        headline: ['"Mozilla Headline"', "sans-serif"],
        oswald: ['"Oswald"', "sans-serif"],
      },
    },
    screens: {
      xs: "359px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },
  plugins: [],
};
