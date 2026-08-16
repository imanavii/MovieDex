import { getPopularMovies } from "@/lib/tmdb/movies";

export async function GET() {
  try {
    const data = await getPopularMovies();

    return Response.json({
      success: true,
      count: data.results?.length ?? 0,
      firstMovie: data.results?.[0] ?? null,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}