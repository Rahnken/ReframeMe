import { Link, createFileRoute } from "@tanstack/react-router";
import { Goal } from "../../../components/component-parts/goal";
import { TGoal } from "../../../types";
import { useSuspenseQuery } from "@tanstack/react-query";
import { goalsQueryOptions } from "../../../api/goals/goalQueries";

export const Route = createFileRoute("/_auth/goals/")({
  loader: ({ context: { auth, queryClient } }) =>
    queryClient.ensureQueryData(goalsQueryOptions(auth.user!.token)),
  component: GoalsPage,
});

function GoalsPage() {
  const {
    auth: { user },
  } = Route.useRouteContext();
  const sq = useSuspenseQuery(goalsQueryOptions(user!.token));
  const goals = sq.data;
  return (
    <>
      <div className="flex items-center justify-center m-6">
        <Link to="/goals/create" className="btn btn-secondary">
          Create New Goal
        </Link>
      </div>
      <div className="flex flex-wrap">
        {goals.map((goal: TGoal) => (
          <Goal key={goal.id} goal={goal} />
        ))}
      </div>
    </>
  );
}
