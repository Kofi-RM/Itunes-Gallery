import helperFunctions from "../util/helperFunctions";
import type { Result } from "../type/Result";

import { useState, useEffect } from "react";

type Props = {
    volume: number;
    setVolume: (volume: number) => void;
    setActiveMedia: (media: Result | null) => void;
    setIsFullscreen: (isFullscreen: boolean) => void;
    isPlaying: boolean;
    togglePlay: () => void;
    seek: (time: number) => void;
    duration: number;
    currentTime: number;
    progress: number;
    activeMedia: Result | null;
    mediaRef: React.RefObject<HTMLVideoElement | HTMLAudioElement| null>;
}
const PlayerControls = ({volume, setVolume, setActiveMedia, setIsFullscreen, isPlaying, togglePlay, seek, duration, currentTime, progress, activeMedia, mediaRef}: Props) => {
    const {isVideo, formatTime} = helperFunctions;
    

     const [hoverTime, setHoverTime] = useState<number | null>(null);
        const [hoverPercent, setHoverPercent] = useState<number | null>(null);
    
        
      const [isDragging, setIsDragging] = useState(false);
       
        const getPercentFromEvent = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      return Math.max(0, Math.min(1, percent));
    };
    
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
      setIsDragging(true);
    
      const percent = getPercentFromEvent(e);
      seek(percent * duration);
    };
    
      useEffect(() => {
        const handleMove = (e: MouseEvent) => {
          if (!isDragging) return;
    
          const media = mediaRef.current;
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
      }, [isDragging, mediaRef]);

     
  return (
<>
{/* PLAY BUTTON */}
            <button onClick={togglePlay} className="text-xl">
                {isPlaying ? "⏸" : "▶"}
            </button>

            {/* TIME */}
            <div className="text-xs text-zinc-400 w-24 text-center">
                {formatTime(currentTime)} / {formatTime(duration)}
            </div>

            {/* SCRUBBER */}
            <div
            id="scrubber"
            onMouseDown={handleMouseDown}
               onMouseMove={(e) => {
  const percent = getPercentFromEvent(e);

  setHoverTime(percent * duration);
  setHoverPercent(percent);
}}
                onMouseLeave={() => {
                    setHoverTime(null);
                    setHoverPercent(null);
                }}
                onClick={(e) => {
  const percent = getPercentFromEvent(e);
  seek(percent * duration);
}}
                className="relative flex-1 h-2 bg-zinc-700 rounded cursor-pointer"
            >
                {/* progress bar */}
                <div
                    className="h-2 bg-green-500 rounded"
                    style={{ width: `${progress * 100}%` }}
                />

                {/* hover tooltip */}
                {hoverTime !== null && hoverPercent !== null && (
                    <div
                        className="absolute -top-7 text-xs bg-black px-2 py-1 rounded pointer-events-none"
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

            {/* CONTROLS */}
            <div className="flex gap-2">
                {isVideo(activeMedia) && (
                <button onClick={() => setIsFullscreen(true)}>
                    ⛶
                </button>
                )}
                <button onClick={() =>setActiveMedia(null)}>
                    ✕
                </button>
            </div>
        </>
  );
};

export default PlayerControls;