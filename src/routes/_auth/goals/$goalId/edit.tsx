import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState, FormEvent } from "react";
import { GoalUpdateBody } from "../../../../api/goals/goals";
import { ErrorMessage } from "../../../../components/component-parts/ErrorMessage";
import { TextInput } from "../../../../components/component-parts/TextInput";
import {
  goalQueryIdOptions,
  useUpdateGoalMutation,
} from "../../../../api/goals/goalQueries";
import { TGoal, inputStyleClasses } from "../../../../types";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSuspenseQuery } from "@tanstack/react-query";

const EditGoal = () => {
  const {
    auth: { user },
  } = Route.useRouteContext();
  const { goalId } = Route.useParams();
  const sq = useSuspenseQuery(goalQueryIdOptions(user.token!, goalId));
  const goal: TGoal = sq.data;
  const navigate = useNavigate({ from: Route.fullPath });

  const onSuccess = () => {
    resetFormInputs();
    navigate({ to: "/goals/$goalId", params: { goalId: goalId } });
  };
  const onError = (e: Error) => {
    setServerError(e.message);
  };

  const mutation = useUpdateGoalMutation(
    user!.token,
    goalId,
    onSuccess,
    onError
  );
  const resetFormInputs = () => {
    setTitleInput(goal.title);
    setDescriptionInput(goal.description);
    setIsPrivateInput(goal.isPrivate);
    setWeeklyTrackingTotalInput(goal.goalWeeks[0].targetAmount);
    setServerError("");
  };

  const [titleInput, setTitleInput] = useState(goal.title);
  const [descriptionInput, setDescriptionInput] = useState(goal.description);
  const [isPrivateInput, setIsPrivateInput] = useState(goal.isPrivate);
  const [weeklyTrackingTotalInput, setWeeklyTrackingTotalInput] = useState(
    goal.goalWeeks[0].targetAmount
  );
  const [serverError, setServerError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const requestBody: GoalUpdateBody = {
      id: goalId,
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
        <div className="p-2 flex flex-col gap-2">
          <label
            htmlFor="descriptionInput "
            className="self-start -translate-x-4  text-primary-500"
          >
            {"Description"}
          </label>
          <textarea
            name="descriptionInput"
            placeholder="description"
            value={descriptionInput}
            onChange={(e) => setDescriptionInput(e.target.value)}
            required
            className={inputStyleClasses}
          ></textarea>
        </div>

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
          className="bg-primary-600 text-slate-100 font-semibold rounded-md self-center px-4 py-2 w-40 hover:bg-slate-800 disabled:bg-gray-600"
        >
          {"Update"} <FontAwesomeIcon icon={faCirclePlus} />
        </button>
      </form>
    </>
  );
};

export const Route = createFileRoute("/_auth/goals/$goalId/edit")({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: EditGoal,
});
