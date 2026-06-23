import { useEffect, useState } from "react";
import type { Result } from "../type/Result";
import helperFunctions from "../util/helperFunctions";

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

  setIsFullscreen: (f: boolean) => void;
};

const PlayerControls = ({
  volume,
  setVolume,
  isPlaying,
  togglePlay,
  seek,
  duration,
  currentTime,
  progress,
  setActiveMedia,
  setIsFullscreen,
}: Props) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState<number | null>(null);

  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverPercent, setHoverPercent] = useState<number | null>(null);

  const formatTime = helperFunctions.formatTime;

  const displayedProgress =
    dragProgress !== null ? dragProgress : progress;

  const getPercentFromEvent = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const percent =
      (e.clientX - rect.left) / rect.width;

    return Math.max(0, Math.min(1, percent));
  };

  const handleMouseDown = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    setIsDragging(true);

    const percent = getPercentFromEvent(e);

    setDragProgress(percent);
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const bar = document.getElementById("scrubber");
      if (!bar) return;

      const rect = bar.getBoundingClientRect();

      const percent =
        (e.clientX - rect.left) / rect.width;

      const clamped = Math.max(
        0,
        Math.min(1, percent)
      );

      setDragProgress(clamped);
    };

    const stopDragging = () => {
      if (dragProgress !== null) {
        seek(dragProgress * duration);
      }

      setDragProgress(null);
      setIsDragging(false);
    };

    window.addEventListener(
      "mousemove",
      handleMove
    );

    window.addEventListener(
      "mouseup",
      stopDragging
    );

    return () => {
      window.removeEventListener(
        "mousemove",
        handleMove
      );

      window.removeEventListener(
        "mouseup",
        stopDragging
      );
    };
  }, [isDragging, dragProgress, duration, seek]);

  return (
    <>
      <button onClick={togglePlay}>
        {isPlaying ? "⏸" : "▶"}
      </button>

      <div>
        {formatTime(currentTime)} /{" "}
        {formatTime(duration)}
      </div>

      {/* SCRUBBER */}
      <div
        id="scrubber"
        className="
          relative
          flex-1
          h-2
          bg-zinc-700
          rounded
          cursor-pointer
        "
        onMouseMove={(e) => {
          const percent =
            getPercentFromEvent(e);

          setHoverPercent(percent);
          setHoverTime(percent * duration);
        }}
        onMouseLeave={() => {
          setHoverPercent(null);
          setHoverTime(null);
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Progress */}
        <div
          className="
            absolute
            left-0
            top-0
            h-full
            bg-green-500
            rounded
          "
          style={{
            width: `${
              displayedProgress * 100
            }%`,
          }}
        />

        {/* Thumb */}
        <div
          className="
            absolute
            top-1/2
            w-4
            h-4
            bg-white
            rounded-full
            shadow
            cursor-grab
          "
          style={{
            left: `${
              displayedProgress * 100
            }%`,
            transform:
              "translate(-50%, -50%)",
          }}
        />

        {/* Hover Tooltip */}
        {hoverTime !== null &&
          hoverPercent !== null && (
            <div
              className="
                absolute
                -top-8
                text-xs
                bg-black
                text-white
                px-2
                py-1
                rounded
                whitespace-nowrap
                pointer-events-none
              "
              style={{
                left: `${
                  hoverPercent * 100
                }%`,
                transform:
                  "translateX(-50%)",
              }}
            >
              {formatTime(hoverTime)}
            </div>
          )}
      </div>

      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={(e) =>
          setVolume(
            Number(e.target.value)
          )
        }
      />

      <button
        onClick={() =>
          setIsFullscreen(true)
        }
      >
        ⛶
      </button>

      <button
        onClick={() =>
          setActiveMedia(null)
        }
      >
        ✕
      </button>
    </>
  );
};

export default PlayerControls;