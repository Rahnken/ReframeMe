import { Link } from "@tanstack/react-router";
import { TGoal } from "../../types";

export const GoalCard = ({ goal }: { goal: TGoal }) => {
  return (
    <Link
      to="/dashboard/goals/$goalId"
      mask={{ to: `/dashboard/goals/${goal.title.replaceAll(" ", "")}` }}
      params={{ goalId: goal.id }}
      className="card card-bordered max-h-50 border-4 bg-secondary [&.active]:bg-neutral [&.active]:text-neutral-content text-secondary-content w-96 hover:border-6 hover:border-secondary "
    >
      <div className="card-body">
        <h2 className="card-title ">{goal.title}</h2>
        <p>{goal.description} </p>
      </div>
    </Link>
  );
};
