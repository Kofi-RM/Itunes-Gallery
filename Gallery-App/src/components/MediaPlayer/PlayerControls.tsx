
import type { Result } from "../../type/Result";
import helperFunctions from "../../util/helperFunctions";

import Slider from "./Slider";

type Props = {
  activeMedia: Result | null;



  volume: number;
  setVolume: (v: number) => void;

  seek: (t: number) => void;

  currentTime: number;
  duration: number;
  progress: number;

  

  

 

};

const PlayerControls = ({

  
  seek,
  duration,
  currentTime,
  progress,
  
}: Props) => {

  


  const formatTime = helperFunctions.formatTime;



  
   
return (
    <div className="flex flex-col gap-2">

      {/* SCRUBBER */}
      <div className="flex items-center gap-2">
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

    
    </div>
  );
};

export default PlayerControls;