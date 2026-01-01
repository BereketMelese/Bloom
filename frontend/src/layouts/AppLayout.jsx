import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";

import api from "../service/api";
import Navbar from "../components/common/Navbar";

const AppLayout = () => {
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ["authUser"],
    retry: false,
  });

  const logoutRequest = async () => {
    await api.post("/auth/logout");
  };

  const logout = async () => {
    await logoutRequest();
    queryClient.setQueriesData(["authUser"], null);
  };
  return (
    <>
      <Navbar user={user} onLogout={logout} />
      <Outlet />
    </>
  );
};

export default AppLayout;
