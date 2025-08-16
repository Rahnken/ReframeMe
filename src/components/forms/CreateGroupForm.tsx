import { FormEvent, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../providers/auth.provider";
import { useCreateGroupMutation } from "../../api/groups/groupQueries";

interface CreateGroupFormProps {
  onSuccess?: () => void;
}

export const CreateGroupForm = ({ onSuccess }: CreateGroupFormProps) => {
  const { user } = useAuth();
  const [nameInput, setNameInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const resetFormInputs = () => {
    setNameInput("");
    setDescriptionInput("");
    setIsLoading(false);
  };

  const handleSuccess = () => {
    resetFormInputs();
    onSuccess?.();
  };

  const handleError = (e: Error) => {
    setServerError(e.message);
    setIsLoading(false);
  };

  const mutation = useCreateGroupMutation(user!.token!, handleSuccess, handleError);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setServerError("");
    
    mutation.mutate({
      name: nameInput,
      description: descriptionInput,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {serverError && (
        <div className="alert alert-error shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{serverError}</span>
        </div>
      )}

      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Group Name</span>
        </label>
        <input
          type="text"
          placeholder="Enter group name"
          className="input input-bordered input-modern"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          required
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Description</span>
        </label>
        <textarea
          placeholder="Describe your group's purpose"
          className="textarea textarea-bordered input-modern min-h-[100px]"
          value={descriptionInput}
          onChange={(e) => setDescriptionInput(e.target.value)}
          required
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={() => {
            resetFormInputs();
            onSuccess?.();
          }}
          className="btn btn-ghost"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary btn-modern"
        >
          {isLoading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            <>
              Create Group
              <FontAwesomeIcon icon={faUserGroup} className="ml-2" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};