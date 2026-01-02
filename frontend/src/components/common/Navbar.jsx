import { FaBell, FaRegUser, FaHome } from "react-icons/fa";
import { SlLogout } from "react-icons/sl";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import api from "../../service/api";

const Sidebar = ({ user, onLogout }) => {
  const queryClient = useQueryClient();

  const { data: unreadCount } = useQuery({
    queryKey: ["unreadNotification"],
    queryFn: async () => {
      const res = await api.get("/notification/unread-count");
      return res.data.count;
    },
    enabled: !!user,
  });

  const handleLogout = async () => {
    await onLogout();
    queryClient.clear();
  };

  return (
    <div className="hidden lg:flex flex-col w-64 bg-base-200 min-h-screen shadow p-4">
      {/* Logo */}
      <Link className="btn btn-ghost text-xl mb-8">
        <img
          src="logo-dark-transparent.png"
          alt="Bloom Logo"
          className="w-auto h-8 object-contain"
        />
      </Link>

      {/* Menu */}
      <nav className="flex-1 flex flex-col gap-2">
        <Link
          to="/"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-300 transition"
        >
          <FaHome className="w-5 h-5" />
          <span>Home</span>
        </Link>

        <Link
          to="/notifications"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-300 transition relative"
        >
          <FaBell className="w-5 h-5" />
          <span>Notifications</span>
          {unreadCount > 0 && (
            <span className="absolute right-3 top-3 badge badge-xs badge-primary">
              {unreadCount}
            </span>
          )}
        </Link>
      </nav>

      {/* Profile at bottom */}
      <div className="mt-auto flex flex-col gap-2">
        <Link
          to={`/profile/${user.username}`}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-300 transition"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <img
              alt="avatar"
              src={
                user.avatar ||
                `https://api.dicebear.com/7.x/identicon/svg?seed=${user.username}`
              }
              className="w-full h-full object-cover"
            />
          </div>
          <span>{user.username}</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-500 hover:text-white transition"
        >
          <SlLogout className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
