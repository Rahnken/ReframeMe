import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { useAuth } from "../../../../../providers/auth.provider";
import { goalQueryIdOptions } from "../../../../../api/goals/goalQueries";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  groupQueryIdOptions,
  useDeleteGroupMemberMutation,
  useDeleteGroupMutation,
  useUpdateGroupMutation,
} from "../../../../../api/groups/groupQueries";
import { TGroup, TGroupUser } from "../../../../../types";
import { useState } from "react";
import { TextInput } from "../../../../../components/component-parts/TextInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const Route = createFileRoute("/_auth/dashboard/groups/$groupId/edit")({
  loader: ({ context: { auth, queryClient }, params: { groupId } }) => {
    queryClient.ensureQueryData(
      groupQueryIdOptions(auth.user!.token!, groupId)
    );
    queryClient.ensureQueryData(goalQueryIdOptions(auth.user!.token!, groupId));
  },
  component: EditGroup,
});

function EditGroup() {
  const { user } = useAuth();
  const { groupId } = Route.useParams();
  const group: TGroup = useSuspenseQuery(
    groupQueryIdOptions(user!.token!, groupId)
  ).data;

  const [serverError, setServerError] = useState("");
  const [groupNameInput, setGroupNameInput] = useState(group.name);
  const [groupDescriptionInput, setGroupDescriptionInput] = useState(
    group.description
  );

  const resetFormInputs = () => {};
  const onDeleteSuccess = () => {
    resetFormInputs();
    navigate({ to: "/dashboard/groups" });
  };

  const onError = (e: Error) => {
    setServerError(e.message);
  };
  const navigate = useNavigate({ from: Route.fullPath });
  const deleteMutation = useDeleteGroupMutation(
    user!.token!,
    groupId,
    onDeleteSuccess,
    onError
  );
  const memberMutation = useUpdateGroupMutation(
    user!.token!,
    groupId,
    () => {},
    onError
  );
  const removeMemberMutation = useDeleteGroupMemberMutation(
    user!.token!,
    groupId,
    () => {},
    onError
  );

  const handleDeleteGroup = () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this group?"
    );
    if (!confirmDelete) return;
    deleteMutation.mutate();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const updateMemberRole = (userId: string, role: "ADMIN" | "MEMBER") => {
    const confirmUpdate = confirm(
      `Are you sure you want to update this user's role to ${role}?`
    );
    if (!confirmUpdate) return;
    memberMutation.mutate({ user_id: userId, role });
  };
  const removeMemberFromGroup = (userId: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to remove this user from the group?"
    );
    if (!confirmDelete) return;
    removeMemberMutation.mutate(userId);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="bg-neutral-900 p-8 rounded-3xl my-5 w-3/4 mx-auto flex flex-col gap-3 items-center"
      >
        {serverError && <div>{serverError}</div>}
        <button className="btn btn-error self-end" onClick={handleDeleteGroup}>
          Delete Group
        </button>
        <h1 className="font-headers text-3xl">Edit Group</h1>
        <TextInput
          labelText="Group Name"
          inputAttr={{
            name: "groupNameInput",
            placeholder: "Group Name",
            value: groupNameInput,
            onChange: (e) => {
              setGroupNameInput(e.target.value);
            },
            required: true,
          }}
        />
        <label className="form-control w-full max-w-sm">
          <div className="label">Group Description</div>
          <textarea
            className="textarea textarea-bordered w-full text-secondary placeholder-secondary/50"
            value={groupDescriptionInput}
            onChange={(e) => setGroupDescriptionInput(e.target.value)}
            required
            placeholder="Group Description"
          ></textarea>
        </label>
        <div className="form-control w-full ">
          <h4 className="font-subHeaders text-3xl text-center mx-4">
            {" "}
            Group Members
          </h4>
          <div className="divider"> </div>
          <div className="flex flex-col w-full justify-center items-center gap-2 my-1">
            {group.users.map((member: TGroupUser) => (
              <div
                key={member.id}
                className=" flex w-1/2 justify-between gap-2  "
              >
                <h4 className=" text-2xl ">
                  {member.user.username}
                  <span
                    className={` text-xl badge ${member.role === "ADMIN" ? "badge-primary" : "badge-accent"}  `}
                  >
                    {member.role}
                  </span>
                </h4>
                <div className="flex flex-shrink-0 items-center gap-2  ">
                  <button
                    className="btn btn-accent text-accent-content w-2/3"
                    onClick={() =>
                      updateMemberRole(
                        member.id,
                        member.role === "MEMBER" ? "ADMIN" : "MEMBER"
                      )
                    }
                  >
                    {member.role === "MEMBER" ? "Make Admin" : "Make Member"}
                  </button>
                  <button
                    className="btn btn-error w-1/3 text-error-content"
                    onClick={() => removeMemberFromGroup(member.id)}
                  >
                    <FontAwesomeIcon icon="trash" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </form>
    </>
  );
}
