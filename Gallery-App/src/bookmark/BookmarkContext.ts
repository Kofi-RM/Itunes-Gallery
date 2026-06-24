import { createContext } from "react";
import type { Result } from "../type/Result";

export type Bookmark = {
  _id: string;
  kind: string;
  artistId?: number;
  collectionId?: number;
  artistName?: string;
  collectionName?: string;
  collectionArtistName?: string;
  trackName?: string;
  previewUrl?: string;
  user: string;
  trackId: number;
};

type BookmarksContextType = {
  bookmarks: Bookmark[];
  toggleBookmark: (result: Result) => Promise<void>;
 
};

export const BookmarksContext = createContext<BookmarksContextType | null>(null);