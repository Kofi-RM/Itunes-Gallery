import { useEffect, useState } from "react";
import type { Result } from "../type/Result";
import api from "../api/api";
import useDebounce from "../hooks/useDebounce";

export default function SearchBar({ setResults }: {
  setResults: React.Dispatch<React.SetStateAction<Result[]>>;
}) {
  const [search, setSearch] = useState("");
  const [mediaType, setMediaType] = useState("music");
  const [settled, setSettled] = useState({ key: "", error: "" });
  const [retry, setRetry] = useState(0);
  const { debounceValue } = useDebounce(search);
  const requestKey = JSON.stringify([search, mediaType, retry]);
  const loading = settled.key !== requestKey;
  const error = loading ? "" : settled.error;

  useEffect(() => {
    // Invalidate the previous request immediately while new input debounces.
    if (search !== debounceValue) return;
    const controller = new AbortController();
    api.get<{ results: Result[] }>("/api/search", {
      params: { media: mediaType, term: debounceValue.trim() || "Pop", limit: 36 },
      signal: controller.signal,
    }).then(({ data }) => {
      if (!controller.signal.aborted) {
        setResults(data.results);
        setSettled({ key: requestKey, error: "" });
      }
    }).catch(() => {
      if (!controller.signal.aborted) setSettled({ key: requestKey, error: "Could not load results. Please try again." });
    });
    return () => controller.abort();
  }, [search, debounceValue, mediaType, requestKey, setResults]);

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <input aria-label="Search media" value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3"
          placeholder="Start typing to search" />
        <select aria-label="Media type" value={mediaType}
          onChange={(event) => setMediaType(event.target.value)}
          className="w-full sm:w-auto bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3">
          <option value="music">Music</option>
          <option value="podcast">Podcast</option>
          <option value="musicVideo">Music Video</option>
          <option value="tvShow">TV Show</option>
          <option value="software">Software</option>
          <option value="ebook">Ebook</option>
        </select>
      </div>
      {(loading || search !== debounceValue) && <p role="status">Loading results…</p>}
      {error && <p role="alert">{error} <button onClick={() => setRetry((value) => value + 1)} className="underline">Retry</button></p>}
    </div>
  );
}
