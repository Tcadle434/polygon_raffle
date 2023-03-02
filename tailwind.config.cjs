/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundColor: {
        primary: "#F4F4F4",
        dark: "#2c3e4b",
        blur: "#030303",
      },
      colors: {
        primary: "#2c3e4b",
        secondary: "#981EE2",
        accent: "#E58247",
        third: "#47E582",
        off: "#EBEBEB",
        light: "#FF99FF",
        newthird: "#8FFFE6",
      },
    },
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/line-clamp"),
  ],
};
