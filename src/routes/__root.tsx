import {
  createRootRouteWithContext,
  Link,
  Outlet,
  useNavigate,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { AuthContextType, useAuth } from "../providers/auth.provider";
import { QueryClient } from "@tanstack/react-query";

interface RouterContext {
  auth: AuthContextType;
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: Root,
});

function Root() {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    navigate({ to: "/" });
  };

  return (
    <>
      <div className="p-6 flex gap-2 items-center w-full">
        <Link to="/" className="[&.active]:font-bold ">
          <img
            src="/ReframeMe_logo.svg"
            className="w-40 "
            alt="Reframe Me Logo"
          />
        </Link>
        {auth.authState === "authenticated" ? (
          <div className="ml-auto mr-10 flex gap-4 items-center">
            <div className="text-primary ">
              {" "}
              Welcome{" "}
              <Link
                to="/dashboard"
                className=" text-primary [&.active]:font-bold "
              >
                {auth.user?.userInfo.username}
              </Link>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="bg-slate-500 text-white py-2 px-4 rounded-md"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="ml-auto mr-10 flex gap-4">
            <Link
              to="/login"
              className=" text-2xl rounded-md  p-3 hover:bg-secondary-content hover:text-slate-100 text-primary [&.active]:font-bold "
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-2xl  rounded-md p-3 hover:bg-secondary-content hover:text-slate-50 text-primary [&.active]:font-bold "
            >
              {" "}
              Sign Up
            </Link>
          </div>
        )}
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
