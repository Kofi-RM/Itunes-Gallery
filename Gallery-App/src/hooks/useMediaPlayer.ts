import { useCallback, useEffect, useRef, useState } from "react";
import type { Result } from "../type/Result";

export function useMediaPlayer() {
  const [activeMedia, setActiveMedia] = useState<Result | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load / switch media
  const loadMedia = useCallback((media: Result) => {
    setActiveMedia(media);
    setProgress(0);
    setIsPlaying(false);

    if (!audioRef.current) {
      audioRef.current = new Audio(media.previewUrl);
    } else {
      audioRef.current.src = media.previewUrl;
    }

    audioRef.current.load();
  }, []);

  // Play / Pause toggle
  const togglePlay = useCallback(() => {
    if (!audioRef.current || !activeMedia) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [isPlaying, activeMedia]);

  // Volume control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Progress tracking
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const update = () => {
      if (audio.duration) {
        setProgress(audio.currentTime / audio.duration);
      }
    };

    audio.addEventListener("timeupdate", update);

    return () => {
      audio.removeEventListener("timeupdate", update);
    };
  }, [activeMedia]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  return {
    activeMedia,
    setActiveMedia: loadMedia, // important: force usage through loader
    isPlaying,
    togglePlay,
    volume,
    setVolume,
    progress,
  };
}