
// Registration page for creating a new account and storing the JWT.
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import api from "../api/api";
import axios from "axios";
import { useAuth } from "../auth/useAuth";
import { useNavigate } from "react-router-dom";
import isTokenExpired from "../auth/tokenCheck";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
const {token, logout} = useAuth()
const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
  
      return;
    }
  
    if (isTokenExpired(token)) {
      logout();
    }
  }, [token, logout, navigate]);
  
  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      // registration logic here
      const {data} = await api.post( `/api/users/register`,
        {
            username,
          email,
          password,
        })

     console.log(data)
      localStorage.setItem("token", data.token);
         window.location.href = "/dashboard";

    } catch (err:unknown) {
         if (axios.isAxiosError(err)) {
    setError(err.response?.data?.message || "Login failed");
  }
      setError("Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
   <div className=" inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 h-96 w-96 bg-indigo-600/20 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 h-96 w-96 bg-cyan-500/20 blur-3xl rounded-full" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-slate-900/80 backdrop-blur-lg border border-slate-800 rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-indigo-600 mb-4">
             <img className="rounded" src="itunes.jpg"/>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight">
              <span className="text-white">Gallery Live</span>
             
            </h1>

            <p className="text-slate-400 mt-2">
              Create your account
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Username
              </label>

              <input
                type="text"
                placeholder="johndoe"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                required
                className="
                  w-full
                  px-4
                  py-3
                  bg-slate-800
                  border
                  border-slate-700
                  rounded-xl
                  text-slate-100
                  placeholder-slate-500
                  focus:outline-none
                  focus:ring-2
                  focus:ring-indigo-500
                  focus:border-indigo-500
                  transition
                "
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>

              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
                className="
                  w-full
                  px-4
                  py-3
                  bg-slate-800
                  border
                  border-slate-700
                  rounded-xl
                  text-slate-100
                  placeholder-slate-500
                  focus:outline-none
                  focus:ring-2
                  focus:ring-indigo-500
                  focus:border-indigo-500
                  transition
                "
              />
            </div>

           <div className="relative">
  <label className="block text-sm font-medium text-slate-300 mb-2">
    Password
  </label>

  <input
    type={showPassword ? "text" : "password"}
    placeholder="••••••••"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
    className="
      w-full
      px-4
      py-3
      pr-12
      bg-slate-800
      border
      border-slate-700
      rounded-xl
      text-slate-100
      placeholder-slate-500
      focus:outline-none
      focus:ring-2
      focus:ring-indigo-500
      focus:border-indigo-500
      transition
    "
  />

  <button
    type="button"
    onClick={() => setShowPassword((prev) => !prev)}
    className="
      absolute
      right-3
      top-[42px]
      text-slate-400
      hover:text-slate-200
      text-sm
    "
  >
    {showPassword ? "Hide" : "Show"}
  </button>
</div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl p-3 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                bg-indigo-600
                hover:bg-indigo-500
                disabled:opacity-50
                text-white
                font-semibold
                py-3
                rounded-xl
                transition-all
                duration-200
                hover:scale-[1.02]
              "
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>
          </form>

          <div className="mt-12">
  <p className="text-center text-slate-400 text-sm">
    Already have an account?{" "}
    <Link
      to="/login"
      className="text-cyan-400 hover:text-cyan-300 font-medium"
    >
      Sign In
    </Link>
  </p>
       </div>

    
        </div>
      </div>
    </div>
  );
};

export default Register;
