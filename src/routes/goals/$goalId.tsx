import { createFileRoute, redirect } from '@tanstack/react-router'
import { goalQueryIdOptions } from '../../api/goals/goalQueryOptions'
import { useSuspenseQuery } from '@tanstack/react-query'

import { buttonStyles,TGoal } from '../../types'
import { GoalAccordion } from '../../components/component-parts/GoalAccordian'

const SpecificGoal = () => {
  const {auth:{token}} = Route.useRouteContext();
  const {goalId} = Route.useParams();
  const sq = useSuspenseQuery(goalQueryIdOptions(token!,goalId))
  const goal:TGoal = sq.data
  return (
    <div className="p-4 rounded-xl flex flex-col mx-auto w-3/4 bg-slate-700 m-2 gap-3" >
      <div className="flex w-full items-center justify-between">
        <h1 className="text-primary-700 text-3xl font-subHeaders"> {goal.title}</h1>
        {goal.isPrivate 
        ? <button className={buttonStyles}> Share</button> 
        : <button className={buttonStyles} >Unshare</button>}
      </div>
      <div className="mx-auto p-5 bg-secondary-700 w-3/4  " >
      <p className="text-slate-300 font-subHeaders text-3xl">
        {goal.description}
      </p>
        <div className=""> 
          <GoalAccordion values={goal.goalWeeks.sort((a,b) => a.weekNumber - b.weekNumber)}/>
        </div>
      </div>
    </div>
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

