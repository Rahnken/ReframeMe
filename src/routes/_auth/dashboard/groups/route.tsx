import { Outlet, createFileRoute } from "@tanstack/react-router";
import { groupQueryOptions } from "../../../../api/groups/groupQueries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { GroupCard } from "../../../../components/component-parts/group-card";
import { TGroup } from "../../../../types";

export const Route = createFileRoute("/_auth/dashboard/groups")({
  loader: ({ context: { auth, queryClient } }) =>
    queryClient.ensureQueryData(groupQueryOptions(auth.user!.token!)),
  component: GroupsPage,
});

function GroupsPage() {
  const {
    auth: { user },
  } = Route.useRouteContext();
  const sq = useSuspenseQuery(groupQueryOptions(user!.token!));
  const groups = sq.data;

  return (
    <>
      <div className="flex">
        <div className="flex flex-col items-start w-1/3 gap-2  p-4 bg-primary h-screen rounded">
          {groups.map((group: TGroup) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
        <Outlet />
      </div>
    </>
  );
}
