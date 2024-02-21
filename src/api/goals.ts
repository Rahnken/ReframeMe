import { z } from "zod"

const BASE_URL = import.meta.env.VITE_API_BASE_URL!+"/goals"

const goalProgressRequestSchema =z.object({
    feedback:z.string().optional(),
    goal_id:z.string(),
    weekNumber:z.number().nonnegative(),
    targetAmount:z.number().optional(),
    completedAmount:z.number().optional()
});

const goalRequestSchema = z.object({
        title:z.string().optional(),
        goal_id:z.string(),
        description:z.string().optional(),
        isPrivate:z.boolean().optional()
    })

type GoalProgressUpdateBody = z.infer<typeof goalProgressRequestSchema>;
type GoalUpdateBody = z.infer<typeof goalRequestSchema>;

export type {GoalProgressUpdateBody,GoalUpdateBody}
export const getAllGoalsQuery = async (token:string) => {
   return await fetch(BASE_URL,{
    headers:{Authorization:`Bearer ${token}`}   })
    .then(response => response.json())
}
export const getGoalById = async (token:string,goalId:string)=>{
    return await fetch(`${BASE_URL}/${goalId}`,{
        headers:{Authorization:`Bearer ${token}`}
    }).then(response => response.json())
}
export const updateGoalProgressById = async (token:string,body:GoalProgressUpdateBody) =>{
    const requestBody = goalProgressRequestSchema.safeParse(body);
    if(!requestBody.success) throw new Error("Invalid request data")

    return await fetch(`${BASE_URL}/${body.goal_id}/${body.weekNumber}`,{
        method: "PATCH",
        body:JSON.stringify(requestBody.data),
        headers:{
            "Content-Type":"application/json",
            Authorization:`Bearer ${token}`
        }
    }).then(response => response.json())
    
};
export const updateGoalById = async (token:string,body:GoalUpdateBody) => {
    const requestBody = goalRequestSchema.safeParse(body);
    if(!requestBody.success) throw new Error("Invalid request data")

    return await fetch(`${BASE_URL}/${body.goal_id}`,{
        method: "PATCH",
        body:JSON.stringify(requestBody.data),
        headers:{
            "Content-Type":"application/json",
            Authorization:`Bearer ${token}`
        }
    }).then(response => response.json())
    
};