import { useEffect, useRef, useState } from "react";
import type { Result } from "../../type/Result";
import helperFunctions from "../../util/helperFunctions";
import VolumeIcon from "./VolumeIcon";
import PlayerControls from "./PlayerControls";
import Slider from "./Slider";

type Props = {
  activeMedia: Result | null;
  isPlaying: boolean;
  togglePlay: () => void;
  volume: number;
  setVolume: (v: number) => void;
  seek: (t: number) => void;
  currentTime: number;
  duration: number;
  progress: number;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  setActiveMedia: (m: Result | null) => void;
  isFullscreen: boolean;
  setIsFullscreen: (f: boolean) => void;
  toggleMute: () => void;
};

export default function MediaPlayer({
  activeMedia,
  volume,
  setVolume,
  audioRef,
  videoRef,
  setActiveMedia,
  isFullscreen,
  setIsFullscreen,
  isPlaying,
  togglePlay,
  seek,
  duration,
  currentTime,
  progress,
  toggleMute,
}: Props) {
  const miniVideoSlot = useRef<HTMLDivElement>(null);
  const fullVideoSlot = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [controlsVisible, setControlsVisible] = useState(true);

  const showControls = () => {
    setControlsVisible(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setControlsVisible(false), 3000);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isFullscreen) {
      fullVideoSlot.current?.appendChild(video);
    } else {
      miniVideoSlot.current?.appendChild(video);
    }
  }, [isFullscreen]);

useEffect(() => {
  if (!isFullscreen) return;
  document.body.style.overflow = "hidden";

  hideTimer.current = setTimeout(() => setControlsVisible(false), 3000);

  return () => {
    document.body.style.overflow = "";
    if (hideTimer.current) clearTimeout(hideTimer.current);
  };
}, [isFullscreen]);

  if (!activeMedia) return null;

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isVideo = helperFunctions.isVideo(activeMedia);
  const { formatTime } = helperFunctions;

  return (
    <div className="w-full h-full">
      <audio ref={audioRef} className="hidden" />

      <video
        ref={videoRef}
        style={{ display: isVideo ? undefined : "none" }}
        className={isFullscreen
          ? "w-full h-full object-contain"
          : "w-14 h-14 object-cover rounded flex-shrink-0 cursor-pointer"}
        onClick={() => !isFullscreen && setIsFullscreen(true)}
      />

      {/* MINI PLAYER */}
      <div
        style={{ display: isFullscreen ? "none" : undefined }}
        className="flex flex-col gap-2 w-full p-3 bg-zinc-900 rounded-xl"
      >
        <div className="flex items-center gap-3">
          <div ref={miniVideoSlot} className="flex-shrink-0" />
          {!isVideo && (
            <img
              src={activeMedia.artworkUrl100.replace("100x100", "300x300")}
              className="w-14 h-14 rounded flex-shrink-0"
            />
          )}

          <div className="flex flex-col min-w-0 flex-1">
            <p className="text-sm font-medium truncate text-white">{activeMedia.trackName}</p>
            <p className="text-zinc-400 text-xs truncate">{activeMedia.artistName}</p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {!isIOS && <Slider variant="volume" value={volume} onChange={setVolume} />}
            <VolumeIcon toggleMute={toggleMute} volume={volume} />
            <button onClick={togglePlay}>{isPlaying ? "⏸" : "▶"}</button>
            {isVideo && <button onClick={() => setIsFullscreen(true)}>⛶</button>}
            <button onClick={() => setActiveMedia(null)}>✕</button>
          </div>
        </div>

        <PlayerControls
          volume={volume}
          setVolume={setVolume}
          seek={seek}
          duration={duration}
          currentTime={currentTime}
          progress={progress}
          activeMedia={activeMedia}
        />
      </div>

      {/* FULLSCREEN */}
      <div
        onMouseMove={showControls}
        onTouchStart={showControls}
        style={{
          display: isFullscreen ? undefined : "none",
          cursor: controlsVisible ? "default" : "none",
        }}
        className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50"
      >
        <div ref={fullVideoSlot} className="w-full h-full" />

        {!isVideo && (
          <img
            src={activeMedia.artworkUrl100.replace("100x100", "300x300")}
            className="w-40 h-40 rounded-xl absolute"
          />
        )}

        {/* controls overlay */}
        <div
          className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-4 transition-opacity duration-300"
          style={{
            opacity: controlsVisible ? 1 : 0,
            background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
          }}
        >
          <div className="text-center">
            <p className="text-white font-medium">{activeMedia.trackName}</p>
            <p className="text-zinc-400 text-sm">{activeMedia.artistName}</p>
          </div>

          <div className="flex items-center gap-2 w-full max-w-lg mx-auto">
            <span className="text-xs text-zinc-500 tabular-nums">{formatTime(currentTime)}</span>
            <Slider
              className="flex-1"
              duration={duration}
              variant="media"
              value={progress}
              onChange={(v) => seek(v * duration)}
              onCommit={(v) => seek(v * duration)}
              formatTooltip={(v) => helperFunctions.formatTime(v * duration)}
            />
            <span className="text-xs text-zinc-500 tabular-nums">{formatTime(duration)}</span>
          </div>

          <div className="flex items-center justify-center gap-8">
            <VolumeIcon toggleMute={toggleMute} volume={volume} />
            {!isIOS && <Slider variant="volume" value={volume} onChange={setVolume} className="w-24" />}
            <button className="text-white text-4xl" onClick={togglePlay}>
              {isPlaying ? "⏸" : "▶"}
            </button>
            <button className="text-zinc-400 text-xl" onClick={() => setIsFullscreen(false)}>✕</button>
            <button className="text-zinc-400" onClick={() => setActiveMedia(null)}>⏹</button>
          </div>
        </div>
      </div>
    </div>
  );
}