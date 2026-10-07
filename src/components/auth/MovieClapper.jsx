"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function MovieClapper() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setError("");

    if (isSignup) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      setError("Check your email to confirm your account.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative w-full max-w-md"
    >
      {/* Clapper */}
      <div className="relative z-20 h-14 -rotate-2 overflow-hidden rounded-t-xl border border-white/15 bg-zinc-900 shadow-2xl">
        <div
          className="absolute inset-0 opacity-80"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, transparent 0 18px, rgba(255,255,255,0.9) 18px 32px)",
          }}
        />

        <div className="absolute inset-0 bg-black/30" />

        <div className="relative flex h-full items-center justify-between px-5">
          <span className="text-xs font-bold tracking-[0.3em] text-white">
            MOVIEDEX
          </span>

          <span className="text-[10px] uppercase tracking-[0.25em] text-zinc-400">
            Scene 01
          </span>
        </div>
      </div>

      {/* Slate */}
      <div className="relative -mt-1 rounded-b-2xl border border-white/10 bg-zinc-950 p-7 shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
        <div className="mb-7 grid grid-cols-3 gap-4 border-b border-white/10 pb-5 text-[10px] uppercase tracking-[0.2em]">
          <div>
            <span className="block text-zinc-600">Production</span>
            <span className="mt-1 block text-zinc-300">MovieDex</span>
          </div>

          <div>
            <span className="block text-zinc-600">Scene</span>
            <span className="mt-1 block text-zinc-300">01</span>
          </div>

          <div>
            <span className="block text-zinc-600">Take</span>
            <span className="mt-1 block text-zinc-300">01</span>
          </div>
        </div>

        <p className="text-xs uppercase tracking-[0.3em] text-zinc-600">
          Cast & Crew
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
          {isSignup ? "Join MovieDex" : "Sign in to MovieDex"}
        </h1>

        <p className="mt-2 text-sm leading-relaxed text-zinc-500">
          {isSignup
            ? "Create your account and start building your cinematic universe."
            : "Your watchlist, favorites, and cinematic universe await."}
        </p>

        {/* Login / Signup */}
        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-zinc-500">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
              className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-white/25 focus:bg-white/7"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-zinc-500">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-white/25 focus:bg-white/7"
            />
          </div>

          {error && (
            <p className="text-sm text-zinc-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-xl bg-white text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Rolling..."
              : isSignup
                ? "Join the production"
                : "Enter the screening room"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setIsSignup(!isSignup);
            setError("");
          }}
          className="mt-5 w-full text-center text-sm font-medium text-zinc-300 transition hover:text-white"
        >
          {isSignup
            ? "Already part of the cast? Sign in"
            : "New to MovieDex? Create an account"}
        </button>

        <div className="mt-6 border-t border-white/10 pt-5 text-center">
          <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-700">
            A MovieDex Production
          </p>
        </div>
      </div>
    </motion.div>
  );
}