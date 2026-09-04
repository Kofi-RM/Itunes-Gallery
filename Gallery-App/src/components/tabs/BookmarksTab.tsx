
import useBookmarks from "../../bookmark/useBookmarks";

const BookmarksTab = () => {
  const { bookmarks, toggleBookmark } = useBookmarks()

  return (
    <div className="max-w-lg">
      <h1 className="text-xl font-medium text-white mb-6">Bookmarks</h1>
      {bookmarks.length === 0 && <p className="text-zinc-500 text-sm">No bookmarks yet.</p>}
      {bookmarks.map((b) => (
        <div key={b.trackId} className="flex items-center gap-3 py-3 border-b border-zinc-800">
          <img src={b.artworkUrl100} alt="" loading="lazy" className="w-10 h-10 rounded shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white truncate">{b.trackName}</p>
            <p className="text-xs text-zinc-500 truncate">{b.artistName}</p>
          </div>
          <button onClick={() => toggleBookmark(b)} aria-label={`Remove ${b.trackName} from bookmarks`}
            className="text-zinc-300 hover:text-white min-w-11 min-h-11 rounded-lg bg-zinc-800 shrink-0">
            <span aria-hidden="true">✕</span>
          </button>
        </div>
      ))}
    </div>
  );
};

export default BookmarksTab;
