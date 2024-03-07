import { useThemeProvider } from "../../providers/theme.provider";

export const ThemeListButtons = () => {
  const { updateTheme } = useThemeProvider();
  return (
    <div className="join join-vertical bg-primary rounded-lg">
      <h4 className="join-item text-primary-content text-center">
        {" "}
        Set Theme to
      </h4>
      <button
        className="btn btn-primary join-item"
        onClick={() => {
          updateTheme("sunset");
        }}
      >
        Sunset
      </button>
      <button
        className="btn btn-primary  join-item"
        onClick={() => {
          updateTheme("coffee");
        }}
      >
        Coffee
      </button>
      <button
        className="btn btn-primary  join-item"
        onClick={() => {
          updateTheme("reframeDark");
        }}
      >
        Reframe Default
      </button>
    </div>
  );
};
