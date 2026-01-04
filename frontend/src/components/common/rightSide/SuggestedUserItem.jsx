import { Link } from "react-router-dom";
import useFollow from "../../../hooks/useFollow";
import LoadingSpinner from "../LoadingSpinner";
import { Check, UserPlus, X } from "lucide-react";
import { useState } from "react";

const SuggestedUserItem = ({ user, onFollow }) => {
  const { follow, isPending } = useFollow();
  const [isFollowed, setIsFollowed] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleFollow = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Optimistic update
    setIsFollowed(true);
    setIsRemoving(true);

    try {
      await follow(user._id);

      // Notify parent component to remove this user
      if (onFollow) {
        onFollow(user._id);
      }

      // Animation delay before removal (optional)
      setTimeout(() => {
        setIsRemoving(false);
      }, 300);
    } catch (error) {
      // Rollback on error
      setIsFollowed(false);
      setIsRemoving(false);
      console.error("Follow error:", error);
    }
  };

  // If we're in removal state, slide out
  if (isRemoving) {
    return (
      <div className="animate-slide-out-right bg-success/10 border-b border-base-300">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
              <Check className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="font-medium text-success">
                Followed {user.username}!
              </p>
              <p className="text-xs text-success/60">
                Removing from suggestions...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group hover:bg-base-300/30 transition-all duration-200 border-b border-base-300 last:border-b-0">
      <div className="flex items-center justify-between p-4">
        {/* User Info */}
        <Link
          to={`/profile/${user.username}`}
          className="flex items-center gap-3 flex-1 min-w-0"
        >
          {/* Avatar */}
          <div className="relative">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-base-300 group-hover:border-primary/30 transition-colors">
              <img
                src={
                  user.avatar ||
                  `https://api.dicebear.com/7.x/identicon/svg?seed=${user?.username || "user"}`
                }
                alt={user.username}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* User Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="font-semibold truncate hover:text-primary transition-colors">
                {user.username}
              </span>
            </div>

            {user.bio && (
              <p className="text-xs text-base-content/60 truncate mt-1">
                {user.bio}
              </p>
            )}

            {/* Stats */}
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-base-content/50">
                {user.followersCount?.toLocaleString() || 0} followers
              </span>
            </div>
          </div>
        </Link>

        {/* Follow Button */}
        <div className="ml-3 flex items-center gap-2">
          <button
            onClick={handleFollow}
            disabled={isPending || isFollowed}
            className={`
              btn btn-sm rounded-full transition-all duration-200
              ${
                isFollowed
                  ? "btn-success btn-disabled"
                  : "btn-primary hover:scale-105"
              }
              ${isPending ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            {isPending ? (
              <LoadingSpinner size="sm" />
            ) : isFollowed ? (
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>Followed</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <UserPlus className="w-3.5 h-3.5" />
                <span>Follow</span>
              </div>
            )}
          </button>

          {/* Remove without following */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onFollow) onFollow(user._id);
            }}
            className="btn btn-ghost btn-sm btn-circle opacity-0 group-hover:opacity-100 transition-opacity"
            title="Remove suggestion"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuggestedUserItem;
