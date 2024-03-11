import { Link, createFileRoute } from "@tanstack/react-router";
import { groupQueryOptions } from "../../../api/groups/groupQueries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { GroupCard } from "../../../components/component-parts/group-card";
import { TGroup } from "../../../types";

export const Route = createFileRoute("/_auth/groups/")({
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
      <div className="flex flex-col items-end m-3">
        <Link to="/groups/create" className="btn btn-secondary">
          Create New Group
        </Link>

        <div className="md:container mx-auto w-2/3 flex flex-wrap gap-4 mt-3">
          {groups.map((group: TGroup) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      </div>
    </>
  );
}
