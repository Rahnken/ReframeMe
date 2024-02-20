import { Link} from "@tanstack/react-router";
import { useAuth } from "../providers/auth.provider";
import { useQuery } from "@tanstack/react-query";
import { getAllGoalsQuery } from "../api/goals";
import { TGoal } from "../types";

import { Goal } from "./goal";
import { useState } from "react";

export function Dashboard()  {
    const auth = useAuth();
    const user = auth.user
    const [displayLimit,setDisplayLimit]=useState(1);
  
    const {isSuccess,data} = useQuery({
      queryKey:['userGoals'],
      queryFn: () => getAllGoalsQuery(user!.token)
    })

    const changeDisplayLimit = (newLimit: number) => {
      setDisplayLimit(newLimit);
    };
    
    
  return(
  <>
    <h3> Welcome to your Dashboard</h3> 
    <h4>{user?.userInfo.username}</h4>
    <div className="flex w-7 items-center m-6">
    <Link to="/goals" className="text-2xl rounded-md  p-3 hover:bg-secondary-600 hover:text-slate-100 text-primary-500 [&.active]:font-bold m-4"> Goals</Link>
    <button onClick={() => changeDisplayLimit(3)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-4">
        Show 3 Goals
        </button>
        </div>
    <div className="md:container mx-auto">
    {isSuccess && data.slice(0,displayLimit).map((goal:TGoal) => <Goal key={goal.id} goal={goal}/>
    )}
      </div>
  </>
  )
    }
    



