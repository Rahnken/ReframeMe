import { createFileRoute } from "@tanstack/react-router";
import { groupQueryIdOptions } from "../../../../api/groups/groupQueries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { TGoal, TGroup, TGroupUser } from "../../../../types";
import { goalsQueryOptions } from "../../../../api/goals/goalQueries";
import { useState } from "react";

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
  } = Route.useRouteContext();

  const { groupId } = Route.useParams();

  const { data: group }: { data: TGroup } = useSuspenseQuery(
    groupQueryIdOptions(authUser!.token, groupId)
  );
  const { data: goals }: { data: TGoal[] } = useSuspenseQuery(
    goalsQueryOptions(authUser!.token)
  );
  const sharedGoalIds = group.sharedGoals.map(
    (sharedGoal) => sharedGoal.goal_id
  );
  const adminUser = group.users.find((user) => user.role === "ADMIN")?.user;
  const [currentWeek, setCurrentWeek] = useState(0);

  return (
    <>
      <div className="drawer lg:drawer-open mx-4">
        <input id="group-drawer" type="checkbox" className="drawer-toggle" />
        <label
          htmlFor="group-drawer"
          className="btn btn-primary drawer-button lg:hidden"
        >
          Open drawer
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
                onClick={() => {
                  if (currentWeek != 0) setCurrentWeek(currentWeek - 1);
                }}
              >
                Previous Week
              </button>
              <h4 className="font-bold text-xl">Week {currentWeek + 1}</h4>
              <button
                className="btn btn-secondary disabled:btn-outline  "
                disabled={currentWeek === goals[0].goalWeeks.length - 1}
                onClick={() => {
                  if (currentWeek != goals[0].goalWeeks.length - 1)
                    setCurrentWeek(currentWeek + 1);
                }}
              >
                Next Week
              </button>
            </div>
            <div className="flex gap-4">
              {goals
                .filter((goal) => sharedGoalIds.includes(goal.id))
                .map((goal: TGoal) => (
                  <WeekGoal
                    key={goal.id}
                    goal={goal}
                    group={group}
                    currentWeek={currentWeek}
                  />
                ))}
            </div>
          </div>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="group-drawer"
            className="drawer-overlay"
            aria-label="Close"
          ></label>
          <div className="card card-bordered border-4 border-primary">
            <div className="card-body">
              <h2 className="card-title">{group.name}</h2>
              <p>{group.description}</p>
              <h3> Group Members</h3>
              <small>
                {" "}
                Filter Goals by member by selecting them in the list
              </small>
              <ul>
                {group.users.map((gUser: TGroupUser) => (
                  <li key={gUser.id} className="indicator">
                    <div className="btn btn-secondary btn-wide place-items-center">
                      {gUser.user.username}

                      <span className="indicator-item badge badge-primary">
                        {gUser.role}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {authUser?.userInfo.username === adminUser?.username && (
              <div className="card-actions p-3 justify-end">
                <button className="btn btn-primary">Edit Group</button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    const dialog = document.getElementById(
                      "add-member-dialog"
                    ) as HTMLDialogElement;
                    if (dialog) {
                      dialog.showModal();
                    }
                  }}
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
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">
            Press ESC key or click the button below to close
          </p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
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
              className="progress progress-secondary w-42 border-2 border-base-300 h-12 "
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
