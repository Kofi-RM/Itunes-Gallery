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

  
  const [isFullscreen, setIsFullscreen] = useState(false);

  const {  onSubmit} = helperFunctions;

  const player = useMediaPlayer();

  // -----------------------------
  // VOLUME PERSISTENCE
  // -----------------------------
  useEffect(() => {

    localStorage.setItem("galleryVolume", String(volume));
  }, [volume, player.activeMedia]);

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
              volume={volume}
              setVolume={setVolume}
              seek={player.seek}
             mediaRef={player.mediaRef}
              setActiveMedia={player.setActiveMedia}
              isFullscreen={isFullscreen}
              setIsFullscreen={setIsFullscreen}
              isPlaying={player.isPlaying}
              togglePlay={player.togglePlay}
              duration={player.duration}
              currentTime={player.currentTime}
              progress={player.progress}
            />
          </div>
        </>
      )}
    </div>
  );
}
export default GalleryDisplay;