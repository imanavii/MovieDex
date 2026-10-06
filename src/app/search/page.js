import Link from "next/link";
import { Search } from "lucide-react";

import MovieCard from "@/components/movie/MovieCard";
import { searchMovies } from "@/lib/tmdb/movies";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const query = params?.q?.trim() || "";

  let movies = [];

  if (query) {
    try {
      const data = await searchMovies(query);
      movies = data?.results || [];
    } catch (error) {
      console.error("Movie search failed:", error);
    }
  }

  return (
    <main className="min-h-screen bg-[#070707] px-6 py-10 text-white">
      <div className="mx-auto max-w-375">
        {/* Back */}
        <Link
          href="/"
          className="text-sm text-zinc-500 transition hover:text-white"
        >
          ← Back to MovieDex
        </Link>

        {/* Search Header */}
        <div className="mx-auto mt-16 max-w-2xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-zinc-500">
            MovieDex Search
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Find your next movie.
          </h1>

          <form action="/search" method="GET" className="mt-8">
            <InputGroup className="h-14 rounded-full border-white/10 bg-white/6 shadow-2xl backdrop-blur-xl">
              <InputGroupAddon align="inline-start">
                <Search className="h-5 w-5 text-zinc-500" />
              </InputGroupAddon>

              <InputGroupInput
                name="q"
                type="text"
                defaultValue={query}
                placeholder="Search movies..."
                className="text-white placeholder:text-zinc-500"
              />
            </InputGroup>
          </form>
        </div>

        {/* Results */}
        {query && (
          <section className="mt-16">
            <div className="mb-6">
              <p className="text-sm text-zinc-500">
                Search results for
              </p>

              <h2 className="mt-1 text-2xl font-semibold">
                "{query}"
              </h2>
            </div>

            {movies.length > 0 ? (
              <div className="flex flex-wrap gap-5">
                {movies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/6 px-6 py-16 text-center">
                <p className="text-zinc-400">
                  No movies found.
                </p>
              </div>
            )}
          </section>
        )}

        {/* Empty state */}
        {!query && (
          <div className="mt-20 text-center">
            <p className="text-zinc-500">
              Search for a movie to get started.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}