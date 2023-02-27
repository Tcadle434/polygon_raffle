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
        secondary: "#8247e5",
        off: "#EBEBEB",
        light: "#d5bdf5",
      },
    },
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/line-clamp"),
  ],
};
