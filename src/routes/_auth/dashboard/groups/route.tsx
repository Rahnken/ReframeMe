import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import { groupQueryOptions } from "../../../../api/groups/groupQueries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { GroupCard } from "../../../../components/component-parts/group-card";
import { TGroup } from "../../../../types";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const Route = createFileRoute("/_auth/dashboard/groups")({
  loader: ({ context: { auth, queryClient } }) =>
    queryClient.ensureQueryData(groupQueryOptions(auth.user!.token)),
  component: GroupsPage,
});

function GroupsPage() {
  const {
    auth: { user },
  } = Route.useRouteContext();
  const sq = useSuspenseQuery(groupQueryOptions(user!.token));
  const groups = sq.data;
  return (
    <>
      <div className="flex flex-col items-end">
        <Outlet />

        <div className="md:container mx-auto w-2/3 flex flex-wrap gap-4 mt-3">
          {groups.map((group: TGroup) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      </div>
    </>
  );
}
