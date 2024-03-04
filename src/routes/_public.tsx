import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_public")({
  beforeLoad: async ({ context }) => {
    if (context.auth.authState !== "unauthenticated") {
      throw redirect({ to: "/" });
    }
  },
  component: () => (
    <div className={`flex-1 flex`}>
      <Outlet />
    </div>
  ),
});