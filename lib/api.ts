import type { MovieDetails, MoviesResponse } from "@/types"

const API_KEY = process.env.TMDB_API_KEY || "YOUR_TMDB_API_KEY"
const BASE_URL = "https://api.themoviedb.org/3"

/**
 * Fetches popular movies with optional search query
 */
export async function getPopularMovies(page = 1, query = ""): Promise<MoviesResponse> {
  const endpoint = query
    ? `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
    : `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`

  const response = await fetch(endpoint, { next: { revalidate: 3600 } }) // Cache for 1 hour

  if (!response.ok) {
    throw new Error(`Failed to fetch movies: ${response.status}`)
  }

  return response.json()
}

/**
 * Fetches details for a specific movie
 */
export async function getMovieDetails(id: string): Promise<MovieDetails | null> {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=credits,videos`,
      { next: { revalidate: 86400 } }, // Cache for 24 hours
    )

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`Failed to fetch movie details: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error(`Error fetching movie ${id}:`, error)
    return null
  }
}
