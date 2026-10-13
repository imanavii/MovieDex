
import MovieCollection from "@/components/movie/MovieCollection";

export default function FavoritesPage() {
  return (
    <MovieCollection
      type="favorites"
      title="Your Favorites"
      description="The movies you love, all in one place."
    />
  );
}
