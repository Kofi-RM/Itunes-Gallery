import type { Result } from "../type/Result";
import helperFunctions from "../util/helperFunctions";

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
  toggleMute
}: Props) {
    
  

  if (!activeMedia) return null;
 const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isVideo = helperFunctions.isVideo(activeMedia);

  return (
    <div className="flex flex-col gap-2 w-full p-3 bg-zinc-900 rounded-xl">

  {/* TOP ROW — artwork, info, controls */}
  <div className="flex items-center gap-3">

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


    {/* track info */}
    <div className="flex flex-col min-w-0 flex-1">
      <p className="text-sm font-medium truncate text-white">{activeMedia.trackName}</p>
      <p className="text-xs text-zinc-400 truncate">{activeMedia.artistName}</p>
    </div>

    {/* buttons */}
    <div className="flex items-center gap-3 flex-shrink-0">
        {/* VOLUME */}
      {!isIOS && (
        <Slider variant="volume" value={volume} onChange={setVolume} />
      )}

      <VolumeIcon toggleMute={toggleMute} volume={volume} />
      <button onClick={togglePlay}>{isPlaying ? "⏸" : "▶"}</button>
      {isVideo && <button onClick={() => setIsFullscreen(true)}>⛶</button>}
      <button onClick={() => setActiveMedia(null)}>✕</button>
    </div>
  </div>

   {/* SCRUBBER + VOLUME */}
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
  );
}