import { createFileRoute, redirect } from '@tanstack/react-router'

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
  component: () => <div>Hello /goals!</div>
})