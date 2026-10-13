
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import MovieCard from "@/components/movie/MovieCard";
import { tmdbFetch } from "@/lib/tmdb/client";

const genres = [
  { id: "", name: "All genres" },
  { id: "28", name: "Action" },
  { id: "12", name: "Adventure" },
  { id: "16", name: "Animation" },
  { id: "35", name: "Comedy" },
  { id: "80", name: "Crime" },
  { id: "18", name: "Drama" },
  { id: "14", name: "Fantasy" },
  { id: "27", name: "Horror" },
  { id: "9648", name: "Mystery" },
  { id: "10749", name: "Romance" },
  { id: "878", name: "Science Fiction" },
  { id: "53", name: "Thriller" },
];

const languages = [
  { value: "", label: "Any language" },
  { value: "en", label: "English" },
  { value: "hi", label: "Hindi" },
  { value: "mr", label: "Marathi" },
];

const sortOptions = [
  { value: "popularity.desc", label: "Most popular" },
  { value: "vote_average.desc", label: "Highest rated" },
  { value: "primary_release_date.desc", label: "Newest releases" },
  { value: "revenue.desc", label: "Highest grossing" },
];

function makeHref(params, overrides = {}) {
  const next = new URLSearchParams();

  for (const [key, value] of Object.entries({
    ...params,
    ...overrides,
  })) {
    if (value) next.set(key, String(value));
  }

  const query = next.toString();
  return query ? `/discover?${query}` : "/discover";
}

export default async function DiscoverPage({ searchParams }) {
  const params = await searchParams;

  const genre = params?.genre || "";
  const language = params?.language || "";
  const sortBy = sortOptions.some(
    (item) => item.value === params?.sort_by
  )
    ? params.sort_by
    : "popularity.desc";

  const year = /^\d{4}$/.test(params?.year || "")
    ? params.year
    : "";

  const page = Math.min(
    Math.max(Number.parseInt(params?.page || "1", 10) || 1, 1),
    500
  );

  const query = new URLSearchParams({
    sort_by: sortBy,
    include_adult: "false",
    include_video: "false",
    page: String(page),
  });

  if (genre) query.set("with_genres", genre);
  if (language) query.set("with_original_language", language);
  if (year) query.set("primary_release_year", year);

  let movies = [];
  let totalPages = 1;
  let failed = false;

  try {
    const data = await tmdbFetch(
      `/discover/movie?${query.toString()}`
    );

    movies = data?.results || [];
    totalPages = Math.min(data?.total_pages || 1, 500);
  } catch (error) {
    console.error("Discover page failed to load:", error);
    failed = true;
  }

  const selectedGenre =
    genres.find((item) => item.id === genre)?.name || "All genres";

  const selectedLanguage =
    languages.find((item) => item.value === language)?.label ||
    "Any language";

  const selectedSort =
    sortOptions.find((item) => item.value === sortBy)?.label ||
    "Most popular";

  return (
    <main className="min-h-screen bg-[#070707] text-white">
      <Navbar />

      <div className="mx-auto max-w-375 px-6 pb-20 pt-32 lg:px-10">
        <header className="mb-10">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.35em] text-zinc-500">
            Explore the collection
          </p>

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Discover <span className="text-zinc-500">movies.</span>
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400 sm:text-base">
                Find your next favorite, from crowd-pleasing hits to hidden gems.
              </p>
            </div>

            <Link
              href="/search"
              className="inline-flex w-fit items-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-zinc-300 transition hover:bg-white/10 hover:text-white"
            >
              Search by title <span className="ml-2">↗</span>
            </Link>
          </div>
        </header>

        <form
          action="/discover"
          method="GET"
          className="mb-10 rounded-2xl border border-white/10 bg-white/[0.035] p-4 sm:p-6"
        >
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">
                Refine your search
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                Mix genres, languages and release years.
              </p>
            </div>

            <Link
              href="/discover"
              className="text-xs text-zinc-400 transition hover:text-white"
            >
              Reset filters
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="block">
              <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-500">
                Genre
              </span>
              <select
                name="genre"
                defaultValue={genre}
                className="h-12 w-full rounded-xl border border-white/10 bg-[#111] px-3 text-sm text-white outline-none focus:border-white/30"
              >
                {genres.map((item) => (
                  <option key={item.id || "all"} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-500">
                Language
              </span>
              <select
                name="language"
                defaultValue={language}
                className="h-12 w-full rounded-xl border border-white/10 bg-[#111] px-3 text-sm text-white outline-none focus:border-white/30"
              >
                {languages.map((item) => (
                  <option key={item.value || "any"} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-500">
                Release year
              </span>
              <input
                name="year"
                type="number"
                min="1900"
                max="2100"
                defaultValue={year}
                placeholder="Any year"
                className="h-12 w-full rounded-xl border border-white/10 bg-[#111] px-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-500">
                Sort by
              </span>
              <select
                name="sort_by"
                defaultValue={sortBy}
                className="h-12 w-full rounded-xl border border-white/10 bg-[#111] px-3 text-sm text-white outline-none focus:border-white/30"
              >
                {sortOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <button
            type="submit"
            className="mt-5 h-11 rounded-xl bg-white px-6 text-sm font-semibold text-black transition hover:bg-zinc-200"
          >
            Apply filters
          </button>
        </form>

        <section>
          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                Your results
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                {genre || language || year
                  ? "Picked for your filters"
                  : "Popular right now"}
              </h2>
            </div>

            <p className="text-sm text-zinc-500">
              {selectedGenre} · {selectedLanguage} · {selectedSort}
            </p>
          </div>

          {failed ? (
            <div className="rounded-2xl border border-white/10 bg-white/3 px-6 py-16 text-center">
              <h3 className="text-lg font-semibold">
                Couldn’t load movies
              </h3>
              <p className="mt-2 text-sm text-zinc-400">
                Check your TMDB API key and try again.
              </p>
              <Link
                href="/discover"
                className="mt-5 inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black"
              >
                Try again
              </Link>
            </div>
          ) : movies.length ? (
            <div className="flex flex-wrap justify-center gap-4 sm:justify-start sm:gap-5">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/3 px-6 py-16 text-center">
              <h3 className="text-lg font-semibold">
                No movies match those filters
              </h3>
              <p className="mt-2 text-sm text-zinc-400">
                Try a different genre, language or year.
              </p>
              <Link
                href="/discover"
                className="mt-5 inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black"
              >
                Clear filters
              </Link>
            </div>
          )}

          {!failed && totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-3">
              {page > 1 ? (
                <Link
                  href={makeHref({
                    genre,
                    language,
                    year,
                    sort_by: sortBy,
                    page: page - 1,
                  })}
                  className="rounded-full border border-white/10 px-5 py-2.5 text-sm text-zinc-300 transition hover:bg-white/10"
                >
                  ← Previous
                </Link>
              ) : (
                <span className="rounded-full border border-white/5 px-5 py-2.5 text-sm text-zinc-700">
                  ← Previous
                </span>
              )}

              <span className="text-xs tabular-nums text-zinc-500">
                Page {page} of {totalPages}
              </span>

              {page < totalPages ? (
                <Link
                  href={makeHref({
                    genre,
                    language,
                    year,
                    sort_by: sortBy,
                    page: page + 1,
                  })}
                  className="rounded-full border border-white/10 px-5 py-2.5 text-sm text-zinc-300 transition hover:bg-white/10 hover:text-white"
                >
                  Next →
                </Link>
              ) : (
                <span className="rounded-full border border-white/5 px-5 py-2.5 text-sm text-zinc-700">
                  Next →
                </span>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
