import { FaBell, FaHome, FaUserCircle } from "react-icons/fa";
import { SlLogout } from "react-icons/sl";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import api from "../../service/api";

const MobileNavbar = ({ user, onLogout }) => {
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
    <div className="fixed bottom-0 left-0 w-full bg-base-200 border-t border-base-300 flex justify-around p-2 lg:hidden shadow-inner">
      {/* Home */}
      <Link to="/" className="flex flex-col items-center text-sm">
        <FaHome className="w-6 h-6" />
      </Link>

      {/* Notifications */}
      <Link
        to="/notifications"
        className="relative flex flex-col items-center text-sm"
      >
        <FaBell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] flex items-center justify-center rounded-full bg-primary text-white">
            {unreadCount}
          </span>
        )}
      </Link>

      {/* Profile */}
      <Link
        to={`/profile/${user.username}`}
        className="flex flex-col items-center"
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt="avatar"
            className="w-6 h-6 rounded-full object-cover"
          />
        ) : (
          <FaUserCircle className="w-6 h-6" />
        )}
      </Link>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex flex-col items-center text-sm text-error"
      >
        <SlLogout className="w-6 h-6" />
      </button>
    </div>
  );
};

export default MobileNavbar;
