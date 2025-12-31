import { useQuery } from "@tanstack/react-query";
import api from "./service/api";

import LoadingSpinner from "./components/common/LoadingSpinner";
import AuthPage from "./pages/auth/AuthPage";
import HomePage from "./pages/Home/HomePage";

function App() {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await api.get("/auth/me");

      return res.data.user;
    },
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
    <div className="flex max-w-6xl mx-auto">
      {authUser ? <HomePage /> : <AuthPage />}
    </div>
  );
}

export default App;
