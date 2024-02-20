import { createFileRoute, redirect } from '@tanstack/react-router'
import { goalQueryIdOptions } from '../api/goalQueryOptions'
import { Goal } from '../components/goal'
import { useSuspenseQuery } from '@tanstack/react-query'




const SpecificGoal = () => {
  const {auth:{token}} = Route.useRouteContext();
  const {goalId} = Route.useParams();
  const sq = useSuspenseQuery(goalQueryIdOptions(token!,goalId))
  return (
    <Goal goal={sq.data}/>
  )  
  
}

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
  loader:({context:{auth,queryClient},params:{goalId}})=>  queryClient.ensureQueryData(goalQueryIdOptions(auth.token!,goalId)),
  component:  SpecificGoal
})

