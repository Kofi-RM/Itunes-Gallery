import type { Result } from "../type/Result";
import Card from "./Card";

type ResultsGridProps = {
  results: Result[];
  onSelect:(result: Result) => void
};

const ResultsGrid = ({ results, onSelect }: ResultsGridProps) => {

    

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