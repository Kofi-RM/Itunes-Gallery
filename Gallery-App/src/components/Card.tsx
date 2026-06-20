import type {Result} from "../type/Result";
type CardProps = {
  result: Result;
  onClick: () => void;
  
};

function Card({ result, onClick }: CardProps) {

    return (
        <div
              
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
    src={result.artworkUrl100.replace("100x100", "600x600")}
    alt={result.trackName}
    className="w-full aspect-square object-cover rounded-md"
  />

  {result.previewUrl && (
    <button
      onClick={onClick}
      className="
        absolute
        inset-0
        flex
        items-center
        justify-center
        bg-black/40
        opacity-0
        group-hover:opacity-100
        transition
      "
    >
      <div
        className="
          w-[25%]
          max-w-16
          aspect-square
         opacity-80
          text-white
          text-2xl
          font-bold
          flex
          items-center
          justify-center
          shadow-lg
          hover:scale-110
          transition
        "
      >
        ▶
      </div>
    </button>
  )}
</div>

{/* If there is an preview, give hover button and set active media */}
               <p className="text-white font-semibold truncate" title={result.trackName}>
  {result.trackName}
</p>

               <p className="text-zinc-400 text-[clamp(0.75rem,1vw,0.9rem)] ">
                  {result.artistName}
                </p>
              </div>
    )
}

export default Card