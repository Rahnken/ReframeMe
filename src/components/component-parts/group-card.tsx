import { Link } from "@tanstack/react-router";
import { TGroup } from "../../types";

export const GroupCard = ({ group }: { group: TGroup }) => {
  return (
    <div className="card bg-secondary max-h-50 border-secondary border-4  hover:border-6 hover:border-base-300 text-secondary-content w-96 ">
      <Link to="/groups/$groupId" params={{ groupId: group.id }}>
        <div className="card-body">
          <h2 className="card-title">{group.name}</h2>
          <p> {group.description}</p>
          <ul>
            {group.users.map((userInfo) => (
              <li key={userInfo.id}>
                {userInfo.user.username}{" "}
                <div
                  className={`  ${userInfo.role === "ADMIN" ? "badge badge-primary" : ""}`}
                >
                  {userInfo.role}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Link>
    </div>
  );
};
