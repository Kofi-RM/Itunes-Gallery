import type { Result } from "../type/Result";
import { useAuth } from "../auth/useAuth";
import BookmarkFilled from "../assets/icons/BookmarkFilled";
import BookmarkOutline from "../assets/icons/BookmarkOutline";
import useBookmarks from "../bookmark/useBookmarks";

export default function Card({ result, onClick }: { result: Result; onClick: () => void }) {
  const { toggleBookmark, isBookmarked } = useBookmarks();
  const { loggedIn } = useAuth();
  const bookmarked = isBookmarked(result.trackId);
  const artwork = result.artworkUrl100 || "/itunes.jpg";
  return <article className="min-w-0 bg-zinc-900 rounded-lg p-2 sm:p-3 text-left">
    <img src={artwork.replace("100x100", "300x300")} alt=""
      loading="lazy" decoding="async" width={300} height={300}
      className="w-full aspect-square object-cover rounded-md" />
    <p className="text-white font-semibold line-clamp-2 mt-2 break-words">{result.trackName}</p>
    <p className="text-zinc-400 text-sm line-clamp-2 break-words">{result.artistName}</p>
    <div className="flex flex-wrap items-center justify-between gap-1 mt-2">
      {result.previewUrl ? <button onClick={onClick}
        aria-label={`Play preview of ${result.trackName}`}
        className="min-h-11 px-2 rounded-lg bg-green-500 text-black text-sm font-medium">
        <span aria-hidden="true">▶ </span>Preview
      </button> : <span className="text-xs text-zinc-400">No preview</span>}
      {loggedIn && <button onClick={() => toggleBookmark(result)}
        aria-label={`${bookmarked ? "Unsave" : "Save"} ${result.trackName}`}
        aria-pressed={bookmarked}
        className="min-h-11 min-w-11 flex items-center justify-center rounded-lg bg-zinc-800">
        <span aria-hidden="true" className={bookmarked ? "text-yellow-400" : "text-white"}>
          {bookmarked ? <BookmarkFilled /> : <BookmarkOutline />}
        </span>
      </button>}
    </div>
  </article>;
}
