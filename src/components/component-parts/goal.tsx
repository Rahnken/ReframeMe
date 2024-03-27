import { faCheck, faFaceFrown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "@tanstack/react-router";
import { TGoal } from "../../types";
import React from "react";

export function Goal({ goal }: { goal: TGoal }) {
  return (
    <div className="card w-128 gap-1 p-7 max-w-128 bg-secondary-content">
      <div className="card-body bg-secondary/70 rounded-lg">
        <div className="card-actions items-center justify-around backdrop-opacity-20 rounded-md p-3 bg-black/50">
          <h3 className="text-primary text-3xl card-title  font-subHeaders font-medium">
            <Link to="/dashboard/goals/$goalId" params={{ goalId: goal.id }}>
              {goal.title}
            </Link>
          </h3>{" "}
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
                        className="radial-progress bg-primary border-2 border-primary"
                        style={
                          {
                            "--value": prog,
                            "--size": "4rem",
                            "--thickness": "8px",
                          } as React.CSSProperties
                        }
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
  );
}
