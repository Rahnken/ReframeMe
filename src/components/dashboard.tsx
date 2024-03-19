import { useAuth } from "../providers/auth.provider";
import { Link, Outlet } from "@tanstack/react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faArchive,
  faArrowCircleRight,
  faEdit,
  faPerson,
} from "@fortawesome/free-solid-svg-icons";

export function Dashboard() {
  const auth = useAuth();
  const user = auth.user;

  return (
    <>
      <div className="flex gap-3 ">
        <div className="drawer lg:drawer-open bg-base-300 ">
          <input
            id="dashboard-sidebar"
            type="checkbox"
            className="drawer-toggle"
          />
          <label
            htmlFor="dashboard-sidebar"
            className="btn btn-primary btn-sm rounded-s-none drawer-button lg:hidden mt-2 "
          >
            <FontAwesomeIcon icon={faArrowCircleRight} />
          </label>
          <div className="drawer-content flex flex-col align-center">
            <Outlet />
          </div>
          <div className="drawer-side border-r-white border-r-2  ">
            <label
              htmlFor="dashboard-sidebar"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <div className="flex flex-col gap-3 p-6">
              <h4 className="card-title self-center">
                Welcome Back {user?.userInfo.username}
              </h4>
              <Link
                to="/dashboard/groups/create"
                activeOptions={{ exact: true }}
                className="btn btn-secondary [&.active]:btn-primary  "
              >
                Create New Group
                <FontAwesomeIcon icon={faAdd} />
              </Link>
              <Link
                to="/dashboard/groups"
                activeOptions={{ exact: true }}
                className="btn btn-secondary [&.active]:btn-primary  "
              >
                View Groups
                <FontAwesomeIcon icon={faPerson} />
              </Link>
              <div className="divider divider-primary"></div>
              <Link
                to="/dashboard/goals/create"
                activeOptions={{ exact: true }}
                className="btn btn-secondary [&.active]:btn-primary "
              >
                Create New Goal
                <FontAwesomeIcon icon={faAdd} />
              </Link>
              <Link
                to="/dashboard/goals"
                activeOptions={{ exact: true }}
                className="btn btn-secondary [&.active]:btn-primary "
              >
                View Goals
                <FontAwesomeIcon icon={faEdit} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
