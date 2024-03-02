import { ComponentProps } from "react";
import { inputStyleClasses } from "../../types";

export const TextInput = ({
  labelText,
  inputAttr,
}: {
  labelText: string;
  inputAttr: ComponentProps<"input">;
}) => {
  return (
    <div className="p-2 flex flex-col gap-2">
      <label
        htmlFor={inputAttr.name}
        className="self-start -translate-x-4  text-primary-500"
      >
        {" "}
        {labelText}
      </label>
      <input {...inputAttr} className={inputStyleClasses} />
    </div>
  );
};
