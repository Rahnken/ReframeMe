import { queryOptions,useMutation} from "@tanstack/react-query";
import { getGoalById, getAllGoalsQuery,updateGoalById, GoalUpdateBody, updateGoalProgressById, GoalProgressUpdateBody, GoalCreateBody, createGoal, deleteGoalById } from "./goals";
import { queryClient } from "../../main";

export const goalsQueryOptions = (token:string) => queryOptions({
    queryKey:['goals',token],
    queryFn:()=>getAllGoalsQuery(token)
})
export const goalQueryIdOptions = (userToken:string,goalId:string) => queryOptions({
    queryKey:['goals',userToken,goalId],
    queryFn:()=>getGoalById(userToken,goalId)
})

export const useCreateGoalMutation = (token:string,onSuccessCallback:()=>void,onErrorCallback:(error:Error)=>void) => {
  return useMutation({
    mutationKey: ["createGoalForUser"],
    mutationFn: (body: GoalCreateBody) => createGoal(token, body),
    onSuccess:()=>{
      queryClient.invalidateQueries({ queryKey: ["goals", "userGoals"] });
      queryClient.invalidateQueries({ queryKey: ["goals", token] });
      onSuccessCallback()
    },
    onError:(e:Error)=>{
      onErrorCallback(e)
    }
  })
}

export const useUpdateGoalMutation = (token:string, goalId:string,onSuccessCallback:()=>void,onErrorCallback:(error:Error)=>void) => {
  return useMutation({
    mutationKey: ["goals", "updateGoal"],
    mutationFn: (body:GoalUpdateBody) => updateGoalById(token, body),
    onSuccess: (data) => {
      console.log("Mutation success:", data);
      queryClient.invalidateQueries({ queryKey: ["goals", "userGoals"] });
      queryClient.invalidateQueries({ queryKey: ["goals", token] });
      queryClient.invalidateQueries({ queryKey: ["goals", token, goalId] });
      queryClient.invalidateQueries({ queryKey: ["groups",token] });
      queryClient.invalidateQueries({ queryKey: ["groups",token,data.sharedGoals.group_id] });
      onSuccessCallback()

    },
    onError: (error) => {
      console.error("Mutation error:", error);
      onErrorCallback(error)
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
export const useDeleteGoalMutation = (token:string, goalId:string, onSuccessCallback:()=>void, onErrorCallback:(error:Error)=>void) => {
  return useMutation({
    mutationKey: ['deleteGoal'],
    mutationFn: () => deleteGoalById(token, goalId),
    onSuccess: () => {
      onSuccessCallback();
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
    onError: (error) => {
      console.error('Mutation error:', error.message);
      onErrorCallback(error);
    },
  });
}


