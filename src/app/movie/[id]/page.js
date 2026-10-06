import { notFound } from "next/navigation";
import MovieDetails from "@/components/movie/MovieDetails";
import { getMovieDetails } from "@/lib/tmdb/movies";

export default async function MoviePage({ params }) {
  const { id } = await params;

  try {
    const movie = await getMovieDetails(id);

    if (!movie?.id) {
      notFound();
    }

    return <MovieDetails movie={movie} />;
  } catch {
    notFound();
  }
}