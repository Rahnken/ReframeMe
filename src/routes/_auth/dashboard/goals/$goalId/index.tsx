import { TGoal } from "../../../../../types";
import { GoalAccordion } from "../../../../../components/component-parts/GoalAccordian";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { goalQueryIdOptions } from "../../../../../api/goals/goalQueries";

const SpecificGoal = () => {
  const {
    auth: { user },
  } = Route.useRouteContext();
  const { goalId } = Route.useParams();
  const sq = useSuspenseQuery(goalQueryIdOptions(user!.token, goalId));
  const goal: TGoal = sq.data;

  return (
    <div className="p-4 rounded-xl flex flex-col md:w-3/4 sm:w-1/2 bg-slate-700 mx-4 my-2 gap-3">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-primary-700 text-3xl font-subHeaders">
          {" "}
          {goal.title}
        </h1>
        <div className="flex gap-2">
          <Link
            className="btn btn-primary"
            to="/dashboard/goals/$goalId/edit"
            params={{ goalId: goal.id }}
          >
            Edit Goal
          </Link>
        </div>
      </div>
      <div className="mx-auto p-5 bg-secondary-700 w-4/5 rounded-xl ">
        <p className="text-slate-300 font-subHeaders text-3xl">
          {goal.description}
        </p>
        <div className="">
          <GoalAccordion
            values={goal.goalWeeks.sort((a, b) => a.weekNumber - b.weekNumber)}
          />
        </div>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/_auth/dashboard/goals/$goalId/")({
  parseParams: (params) => ({ goalId: params.goalId }),
  loader: ({ context: { auth, queryClient }, params: { goalId } }) =>
    queryClient.ensureQueryData(goalQueryIdOptions(auth.user!.token, goalId)),
  component: SpecificGoal,
});
