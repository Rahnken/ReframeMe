import { queryOptions, useMutation } from "@tanstack/react-query";
import { getGoalById, getAllGoalsQuery, createGoal, GoalCreateBody } from "./goals";

import {queryClient} from "../../main"



export const goalsQueryOptions = (token:string) => queryOptions({
    queryKey:['goals',token],
    queryFn:()=>getAllGoalsQuery(token)
})
export const goalQueryIdOptions = (userToken:string,goalId:string) => queryOptions({
    queryKey:['goals',userToken,goalId],
    queryFn:()=>getGoalById(userToken,goalId)
})
export const useCreateGoalMutation = (token:string,body:GoalCreateBody) => { 
        return useMutation({
            mutationKey:['goals','create',token,body],
            mutationFn:() => createGoal(token,body),
            onSuccess:() => queryClient.invalidateQueries()
        })
}
