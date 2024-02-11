import { zodValidator } from "@tanstack/zod-form-adapter";
import { useForm } from "@tanstack/react-form";
import { capitalize } from "../utils/stringUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { z } from "zod";
import { signInUser } from "../api/auth";

export const SignIn = () => {
  const signinForm = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      const response = await signInUser(value);
      console.log(response);
      // If success -> Dashboard
      if (response.token) console.log("Moving to Dashboard");
      // If Failure -> Stay here , show Error Message
      if (response.message) signinForm.state.errors.push(response.message);
    },
  });
  const inputStyleClasses =
    "text-secondary-300 placeholder-secondary-200 border-2 focus:border-sky-900 hover:border-sky-900 border-primary-600 p-2 rounded-md ";

  const errorStyle =
    "text-red-600 text-l bg-neutral-400 p-2 rounded-lg border-2 border-red-600 ";

  return (
    <div className=" flex flex-col content-center">
      <img
        src="/ReframeMe_logo.svg"
        className="w-128 my-5 self-center"
        alt="Reframe Me Logo"
      />

      <signinForm.Provider>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void signinForm.handleSubmit();
          }}
          className="bg-neutral-900 p-8 rounded-3xl my-5 w-3/4 mx-auto flex flex-col items-center"
        >
          {response && (
            <em role="alert" className={errorStyle}>
              {signinForm.state.errors.join(", ")}
            </em>
          )}
          <div className="p-2 w-3/4 flex flex-col ">
            <signinForm.Field
              name="username"
              validatorAdapter={zodValidator}
              validators={{
                onChange: z
                  .string()
                  .min(3, "Username must be at least 3 characters"),
                onChangeAsyncDebounceMs: 500,
                onChangeAsync: z.string().refine(
                  async (value) => {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    return !value.includes("error");
                  },
                  {
                    message: "No 'error' allowed in first name",
                  }
                ),
              }}
              children={(field) => {
                return (
                  <fieldset className="p-2 flex flex-col gap-2">
                    <label
                      className="self-start -translate-x-4 text-primary-600"
                      htmlFor={field.name}
                    >
                      {capitalize(field.name)}:
                    </label>
                    <input
                      className={inputStyleClasses}
                      placeholder={field.name}
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {field.state.meta.errors.length > 0 &&
                    field.state.value.length > 0 ? (
                      <em role="alert" className={errorStyle}>
                        {field.state.meta.errors.join(", ")}
                      </em>
                    ) : null}
                  </fieldset>
                );
              }}
            />
            <signinForm.Field
              name="password"
              validatorAdapter={zodValidator}
              validators={{
                onChange: z
                  .string()
                  .min(8, "Password must be at least 8 characters"),
                onChangeAsyncDebounceMs: 500,
                onChangeAsync: z.string().refine(
                  async (value) => {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    return !value.includes("error");
                  },
                  {
                    message: "No 'error' allowed in first name",
                  }
                ),
              }}
              children={(field) => {
                return (
                  <fieldset className="p-2 flex flex-col gap-2">
                    <label
                      className="self-start -translate-x-4  text-primary-500"
                      htmlFor={field.name}
                    >
                      {capitalize(field.name)}:
                    </label>
                    <input
                      className={inputStyleClasses}
                      placeholder={field.name}
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      type="password"
                    />
                    {field.state.meta.errors.length > 0 &&
                    field.state.value.length > 0 ? (
                      <em role="alert" className={errorStyle}>
                        {field.state.meta.errors.join(", ")}
                      </em>
                    ) : null}
                  </fieldset>
                );
              }}
            />
            <signinForm.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <button
                  type="submit"
                  className="bg-primary-600 text-slate-100 font-semibold rounded-md self-center px-4 py-2 w-40 hover:bg-slate-800 disabled:bg-gray-600"
                  disabled={!canSubmit}
                >
                  {isSubmitting ? (
                    "..."
                  ) : (
                    <>
                      {"Login"}{" "}
                      <FontAwesomeIcon icon="fa-solid fa-right-to-bracket" />{" "}
                    </>
                  )}
                </button>
              )}
            />
          </div>
        </form>
      </signinForm.Provider>
    </div>
  );
};
