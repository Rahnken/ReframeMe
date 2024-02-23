import { createFileRoute, redirect } from '@tanstack/react-router'
import { userInfoQueryOptions } from '../api/users/userQueryOptions'
import { useSuspenseQuery } from '@tanstack/react-query';



const UserProfile = () => {
    const {auth:{token}} = Route.useRouteContext();
    const sq = useSuspenseQuery(userInfoQueryOptions(token!))
    const profile = sq.data
    return (<>
        <p>{profile.firstName}</p>
        <p>{profile.lastName}</p>
        <p>{profile.timezone}</p>
        <p>{profile.country}</p>
        <p>{profile.userSettings.theme}</p>
        <p>{profile.userSettings.profileComplete.toString()}</p>
        </>
    )
}




export const Route = createFileRoute('/profile')({
    beforeLoad:({context,location})=>{
        if(!context.auth.isAuthenticated){
            throw redirect({
                to:"/login",
                search:{
                    redirect:location.href
                }
            })
        }
    },
    loader:({context:{auth,queryClient}} ) =>{ queryClient.ensureQueryData(userInfoQueryOptions(auth.token!))},
  component: UserProfile
})