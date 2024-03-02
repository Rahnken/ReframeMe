import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SignInRequest, signInUser } from "../api/users/auth";
import { useMutation } from "@tanstack/react-query";
import { TextInput } from "./component-parts/TextInput";
import { useState } from "react";
import { ErrorMessage } from "./component-parts/ErrorMessage";
import { useNavigate } from "@tanstack/react-router";
import {
  validateUsernameInput,
  validatePasswordInput,
} from "../utils/validationUtils";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../providers/auth.provider";
import { flushSync } from "react-dom";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverMessage, setServerMessage] = useState(""); // Use this state to hold server messages
  const usernameValidState = validateUsernameInput(username);
  const passwordValidState = validatePasswordInput(password);
  const navigate = useNavigate();
  const authContext = useAuth();

  const usernameErrorMessage =
    usernameValidState.error?.flatten().formErrors[0];
  const passwordErrorMessage =
    passwordValidState.error?.flatten().formErrors[0];

  const mutation = useMutation({
    mutationKey: ["signInUser"],
    mutationFn: (body: SignInRequest) => signInUser(body),
    onSuccess: (data) => {
      flushSync(() => {
        localStorage.setItem("user", JSON.stringify(data));
        authContext.login(data);
      });
      setIsSubmitted(false);
      navigate({ to: "/dashboard" });
    },
    onError: (error) => {
      setServerMessage(error.message || "An error occurred");
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);
    setServerMessage(""); // Clear previous messages
    if (usernameValidState.success && passwordValidState.success) {
      const requestBody: SignInRequest = { username, password };
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

      <form
        onSubmit={handleSubmit}
        className="bg-neutral-900 p-8 rounded-3xl my-5 w-3/4 mx-auto flex flex-col items-center"
      >
        {serverMessage && (
          <ErrorMessage
            message={serverMessage}
            show={serverMessage.length > 0}
          />
        )}
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
          labelText={"Password"}
          inputAttr={{
            name: "password",
            placeholder: "password",
            type: "password",
            value: password,
            onChange: (e) => setPassword(e.target.value),
          }}
        />
        <ErrorMessage
          message={passwordErrorMessage || ""}
          show={isSubmitted && !passwordValidState.success}
        />

        <button
          type="submit"
          className="bg-primary-600 text-slate-100 font-semibold rounded-md self-center px-4 py-2 w-40 hover:bg-slate-800 disabled:bg-gray-600"
        >
          {"Login"} <FontAwesomeIcon icon={faRightToBracket} />{" "}
        </button>
      </form>
    </div>
  );
};
