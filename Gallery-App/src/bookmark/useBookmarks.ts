import { useContext } from "react";
import { BookmarksContext } from "./BookmarkContext";

export const useBookmarks = () => {
  const context = useContext(BookmarksContext);

  if (!context) {
    throw new Error("useBookmarks must be used within BookmarksProvider");
  }

  return context;
};

export default useBookmarks