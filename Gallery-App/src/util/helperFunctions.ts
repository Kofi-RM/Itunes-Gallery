import type { Result } from "../type/Result";
import axios from "axios";

const isVideo = (activeMedia: Result | null) => {
  if (!activeMedia) return false;
  return activeMedia?.kind === "music-video" || activeMedia?.kind === "tv-episode";
};

type onSubmitType =  {
    e: React.FormEvent<HTMLFormElement>;
    setResults: React.Dispatch<React.SetStateAction<Result[]>>;
}

  const onSubmit = async ({ e, setResults }: onSubmitType) => {
    e.preventDefault();

    const searchInput = document.getElementById(
      "searchQuery"
    ) as HTMLInputElement;

    const mediaTypeSelect = document.getElementById(
      "mediaType"
    ) as HTMLSelectElement;

    const queryValue = searchInput.value.trim().split(" ").join("+");
    const mediaType = mediaTypeSelect.value;

    const res = await axios.get(
      `https://itunes.apple.com/search?media=${mediaType}&term=${queryValue}&limit=36`
    );

    setResults(res.data.results.slice(0, 36));
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
  onSubmit,
  formatTime,
 
};