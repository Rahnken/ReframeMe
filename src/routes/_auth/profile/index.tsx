import { Link, createFileRoute } from "@tanstack/react-router";
import {
  useUpdateUserInfoMutation,
  userInfoQueryOptions,
} from "../../../api/users/userQueryOptions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { TGroup, TUserInfo } from "../../../types";
import { GroupCard } from "../../../components/component-parts/group-card";

import { ThemeListButtons } from "../../../components/component-parts/ThemeListButtons";
import { groupQueryOptions } from "../../../api/groups/groupQueries";
import { ThemeType, useThemeProvider } from "../../../providers/theme.provider";
import { TUpdateUserInfo } from "../../../api/users/userInfo";
import { useSuspenseQuery } from "@tanstack/react-query";

const ProfileCard = ({ profile }: { profile: TUserInfo }) => {
  const {
    firstName,
    lastName,
    timezone,
    country,
    userSettings: { theme, profileComplete },
  } = profile;

  return (
    <div className="card w-96 bg-primary text-primary-content  my-4 ">
      <figure>
        <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {firstName} {lastName}
        </h2>
        <p>Time Zone: {timezone}</p>
        <p>Country: {country}</p>

        <p>Current Theme: {theme}</p>
        <p>Completed Profile Setup : {profileComplete.toString()}</p>
        <div className="card-actions justify-end">
          <Link to="/profile/edit" className="btn btn-base-300">
            <FontAwesomeIcon icon={faEdit} />
            Edit Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

const UserProfile = () => {
  const {
    auth: { user },
    queryClient,
  } = Route.useRouteContext();
  const { updateTheme } = useThemeProvider();

  const mutation = useUpdateUserInfoMutation(
    user!.token,
    () => {
      console.log("Profile Updated");
      queryClient.invalidateQueries({ queryKey: ["userInfo", user!.token] });
    },
    (e) => console.error("Mutation error:", e.message)
  );

  const profile: TUserInfo = useSuspenseQuery(userInfoQueryOptions(user!.token))
    .data as TUserInfo;

  const groupData: TGroup[] = queryClient.getQueryData([
    "groups",
    user!.token,
  ]) as TGroup[];

  const adminUser = (group: TGroup) =>
    group.users.find((user: { role: string }) => user.role === "ADMIN")!.user;

  const updateProfileTheme = (theme: ThemeType) => {
    const updatedProfile: TUpdateUserInfo = {
      userSettings: {
        userSetting_id: profile.userSettings.userSetting_id,
        theme: theme,
        profileComplete: profile.userSettings.profileComplete,
      },
    };
    mutation.mutate(updatedProfile);
    updateTheme(theme);
  };
  return (
    <>
      <div className="flex items-center justify-center mx-auto gap-10">
        <ProfileCard profile={profile} />
        <div className="flex flex-col gap-4 bg-primary rounded-lg p-8">
          <h2 className="font-headers text-3xl text-center mb-5 underline text-primary-content ">
            Groups You Own
          </h2>
          {groupData
            .filter(
              (group) => adminUser(group).username === user?.userInfo.username
            )
            .map((group: TGroup) => (
              <GroupCard key={group.id} group={group} />
            ))}
        </div>
        <ThemeListButtons updateProfileTheme={updateProfileTheme} />
      </div>
    </>
  );
};

export const Route = createFileRoute("/_auth/profile/")({
  loader: async ({ context: { auth, queryClient } }) => {
    await queryClient.prefetchQuery(userInfoQueryOptions(auth.user!.token));
    await queryClient.prefetchQuery(groupQueryOptions(auth.user!.token));
  },
  component: UserProfile,
});
