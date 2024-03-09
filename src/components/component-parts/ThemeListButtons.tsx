import { ThemeType, useThemeProvider } from "../../providers/theme.provider";

export const ThemeListButtons = () => {
  const { updateTheme } = useThemeProvider();
  const themes: ThemeType[] = ["coffee", "sunset", "reframeDark", "emerald"];
  return (
    <div className="join join-vertical bg-primary rounded-lg">
      <h4 className="join-item text-primary-content p-4 text-center">
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
          {theme}
        </button>
      ))}
    </div>
  );
};
