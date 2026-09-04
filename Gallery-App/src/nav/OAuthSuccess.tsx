import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../auth/useAuth";
import isTokenExpired from "../auth/tokenCheck";
import type { User } from "../type/User";

export default function OAuthSuccess() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [token] = useState(() => new URLSearchParams(window.location.hash.slice(1)).get("token")
    ?? new URLSearchParams(window.location.search).get("token"));
  const invalid = !token || isTokenExpired(token);
  const message = invalid ? "This sign-in link is invalid or expired. Please try again." : error;

  useEffect(() => {
    // Remove credentials from the address bar, including legacy query callbacks.
    window.history.replaceState(window.history.state, "", window.location.pathname);
    if (invalid || !token) return;
    const controller = new AbortController();
    api.get<User>("/api/users/me", {
      signal: controller.signal,
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => {
      if (controller.signal.aborted) return;
      login(token);
      navigate("/", { replace: true });
    }).catch(() => {
      if (!controller.signal.aborted) setError("Could not complete GitHub sign-in. Please try again.");
    });
    return () => controller.abort();
  }, [token, invalid, login, navigate]);

  return <main className="min-h-screen bg-zinc-950 text-white p-6">
    {message ? <><p role="alert">{message}</p><Link to="/login">Return to sign in</Link></>
      : <p role="status">Completing sign-in…</p>}
  </main>;
}
