import { useEffect, useRef } from "react";
import type { Result } from "../../type/Result";
import helperFunctions from "../../util/helperFunctions";
import VolumeIcon from "./VolumeIcon";
import Slider from "./Slider";

type Props = {
  activeMedia: Result | null;
  isPlaying: boolean;
  togglePlay: () => void;
  volume: number;
  setVolume: (value: number) => void;
  seek: (time: number) => void;
  currentTime: number;
  duration: number;
  progress: number;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  setActiveMedia: (media: Result | null) => void;
  isFullscreen: boolean;
  setIsFullscreen: (expanded: boolean) => void;
  toggleMute: () => void;
};

export default function MediaPlayer({ activeMedia, volume, setVolume, audioRef, videoRef,
  setActiveMedia, isFullscreen, setIsFullscreen, isPlaying, togglePlay, seek,
  duration, currentTime, progress, toggleMute }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const expandButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!isFullscreen) return;
    const previousOverflow = document.body.style.overflow;
    const returnFocus = expandButton.current;
    document.body.style.overflow = "hidden";
    container.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      if (returnFocus?.isConnected) returnFocus.focus();
    };
  }, [isFullscreen]);

  if (!activeMedia) return null;
  const isVideo = helperFunctions.isVideo(activeMedia);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const buttonClass = "min-w-11 min-h-11 flex items-center justify-center rounded-lg bg-zinc-800 text-white shrink-0";
  return <div ref={container} tabIndex={-1}
    role={isFullscreen ? "dialog" : "region"} aria-modal={isFullscreen || undefined}
    aria-label={isFullscreen ? "Expanded media player" : "Media player"}
    className={isFullscreen ? "safe-expanded min-h-full flex flex-col justify-center gap-4" : "max-w-6xl mx-auto p-2 sm:p-3"}
    onKeyDown={(event) => {
      if (!isFullscreen) return;
      if (event.key === "Escape") { event.preventDefault(); setIsFullscreen(false); }
      if (event.key === "Tab") {
        const controls = Array.from(container.current?.querySelectorAll<HTMLElement>("button:not(:disabled), input:not(:disabled)") ?? [])
          .filter((element) => element.getClientRects().length > 0);
        const first = controls[0], last = controls.at(-1);
        if (!first || !last) return;
        if (event.shiftKey && (document.activeElement === first || document.activeElement === container.current)) {
          event.preventDefault(); last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault(); first.focus();
        }
      }
    }}>
    <audio ref={audioRef} preload="metadata" />
    <div className={isFullscreen ? "flex flex-col items-center gap-4 min-w-0" : "flex items-center gap-2 min-w-0"}>
      {/* Keep the same video node in the same React-owned location when expanding. */}
      <video ref={videoRef} playsInline preload="metadata" hidden={!isVideo}
        aria-label={`Preview of ${activeMedia.trackName}`}
        className={isFullscreen ? "w-full max-h-[45svh] object-contain" : "w-11 h-11 object-cover rounded shrink-0"} />
      {!isVideo && <img src={activeMedia.artworkUrl100 || "/itunes.jpg"} alt=""
        className={isFullscreen ? "w-32 h-32 sm:w-48 sm:h-48 rounded-xl object-cover" : "w-11 h-11 rounded shrink-0"} />}
      <div className={isFullscreen ? "min-w-0 max-w-full text-center" : "min-w-0 flex-1 text-left"}>
        <p className={`text-sm text-white font-medium ${isFullscreen ? "break-words" : "truncate"}`}>{activeMedia.trackName}</p>
        <p className="text-xs text-zinc-400 truncate">{activeMedia.artistName}</p>
      </div>
      <div className={isFullscreen ? "flex flex-wrap items-center justify-center gap-2" : "flex items-center gap-1 shrink-0"}>
        <div className={isFullscreen ? "flex items-center gap-2" : "hidden md:flex items-center gap-2"}>
          {!isIOS && <Slider variant="volume" value={volume} onChange={setVolume} />}
          <VolumeIcon volume={volume} toggleMute={toggleMute} />
        </div>
        <button className={buttonClass} aria-label={isPlaying ? "Pause preview" : "Play preview"}
          onClick={togglePlay}><span aria-hidden="true">{isPlaying ? "⏸" : "▶"}</span></button>
        <button ref={expandButton} className={buttonClass}
          aria-label={isFullscreen ? "Collapse player" : "Expand player"} aria-expanded={isFullscreen}
          onClick={() => setIsFullscreen(!isFullscreen)}><span aria-hidden="true">{isFullscreen ? "⌄" : "⛶"}</span></button>
        <button className={buttonClass} aria-label="Close player"
          onClick={() => setActiveMedia(null)}><span aria-hidden="true">✕</span></button>
      </div>
    </div>
    <div className="flex items-center gap-2 w-full max-w-3xl mx-auto">
      <span className="text-xs text-zinc-300 tabular-nums shrink-0">{helperFunctions.formatTime(currentTime)}</span>
      <Slider className="flex-1" duration={duration} value={progress}
        onChange={(value) => seek(value * duration)}
        formatTooltip={(value) => helperFunctions.formatTime(value * duration)} />
      <span className="text-xs text-zinc-300 tabular-nums shrink-0">{helperFunctions.formatTime(duration)}</span>
    </div>
    {isFullscreen && <p className="text-xs text-zinc-400 text-center">Preview only{isIOS ? " · Use your device buttons to adjust volume" : ""}</p>}
  </div>;
}
