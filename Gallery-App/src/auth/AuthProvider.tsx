// AuthProvider stores the current JWT token and provides login/logout helpers.
import { useState,useEffect, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import type { ReactNode } from "react";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const login = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

const logout = useCallback(() => {
  setToken(null);
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

  return (
    <AuthContext.Provider value={{ token, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};