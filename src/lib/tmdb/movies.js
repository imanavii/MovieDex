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

export async function discoverMovies(language = "") {
  const languageParam = language
    ? `&with_original_language=${language}`
    : "";

  return tmdbFetch(
    `/discover/movie?sort_by=popularity.desc${languageParam}`
  );
}

export async function getMovieDetails(id) {
  return tmdbFetch(`/movie/${id}`);
}

export async function getHindiMovies() {
  return tmdbFetch(
    "/discover/movie?with_original_language=hi&sort_by=popularity.desc"
  );
}

export async function getMarathiMovies() {
  return tmdbFetch(
    "/discover/movie?with_original_language=mr&sort_by=popularity.desc"
  );
}