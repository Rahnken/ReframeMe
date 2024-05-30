import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import LoadingScreen from "../components/LoadingScreen";

export const Route = createFileRoute("/_public")({
  beforeLoad: async ({ context, location }) => {
    if (context.auth.authState === "authenticated") {
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
