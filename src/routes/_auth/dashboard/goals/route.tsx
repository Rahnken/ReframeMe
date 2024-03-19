import { useSuspenseQuery } from "@tanstack/react-query";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { goalsQueryOptions } from "../../../../api/goals/goalQueries";
import { Goal } from "../../../../components/component-parts/goal";
import { TGoal } from "../../../../types";

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
  return (
    <>
      <div className="flex flex-col items-end m-3">
        <Outlet />
        <div className="md:container mx-auto w-2/3 flex flex-wrap gap-4 mt-3">
          {goals.map((goal: TGoal) => (
            <Goal key={goal.id} goal={goal} />
          ))}
        </div>
      </div>
    </>
  );
}
