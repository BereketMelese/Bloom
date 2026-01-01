import { useQuery } from "@tanstack/react-query";
import api from "./service/api";

import LoadingSpinner from "./components/common/LoadingSpinner";
import AuthPage from "./pages/auth/AuthPage";
import HomePage from "./pages/Home/HomePage";
import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";

const fetchAuthUser = async () => {
  const res = await api.get("/auth/me");
  return res.data.user;
};

function App() {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: fetchAuthUser,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  return (
    <Routes>
      {/*🔓 Public Routes */}
      <Route
        path="/auth"
        element={!authUser ? <AuthPage /> : <Navigate to="/" replace />}
      />

      {/* 🔐 Protected Routes */}
      <Route
        element={authUser ? <AppLayout /> : <Navigate to="/auth" replace />}
      >
        <Route index element={<HomePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
