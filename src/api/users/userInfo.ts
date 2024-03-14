import { z } from "zod"
import { TUserInfo } from "../../types"

const BASE_URL = import.meta.env.VITE_API_BASE_URL+"/user/userInfo"

const updateUserInfoSchema = z.object({
    firstName:z.string().optional(),
    lastName:z.string().optional(),
    dateOfBirth:z.date().optional(),
    country:z.string().optional(),
    timezone:z.string().optional(),
    userSettings:z.object({
        userSetting_id:z.string(),
        theme:z.string(),
        profileComplete:z.boolean()
    }).optional()
})

type TUpdateUserInfo = z.infer<typeof updateUserInfoSchema>
export type {TUpdateUserInfo}

export const getUserInfo = async (token:string) : Promise<TUserInfo> => {
    return await fetch(BASE_URL,{
        headers:{Authorization:`Bearer ${token}`}   })
        .then(response => response.json())
}
export const updateUserInfo = async (token:string,updateRequestBody:TUpdateUserInfo) => {
        return await fetch(BASE_URL,{
            method:"PATCH",
            headers:{
                Authorization:`Bearer ${token}`,
                "Content-Type":"application/json"
            },
            body:JSON.stringify(updateRequestBody)
        }).then(response => response.json())
    };
