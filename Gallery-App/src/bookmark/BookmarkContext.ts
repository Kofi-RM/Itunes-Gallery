import { createContext } from "react";
import type { Result } from "../type/Result";


type BookmarksContextType = {
  bookmarks: Result[];
  toggleBookmark: (result: Result) => Promise<void>;
  isBookmarked: (trackId: number) => boolean;
};

export const BookmarksContext = createContext<BookmarksContextType | null>(null);