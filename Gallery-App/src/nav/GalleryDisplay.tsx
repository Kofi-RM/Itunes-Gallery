import { useState} from "react";
import MediaPlayer from "../components/MediaPlayer/MediaPlayer";
import { useMediaPlayer } from "../hooks/useMediaPlayer";

import ResultsGrid from "../components/ResultsGrid";
import type { Result } from "../type/Result";
import SearchBar from "../components/SearchBar";
import ProfileCard from "../components/ProfileCard";
import { useAuth } from "../auth/useAuth";
import { useNavigate } from "react-router-dom";


function GalleryDisplay() {
  const [results, setResults] = useState<Result[]>([]);
 
 const navigate = useNavigate()
  const {loggedIn, logout} = useAuth()
  const [isFullscreen, setIsFullscreen] = useState(false);

  const player = useMediaPlayer();

  const OnSelect = (result: Result) => {
    player.setActiveMedia(result);
  };
 
  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="min-h-screen bg-black text-white pb-32">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between">
          <h1 className="text-5xl font-bold mb-8">Gallery Live</h1>
       
        {/* Show login/logout conditionally */}
       <div className="flex">
  {loggedIn ? (
    <button
      onClick={() => logout()}
      className="
  self-center
  px-4 py-1.5
  h-fit
  rounded-full
  bg-red-500 hover:bg-red-400
  text-black
  text-sm
  font-medium
  transition
  mr-10
"
    >
      Logout
    </button>
  ) : (
    <button
      onClick={() => navigate("/login")}
className="
  self-center
  px-4 py-1.5
  h-fit
  rounded-full
  bg-green-500 hover:bg-green-400
  text-black
  text-sm
  font-medium
  transition
  mr-10
"
    >
      Login
    </button>
  )}
          {/* Profile picture */}
         <ProfileCard/>
         </div>
        </div>
        
            {/* Search Bar */}
        <SearchBar setResults={setResults}  />
        {/* GRID */}
        <ResultsGrid results={results} onSelect={OnSelect} />
      </div>

      {player.activeMedia && (
        <>
          {/* Fullscreen exit button */}
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
      className={
    isFullscreen
      ? "fixed inset-0 bg-zinc-950 z-50 flex flex-col items-center justify-center p-6"
      : "fixed bottom-0 left-0 right-0 bg-zinc-950 border-t border-zinc-800 px-4 py-2 z-50"
  }
          >
            <MediaPlayer
              activeMedia={player.activeMedia}
              volume={player.volume}
              setVolume={player.adjustVolume}
              seek={player.seek}
              audioRef={player.audioRef}
              videoRef={player.videoRef}
              setActiveMedia={player.setActiveMedia}
              isFullscreen={isFullscreen}
              setIsFullscreen={setIsFullscreen}
              isPlaying={player.isPlaying}
              togglePlay={player.togglePlay}
              duration={player.duration}
              currentTime={player.currentTime}
              progress={player.progress}
              toggleMute = {player.toggleMute}
            />
          </div>
        </>
      )}
    </div>
  );
}
export default GalleryDisplay;