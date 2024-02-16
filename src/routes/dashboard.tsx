import { createFileRoute, redirect} from '@tanstack/react-router'

import { Dashboard } from '../components/dashboard'


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


