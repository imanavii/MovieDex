
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const collections = [
  { type: "favorites", label: "Favorites", Icon: Heart },
  { type: "watchlist", label: "Watchlist", Icon: Bookmark },
];

export default function MovieSaveActions({ movie }) {
  const router = useRouter();
  const [saved, setSaved] = useState({});
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadSavedState() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user || !active) return;

      const { data, error } = await supabase
        .from("user_movies")
        .select("collection_type")
        .eq("user_id", user.id)
        .eq("movie_id", movie.id);

      if (!active) return;

      if (error) {
        setMessage("Couldn't load saved status.");
        return;
      }

      setSaved(
        Object.fromEntries((data ?? []).map((item) => [item.collection_type, true]))
      );
    }

    loadSavedState();

    return () => {
      active = false;
    };
  }, [movie.id]);

  async function toggleCollection(type) {
    if (busy) return;

    setBusy(type);
    setMessage("");

    try {
      const supabase = createClient();
      const { data: { user }, error: authError } =
        await supabase.auth.getUser();

      if (authError || !user) {
        router.push(`/login?next=${encodeURIComponent(`/movie/${movie.id}`)}`);
        return;
      }

      if (saved[type]) {
        const { error } = await supabase
          .from("user_movies")
          .delete()
          .eq("user_id", user.id)
          .eq("movie_id", movie.id)
          .eq("collection_type", type);

        if (error) throw error;

        setSaved((current) => ({ ...current, [type]: false }));
        setMessage(`Removed from ${type === "favorites" ? "Favorites" : "Watchlist"}.`);
      } else {
        const movieData = {
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          backdrop_path: movie.backdrop_path,
          release_date: movie.release_date,
          vote_average: movie.vote_average,
          overview: movie.overview,
        };

        const { error } = await supabase.from("user_movies").insert({
          user_id: user.id,
          movie_id: movie.id,
          collection_type: type,
          movie_data: movieData,
        });

        if (error) throw error;

        setSaved((current) => ({ ...current, [type]: true }));
        setMessage(`Added to ${type === "favorites" ? "Favorites" : "Watchlist"}.`);
      }
    } catch (error) {
      console.error("Unable to update movie collection:", error);
      setMessage("Couldn't update your collection. Please try again.");
    } finally {
      setBusy("");
    }
  }

  return (
    <div className="mt-7 flex flex-wrap gap-3">
      {collections.map(({ type, label, Icon }) => (
        <button
          key={type}
          type="button"
          onClick={() => toggleCollection(type)}
          disabled={Boolean(busy)}
          aria-pressed={Boolean(saved[type])}
          className={`inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm transition disabled:opacity-50 ${
            saved[type]
              ? "border-white bg-white text-black"
              : "border-white/15 bg-white/5 text-white hover:bg-white/10"
          }`}
        >
          <Icon size={17} fill={saved[type] && type === "favorites" ? "currentColor" : "none"} />
          {busy === type ? "Saving…" : saved[type] ? `In ${label}` : `Add to ${label}`}
        </button>
      ))}

      {message && (
        <p role="status" className="basis-full text-sm text-zinc-400">
          {message}
        </p>
      )}
    </div>
  );
}
