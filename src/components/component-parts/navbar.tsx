import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../providers/auth.provider";
export const Navbar = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    navigate({ to: "/" });
  };
  return (
    <div className="navbar bg-base-100 p-6 ">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3  z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            {auth.authState === "authenticated" ? (
              <>
                <li className="my-2">
                  <Link to="/dashboard" className="">
                    Dashboard
                  </Link>
                </li>
                <li className="my-2">
                  <Link to="/goals" className="">
                    Goals
                  </Link>
                </li>
                <li className="my-2">
                  <Link to="/profile" className="">
                    Profile
                  </Link>
                </li>
              </>
            ) : (
              <li> Please sign in or sign up</li>
            )}
          </ul>
        </div>
        <Link to="/" className="[&.active]:font-bold ">
          <img
            src="/ReframeMe_logo.svg"
            className="w-40 "
            alt="Reframe Me Logo"
          />
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {auth.authState === "authenticated" ? (
            <>
              <li className="mx-2">
                <Link to="/dashboard" className="btn [&.active]:btn-primary ">
                  Dashboard
                </Link>
              </li>
              <li className="mx-2">
                <Link to="/goals" className="btn [&.active]:btn-primary ">
                  Goals
                </Link>
              </li>
              <li className="mx-2">
                <Link to="/profile" className="btn [&.active]:btn-primary ">
                  Profile
                </Link>
              </li>
            </>
          ) : (
            <li> Please sign in or sign up</li>
          )}
        </ul>
      </div>
      <div className="navbar-end">
        {auth.authState === "authenticated" ? (
          <div className="ml-auto mr-10 flex gap-4 items-center">
            <button
              type="button"
              onClick={handleLogout}
              className="bg-slate-500 text-white py-2 px-4 rounded-md"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="ml-auto mr-10 flex gap-4">
            <Link
              to="/login"
              className=" text-2xl rounded-md  p-3 hover:bg-secondary-content hover:text-slate-100 text-primary [&.active]:font-bold "
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-2xl  rounded-md p-3 hover:bg-secondary-content hover:text-slate-50 text-primary [&.active]:font-bold "
            >
              {" "}
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
