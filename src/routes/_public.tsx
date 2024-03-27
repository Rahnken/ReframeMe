import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import LoadingScreen from "../components/LoadingScreen";

export const Route = createFileRoute("/_public")({
  loader: async ({ context, location }) => {
    if (context.auth.authState !== "unauthenticated") {
      throw redirect({
        to: "/dashboard",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  pendingComponent: () => <LoadingScreen />,
  component: () => <Outlet />,
});
