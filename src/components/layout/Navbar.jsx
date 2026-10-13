
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const linkClass =
  "text-sm text-zinc-400 transition hover:text-white";

const actionClass =
  "rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 backdrop-blur-md transition hover:bg-white/10 hover:text-white disabled:opacity-50";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    async function loadUser() {
      const { data, error } = await supabase.auth.getUser();

      if (mounted) {
        setUser(error ? null : data.user ?? null);
        setCheckingSession(false);
      }
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
        setCheckingSession(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    setLoggingOut(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      setLoggingOut(false);
      return;
    }

    setUser(null);
    router.replace("/");
    router.refresh();
    setLoggingOut(false);
  }

  return (
    <nav className="absolute left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-6 lg:px-10">
      <Link
        href="/"
        className="text-xl font-semibold tracking-tight text-white"
      >
        Movie<span className="text-zinc-500">Dex</span>
      </Link>

      <div className="hidden items-center gap-8 md:flex">
        <Link href="/" className={linkClass}>
          Home
        </Link>
        <Link href="/discover" className={linkClass}>
          Discover
        </Link>
        <Link href="/watchlist" className={linkClass}>
          Watchlist
        </Link>
        <Link href="/favorites" className={linkClass}>
          Favorites
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {user && (
          <span className="hidden max-w-40 truncate text-xs text-zinc-500 lg:block">
            {user.email}
          </span>
        )}

        {checkingSession ? (
          <span
            aria-label="Checking sign-in status"
            className="h-9 w-16 animate-pulse rounded-full border border-white/10 bg-white/5"
          />
        ) : user ? (
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className={actionClass}
          >
            {loggingOut ? "Signing out…" : "Logout"}
          </button>
        ) : (
          <Link href="/login" className={actionClass}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
