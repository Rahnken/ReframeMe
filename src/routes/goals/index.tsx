import { Link, createFileRoute, redirect } from "@tanstack/react-router";
import { goalsQueryOptions } from "../../api/goals/goalQueries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Goal } from "../../components/component-parts/goal";
import { LinkStyles, TGoal } from "../../types";

export const Route = createFileRoute("/goals/")({
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
  loader: ({ context: { auth, queryClient } }) =>
    queryClient.ensureQueryData(goalsQueryOptions(auth.token!)),
  component: GoalsPage,
});

function GoalsPage() {
  const {
    auth: { token },
  } = Route.useRouteContext();
  const sq = useSuspenseQuery(goalsQueryOptions(token!));
  const goals = sq.data;
  return (
    <>
      <div className="flex items-center justify-center m-6">
        <Link to="/goals/create" className={LinkStyles}>
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
