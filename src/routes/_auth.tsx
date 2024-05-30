import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import LoadingScreen from "../components/LoadingScreen"; // Import the LoadingScreen component using default import syntax

export const Route = createFileRoute("/_auth")({
  beforeLoad: async ({ context, location }) => {
    if (context.auth.authState !== "authenticated") {
      throw redirect({
        to: "/",
        search: {
          redirect: location.href,
        },
      });
    }
  },

  pendingComponent: () => <LoadingScreen />,

  component: () => <Outlet />,
});
