import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";

export const useAuth = () => {
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: (data) => api.post("/auth/login", data).then((res) => res.data),
    onSuccess: (data) => {
      // Direct cache update for the authenticated user
      queryClient.setQueryData(["authUser"], data.user);
    },
  });

  const signupMutation = useMutation({
    mutationFn: (data) =>
      api.post("/auth/register", data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  return { loginMutation, signupMutation };
};
