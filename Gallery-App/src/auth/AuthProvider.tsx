// AuthProvider stores the current JWT token and provides login/logout helpers.
import { useState,useEffect, useCallback } from "react";
import isTokenExpired from "./tokenCheck";
import { AuthContext } from "./AuthContext";
import type { ReactNode } from "react";
import api from "../api/api";
type User = {
  _id: string;
  username: string;
  profileImageUrl: string;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const [loggedIn, setLoggedIn] = useState(!token ? false : isTokenExpired(token))
const [user, setUser] = useState<User | null>(null)
  const login = (newToken: string) => {
    setToken(newToken);
    setLoggedIn(true)
    localStorage.setItem("token", newToken);
  };

const logout = useCallback(() => {
  setToken(null);
  setLoggedIn(false)
  localStorage.removeItem("token");
}, []);

  useEffect(() => {
  if (!token) return;

  const payload = JSON.parse(
    atob(token.split(".")[1])
  );

  const msUntilExpiry =
    payload.exp * 1000 - Date.now();

  if (msUntilExpiry <= 0) return;

  const timer = setTimeout(() => {
    logout();
  }, msUntilExpiry);

  return () => clearTimeout(timer);
}, [token, logout]);

useEffect(() => {
    const loadUser = async () => {
      try {
        if(loggedIn){
            console.log("logged in")
        const { data } = await api.get("api/user/me");
        setUser(data);
        }
      } catch {
        setUser(null);
      }
    };

    loadUser();
  }, [loggedIn]);
  return (
    <AuthContext.Provider value={{ token, login, logout, loggedIn, user, setUser}}>
      {children}
    </AuthContext.Provider>
  );
};