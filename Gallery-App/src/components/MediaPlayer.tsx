import { useEffect } from "react";
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
    duration: number;
    currentTime: number;
    progress: number;
    mediaRef: React.RefObject<HTMLVideoElement | HTMLAudioElement | null>;
    setActiveMedia: (m: Result | null) => void;
    isFullscreen: boolean;
    setIsFullscreen: (f: boolean) => void;
};

const isVideo = helperFunctions.isVideo;

export default function MediaPlayer({
    activeMedia,  
    volume,
    setVolume,
    mediaRef,
    setActiveMedia,
    isFullscreen,
    setIsFullscreen,
    isPlaying,
    togglePlay,
    seek,
    duration,
    currentTime,
    progress
}: Props) {
    

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
<div className="flex flex-col text-sm overflow-hidden">
    <p className="font-medium truncate">{activeMedia.trackName}</p>
    <p className="text-zinc-400 truncate">{activeMedia.artistName}</p>
</div>
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
                mediaRef={mediaRef}
            />
            </div>
       
    );
}