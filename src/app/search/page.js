import Link from "next/link";
import { Search } from "lucide-react";

import MovieCard from "@/components/movie/MovieCard";
import { Button } from "@/components/ui/button";
import { searchMovies, discoverMovies } from "@/lib/tmdb/movies";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

const languages = [
  { label: "All", value: "" },
  { label: "English", value: "en" },
  { label: "Hindi", value: "hi" },
  { label: "Marathi", value: "mr" },
];

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;

  const query = params?.q?.trim() || "";
  const language = params?.language || "";

  let movies = [];

  try {
    if (query) {
      const data = await searchMovies(query);
      movies = data?.results || [];

      if (language) {
        movies = movies.filter(
          (movie) => movie.original_language === language
        );
      }
    } else if (language) {
      const data = await discoverMovies(language);
      movies = data?.results || [];
    }
  } catch (error) {
    console.error("Movie search failed:", error);
  }

  const selectedLanguage =
    languages.find((item) => item.value === language)?.label || "All";

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

        {/* Search Hero */}
        <div className="mx-auto mt-16 max-w-2xl text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-zinc-500">
            MovieDex Search
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Find your next movie.
          </h1>

          {/* Search */}
          <form action="/search" method="GET" className="mt-8">
            <input
              type="hidden"
              name="language"
              value={language}
            />

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

          {/* Language Filters */}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {languages.map((item) => {
              const filterParams = new URLSearchParams();

              if (query) {
                filterParams.set("q", query);
              }

              if (item.value) {
                filterParams.set("language", item.value);
              }

              const href = filterParams.toString()
                ? `/search?${filterParams.toString()}`
                : "/search";

              const active = language === item.value;

              return (
                <Button
                  key={item.value || "all"}
                  asChild
                  variant={active ? "default" : "outline"}
                  className="shrink-0 rounded-full border-white/10 bg-white/6 px-5 text-zinc-300 hover:bg-white/10 hover:text-white"
                >
                  <Link href={href}>
                    {item.label}
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Results */}
        {(query || language) && (
          <section className="mt-16">
            <div className="mb-6">
              <p className="text-sm text-zinc-500">
                {query ? "Search results for" : "Movies in"}
              </p>

              <h2 className="mt-1 text-2xl font-semibold">
                {query ? `"${query}"` : selectedLanguage}
              </h2>
            </div>

            {movies.length > 0 ? (
              <div className="flex flex-wrap gap-5">
                {movies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/3 px-6 py-16 text-center">
                <p className="text-zinc-400">
                  No movies found.
                </p>
              </div>
            )}
          </section>
        )}

        {/* Initial State */}
        {!query && !language && (
          <div className="mt-20 text-center">
            <p className="text-zinc-500">
              Search for a movie or choose a language.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}