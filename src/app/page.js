import Navbar from "@/components/layout/Navbar";
import MovieRow from "@/components/movie/MovieRow";
import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
} from "@/lib/tmdb/movies";
import { Search } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

export default async function Home() {
  const [trending, popular, topRated] = await Promise.all([
    getTrendingMovies(),
    getPopularMovies(),
    getTopRatedMovies(),
  ]);

  return (
    <main className="min-h-screen bg-[#070707] text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative flex min-h-155 items-center justify-center overflow-hidden px-6">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-125 w-125 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/4 blur-[120px]" />

        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
          <p className="mb-5 text-xs font-medium uppercase tracking-[0.4em] text-zinc-500">
            Your cinematic universe
          </p>

          <h1 className="text-6xl font-bold tracking-[-0.04em] sm:text-7xl md:text-8xl">
            MovieDex
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            Discover movies worth watching. Find your next obsession.
          </p>

          {/* Search */}
          <form action="/search" className="mt-10 w-full max-w-2xl">
            <InputGroup className="h-14 rounded-full border-white/10 bg-white/[0.06] shadow-2xl backdrop-blur-xl">
              <InputGroupAddon align="inline-start">
                <Search className="h-5 w-5 text-zinc-500" />
              </InputGroupAddon>

              <InputGroupInput
                name="q"
                type="text"
                placeholder="Search movies, actors, genres..."
                className="text-sm text-white placeholder:text-zinc-500"
              />
            </InputGroup>
          </form>
        </div>
      </section>

      {/* Movies */}
      <div className="mx-auto max-w-375 px-6 pb-20">
        <MovieRow
          title="Trending Now"
          movies={trending.results?.slice(0, 10) || []}
        />

        <MovieRow
          title="Popular Movies"
          movies={popular.results?.slice(0, 10) || []}
        />

        <MovieRow
          title="Top Rated"
          movies={topRated.results?.slice(0, 10) || []}
        />
      </div>
    </main>
  );
}