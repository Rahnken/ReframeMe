import { useSuspenseQuery } from "@tanstack/react-query";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { goalsQueryOptions } from "../../../../api/goals/goalQueries";
import { Goal } from "../../../../components/component-parts/goal";
import { TGoal } from "../../../../types";
import { GoalCard } from "../../../../components/component-parts/goal-card";

export const Route = createFileRoute("/_auth/dashboard/goals")({
  component: GoalsPage,
  loader: ({ context: { auth, queryClient } }) =>
    queryClient.ensureQueryData(goalsQueryOptions(auth.user!.token)),
});
function GoalsPage() {
  const {
    auth: { user },
  } = Route.useRouteContext();
  const sq = useSuspenseQuery(goalsQueryOptions(user!.token));
  const goals = sq.data;
  const currentPath = window.location.pathname;
  return (
    <>
      {currentPath === "/dashboard/goals" ? (
        <>
          <Outlet />
          <div className="flex flex-col items-end m-3">
            <div className="md:container mx-auto w-2/3 flex flex-wrap gap-4 mt-3">
              {goals.map((goal: TGoal) => (
                <Goal key={goal.id} goal={goal} />
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="flex">
          <div className="flex flex-col items-center w-1/3 gap-2 bg-primary rounded p-4 mx-auto ">
            {goals.map((goal: TGoal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
          <Outlet />
        </div>
      )}
    </>
  );
}
