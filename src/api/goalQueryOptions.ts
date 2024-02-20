import { queryOptions } from "@tanstack/react-query";
import { getGoalById, getAllGoalsQuery } from "./goals";


export const goalsQueryOptions = (token:string) => queryOptions({
    queryKey:['goals',token],
    queryFn:()=>getAllGoalsQuery(token)
})
export const goalQueryIdOptions = (userToken:string,goalId:string) => queryOptions({
    queryKey:['goals',userToken,goalId],
    queryFn:()=>getGoalById(userToken,goalId)
})