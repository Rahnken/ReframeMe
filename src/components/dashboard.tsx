import { useAuth } from "../providers/auth.provider";
import { useQuery } from "@tanstack/react-query";
import { TGoal } from "../types";

import { goalsQueryOptions } from "../api/goals/goalQueries";
import { GroupCard } from "./component-parts/group-card";
import { DashboardGoalCard } from "./component-parts/dashboard-goal";
import { ThemeListButtons } from "./component-parts/ThemeListButtons";
type Group = { groupName: string; currentWeek: string };

export function Dashboard() {
  const auth = useAuth();
  const user = auth.user;

  const { isSuccess, data } = useQuery(goalsQueryOptions(user!.token));
  const groups: Group[] = [
    { groupName: "Group 1", currentWeek: "12" },
    { groupName: "Group 2", currentWeek: "12" },
    { groupName: "Group 3", currentWeek: "12" },
  ];

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
          {isSuccess &&
            data.map((goal: TGoal) => (
              <DashboardGoalCard key={goal.id} goal={goal} />
            ))}
        </div>
        <div className="flex flex-col gap-3 p-5">
          {isSuccess &&
            groups
              .slice(0, 3)
              .map((group: Group) => <GroupCard group={group} />)}
        </div>
      </div>
    </>
  );
}
