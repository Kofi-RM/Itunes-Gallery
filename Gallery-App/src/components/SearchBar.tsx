import { useEffect, useState } from "react";
import type { Result } from "../type/Result";
import api from "../api/api";
import useDebounce from "../hooks/useDebounce";
type SearchBarProps = {
  setResults: React.Dispatch<React.SetStateAction<Result[]>>;
};

const SearchBar = ({ setResults }: SearchBarProps) => {
  const [search, setSearch] = useState("");
  const [mediaType, setMediaType] = useState("music");
const {debounceValue} = useDebounce(search)
 const searchMedia = async () => {
  try {
    const res = await api.get("/api/search", {
      params: {
        media: mediaType,
        term: debounceValue.trim(),
        limit: 36,
      },
    });

    setResults(res.data.results);
  } catch (error) {
    alert("Error fetching search results: " + error);
  }
};



useEffect(() => {
  if (!debounceValue.trim()) return;

  searchMedia();
}, [debounceValue, mediaType]);

  return (
    <div
     
      className="flex flex-col sm:flex-row gap-4 mb-8 w-full"
    >
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3"
        placeholder="Search..."
      />

      <select
        value={mediaType}
        onChange={(e) => setMediaType(e.target.value)}
        className="w-full sm:w-auto bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3"
      >
        <option value="music">Music</option>
        <option value="podcast">Podcast</option>
        <option value="musicVideo">Music Video</option>
        <option value="tvShow">TV Show</option>
        <option value="software">Software</option>
        <option value="ebook">Ebook</option>
      </select>

      {/* <button
        type="submit"
        className="w-full sm:w-auto bg-green-500 text-black px-6 py-3 rounded-lg font-bold"
      >
        Search
      </button> */}
    </div>
  );
};

export default SearchBar;