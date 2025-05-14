import Link from "next/link"
import Image from "next/image"
import { Calendar } from "lucide-react"
import type { Movie } from "@/types"
import { formatYear } from "@/lib/utiles"

interface MovieCardProps {
  movie: Movie
}

export default function MovieCard({ movie }: MovieCardProps) {
  const releaseYear = movie.release_date ? formatYear(movie.release_date) : "Unknown"

  return (
    <Link href={`/movies/${movie.id}`}>
      <div className="group h-full flex flex-col overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm transition-all hover:shadow-md">
        <div className="relative aspect-[2/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
          {movie.poster_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
          )}
        </div>

        <div className="flex flex-col flex-grow p-4">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 mb-1">{movie.title}</h3>

          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            <span>{releaseYear}</span>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 flex-grow">
            {movie.overview || "No description available."}
          </p>
        </div>
      </div>
    </Link>
  )
}
