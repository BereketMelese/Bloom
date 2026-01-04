import { useQueryClient } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";

import api from "../service/api";
import Navbar from "../components/common/Navbar";
import RightSide from "../components/common/rightSide/RightSide";
import MobileNavbar from "../components/common/MobileNavbar";

const AppLayout = () => {
  const queryClient = useQueryClient();

  const user = queryClient.getQueryData(["authUser"]);

  const logoutRequest = async () => {
    await api.post("/auth/logout");
  };

  const logout = async () => {
    await logoutRequest();
    queryClient.setQueriesData(["authUser"], null);
  };
  return (
    <div className="flex min-h-screen bg-base-100">
      <Navbar user={user} onLogout={logout} />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
      <RightSide />

      <MobileNavbar user={user} onLogout={logout} />
    </div>
  );
};

export default AppLayout;
