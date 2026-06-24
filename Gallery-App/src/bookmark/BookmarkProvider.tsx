import { useState, useEffect, useCallback } from "react";
import api from "../api/api";
import type { Result } from "../type/Result";
import { BookmarksContext, type Bookmark } from "./BookmarkContext";

export const BookmarksProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

 
  const toggleBookmark = useCallback(
    async (result: Result) => {
      const exists = bookmarks.some(
        (b) => b.trackId === result.trackId
      );

      if (exists) {
        await api.delete(`/api/bookmarks/${result.trackId}`);

        setBookmarks((prev) =>
          prev.filter((b) => b.trackId !== result.trackId)
        );
      } else {
        const { data } = await api.post("/api/bookmarks", result);
        setBookmarks((prev) => [...prev, data]);
      }
    },
    [bookmarks]
  );

useEffect(() => {
  const loadBookmarks = async () => {
    const { data } = await api.get<Bookmark[]>("/api/bookmarks");
    setBookmarks(data);
  };

  loadBookmarks();
}, []);
  return (
    <BookmarksContext.Provider
      value={{
        bookmarks,
        toggleBookmark,
       
      }}
    >
      {children}
    </BookmarksContext.Provider>
  );
};