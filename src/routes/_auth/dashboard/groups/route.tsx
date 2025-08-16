import { createFileRoute } from "@tanstack/react-router";
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold gradient-text">My Groups</h1>
        <div className="badge badge-secondary badge-lg">
          {groups.length} {groups.length === 1 ? 'Group' : 'Groups'}
        </div>
      </div>
      
      {groups.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-xl font-semibold mb-2">No groups yet</h3>
          <p className="text-base-content/60">
            Create your first group to collaborate with others
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group: TGroup) => (
            <div key={group.id} className="animate-fade-up">
              <GroupCard group={group} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
