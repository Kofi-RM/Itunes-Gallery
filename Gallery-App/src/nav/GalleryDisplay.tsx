import { useState, useEffect} from "react";
import MediaPlayer from "../components/MediaPlayer";
import { useMediaPlayer } from "../hooks/useMediaPlayer";
import helperFunctions from "../util/helperFunctions";
import ResultsGrid from "../components/ResultsGrid";
import type { Result } from "../type/Result";
import SearchBar from "../components/SearchBar";

function GalleryDisplay() {
  const [results, setResults] = useState<Result[]>([]);
 
  const [volume, setVolume] = useState(
    Number(localStorage.getItem("galleryVolume")) || 0.5
  );

  const [isDragging, setIsDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const {  onSubmit} = helperFunctions;

  const player = useMediaPlayer();

  // -----------------------------
  // VOLUME PERSISTENCE
  // -----------------------------
  useEffect(() => {

    localStorage.setItem("galleryVolume", String(volume));
  }, [volume, player.activeMedia]);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const media = player.mediaRef.current;
      const bar = document.getElementById("scrubber");
      if (!media || !bar || !media.duration) return;

      const rect = bar.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;

      media.currentTime =
        Math.max(0, Math.min(1, percent)) * media.duration;
    };

    const stop = () => setIsDragging(false);

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", stop);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", stop);
    };
  }, [isDragging, player.mediaRef]);

  const OnSelect = (result: Result) => {

    player.setActiveMedia(result);
  
  };
  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="min-h-screen bg-black text-white pb-32">
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-5xl font-bold mb-8">Gallery Live</h1>

        <SearchBar onSubmit={(e) => onSubmit({ e, setResults })} />
        {/* GRID */}
        <ResultsGrid results={results} onSelect={OnSelect} />
      </div>

      {player.activeMedia && (
        <>
          {/* Fullscreen backdrop */}
          {isFullscreen && (
            <button
              onClick={() => setIsFullscreen(false)}
              className="
      fixed
      top-4
      right-4
      z-[60]
      text-4xl
      text-white
    "
            >
              ✕
            </button>
          )}

          {/* Bottom player */}
          <div
            className="
        fixed
        bottom-0
        left-0
        right-0
        h-24
        bg-zinc-950
        border-t
        border-zinc-800
        flex
        items-center
        gap-4
        px-4
        z-50
      "
          >
            <MediaPlayer
              activeMedia={player.activeMedia}
              isPlaying={player.isPlaying}
              togglePlay={player.togglePlay}
              currentTime={player.currentTime}
              duration={player.duration}
              progress={player.progress}
              volume={volume}
              setVolume={setVolume}
              seek={player.seek}
             mediaRef={player.mediaRef}
              setActiveMedia={player.setActiveMedia}
              isFullscreen={isFullscreen}
              setIsFullscreen={setIsFullscreen}
            />
          </div>
        </>
      )}
    </div>
  );
}
export default GalleryDisplay;