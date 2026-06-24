import type { Result } from "../type/Result";
import Card from "./Card";
import useBookmarks from "../bookmark/useBookmarks";

type ResultsGridProps = {
  results: Result[];
  onSelect:(result: Result) => void
};

const ResultsGrid = ({ results, onSelect }: ResultsGridProps) => {
const{ bookmarks, toggleBookmark }= useBookmarks()

  
    return (
        <>
 {results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {results.map((result) => (
              <Card
                key={result.trackId}
                result={result}
                onClick={() => {
                 onSelect(result);
                }}
                bookmarked = {bookmarks.some(
  (bookmark) => bookmark.trackId === result.trackId
)}
                onBookmarkToggle={toggleBookmark}
              />
            ))}
          </div>
        ) : (
          <p className="text-zinc-400">Search for something...</p>
        )}
      </>
    )
}

export default ResultsGrid;