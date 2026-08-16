export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-5">
      {/* Logo */}
      <h1 className="text-2xl font-bold tracking-wide">
        MovieDex
      </h1>

      {/* Navigation */}
      <div className="flex items-center gap-8">
        <a href="/" className="text-sm">
          Home
        </a>

        <a href="/discover" className="text-sm">
          Discover
        </a>

        <a href="/genres" className="text-sm">
          Genres
        </a>

        <a href="/watchlist" className="text-sm">
          Watchlist
        </a>

        <a href="/favorites" className="text-sm">
          Favorites
        </a>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <a href="/search" className="text-sm">
          Search
        </a>

        <a href="/login" className="text-sm">
          Login
        </a>
      </div>
    </nav>
  );
}
