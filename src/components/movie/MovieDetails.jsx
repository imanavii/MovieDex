import Link from "next/link";
import { ArrowLeft, Star, Clock, Calendar } from "lucide-react";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export default function MovieDetails({ movie }) {
  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : null;

  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : null;

  return (
    <main className="min-h-screen bg-[#070707] text-white">
      {/* Backdrop */}
      <div className="relative h-[70vh] min-h-137.5 overflow-hidden">
        {movie.backdrop_path && (
          <img
            src={`${IMAGE_BASE_URL}/original${movie.backdrop_path}`}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        <div className="absolute inset-0 bg-linear-to-t from-[#070707] via-[#070707]/70 to-black/20" />
        <div className="absolute inset-0 bg-linear-to-r from-[#070707]/90 via-transparent to-transparent" />

        {/* Back button */}
        <div className="absolute left-6 top-6 z-10 lg:left-10">
          <Link
  href="/"
  className="flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-white backdrop-blur-md transition hover:bg-white/10"
>
  <ArrowLeft />
  Back
</Link>
        </div>

        {/* Movie information */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="mx-auto flex max-w-375 items-end gap-8 px-6 pb-12 lg:px-10">
            {/* Poster */}
            <div className="hidden w-55 shrink-0 overflow-hidden rounded-2xl shadow-2xl md:block">
              {movie.poster_path && (
                <img
                  src={`${IMAGE_BASE_URL}/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full"
                />
              )}
            </div>

            <div className="max-w-3xl">
              <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-zinc-400">
                {year && (
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {year}
                  </span>
                )}

                {runtime && (
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {runtime}
                  </span>
                )}

                <span className="flex items-center gap-1 text-white">
                  <Star size={14} fill="currentColor" />
                  {movie.vote_average?.toFixed(1)}
                </span>
              </div>

              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                {movie.title}
              </h1>

              {movie.tagline && (
                <p className="mt-4 text-lg italic text-zinc-400">
                  "{movie.tagline}"
                </p>
              )}

              <p className="mt-6 max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">
                {movie.overview}
              </p>

              {/* Genres */}
              {movie.genres?.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs text-zinc-300 backdrop-blur-md"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}