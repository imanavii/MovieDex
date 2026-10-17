import { notFound } from "next/navigation";
import MovieDetails from "@/components/movie/MovieDetails";
import { getMovieDetails } from "@/lib/tmdb/movies";
import ScrollToTop from "@/components/movie/ScrollToTop";

export default async function MoviePage({ params }) {
  const { id } = await params;

  let movie;

  try {
    movie = await getMovieDetails(id);
  } catch {
    notFound();
  }

  if (!movie?.id) {
    notFound();
  }

  return (
    <>
      <ScrollToTop />
      <MovieDetails movie={movie} />
    </>
  );
}