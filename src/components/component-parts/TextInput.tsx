import { ComponentProps } from "react";
import { useThemeProvider } from "../../providers/theme.provider";

export const TextInput = ({
  labelText,
  inputAttr,
}: {
  labelText: string;
  inputAttr: ComponentProps<"input">;
}) => {
  const { theme } = useThemeProvider();
  return (
    <div className="form-control w-full max-w-sm">
      <label className="input input-bordered flex items-center gap-2">
        {labelText}
        <input
          type="text"
          className={
            theme === "coffee"
              ? "placeholder-secondary-content/50 text-secondary-content"
              : "placeholder-secondary/50 text-secondary"
          }
          {...inputAttr}
        />
      </label>
    </div>
  );
};
