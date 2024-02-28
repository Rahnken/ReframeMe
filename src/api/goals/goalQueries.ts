import { queryOptions,useMutation} from "@tanstack/react-query";
import { getGoalById, getAllGoalsQuery,updateGoalById, GoalUpdateBody, updateGoalProgressById, GoalProgressUpdateBody } from "./goals";
import { queryClient } from "../../main";

export const goalsQueryOptions = (token:string) => queryOptions({
    queryKey:['goals',token],
    queryFn:()=>getAllGoalsQuery(token)
})
export const goalQueryIdOptions = (userToken:string,goalId:string) => queryOptions({
    queryKey:['goals',userToken,goalId],
    queryFn:()=>getGoalById(userToken,goalId)
})

export const useUpdateGoalMutation = (userToken:string, goalId:string) => {
  return useMutation({
    mutationKey: ["goals", "updateGoal"],
    mutationFn: (body:GoalUpdateBody) => updateGoalById(userToken, body),
    onSuccess: () => {
      console.log("Success");
      queryClient.invalidateQueries({ queryKey: ["goals", "userGoals"] });
      queryClient.invalidateQueries({ queryKey: ["goals", userToken] });
      queryClient.invalidateQueries({ queryKey: ["goals", userToken, goalId] });
    },
    onError: (error) => {
      console.error("Mutation error:", error);
    },
    onSettled: () => {
      console.log("Mutation settled (either success or error)");
    },
  });
};
export const useUpdateGoalProgressMutation = (token:string, onSuccessCallback:()=>void, onErrorCallback:(error:Error)=>void) => {
  return useMutation({
    mutationKey: ['updateGoalProgress'],
    mutationFn: (updateRequestBody:
      GoalProgressUpdateBody) => updateGoalProgressById(token, updateRequestBody),
    onSuccess: () => {
      onSuccessCallback();
      // Invalidate queries as needed
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
    onError: (error) => {
      console.error('Mutation error:', error.message);
      if (onErrorCallback) onErrorCallback(error);
    },
  });
};

