import { TGoalProgress } from "../types";

export const WeekGoalProgress = ({goalProgress}:{goalProgress:TGoalProgress}) => {
    return (<div className="flex flex-col">
        <h2>Week {goalProgress.weekNumber +1}</h2>

        <p>{goalProgress.feedback}</p>
        </div>)
}