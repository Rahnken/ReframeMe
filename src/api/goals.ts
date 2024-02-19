import { User } from "./auth"

const BASE_URL = "http://localhost:4000/goals"

export const goalQuery = async (token:string) => {
   return await fetch(BASE_URL,{
    headers:{Authorization:`Bearer ${token}`}   })
    .then(response => response.json())
}
export const getGoalById = async (user:User,goalId:string)=>{
    return await fetch(`${BASE_URL}/${goalId}`,{
        headers:{Authorization:`Bearer ${user.token}`}
    })
}