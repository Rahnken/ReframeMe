import { buttonStyles, invertedButtonStyles, TGoal } from "../../../types";
import { GoalAccordion } from "../../../components/component-parts/GoalAccordian";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute, redirect } from "@tanstack/react-router";
import {
  goalQueryIdOptions,
  useUpdateGoalMutation,
} from "../../../api/goals/goalQueries";

const SpecificGoal = () => {
  const {
    auth: { user },
  } = Route.useRouteContext();
  const { goalId } = Route.useParams();
  const sq = useSuspenseQuery(goalQueryIdOptions(user?.token, goalId));
  const goal: TGoal = sq.data;

  const onError = (e: Error) => {
    console.error(e.message);
  };

  const mutation = useUpdateGoalMutation(
    user!.token,
    goal.id,
    () => {},
    onError
  );
  return (
    <div className="p-4 rounded-xl flex flex-col mx-auto md:w-3/4 sm:w-1/2 bg-slate-700 m-2 gap-3">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-primary-700 text-3xl font-subHeaders">
          {" "}
          {goal.title}
        </h1>
        <div className="flex gap-2">
          <button
            type="button"
            className={goal.isPrivate ? buttonStyles : invertedButtonStyles}
            onClick={() => {
              mutation.mutate({ id: goal.id, isPrivate: !goal.isPrivate });
            }}
          >
            {goal.isPrivate ? "Share" : "Unshare"}
          </button>
          <Link
            className={buttonStyles}
            to="/goals/$goalId/edit"
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

export const Route = createFileRoute("/_auth/goals/$goalId")({
  beforeLoad: ({ context, location }) => {
    if (context.auth.authState !== "authenticated") {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  loader: ({ context: { auth, queryClient }, params: { goalId } }) =>
    queryClient.ensureQueryData(goalQueryIdOptions(auth.user?.token, goalId)),
  component: SpecificGoal,
});
