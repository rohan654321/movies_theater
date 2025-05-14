"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useInView } from "react-intersection-observer"
import MovieCard from "./movie-card"
import { getPopularMovies } from "@/lib/api"
import type { Movie } from "@/types"
import { Loader2 } from "lucide-react"

export default function MovieList() {
  const searchParams = useSearchParams()
  const query = searchParams.get("query")

  const [movies, setMovies] = useState<Movie[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const { ref, inView } = useInView()

  // Reset when search query changes
  useEffect(() => {
    setMovies([])
    setPage(1)
    setHasMore(true)
  }, [query])

  // Fetch movies
  useEffect(() => {
    if (!hasMore || isLoading) return

    const fetchMovies = async () => {
      setIsLoading(true)
      try {
        const data = await getPopularMovies(page, query || "")

        if (data.results.length === 0) {
          setHasMore(false)
        } else {
          setMovies((prev) => {
            // Filter out duplicates
            const newMovies = data.results.filter((movie) => !prev.some((m) => m.id === movie.id))
            return [...prev, ...newMovies]
          })
          setHasMore(page < data.total_pages)
        }
      } catch (error) {
        console.error("Error fetching movies:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMovies()
  }, [page, query, hasMore, isLoading])

  // Load more when scrolled to bottom
  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      setPage((prev) => prev + 1)
    }
  }, [inView, hasMore, isLoading])

  if (movies.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">No movies found</h2>
        <p className="text-gray-600 dark:text-gray-400">
          {query ? `No results for "${query}". Try a different search term.` : "No movies available at the moment."}
        </p>
      </div>
    )
  }

  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {/* Loading indicator */}
      {hasMore && (
        <div ref={ref} className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500 dark:text-gray-400" />
        </div>
      )}
    </div>
  )
}
