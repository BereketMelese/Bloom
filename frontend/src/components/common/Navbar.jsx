import { FaBell } from "react-icons/fa";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { FaRegUser } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";
import { SlLogout } from "react-icons/sl";

import api from "../../service/api";

const Navbar = ({ user, onLogout }) => {
  const queryClient = useQueryClient();

  const getUnreadCount = async () => {
    const res = await api.get("/notification/unread-count");
    return res.data.count;
  };

  const { data: unreadCount } = useQuery({
    queryKey: ["unreadNotification"],
    queryFn: getUnreadCount,
    enabled: !!user,
  });

  console.log(unreadCount);

  const handleLogout = async () => {
    await onLogout();
    queryClient.clear();
  };

  return (
    <div className="navbar bg-base-200 shadow-sm">
      {/* LEFT */}
      <div className="flex-1">
        <Link className="btn btn-ghost text-xl">
          <img
            src="logo-dark-transparent.png"
            alt="Bloom Logo"
            className="w-auto h-8 object-contain"
          />
        </Link>
      </div>

      {/* RIGHT */}
      <div className="flex-none gap-3">
        {user ? (
          <>
            {/* Notifications */}
            <div className="dropdown dropdown-end space-x-3">
              <label tabIndex={0} className="btn btn-ghost btn-circle">
                <div className="indicator">
                  <FaBell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="badge badge-xs badge-primary indicator-item border-none">
                      {unreadCount}
                    </span>
                  )}
                </div>
              </label>
              <div
                tabIndex={0}
                className="card card-compact dropdown-content bg-base-200 p-2 w-64 shadow border border-base-300 mt-4"
              >
                <div className="card-body">
                  <h3 className="text-md font-bold">Notifications</h3>
                  <p className="text-xs opacity-60">
                    You have {unreadCount} unread messages
                  </p>
                  <Link
                    to="notificatinos"
                    className="btn btn-primary btn-xs mt-2"
                  >
                    View All
                  </Link>
                </div>
              </div>
            </div>
            {/* Profile */}
            <div className="dropdown dropdown-end">
              <label
                tabIndex={0}
                className="btn btn-ghost btn-circle avatar border-2 border-primary/20 p-0.5"
              >
                <div className="w-10 rounded-full">
                  <img
                    alt="avatar"
                    src={
                      user.avatar ||
                      "https://api.dicebear.com/7.x/identicon/svg?seed=username"
                    }
                  />
                </div>
              </label>
              <ul
                tabIndex="-1"
                className="menu menu-sm dropdown-content mt-4 p-2 shadow-xl bg-base-200 rounded-box w-52 border border-base-300"
              >
                <li className="menu-title px-4 py-2 opacity-50 uppercase text-[10px] tracking-widest">
                  Account
                </li>
                <li>
                  <Link to={`/profile/${user.username}`}>
                    <FaRegUser className="w-4 h-4 " /> Profile
                  </Link>
                </li>

                <li>
                  <Link to="/settings">
                    <IoSettingsSharp className="w-4 h-4" /> Settings
                  </Link>
                </li>

                <div className="divider my-1 opacity-20" />

                <li>
                  <button onClick={handleLogout} className="text-error">
                    <SlLogout className="w-4 h-4" /> Logout
                  </button>
                </li>
              </ul>
            </div>{" "}
          </>
        ) : (
          <Link to="/" className="btn btn-primary btn-sm rounded-full px-6">
            Join Bloom
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
