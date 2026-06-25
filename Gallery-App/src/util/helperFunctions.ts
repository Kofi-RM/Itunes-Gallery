import type { Result } from "../type/Result";


const isVideo = (activeMedia: Result | null) => {
  if (!activeMedia) return false;
  return activeMedia?.kind === "music-video" || activeMedia?.kind === "tv-episode";
};


  const formatTime = (time: number) => {
  if (!time || isNaN(time)) return "0:00";

  const min = Math.floor(time / 60);
  const sec = Math.floor(time % 60);

  return `${min}:${sec.toString().padStart(2, "0")}`;
};


  // --
export default {
  isVideo,

  formatTime,
 
};