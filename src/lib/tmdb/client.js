const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export async function tmdbFetch(endpoint, options = {}) {
  const response = await fetch(
    `${TMDB_BASE_URL}${endpoint}${endpoint.includes("?") ? "&" : "?"}api_key=${process.env.TMDB_API_KEY}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status}`);
  }

  return response.json();
}