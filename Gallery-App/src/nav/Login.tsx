
// Login page for username/password sign in and GitHub OAuth.
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import isTokenExpired from "../auth/tokenCheck";
function Login() {
  
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
const {token, login} = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await api.post(
        `/api/users/login`,
        {
          email,
          password,
        }
      );

      // save token
      login(data.token)
      // redirect
      navigate("/");
    } catch (err:unknown) {
     if (axios.isAxiosError(err)) {
    setError(err.response?.data?.message || "Login failed");
  }
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
  if (token && !isTokenExpired(token))  {
    login(token)
    navigate("/");
    
  }
}, [token, navigate, login]);
  return (
  <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">

    {/* background glow */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-0 left-0 h-96 w-96 bg-green-500/10 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-0 h-96 w-96 bg-green-400/10 blur-3xl rounded-full" />
    </div>

    <div className="relative w-full max-w-md">

      <div className="bg-[#121212] border border-[#1f1f1f] rounded-2xl shadow-2xl p-8">

        {/* header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-xl bg-green-500 mb-4">
            <img className="rounded" src="itunes.jpg" />
          </div>

          <h1 className="text-3xl font-bold text-white">
            Gallery
          </h1>
        </div>

        {/* form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* email */}
          <div>
            <label className="block text-sm text-zinc-400 mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="
                w-full px-4 py-3
                bg-[#181818]
                border border-[#2a2a2a]
                rounded-lg
                text-white
                placeholder-zinc-500
                focus:outline-none
                focus:ring-2
                focus:ring-green-500
              "
            />
          </div>

          {/* password */}
          <div className="relative">
            <label className="block text-sm text-zinc-400 mb-2">
              Password
            </label>

            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="
                w-full px-4 py-3 pr-12
                bg-[#181818]
                border border-[#2a2a2a]
                rounded-lg
                text-white
                placeholder-zinc-500
                focus:outline-none
                focus:ring-2
                focus:ring-green-500
              "
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-zinc-400 text-sm"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg p-3 text-sm">
              {error}
            </div>
          )}

          {/* submit */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              bg-green-500 hover:bg-green-400
              text-black font-semibold
              py-3 rounded-full
              transition
              hover:scale-[1.02]
            "
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#2a2a2a]" />
          </div>

          <div className="relative flex justify-center text-sm">
            <span className="bg-[#121212] px-4 text-zinc-500">
              OR
            </span>
          </div>
        </div>

        {/* github */}
        <button
          onClick={() => {
            window.location.href =
              `${import.meta.env.VITE_API_URL}/api/users/auth/github`;
          }}
          className="
            w-full
            bg-[#181818]
            hover:bg-[#222]
            border border-[#2a2a2a]
            text-white
            font-medium
            py-3
            rounded-lg
            transition
          "
        >
          Continue with GitHub
        </button>

        {/* register link */}
        <div className="mt-6">
          <p className="text-center text-zinc-400 text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-green-400 hover:text-green-300 font-medium"
            >
              Create one
            </Link>
          </p>
        </div>

      </div>
    </div>
  </div>
);
}
export default Login;
