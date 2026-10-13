
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Navbar from "@/components/layout/Navbar";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export default function MovieCollection({ type, title, description }) {
  const router = useRouter();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMovies = useCallback(async () => {
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { data: { user }, error: authError } =
      await supabase.auth.getUser();

    if (authError || !user) {
      router.replace(`/login?next=${encodeURIComponent(`/${type}`)}`);
      return;
    }

    const { data, error: queryError } = await supabase
      .from("user_movies")
      .select("id, movie_id, movie_data, created_at")
      .eq("user_id", user.id)
      .eq("collection_type", type)
      .order("created_at", { ascending: false });

    if (queryError) {
      setError("Couldn't load your movies. Please try again.");
    } else {
      setMovies((data ?? []).map((row) => row.movie_data));
    }

    setLoading(false);
  }, [router, type]);

  useEffect(() => {
    loadMovies();
  }, [loadMovies]);

  async function removeMovie(movieId) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(`/${type}`)}`);
      return;
    }

    const { error: deleteError } = await supabase
      .from("user_movies")
      .delete()
      .eq("user_id", user.id)
      .eq("movie_id", movieId)
      .eq("collection_type", type);

    if (deleteError) {
      setError("Couldn't remove this movie. Please try again.");
      return;
    }

    setMovies((current) => current.filter((movie) => movie.id !== movieId));
    setError("");
  }

  return (
    <main className="min-h-screen bg-[#070707] text-white">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 pb-20 pt-32 lg:px-10">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          Your MovieDex
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          {title}
        </h1>
        <p className="mt-3 text-sm text-zinc-400">{description}</p>

        {loading ? (
          <p className="mt-12 text-sm text-zinc-400">Loading your movies…</p>
        ) : error ? (
          <div className="mt-12">
            <p role="alert" className="text-sm text-red-300">{error}</p>
            <button
              onClick={loadMovies}
              className="mt-4 rounded-full border border-white/15 px-4 py-2 text-sm hover:bg-white/10"
            >
              Try again
            </button>
          </div>
        ) : movies.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-white/10 bg-white/3 px-6 py-12 text-center">
            <h2 className="text-xl font-semibold">Nothing here yet</h2>
            <p className="mt-2 text-sm text-zinc-400">
              Save movies from their detail pages and they'll show up here.
            </p>
            <Link
              href="/discover"
              className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-200"
            >
              Explore movies
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {movies.map((movie) => (
              <article key={movie.id} className="min-w-0">
                <Link href={`/movie/${movie.id}`} className="group block">
                  <div className="aspect-2/3 overflow-hidden rounded-xl bg-zinc-900">
                    {movie.poster_path ? (
                      <img
                        src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                        alt={movie.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-zinc-500">
                        No poster
                      </div>
                    )}
                  </div>
                  <h2 className="mt-3 truncate text-sm font-semibold">
                    {movie.title}
                  </h2>
                  <p className="mt-1 text-xs text-zinc-500">
                    {movie.release_date?.slice(0, 4) || "Release date unknown"}
                    {movie.vote_average
                      ? ` · ★ ${movie.vote_average.toFixed(1)}`
                      : ""}
                  </p>
                </Link>

                <button
                  type="button"
                  onClick={() => removeMovie(movie.id)}
                  className="mt-3 text-xs text-zinc-400 transition hover:text-white"
                >
                  Remove from {type === "favorites" ? "Favorites" : "Watchlist"}
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
