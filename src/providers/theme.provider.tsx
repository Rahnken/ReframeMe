import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { z } from "zod";

// Define your ThemeType as a Zod schema
export const ThemeTypeSchema = z.enum([
  "coffee",
  "sunset",
  "reframeDark",
  "emerald",
  "reframeLight",
]);

export type ThemeType = z.infer<typeof ThemeTypeSchema>;

export type ThemeContextType = {
  theme: ThemeType;
  updateTheme: (newTheme: ThemeType) => void; // Add updateTheme function to context
};

export const ThemeContext = createContext<ThemeContextType | null>(null);

const resetThemeDefault = () => {
  localStorage.setItem("theme", "reframeDark");
};

const getThemeFromLocalStorage = (): ThemeType | null => {
  const themeFromLocalStorage = localStorage.getItem("theme");

  // Use Zod schema to validate the theme value
  const validation = ThemeTypeSchema.safeParse(themeFromLocalStorage);

  if (validation.success) {
    return validation.data;
  } else {
    resetThemeDefault();
    return null;
  }
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeType>("reframeDark");

  useEffect(() => {
    const storedTheme = getThemeFromLocalStorage();
    if (storedTheme) {
      updateTheme(storedTheme);
      document.documentElement.setAttribute("data-theme", storedTheme);
    }
  }, []);

  useEffect(() => {
    // This effect updates the HTML tag whenever the theme changes
    const storedTheme = getThemeFromLocalStorage();
    if (storedTheme !== theme && storedTheme !== null) {
      updateTheme(storedTheme);
    } else {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme); // Save the theme to local storage
    }
  }, [theme]);

  const updateTheme = (newTheme: ThemeType) => {
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        updateTheme, // Provide the updateTheme function to context consumers
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export function useThemeProvider() {
  const context = useContext(ThemeContext);
  if (!context)
    throw new Error("useTheme must be used within the ThemeProvider");
  return context;
}
