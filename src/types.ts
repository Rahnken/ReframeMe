
export type TGoalProgress = {
    id:string;
    goal_id:string;
    feedback:string;
    targetAmount:number;
    completedAmount:number;
    weekNumber:number;
}


export type TGoal = {
    id: string;
    title:string;
    description:string;
    isPrivate:boolean;
    user_id:string;
    goalWeeks: TGoalProgress[];
}

            
export const buttonStyles = "rounded-md p-3 hover:bg-brandPrimary-200 hover:text-slate-800 bg-brandPrimary-600 text-slate-200 font-bold"
export const invertedButtonStyles = "rounded-md p-3 hover:bg-brandSecondary-200 hover:text-slate-800 bg-brandSecondary-600 text-slate-200 font-bold"
export const LinkStyles =
    "text-2xl rounded-md  border-secondary border-2 p-3 hover:bg-brandSecondary-600 hover:text-slate-100 text-brandPrimary-500 [&.active]:font-bold m-4";

export const inputStyleClasses =
"text-secondary placeholder-brandSecondary-200 border-2 focus:border-sky-900 hover:border-sky-900 border-brandPrimary-600 p-2 rounded-md ";
