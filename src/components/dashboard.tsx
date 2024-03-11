import { useAuth } from "../providers/auth.provider";
import { useQuery } from "@tanstack/react-query";
import { TGoal, TGroup } from "../types";

import { goalsQueryOptions } from "../api/goals/goalQueries";
import { GroupCard } from "./component-parts/group-card";
import { DashboardGoalCard } from "./component-parts/dashboard-goal";
import { ThemeListButtons } from "./component-parts/ThemeListButtons";
import { groupQueryOptions } from "../api/groups/groupQueries";

export function Dashboard() {
  const auth = useAuth();
  const user = auth.user;

  const { isSuccess: goalsIsSuccess, data: goalData } = useQuery(
    goalsQueryOptions(user!.token)
  );
  const { isSuccess: groupIsSuccess, data: groupData } = useQuery(
    groupQueryOptions(user!.token)
  );

  return (
    <>
      <div className="flex gap-3 ">
        <div className="card card-bordered border-primary border-4 ml-4 bg-base-300  ">
          <div className="card-body">
            <h4 className="card-title">
              Welcome Back {user?.userInfo.username}
            </h4>
            <ThemeListButtons />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 rounded-md  p-2  content-start">
          {goalsIsSuccess &&
            goalData.map((goal: TGoal) => (
              <DashboardGoalCard key={goal.id} goal={goal} />
            ))}
        </div>
        <div className="flex flex-col gap-3 p-5">
          {groupIsSuccess &&
            groupData
              .slice(0, 3)
              .map((group: TGroup) => (
                <GroupCard key={group.id} group={group} />
              ))}
        </div>
      </div>
    </>
  );
}
