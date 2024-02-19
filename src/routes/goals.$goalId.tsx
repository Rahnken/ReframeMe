import { createFileRoute, redirect } from '@tanstack/react-router'
import { goalQueryIdOptions } from '../api/goalQueryOptions'

export const Route = createFileRoute('/goals/$goalId')({
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
    loader:({context:{auth,queryClient},params:{goalId}})=> {
        return queryClient.ensureQueryData(goalQueryIdOptions(auth.user!,goalId))
    },
  component: () => <div>Hello /goals/$goalId!</div>
})