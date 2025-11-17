"use client"

import { Search } from "lucide-react"
import { useState, useEffect } from "react"

interface RequestSearchProps {
  onSearch: (query: string) => void
  placeholder?: string
}

export default function RequestSearch({
  onSearch,
  placeholder = "Search requests..."
}: RequestSearchProps) {
  const [query, setQuery] = useState("")

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(query)
    }, 500) // Debounce search by 500ms

    return () => clearTimeout(timeoutId)
  }, [query, onSearch])

  return (
    <div className="relative w-full sm:max-w-md max-sm:items-center max-sm:justify-center">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gray-400" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value.toLocaleLowerCase())}
        placeholder={placeholder}
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
      />
    </div>
  )
}
