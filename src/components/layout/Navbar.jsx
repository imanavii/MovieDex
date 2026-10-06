import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="absolute left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-6 lg:px-10">
      <Link
        href="/"
        className="text-xl font-semibold tracking-tight text-white"
      >
        Movie<span className="text-zinc-500">Dex</span>
      </Link>

      <div className="hidden items-center gap-8 md:flex">
        <Link href="/" className="text-sm text-zinc-300 hover:text-white">
          Home
        </Link>

        <Link
          href="/discover"
          className="text-sm text-zinc-500 hover:text-white"
        >
          Discover
        </Link>

        <Link
          href="/watchlist"
          className="text-sm text-zinc-500 hover:text-white"
        >
          Watchlist
        </Link>

        <Link
          href="/favorites"
          className="text-sm text-zinc-500 hover:text-white"
        >
          Favorites
        </Link>
      </div>

      <Link
        href="/login"
        className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 backdrop-blur-md hover:bg-white/10 hover:text-white"
      >
        Login
      </Link>
    </nav>
  );
}