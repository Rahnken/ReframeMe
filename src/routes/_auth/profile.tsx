import { createFileRoute } from "@tanstack/react-router";
import { userInfoQueryOptions } from "../../api/users/userQueryOptions";
import { useSuspenseQuery } from "@tanstack/react-query";

const UserProfile = () => {
  const {
    auth: { user },
  } = Route.useRouteContext();
  const sq = useSuspenseQuery(userInfoQueryOptions(user!.token));
  const profile = sq.data;
  return (
    <>
      <p>{profile.firstName}</p>
      <p>{profile.lastName}</p>
      <p>{profile.timezone}</p>
      <p>{profile.country}</p>
      <p>{profile.userSettings.theme}</p>
      <p>{profile.userSettings.profileComplete.toString()}</p>
    </>
  );
};

export const Route = createFileRoute("/_auth/profile")({
  loader: ({ context: { auth, queryClient } }) => {
    queryClient.ensureQueryData(userInfoQueryOptions(auth.user!.token || ""));
  },
  component: UserProfile,
});
