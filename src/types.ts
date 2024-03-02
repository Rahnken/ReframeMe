
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

            
export const buttonStyles = "rounded-md p-3 hover:bg-primary-200 hover:text-slate-800 bg-primary-600 text-slate-200 font-bold"
export const invertedButtonStyles = "rounded-md p-3 hover:bg-secondary-200 hover:text-slate-800 bg-secondary-600 text-slate-200 font-bold"
export const LinkStyles =
    "text-2xl rounded-md  border-secondary-400 border-2 p-3 hover:bg-secondary-600 hover:text-slate-100 text-primary-500 [&.active]:font-bold m-4";

export const inputStyleClasses =
"text-secondary-300 placeholder-secondary-200 border-2 focus:border-sky-900 hover:border-sky-900 border-primary-600 p-2 rounded-md ";
