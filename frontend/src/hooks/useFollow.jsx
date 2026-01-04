import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "../service/api"; // your axios/fetch wrapper

const useFollow = () => {
  const [isPending, setIsPending] = useState(false);
  const queryClient = useQueryClient();

  const follow = async (userId) => {
    setIsPending(true);
    try {
      const res = await api.post(`/user/${userId}/follow`);

      // Optional: show toast
      toast.success(res.data.message);

      // Refresh suggested users and user profiles if needed
      queryClient.invalidateQueries(["suggestedUsers"]);
      queryClient.invalidateQueries(["users"]); // optional
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to follow");
    } finally {
      setIsPending(false);
    }
  };

  return { follow, isPending };
};

export default useFollow;
