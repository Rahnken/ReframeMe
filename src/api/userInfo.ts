const BASE_URL = import.meta.env.VITE_API_BASE_URL+"/user/userInfo"

export const getUserInfo = async (token:string) => {
    return await fetch(BASE_URL,{
        headers:{Authorization:`Bearer ${token}`}   })
        .then(response => response.json())
}