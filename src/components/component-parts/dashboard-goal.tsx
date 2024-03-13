import { Link } from "@tanstack/react-router";
import { TGoal } from "../../types";

export const DashboardGoalCard = ({ goal }: { goal: TGoal }) => {
  return (
    <div className="card card-bordered max-h-50 border-4 bg-primary border-primary text-primary-content shadow w-96 hover:border-6 hover:border-base-300 ">
      <Link to="/goals/$goalId" params={{ goalId: goal.id }}>
        <div className="card-body">
          <h2 className="card-title ">{goal.title}</h2>
          <p>{goal.description} </p>
        </div>
      </Link>
    </div>
  );
};
