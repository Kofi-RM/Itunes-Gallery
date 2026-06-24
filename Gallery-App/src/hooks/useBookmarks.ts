import type { Result } from "../type/Result";
import { useState, useEffect} from "react";
import api from "../api/api";

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

function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);


 const toggleBookmark = async (result: Result) => {
  const exists = bookmarks.some(
    bookmark => bookmark.trackId === result.trackId
  );

  if (exists) {
    await api.delete(`/api/bookmarks/${result.trackId}`);
    setBookmarks(prev =>
      prev.filter(b => b.trackId !== result.trackId)
    );
  } else {
    const { data } = await api.post("/api/bookmarks", result);
    setBookmarks(prev => [...prev, data]);
  }
};

useEffect(() => {
  const loadBookmarks = async () => {
    const { data } = await api.get<Bookmark[]>("/api/bookmarks");
    setBookmarks(data);
    console.log(data)
  };

  loadBookmarks();
}, []);
 return {
    bookmarks,
    
    toggleBookmark
 }
}

export default useBookmarks