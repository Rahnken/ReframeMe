import { createFileRoute, redirect, useNavigate} from "@tanstack/react-router";
import { TextInput } from "../../components/component-parts/TextInput";
import { ErrorMessage } from "../../components/component-parts/ErrorMessage";
import { FormEvent, useState } from "react";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GoalCreateBody, createGoal } from "../../api/goals/goals";
import { useAuth } from "../../providers/auth.provider";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../main";

const CreateGoal = () => {
  const { user } = useAuth();
  
  const navigate = useNavigate({ from: Route.fullPath });
  const mutation = useMutation({
    mutationKey: ["createGoalForUser"],
    mutationFn: (body: GoalCreateBody) => createGoal(user!.token, body),
    onSuccess: () => {
      resetFormInputs();
      queryClient.invalidateQueries({queryKey:['goals']})
      navigate({ to: "/goals" });
    },
    onError: (e) => {
      setServerError(e.message);
    },
  });

  const resetFormInputs = () => {
    setTitleInput("");
    setDescriptionInput("");
    setIsPrivateInput(false);
    setWeeklyTrackingTotalInput(0);
  };
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
          className="bg-primary-600 text-slate-100 font-semibold rounded-md self-center px-4 py-2 w-40 hover:bg-slate-800 disabled:bg-gray-600"
        >
          {"Create"} <FontAwesomeIcon icon={faCirclePlus} />
        </button>
      </form>
    </>
  );
};

export const Route = createFileRoute("/goals/create")({
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

  component: CreateGoal,
});
