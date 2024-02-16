import { createFileRoute, redirect, useNavigate} from '@tanstack/react-router'
import { useAuth } from '../providers/auth.provider'


export const Route = createFileRoute('/dashboard')({
  beforeLoad: ({context,location}) =>{
      if(!context.auth.isAuthenticated) {
        throw redirect({
          to:"/login",
          search :{
            redirect:location.href,
          },
        })  
      }
    },
      component: Dashboard,
  

})

function Dashboard()  {
  const navigate = useNavigate({from:'/dashboard'})
  const auth = useAuth();
  const user = auth.user

  const handleLogout = () =>{
      auth.setUser(null)
      navigate({to:'/'
      })
  }
  
return(
<>
  <h3> Welcome to your Dashboard</h3> 
  <h4>{user?.userInfo.username}</h4>
  <div className="mt-4">
      <button
        type="button"
        onClick={handleLogout}
        className="bg-slate-500 text-white py-2 px-4 rounded-md"
      >
        Logout
      </button>
      </div>
</>
)}
