import { useState } from "react";
import { User, Mail, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "../hooks/useAuth.js";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const { loginMutation, signupMutation } = useAuth();

  const isPending = loginMutation.isPending || signupMutation.isPending;

  const handleSubmit = (e) => {
    e?.preventDefault(); // Prevent page refresh
    if (activeTab === "login") {
      loginMutation.mutate({ email: form.email, password: form.password });
    } else {
      signupMutation.mutate(form, {
        onSuccess: () => {
          setActiveTab("login");
          setForm({ username: "", email: "", password: "" });
        },
      });
    }
  };

  // Switch tabs and clear errors
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    loginMutation.reset();
    signupMutation.reset();
  };

  return (
    <div className="min-h-screen bg-base-100 flex flex-col selection:bg-primary selection:text-primary-content">
      <main className="flex flex-col lg:flex-row grow items-center px-6 lg:px-24 gap-12 lg:gap-20 py-12">
        {/* LEFT CONTENT: Value Proposition */}
        <div className="lg:w-3/5 text-center lg:text-left space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl lg:text-8xl font-black tracking-tight leading-none">
              Nurture your <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
                growth
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-base-content/70 max-w-xl mx-auto lg:mx-0 font-medium">
              A social productivity space to track goals, crush tasks, and bloom
              alongside a supportive community.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
            <div className="badge badge-primary badge-lg gap-2 py-5 px-6 font-bold shadow-lg shadow-primary/20">
              ✨ Goals
            </div>
            <div className="badge badge-secondary badge-lg gap-2 py-5 px-6 font-bold shadow-lg shadow-secondary/20">
              ✅ Tasks
            </div>
            <div className="badge badge-accent badge-lg gap-2 py-5 px-6 font-bold shadow-lg shadow-accent/20">
              📝 Reflections
            </div>
          </div>
        </div>

        {/* RIGHT CONTENT: Glassmorphic Auth Card */}
        <div className="lg:w-2/5 flex justify-center w-full relative">
          {/* Decorative background glow */}
          <div className="absolute -top-10 -right-10 w-72 h-72 bg-primary/10 blur-[100px] rounded-full"></div>

          <div className="card w-full max-w-md bg-base-200/50 backdrop-blur-xl shadow-2xl border border-white/5 relative">
            <form className="card-body gap-8" onSubmit={handleSubmit}>
              {/* TABS with Animated Feel */}
              <div className="tabs tabs-boxed bg-base-300/50 p-1 rounded-2xl">
                <button
                  type="button"
                  className={`tab flex-1 h-11 rounded-xl transition-all font-bold ${
                    activeTab === "login"
                      ? "bg-primary text-primary-content shadow-lg"
                      : "hover:bg-base-100"
                  }`}
                  onClick={() => handleTabChange("login")}
                >
                  Login
                </button>
                <button
                  type="button"
                  className={`tab flex-1 h-11 rounded-xl transition-all font-bold ${
                    activeTab === "signin"
                      ? "bg-primary text-primary-content shadow-lg"
                      : "hover:bg-base-100"
                  }`}
                  onClick={() => handleTabChange("signin")}
                >
                  Sign Up
                </button>
              </div>

              {/* INPUT FIELDS */}
              <div className="space-y-4">
                {activeTab === "signin" && (
                  <div className="form-control">
                    <label className="label-text mb-2 ml-1 opacity-60">
                      Username
                    </label>
                    <label className="input input-bordered focus-within:border-primary transition-all flex items-center gap-3 bg-base-300/30">
                      <User className="w-5 h-5 opacity-40" />
                      <input
                        type="text"
                        placeholder="bloom_user"
                        className="grow"
                        required
                        value={form.username}
                        onChange={(e) =>
                          setForm({ ...form, username: e.target.value })
                        }
                      />
                    </label>
                  </div>
                )}

                <div className="form-control">
                  <label className="label-text mb-2 ml-1 opacity-60">
                    Email Address
                  </label>
                  <label className="input input-bordered focus-within:border-primary transition-all flex items-center gap-3 bg-base-300/30">
                    <Mail className="w-5 h-5 opacity-40" />
                    <input
                      type="email"
                      placeholder="hello@bloom.com"
                      className="grow"
                      required
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                    />
                  </label>
                </div>

                <div className="form-control">
                  <label className="label-text mb-2 ml-1 opacity-60">
                    Password
                  </label>
                  <label className="input input-bordered focus-within:border-primary transition-all flex items-center gap-3 bg-base-300/30">
                    <Lock className="w-5 h-5 opacity-40" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="grow"
                      required
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                    />
                  </label>
                </div>

                {/* Error Alert */}
                {(loginMutation.isError || signupMutation.isError) && (
                  <div className="alert alert-error py-2 text-sm shadow-lg">
                    <span>
                      {loginMutation.error?.response?.data?.message ||
                        signupMutation.error?.response?.data?.message ||
                        "Auth Failed"}
                    </span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isPending}
                  className="btn btn-primary btn-block text-lg shadow-xl shadow-primary/20 group"
                >
                  {isPending ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      {activeTab === "login"
                        ? "Welcome Back"
                        : "Join the Community"}
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
