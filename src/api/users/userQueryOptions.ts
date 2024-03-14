import { queryOptions, useMutation } from "@tanstack/react-query";
import { TUpdateUserInfo, getUserInfo, updateUserInfo } from "./userInfo"
import { queryClient } from "../../main";


export const userInfoQueryOptions =  (token:string,) => queryOptions({
    queryKey:['userInfo',token],
    queryFn:()=> getUserInfo(token)
})
export const useUpdateUserInfoMutation = (token:string, onSuccessCallback:()=>void, onErrorCallback:(error:Error)=>void) => {
  return useMutation({
    mutationKey: ['updateUserInfo'],
    mutationFn: (updateRequestBody:
      TUpdateUserInfo) => updateUserInfo(token, updateRequestBody),
    onSuccess: (data) => {
      onSuccessCallback();
      // Invalidate queries as needed
      console.log(data)
      queryClient.invalidateQueries({ queryKey: ['userInfo',token] });
    },
    onError: (error) => {
      console.error('Mutation error:', error.message);
      if (onErrorCallback) onErrorCallback(error);
    },
  });
}