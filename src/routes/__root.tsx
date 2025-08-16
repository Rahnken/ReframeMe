import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
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
    <div className="min-h-screen bg-base-100">
      <Navbar />
      <main className="pt-16 sm:pt-20">
        <Outlet />
      </main>
      <TanStackRouterDevtools position="bottom-right" />
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
    </div>
  );
}
