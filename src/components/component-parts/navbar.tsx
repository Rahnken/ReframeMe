import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../providers/auth.provider";
export const Navbar = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    navigate({ to: "/" });
  };

  const links = [
    { to: "/dashboard", text: "Dashboard" },
    { to: "/profile", text: "Profile" },
  ];
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
            className="menu menu-sm dropdown-content mt-3  z-[1] p-2 shadow bg-base-100 rounded-box w-52 "
          >
            {auth.authState === "authenticated" ? (
              <>
                {links.map((link, index) => (
                  <li className="my-2" key={`${link.text}${index}`}>
                    <Link to={link.to} className="">
                      {link.text}
                    </Link>
                  </li>
                ))}
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
      <div className="navbar-end">
        {auth.authState === "authenticated" ? (
          <div className="flex gap-4 items-center">
            <Link
              to="/dashboard"
              className="btn btn-accent [&.active]:btn-primary max-md:hidden"
            >
              Dashboard
            </Link>
            <Link
              to="/profile"
              className="btn btn-accent [&.active]:btn-primary max-md:hidden"
            >
              Profile
            </Link>
            <div
              onClick={handleLogout}
              className="btn btn-neutral btn-outline  py-2 px-4 rounded-md"
            >
              Logout
            </div>
          </div>
        ) : (
          <div className="ml-auto mr-10 flex gap-4">
            <Link
              to="/register"
              className="text-xl  btn btn-primary [&.active]:font-bold "
            >
              {" "}
              Sign Up
            </Link>
            <Link
              to="/login"
              className=" text-xl btn btn-secondary [&.active]:font-bold "
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
