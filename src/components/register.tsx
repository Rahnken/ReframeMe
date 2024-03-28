import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UserCreateRequest, createUser } from "../api/users/auth";
import { useMutation } from "@tanstack/react-query";
import { TextInput } from "./component-parts/TextInput";
import { useState } from "react";
import { ErrorMessage } from "./component-parts/ErrorMessage";
import { useNavigate } from "@tanstack/react-router";
import {
  validateUsernameInput,
  validatePasswordInput,
  validateEmailInput,
} from "../utils/validationUtils";
import {
  faEye,
  faEyeSlash,
  faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";

export const RegisterUser = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverMessage, setServerMessage] = useState(""); // Use this state to hold server messages
  const usernameValidState = validateUsernameInput(username);
  const passwordValidState = validatePasswordInput(password);
  const confirmedPassword = password === confirmPassword;
  const emailValidState = validateEmailInput(email);
  const navigate = useNavigate();

  const usernameErrorMessage =
    usernameValidState.error?.flatten().formErrors[0];
  const passwordErrorMessage =
    passwordValidState.error?.flatten().formErrors[0];
  const emailErrorMessage = emailValidState.error?.flatten().formErrors[0];

  const mutation = useMutation({
    mutationKey: ["createUser"],
    mutationFn: (body: UserCreateRequest) => createUser(body),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onSuccess: (_data) => {
      setIsSubmitted(false);
      navigate({ to: "/login" });
    },
    onError: (error) => {
      // Handle error state, e.g., show error message from server
      setServerMessage(error.message || "An error occurred");
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);
    setServerMessage(""); // Clear previous messages

    const requestBody: UserCreateRequest = { username, password, email };
    if (
      emailValidState.success &&
      usernameValidState.success &&
      passwordValidState.success &&
      confirmedPassword
    ) {
      mutation.mutate(requestBody);
    }
  };

  return (
    <div className=" flex flex-col content-center">
      <img
        src="/ReframeMe_logo.svg"
        className="w-128 my-5 self-center"
        alt="Reframe Me Logo"
      />
      {serverMessage && <div>{serverMessage}</div>}
      <form
        onSubmit={handleSubmit}
        className="card gap-4 bg-base-200 text-primary p-8 my-5 w-1/2 mx-auto items-center"
      >
        <TextInput
          labelText={"Username"}
          inputAttr={{
            name: "username",
            placeholder: "username",
            value: username,
            onChange: (e) => setUsername(e.target.value),
          }}
        />
        <ErrorMessage
          message={usernameErrorMessage || ""}
          show={isSubmitted && !usernameValidState.success}
        />

        <TextInput
          labelText={"Email"}
          inputAttr={{
            name: "email",
            placeholder: "email",
            type: "email",
            value: email,
            onChange: (e) => setEmail(e.target.value),
          }}
        />
        <ErrorMessage
          message={emailErrorMessage || ""}
          show={isSubmitted && !emailValidState.success}
        />
        <div className="form-control w-full max-w-sm">
          <label className="input input-bordered flex items-center gap-2">
            Password
            <input
              type={!showPassword ? "password" : "text"}
              className="grow"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <PasswordIconSwap
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />
          </label>
        </div>
        <ErrorMessage
          message={passwordErrorMessage || ""}
          show={isSubmitted && !passwordValidState.success}
        />

        <div className="form-control w-full max-w-sm">
          <label className="input input-bordered flex items-center gap-2">
            Confirm Password
            <input
              type={!showPassword ? "password" : "text"}
              className="grow"
              placeholder="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <PasswordIconSwap
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />
          </label>
        </div>
        <ErrorMessage
          message={"Passwords must match exactly"}
          show={isSubmitted && !confirmedPassword}
        />

        <button
          type="submit"
          className="btn btn-primary text-slate-100 font-semibold  hover:bg-slate-800 disabled:bg-gray-600"
        >
          {"Register"} <FontAwesomeIcon icon={faRightToBracket} />{" "}
        </button>
      </form>
    </div>
  );
};

const PasswordIconSwap = ({
  showPassword,
  setShowPassword,
}: {
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <FontAwesomeIcon
      icon={showPassword ? faEyeSlash : faEye}
      onClick={() => setShowPassword(!showPassword)}
    />
  );
};
