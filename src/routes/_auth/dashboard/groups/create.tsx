import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { TextInput } from "../../../../components/component-parts/TextInput";
import { useCreateGroupMutation } from "../../../../api/groups/groupQueries";
import { FormEvent, useState } from "react";
import { ErrorMessage } from "../../../../components/component-parts/ErrorMessage";
import { GroupCreateBody } from "../../../../api/groups/groups";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../../../../providers/auth.provider";

const CreateGroup = () => {
  const { user } = useAuth();

  const resetFormInputs = () => {
    setGroupNameInput("");
    setGroupDescriptionInput("");
  };

  const onSuccess = () => {
    resetFormInputs();
    navigate({ to: "/dashboard/groups" });
  };
  const onError = (e: Error) => {
    setServerError(e.message);
  };
  const navigate = useNavigate({ from: Route.fullPath });
  const mutation = useCreateGroupMutation(user!.token!, onSuccess, onError);

  const [serverError, setServerError] = useState("");
  const [groupNameInput, setGroupNameInput] = useState("");
  const [groupDescriptionInput, setGroupDescriptionInput] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const requestBody: GroupCreateBody = {
      name: groupNameInput,
      description: groupDescriptionInput,
    };
    mutation.mutate(requestBody);
  };

  return (
    <>
      {serverError && <div>{serverError}</div>}
      <form
        onSubmit={handleSubmit}
        className="bg-neutral-900 p-8 rounded-3xl my-5 w-3/4 mx-auto flex flex-col gap-2 items-center"
      >
        <TextInput
          labelText="Group Name"
          inputAttr={{
            name: "groupNameInput",
            placeholder: "Group Name",
            value: groupNameInput,
            onChange: (e) => setGroupNameInput(e.target.value),
            required: true,
          }}
        />
        <ErrorMessage message="Group Name not set correctly" show={false} />
        <TextInput
          labelText="Group Description"
          inputAttr={{
            name: "descriptionInput",
            placeholder: "description",
            value: groupDescriptionInput,
            onChange: (e) => setGroupDescriptionInput(e.target.value),
            required: true,
          }}
        />
        <ErrorMessage
          message="Group Description not set correctly"
          show={false}
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
export const Route = createFileRoute("/_auth/dashboard/groups/create")({
  component: CreateGroup,
});
