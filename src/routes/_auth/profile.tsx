import { createFileRoute } from "@tanstack/react-router";
import { userInfoQueryOptions } from "../../api/users/userQueryOptions";
import { useSuspenseQuery } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

const UserProfile = () => {
  const {
    auth: { user },
  } = Route.useRouteContext();
  const sq = useSuspenseQuery(userInfoQueryOptions(user!.token));
  const profile = sq.data;
  return (
    <>
      <div className="card w-96 bg-primary text-primary-content mx-auto my-4 ">
        <figure>
          <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">
            {profile.firstName} {profile.lastName}
          </h2>
          <p>Time Zone: {profile.timezone}</p>
          <p>Country: {profile.country}</p>

          <p>Current Theme: {profile.userSettings.theme}</p>
          <p>
            Completed Profile Setup :{" "}
            {profile.userSettings.profileComplete.toString()}
          </p>
          <div className="card-actions justify-end">
            <button className="btn btn-secondary">
              {" "}
              <FontAwesomeIcon icon={faEdit} />
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export const Route = createFileRoute("/_auth/profile")({
  loader: ({ context: { auth, queryClient } }) => {
    queryClient.ensureQueryData(userInfoQueryOptions(auth.user!.token || ""));
  },
  component: UserProfile,
});
