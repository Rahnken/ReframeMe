import {  createRootRouteWithContext, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { type AuthContext, useAuth } from "../providers/auth.provider";

interface RouterContext {
  auth: AuthContext
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component:  Root,
  
});

function Root() {
const auth = useAuth();

  return(
  <>
    <div className="p-6 flex gap-2 items-center">
      <Link to="/" className="[&.active]:font-bold ">
        <img
            src="/ReframeMe_logo.svg"
            className="w-40 "
            alt="Reframe Me Logo"
          />
        </Link>
        { auth.isAuthenticated ? (<div className="ml-auto mr-10 flex gap-4 text-primary-500 " > Welcome <Link to="/dashboard"className=" text-primary-500 [&.active]:font-bold "> {auth.user?.userInfo.username}</Link></div>)
        : (
        <div className="ml-auto mr-10 flex gap-4">
          <Link to="/login" className=" text-2xl rounded-md  p-3 hover:bg-secondary-600 hover:text-slate-100 text-primary-500 [&.active]:font-bold ">
            Sign In
          </Link>
          <Link to="/register" className="text-2xl  rounded-md p-3 hover:bg-secondary-600 hover:text-slate-50 text-primary-500 [&.active]:font-bold "> Sign Up</Link>
        </div>
        )}
        
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
  </>)
}