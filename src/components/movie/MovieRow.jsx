import MovieCard from "./MovieCard";

export default function MovieRow({ title, movies = [] }) {
  return (
    <section className="mb-14">
      <div className="mb-5">
        <p className="mb-1 text-xs font-medium uppercase tracking-[0.25em] text-zinc-500">
          MovieDex
        </p>

        <h2 className="text-2xl font-semibold tracking-tight text-white">
          {title}
        </h2>
      </div>

      <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-none [&::-webkit-scrollbar]:hidden">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}