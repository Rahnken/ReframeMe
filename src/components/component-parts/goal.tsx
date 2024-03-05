import { faCheck, faFaceFrown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "@tanstack/react-router";
import { TGoal } from "../../types";
import { useAuth } from "../../providers/auth.provider";
import { useUpdateGoalMutation } from "../../api/goals/goalQueries";

export function Goal({ goal }: { goal: TGoal }) {
  const { user } = useAuth();

  const mutation = useUpdateGoalMutation(
    user!.token,
    goal.id,
    () => {},
    (e) => {
      e;
    }
  );

  return (
    <div className="p-4 rounded-xl flex flex-col mx-auto min-w-128 max-w-128  m-2 gap-3">
      <div className="card bg-secondary  ">
        <div className="card-body">
          <div className="card-actions items-center justify-around">
            <h3 className="text-primary-content text-3xl card-title font-subHeaders font-medium">
              <Link
                to="/goals/$goalId"
                mask={{ to: `/goals/${goal.title.replaceAll(" ", "")}` }}
                params={{ goalId: goal.id }}
              >
                {goal.title}
              </Link>
            </h3>{" "}
            <button
              type="button"
              className="btn btn-primary"
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
          <div className="mx-auto p-5 rounded-lg">
            <p className=" text-2xl text-secondary-content border-y-2  text-center ">
              {goal.description}
            </p>
            <div className="flex flex-wrap mt-6 ">
              {goal.goalWeeks
                .sort((a, b) => a.weekNumber - b.weekNumber)
                .map((weekProgress) => {
                  const prog = (
                    (weekProgress.completedAmount / weekProgress.targetAmount) *
                    100
                  ).toFixed(0);

                  return (
                    <div
                      className=" text-center text-secondary-content flex flex-col mx-auto gap-2"
                      key={weekProgress.id}
                    >
                      Week {weekProgress.weekNumber + 1}
                      {weekProgress.targetAmount > 1 ? (
                        <div
                          key={weekProgress.id}
                          className="radial-progress bg-primary text-secondary-content border-4 border-primary"
                          style={{ "--value": prog, "--size": "4rem" }}
                          role="progressbar"
                        >
                          {prog}%
                        </div>
                      ) : (
                        <div className="min-w-[4.5rem] h-10 text-2xl m-2">
                          {weekProgress.completedAmount === 1 ? (
                            <FontAwesomeIcon icon={faCheck} />
                          ) : (
                            <FontAwesomeIcon icon={faFaceFrown} />
                          )}{" "}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
