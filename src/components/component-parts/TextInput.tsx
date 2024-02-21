import { ComponentProps } from "react";
const inputStyleClasses =
"text-secondary-300 placeholder-secondary-200 border-2 focus:border-sky-900 hover:border-sky-900 border-primary-600 p-2 rounded-md ";


export const TextInput = ({
  labelText,
  inputAttr,
}: {
  labelText: string;
  inputAttr: ComponentProps<"input">;
}) => {
  return (
    <div className="p-2 flex flex-col gap-2">
      <label htmlFor={inputAttr.name} className="self-start -translate-x-4  text-primary-500"> {labelText}</label>
      <input {...inputAttr} className={inputStyleClasses} />
    </div>
  );
};