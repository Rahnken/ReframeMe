import { faCheck, faFaceFrown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "@tanstack/react-router";
import { TGoal, buttonStyles } from "../../types";
import { ProgressBar } from "./progress-bar";
import { useAuth } from "../../providers/auth.provider";
import { useUpdateGoalMutation } from "../../api/goals/goalQueries";

export function Goal({ goal }: { goal: TGoal }) {
  const { user } = useAuth();

  const mutation = useUpdateGoalMutation(user!.token, goal.id);

  return (
    <div className="p-4 rounded-xl flex flex-col mx-auto w-128 bg-slate-700 m-2 gap-3">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-primary-700 text-3xl font-subHeaders">
          <Link
            to="/goals/$goalId"
            mask={{ to: `/goals/${goal.title.replaceAll(" ", "")}` }}
            params={{ goalId: goal.id }}
          >
            {goal.title}
          </Link>
        </h1>
        <button
          type="button"
          className={buttonStyles}
          onClick={() => {
            console.log("Button pressed", {
              id: goal.id,
              isPrivate: !goal.isPrivate,
            });
            mutation.mutate({ id: goal.id, isPrivate: !goal.isPrivate });
          }}
        >
          {goal.isPrivate ? "Share" : "Unshare"}
        </button>
      </div>
      <div className="mx-auto p-5 bg-secondary-800 rounded-lg">
        <p className="text-slate-300 font-subHeaders border-b-2 text-center border-b-slate-300 text-3xl">
          {goal.description}
        </p>
        <div className="flex flex-wrap">
          {goal.goalWeeks
            .sort((a, b) => a.weekNumber - b.weekNumber)
            .map((weekProgress) => (
              <div
                className="text-slate-300 text-center border-b-2 border-white"
                key={weekProgress.id}
              >
                Week {weekProgress.weekNumber + 1}
                {weekProgress.targetAmount > 1 ? (
                  <ProgressBar
                    key={weekProgress.id}
                    completedAmount={weekProgress.completedAmount}
                    totalAmount={weekProgress.targetAmount}
                  />
                ) : (
                  <div className="min-w-20  h-10 text-2xl m-3">
                    {weekProgress.completedAmount === 1 ? (
                      <FontAwesomeIcon icon={faCheck} />
                    ) : (
                      <FontAwesomeIcon icon={faFaceFrown} />
                    )}{" "}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
