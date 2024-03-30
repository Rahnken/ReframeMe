import { queryOptions, useMutation } from "@tanstack/react-query";
import { GroupCreateBody, GroupMemberAddBody, addMembersToGroup, createGroup, deleteGroup, getAllGroupsQuery, getGroupById, removeUserFromGroup, updateUserRoleInGroup } from "./groups";
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
export const useUpdateGroupMutation = (token:string,groupId:string,onSuccessCallback:()=>void,onErrorCallback:(error:Error)=>void) => {
  return useMutation({
    mutationKey: ["updateGroup",token,groupId],
    mutationFn: (body:{user_id:string,role:"ADMIN"|"MEMBER"}) => updateUserRoleInGroup(token, groupId, body.user_id ,body.role),
    onSuccess:()=>{
      queryClient.invalidateQueries({ queryKey: ["groups", token] });
      onSuccessCallback()
    },
    onError:(e:Error)=>{
      onErrorCallback(e)
    }
  })
}

export const useDeleteGroupMemberMutation = (token:string,groupId:string,onSuccessCallback:()=>void,onErrorCallback:(error:Error)=>void) => {
  return useMutation({
    mutationKey: ["removeMemberFromGroup",token,groupId],
    mutationFn: (memberId:string) => removeUserFromGroup(token, groupId,memberId),
    onSuccess:()=>{
      queryClient.invalidateQueries({ queryKey: ["groups", token] });
      onSuccessCallback()
    },
    onError:(e:Error)=>{
      onErrorCallback(e)
    }
  })
}

export const useAddMemberToGroupMutation = (token:string,groupId:string,onSuccessCallback:()=>void,onErrorCallback:(error:Error)=>void) => {
  return useMutation({
    mutationKey: ["addMemberToGroup",token,groupId],
    mutationFn: (users: Array<GroupMemberAddBody>) => addMembersToGroup(token,groupId,users),
    onSuccess:()=>{
      queryClient.invalidateQueries({ queryKey: ["groups", token] });
      onSuccessCallback()
    },
    onError:(e:Error)=>{
      onErrorCallback(e)
    }
  })
}
export const useDeleteGroupMutation = (token:string,groupId:string,onSuccessCallback:()=>void,onErrorCallback:(error:Error)=>void) => {
  return useMutation({
    mutationKey: ["deleteGroup",token,groupId],
    mutationFn: () => deleteGroup(token, groupId),
    onSuccess:()=>{
      queryClient.invalidateQueries({ queryKey: ["groups", token] });
      onSuccessCallback()
    },
    onError:(e:Error)=>{
      onErrorCallback(e)
    }
  })
}