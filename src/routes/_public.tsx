import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_public")({
  beforeLoad: async ({ context }) => {
    if (context.auth.authState !== "unauthenticated") {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: () => <Outlet />,
});
