import { useQuery, useQueryClient } from "@tanstack/react-query";
import SuggestedUserItem from "./SuggestedUserItem";
import RightPanelSkeleton from "../../skeletons/RightPanelSkeleton";
import { Users, RefreshCw } from "lucide-react";
import { useState } from "react";

const RightSide = () => {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: suggestedUsers = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: async () => {
      const res = await fetch("/api/user/suggested");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch");
      return data.users;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleUserFollowed = (userId) => {
    // Optimistically remove the user from the list
    queryClient.setQueryData(["suggestedUsers"], (old) => {
      if (!old) return old;
      return old.filter((user) => user._id !== userId);
    });
  };

  if (isLoading) {
    return (
      <div className="hidden lg:block w-72 ml-4">
        <RightPanelSkeleton count={3} />
      </div>
    );
  }

  if (!suggestedUsers.length) {
    return (
      <div className="hidden lg:block w-72 ml-4">
        <div className="glass-panel rounded-2xl p-6 text-center">
          <Users className="w-12 h-12 mx-auto mb-3 text-base-content/30" />
          <h3 className="font-semibold mb-2">No suggestions found</h3>
          <p className="text-base-content/60 text-sm mb-4">
            You're following everyone! Try refreshing or explore more users.
          </p>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="btn btn-outline btn-sm w-full"
          >
            {refreshing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Refresh suggestions
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <aside className="hidden lg:block w-72 ml-4 sticky top-4 h-fit">
      {/* Panel Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Suggested for you</h2>
            <p className="text-xs text-base-content/50">
              {suggestedUsers.length} suggestions
            </p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="btn btn-ghost btn-sm"
          title="Refresh suggestions"
        >
          {refreshing ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Users List */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        {suggestedUsers.map((user) => (
          <SuggestedUserItem
            key={user._id}
            user={user}
            onFollow={handleUserFollowed}
          />
        ))}
      </div>

      {/* Help Text */}
      <p className="text-xs text-base-content/40 mt-3 px-1">
        Users you follow will be removed from suggestions
      </p>
    </aside>
  );
};

export default RightSide;
