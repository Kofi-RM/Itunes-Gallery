import type { Result } from "../type/Result";
import helperFunctions from "../util/helperFunctions";
import PlayerControls from "./PlayerControls";

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
  toggleMute
}: Props) {
  if (!activeMedia) return null;

  const isVideo = helperFunctions.isVideo(activeMedia);

  return (
    <div className="flex items-center gap-4 w-full">

      {/* VIDEO */}
      <video
        ref={videoRef}
        className={
          isVideo
            ? isFullscreen
              ? "fixed inset-0 w-full h-full bg-black object-contain z-50"
              : "w-20 h-20 object-cover rounded cursor-pointer"
            : "hidden"
        }
        onClick={() => setIsFullscreen(true)}
      />

      {/* AUDIO */}
      <audio ref={audioRef} className="hidden" />

      {/* ARTWORK */}
      {!isVideo && (
        <img
          src={activeMedia.artworkUrl100.replace("100x100", "300x300")}
          className="w-14 h-14 rounded"
        />
      )}

      {/* INFO */}
      <div className="flex flex-col text-sm">
        <p className="truncate">{activeMedia.trackName}</p>
        <p className="text-zinc-400 truncate">{activeMedia.artistName}</p>
      </div>

      {/* CONTROLS */}
      <PlayerControls
        volume={volume}
        setVolume={setVolume}
        setActiveMedia={setActiveMedia}
        setIsFullscreen={setIsFullscreen}
        isPlaying={isPlaying}
        togglePlay={togglePlay}
        seek={seek}
        duration={duration}
        currentTime={currentTime}
        progress={progress}
        activeMedia={activeMedia}
        audioRef={audioRef}
        videoRef={videoRef}
        toggleMute={toggleMute}
      />
    </div>
  );
}