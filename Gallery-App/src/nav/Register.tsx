
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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false)

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
const {token, logout} = useAuth()
const navigate = useNavigate()
const [passwordError, setPasswordError] = useState("");
const [validReg, setValidReg] = useState(false)
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
if (password != confirmPassword) throw Error;
if (!emailRegex.test(email)) throw Error;
      // registration logic here
      const {data} = await api.post( `/api/users/register`,
        {
            username,
          email,
          password,
        })

     console.log(data)
      localStorage.setItem("token", data.token);
      setValidReg(true)
        

    } catch (err:unknown) {
         if (axios.isAxiosError(err)) {
          setError("Failed to create account");
          if ( username.length < 4) setError("Username must be at least 4 characters")
            if (!isValidPassword(password)) setError(validatePassword(password))
              if(password != confirmPassword) setError("Passwords do not match")
                if (!emailRegex.test(email)) setError("Please enter a valid email")
  }
      
    } finally {
      setLoading(false);
    }
  };

  const isValidPassword = (password: string) => {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(password)
  );
};
  const validatePassword = (password: string) => {
  if (password.length < 8)
    return "Must be at least 8 characters";

  if (!/[A-Z]/.test(password))
    return "Must contain an uppercase letter";

  if (!/[a-z]/.test(password))
    return "Must contain a lowercase letter";

  if (!/\d/.test(password))
    return "Must contain a number";

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
    return "Must contain a special character";

  return "";
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

useEffect(() => {
  if (validReg) {
 window.location.href = "/dashboard";
  }
},[validReg])
 return (
  <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
    
    {/* subtle glow background */}
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
            Gallery Live
          </h1>

          <p className="text-zinc-400 mt-2 text-sm">
            Create your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* username */}
          <div>
            <label className="block text-sm text-zinc-400 mb-2">
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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

          {/* email */}
          <div>
            <label className="block text-sm text-zinc-400 mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => {
                const val = e.target.value;
                setPassword(val);
                setPasswordError(validatePassword(val));
              }}
              className="
                w-full px-4 py-3 pr-12
                bg-[#181818]
                border border-[#2a2a2a]
                rounded-lg
                text-white
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

          {passwordError && (
            <p className="text-sm text-red-400">
              {passwordError}
            </p>
          )}

          {/* confirm password */}
          <div className="relative">
            <label className="block text-sm text-zinc-400 mb-2">
              Confirm Password
            </label>

            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="
                w-full px-4 py-3 pr-12
                bg-[#181818]
                border border-[#2a2a2a]
                rounded-lg
                text-white
                focus:outline-none
                focus:ring-2
                focus:ring-green-500
              "
            />

            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-[38px] text-zinc-400 text-sm"
            >
              {showConfirm ? "Hide" : "Show"}
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
            {loading ? "Creating..." : "Sign up"}
          </button>
        </form>

        {/* login link */}
        <div className="mt-10 text-center">
          <p className="text-zinc-400 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-green-400 hover:text-green-300 font-medium"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  </div>
);
}
export default Register