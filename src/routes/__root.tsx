import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { AuthContextType } from "../providers/auth.provider";
import { QueryClient } from "@tanstack/react-query";
import { Navbar } from "../components/component-parts/navbar";
import { ThemeContextType } from "../providers/theme.provider";

interface RouterContext {
  auth: AuthContextType;
  theme: ThemeContextType;
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: Root,
});

function Root() {
  return (
    <>
      <Navbar />
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
