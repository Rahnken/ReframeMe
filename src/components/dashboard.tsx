import { Link } from "@tanstack/react-router";
import { useAuth } from "../providers/auth.provider";
import { useQuery } from "@tanstack/react-query";
import { LinkStyles, TGoal } from "../types";
import { Goal } from "./component-parts/goal";
import { goalsQueryOptions } from "../api/goals/goalQueries";

export function Dashboard() {
  const auth = useAuth();
  const user = auth.user;

  const { isSuccess, data } = useQuery(goalsQueryOptions(user!.token));

  return (
    <>
      <h3> Welcome to your Dashboard</h3>
      <h4>{user?.userInfo.username}</h4>
      <div className="flex items-center m-6">
        <Link to="/goals" className={LinkStyles}>
          Goals
        </Link>
        <Link to="/profile" className={LinkStyles}>
          Profile
        </Link>
      </div>
      <div className="md:container mx-auto flex gap-8">
        {isSuccess &&
          data
            .slice(0, 3)
            .map((goal: TGoal) => <Goal key={goal.id} goal={goal} />)}
      </div>
    </>
  );
}
