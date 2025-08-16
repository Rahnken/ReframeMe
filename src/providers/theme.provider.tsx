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
  "modernDark",
  "modernLight",
  "glassLight",
  "sunset",
]);

export type ThemeType = z.infer<typeof ThemeTypeSchema>;

export type ThemeContextType = {
  theme: ThemeType;
  updateTheme: (newTheme: ThemeType) => void; // Add updateTheme function to context
};

export const ThemeContext = createContext<ThemeContextType | null>(null);

const getDefaultTheme = (): ThemeType => {
  // Check user's browser preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return "modernDark";
  } else {
    return "modernLight";
  }
};

const resetThemeDefault = () => {
  const defaultTheme = getDefaultTheme();
  localStorage.setItem("theme", defaultTheme);
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
  const [theme, setTheme] = useState<ThemeType>(getDefaultTheme());

  useEffect(() => {
    const storedTheme = getThemeFromLocalStorage();
    if (storedTheme) {
      updateTheme(storedTheme);
    } else {
      // No stored theme, use system preference
      const defaultTheme = getDefaultTheme();
      updateTheme(defaultTheme);
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't manually selected a theme
      const hasStoredTheme = localStorage.getItem("theme");
      if (!hasStoredTheme) {
        const newTheme = e.matches ? "modernDark" : "modernLight";
        updateTheme(newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
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
    
    // Apply dark class for dark themes
    const isDarkTheme = newTheme === "modernDark" || newTheme === "sunset";
    if (isDarkTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
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
