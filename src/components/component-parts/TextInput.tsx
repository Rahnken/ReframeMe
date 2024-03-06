import { ComponentProps } from "react";

export const TextInput = ({
  labelText,
  inputAttr,
}: {
  labelText: string;
  inputAttr: ComponentProps<"input">;
}) => {
  return (
    <div className="form-control w-full max-w-sm">
      <label className="input input-bordered flex items-center gap-2">
        {labelText}
        <input
          type="text"
          className="placeholder-secondary text-secondary"
          {...inputAttr}
        />
      </label>
    </div>
  );
};
