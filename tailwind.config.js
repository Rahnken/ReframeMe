export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      width: {
        128: "30rem",
      },
      fontFamily: {
        headers: ["Atocha", "serif"],
        subHeaders: ["Mission\\ Script", "serif"],
        body: ["Lato", "Inter", "sans-serif"],
      },
      colors: {
        brandPrimary: {
          50: "#fff8ec",
          100: "#fff0d3",
          200: "#ffdca5",
          300: "#ffc26d",
          400: "#ff9d32",
          500: "#ff7f0a",
          600: "#ff6600",
          700: "#cc4902",
          800: "#a1390b",
          900: "#82310c",
          950: "#461604",
        },
        brandSecondary: {
          50: "#effaf4",
          100: "#d7f4e2",
          200: "#b2e8c9",
          300: "#66cc99",
          400: "#4cbb88",
          500: "#29a06c",
          600: "#1b8057",
          700: "#156747",
          800: "#135239",
          900: "#114331",
          950: "#08261c",
        },
      },
    },
  },
  daisyui: {
    themeRoot: ":root",
    themes: [
      "dark",
      "corporate",
      "coffee",
      "sunset",
      {
        mytheme: {
          primary: "#ff7f0a",

          secondary: "#66cc99",

          accent: "#eab308",

          neutral: "#1d1d1d",

          "base-100": "#1d1d1d",

          info: "#00aeef",

          success: "#00ff76",

          warning: "#fde047",

          error: "#f87171",
        },
      },
    ],
    darkTheme: "dark", // name of one of the included themes for dark mode
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
  },
  plugins: [require("daisyui")],
};
