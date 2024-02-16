import { useContext } from "react"
import { AuthContext } from "../providers/auth.provider"



export const Dashboard =  () => {
    const authContext = useContext(AuthContext)
    const user = authContext.user
return(
<>
    <h3> Welcome to your Dashboard</h3> 
    <h4>{user?.userInfo.username}</h4>
</>
)}