import type { MovieDetails, MoviesResponse } from "@/types"

const API_KEY = process.env.TMDB_API_KEY
const BASE_URL = "https://api.themoviedb.org/3"

if (!API_KEY) {
  throw new Error("TMDB_API_KEY is not defined in environment")
}

const defaultHeaders = {
  Authorization: `Bearer ${API_KEY}`,
  "Content-Type": "application/json",
}

/**
 * Fetches popular movies with optional search query
 */
export async function getPopularMovies(page = 1, query = ""): Promise<MoviesResponse> {
  const endpoint = query
    ? `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}`
    : `${BASE_URL}/movie/popular?page=${page}`

  const response = await fetch(endpoint, {
    headers: defaultHeaders,
    next: { revalidate: 3600 },
  })

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
      `${BASE_URL}/movie/${id}?append_to_response=credits,videos`,
      {
        headers: defaultHeaders,
        next: { revalidate: 86400 },
      },
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
