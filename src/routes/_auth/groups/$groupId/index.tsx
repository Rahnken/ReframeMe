import { createFileRoute } from "@tanstack/react-router";
import { groupQueryIdOptions } from "../../../../api/groups/groupQueries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { TGoal, TGroup, TGroupUser } from "../../../../types";
import { goalsQueryOptions } from "../../../../api/goals/goalQueries";

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
  return (
    <>
      <div className="flex flex-wrap m-4">
        <div className="card card-bordered border-4 border-primary">
          <div className="card-body">
            <h2 className="card-title">{group.name}</h2>
            <p>{group.description}</p>
            <ul>
              {group.users.map((gUser: TGroupUser) => (
                <li key={gUser.id} className="indicator">
                  <div className="btn btn-secondary btn-wide place-items-center">
                    {gUser.user.username}
                  </div>
                  <span className="indicator-item badge badge-primary">
                    {gUser.role}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex gap-4">
          {goals
            .filter((goal) => sharedGoalIds.includes(goal.id))
            .map((goal: TGoal) => (
              <WeekGoal key={goal.id} goal={goal} group={group} />
            ))}
        </div>
      </div>
    </>
  );
}

function WeekGoal({ goal, group }: { goal: TGoal; group: TGroup }) {
  const userForGoal = group.users.find(
    (gUser: TGroupUser) => gUser.user_id === goal.user_id
  );
  const username = userForGoal ? userForGoal.user.username : "Unknown";

  return (
    <>
      <div className="indicator">
        <div className="indicator-item indicator-bottom indicator-center badge badge-secondary">
          {username}
        </div>
        <div className="card card-bordered max-h-50 border-4 bg-primary text-primary-content w-96 hover:border-6 hover:border-secondary ">
          <div className="card-body">
            <h2 className="card-title ">{goal.title}</h2>
            <p>{goal.description} </p>
          </div>
        </div>
      </div>
    </>
  );
}
