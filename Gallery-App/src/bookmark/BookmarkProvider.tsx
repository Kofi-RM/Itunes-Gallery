import { useState, useEffect } from "react";
import api from "../api/api";
import type { Result } from "../type/Result";
import { BookmarksContext, type Bookmark } from "./BookmarkContext";

export const BookmarksProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

 
    const isBookmarked = (trackId: number) => {
    return bookmarks.some((b) => b.trackId === trackId);
  };

  const toggleBookmark = async (result: Result) => {


  const exists = bookmarks.some(
    (b) => b.trackId === result.trackId
  );
  console.log(exists);
  if (exists) {
  try {
    await api.delete(`/api/bookmarks/${result.trackId}`);
    setBookmarks((prev) => {
      const next = prev.filter((b) => b.trackId !== result.trackId);
      console.log("after filter", next);
      return next;
    });
  } catch (err) {
    console.error("delete failed", err);
  }

  return;
  } else {
    await api.post("/api/bookmarks", result);
    console.log("post");
  }

  const { data } = await api.get<Bookmark[]>("/api/bookmarks");
  console.log("new data", data);

  setBookmarks(data);

  console.log("set data");
};

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
        isBookmarked
       
      }}
    >
      {children}
    </BookmarksContext.Provider>
  );
};