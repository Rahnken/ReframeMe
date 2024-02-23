import { Link, createFileRoute, redirect } from '@tanstack/react-router'
import { goalsQueryOptions } from '../../api/goals/goalQueryOptions';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Goal } from '../../components/component-parts/goal';
import { TGoal } from '../../types';

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
    <>
    <Link to="/goals/create" className="text-2xl rounded-md  p-3 hover:bg-secondary-600 hover:text-slate-100 text-primary-500 [&.active]:font-bold m-4"> Create New Goal</Link>
    
    {goals
    .map((goal:TGoal) => <Goal key={goal.id} goal={goal}/>
    )}
    </>
  )  
}