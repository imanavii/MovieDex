import Navbar from "@/components/layout/Navbar";
import MovieRow from "@/components/movie/MovieRow";
import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
} from "@/lib/tmdb/movies";

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
          <div className="mt-10 w-full max-w-2xl">
            <div className="flex h-14 items-center rounded-full border border-white/10 bg-white/6 px-5 shadow-2xl backdrop-blur-xl">
              <span className="mr-3 text-zinc-500">⌕</span>

              <input
                type="text"
                placeholder="Search movies, actors, genres..."
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
              />
            </div>
          </div>
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