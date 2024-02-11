import { createLazyFileRoute } from "@tanstack/react-router";
import { SignIn } from "../components/signin";

export const Route = createLazyFileRoute("/signin")({
  component: () => <SignIn />,
});
