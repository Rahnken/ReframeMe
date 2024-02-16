/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      width: {
        "128": "32rem",
      },
      fontFamily: {
        headers: ["Atocha", "serif"],
        subHeaders: ["Mission\\ Script", "serif"],
        body: ["Lato", "Inter", "sans-serif"],
      },
      colors: {
        primary: {
          "50": "#fff8ec",
          "100": "#fff0d3",
          "200": "#ffdca5",
          "300": "#ffc26d",
          "400": "#ff9d32",
          "500": "#ff7f0a",
          "600": "#ff6600",
          "700": "#cc4902",
          "800": "#a1390b",
          "900": "#82310c",
          "950": "#461604",
        },
        secondary: {
          "50": "#effaf4",
          "100": "#d7f4e2",
          "200": "#b2e8c9",
          "300": "#66cc99",
          "400": "#4cbb88",
          "500": "#29a06c",
          "600": "#1b8057",
          "700": "#156747",
          "800": "#135239",
          "900": "#114331",
          "950": "#08261c",
        },
      },
    },
  },
  plugins: [],
};
