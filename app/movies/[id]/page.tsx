import { Suspense } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Clock, Calendar, Star } from "lucide-react"
import { getMovieDetails } from "@/lib/api"
import { MovieDetailsSkeleton } from "@/components/skeletons"
import { Button } from "@/components/ui/button"
import { formatRuntime, formatDate } from "@/lib/utiles"

// Define the params type for this page
type MoviePageParams = {
  id: string
}

export async function generateStaticParams() {
  return [] // Empty because this is for typing purposes, no pre-rendering
}

// Await the params before using it
export default async function MovieDetailsPage({ params }: { params: MoviePageParams }) {
  // Await params here to avoid the error
  const { id } = await params // Awaiting the dynamic params

  if (!id || isNaN(Number(id))) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Suspense fallback={<MovieDetailsSkeleton />}>
        <MovieDetails id={id} />
      </Suspense>
    </main>
  )
}

async function MovieDetails({ id }: { id: string }) {
  const movie = await getMovieDetails(id)

  if (!movie) {
    notFound()
  }

  return (
    <div>
      {/* Backdrop Image */}
      <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px]">
        {movie.backdrop_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-32 relative z-10">
        <Link href="/">
          <Button variant="outline" size="sm" className="mb-4">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Movies
          </Button>
        </Link>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0 w-full md:w-1/3 lg:w-1/4">
            <div className="rounded-lg overflow-hidden shadow-lg">
              {movie.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  width={500}
                  height={750}
                  className="w-full h-auto"
                />
              ) : (
                <div className="w-full aspect-[2/3] bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{movie.title}</h1>

            <div className="flex flex-wrap gap-4 mb-6 text-gray-300">
              {movie.release_date && (
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{formatDate(movie.release_date)}</span>
                </div>
              )}
              {movie.runtime && (
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{formatRuntime(movie.runtime)}</span>
                </div>
              )}
              {movie.vote_average > 0 && (
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1 text-yellow-400" />
                  <span>{movie.vote_average.toFixed(1)}/10</span>
                </div>
              )}
            </div>

            {movie.genres && movie.genres.length > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <span key={genre.id} className="px-3 py-1 bg-gray-800 text-gray-200 rounded-full text-sm">
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {movie.tagline && <p className="text-xl italic text-gray-300 mb-4">"{movie.tagline}"</p>}

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-2">Overview</h2>
              <p className="text-gray-300">{movie.overview || "No overview available."}</p>
            </div>

            {movie.production_companies && movie.production_companies.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">Production</h2>
                <div className="text-gray-300">
                  {movie.production_companies.map((company) => company.name).join(", ")}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
