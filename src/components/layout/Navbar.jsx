
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { UserRound } from "lucide-react";

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
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (mounted) {
        setUser(error ? null : user ?? null);
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
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Logout failed:", error);
        return;
      }

      setUser(null);
      router.replace("/");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-white/5 bg-[#070707]/85 px-6 py-5 backdrop-blur-xl lg:px-10">
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
        {checkingSession ? (
          <span
            aria-label="Checking sign-in status"
            className="h-9 w-16 animate-pulse rounded-full border border-white/10 bg-white/5"
          />
        ) : user ? (
          <>
            <Link
              href="/profile"
              aria-label="Your profile"
              title="Your profile"
              className={`${actionClass} flex h-10 w-10 items-center justify-center px-0! py-0!`}
            >
              <UserRound size={18} strokeWidth={1.8} />
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className={actionClass}
            >
              {loggingOut ? "Signing out…" : "Logout"}
            </button>
          </>
        ) : (
          <Link href="/login" className={actionClass}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
