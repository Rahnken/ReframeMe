import { FormEvent, useState } from "react";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GoalCreateBody } from "../../../api/goals/goals";
import { useAuth } from "../../../providers/auth.provider";

import { useCreateGoalMutation } from "../../../api/goals/goalQueries";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ErrorMessage } from "../../../components/component-parts/ErrorMessage";
import { TextInput } from "../../../components/component-parts/TextInput";

const CreateGoal = () => {
  const { user } = useAuth();

  const resetFormInputs = () => {
    setTitleInput("");
    setDescriptionInput("");
    setIsPrivateInput(false);
    setWeeklyTrackingTotalInput(0);
  };

  const onSuccess = () => {
    resetFormInputs();
    navigate({ to: "/goals" });
  };
  const onError = (e: Error) => {
    setServerError(e.message);
  };

  const navigate = useNavigate({ from: Route.fullPath });
  const mutation = useCreateGoalMutation(user!.token, onSuccess, onError);

  const [titleInput, setTitleInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [isPrivateInput, setIsPrivateInput] = useState(false);
  const [weeklyTrackingTotalInput, setWeeklyTrackingTotalInput] = useState(0);
  const [serverError, setServerError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const requestBody: GoalCreateBody = {
      title: titleInput,
      description: descriptionInput,
      isPrivate: isPrivateInput,
      weeklyTrackingTotal: weeklyTrackingTotalInput,
    };
    mutation.mutate(requestBody);
  };

  return (
    <>
      {serverError && <div>{serverError}</div>}
      <form
        onSubmit={handleSubmit}
        className="bg-neutral-900 p-8 rounded-3xl my-5 w-3/4 mx-auto flex flex-col items-center"
      >
        <TextInput
          labelText="Title"
          inputAttr={{
            name: "titleInput",
            placeholder: "title",
            value: titleInput,
            onChange: (e) => setTitleInput(e.target.value),
            required: true,
          }}
        />
        <ErrorMessage message="Title not set correctly" show={false} />
        <TextInput
          labelText="Description"
          inputAttr={{
            name: "descriptionInput",
            placeholder: "description",
            value: descriptionInput,
            onChange: (e) => setDescriptionInput(e.target.value),
            required: true,
          }}
        />
        <ErrorMessage message="Description not set correctly" show={false} />
        <TextInput
          labelText="Weekly Tracking Total"
          inputAttr={{
            name: "weekTrackTotalInput",
            placeholder: "how many per week",
            value: weeklyTrackingTotalInput,
            inputMode: "numeric",
            type: "number",
            required: true,
            onChange: (e) =>
              setWeeklyTrackingTotalInput(parseInt(e.target.value)),
          }}
        />
        <ErrorMessage
          message="Weekly Tracking Total not set correctly"
          show={false}
        />
        <TextInput
          labelText="Share Goal ?"
          inputAttr={{
            name: "isPrivateInput",
            checked: isPrivateInput,
            type: "checkbox",
            onChange: (e) => setIsPrivateInput(e.target.checked),
          }}
        />
        <button
          type="submit"
          className="bg-primary text-slate-100 font-semibold rounded-md self-center px-4 py-2 w-40 hover:bg-slate-800 disabled:bg-gray-600"
        >
          {"Create"} <FontAwesomeIcon icon={faCirclePlus} />
        </button>
      </form>
    </>
  );
};

export const Route = createFileRoute("/_auth/goals/create")({
  component: CreateGoal,
});
