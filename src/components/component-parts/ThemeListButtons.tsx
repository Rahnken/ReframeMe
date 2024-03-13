import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ThemeType, useThemeProvider } from "../../providers/theme.provider";

export const ThemeListButtons = () => {
  const { updateTheme } = useThemeProvider();
  const themes: ThemeType[] = [
    "reframeDark",
    "coffee",
    "sunset",
    "reframeLight",
    "emerald",
  ];
  const themeNames: { [key in ThemeType]: { name: string; isLight: boolean } } =
    {
      reframeDark: { name: "Reframe Dark", isLight: false },
      coffee: { name: "Coffee", isLight: false },
      sunset: { name: "Sunset", isLight: false },
      emerald: { name: "Emerald", isLight: true },
      reframeLight: { name: "Reframe Light", isLight: true },
    };
  return (
    <div className="join join-vertical bg-primary rounded-lg">
      <h4 className="join-item text-primary-content p-4 font-bold text-lg text-center">
        {" "}
        Set Theme to
      </h4>
      {themes.map((theme) => (
        <button
          className="btn btn-primary join-item"
          onClick={() => {
            updateTheme(theme);
          }}
        >
          {themeNames[theme].name}{" "}
          <FontAwesomeIcon icon={themeNames[theme].isLight ? "sun" : "moon"} />
        </button>
      ))}
    </div>
  );
};
