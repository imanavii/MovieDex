import { tmdbFetch } from "./client";

export async function getTrendingMovies() {
  return tmdbFetch("/trending/movie/week");
}

export async function getPopularMovies() {
  return tmdbFetch("/movie/popular");
}

export async function getTopRatedMovies() {
  return tmdbFetch("/movie/top_rated");
}

export async function searchMovies(query) {
  return tmdbFetch(
    `/search/movie?query=${encodeURIComponent(query)}`
  );
}

export async function getMovieDetails(id) {
  return tmdbFetch(`/movie/${id}`);
}