import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Card from "../components/Card";

type Result = {
  trackId: number;
  trackName: string;
  artistName: string;
  artworkUrl100: string;
  previewUrl: string;
  kind: string;
};

function GalleryDisplay() {
  const [results, setResults] = useState<Result[]>([]);
  const [activeMedia, setActiveMedia] = useState<Result | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [volume, setVolume] = useState(
    Number(localStorage.getItem("galleryVolume")) || 0.5
  );

  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  // -----------------------------
  // SEARCH
  // -----------------------------
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const searchInput = document.getElementById(
      "searchQuery"
    ) as HTMLInputElement;

    const mediaTypeSelect = document.getElementById(
      "mediaType"
    ) as HTMLSelectElement;

    const queryValue = searchInput.value.trim().split(" ").join("+");
    const mediaType = mediaTypeSelect.value;

    const res = await axios.get(
      `https://itunes.apple.com/search?media=${mediaType}&term=${queryValue}&limit=36`
    );

    setResults(res.data.results.slice(0, 36));
  };

  // -----------------------------
  // PROGRESS TRACKING
  // -----------------------------
  useEffect(() => {
    const media = audioRef.current || videoRef.current;
    if (!media) return;

    const update = () => {
      setProgress(media.currentTime / media.duration || 0);
    };

    media.addEventListener("timeupdate", update);

    return () => {
      media.removeEventListener("timeupdate", update);
    };
  }, [activeMedia]);

  // -----------------------------
  // VOLUME PERSISTENCE
  // -----------------------------
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }

    localStorage.setItem("galleryVolume", String(volume));
  }, [volume, activeMedia]);

  // -----------------------------
  // PLAY / PAUSE
  // -----------------------------
  const togglePlay = () => {
    const media = audioRef.current || videoRef.current;
    if (!media) return;

    if (media.paused) {
      media.play();
      setIsPlaying(true);
    } else {
      media.pause();
      setIsPlaying(false);
    }
  };

  // -----------------------------
  // SEEK
  // -----------------------------
  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const media = audioRef.current || videoRef.current;
    if (!media || !media.duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;

    media.currentTime = percent * media.duration;
  };

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="min-h-screen bg-black text-white pb-32">
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-5xl font-bold mb-8">Gallery Live</h1>

        {/* SEARCH */}
        <form onSubmit={onSubmit} className="flex gap-4 mb-8">
          <input
            id="searchQuery"
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3"
            placeholder="Search..."
          />

          <select
            id="mediaType"
            className="bg-zinc-900 border border-zinc-700 rounded-lg px-4"
          >
            <option value="music">Music</option>
            <option value="podcast">Podcast</option>
            <option value="musicVideo">Music Video</option>
            <option value="tvShow">TV Show</option>
            <option value="software">Software</option>
            <option value="ebook">Ebook</option>
          </select>

          <button className="bg-green-500 text-black px-6 rounded-lg font-bold">
            Search
          </button>
        </form>

        {/* GRID */}
        {results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {results.map((result) => (
              <Card
                key={result.trackId}
                result={result}
                onClick={() => setActiveMedia(result)}
              />
            ))}
          </div>
        ) : (
          <p className="text-zinc-400">Search for something...</p>
        )}
      </div>

      {/* ----------------------------- */}
      {/* BOTTOM PLAYER */}
      {/* ----------------------------- */}
      {activeMedia && (
        <div className="fixed bottom-0 left-0 right-0 h-24 bg-zinc-950 border-t border-zinc-800 flex items-center gap-4 px-6">
          
          {/* ART */}
          <img
            src={activeMedia.artworkUrl100.replace("100x100", "300x300")}
            className="w-16 h-16 rounded"
          />
          <div className="flex-1">
          <p className="text-white font-semibold truncate">
            {activeMedia.trackName}
          </p>
          <p className="text-zinc-400 text-sm">
            {activeMedia.artistName}
          </p>
          </div>
          {/* MEDIA */}
          {activeMedia.kind === "music-video" ||
          activeMedia.kind === "tv-episode" ? (
            <video
              ref={videoRef}
              src={activeMedia.previewUrl}
              autoPlay
              className="h-20 rounded"
            />
          ) : (
            <audio
              ref={audioRef}
              src={activeMedia.previewUrl}
              autoPlay
            />
          )}

          {/* CONTROLS */}
          <div className="flex items-center gap-4 w-full">
            
            {/* PLAY */}
            <button onClick={togglePlay} className="text-xl">
              {isPlaying ? "⏸" : "▶"}
            </button>

            {/* SEEK BAR */}
            <div
              className="flex-1 h-2 bg-zinc-700 rounded cursor-pointer"
              onClick={seek}
            >
              <div
                className="h-2 bg-green-500 rounded"
                style={{ width: `${progress * 100}%` }}
              />
            </div>

            {/* VOLUME */}
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-24"
            />

            {/* CLOSE */}
            <button
              onClick={() => setActiveMedia(null)}
              className="text-zinc-400 hover:text-white text-xl"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GalleryDisplay;