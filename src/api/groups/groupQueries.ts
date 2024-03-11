import { queryOptions, useMutation } from "@tanstack/react-query";
import { GroupCreateBody, createGroup, getAllGroupsQuery, getGroupById } from "./groups";
import { queryClient } from "../../main";



export const groupQueryOptions = (token:string) =>queryOptions({
    queryKey:["groups",token],
    queryFn:()=> getAllGroupsQuery(token)

})
export const groupQueryIdOptions = (token:string,groupId:string) => queryOptions({
    queryKey:["groups",token,groupId],
    queryFn:()=>getGroupById(token,groupId)
})

export const useCreateGroupMutation = (token:string,onSuccessCallback:()=>void,onErrorCallback:(error:Error)=>void) => {
  return useMutation({
    mutationKey: ["createGoalForUser"],
    mutationFn: (body: GroupCreateBody) => createGroup(token, body),
    onSuccess:()=>{
      queryClient.invalidateQueries({ queryKey: ["groups", token] });
      onSuccessCallback()
    },
    onError:(e:Error)=>{
      onErrorCallback(e)
    }
  })
}