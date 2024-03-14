import { Link, createFileRoute } from "@tanstack/react-router";
import { userInfoQueryOptions } from "../../../api/users/userQueryOptions";
import { useSuspenseQuery } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { TGroup, TUserInfo } from "../../../types";
import { GroupCard } from "../../../components/component-parts/group-card";

import { ThemeListButtons } from "../../../components/component-parts/ThemeListButtons";
import { groupQueryOptions } from "../../../api/groups/groupQueries";

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
  } = Route.useRouteContext();

  const { data: profile } = useSuspenseQuery(userInfoQueryOptions(user!.token));
  const { data: groupData }: { data: TGroup[] } = useSuspenseQuery(
    groupQueryOptions(user!.token)
  );

  const adminUser = (group: TGroup) =>
    group.users.find((user: { role: string }) => user.role === "ADMIN")!.user;

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
        <ThemeListButtons />
      </div>
    </>
  );
};

export const Route = createFileRoute("/_auth/profile/")({
  loader: ({ context: { auth, queryClient } }) => {
    queryClient.ensureQueryData(userInfoQueryOptions(auth.user!.token));
    queryClient.ensureQueryData(groupQueryOptions(auth.user!.token));
  },
  component: UserProfile,
});
