import { useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import { jwtDecode, type JwtPayload } from "jwt-decode";
import isTokenExpired from "./tokenCheck";
import { AuthContext } from "./AuthContext";
import api from "../api/api";
import type { User } from "../type/User";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => {
    const saved = localStorage.getItem("gallery_token");
    return saved && !isTokenExpired(saved) ? saved : null;
  });
  const [user, setUser] = useState<User | null>(null);
  const loggedIn = !!token && !isTokenExpired(token);

  const login = useCallback((newToken: string) => {
    if (isTokenExpired(newToken)) throw new Error("Invalid or expired login. Please sign in again.");
    setUser(null);
    localStorage.setItem("gallery_token", newToken);
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("gallery_token");
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    if (!token) {
      localStorage.removeItem("gallery_token");
      return;
    }
    const { exp } = jwtDecode<JwtPayload>(token);
    const timer = setTimeout(logout, Math.max(0, exp! * 1000 - Date.now()));
    return () => clearTimeout(timer);
  }, [token, logout]);

  useEffect(() => {
    if (!token) return;
    const controller = new AbortController();
    api.get<User>("/api/users/me", {
      signal: controller.signal,
      headers: { Authorization: `Bearer ${token}` },
    }).then(({ data }) => {
      if (!controller.signal.aborted) setUser(data);
    }).catch(() => {
      if (!controller.signal.aborted) setUser(null);
    });
    return () => controller.abort();
  }, [token]);

  return <AuthContext.Provider value={{ token, login, logout, loggedIn, user, setUser }}>
    {children}
  </AuthContext.Provider>;
};
