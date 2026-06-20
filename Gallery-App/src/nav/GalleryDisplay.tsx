import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import Card from "../components/Card";
import type { Result } from "../type/Result";


function GalleryDisplay() {
  const [results, setResults] = useState<Result[]>([]);
  const [activeMedia, setActiveMedia] = useState<Result | null>(null);

 const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

const isVideo =
  activeMedia?.kind === "music-video" ||
  activeMedia?.kind === "tv-episode";
  const media = isVideo ? videoRef.current : audioRef.current;

  const [volume, setVolume] = useState(
    Number(localStorage.getItem("galleryVolume")) || 0.5
  );

const [currentTime, setCurrentTime] = useState(0);
const [duration, setDuration] = useState(0);

const [hoverPercent, setHoverPercent] = useState<number | null>(null);
const [hoverTime, setHoverTime] = useState<number | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const [isDragging, setIsDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const getCurrentMedia = useCallback(() => {


  return isVideo
    ? videoRef.current
    : audioRef.current;
}, [activeMedia]  );
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


  useEffect(() => {
  const audio = audioRef.current;
  const video = videoRef.current;

  if (!activeMedia) return;

  // ALWAYS reset both first
  audio?.pause();
  video?.pause();

  if (audio) audio.currentTime = 0;
  if (video) video.currentTime = 0;

  // pick ONLY ONE
  if (isVideo && video) {
    video.load();
    video.play();
  }

  if (!isVideo && audio) {
    audio.load();
    audio.play();
  }

 
}, [activeMedia, isVideo]);
  // -----------------------------
  // PROGRESS TRACKING
  // -----------------------------
  useEffect(() => {
    const media = getCurrentMedia();
    if (!media) return;
  const onEnded = () => setIsPlaying(false);
    const update = () => {
      setProgress(media.currentTime / media.duration || 0);
      setCurrentTime(media.currentTime);
    setDuration(media.duration || 0);
    };
 
     media.addEventListener("ended", onEnded);
  media.addEventListener("timeupdate", update);

  return () => {
    media.removeEventListener("ended", onEnded);
    media.removeEventListener("timeupdate", update);
  };
  }, [activeMedia, getCurrentMedia]);

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

  useEffect(() => {
  const handleMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const media = audioRef.current || videoRef.current;
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
}, [isDragging]);

  const seekFromEvent = (e: React.MouseEvent<HTMLDivElement>) => {
  const media = getCurrentMedia();
  if (!media || !media.duration) return;

  const rect = e.currentTarget.getBoundingClientRect();
  const percent = (e.clientX - rect.left) / rect.width;

  media.currentTime = Math.max(0, Math.min(1, percent)) * media.duration;
};

const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
  setIsDragging(true);
  seekFromEvent(e);
};
  // -----------------------------
  // PLAY / PAUSE
  // -----------------------------
const togglePlay = () => {

  if (!media) return;

  if (media.paused) {
    media.play();
    setIsPlaying(true);
  } else {
    media.pause();
    setIsPlaying(false);
  }
};

const formatTime = (time: number) => {
  if (!time || isNaN(time)) return "0:00";

  const min = Math.floor(time / 60);
  const sec = Math.floor(time % 60);

  return `${min}:${sec.toString().padStart(2, "0")}`;
};
  // -----------------------------
  // SEEK
  // -----------------------------
const seek = (e: React.MouseEvent<HTMLDivElement>) => {


  const media = getCurrentMedia();

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
                onClick={() => {
                  setActiveMedia(result)
                  setIsPlaying(true);
                }}
              />
            ))}
          </div>
        ) : (
          <p className="text-zinc-400">Search for something...</p>
        )}
      </div>

      {/* ---------------- SINGLE MEDIA ENGINE ---------------- */}
      {activeMedia && (
        <>
          {/* REAL MEDIA ELEMENT (ONLY ONE) */}
          <video
            ref={videoRef}
            src={activeMedia.previewUrl}
            className={
              isFullscreen
                ? "fixed inset-0 w-full h-full bg-black z-50 object-contain"
                : "hidden"
            }
            autoPlay
          />

          {/* AUDIO fallback (same ref, hidden) */}
          <audio
            ref={audioRef}
            src={activeMedia.previewUrl}
            className="hidden"
            autoPlay
          />

          {/* ---------------- FULLSCREEN OVERLAY ---------------- */}
          {isFullscreen && (
            <div
              onClick={() => setIsFullscreen(false)}
              className="fixed inset-0 bg-black/70 z-40"
            />
          )}

          {/* ---------------- BOTTOM PLAYER ---------------- */}
          <div className="fixed bottom-0 left-0 right-0 h-24 bg-zinc-950 border-t border-zinc-800 flex items-center gap-4 px-4 z-50">
            <img
              src={activeMedia.artworkUrl100.replace("100x100", "300x300")}
              className="w-14 h-14 rounded"
            />

            {/* PLAY */}
            <button onClick={togglePlay} className="text-xl">
              {isPlaying ? "⏸" : "▶"}
            </button>

<div className="text-xs text-zinc-400 w-24 text-center">
  {formatTime(currentTime)} / {formatTime(duration)}
</div>
            {/* SEEK */}
            <div
              onMouseMove={(e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const percent = (e.clientX - rect.left) / rect.width;

  const clamped = Math.max(0, Math.min(1, percent));

  setHoverTime(clamped * (duration || 0));
  setHoverPercent(clamped);
}}
  onMouseLeave={() => setHoverTime(null)}
  id="scrubber"
              onMouseDown={handleMouseDown}
              onClick={seek}
              className=" relative flex-1 h-2 bg-zinc-700 rounded cursor-pointer"
            >
              <div
                className="h-2 bg-green-500 rounded"
                style={{ width: `${progress * 100}%` }}
              />
              {hoverTime !== null && hoverPercent !== null && (
  <div
    className="absolute -top-7 text-xs bg-black text-white px-2 py-1 rounded pointer-events-none"
    style={{
      left: `${hoverPercent * 100}%`,
      transform: "translateX(-50%)",
    }}
  >
    {formatTime(hoverTime)}
  </div>
)}
            </div>

            {/* VOLUME */}
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
            />

            {/* FULLSCREEN */}
            <button
              onClick={() => setIsFullscreen((p) => !p)}
              className="text-sm px-2"
            >
              ⛶
            </button>

            {/* CLOSE */}
            <button onClick={() => setActiveMedia(null)}>✕</button>
          </div>
        </>
      )}
    </div>
  );
}
export default GalleryDisplay;