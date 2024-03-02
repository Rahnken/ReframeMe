import { createFileRoute } from "@tanstack/react-router";
import { RegisterUser } from "../../components/register";

export const Route = createFileRoute("/_public/register")({
  component: () => <RegisterUser />,
});
