
const BASE_URL = import.meta.env.VITE_API_BASE_URL!+"/goals"

export const getAllGoalsQuery = async (token:string) => {
   return await fetch(BASE_URL,{
    headers:{Authorization:`Bearer ${token}`}   })
    .then(response => response.json())
}
export const getGoalById = async (token:string,goalId:string)=>{

    const res = await fetch(`${BASE_URL}/${goalId}`,{
        headers:{Authorization:`Bearer ${token}`}
    }).then(response => response.json())
    console.log("res:",res)
    return res
}
export const updateGoalProgressById = async () =>{};
export const updateGoalById = async () => {};