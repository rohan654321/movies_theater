"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const currentQuery = searchParams.get("query") || ""
  const [query, setQuery] = useState(currentQuery)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    startTransition(() => {
      if (query) {
        router.push(`/?query=${encodeURIComponent(query)}`)
      } else {
        router.push("/")
      }
    })
  }

  const clearSearch = () => {
    setQuery("")
    startTransition(() => {
      router.push("/")
    })
  }

  return (
    <form onSubmit={handleSearch} className="relative">
      <div className="relative flex items-center">
        <Search className="absolute left-3 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search for movies..."
          value={query}
          onChange={(e: { target: { value: React.SetStateAction<string> } }) => setQuery(e.target.value)}
          className="pl-10 pr-16 h-12 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg"
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={clearSearch}
            className="absolute right-14 h-5 w-5 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
        <Button type="submit" className="absolute right-1 mr-1" disabled={isPending}>
          Search
        </Button>
      </div>
    </form>
  )
}
