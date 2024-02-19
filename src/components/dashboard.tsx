import { Link} from "@tanstack/react-router";
import { useAuth } from "../providers/auth.provider";
import { useQuery } from "@tanstack/react-query";
import { goalQuery } from "../api/goals";
import { TGoal, buttonStyles } from "../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faFaceFrown } from "@fortawesome/free-solid-svg-icons";

export function Dashboard()  {
    const auth = useAuth();
    const user = auth.user
  
    const {isSuccess,data} = useQuery({
      queryKey:['userGoals'],
      queryFn: () => goalQuery(user!.token)
    })
    
  return(
  <>
    <h3> Welcome to your Dashboard</h3> 
    <h4>{user?.userInfo.username}</h4>
    <Link to="/goals" className="text-2xl rounded-md  p-3 hover:bg-secondary-600 hover:text-slate-100 text-primary-500 [&.active]:font-bold"> Goals</Link>
    <div className="md:container mx-auto">
    {isSuccess && data
    .map((goal:TGoal) => <Goal key={goal.id} goal={goal}/>
    )}
      </div>
  </>
  )
    }
    
    function Goal({goal}:{goal:TGoal}){
        return (
        <div className="p-4 rounded-xl flex flex-col mx-auto w-128 bg-slate-700 m-2 gap-3" >
          <div className="flex w-full items-center justify-between">
            <h1 className="text-primary-700 text-3xl font-subHeaders"> <Link to="/goals/$goalId" params={{goalId:goal.id}}>{goal.title}</Link></h1>
            {goal.isPrivate 
            ? <button className={buttonStyles}> Share</button> 
            : <button className={buttonStyles} >Unshare</button>}
          </div>
          <div className="mx-auto p-5 bg-secondary-300">
          <p className="text-slate-700 font-subHeaders text-xl">
            {goal.description}
          </p>
              <div className="flex flex-wrap">

            {goal.goalWeeks.sort((a,b)=> a.weekNumber - b.weekNumber)
            .map(weekProgress => 
            <div className="text-slate-900 text-center" key={weekProgress.id}> 
            Week {weekProgress.weekNumber+1}  
            {weekProgress.targetAmount > 1 
            ? <ProgressBar key ={weekProgress.id} completedAmount={weekProgress.completedAmount} totalAmount={weekProgress.targetAmount} /> 
            : <div className="min-w-20  h-10 text-2xl m-3"> 
              {weekProgress.completedAmount === 1 
              ? <FontAwesomeIcon icon={faCheck}/> 
              :<FontAwesomeIcon icon={faFaceFrown}/>  
              } </div>
              }


             </div>)}
            </div>
          </div>
        </div>
        )
    }

    function ProgressBar({totalAmount,completedAmount}:{totalAmount:number,completedAmount:number}) {
        const progressPercent = (completedAmount/totalAmount) * 100 
        const displayPercent = progressPercent.toFixed(0)

      return (
        <div className="border-primary-500 border-2 rounded-md h-10 bg-slate-400 my-5 mx-3 min-w-20 "  >
            <div className="bg-secondary-900 h-9 rounded-md text-center text-white" style={{width:`${progressPercent}%`}} ></div>
            <p className="mb-2 text-lg" >{displayPercent}%</p>

        </div>
      )
    }


