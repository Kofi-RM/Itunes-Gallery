import { useEffect, useState } from "react";
import type { Result } from "../type/Result";
import helperFunctions from "../util/helperFunctions";

type Props = {
    activeMedia: Result | null;
    isPlaying: boolean;
    togglePlay: () => void;

    currentTime: number;
    duration: number;
    progress: number;

    volume: number;
    setVolume: (v: number) => void;

    seek: (t: number) => void;
    mediaRef: React.RefObject<HTMLVideoElement | HTMLAudioElement | null>;
    setActiveMedia: (m: Result | null) => void;
    isFullscreen: boolean;
    setIsFullscreen: (f: boolean) => void;
};

const isVideo = helperFunctions.isVideo;

export default function MediaPlayer({
    activeMedia,
    isPlaying,
    togglePlay,
    currentTime,
    duration,
    progress,
    volume,
    setVolume,
    seek,
    mediaRef,
    setActiveMedia,
    isFullscreen,
    setIsFullscreen,
}: Props) {
    

    const [hoverTime, setHoverTime] = useState<number | null>(null);
    const [hoverPercent, setHoverPercent] = useState<number | null>(null);

    const formatTime = helperFunctions.formatTime;

    const getPercentFromEvent = (e: React.MouseEvent<HTMLDivElement>) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const percent = (e.clientX - rect.left) / rect.width;
  return Math.max(0, Math.min(1, percent));
};

useEffect(() => {
  const media = mediaRef.current;
  console.log("MediaPlayer: volume effect", { volume, activeMedia, media });
  if (!media) return;

  media.volume = volume;
}, [volume, activeMedia, mediaRef]);

useEffect(() => {
  const media = mediaRef.current;
  if (!media || !activeMedia) return;

  media.volume = volume;
}, [activeMedia, volume, mediaRef]);

    if (!activeMedia) return null;

    const isVideoMedia = isVideo(activeMedia);

    

    return (
       <div className="flex items-center w-full gap-4">

            {/* MEDIA DISPLAY */}
            {isVideoMedia ? (
                <video
                    ref={mediaRef as React.RefObject<HTMLVideoElement>}
                    src={activeMedia.previewUrl}
                    autoPlay
                    className={
                        isFullscreen
                            ? "fixed inset-0 w-full h-full object-contain bg-black z-50"
                            : "w-20 h-20 rounded object-cover cursor-pointer"
                    }
                    onClick={() => setIsFullscreen(true)}
                />
            ) : (
                <>
                    <audio ref={mediaRef as React.RefObject<HTMLAudioElement>} src={activeMedia.previewUrl} autoPlay className="hidden" />

                    <img
                        src={activeMedia.artworkUrl100.replace("100x100", "300x300")}
                        className="w-14 h-14 rounded"
                        alt={activeMedia.trackName}
                    />
                </>
            )}

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
                <button onClick={() => setIsFullscreen(true)}>
                    ⛶
                </button>

                <button onClick={() => setActiveMedia(null)}>
                    ✕
                </button>
            </div>
        </div>
    );
}