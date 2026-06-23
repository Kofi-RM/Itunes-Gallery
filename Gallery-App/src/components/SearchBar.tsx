type SearchBarProps = {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  audioRef: React.RefObject<HTMLVideoElement | HTMLAudioElement | null>;
  videoRef: React.RefObject<HTMLVideoElement | HTMLAudioElement | null>;
};

const SearchBar = ({ onSubmit, audioRef }: SearchBarProps) => {
return(
<>
        <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-4 mb-8 w-full">
          <input
            id="searchQuery"
            className="w-full min-w-0 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3"
            placeholder="Search..."
          />

          <select
            id="mediaType"
             className="w-full sm:w-auto bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3"
          >
            <option value="music">Music</option>
            <option value="podcast">Podcast</option>
            <option value="musicVideo">Music Video</option>
            <option value="tvShow">TV Show</option>
            <option value="software">Software</option>
            <option value="ebook">Ebook</option>
          </select>

          <button type="submit" className="w-full sm:w-auto bg-green-500 text-black px-6 py-3 rounded-lg font-bold">
            Search
          </button>
          <button
  onClick={() => {
    const m = audioRef.current;
    alert(JSON.stringify({
      volume: m?.volume,
      muted: m?.muted,
      paused: m?.paused,
    
    }));
  }}
>
  debug audio
</button>
        </form>
        </>
        )
}

export default SearchBar;