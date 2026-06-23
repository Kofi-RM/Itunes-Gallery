import { useCallback, useEffect, useRef, useState } from "react";
import type { Result } from "../type/Result";
import helperFunctions from "../util/helperFunctions";

export function useMediaPlayer() {
  const [activeMedia, setActiveMedia] = useState<Result | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

   const [volume, setVolume] = useState(
    Number(localStorage.getItem("volume")) || 0.5
  );

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const isVideo = helperFunctions.isVideo;

  // ----------------------------
  // GET ACTIVE MEDIA ELEMENT
  // ----------------------------
  const getMedia = useCallback(() => {
    if (!activeMedia) return null;
    return isVideo(activeMedia)
      ? videoRef.current
      : audioRef.current;
  }, [activeMedia]);

  // ----------------------------
  // LOAD MEDIA (ONLY PLACE)
  // ----------------------------
  useEffect(() => {
    if (!activeMedia) return;

    const video = videoRef.current;
    const audio = audioRef.current;
    if (!video || !audio) return;

    // stop both first (important)
    video.pause();
    audio.pause();

    const media = getMedia();
    if (!media) return;

    media.src = activeMedia.previewUrl;
    media.load();
    media.volume = volume;
    const onLoaded = async () => {
      try {
        await media.play();
        setDuration(media.duration || 0);
      } catch (e) {
        console.log("play blocked:", e);
      }
    };

    media.onloadedmetadata = onLoaded;
  }, [activeMedia]);

  // ----------------------------
  // GLOBAL EVENT LISTENERS (SYNC STATE)
  // ----------------------------
  useEffect(() => {
    const audio = audioRef.current;
    const video = videoRef.current;
    if (!audio || !video) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    const onTime = () => {
      const media = getMedia();
      if (!media) return;
      setCurrentTime(media.currentTime);
    };

    const onEnd = () => setIsPlaying(false);

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);

    audio.addEventListener("timeupdate", onTime);
    video.addEventListener("timeupdate", onTime);

    audio.addEventListener("ended", onEnd);
    video.addEventListener("ended", onEnd);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);

      audio.removeEventListener("timeupdate", onTime);
      video.removeEventListener("timeupdate", onTime);

      audio.removeEventListener("ended", onEnd);
      video.removeEventListener("ended", onEnd);
    };
  }, [activeMedia, getMedia]);

  // ----------------------------
  // CONTROLS
  // ----------------------------
  const togglePlay = () => {
    const media = getMedia();
    if (!media) return;

    if (media.paused) media.play();
    else media.pause();
  };

  const toggleMute = () => {
    const media = getMedia()
    if(!media) return;
    console.log("toggle pressed")
    if (media.muted) media.muted = false;
    else media.muted = true;
  }
  const seek = (time: number) => {
    const media = getMedia();
    if (!media) return;

    media.currentTime = time;
    setCurrentTime(time);
  };

  const adjustVolume = (v: number) => {
    if (audioRef.current) audioRef.current.volume = v;
    if (videoRef.current) videoRef.current.volume = v;

    setVolume(v);
  };

  useEffect(() => {
localStorage.setItem("volume", String(volume))
console.log("changed volume")
  },[volume])
  // ----------------------------
  // CLEANUP
  // ----------------------------
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      videoRef.current?.pause();
    };
  }, []);

  return {
    activeMedia,
    setActiveMedia,

    isPlaying,
    togglePlay,

    currentTime,
    duration,
    progress: duration ? currentTime / duration : 0,

    seek,
    adjustVolume,
    volume,

    audioRef,
    videoRef,
    toggleMute
  };
}