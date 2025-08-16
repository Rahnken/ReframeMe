import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ThemeType, useThemeProvider } from "../../providers/theme.provider";

export const ThemeListButtons = ({
  updateProfileTheme,
}: {
  updateProfileTheme: (theme: ThemeType) => void;
}) => {
  const { theme: currentTheme } = useThemeProvider();
  const themes: ThemeType[] = [
    "modernDark",
    "modernLight",
    "glassLight",
    "sunset",
  ];
  const themeNames: { [key in ThemeType]: { name: string; isLight: boolean } } =
    {
      modernDark: { name: "Modern Dark", isLight: false },
      modernLight: { name: "Modern Light", isLight: true },
      glassLight: { name: "Glass Light", isLight: true },
      sunset: { name: "Sunset", isLight: false },
    };
  return (
    <div className="join join-vertical bg-primary rounded-lg">
      <h4 className="join-item text-primary-content p-4 font-subheaders text-lg text-center">
        {" "}
        Set Theme to
      </h4>
      {themes.map((theme) => (
        <button
          key={theme}
          className={`btn btn-primary join-item ${currentTheme === theme ? "btn-neutral" : ""}`}
          onClick={() => {
            updateProfileTheme(theme);
          }}
        >
          {themeNames[theme].name}{" "}
          <FontAwesomeIcon icon={themeNames[theme].isLight ? "sun" : "moon"} />
        </button>
      ))}
    </div>
  );
};
