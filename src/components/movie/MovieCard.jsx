import Link from "next/link";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export default function MovieCard({ movie }) {
  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : null;

  const rating = movie.vote_average
    ? movie.vote_average.toFixed(1)
    : null;

  return (
    <Link
      href={`/movie/${movie.id}`}
      className="group block w-55 shrink-0"
    >
      {/* Poster */}
      <div className="relative aspect-2/3 overflow-hidden rounded-t-2xl bg-zinc-900">
        {movie.poster_path ? (
          <img
            src={`${IMAGE_BASE_URL}${movie.poster_path}`}
            alt={movie.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-zinc-500">
            No poster
          </div>
        )}

        <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/20" />

        {rating && (
          <div className="absolute right-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md">
            ★ {rating}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="min-h-36.25 rounded-b-2xl bg-zinc-900 px-4 py-4">
        <h3 className="truncate text-lg font-semibold tracking-tight text-white">
          {movie.title}
        </h3>

        <div className="mt-2 flex items-center gap-2 text-xs uppercase tracking-wider text-zinc-500">
          {year && <span>{year}</span>}
          {year && <span>•</span>}
          <span>Movie</span>
        </div>

        {movie.overview && (
          <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-zinc-400">
            {movie.overview}
          </p>
        )}
      </div>
    </Link>
  );
}