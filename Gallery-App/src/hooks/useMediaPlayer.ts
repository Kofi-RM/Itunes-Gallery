import { useCallback, useEffect, useRef, useState } from "react";
import type { Result } from "../type/Result";

export function useMediaPlayer() {
  const [activeMedia, setActiveMedia] = useState<Result | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [volume, setVolume] = useState(1);
const mediaRef = useRef<HTMLAudioElement | HTMLVideoElement | null>(null);

  

const loadMedia = useCallback((media: Result | null) => {
  if (!media) {
    mediaRef.current?.pause();
    setActiveMedia(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    return;
  }

  setActiveMedia(media);

  const mediaEl = mediaRef.current;
  if (!mediaEl) return;

  mediaEl.pause();
  mediaEl.src = media.previewUrl;
  mediaEl.load();
  mediaEl.play().then(() => setIsPlaying(true));
}, []);

  // PLAY / PAUSE
 const togglePlay = useCallback(() => {
  if (!mediaRef.current) return;

  if (isPlaying) {
    mediaRef.current.pause();
    setIsPlaying(false);
  } else {
    mediaRef.current.play();
    setIsPlaying(true);
  }
}, [isPlaying]);

  // SEEK
const seek = useCallback((time: number) => {
  if (!mediaRef.current) return;
  mediaRef.current.currentTime = time;
  setCurrentTime(time);
}, []);

  // VOLUME
  useEffect(() => {
    if (mediaRef.current) {
      mediaRef.current.volume = volume;
    }
  }, [volume]);

  // CLEANUP
  useEffect(() => {
    return () => {
      mediaRef.current?.pause();
      mediaRef.current = null;
    };
  }, []);

  useEffect(() => {
  const media = mediaRef.current;
  if (!media || !activeMedia) return;

  // reset
  setCurrentTime(0);
  setDuration(0);

  const onTimeUpdate = () => {
    setCurrentTime(media.currentTime);
  };

  const onLoaded = () => {
    setDuration(media.duration || 0);
  };

  const onEnd = () => {
    setIsPlaying(false);
  };

  media.addEventListener("timeupdate", onTimeUpdate);
  media.addEventListener("loadedmetadata", onLoaded);
  media.addEventListener("ended", onEnd);

  return () => {
    media.removeEventListener("timeupdate", onTimeUpdate);
    media.removeEventListener("loadedmetadata", onLoaded);
    media.removeEventListener("ended", onEnd);
  };
}, [activeMedia]);
  const progress = duration ? currentTime / duration : 0;

  return {
    activeMedia,
    setActiveMedia: loadMedia,

    isPlaying,
    togglePlay,

    currentTime,
    duration,
    progress,

    volume,
    setVolume,
    mediaRef,
    seek,
  };
}