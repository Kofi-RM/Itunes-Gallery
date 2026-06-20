type SearchBarProps = {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

const SearchBar = ({ onSubmit }: SearchBarProps) => {
return(
<>
        <form onSubmit={onSubmit} className="flex gap-4 mb-8">
          <input
            id="searchQuery"
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3"
            placeholder="Search..."
          />

          <select
            id="mediaType"
            className="bg-zinc-900 border border-zinc-700 rounded-lg px-4"
          >
            <option value="music">Music</option>
            <option value="podcast">Podcast</option>
            <option value="musicVideo">Music Video</option>
            <option value="tvShow">TV Show</option>
            <option value="software">Software</option>
            <option value="ebook">Ebook</option>
          </select>

          <button className="bg-green-500 text-black px-6 rounded-lg font-bold">
            Search
          </button>
        </form>
        </>
        )
}

export default SearchBar;