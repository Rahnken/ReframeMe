import { createFileRoute } from "@tanstack/react-router";
import {
  groupQueryIdOptions,
  useAddMemberToGroupMutation,
} from "../../../../api/groups/groupQueries";
import { TGoal, TGroup, TGroupUser, TSharedGoal } from "../../../../types";
import { goalsQueryOptions } from "../../../../api/goals/goalQueries";
import { useState } from "react";
import { TextInput } from "../../../../components/component-parts/TextInput";
import { z } from "zod";

export const Route = createFileRoute("/_auth/groups/$groupId/")({
  loader: ({ context: { auth, queryClient }, params: { groupId } }) => {
    queryClient.ensureQueryData(groupQueryIdOptions(auth.user!.token, groupId));
    queryClient.ensureQueryData(goalsQueryOptions(auth.user!.token));
  },
  component: SpecificGroup,
});

function SpecificGroup() {
  const {
    auth: { user: authUser },
    queryClient,
  } = Route.useRouteContext();

  const { groupId } = Route.useParams();

  const group = queryClient.getQueryData([
    "groups",
    authUser!.token,
    groupId,
  ]) as TGroup;
  // const goals = queryClient.getQueryData(["goals", authUser!.token]) as TGoal[];
  const sharedGoalIds = group.sharedGoals.map(
    (sharedGoal) => sharedGoal.goal_id
  );
  const [emailInput, setEmailInput] = useState("");
  const validEmail = z.string().email();
  const emailInputValid = validEmail.safeParse(emailInput).success;
  const adminUser = group.users.find((user) => user.role === "ADMIN")?.user;
  const [currentWeek, setCurrentWeek] = useState(0);

  const openModal = (id: string) => () => {
    const modal = document.getElementById(id) as HTMLDialogElement;
    modal.showModal();
  };
  const closeModal = (id: string) => () => {
    const modal = document.getElementById(id) as HTMLDialogElement;
    modal.close();
  };
  const mutation = useAddMemberToGroupMutation(
    authUser!.token,
    groupId,
    () => {
      alert("Member added successfully");
      closeModal("add-member-dialog")();
    },
    (e) => console.error("Mutation error:", e.message)
  );

  const handleModalSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newEmail = formData.get("newEmail") as string;

    if (emailInputValid) {
      mutation.mutate([{ user_email: newEmail, role: "MEMBER" }]);
    }
  };

  return (
    <>
      <div className="drawer lg:drawer-open mx-4">
        <input id="group-drawer" type="checkbox" className="drawer-toggle" />
        <label
          htmlFor="group-drawer"
          className="btn btn-primary drawer-button lg:hidden"
        >
          Open Group Options
        </label>

        <div className="drawer-content flex flex-col mx-4">
          <div className="">
            <h2 className="font-headers text-3xl text-center mb-5 underline  ">
              Group Goals
            </h2>
            <div className="flex justify-center items-center gap-4">
              <button
                className="btn btn-secondary disabled:btn-outline  "
                disabled={currentWeek === 0}
                onClick={() => setCurrentWeek(currentWeek - 1)}
              >
                Previous Week
              </button>
              <h4 className="font-bold text-xl">Week {currentWeek + 1}</h4>
              <button
                className="btn btn-secondary disabled:btn-outline  "
                disabled={currentWeek === 11}
                onClick={() => setCurrentWeek(currentWeek + 1)}
              >
                Next Week
              </button>
            </div>
            <div className="flex gap-4">
              {group.sharedGoals.map((sharedGoal: TSharedGoal) => (
                <WeekGoal
                  key={sharedGoal.goal.id}
                  goal={sharedGoal.goal}
                  group={group}
                  currentWeek={currentWeek}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="drawer-side ">
          <label
            htmlFor="group-drawer"
            className="drawer-overlay"
            aria-label="Close"
          ></label>
          <div className="card card-bordered border-4 border-primary">
            <div className="card-body  ">
              <div className="join join-vertical text-center">
                <h2 className="text-2xl font-bold join-item p-4 bg-secondary rounded-md text-secondary-content">
                  {group.name}
                </h2>
                <p className="bg-secondary text-primary-content join-item">
                  {group.description}
                </p>
              </div>
              <h3> Group Members</h3>
              <small>
                {" "}
                Filter Goals by member by selecting them in the list
              </small>
              <div className="flex flex-col gap-3">
                {group.users.map((gUser: TGroupUser) => (
                  <div key={gUser.id} className="indicator">
                    <div className="btn btn-secondary btn-wide place-items-center">
                      {gUser.user.username}
                      {gUser.role === "ADMIN" && (
                        <span className="indicator-item badge badge-primary">
                          {gUser.role}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {authUser?.userInfo.username === adminUser?.username && (
              <div className="card-actions p-3 justify-end">
                <button className="btn btn-primary">Edit Group</button>
                <button
                  className="btn btn-primary"
                  onClick={openModal("add-member-dialog")}
                >
                  Add Members
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <dialog id="add-member-dialog" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add a new Member</h3>
          <div className="modal-action">
            <form
              className="flex flex-col gap-4"
              method="dialog"
              onSubmit={handleModalSubmit}
            >
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={() => closeModal("add-member-dialog")()}
              >
                ✕
              </button>
              <TextInput
                labelText="New Member Email"
                inputAttr={{
                  name: "newEmail",
                  type: "email",
                  value: emailInput,
                  onChange: (e) => setEmailInput(e.target.value),
                  placeholder: "newEmail",
                }}
              />

              <button className="btn btn-secondary" disabled={!emailInputValid}>
                Add Members
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}

function WeekGoal({
  goal,
  group,
  currentWeek,
}: {
  goal: TGoal;
  group: TGroup;
  currentWeek: number;
}) {
  const userForGoal = group.users.find(
    (gUser: TGroupUser) => gUser.user_id === goal.user_id
  );
  const username = userForGoal ? userForGoal.user.username : "Unknown";
  return (
    <>
      <div className="indicator">
        <span className="indicator-item indicator-bottom indicator-right badge badge-secondary bottom-6 right-16">
          {username}
        </span>
        <div className="card card-bordered max-h-50 border-4 bg-primary text-primary-content w-64 hover:border-6 hover:border-secondary ">
          <div className="card-body">
            <h2 className="card-title ">{goal.title}</h2>
            <p>{goal.description} </p>
            <progress
              className="progress progress-secondary w-42 border-2 inset-2 border-base-300 h-12 "
              value={goal.goalWeeks[currentWeek].completedAmount}
              max={goal.goalWeeks[currentWeek].targetAmount}
            ></progress>
            <p className="text-center">
              {goal.goalWeeks[currentWeek].completedAmount} /{" "}
              {goal.goalWeeks[currentWeek].targetAmount}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
