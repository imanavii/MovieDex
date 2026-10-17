import Link from "next/link";
import {
  ArrowLeft,
  Star,
  Clock,
  Calendar,
  Play,
  UserRound,
} from "lucide-react";
import MovieSaveActions from "@/components/movie/MovieSaveActions";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export default function MovieDetails({ movie }) {
  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : null;

  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : null;

  const cast = movie.credits?.cast?.slice(0, 10) ?? [];

  const videos = movie.videos?.results ?? [];

  const trailer =
    videos.find(
      (video) =>
        video.site === "YouTube" &&
        video.type === "Trailer" &&
        video.official === true &&
        video.key
    ) ??
    videos.find(
      (video) =>
        video.site === "YouTube" &&
        video.type === "Trailer" &&
        video.key
    ) ??
    videos.find(
      (video) =>
        video.site === "YouTube" &&
        video.type === "Teaser" &&
        video.key
    );

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#070707] text-white">
      {/* HERO */}
      <section className="relative isolate min-h-[680px] overflow-hidden sm:min-h-[720px] lg:min-h-[760px]">
        {/* Backdrop */}
        {movie.backdrop_path && (
          <img
            src={`${IMAGE_BASE_URL}/original${movie.backdrop_path}`}
            alt=""
            fetchPriority="high"
            className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
          />
        )}

        {/* Cinematic overlays */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#070707] via-[#070707]/65 to-black/25" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#070707]/90 via-[#070707]/45 to-transparent" />

        {/* Back button */}
        <div className="absolute left-5 top-5 z-20 sm:left-8 sm:top-7 lg:left-10">
          <Link
            href="/discover"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-4 py-2.5 text-sm text-white backdrop-blur-md transition hover:bg-white/10"
          >
            <ArrowLeft size={18} />
            Back
          </Link>
        </div>

        {/* Main movie information */}
        <div className="relative z-10 mx-auto flex min-h-[680px] max-w-[1440px] items-end px-5 pb-12 pt-28 sm:min-h-[720px] sm:px-8 sm:pb-16 lg:min-h-[760px] lg:px-12">
          <div className="flex w-full items-end gap-8 lg:gap-12">
            {/* Poster */}
            {movie.poster_path && (
              <div className="hidden w-52 shrink-0 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10 md:block lg:w-60">
                <img
                  src={`${IMAGE_BASE_URL}/w500${movie.poster_path}`}
                  alt={`${movie.title} poster`}
                  className="aspect-[2/3] w-full object-cover"
                />
              </div>
            )}

            {/* Details */}
            <div className="w-full min-w-0 max-w-3xl">
              <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-zinc-300">
                {year && (
                  <span className="flex items-center gap-1.5">
                    <Calendar size={15} />
                    {year}
                  </span>
                )}

                {runtime && (
                  <span className="flex items-center gap-1.5">
                    <Clock size={15} />
                    {runtime}
                  </span>
                )}

                {movie.vote_average > 0 && (
                  <span className="flex items-center gap-1.5 text-white">
                    <Star size={15} fill="currentColor" />
                    {movie.vote_average.toFixed(1)}
                  </span>
                )}
              </div>

              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl">
                {movie.title}
              </h1>

              {movie.tagline && (
                <p className="mt-4 text-base italic text-zinc-300 sm:text-lg">
                  &ldquo;{movie.tagline}&rdquo;
                </p>
              )}

              {movie.overview && (
                <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">
                  {movie.overview}
                </p>
              )}

              {/* Favorites and watchlist */}
              <div className="mt-6">
                <MovieSaveActions movie={movie} />
              </div>

              {/* Genres */}
              {movie.genres?.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="rounded-full border border-white/15 bg-black/30 px-3 py-1.5 text-xs text-zinc-200 backdrop-blur-md"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Trailer */}
              {trailer && (
                <a
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:scale-[1.02] hover:bg-zinc-200"
                >
                  <Play size={17} fill="currentColor" />
                  Watch Trailer
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CAST — separate section below the hero */}
      {cast.length > 0 && (
        <section className="mx-auto max-w-[1440px] px-5 pb-20 pt-8 sm:px-8 sm:pt-12 lg:px-12">
          <div className="mb-7">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-zinc-500">
              The people behind the film
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Top Cast
            </h2>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {cast.map((person) => (
              <article
                key={`${person.id}-${person.cast_id ?? person.order}`}
                className="w-32 shrink-0 sm:w-36"
              >
                <div className="aspect-[3/4] overflow-hidden rounded-xl bg-zinc-900 ring-1 ring-white/10">
                  {person.profile_path ? (
                    <img
                      src={`${IMAGE_BASE_URL}/w185${person.profile_path}`}
                      alt={person.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-300 hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-zinc-500">
                      <UserRound size={36} />
                    </div>
                  )}
                </div>

                <h3 className="mt-3 truncate text-sm font-medium text-white">
                  {person.name}
                </h3>

                <p className="mt-1 line-clamp-2 text-xs leading-5 text-zinc-500">
                  {person.character || "Cast member"}
                </p>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}