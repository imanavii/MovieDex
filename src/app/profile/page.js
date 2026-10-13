
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Navbar from "@/components/layout/Navbar";
import { UserRound, ArrowLeft, Save } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      const supabase = createClient();

      try {
        const {
          data: { user: currentUser },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) throw authError;

        if (!currentUser) {
          router.replace("/login?next=%2Fprofile");
          return;
        }

        if (!active) return;
        setUser(currentUser);

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("display_name, bio, avatar_url")
          .eq("id", currentUser.id)
          .maybeSingle();

        if (profileError) throw profileError;

        if (!active) return;

        if (profile) {
          setDisplayName(profile.display_name ?? "");
          setBio(profile.bio ?? "");
          setAvatarUrl(profile.avatar_url ?? "");
        } else {
          const initialName = currentUser.user_metadata?.display_name
            || currentUser.user_metadata?.full_name
            || currentUser.email?.split("@")[0]
            || "";

          const { error: insertError } = await supabase
            .from("profiles")
            .insert({
              id: currentUser.id,
              display_name: initialName,
              bio: "",
            });

          if (insertError) throw insertError;
          if (!active) return;

          setDisplayName(initialName);
        }
      } catch (err) {
        console.error("Failed to load profile:", err);

        if (active) {
          setError("Couldn't load your profile. Please try again.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, [router]);

  async function handleSave(event) {
    event.preventDefault();

    if (!user || saving) return;

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const supabase = createClient();

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          display_name: displayName.trim(),
          bio: bio.trim(),
          avatar_url: avatarUrl.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setMessage("Profile updated successfully.");
    } catch (err) {
      console.error("Failed to save profile:", err);
      setError("Couldn't save your changes. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#070707] text-white">
      <Navbar />

      <section className="mx-auto max-w-3xl px-6 pb-20 pt-32">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to MovieDex
        </Link>

        <div className="mt-8">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
            Your MovieDex
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Your Profile
          </h1>

          <p className="mt-3 text-sm text-zinc-400">
            Manage your account and personalize your movie experience.
          </p>
        </div>

        {loading ? (
          <div className="mt-10 animate-pulse rounded-2xl border border-white/10 bg-white/3 p-8">
            <div className="h-14 w-14 rounded-full bg-white/10" />
            <div className="mt-6 h-4 w-40 rounded bg-white/10" />
            <div className="mt-4 h-12 rounded-xl bg-white/5" />
            <div className="mt-4 h-24 rounded-xl bg-white/5" />
          </div>
        ) : error && !user ? (
          <div className="mt-10 rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
            <p role="alert" className="text-sm text-red-300">
              {error}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 rounded-full border border-white/15 px-4 py-2 text-sm hover:bg-white/10"
            >
              Try again
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSave}
            className="mt-10 rounded-2xl border border-white/10 bg-white/3 p-6 sm:p-8"
          >
            <div className="flex items-center gap-4 border-b border-white/10 pb-6">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/5">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Profile avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserRound size={28} className="text-zinc-400" />
                )}
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-lg font-semibold">
                  {displayName || "MovieDex Member"}
                </h2>
                <p className="mt-1 truncate text-sm text-zinc-400">
                  {user?.email}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-6">
              <div>
                <label
                  htmlFor="displayName"
                  className="mb-2 block text-sm font-medium text-zinc-300"
                >
                  Display name
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  maxLength={60}
                  required
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-600 focus:border-white/30"
                  placeholder="What should we call you?"
                />
              </div>

              <div>
                <label
                  htmlFor="bio"
                  className="mb-2 block text-sm font-medium text-zinc-300"
                >
                  About you
                </label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                  maxLength={300}
                  rows={4}
                  className="w-full resize-y rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-600 focus:border-white/30"
                  placeholder="Tell us about your movie taste..."
                />
                <p className="mt-2 text-right text-xs text-zinc-500">
                  {bio.length}/300
                </p>
              </div>

              <div>
                <label
                  htmlFor="avatarUrl"
                  className="mb-2 block text-sm font-medium text-zinc-300"
                >
                  Avatar image URL <span className="text-zinc-500">(optional)</span>
                </label>
                <input
                  id="avatarUrl"
                  type="url"
                  value={avatarUrl}
                  onChange={(event) => setAvatarUrl(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-600 focus:border-white/30"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
            </div>

            {error && (
              <p role="alert" className="mt-5 text-sm text-red-300">
                {error}
              </p>
            )}

            {message && (
              <p role="status" className="mt-5 text-sm text-emerald-300">
                {message}
              </p>
            )}

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save size={16} />
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}
