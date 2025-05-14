import { Suspense } from "react"
import MovieList from "@/components/movie-list"
import SearchBar from "@/components/search-bar"
import { MovieListSkeleton } from "@/components/skeletons"

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900 dark:text-white">Popular Movies</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">Discover the most popular movies right now</p>

        <SearchBar />

        <Suspense fallback={<MovieListSkeleton />}>
          <MovieList />
        </Suspense>
      </div>
    </main>
  )
}
