
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

            
export const buttonStyles = "rounded-md p-3 hover:bg-primary-200 hover:text-slate-800 bg-primary-600 text-slate-700"
export const LinkStyles =
    "text-2xl rounded-md  border-secondary-400 border-2 p-3 hover:bg-secondary-600 hover:text-slate-100 text-primary-500 [&.active]:font-bold m-4";

