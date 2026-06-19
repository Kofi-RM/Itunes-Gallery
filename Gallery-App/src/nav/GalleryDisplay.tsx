import { useState, useEffect } from "react";
import axios from "axios";

type Result = {
  trackId: number;
  trackName: string;
  artistName: string;
  artworkUrl100: string;
  previewUrl: string;
  kind: string;
};

function GalleryDisplay() {
  const [results, setResults] = useState<Result[]>([]);
const [activeMedia, setActiveMedia] = useState<Result | null>(null);

// set variable for selected track

useEffect(() => {
console.log("Active Media:", activeMedia);
}, [activeMedia]);
  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const searchInput = document.getElementById(
      "searchQuery"
    ) as HTMLInputElement;

    const mediaTypeSelect = document.getElementById(
      "mediaType"
    ) as HTMLSelectElement;

    const queryValue = searchInput.value
      .trim()
      .split(" ")
      .join("+");

    const mediaType = mediaTypeSelect.value;

    try {
      const response = await axios.get(
        `https://itunes.apple.com/search?media=${mediaType}&term=${queryValue}&limit=36`
      );
console.log(response.data.results);
      setResults(response.data.results.slice(0, 36));
    } catch (error) {
      console.error(error);
    }
  }; // on submit function to fetch data from iTunes API based on search query and media type

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-5xl font-bold mb-8 text-white">
          Gallery Live
        </h1>

        <form
          onSubmit={onSubmit}
          className="flex gap-4 mb-8"
        >  
        {/* form for search input and media type selection */}
          <input
            id="searchQuery"
            type="text"
            placeholder="Search..."
            className="
              flex-1
              bg-zinc-900
              border
              border-zinc-700
              rounded-lg
              px-4
              py-3
              outline-none
            "
          />

          <select
            id="mediaType"
            className="
              bg-zinc-900
              border
              border-zinc-700
              rounded-lg
              px-4
            "
          >
            <option value="music">Music</option>
            <option value="podcast">Podcast</option>
            <option value="musicVideo">Music Video</option>
            <option value="tvShow">TV Show</option>
            <option value="software">Software</option>
            <option value="ebook">Ebook</option>
          </select>
          {/* Select Button */}
          <button
            type="submit"
            className="
              bg-green-500
              hover:bg-green-400
              text-black
              font-bold
              px-6
              rounded-lg
            "
          >
            Search
          </button>
           {/* Search button */}
        </form>

        {results.length > 0 ? (
          <div className="grid grid-cols-6 gap-6">
            {results.map((result) => (
              <div
                key={result.trackId}
                className="
                  bg-zinc-900
                  rounded-lg
                  p-3
                  hover:bg-zinc-800
                  transition-colors
                "
              >
                <div className="relative group">
                  <img
                    src={result.artworkUrl100.replace(
                      "100x100",
                      "600x600"
                    )}
                    alt={result.trackName}
                    className="
                      w-full
                      aspect-square
                      object-cover
                      rounded-md
                    "
                  />

                  {result.previewUrl && (
                    <button
                      onClick={() =>
                        setActiveMedia(result)
                      }
                      className="
                        relative
                        bottom-20
                      
                        w-12
                        h-12
                        rounded-full
                        bg-green-500
                        text-black
                        text-xl
                        font-bold
                        shadow-lg
                        opacity-0
                        translate-y-2
                        group-hover:opacity-100
                        group-hover:translate-y-0
                        transition-all
                        duration-200
                      "
                    >
                      ▶
                    </button>
                  )}
                </div>
{/* If there is an preview, give hover button and set active media */}
                <p
                  className="
                    mt-3
                    font-semibold
                    truncate
                  "
                >
                  {result.trackName}
                </p>

                <p
                  className="
                    text-zinc-400
                    text-sm
                    truncate
                  "
                >
                  {result.artistName}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-zinc-400">
            Search for something to begin.
          </p>
        )}
      </div>

{/* Active Media Player Banner at Bottom */}
      {activeMedia && (
        <div
          className="
            fixed
            bottom-0
            left-0
            right-0
            h-24
            bg-zinc-950
            border-t
            border-zinc-800
            flex
            items-center
            gap-4
            px-6
          "
        >
          
          <img
            src={activeMedia.artworkUrl100.replace(
              "100x100",
              "300x300"
            )}
            alt={activeMedia.trackName}
            className="
              w-16
              h-16
              rounded
            "
          />
  {/* Image and Track Info */}
          <div className="w-60">
            <h3 className="font-semibold truncate">
              {activeMedia.trackName}
            </h3>

            <p
              className="
                text-zinc-400
                text-sm
                truncate
              "
            >
              {activeMedia.artistName}
            </p>
          </div>

{/* Audio Player */}

         {activeMedia.kind === "music-video" || activeMedia.kind === "tv-episode" ? (
      <video
        src={activeMedia.previewUrl}
        controls
        autoPlay
        className="h-24 rounded"
      />
    ) : (
   <audio

            key={activeMedia.previewUrl}

            controls

            autoPlay

            src={activeMedia.previewUrl}

            className="flex-1"

          />
    )}


          <button
            onClick={() =>
              setActiveMedia(null)
            }
            className="
              text-zinc-400
              hover:text-white
              text-xl
            "
          >
            ✕
          </button>
        
        </div>
      )}
    </div>
  );
}

export default GalleryDisplay;