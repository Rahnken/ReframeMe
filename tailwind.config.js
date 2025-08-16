import daisyui from "daisyui";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
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
        xs: [
          "0.75rem",
          {
            lineHeight: "1rem",
          },
        ],
        sm: [
          "0.875rem",
          {
            lineHeight: "1.25rem",
          },
        ],
        base: [
          "1rem",
          {
            lineHeight: "1.5rem",
          },
        ],
        lg: [
          "1.125rem",
          {
            lineHeight: "1.75rem",
          },
        ],
        xl: [
          "1.25rem",
          {
            lineHeight: "1.75rem",
          },
        ],
        "2xl": [
          "1.5rem",
          {
            lineHeight: "2rem",
          },
        ],
        "3xl": [
          "1.875rem",
          {
            lineHeight: "2.25rem",
          },
        ],
        "4xl": [
          "2.25rem",
          {
            lineHeight: "2.5rem",
          },
        ],
        "5xl": [
          "3rem",
          {
            lineHeight: "1",
          },
        ],
        "6xl": [
          "3.75rem",
          {
            lineHeight: "1",
          },
        ],
        "7xl": [
          "4.5rem",
          {
            lineHeight: "1",
          },
        ],
        "8xl": [
          "6rem",
          {
            lineHeight: "1",
          },
        ],
        "9xl": [
          "8rem",
          {
            lineHeight: "1",
          },
        ],
      },
      fontFamily: {
        headers: ["Mission Script", "Lato", "serif"],
        subHeaders: ["Mission Script", "Lato", "serif"],
        body: ["Lato", "Inter", "sans-serif"],
        sans: ["Lato", "Inter", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "fade-up": "fadeUp 0.5s ease-out",
        "fade-down": "fadeDown 0.5s ease-out",
        "slide-in-right": "slideInRight 0.3s ease-out",
        "slide-in-left": "slideInLeft 0.3s ease-out",
        "scale-up": "scaleUp 0.3s ease-out",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
        fadeUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        fadeDown: {
          "0%": {
            opacity: "0",
            transform: "translateY(-10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        slideInRight: {
          "0%": {
            transform: "translateX(100%)",
            opacity: "0",
          },
          "100%": {
            transform: "translateX(0)",
            opacity: "1",
          },
        },
        slideInLeft: {
          "0%": {
            transform: "translateX(-100%)",
            opacity: "0",
          },
          "100%": {
            transform: "translateX(0)",
            opacity: "1",
          },
        },
        scaleUp: {
          "0%": {
            transform: "scale(0.95)",
            opacity: "0",
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1",
          },
        },
        pulseSoft: {
          "0%, 100%": {
            opacity: "1",
          },
          "50%": {
            opacity: "0.8",
          },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-mesh":
          "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
      backdropBlur: {
        xs: "2px",
        "3xl": "64px",
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
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  daisyui: {
    themeRoot: ":root",
    themes: [
      {
        modernDark: {
          primary: "#ff7f0a",
          "primary-focus": "#ff6600",
          "primary-content": "#ffffff",

          secondary: "#66cc99",
          "secondary-focus": "#4cbb88",
          "secondary-content": "#ffffff",

          accent: "#fbbf24",
          "accent-focus": "#f59e0b",
          "accent-content": "#18181b",

          neutral: "#2a2e37",
          "neutral-focus": "#16181d",
          "neutral-content": "#ffffff",

          "base-100": "#0f0f0f",
          "base-200": "#1a1a1a",
          "base-300": "#262626",
          "base-content": "#e5e5e5",

          info: "#3abff8",
          success: "#36d399",
          warning: "#fbbd23",
          error: "#f87272",

          "--rounded-box": "1rem",
          "--rounded-btn": "0.5rem",
          "--rounded-badge": "1.9rem",
          "--animation-btn": "0.25s",
          "--animation-input": "0.2s",
          "--btn-focus-scale": "0.95",
          "--border-btn": "1px",
          "--tab-border": "1px",
          "--tab-radius": "0.5rem",
        },
      },
      {
        modernLight: {
          primary: "#ff7f0a",
          "primary-focus": "#ff6600",
          "primary-content": "#ffffff",

          secondary: "#29a06c",
          "secondary-focus": "#1b8057",
          "secondary-content": "#ffffff",

          accent: "#f59e0b",
          "accent-focus": "#d97706",
          "accent-content": "#ffffff",

          neutral: "#e5e7eb",
          "neutral-focus": "#d1d5db",
          "neutral-content": "#1f2937",

          "base-100": "#ffffff",
          "base-200": "#f9fafb",
          "base-300": "#f3f4f6",
          "base-content": "#1f2937",

          info: "#3abff8",
          success: "#36d399",
          warning: "#fbbd23",
          error: "#f87272",

          "--rounded-box": "1rem",
          "--rounded-btn": "0.5rem",
          "--rounded-badge": "1.9rem",
          "--animation-btn": "0.25s",
          "--animation-input": "0.2s",
          "--btn-focus-scale": "0.95",
          "--border-btn": "1px",
          "--tab-border": "1px",
          "--tab-radius": "0.5rem",
        },
      },
      {
        glassLight: {
          primary: "#ff7f0a",
          "primary-focus": "#ff6600",
          "primary-content": "#ffffff",

          secondary: "#66cc99",
          "secondary-focus": "#4cbb88",
          "secondary-content": "#ffffff",

          accent: "#8b5cf6",
          "accent-focus": "#7c3aed",
          "accent-content": "#ffffff",

          neutral: "#f3f4f6",
          "neutral-focus": "#e5e7eb",
          "neutral-content": "#374151",

          "base-100": "#ffffff",
          "base-200": "#fafafa",
          "base-300": "#f5f5f5",
          "base-content": "#374151",

          info: "#60a5fa",
          success: "#34d399",
          warning: "#fbbf24",
          error: "#f87171",

          "--rounded-box": "1.5rem",
          "--rounded-btn": "0.75rem",
          "--rounded-badge": "2rem",
          "--animation-btn": "0.3s",
          "--animation-input": "0.25s",
          "--btn-focus-scale": "0.98",
          "--border-btn": "1px",
          "--tab-border": "1px",
          "--tab-radius": "0.75rem",
        },
      },
      "sunset",
    ],
    darkTheme: "modernDark",
    base: true,
    styled: true,
    utils: true,
    prefix: "",
    logs: false,
  },
  plugins: [daisyui, tailwindcssAnimate],
};
