// AuthProvider stores the current JWT token and provides login/logout helpers.
import { useState,useEffect, useCallback } from "react";
import isTokenExpired from "./tokenCheck";
import { AuthContext } from "./AuthContext";

import type { ReactNode } from "react";
import api from "../api/api";
import type { User } from "../type/User";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("gallery_token")
  ); // get token from local storage

  const loggedIn = !!token && !isTokenExpired(token);
  // hard fast tell whether logged in or not
  console.log(loggedIn + "=  logged in")
const [user, setUser] = useState<User | null>(null)
  

// login func
const login = (newToken: string) => {
    setToken(newToken);   
    localStorage.setItem("gallery_token", newToken);
  };

  // logout func
const logout = useCallback(() => {
  setToken(null);
 setUser(null)
  localStorage.removeItem("gallery_token");
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
         
        const { data } = await api.get("api/users/me");
        setUser(data);
        }
      } catch {
        setUser(null);
      }
      // if logged in set user data
    };

    loadUser();
  }, [loggedIn]); // run when log in status changes
  return (
    <AuthContext.Provider value={{ token, login, logout, loggedIn, user, setUser}}>
      {children}
    </AuthContext.Provider>
  );
};