import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="p-6 flex gap-2">
        <Link to="/" className="[&.active]:font-bold ">
          Home
        </Link>{" "}
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>{" "}

        <div className="ml-auto mr-10 flex gap-4">

        <Link to="/login" className="[&.active]:font-bold ">
          Sign In
        </Link>
        <Link to="/register" className="[&.active]:font-bold "> Sign Up</Link>
        </div>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
