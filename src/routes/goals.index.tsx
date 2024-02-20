import { createFileRoute, redirect } from '@tanstack/react-router'
import { goalsQueryOptions } from '../api/goalQueryOptions';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Goal } from '../components/goal';
import { TGoal } from '../types';

export const Route = createFileRoute('/goals/')({
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
loader:({context:{auth,queryClient}})=>  queryClient.ensureQueryData(goalsQueryOptions(auth.token!)),
component: GoalsPage
})

function GoalsPage() {
  const {auth:{token}} = Route.useRouteContext();
  const sq = useSuspenseQuery(goalsQueryOptions(token!))
  const goals = sq.data
  return (
    goals
    .map((goal:TGoal) => <Goal key={goal.id} goal={goal}/>
    )
  )  
}