import { createFileRoute } from "@tanstack/react-router";
import { groupQueryOptions } from "../../../../api/groups/groupQueries";
import { goalsQueryOptions } from "../../../../api/goals/goalQueries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { GroupsOverview } from "../../../../components/GroupsOverview";

export const Route = createFileRoute("/_auth/dashboard/groups/")({
  loader: async ({ context: { auth, queryClient } }) => {
    // Load both groups and user's goals to match shared goal data
    await Promise.all([
      queryClient.ensureQueryData(groupQueryOptions(auth.user!.token!)),
      queryClient.ensureQueryData(goalsQueryOptions(auth.user!.token!))
    ]);
  },
  component: GroupsPage,
});

function GroupsPage() {
  const {
    auth: { user },
  } = Route.useRouteContext();
  const groupsQuery = useSuspenseQuery(groupQueryOptions(user!.token!));
  const goalsQuery = useSuspenseQuery(goalsQueryOptions(user!.token!));
  
  const groups = groupsQuery.data;
  const userGoals = goalsQuery.data;

  return <GroupsOverview groups={groups} userGoals={userGoals} />;
}
