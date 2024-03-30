import { Link } from "@tanstack/react-router";
import { TGroup } from "../../types";

export const GroupCard = ({ group }: { group: TGroup }) => {
  return (
    <Link
      to="/dashboard/groups/$groupId"
      params={{ groupId: group.id }}
      className="card bg-secondary [&.active]:bg-neutral [&.active]:text-neutral-content border-secondary border-4  hover:border-6 hover:border-base-300 text-secondary-content min-w-64 max-w-96 w-full "
    >
      <div className="card-body">
        <h2 className="card-title">{group.name}</h2>
        <p> {group.description}</p>
        <ul>
          {group.users.map((userInfo) => (
            <li key={userInfo.id}>
              {userInfo.user.username}{" "}
              <div
                className={` badge ${userInfo.role === "ADMIN" ? " badge-primary" : " badge-accent"}`}
              >
                {userInfo.role}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Link>
  );
};
