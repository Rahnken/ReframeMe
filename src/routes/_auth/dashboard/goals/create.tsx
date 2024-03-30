import { FormEvent, useState } from "react";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GoalCreateBody } from "../../../../api/goals/goals";
import { useAuth } from "../../../../providers/auth.provider";

import { useCreateGoalMutation } from "../../../../api/goals/goalQueries";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ErrorMessage } from "../../../../components/component-parts/ErrorMessage";
import { TextInput } from "../../../../components/component-parts/TextInput";
import { useSuspenseQuery } from "@tanstack/react-query";
import { groupQueryOptions } from "../../../../api/groups/groupQueries";
import { TGroup } from "../../../../types";

const CreateGoal = () => {
  const { user } = useAuth();

  const resetFormInputs = () => {
    setTitleInput("");
    setDescriptionInput("");
    setIsPrivateInput(false);
    setWeeklyTrackingTotalInput(0);
    setIsLoading(false);
  };

  const onSuccess = () => {
    resetFormInputs();
    navigate({ to: "/dashboard/goals" });
  };
  const onError = (e: Error) => {
    setServerError(e.message);
  };
  const { data: groups }: { data: TGroup[] } = useSuspenseQuery(
    groupQueryOptions(user!.token!)
  );

  const navigate = useNavigate({ from: Route.fullPath });
  const mutation = useCreateGoalMutation(user!.token!, onSuccess, onError);

  const [titleInput, setTitleInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [descriptionInput, setDescriptionInput] = useState("");
  const [isPrivateInput, setIsPrivateInput] = useState(false);
  const [weeklyTrackingTotalInput, setWeeklyTrackingTotalInput] = useState(0);
  const [serverError, setServerError] = useState("");
  const [sharedToGroup, setSharedToGroup] = useState<TGroup[]>([]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const requestBody: GoalCreateBody = {
      title: titleInput,
      description: descriptionInput,
      isPrivate: isPrivateInput,
      weeklyTrackingTotal: weeklyTrackingTotalInput,
    };
    mutation.mutate(requestBody);
  };

  function handleGroupChange(group: TGroup): void {
    if (sharedToGroup.some((g) => g.id === group.id)) {
      setSharedToGroup(sharedToGroup.filter((g) => g.id !== group.id));
    } else {
      setSharedToGroup([...sharedToGroup, group]);
    }
  }

  return (
    <>
      {serverError && <div>{serverError}</div>}
      <form
        onSubmit={handleSubmit}
        className="bg-neutral-900 p-8 rounded-3xl my-5 w-3/4 mx-auto flex flex-col gap-2 items-center"
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
        <div className="form-control">
          <h4>Share to Groups:</h4>
          {groups.map((group: TGroup) => (
            <label className="label cursor-pointer" key={group.id}>
              <span className="label-text p-3">{group.name}</span>
              <input
                type="checkbox"
                className="toggle"
                checked={sharedToGroup.some((g) => g.id === group.id)}
                onChange={() => handleGroupChange(group)}
              />
            </label>
          ))}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-primary text-primary-content font-semibold rounded-md self-center px-4 py-2 w-40 hover:bg-primary-content hover:text-primary disabled:bg-gray-600"
        >
          {"Create"} <FontAwesomeIcon icon={faCirclePlus} />
        </button>
      </form>
    </>
  );
};

export const Route = createFileRoute("/_auth/dashboard/goals/create")({
  component: CreateGoal,
});
