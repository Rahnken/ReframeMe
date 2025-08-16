import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Palette, Sun, Moon, Check } from "lucide-react";
import { ThemeType, useThemeProvider } from "../providers/theme.provider";
import { useState } from "react";

interface ThemeSelectorProps {
  updateProfileTheme: (theme: ThemeType) => Promise<void>;
}

export const ThemeSelector = ({ updateProfileTheme }: ThemeSelectorProps) => {
  const { theme: currentTheme } = useThemeProvider();
  const [isUpdating, setIsUpdating] = useState<ThemeType | null>(null);

  const handleThemeChange = async (theme: ThemeType) => {
    setIsUpdating(theme);
    try {
      await updateProfileTheme(theme);
    } finally {
      setIsUpdating(null);
    }
  };

  const themes: {
    key: ThemeType;
    name: string;
    description: string;
    isLight: boolean;
    colors: string;
  }[] = [
    {
      key: "modernDark",
      name: "Modern Dark",
      description: "Dark theme with orange & green accents",
      isLight: false,
      colors: "from-gray-900 via-orange-600 to-emerald-500",
    },
    {
      key: "sunset",
      name: "Sunset",
      description: "Warm sunset with orange highlights",
      isLight: false,
      colors: "from-gray-800 via-orange-500 to-rose-400",
    },
    {
      key: "modernLight",
      name: "Modern Light",
      description: "Bright theme with vibrant orange & green",
      isLight: true,
      colors: "from-orange-100 via-orange-500 to-emerald-400",
    },
    {
      key: "glassLight",
      name: "Glass Light",
      description: "Soft glassmorphism with brand colors",
      isLight: true,
      colors: "from-orange-50 via-orange-400 to-emerald-300",
    },
  ];

  return (
    <Card className="card-gradient-empty">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-200/50 to-pink-200/50 flex items-center justify-center">
            <Palette className="h-5 w-5 text-purple-600" />
          </div>
          Theme Selector
        </CardTitle>
        <CardDescription>
          Choose your preferred theme for the best experience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {themes.map((themeOption) => (
          <div
            key={themeOption.key}
            className={`relative p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer hover:shadow-md ${
              currentTheme === themeOption.key
                ? "border-primary bg-primary/5 shadow-md"
                : "border-border/20 bg-card hover:border-primary/30"
            } ${isUpdating === themeOption.key ? "opacity-75 cursor-wait" : ""}`}
            onClick={() => handleThemeChange(themeOption.key)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-16 h-10 rounded-lg bg-gradient-to-r ${themeOption.colors} border border-border/20 shadow-sm`}
                ></div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-subheaders">{themeOption.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {themeOption.isLight ? (
                        <>
                          <Sun className="h-3 w-3 mr-1" />
                          Light
                        </>
                      ) : (
                        <>
                          <Moon className="h-3 w-3 mr-1" />
                          Dark
                        </>
                      )}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {themeOption.description}
                  </p>
                </div>
              </div>

              {currentTheme === themeOption.key && (
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <Badge className="bg-primary">Active</Badge>
                </div>
              )}

              {isUpdating === themeOption.key && (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <Badge variant="secondary">Updating...</Badge>
                </div>
              )}
            </div>

            {currentTheme !== themeOption.key && (
              <Button
                variant="outline"
                size="sm"
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  handleThemeChange(themeOption.key);
                }}
              >
                Apply
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
