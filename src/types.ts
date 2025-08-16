
export type TGoalProgress = {
    id:string;
    goal_id:string;
    feedback:string | null;
    targetAmount:number;
    completedAmount:number;
    weekNumber:number;
    // Enhanced progress tracking fields
    achieved?: boolean;
    notes?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export type TGroupUser = {
    id:string;
    group_id:string;
    user_id:string;
    user:{
        username:string
    }
    role : "MEMBER" | "ADMIN"
}

export type TGroup = {
    id:string;
    name:string;
    description:string;
    users:TGroupUser[]
    sharedGoals:TSharedGoal[]
}

export type TSharedGoal = {
    id:string;
    goal_id:string;
    group_id:string;
    goal: TGoal;
}

export type TGoal = {
    id: string;
    title:string;
    description:string;
    isPrivate:boolean;
    user_id:string;
    goalWeeks: TGoalProgress[];
    // SMART goal fields
    specific?: string;
    measurable?: string;
    attainable?: string;
    relevant?: string;
    timeBound?: string;
    // Goal cycle fields (optional until backend is updated)
    startDate?: string;
    endDate?: string;
    cycleDuration?: number;
    currentWeek?: number;
    isActive?: boolean;
    daysRemaining?: number;
}
export type TUserInfo = {
    profile_id: string;
    user_id: string;
    firstName: string | null;
    lastName: string | null;
    dateOfBirth: Date | null;
    country: string | null;
    timezone: string | null;
    userSetting_id: string;
    userSettings : {
        userSetting_id:string;
        theme:string;
        profileComplete:boolean;
    }  

}

            
export const buttonStyles = "rounded-md p-3 hover:bg-brandPrimary-200 hover:text-slate-800 bg-brandPrimary-600 text-slate-200 font-bold"
export const invertedButtonStyles = "rounded-md p-3 hover:bg-brandSecondary-200 hover:text-slate-800 bg-brandSecondary-600 text-slate-200 font-bold"
export const LinkStyles =
    "text-2xl rounded-md  border-secondary border-2 p-3 hover:bg-brandSecondary-600 hover:text-slate-100 text-brandPrimary-500 [&.active]:font-bold m-4";

export const inputStyleClasses =
"text-secondary placeholder-brandSecondary-200 border-2 focus:border-sky-900 hover:border-sky-900 border-brandPrimary-600 p-2 rounded-md ";
