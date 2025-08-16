import { queryOptions, useMutation } from "@tanstack/react-query";
import { TUpdateUserInfo, getUserInfo, updateUserInfo } from "./userInfo";
import { 
  updateUserEmail, 
  updateUserUsername, 
  updateUserPassword,
  UpdateEmailRequest,
  UpdateUsernameRequest,
  UpdatePasswordRequest
} from "./auth";
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userInfo',token] });
      onSuccessCallback();
     
    },
    onError: (error) => {
      console.error('Mutation error:', error.message);
      if (onErrorCallback) onErrorCallback(error);
    },
  });
}

// Email update mutation
export const useUpdateEmailMutation = (token: string, onSuccessCallback: () => void, onErrorCallback: (error: Error) => void) => {
  return useMutation({
    mutationKey: ['updateUserEmail'],
    mutationFn: (updateRequestBody: UpdateEmailRequest) => updateUserEmail(token, updateRequestBody),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userInfo', token] });
      onSuccessCallback();
    },
    onError: (error) => {
      console.error('Email update error:', error.message);
      if (onErrorCallback) onErrorCallback(error);
    },
  });
};

// Username update mutation
export const useUpdateUsernameMutation = (token: string, onSuccessCallback: () => void, onErrorCallback: (error: Error) => void) => {
  return useMutation({
    mutationKey: ['updateUserUsername'],
    mutationFn: (updateRequestBody: UpdateUsernameRequest) => updateUserUsername(token, updateRequestBody),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userInfo', token] });
      onSuccessCallback();
    },
    onError: (error) => {
      console.error('Username update error:', error.message);
      if (onErrorCallback) onErrorCallback(error);
    },
  });
};

// Password update mutation
export const useUpdatePasswordMutation = (token: string, onSuccessCallback: () => void, onErrorCallback: (error: Error) => void) => {
  return useMutation({
    mutationKey: ['updateUserPassword'],
    mutationFn: (updateRequestBody: UpdatePasswordRequest) => updateUserPassword(token, updateRequestBody),
    onSuccess: () => {
      onSuccessCallback();
    },
    onError: (error) => {
      console.error('Password update error:', error.message);
      if (onErrorCallback) onErrorCallback(error);
    },
  });
};