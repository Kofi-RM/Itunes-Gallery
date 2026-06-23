
import type { Result } from "../type/Result";
import helperFunctions from "../util/helperFunctions";
import VolumeIcon from "./VolumeIcon";
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

  setIsFullscreen: (f: boolean) => void;
  toggleMute: () => void;
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
  activeMedia,
  setActiveMedia,
  setIsFullscreen,
  toggleMute
}: Props) => {

   const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);


  const formatTime = helperFunctions.formatTime;



    const {isVideo} = helperFunctions
   
  return (
    <>
      <button onClick={togglePlay}>
        {isPlaying ? "⏸" : "▶"}
      </button>

      <div className="flex-shrink-0 w-20 text-sm">
        {formatTime(currentTime)} /{" "}
        {formatTime(duration)}
      </div>

      {/* SCRUBBER */}
     <Slider
     variant="media"
  value={progress}
  onChange={(v:number) => seek(v * duration)}
  onCommit={(v:number) => seek(v * duration)}
  formatTooltip={(v:number) =>
    helperFunctions.formatTime(v * duration)
  }
/>

<VolumeIcon toggleMute={toggleMute} volume={volume} />
{ !isIOS &&
    <Slider
    variant="volume"
  value={volume}
  onChange={setVolume}
 
 
/>}
{ isVideo(activeMedia) &&
      <button
        onClick={() =>
          setIsFullscreen(true)
        }
      >
        ⛶
      </button>
}
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