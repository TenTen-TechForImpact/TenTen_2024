/** @type {import('tailwindcss').Config} */

const flowbite = require("flowbite-react/tailwind");

module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      colors: {
        white: "#FBFBFE",
        black: "#050314",
        primary: "#2B2AC9",
        secondary: "#DEDCFD",
        accent: "#AEDAFD",
      },
      fontSize: {
        title: "48px",
        "extra-large": "32px",
        large: "24px",
        medium: "16px",
        small: "12px",
      },
      spacing: {
        small: "8px",
        medium: "20px",
        page: "55px",
      },
      borderRadius: {
        medium: "20px",
        large: "30px",
      },
    },
  },
  plugins: [flowbite.plugin()],
};
