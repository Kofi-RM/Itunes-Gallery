import { useState } from "react";
import MediaPlayer from "../components/MediaPlayer/MediaPlayer";
import { useMediaPlayer } from "../hooks/useMediaPlayer";
import ResultsGrid from "../components/ResultsGrid";
import type { Result } from "../type/Result";
import SearchBar from "../components/SearchBar";
import ProfileCard from "../components/ProfileCard";
import { useAuth } from "../auth/useAuth";
import { useNavigate } from "react-router-dom";

export default function GalleryDisplay() {
  const [results, setResults] = useState<Result[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { loggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const player = useMediaPlayer();
  return <div className="min-h-svh bg-black text-white"
    style={{ paddingBottom: player.activeMedia ? "calc(12rem + env(safe-area-inset-bottom))" : "2rem" }}>
    <main inert={isFullscreen && !!player.activeMedia} className="max-w-7xl mx-auto p-3 sm:p-6">
      <header className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold">iTunes Gallery</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => loggedIn ? logout() : navigate("/login")}
            className="min-h-11 px-3 rounded-full bg-green-500 text-black text-sm font-medium">
            {loggedIn ? "Logout" : "Login"}
          </button>
          {loggedIn && <ProfileCard />}
        </div>
      </header>
      <SearchBar setResults={setResults} />
      <ResultsGrid results={results} onSelect={player.setActiveMedia} />
    </main>
    {player.activeMedia && <div className={isFullscreen
      ? "fixed inset-0 bg-zinc-950 z-50 overflow-y-auto"
      : "fixed bottom-0 left-0 right-0 bg-zinc-950 border-t border-zinc-800 z-50 safe-player"}>
      <MediaPlayer
        activeMedia={player.activeMedia} volume={player.volume} setVolume={player.adjustVolume}
        seek={player.seek} audioRef={player.audioRef} videoRef={player.videoRef}
        setActiveMedia={(media) => { if (!media) setIsFullscreen(false); player.setActiveMedia(media); }}
        isFullscreen={isFullscreen} setIsFullscreen={setIsFullscreen}
        isPlaying={player.isPlaying} togglePlay={player.togglePlay}
        duration={player.duration} currentTime={player.currentTime} progress={player.progress}
        toggleMute={player.toggleMute} />
    </div>}
  </div>;
}
