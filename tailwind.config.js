export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/react-tailwindcss-select/dist/index.esm.js",
  ],
  theme: {
    extend: {
      width: {
        128: "30rem",
      },
      fontSize: {
        sm: " --font-size-sm: clamp(0.8rem, 0.17vw + 0.76rem, 0.89rem)",
        base: "--font-size-base: clamp(1rem, 0.34vw + 0.91rem, 1.19rem)",
        lg: "--font-size-lg: clamp(1.25rem, 0.61vw + 1.1rem, 1.58rem)",
        xl: "--font-size-xl: clamp(1.56rem, 1vw + 1.31rem, 2.11rem)",
        "2xl": "--font-size-2xl: clamp(1.95rem, 1.56vw + 1.56rem, 2.81rem)",
        "3xl": "--font-size-3xl: clamp(2.44rem, 2.38vw + 1.85rem, 3.75rem)",
        "4xl": "--font-size-4xl: clamp(3.05rem, 3.54vw + 2.17rem, 5rem)",
        "5xl": "--font-size-5xl: clamp(3.81rem, 5.18vw + 2.52rem, 6.66rem)",
        "6xl": "--font-size-6xl: clamp(4.77rem, 7.48vw + 2.9rem, 8.88rem)",
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
      "coffee",
      "sunset",
      "emerald",
      {
        reframeDark: {
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
      {
        reframeLight: {
          primary: "#ff7f0a",

          secondary: "#66cc99",

          accent: "#fde047",

          neutral: "#d1d5db",

          "base-100": "#ffffe2",

          info: "#00aeef",

          success: "#00ff76",

          warning: "#ca8a04",

          error: "#f87171",
        },
      },
    ],
    darkTheme: "reframeDark", // name of one of the included themes for dark mode
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
  },
  plugins: [require("daisyui")],
};
