import { useState, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import api from "../api/api";
import type { Result } from "../type/Result";
import { BookmarksContext } from "./BookmarkContext";
import { useAuth } from "../auth/useAuth";

export const BookmarksProvider = ({ children }: { children: ReactNode }) => {
  const { token, loggedIn } = useAuth();
  const session = loggedIn ? token : null;
  // Session changes synchronously discard the previous account's local state.
  return <SessionBookmarks key={session ?? "guest"} token={session}>{children}</SessionBookmarks>;
};

function SessionBookmarks({ children, token }: { children: ReactNode; token: string | null }) {
  const [bookmarks, setBookmarks] = useState<Result[]>([]);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(!token);
  const controllerRef = useRef<AbortController | null>(null);
  const pending = useRef(new Set<number>());

  useEffect(() => {
    const controller = new AbortController();
    controllerRef.current = controller;
    if (token) {
      api.get<Result[]>("/api/bookmarks", {
        signal: controller.signal,
        headers: { Authorization: `Bearer ${token}` },
      }).then(({ data }) => {
        if (!controller.signal.aborted) {
          setBookmarks(data);
          setLoaded(true);
        }
      }).catch(() => {
        if (!controller.signal.aborted) setError("Could not load bookmarks. Refresh to try again.");
      });
    }
    return () => controller.abort();
  }, [token]);

  const toggleBookmark = async (result: Result) => {
    const controller = controllerRef.current;
    if (!token || !controller || controller.signal.aborted || pending.current.has(result.trackId)) return;
    if (!loaded) {
      setError("Please wait for bookmarks to load, or refresh to try again.");
      return;
    }
    pending.current.add(result.trackId);
    setError("");
    const config = { signal: controller.signal, headers: { Authorization: `Bearer ${token}` } };
    try {
      if (bookmarks.some((item) => item.trackId === result.trackId)) {
        await api.delete(`/api/bookmarks/${result.trackId}`, config);
        if (!controller.signal.aborted) setBookmarks((items) => items.filter((item) => item.trackId !== result.trackId));
      } else {
        await api.post("/api/bookmarks", result, config);
        if (!controller.signal.aborted) setBookmarks((items) => [...items, result]);
      }
    } catch {
      if (!controller.signal.aborted) setError("Could not update bookmark. Please try again.");
    } finally {
      pending.current.delete(result.trackId);
    }
  };

  return <BookmarksContext.Provider value={{ bookmarks, toggleBookmark,
    isBookmarked: (trackId) => bookmarks.some((item) => item.trackId === trackId) }}>
    {error && <p role="alert" className="bg-red-950 text-white p-3">{error}</p>}
    {children}
  </BookmarksContext.Provider>;
}
