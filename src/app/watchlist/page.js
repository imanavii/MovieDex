
import MovieCollection from "@/components/movie/MovieCollection";

export default function WatchlistPage() {
  return (
    <MovieCollection
      type="watchlist"
      title="Your Watchlist"
      description="Keep track of what you want to watch next."
    />
  );
}
