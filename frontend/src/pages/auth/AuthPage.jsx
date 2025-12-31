import React, { useState } from "react";
import api from "../../service/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { FaRegUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const queryClient = useQueryClient();

  const loginRequest = async ({ email, password }) => {
    const res = await api.post("/auth/login", { email, password });

    return res.data.user;
  };

  const registerRequest = async ({ username, email, password }) => {
    const res = await api.post("/auth/register", { username, email, password });

    return res.data.user;
  };

  const {
    mutate: loginMutation,
    isPending: isLogingPending,
    isError: isLoggingError,
    error: loginError,
  } = useMutation({
    mutationFn: loginRequest,
    onSuccess: (user) => {
      queryClient.setQueryData(["authUser"], user);
    },
  });

  const {
    mutate: registerMutation,
    isPending: isRegisterPending,
    isError: isRegisterError,
    error: registerError,
  } = useMutation({
    mutationFn: registerRequest,
    onSuccess: (user) => {
      queryClient.setQueryData(["authUser"], user);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === "login") {
      loginMutation({ email: form.email, password: form.password });
    } else {
      registerMutation(form);
    }
  };
  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      <main className="grow flex flex-col lg:flex-row items-start lg:items-center px-6 lg:px-16 xl:ox-24 gap-8 lg:gap-12 xl:gap-20 py-12">
        {/* LEFT CONTENT */}
        <div className="lg:w-1/2 xl:w-3/5 text-center lg:text-left">
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold mb-6 leading-tight">
            Nurture your <span className="text-primary">growth</span>, one post
            at a time.
          </h1>
          <p className="text-lg lg:text-xl opacity-70 mb-10 max-w-xl xl:max-w-2xl">
            Bloom is a social productivity space where you track goals, complete
            tasks, and share reflections.
          </p>
        </div>
        <div className="lg:w-1/2 xl:w-2/5 flex justify-center lg:justify-end w-full">
          <div className="card w-full max-w-sm xl:max-w-md bg-base-200 shadow-2xl border border-base-300">
            <div className="card-body gap-6">
              {/* TABS */}
              <div className="tabs tabs-boxed bg-base-300 p-1 rounded-2xl border border-base-300 shadow-inner">
                {/* LOGIN TAB */}
                <button
                  onClick={() => setActiveTab("login")}
                  className={`tab flex-1 h-12 rounded-xl font-bold transition-all duration-300 
                    ${
                      activeTab === "login"
                        ? "tab-active bg-primary text-primary-content shadow-md scale-[1.02]"
                        : "text-base-content/50 hover:bg-base-100"
                    }`}
                >
                  Login
                </button>

                {/* SIGN IN TAB */}
                <button
                  onClick={() => setActiveTab("signin")}
                  className={`tab flex-1 h-12 rounded-xl font-bold transition-all duration-300 
                    ${
                      activeTab === "signin"
                        ? "tab-active bg-primary text-primary-content shadow-md scale-[1.02]"
                        : "text-base-content/50 hover:bg-base-100"
                    }`}
                >
                  Sign Up
                </button>
              </div>

              {/* form */}
              <div className="flex flex-col space-y-4">
                {activeTab === "signin" && (
                  <label className="input input-bordered input-lg flex items-center gap-3">
                    <FaRegUser className="w-5 h-5 text-base-content/60" />
                    <input
                      type="text"
                      placeholder="Username"
                      value={form.username}
                      onChange={(e) =>
                        setForm({ ...form, username: e.target.value })
                      }
                      className="grow"
                    />
                  </label>
                )}
                <label className="input input-bordered input-lg flex items-center gap-3">
                  <MdEmail className="w-5 h-5 text-base-content/60" />
                  <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="grow"
                  />
                </label>
                <label className="input input-bordered input-lg flex items-center gap-3">
                  <TbLockPassword className="w-5 h-5 text-base-content/60" />
                  <input
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className="grow"
                  />
                </label>

                {/* Submit */}
                <button
                  className="btn btn-primary btn-lg w-full mt-2"
                  onClick={handleSubmit}
                  disabled={isLogingPending || isRegisterPending}
                >
                  {isLogingPending || isRegisterPending ? (
                    <LoadingSpinner size="md" />
                  ) : activeTab === "login" ? (
                    "Welcome Back"
                  ) : (
                    "Start Blooming"
                  )}
                </button>

                {/* Error Messges */}
                {(isLoggingError || isRegisterError) && (
                  <p className="text-red-500 text-sm mt-1">
                    {loginError?.response?.data?.message ||
                      registerError?.response?.data?.message ||
                      "Something went wrong"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthPage;
