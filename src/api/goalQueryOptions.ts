import { queryOptions } from "@tanstack/react-query";
import { getGoalById, goalQuery } from "./goals";
import { User } from "./auth";

export const goalsQueryOptions = (token:string) => queryOptions({
    queryKey:['goals',token],
    queryFn:()=>goalQuery(token)
})
export const goalQueryIdOptions = (user:User,goalId:string) => queryOptions({
    queryKey:['goals',user,goalId],
    queryFn:()=>getGoalById(user,goalId)
})